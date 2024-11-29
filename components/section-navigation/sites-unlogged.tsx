import { CategoriesContainer } from "./categories-container";
import { Category } from "./category";
import type { ISiteItem } from "@/types";

export function SitesUnLogged() {
  const list: ISiteItem[] = [
    {
      name: "百度",
      url: "https://www.baidu.com",
      icon: "https://static.199100.xyz/images/icons/internet/baidu.webp",
      order: 1,
    },
    {
      name: "微博",
      url: "https://www.weibo.com",
      icon: "https://static.199100.xyz/images/icons/internet/weibo.webp",
      order: 2,
    },
    {
      name: "哔哩哔哩",
      url: "https://www.bilibili.com",
      icon: "https://static.199100.xyz/images/icons/internet/bilibili.webp",
      order: 3,
    },
    {
      name: "Google",
      url: "https://www.google.com",
      icon: "https://static.199100.xyz/images/icons/internet/google.webp",
      order: 4,
    },
  ];

  return (
    <CategoriesContainer>
      <Category name="Recommend" items={list} />
    </CategoriesContainer>
  );
}
