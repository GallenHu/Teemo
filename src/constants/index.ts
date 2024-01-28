export const BUTTON_COLORS = {
  baidu: "primary",
  google: "neutral",
} as Record<string, any>;

export const BUTTON_VARIANT = {
  baidu: "solid",
  google: "soft",
} as Record<string, any>;

export const BUTTON_TEXT = {
  baidu: "百度一下",
  google: "Google 搜索",
} as Record<string, string>;

export const ENGINE_URL = {
  baidu: "https://www.baidu.com/s?wd=$key$",
  google: "https://www.google.com/search?newwindow=1&q=$key$",
  bing: "https://www.bing.com/search?q=$key$",
} as Record<string, string>;
