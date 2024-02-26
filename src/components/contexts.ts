import * as React from "react";
import { SHORTCUTS_MARKET } from "../constants/shortcuts";
import type { ShortcutsMarketType } from "../types/shortcut";

const SettingContext = React.createContext<{
  engine: string;
  background: string;
  setEngine: React.Dispatch<React.SetStateAction<string>>;
  setBackground: React.Dispatch<React.SetStateAction<string>>;
}>({
  engine: "",
  background: "",
  setEngine: () => null,
  setBackground: () => null,
});

const ShortcutsContext = React.createContext<{
  shortcuts: ShortcutsMarketType;
  setShortcuts: React.Dispatch<React.SetStateAction<ShortcutsMarketType>>;
}>({
  shortcuts: SHORTCUTS_MARKET,
  setShortcuts: () => null,
});

export { SettingContext, ShortcutsContext };
