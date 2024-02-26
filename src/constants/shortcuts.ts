import { Shortcut } from "../types/shortcut";

const DEFAULT_ICON =
  "data:image/png;base64,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";

export const SHORTCUTS_MARKET: { category: string; shortcuts: Shortcut[] }[] = [
  {
    category: "日常",
    shortcuts: [
      {
        title: "百度",
        url: "https://www.baidu.com",
        icon: "https://static.199100.xyz/images/icons/internet/baidu.webp",
      },
      {
        title: "Google",
        url: "https://www.google.com",
        icon: "https://static.199100.xyz/images/icons/internet/google.webp",
      },
      {
        title: "V2EX",
        url: "https://www.v2ex.com",
        icon: "https://static.199100.xyz/images/icons/internet/v2ex.webp",
      },
    ],
  },

  {
    category: "影音",
    shortcuts: [
      {
        title: "哔哩哔哩",
        url: "https://www.bilibili.com",
        icon: "https://static.199100.xyz/images/icons/internet/bilibili.webp",
      },
      {
        title: "Youtube",
        url: "https://www.youtube.com",
        icon: "https://static.199100.xyz/images/icons/internet/youtube.webp",
      },
    ],
  },

  {
    category: "工具",
    shortcuts: [
      {
        title: "在线工具箱",
        url: "https://tools.199100.xyz",
        icon: DEFAULT_ICON,
      },
    ],
  },
];

export type ShortcutsMarketType = typeof SHORTCUTS_MARKET;
