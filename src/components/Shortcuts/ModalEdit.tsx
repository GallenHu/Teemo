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
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import { DeleteOutlined } from "@ant-design/icons";
import type { Shortcut } from "../../types/shortcut";
import { exportToFile, readTextFromFile } from "utils";
import dayjs from "dayjs";

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
    setShortcuts,
    updateTitle,
    addShortcut,
    updateShortcut,
    deleteShortcut,
    addTitle,
    moveDown,
    moveUp,
    remove,
  } = useShortcuts();

  const [onEditTitles, setOnEditTitles] = useState<Record<number, boolean>>({});
  const [delConfirmBoxOpen, setDelConfirmBoxOpen] = useState(false);
  const [delCategoryIndex, setDelCategoryIndex] = useState<number | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingShortcut, setAddingShortcut] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(-1);
  const [onEditShortcutIndex, setOnEditShortcutIndex] = useState(-1);

  const shortcutsOfActiveCategory =
    shortcuts[activeCategoryIndex]?.shortcuts || [];

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
      handleConfirmCategory(e.target.value.trim(), i);
    }
  };

  function handleConfirmCategory(category: string, i: number) {
    updateTitle(category, i);
    setOnEditTitles({
      ...onEditTitles,
      [i]: false,
    });
    setActiveCategoryIndex(i);
  }

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

  const editShortcut = (item: Shortcut, index: number) => {
    setOnEditShortcutIndex(index);
    setAddingShortcut(true);
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
            onBlur={(e) => handleConfirmCategory(e.target.value.trim(), i)}
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
      <div className="px-[20px] flex flex-wrap gap-[10px]">
        {shortcutsOfActiveCategory.map((item, j) => (
          <Chip
            key={j}
            variant="outlined"
            color="primary"
            onClick={() => editShortcut(item, j)}
            endDecorator={
              <ChipDelete
                color="primary"
                variant="plain"
                onClick={() =>
                  deleteShortcut(shortcuts[activeCategoryIndex].category, j)
                }
              >
                <DeleteOutlined />
              </ChipDelete>
            }
          >
            <span className="px-[10px]">{item.title}</span>
          </Chip>
        ))}
        <ShortcutItem
          sx={{ color: "#777" }}
          key="__add-btn"
          icon={<PlusOutlined className="mr-[6px]" />}
          title="添加链接"
          url=""
          width="120px"
          plaintext
          onClick={() => setAddingShortcut(true)}
        />
      </div>
    ),
  }));

  const handleExport = () => {
    exportToFile(
      "export-" + dayjs().format("YYYY-MM-DD_HHmmss"),
      JSON.stringify(shortcuts)
    );
  };

  async function handleImportFileChange() {
    const inputElement = document.querySelector("#importFile");
    const file = (inputElement as any).files?.[0];

    if (file) {
      try {
        const content = await readTextFromFile(file);

        setShortcuts(JSON.parse(content));
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleClickImport = () => {
    const inputElement = document.querySelector("#importFile");
    if (inputElement) {
      if (inputElement.getAttribute("data-listener") !== "1") {
        inputElement.addEventListener("change", handleImportFileChange);
        inputElement.setAttribute("data-listener", "1");
      }

      (inputElement as any).click();
    }
  };

  React.useEffect(() => {
    setActiveCategoryIndex(0);
  }, []);

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <ModalDialog className="w-[800px]">
          <DialogTitle className="flex justify-between">
            <div>Customize</div>
            <div className="inline-flex gap-[20px]">
              <div
                className="text-[12px] text-[#777] inline-flex items-center cursor-pointer"
                onClick={handleExport}
              >
                <VerticalAlignBottomOutlined className="mr-[4px]" /> 导出
              </div>
              <div
                className="text-[12px] text-[#777] inline-flex items-center cursor-pointer"
                onClick={handleClickImport}
              >
                <VerticalAlignTopOutlined className="mr-[4px]" /> 导入
                <input type="file" id="importFile" className="hidden" />
              </div>
            </div>
          </DialogTitle>

          <TheTabs
            items={tabItems}
            active={shortcuts[activeCategoryIndex]?.category}
            onChange={(_, i) => setActiveCategoryIndex(i)}
          />
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
          className="w-[600px]"
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
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outlined"
                  onClick={() => setAddingCategory(false)}
                >
                  取消
                </Button>
                <Button type="submit">确认</Button>
              </div>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* 新增编辑链接 */}
      <Modal
        open={addingShortcut}
        onClose={() => {
          setAddingShortcut(false);
          setOnEditShortcutIndex(-1);
        }}
      >
        <ModalDialog className="w-[500px]">
          <DialogTitle>
            {onEditShortcutIndex > -1 ? "编辑" : "新增"}链接
          </DialogTitle>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const title = (event.target as any).title.value;
              const url = (event.target as any).url.value;
              const icon = (event.target as any).icon.value;
              const newShortcut = {
                title,
                url,
                icon,
              };
              if (onEditShortcutIndex > -1) {
                updateShortcut(
                  shortcuts[activeCategoryIndex].category,
                  onEditShortcutIndex,
                  newShortcut
                );
              } else {
                addShortcut(
                  shortcuts[activeCategoryIndex].category,
                  newShortcut
                );
              }

              setAddingShortcut(false);
              setOnEditShortcutIndex(-1);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  autoFocus
                  required
                  defaultValue={
                    shortcutsOfActiveCategory[onEditShortcutIndex]?.title
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input
                  name="url"
                  required
                  defaultValue={
                    shortcutsOfActiveCategory[onEditShortcutIndex]?.url
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Icon</FormLabel>
                <Input
                  name="icon"
                  placeholder="Icon URL"
                  defaultValue={
                    shortcutsOfActiveCategory[onEditShortcutIndex]
                      ?.icon as string
                  }
                />
              </FormControl>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAddingShortcut(false);
                    setOnEditShortcutIndex(-1);
                  }}
                >
                  取消
                </Button>
                <Button type="submit">确认</Button>
              </div>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
