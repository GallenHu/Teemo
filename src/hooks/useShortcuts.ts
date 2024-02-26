import * as React from "react";
import { ShortcutsContext } from "../components/contexts";
import type { ShortcutsMarketType } from "../types/shortcut";

export function useShortcuts(): {
  shortcuts: ShortcutsMarketType;
  setShortcuts: React.Dispatch<React.SetStateAction<ShortcutsMarketType>>;
  updateTitle: (newTitle: string, i: number) => void;
  addTitle: (newTitle: string) => void;
  moveDown: (i: number) => void;
  moveUp: (i: number) => void;
  remove: (i: number) => void;
} {
  const { shortcuts, setShortcuts } = React.useContext(ShortcutsContext);

  const updateTitle = (newTitle: string, i: number) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[i].category = newTitle;
    setShortcuts(newShortcuts);
  };

  const addTitle = (newTitle: string) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[newShortcuts.length] = {
      category: newTitle,
      shortcuts: [],
    };
    setShortcuts(newShortcuts);
  };

  const moveDown = (i: number) => {
    if (i === shortcuts.length - 1) {
      return;
    }
    const newShortcuts = [...shortcuts];
    const delArr = newShortcuts.splice(i, 1);
    newShortcuts.splice(i + 1, 0, ...delArr);
    setShortcuts(newShortcuts);
  };

  const moveUp = (i: number) => {
    if (i === 0) {
      return;
    }
    const newShortcuts = [...shortcuts];
    const delArr = newShortcuts.splice(i, 1);
    newShortcuts.splice(i - 1, 0, ...delArr);
    setShortcuts(newShortcuts);
  };

  const remove = (i: number) => {
    const newShortcuts = [...shortcuts];
    newShortcuts.splice(i, 1);
    setShortcuts(newShortcuts);
  };

  return {
    shortcuts,
    setShortcuts,
    updateTitle,
    addTitle,
    moveDown,
    moveUp,
    remove,
  };
}
