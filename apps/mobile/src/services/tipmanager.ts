import { useEffect, useRef, useState } from 'react';
import { MMKV } from '../utils/database/mmkv';

//@ts-ignore
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

export type TipButton = {
  title: string;
  type?: string;
  action: string;
  icon?: string;
};
type Context =
  | 'list'
  | 'notes'
  | 'notebooks'
  | 'notebook'
  | 'tags'
  | 'open-editor'
  | 'exit-editor'
  | 'sidemenu'
  | 'properties'
  | 'first-note'
  | 'first-editor-launch'
  | 'monographs'
  | 'trash'
  | 'topics';

export type TTip = {
  text: string;
  contexts: Context[];
  image?: string;
  button?: TipButton;
};

export type Popup = {
  id: string;
  text: string;
};

const destructiveContexts = ['first-note'];

let tipState: { [name: string]: boolean } = {};
let popState: { [name: string]: boolean } = {};

export class TipManager {
  static async init() {
    let tipStateJson = await MMKV.getItem('tipState');
    if (tipStateJson) {
      tipState = JSON.parse(tipStateJson);
    } else {
      //@ts-ignore
      tipState = {};
    }

    let popStateJson = await MMKV.getItem('popupState');
    if (popStateJson) {
      popState = JSON.parse(popStateJson);
    } else {
      //@ts-ignore
      popState = {};
    }
    console.log('tipState:', tipState, 'popupState:', popState);
  }

  static tip(context: Context) {
    if (destructiveContexts.indexOf(context) > -1) {
      //@ts-ignore
      if (tipState[context]) return;
      //@ts-ignore
      tipState[context] = true;
      MMKV.setItem('tipState', JSON.stringify(tipState));
    }

    let tipsForCtx = tips.filter(tip => tip.contexts.indexOf(context) > -1);

    //@ts-ignore
    return tipsForCtx.sample();
  }

  static popup(id: string) {
    let pop = popups.find(p => p.id === id);
    //@ts-ignore
    //  if (popState[id]) return null;

    return pop;
  }

  static markPopupUsed(id: string) {
    //@ts-ignore
    popState[id] = true;
    MMKV.setItem('popupState', JSON.stringify(popState));
  }

  static placeholderTip() {
    //@ts-ignore
    return placeholderTips.sample();
  }
}

export const useTip = (
  context: Context,
  fallback: Context,
  options: {
    rotate: boolean;
    delay: number;
  }
) => {
  const [tip, setTip] = useState(TipManager.tip(context) || TipManager.tip(fallback));
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    setTip(TipManager.tip(context) || TipManager.tip(fallback));

    if (options?.rotate) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTip(TipManager.tip(context) || TipManager.tip(fallback));
      }, options.delay || 5000);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [context, fallback]);

  return tip;
};

const tips: TTip[] = [
  {
    text: 'You can swipe left anywhere in the app to start a new note',
    contexts: ['notes', 'first-note']
  },
  {
    text: 'Long press on any item in list to open quick actions menu.',
    contexts: ['notes', 'notebook', 'notebook', 'tags', 'topics']
  },
  {
    text: 'Monographs enable you to share your notes in a secure and private way',
    contexts: ['monographs']
  },
  {
    text: 'Monographs can be encrypted with a secret key and shared with anyone',
    contexts: ['monographs']
  },
  {
    text: 'Frequently accessed notebooks can be pinned to Side Menu so that they are easily accessible',
    contexts: ['notebook', 'notebooks']
  },
  {
    text: 'A notebook can have unlimited topics with unlimited notes.',
    contexts: ['notebook', 'topics']
  },
  {
    text: 'You can multi-select notes and move them to a notebook at once',
    contexts: ['notebook', 'topics']
  },
  {
    text: 'Items in trash are kept for 7 days after which they are permanently deleted.',
    contexts: ['trash']
  },
  {
    text: 'Mark important notes by adding them to favorites',
    contexts: ['notes']
  },
  {
    text: 'Have to scroll down a lot to open a note you are working on? Pin it to top from properties.',
    contexts: ['notes']
  }
];

const popups: Popup[] = [
  {
    id: 'sortmenu',
    text: 'Tap here to change sorting'
  },
  {
    id: 'jumpto',
    text: 'Tap here to jump to a section'
  },
  {
    id: 'compactmode',
    text: 'Try compact mode to fit more items on screen'
  },
  {
    id: 'searchreplace',
    text: 'Switch to search/replace mode'
  },
  {
    id: 'notebookshortcut',
    text: 'Create shortcut of this notebook in side menu'
  }
];

const placeholderTips = [
  `Want to remember something\? Pin an important note in notifications.`,
  `Privacy is power. What people don\'t know they cant ruin`,
  `If you read someone else\'s diary, you get what you deserve. - David Sedaris`,
  'Take quick notes from notifications. Enable the option in Settings to try',
  'Get Notesnook on all your devices. Or even open it in browser by going to https://app.notesnook.com to access all your notes',
  `With note history, you can restore back to an older version of the note if you accidently deleted something.`,
  `When your heart speaks\, take good notes. - Judith Campbell`,
  "You can publish a note and share it with anyone. Even if they don't use Notesnook!",
  'Published notes can be encrypted. Which means only you and the person you share the password with can read them.',
  'You can change default font size from editor settings at the end of toolbar',
  'The editor toolbar can be scrolled horizontally to add more formats and blocks',
  `To be left alone is the most precious thing one can ask of the modern world. - Anthony Burgess`,
  `Arguing that you don't care about the right to privacy because you have nothing to hide is no different than saying you don't care about free speech because you have nothing to say.” ― Edward Snowden `,
  `Privacy is not something that I'm merely entitled to, it's an absolute prerequisite.” ― Marlon Brando `,
  `You can disable syncing on notes you don't want to be synced or stored anywhere other than your phone.`,
  `We value your feedback so join us on Discord/Telegram and share your experiences and ideas. Let's build the best (and private) note taking app together.`,
  `You can view & restore older versions of a note if you delete something accidentally by going to Note properties -> History`
];
