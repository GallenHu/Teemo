import * as React from "react";
import { ShortcutsContext } from "../components/contexts";
import type { ShortcutsMarketType } from "../types/shortcut";

export function useShortcuts(): {
  shortcuts: ShortcutsMarketType;
  setShortcuts: React.Dispatch<React.SetStateAction<ShortcutsMarketType>>;
  updateTitle: (newTitle: string, i: number) => void;
  moveDown: (i: number) => void;
  moveUp: (i: number) => void;
} {
  const { shortcuts, setShortcuts } = React.useContext(ShortcutsContext);

  const updateTitle = (newTitle: string, i: number) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[i].category = newTitle;
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

  return { shortcuts, setShortcuts, updateTitle, moveDown, moveUp };
}
