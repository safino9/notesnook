/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2022 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import Collection from "./collection";
import Note from "../models/note";
import getId from "../utils/id";
import { getContentFromData } from "../content-types";
import qclone from "qclone/src/qclone";
import { deleteItem } from "../utils/array";

export default class Notes extends Collection {
  async merge(remoteNote) {
    if (!remoteNote) return;

    const id = remoteNote.id;
    const localNote = this._collection.getItem(id);
    if (localNote) {
      if (localNote.color) await this._db.colors.untag(localNote.color, id);

      for (let tag of localNote.tags || []) {
        await this._db.tags.untag(tag, id);
      }
    }

    if (remoteNote.deleted) return await this._collection.addItem(remoteNote);

    await this._resolveColorAndTags(remoteNote);

    return await this._collection.addItem(remoteNote);
  }

  async add(noteArg) {
    if (!noteArg) return;
    if (noteArg.remote)
      throw new Error("Please use db.notes.merge to merge remote notes.");

    let id = noteArg.id || getId();
    let oldNote = this._collection.getItem(id);

    let note = {
      ...oldNote,
      ...noteArg
    };

    if (oldNote) note.contentId = oldNote.contentId;

    if (!oldNote && !noteArg.content && !noteArg.contentId && !noteArg.title)
      return;

    if (noteArg.content && noteArg.content.data && noteArg.content.type) {
      const { type, data } = noteArg.content;

      let content = getContentFromData(type, data);
      if (!content) throw new Error("Invalid content type.");

      note.contentId = await this._db.content.add({
        noteId: id,
        sessionId: note.sessionId,
        id: note.contentId,
        type,
        data,
        localOnly: !!note.localOnly
      });

      note.headline = getNoteHeadline(note, content);
      if (oldNote) note.dateEdited = Date.now();
    }

    if (noteArg.localOnly !== undefined) {
      await this._db.content.add({
        id: note.contentId,
        localOnly: !!noteArg.localOnly
      });
    }

    const noteTitle = getNoteTitle(note, oldNote);
    if (oldNote && oldNote.title !== noteTitle) note.dateEdited = Date.now();

    note = {
      id,
      contentId: note.contentId,
      type: "note",

      title: noteTitle,
      headline: note.headline,

      tags: note.tags || [],
      notebooks: note.notebooks || undefined,
      color: note.color,

      pinned: !!note.pinned,
      locked: !!note.locked,
      favorite: !!note.favorite,
      localOnly: !!note.localOnly,
      conflicted: !!note.conflicted,
      readonly: !!note.readonly,

      dateCreated: note.dateCreated,
      dateEdited: note.dateEdited || note.dateCreated || Date.now(),
      dateModified: note.dateModified
    };

    await this._collection.addItem(note);

    await this._resolveColorAndTags(note);
    await this._resolveNotebooks(note);
    return note.id;
  }

  /**
   *
   * @param {string} id The id of note
   * @returns {Note} The note of the given id
   */
  note(id) {
    if (!id) return;
    let note = id.type ? id : this._collection.getItem(id);
    if (!note || note.deleted) return;
    return new Note(note, this._db);
  }

  get raw() {
    return this._collection.getRaw();
  }

  get all() {
    const items = this._collection.getItems();
    return items;
  }

  get pinned() {
    return this.all.filter((item) => item.pinned === true);
  }

  get conflicted() {
    return this.all.filter((item) => item.conflicted === true);
  }

  get favorites() {
    return this.all.filter((item) => item.favorite === true);
  }

  get deleted() {
    return this.raw.filter((item) => item.dateDeleted > 0);
  }

  get locked() {
    return this.all.filter((item) => item.locked === true);
  }

  tagged(tagId) {
    return this._getTagItems(tagId, "tags");
  }

  colored(colorId) {
    return this._getTagItems(colorId, "colors");
  }

  exists(id) {
    return this._collection.exists(id);
  }

  /**
   * @private
   */
  _getTagItems(tagId, collection) {
    const tag = this._db[collection].tag(tagId);
    if (!tag || tag.noteIds.length <= 0) return [];
    const array = tag.noteIds.reduce((arr, id) => {
      const item = this.note(id);
      if (item) arr.push(item.data);
      return arr;
    }, []);
    return array.sort((a, b) => b.dateCreated - a.dateCreated);
  }

