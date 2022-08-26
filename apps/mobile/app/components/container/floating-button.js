import React, { useEffect } from "react";
import { Keyboard, Platform, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { notesnook } from "../../../e2e/test.ids";
import { editorState } from "../../screens/editor/tiptap/utils";
import { useSelectionStore } from "../../stores/use-selection-store";
import { useSettingStore } from "../../stores/use-setting-store";
import { getElevation, showTooltip, TOOLTIP_POSITIONS } from "../../utils";
import { normalize, SIZE } from "../../utils/size";
import { PressableButton } from "../ui/pressable";

export const FloatingButton = ({
  title,
  onPress,
  color = "accent",
  shouldShow = false
}) => {
  const insets = useSafeAreaInsets();
  const deviceMode = useSettingStore((state) => state.deviceMode);
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const translate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translate.value
        },
        {
          translateY: translate.value
        }
      ]
    };
  });

  useEffect(() => {
    animate(selectionMode ? 150 : 0);
  }, [selectionMode]);

  function animate(toValue) {
    translate.value = withTiming(toValue, {
      duration: 250,
      easing: Easing.elastic(1)
    });
  }

  const onKeyboardHide = async () => {
    editorState().keyboardState = false;
    if (deviceMode !== "mobile") return;
    animate(0);
  };

  const onKeyboardShow = async () => {
    editorState().keyboardState = true;
    if (deviceMode !== "mobile") return;
    animate(150);
  };

  useEffect(() => {
    let sub1 = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    let sub2 = Keyboard.addListener("keyboardDidHide", onKeyboardHide);
    return () => {
      sub1?.remove();
      sub2?.remove();
    };
  }, [deviceMode]);
  const paddings = {
    ios: 20,
    android: 20,
    iPad: 20
  };

  return deviceMode !== "mobile" && !shouldShow ? null : (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 12,
          bottom: paddings[Platform.isPad ? "iPad" : Platform.OS],
          zIndex: 10
        },
        animatedStyle
      ]}
    >
      <PressableButton
        testID={notesnook.buttons.add}
        type="accent"
        accentColor={color || "accent"}
        accentText="light"
        customStyle={{
          ...getElevation(5),
          borderRadius: 100
        }}
        onLongPress={(event) => {
          showTooltip(event, title, TOOLTIP_POSITIONS.LEFT);
        }}
        onPress={onPress}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: normalize(60),
            width: normalize(60)
          }}
        >
          <Icon
            name={title === "Clear all trash" ? "delete" : "plus"}
            color="white"
            size={SIZE.xxl}
          />
        </View>
      </PressableButton>
    </Animated.View>
  );
};