import * as React from "react";
import { ShortcutsContext } from "../components/contexts";
import type { Shortcut, ShortcutsMarketType } from "../types/shortcut";

export function useShortcuts(): {
  shortcuts: ShortcutsMarketType;
  setShortcuts: React.Dispatch<React.SetStateAction<ShortcutsMarketType>>;
  updateTitle: (newTitle: string, i: number) => void;
  addShortcut: (category: string, shortcut: Shortcut) => void;
  updateShortcut: (
    category: string,
    index: number,
    newShortcut: Shortcut
  ) => void;
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

  const addShortcut = (category: string, shortcut: Shortcut) => {
    const newShortcuts = [...shortcuts];
    const i = newShortcuts.findIndex((item) => item.category === category);
    if (i > -1) {
      newShortcuts[i].shortcuts.push(shortcut);
    }
    setShortcuts(newShortcuts);
  };

  const updateShortcut = (
    category: string,
    index: number,
    newShortcut: Shortcut
  ) => {
    const newShortcuts = [...shortcuts];
    const ci = newShortcuts.findIndex((item) => item.category === category);
    if (ci > -1) {
      newShortcuts[ci].shortcuts[index] = newShortcut;
    }
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
    addShortcut,
    updateShortcut,
    setShortcuts,
    updateTitle,
    addTitle,
    moveDown,
    moveUp,
    remove,
  };
}
