import { CategoriesContainer } from "./categories-container";
import { Configure } from "./configure";
import { getSitesWithCategory } from "@/utils/db-site";
import { Category } from "./category";
import { pick } from "lodash-es";
import type { ISiteItem } from "@/types";

export async function SitesLogged({ userId }: { userId: string }) {
  const sites = await getSitesWithCategory(userId);
  const categoriesMap: Record<string, ISiteItem[]> = {};

  sites.forEach((site) => {
    const categoryName = site.category.name;
    const _site = pick(site, ["icon", "name", "url"]);
    if (!categoriesMap[categoryName]) {
      categoriesMap[categoryName] = [_site];
    } else {
      categoriesMap[categoryName].push(_site);
    }
  });

  return (
    <>
      <Configure categoriesMap={categoriesMap} />

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
