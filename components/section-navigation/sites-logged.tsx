"use client";

import { CategoriesContainer } from "./categories-container";
import { Configure } from "./configure/configure";
import { Category } from "./category";
import { pick } from "lodash-es";
import { useSite } from "@/hooks/use-site";
import { useFastToast } from "@/hooks/use-fast-toast";
import type { ICategory, ISiteItem } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { FolderOpen } from "lucide-react";

type SiteItemModel = ISiteItem & {
  category: ICategory;
};

export function SitesLogged() {
  const [sites, setSites] = useState<SiteItemModel[]>([]);
  const { getSitesWithCategory } = useSite();
  const { errorToast } = useFastToast();
  // const sites = await getSitesWithCategory(userId);

  useEffect(() => {
    reloadSites();
  }, []);

  const reloadSites = async () => {
    const res = await getSitesWithCategory();
    if (res.success) {
      setSites(res.data);
    } else {
      errorToast(res.message);
    }
  };

  const handleClose = () => {
    reloadSites();
  };

  const categoriesMap: Record<string, ISiteItem[]> = useMemo(() => {
    const map: Record<string, ISiteItem[]> = {};

    const sortedSites = sites.sort((a, b) => a.order - b.order);

    sortedSites.forEach((site) => {
      const categoryName = site.category?.name || "Unknown";
      const _site = pick(site, ["icon", "name", "url", "order"]);
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
      <Configure onCloseDialog={handleClose} />

      <CategoriesContainer>
        {Object.keys(categoriesMap).length ? (
          Object.keys(categoriesMap).map((categoryName) => {
            return (
              <Category
                key={categoryName}
                name={categoryName}
                items={categoriesMap[categoryName]}
              />
            );
          })
        ) : (
          <div className="text-gray-500">
            <div className="mb-4">
              <FolderOpen size={30} />
            </div>
            <div>No items found.</div>
            <div className="text-sm mt-1">
              Create the item with the Settings button.
            </div>
          </div>
        )}
      </CategoriesContainer>
    </>
  );
}
