import * as React from "react";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import { MenuOutlined } from "@ant-design/icons";
import SettingMenu from "./SettingMenu";
import "./style.css";
import { useEffect } from "react";

export default function () {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className="btn-setting px-[10px] flex items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <MenuOutlined className="icon-setting" />
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        color="primary"
        size="sm"
        variant="plain"
      >
        <ModalClose onClick={() => setOpen(false)} />
        <DialogTitle>自定义设置</DialogTitle>
        <SettingMenu />
      </Drawer>
    </>
  );
}