  delete(...ids) {
    return this._delete(true, ...ids);
  }

  remove(...ids) {
    return this._delete(false, ...ids);
  }

  /**
   * @private
   */
  async _delete(moveToTrash = true, ...ids) {
    for (let id of ids) {
      let item = this.note(id);
      if (!item) continue;
      const itemData = qclone(item.data);

      if (itemData.notebooks) {
        for (let notebook of itemData.notebooks) {
          const notebookRef = this._db.notebooks.notebook(notebook.id);
          if (!notebookRef) continue;

          for (let topicId of notebook.topics) {
            const topic = notebookRef.topics.topic(topicId);
            if (!topic) continue;

            await topic.delete(id);
          }
        }
      }

      for (let tag of itemData.tags) {
        await this._db.tags.untag(tag, id);
      }

      if (itemData.color) {
        await this._db.colors.untag(itemData.color, id);
      }

      const attachments = this._db.attachments.ofNote(itemData.id, "all");
      for (let attachment of attachments) {
        await this._db.attachments.delete(
          attachment.metadata.hash,
          itemData.id
        );
      }

      // await this._collection.removeItem(id);
      if (moveToTrash) await this._db.trash.add(itemData);
      else {
        await this._collection.removeItem(id);
        await this._db.content.remove(itemData.contentId);
      }
    }
  }

  async move(to, ...noteIds) {
    if (!to) throw new Error("The destination notebook cannot be undefined.");
    if (!to.id || !to.topic)
      throw new Error(
        "The destination notebook must contain notebookId and topic."
      );
    let topic = this._db.notebooks.notebook(to.id).topics.topic(to.topic);
    if (!topic) throw new Error("No such topic exists.");
    await topic.add(...noteIds);
  }

  async repairReferences(notes) {
    notes = notes || this.all;
    for (let note of notes) {
      const { notebooks } = note;
      if (!notebooks) continue;

      for (let notebook of notebooks) {
        const nb = this._db.notebooks.notebook(notebook.id);

        if (nb) {
          for (let topic of notebook.topics) {
            const _topic = nb.topics.topic(topic);
            if (!_topic || !_topic.has(note.id)) {
              deleteItem(notebook.topics, topic);
              await this.add(note);
              continue;
            }
          }
        }

        if (!nb || !notebook.topics.length) {
          deleteItem(notebooks, notebook);
          await this.add(note);
          continue;
        }
      }
    }
  }

  async _resolveColorAndTags(note) {
    const { color, tags, id } = note;

    if (color) {
      const { title } = await this._db.colors.add(color, id);
      note.color = title;
    }

    if (tags && tags.length) {
      for (let i = 0; i < tags.length; ++i) {
        const tag = tags[i];
        const addedTag = await this._db.tags.add(tag, id).catch(() => void 0);
        if (!addedTag) {
          tags.splice(i, 1);
          continue;
        }
        if (addedTag.title !== tag) tags[i] = addedTag.title;
      }
    }
  }

  async _resolveNotebooks(note) {
    const { notebooks, id } = note;
    if (!notebooks) return;

    for (const notebook of notebooks) {
      const nb = this._db.notebooks.notebook(notebook.id);
      if (!nb) continue;
      for (const topic of notebook.topics) {
        await this.move({ id: notebook.id, topic }, id);
      }
    }
  }
}

function getNoteHeadline(note, content) {
  if (note.locked) return "";
  return content.toHeadline();
}

const NEWLINE_STRIP_REGEX = /[\r\n\t\v]+/gm;
function getNoteTitle(note, oldNote) {
  if (note.title && note.title.trim().length > 0) {
    return note.title.replace(NEWLINE_STRIP_REGEX, " ");
  } else if (oldNote && oldNote.title && oldNote.title.trim().length > 0) {
    return oldNote.title.replace(NEWLINE_STRIP_REGEX, " ");
  }

  return `Note ${new Date().toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short"
  })}`;
}
