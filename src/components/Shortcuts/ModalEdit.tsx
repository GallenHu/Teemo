import * as React from "react";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import ShortcutItem from "./ShortcutItem";
import { EditOutlined } from "@ant-design/icons";
import { useShortcuts } from "../../hooks/useShortcuts";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: (
    _event: React.MouseEvent<HTMLButtonElement>,
    reason: string
  ) => void;
}

export default function (props: Props) {
  const { shortcuts, updateTitle } = useShortcuts();
  const [onEditTitles, setOnEditTitles] = useState<Record<number, boolean>>({});

  const titles = shortcuts.map((item) => item.category);

  const handleEditTitle = (i: number) => {
    setOnEditTitles({
      ...onEditTitles,
      [i]: true,
    });
  };

  const handleTitleKeydown = (e: any, i: number) => {
    if (e.key.toLowerCase() === "escape") {
      setOnEditTitles({
        ...onEditTitles,
        [i]: false,
      });
      return;
    }

    if (e.key.toLowerCase() === "enter") {
      updateTitle(e.target.value, i);
      setOnEditTitles({
        ...onEditTitles,
        [i]: false,
      });
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog className="w-[800px]">
        <DialogTitle>Customize</DialogTitle>

        <Tabs
          aria-label="Vertical tabs"
          orientation="vertical"
          sx={{ minWidth: 300, height: 160 }}
        >
          <TabList>
            {titles.map((title, i) => (
              <Tab key={i}>
                {onEditTitles[i] ? (
                  <Input
                    className="w-[200px]"
                    defaultValue={title}
                    size="sm"
                    autoFocus
                    onKeyDown={(e) => handleTitleKeydown(e, i)}
                  />
                ) : (
                  <span className="w-[200px]">{title}</span>
                )}

                <EditOutlined
                  className="ml-[6px] text-[12px] text-blue-400 cursor-pointer"
                  onClick={() => handleEditTitle(i)}
                />
              </Tab>
            ))}
          </TabList>

          {titles.map((title, i) => (
            <TabPanel key={i} className="shortcuts-tab-panel" value={i}>
              {shortcuts[i].shortcuts.map((item, j) => (
                <ShortcutItem key={j} {...item} width="120px" plaintext />
              ))}
            </TabPanel>
          ))}
        </Tabs>
      </ModalDialog>
    </Modal>
  );
}
