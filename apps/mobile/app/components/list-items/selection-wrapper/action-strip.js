import Clipboard from "@react-native-clipboard/clipboard";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { openVault, ToastEvent } from "../../../services/event-manager";
import Navigation from "../../../services/navigation";
import { useSelectionStore } from "../../../stores/use-selection-store";
import { useTrashStore } from "../../../stores/use-trash-store";
import { useMenuStore } from "../../../stores/use-menu-store";
import { useNotebookStore } from "../../../stores/use-notebook-store";
import { useThemeStore } from "../../../stores/use-theme-store";
import { dWidth, getElevation, toTXT } from "../../../utils";
import { db } from "../../../common/database";
import { deleteItems } from "../../../utils/functions";
import { presentDialog } from "../../dialog/functions";
import { Button } from "../../ui/button";
import { IconButton } from "../../ui/icon-button";

export const ActionStrip = ({ note, setActionStrip }) => {
  const colors = useThemeStore((state) => state.colors);
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const setNotebooks = useNotebookStore((state) => state.setNotebooks);
  const setMenuPins = useMenuStore((state) => state.setMenuPins);
  const setSelectedItem = useSelectionStore((state) => state.setSelectedItem);
  const setSelectionMode = useSelectionStore((state) => state.setSelectionMode);

  const [isPinnedToMenu, setIsPinnedToMenu] = useState(false);
  const [width, setWidth] = useState(dWidth - 16);
  useEffect(() => {
    if (note.type === "note") return;
    setIsPinnedToMenu(db.settings.isPinned(note.id));
  }, []);

  const updateNotes = () => {
    Navigation.queueRoutesForUpdate(
      "Notes",
      "Favorites",
      "ColoredNotes",
      "TaggedNotes",
      "TopicNotes"
    );
  };

  const actions = [
    {
      title: "Pin " + note.type,
      icon: note.pinned ? "pin-off" : "pin",
      visible: note.type === "note" || note.type === "notebook",
      onPress: async () => {
        if (!note.id) return;

        if (note.type === "note") {
          if (db.notes.pinned.length === 3 && !note.pinned) {
            ToastEvent.show({
              heading: "Cannot pin more than 3 notes",
              type: "error"
            });
            return;
          }
          await db.notes.note(note.id).pin();
        } else {
          if (db.notebooks.pinned.length === 3 && !note.pinned) {
            ToastEvent.show({
              heading: "Cannot pin more than 3 notebooks",
              type: "error"
            });
            return;
          }
          await db.notebooks.notebook(note.id).pin();
          setNotebooks();
        }
        updateNotes();
        setActionStrip(false);
      }
    },
    {
      title: "Add to favorites",
      icon: note.favorite ? "star-off" : "star",
      onPress: async () => {
        if (!note.id) return;
        if (note.type === "note") {
          await db.notes.note(note.id).favorite();
        } else {
          await db.notebooks.notebook(note.id).favorite();
        }
        updateNotes();
        setActionStrip(false);
      },
      visible: note.type === "note",
      color: !note.favorite ? "orange" : null
    },

    {
      title: isPinnedToMenu
        ? "Remove Shortcut from Menu"
        : "Add Shortcut to Menu",
      icon: isPinnedToMenu ? "link-variant-remove" : "link-variant",
      onPress: async () => {
        try {
          if (isPinnedToMenu) {
            await db.settings.unpin(note.id);
            ToastEvent.show({
              heading: "Shortcut removed from menu",
              type: "success"
            });
          } else {
            if (note.type === "topic") {
              await db.settings.pin(note.type, {
                id: note.id,
                notebookId: note.notebookId
              });
            } else {
              await db.settings.pin(note.type, { id: note.id });
            }
            ToastEvent.show({
              heading: "Shortcut added to menu",
              type: "success"
            });
          }
          setIsPinnedToMenu(db.settings.isPinned(note.id));
          setMenuPins();

          setActionStrip(false);
        } catch (e) {}
      },
      visible: note.type !== "note"
    },
    {
      title: "Copy Note",
      icon: "content-copy",
      visible: note.type === "note",
      onPress: async () => {
        if (note.locked) {
          openVault({
            copyNote: true,
            novault: true,
            locked: true,
            item: note,
            title: "Copy note",
            description: "Unlock note to copy to clipboard."
          });
        } else {
          let text = await toTXT(note);
          text = `${note.title}\n \n ${text}`;
          Clipboard.setString(text);
          ToastEvent.show({
            heading: "Note copied to clipboard",
            type: "success"
          });
        }
        setActionStrip(false);
      }
    },
    {
      title: "Restore " + note.itemType,
      icon: "delete-restore",
      onPress: async () => {
        await db.trash.restore(note.id);
        Navigation.queueRoutesForUpdate(
          "Notes",
          "Favorites",
          "ColoredNotes",
          "TaggedNotes",
          "TopicNotes",
          "Trash",
          "Notebooks"
        );

        ToastEvent.show({
          heading:
            note.type === "note"
              ? "Note restored from trash"
              : "Notebook restored from trash",
          type: "success"
        });

        setActionStrip(false);
      },
      visible: note.type === "trash"
    },
    {
      title: "Delete" + note.itemType,
      icon: "delete",
      visible: note.type === "trash",
      onPress: () => {
        presentDialog({
          title: `Permanent delete`,
          paragraph: `Are you sure you want to delete this ${note.itemType} permanantly from trash?`,
          positiveText: "Delete",
          negativeText: "Cancel",
          positivePress: async () => {
            await db.trash.delete(note.id);
            useTrashStore.getState().setTrash();
            useSelectionStore.getState().setSelectionMode(false);
            ToastEvent.show({
              heading: "Permanantly deleted items",
              type: "success",
              context: "local"
            });
          },
          positiveType: "errorShade"
        });
        setActionStrip(false);
      }
    },
    {
      title: "Delete" + note.type,
      icon: "delete",
      visible: note.type !== "trash",
      onPress: async () => {
        try {
          await deleteItems(note);
        } catch (e) {}
        setActionStrip(false);
      }
    },
    {
      title: "Close",
      icon: "close",
      onPress: () => setActionStrip(false),
      color: colors.light,
      bg: colors.red,
      visible: true
    }
  ];

  return (
    <Animated.View
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
      entering={SlideInUp.springify().mass(0.4)}
      exiting={SlideOutDown}
      style={{
        position: "absolute",
        zIndex: 999,
        width: "102%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
      }}
    >
      <Button
        type="accent"
        title="Select"
        icon="check"
        tooltipText="Select Item"
        onPress={(event) => {
          if (!selectionMode) {
            setSelectionMode(true);
          }
          setSelectedItem(note);
          setActionStrip(false);
        }}
        style={{
          borderRadius: 100,
          paddingHorizontal: 12,
          ...getElevation(5)
        }}
        height={30}
      />
      {actions.map((item) =>
        item.visible ? (
          <View
            key={item.icon}
            style={{
              width: width / 1.4 / actions.length,
              height: width / 1.4 / actions.length,
              backgroundColor: item.bg || colors.nav,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              ...getElevation(5),
              marginLeft: 15
            }}
          >
            <IconButton
              color={item.color || colors.heading}
              onPress={item.onPress}
              tooltipText={item.title}
              top={60}
              bottom={60}
              name={item.icon}
              size={width / 2.8 / actions.length}
            />
          </View>
        ) : null
      )}
    </Animated.View>
  );
};