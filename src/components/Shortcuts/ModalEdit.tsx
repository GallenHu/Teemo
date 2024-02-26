import * as React from "react";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import TheTabs from "../TheTabs/index";
import ShortcutItem from "./ShortcutItem";
import {
  EditOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { useShortcuts } from "../../hooks/useShortcuts";
import { useState } from "react";
import Divider from "@mui/joy/Divider";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";

interface Props {
  open: boolean;
  onClose: (
    _event: React.MouseEvent<HTMLButtonElement>,
    reason: string
  ) => void;
}

export default function (props: Props) {
  const {
    shortcuts,
    updateTitle,
    addTitle,
    moveDown,
    moveUp,
    remove,
  } = useShortcuts();
  const [onEditTitles, setOnEditTitles] = useState<Record<number, boolean>>({});
  const [delConfirmBoxOpen, setDelConfirmBoxOpen] = useState(false);
  const [delCategoryIndex, setDelCategoryIndex] = useState<number | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [active, setActive] = useState("");

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
      updateTitle(e.target.value.trim(), i);
      setOnEditTitles({
        ...onEditTitles,
        [i]: false,
      });
      setActive(e.target.value.trim());
    }
  };

  const toRemove = (i: number) => {
    setDelCategoryIndex(i);
    setDelConfirmBoxOpen(true);
  };

  const onDelete = () => {
    if (typeof delCategoryIndex === "number") {
      remove(delCategoryIndex);
    }
    setDelConfirmBoxOpen(false);
  };

  const tabItems = shortcuts.map((shortcut, i) => ({
    key: shortcut.category,
    label: (
      <div className="flex justify-between items-center">
        {onEditTitles[i] ? (
          <Input
            className="w-[200px]"
            defaultValue={shortcut.category}
            size="sm"
            autoFocus
            onKeyDown={(e) => handleTitleKeydown(e, i)}
          />
        ) : (
          <span className="w-[200px]">{shortcut.category}</span>
        )}

        <span className="w-[140px] inline-flex items-center">
          {onEditTitles[i] ? null : (
            <>
              <EditOutlined
                className="ml-[6px] text-[12px] text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => handleEditTitle(i)}
              />
              <ArrowDownOutlined
                className="ml-[6px] text-[12px] text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => moveDown(i)}
              />
              <ArrowUpOutlined
                className="ml-[6px] text-[12px] text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => moveUp(i)}
              />
              <PlusOutlined
                className="ml-[6px] text-[12px] text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => setAddingCategory(true)}
              />
              <CloseOutlined
                className="ml-[6px] text-[12px] text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => toRemove(i)}
              />
            </>
          )}
        </span>
      </div>
    ),
    children: (
      <div className="px-[20px] flex">
        {shortcut.shortcuts.map((item, j) => (
          <ShortcutItem key={j} {...item} width="120px" plaintext />
        ))}
        <ShortcutItem
          sx={{ color: "#777" }}
          key="__add-btn"
          icon={<PlusOutlined className="mr-[6px]" />}
          title="添加链接"
          url=""
          width="120px"
          plaintext
        />
      </div>
    ),
  }));

  React.useEffect(() => {
    setActive(tabItems[0].key);
  }, []);

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <ModalDialog className="w-[800px]">
          <DialogTitle className="flex justify-between">
            <div>Customize</div>
            <div className="inline-flex gap-[20px]">
              <div className="text-[12px] text-[#777] inline-flex items-center cursor-pointer">
                <VerticalAlignBottomOutlined className="mr-[4px]" /> 导出
              </div>
              <div className="text-[12px] text-[#777] inline-flex items-center cursor-pointer">
                <VerticalAlignTopOutlined className="mr-[4px]" /> 导入
              </div>
            </div>
          </DialogTitle>

          <TheTabs items={tabItems} active={active} onChange={setActive} />
        </ModalDialog>
      </Modal>

      {/* 删除确认 */}
      <Modal
        open={delConfirmBoxOpen}
        onClose={() => setDelConfirmBoxOpen(false)}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          className="w-[500px]"
        >
          <DialogTitle>
            <ExclamationCircleOutlined />
            确认
          </DialogTitle>
          <Divider />
          <DialogContent>确认删除分类及其所有快捷链接?</DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" size="sm" onClick={onDelete}>
              确认
            </Button>
            <Button
              variant="plain"
              color="neutral"
              size="sm"
              onClick={() => setDelConfirmBoxOpen(false)}
            >
              取消
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* 新增分类 */}
      <Modal open={addingCategory} onClose={() => setAddingCategory(false)}>
        <ModalDialog>
          <DialogTitle>新建分类</DialogTitle>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const title = (event.target as any).name.value;
              if (title.trim()) {
                addTitle(title.trim());
              }
              setAddingCategory(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <Input name="name" autoFocus required placeholder="名称" />
              </FormControl>
              <Button type="submit">确认</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
