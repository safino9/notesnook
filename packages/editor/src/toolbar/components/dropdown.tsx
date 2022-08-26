import { useEffect, useRef, useState } from "react";
import { Flex, Text } from "rebass";
import { Icon } from "./icon";
import { Icons } from "../icons";
// import { MenuPresenter, MenuPresenterProps } from "../../components/menu/menu";
import { MenuItem } from "../../components/menu/types";
import {
  useIsMobile,
  useToolbarLocation,
  useToolbarStore
} from "../stores/toolbar-store";
import { MenuPresenter } from "../../components/menu";
import { getToolbarElement } from "../utils/dom";
import { Button } from "../../components/button";
import { usePopupHandler } from "../../components/popup-presenter";

type DropdownProps = {
  id: string;
  group: string;
  selectedItem: string | JSX.Element;
  items: MenuItem[];
  buttonRef?: React.MutableRefObject<HTMLButtonElement | undefined>;
  menuWidth?: number;
};
export function Dropdown(props: DropdownProps) {
  let { id, group, items, selectedItem, buttonRef, menuWidth } = props;
  const internalRef = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  const toolbarLocation = useToolbarLocation();
  const isMobile = useIsMobile();
  const isBottom = toolbarLocation === "bottom";

  const { closePopup, isPopupOpen } = usePopupHandler({
    group,
    id,
    isOpen,
    onClosed: () => setIsOpen(false)
  });

  return (
    <>
      <Button
        ref={(ref) => {
          internalRef.current = ref;
          if (buttonRef) buttonRef.current = ref || undefined;
        }}
        sx={{
          p: 1,
          m: 0,
          bg: isPopupOpen ? "hover" : "transparent",
          mr: 1,
          display: "flex",
          alignItems: "center",
          ":hover": { bg: "hover" },
          ":last-of-type": {
            mr: 0
          }
        }}
        onClick={() => setIsOpen((s) => !s)}
        onMouseDown={(e) => e.preventDefault()}
      >
        {typeof selectedItem === "string" ? (
          <Text sx={{ fontSize: "subBody", mr: 1, color: "text" }}>
            {selectedItem}
          </Text>
        ) : (
          selectedItem
        )}
        <Icon
          path={isBottom ? Icons.chevronUp : Icons.chevronDown}
          size={"small"}
          color={"text"}
        />
      </Button>

      <MenuPresenter
        isOpen={isPopupOpen}
        items={items}
        onClose={() => closePopup(id)}
        position={{
          target: isBottom
            ? getToolbarElement()
            : internalRef.current || "mouse",
          isTargetAbsolute: true,
          location: isBottom ? "top" : "below",
          align: "center",
          yOffset: 5
        }}
        blocking={!isMobile}
        focusOnRender={!isMobile}
        sx={{
          minWidth: menuWidth,
          maxWidth: isBottom ? "95vw" : "auto",
          flexDirection: isBottom ? "row" : "column",
          overflowX: isBottom ? "auto" : "hidden",
          marginRight: isBottom ? "10px" : 0,
          display: "flex",
          alignItems: isBottom ? "center" : "unset",
          mr: isBottom ? 0 : 2
        }}
      />
    </>
  );
}