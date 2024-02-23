import { SHORTCUTS_MARKET } from "../constants/shortcuts";
import { useState } from "react";

export function useShortcuts(): {
  shortcuts: typeof SHORTCUTS_MARKET;
  setShortcuts: React.Dispatch<React.SetStateAction<typeof SHORTCUTS_MARKET>>;
  updateTitle: (newTitle: string, i: number) => void;
} {
  const [shortcuts, setShortcuts] = useState(SHORTCUTS_MARKET);

  const updateTitle = (newTitle: string, i: number) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[i].category = newTitle;
    setShortcuts(newShortcuts);
  };

  return { shortcuts, setShortcuts, updateTitle };
}
