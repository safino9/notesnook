import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ToggleSwitch from "toggle-switch-react-native";
import Navigation from "../../services/navigation";
import useNavigationStore from "../../stores/use-navigation-store";
import { useThemeStore } from "../../stores/use-theme-store";
import { normalize, SIZE } from "../../utils/size";
import { Button } from "../ui/button";
import { PressableButton } from "../ui/pressable";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";

export const MenuItem = React.memo(
  ({ item, index, testID, rightBtn }) => {
    const colors = useThemeStore((state) => state.colors);
    const [headerTextState, setHeaderTextState] = useState(
      useNavigationStore.getState().currentScreen
    );
    const screenId = item.name.toLowerCase() + "_navigation";
    let isFocused = headerTextState?.id === screenId;

    const _onPress = () => {
      if (item.func) {
        item.func();
      } else {
        Navigation.navigate({ name: item.name }, { canGoBack: false });
      }
      if (item.close) {
        setImmediate(() => {
          Navigation.closeDrawer();
        });
      }
    };

    const onHeaderStateChange = (state) => {
      setTimeout(() => {
        let id = state.currentScreen?.id;
        if (id === screenId) {
          setHeaderTextState({ id: state.currentScreen.id });
        } else {
          if (headerTextState !== null) {
            setHeaderTextState(null);
          }
        }
      }, 300);
    };

    useEffect(() => {
      let unsub = useNavigationStore.subscribe(onHeaderStateChange);
      return () => {
        unsub();
      };
    }, [headerTextState]);

    return (
      <PressableButton
        testID={testID}
        key={item.name + index}
        onPress={_onPress}
        type={!isFocused ? "gray" : "grayBg"}
        customStyle={{
          width: "100%",
          alignSelf: "center",
          borderRadius: 5,
          flexDirection: "row",
          paddingHorizontal: 8,
          justifyContent: "space-between",
          alignItems: "center",
          height: normalize(50),
          marginBottom: 5
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Icon
            style={{
              width: 30,
              textAlignVertical: "center",
              textAlign: "left"
            }}
            name={item.icon}
            color={
              item.icon === "crown"
                ? colors.yellow
                : isFocused
                ? colors.accent
                : colors.pri
            }
            size={SIZE.lg - 2}
          />
          {isFocused ? (
            <Heading color={colors.heading} size={SIZE.md}>
              {item.name}
            </Heading>
          ) : (
            <Paragraph size={SIZE.md}>{item.name}</Paragraph>
          )}
        </View>

        {item.switch ? (
          <ToggleSwitch
            isOn={item.on}
            onColor={colors.accent}
            offColor={colors.icon}
            size="small"
            animationSpeed={150}
            onToggle={_onPress}
          />
        ) : rightBtn ? (
          <Button
            title={rightBtn.name}
            type="shade"
            height={30}
            fontSize={SIZE.xs}
            iconSize={SIZE.xs}
            icon={rightBtn.icon}
            style={{
              borderRadius: 100,
              paddingHorizontal: 16
            }}
            onPress={rightBtn.func}
          />
        ) : null}
      </PressableButton>
    );
  },
  (prev, next) => {
    if (prev.item.name !== next.item.name) return false;
    if (prev.rightBtn?.name !== next.rightBtn?.name) return false;
    return true;
  }
);