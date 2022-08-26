import { ToolProps } from "../types";
import { ToolButton } from "../components/tool-button";
import { useCallback, useRef, useState } from "react";
import { ResponsivePresenter } from "../../components/responsive";
import { LinkPopup } from "../popups/link-popup";
import { useToolbarLocation } from "../stores/toolbar-store";
import { MoreTools } from "../components/more-tools";
import { useRefValue } from "../../hooks/use-ref-value";
import { findMark, selectionToOffset } from "../utils/prosemirror";
import { TextSelection } from "prosemirror-state";
import { Flex, Text } from "rebass";
import { ImageNode } from "../../extensions/image";

export function LinkSettings(props: ToolProps) {
  const { editor } = props;
  const isBottom = useToolbarLocation() === "bottom";
  if (!editor.isActive("link") || !isBottom) return null;

  return (
    <MoreTools
      {...props}
      autoCloseOnUnmount
      popupId="linkSettings"
      tools={["openLink", "editLink", "removeLink"]}
    />
  );
}

export function AddLink(props: ToolProps) {
  const { editor } = props;

  const isActive = props.editor.isActive("link");

  const onDone = useCallback((link: LinkDefinition) => {
    const { href, text, isImage } = link;
    if (!href) return;

    let commandChain = editor.current?.chain().focus();
    if (!commandChain) return;

    const isSelection = !editor.current?.state.selection.empty;

    commandChain = commandChain
      .extendMarkRange("link")
      .toggleLink({ href, target: "_blank" });
    if (!isImage) commandChain = commandChain.insertContent(text || href);

    commandChain = commandChain.focus();

    if (!isSelection && !isImage)
      commandChain = commandChain.unsetMark("link").insertContent(" ");

    commandChain.run();
  }, []);

  if (isActive) return <EditLink {...props} icon={"linkEdit"} />;
  return (
    <LinkTool
      {...props}
      onDone={onDone}
      onClick={() => {
        if (!editor.current) return;
        const { state } = editor.current;
        let { from, to } = state.selection;

        const isImage = state.doc.nodeAt(from)?.type.name === ImageNode.name;
        if (isImage) return { isImage };

        const selectedText = state.doc.textBetween(from, to);
        return { text: selectedText };
      }}
    />
  );
}

export function EditLink(props: ToolProps) {
  const { editor, selectedNode: _selectedNode } = props;
  const selectedNode = useRefValue(
    _selectedNode || selectionToOffset(editor.state)
  );

  const onDone = useCallback((link: LinkDefinition) => {
    const { href, text, isImage } = link;
    const { from, node, to } = selectedNode.current;
    if (!href || !editor.current || !node) return;

    const mark = findMark(node, "link");
    if (!mark) return;

    const selection = editor.current.state.selection;

    let commandChain = editor.current.chain();

    if (!isImage) {
      commandChain = commandChain.command(({ tr }) => {
        tr.removeMark(from, to, mark.type);
        tr.insertText(
          text || node.textContent,
          tr.mapping.map(from),
          tr.mapping.map(to)
        );
        tr.setSelection(
          TextSelection.create(tr.doc, tr.mapping.map(from), tr.mapping.map(to))
        );
        return true;
      });
    }

    commandChain
      .extendMarkRange("link")
      .toggleLink({ href, target: "_blank" })
      .command(({ tr }) => {
        tr.setSelection(
          TextSelection.create(
            tr.doc,
            tr.mapping.map(selection.from),
            tr.mapping.map(selection.to)
          )
        );
        return true;
      })
      .focus(undefined, { scrollIntoView: true })
      .run();
  }, []);

  return (
    <LinkTool
      {...props}
      isEditing
      onDone={onDone}
      onClick={() => {
        const { node } = selectedNode.current;
        if (!node) return;

        const selectedText = node.textContent;
        const mark = findMark(node, "link");

        if (!mark) return;
        return {
          text: selectedText,
          href: mark.attrs.href,
          isImage: node.type.name === ImageNode.name
        };
      }}
    />
  );
}

export function RemoveLink(props: ToolProps) {
  const { editor, selectedNode } = props;
  return (
    <ToolButton
      {...props}
      toggled={false}
      onClick={() => {
        if (selectedNode)
          editor.current?.commands.setTextSelection({
            from: selectedNode.from,
            to: selectedNode.to
          });
        editor.current?.chain().focus().unsetLink().run();
      }}
    />
  );
}

export function OpenLink(props: ToolProps) {
  const { editor, selectedNode: _selectedNode } = props;
  const selectedNode = useRefValue(
    _selectedNode || selectionToOffset(editor.state)
  );
  const { node } = selectedNode.current;
  const link = node ? findMark(node, "link") : null;
  if (!link) return null;
  const href = link?.attrs.href;

  return (
    <Flex sx={{ alignItems: "center" }}>
      <Text as="a" href={href} target="_blank" variant="body" sx={{ mr: 1 }}>
        {href}
      </Text>
      <ToolButton
        {...props}
        toggled={false}
        onClick={() => window.open(href, "_blank")}
      />
    </Flex>
  );
}

export type LinkDefinition = {
  href?: string;
  text?: string;
  isImage?: boolean;
};
type LinkToolProps = ToolProps & {
  isEditing?: boolean;
  onDone: (link: LinkDefinition) => void;
  onClick: () => LinkDefinition | undefined;
};
function LinkTool(props: LinkToolProps) {
  const { isEditing, onClick, onDone, editor, ...toolProps } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [linkDefinition, setLinkDefinition] = useState<LinkDefinition>();

  return (
    <>
      <ToolButton
        {...toolProps}
        buttonRef={buttonRef}
        onClick={() => {
          const result = onClick();
          if (!result) return;
          setLinkDefinition(result);
          setIsOpen(true);
        }}
        toggled={isOpen}
      />
      <ResponsivePresenter
        mobile="sheet"
        desktop="menu"
        position={{
          target: buttonRef.current || undefined,
          isTargetAbsolute: true,
          location: "below",
          align: "center",
          yOffset: 5
        }}
        title={isEditing ? "Edit link" : "Insert link"}
        isOpen={isOpen}
        items={[]}
        onClose={() => {
          setIsOpen(false);
          editor.current?.commands.focus();
        }}
        focusOnRender={false}
      >
        <LinkPopup
          link={linkDefinition}
          isEditing={isEditing}
          onClose={() => setIsOpen(false)}
          onDone={(link) => {
            onDone(link);
            setIsOpen(false);
          }}
        />
      </ResponsivePresenter>
    </>
  );
}