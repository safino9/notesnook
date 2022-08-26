import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeStore } from "../../stores/use-theme-store";
import { presentSheet } from "../../services/event-manager";
import { db } from "../../common/database";
import { openLinkInBrowser } from "../../utils/functions";
import { SIZE } from "../../utils/size";
import { timeConverter, timeSince } from "../../utils/time";
import DialogHeader from "../dialog/dialog-header";
import SheetProvider from "../sheet-provider";
import { PressableButton } from "../ui/pressable";
import Seperator from "../ui/seperator";
import Paragraph from "../ui/typography/paragraph";
import NotePreview from "./preview";

export default function NoteHistory({ note, fwdRef }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = useThemeStore((state) => state.colors);

  useEffect(() => {
    (async () => {
      setHistory([...(await db.noteHistory.get(note.id))]);
      setLoading(false);
    })();
  }, []);

  async function preview(item) {
    let content = await db.noteHistory.content(item.id);

    presentSheet({
      component: (
        <NotePreview
          session={{
            ...item,
            session: getDate(item.dateCreated, item.dateModified)
          }}
          content={content}
        />
      ),
      context: "note_history"
    });
  }

  const getDate = (start, end) => {
    let _start = timeConverter(start);
    let _end = timeConverter(end + 60000);
    if (_start === _end) return _start;
    let final = _end.lastIndexOf(",");
    let part = _end.slice(0, final + 1);
    if (_start.includes(part)) {
      return _start + " —" + _end.replace(part, "");
    }
    return _start + " — " + _end;
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <PressableButton
        type="grayBg"
        onPress={() => preview(item)}
        customStyle={{
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          height: 45,
          marginBottom: 10,
          flexDirection: "row"
        }}
      >
        <Paragraph>{getDate(item.dateCreated, item.dateModified)}</Paragraph>
        <Paragraph color={colors.icon} size={SIZE.xs}>
          {timeSince(item.dateModified)}
        </Paragraph>
      </PressableButton>
    ),
    []
  );

  return (
    <View>
      <SheetProvider context="note_history" />
      <DialogHeader
        title="Note history"
        paragraph="Revert back to an older version of this note"
        padding={12}
      />

      <Seperator />

      <FlatList
        onMomentumScrollEnd={() => {
          fwdRef?.current?.handleChildScrollEnd();
        }}
        style={{
          paddingHorizontal: 12
        }}
        keyExtractor={(item) => item.id}
        data={history}
        ListEmptyComponent={
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: 200
            }}
          >
            <Icon name="history" size={60} color={colors.icon} />
            <Paragraph color={colors.icon}>
              No note history found on this device.
            </Paragraph>
          </View>
        }
        renderItem={renderItem}
      />
      <Paragraph
        size={SIZE.xs}
        color={colors.icon}
        style={{
          alignSelf: "center"
        }}
      >
        Note version history is local only.{" "}
        <Text
          onPress={() => {
            openLinkInBrowser(
              "https://docs.notesnook.com/versionhistory",
              colors
            );
          }}
          style={{ color: colors.accent, textDecorationLine: "underline" }}
        >
          Learn how this works.
        </Text>
      </Paragraph>
    </View>
  );
}