import { CategoriesContainer } from "./categories-container";
import { Category } from "./category";
import type { ISiteItem } from "@/types";

export function SitesUnLogged() {
  const list: ISiteItem[] = [
    {
      name: "百度",
      url: "https://www.baidu.com",
      icon: "https://static.199100.xyz/images/icons/internet/baidu.webp",
    },
    {
      name: "微博",
      url: "https://www.weibo.com",
      icon: "https://static.199100.xyz/images/icons/internet/weibo.webp",
    },
    {
      name: "哔哩哔哩",
      url: "https://www.bilibili.com",
      icon: "https://static.199100.xyz/images/icons/internet/bilibili.webp",
    },
    {
      name: "Google",
      url: "https://www.google.com",
      icon: "https://static.199100.xyz/images/icons/internet/google.webp",
    },
  ];

  return (
    <CategoriesContainer>
      <Category name="推荐" items={list} />
    </CategoriesContainer>
  );
}
