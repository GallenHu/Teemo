"use client";

import { CategoriesContainer } from "./categories-container";
import { Configure } from "./configure/configure";
import { Category } from "./category";
import { pick } from "lodash-es";
import { useSite } from "@/hooks/use-site";
import { useFastToast } from "@/hooks/use-fast-toast";
import type { ICategory, ISiteItem } from "@/types";
import { useEffect, useMemo, useState } from "react";

type SiteItemModel = ISiteItem & {
  category: ICategory;
};

export function SitesLogged() {
  const [sites, setSites] = useState<SiteItemModel[]>([]);
  const { getSitesWithCategory } = useSite();
  const { errorToast } = useFastToast();
  // const sites = await getSitesWithCategory(userId);

  useEffect(() => {
    const load = async () => {
      const res = await getSitesWithCategory();
      if (res.success) {
        setSites(res.data);
      } else {
        errorToast(res.message);
      }
    };

    load();
  }, []);

  const categoriesMap: Record<string, ISiteItem[]> = useMemo(() => {
    const map: Record<string, ISiteItem[]> = {};

    sites.forEach((site) => {
      const categoryName = site.category.name;
      const _site = pick(site, ["icon", "name", "url"]);
      if (!map[categoryName]) {
        map[categoryName] = [_site];
      } else {
        map[categoryName].push(_site);
      }
    });
    return map;
  }, [sites]);

  return (
    <>
      <Configure />

      <CategoriesContainer>
        {Object.keys(categoriesMap).map((categoryName) => {
          return (
            <Category
              key={categoryName}
              name={categoryName}
              items={categoriesMap[categoryName]}
            />
          );
        })}
      </CategoriesContainer>
    </>
  );
}
