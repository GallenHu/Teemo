import { ReactNode } from "react";

export type { ShortcutsMarketType } from "../constants/shortcuts";

export interface Shortcut {
  title: string;
  url: string;
  icon: string | ReactNode;
}
