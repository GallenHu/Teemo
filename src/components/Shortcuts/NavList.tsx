import React, { useState } from "react";
import Typography from "@mui/joy/Typography";
import { Shortcut } from "../../types/shortcut";
import { EditOutlined } from "@ant-design/icons";
import ShortcutItem from "./ShortcutItem";
import ModalEdit from "./ModalEdit";
import { useShortcuts } from "../../hooks/useShortcuts";
import "./style.css";

interface ListProps {
  title: string;
  items: Shortcut[];
  onClickEdit: () => void;
}

const List: React.FC<ListProps> = ({ title, items, onClickEdit }) => {
  const [list, setList] = useState(items);

  return (
    <div className=" mb-[50px] ">
      <div className="group mb-[12px] flex items-center">
        <Typography level="title-sm">{title}</Typography>

        <EditOutlined
          className="ml-[6px] text-[12px] text-blue-400 cursor-pointer hidden group-hover:block"
          onClick={onClickEdit}
        />
      </div>

      <div className="flex items-center px-[20px] py-[14px] rounded-md bg-white dark:bg-slate-600">
        {list.map((item, i) => {
          return <ShortcutItem key={i} {...item} />;
        })}
      </div>
    </div>
  );
};

const Page = () => {
  const { shortcuts, setShortcuts } = useShortcuts();
  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = (reason: string) => {
    // 不允许 esc 键关闭
    if (reason !== "escapeKeyDown") {
      setModalVisible(false);
    }
  };

  return (
    <>
      <div className="w-[800px] h-[80%] mx-auto pt-[50px] ">
        {shortcuts.map((item, i) => {
          return (
            <List
              key={item.category}
              title={item.category}
              items={item.shortcuts}
              onClickEdit={() => setModalVisible(true)}
            />
          );
        })}
      </div>

      <ModalEdit
        open={modalVisible}
        onClose={(_, reason: string) => handleCloseModal(reason)}
      />
    </>
  );
};

export default Page;
