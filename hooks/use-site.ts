import { ISiteItem } from "@/types";
import { pick } from "lodash-es";

export function useSite() {
  const getSites = () => {
    return fetch("/api/site").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const getSitesWithCategory = () => {
    return fetch("/api/site?category=1").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const createSite = (data: ISiteItem & { category: string }) => {
    return fetch("/api/site", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const updateSite = (id: string, site: ISiteItem) => {
    return fetch(`/api/site/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pick(site, ["name", "url", "icon"])),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const deleteSite = (id: string) => {
    return fetch("/api/site/" + id, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const reorder = (categoryId: string, sites: ISiteItem[]) => {
    return fetch("/api/site/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: categoryId, sites }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  return {
    getSites,
    getSitesWithCategory,
    createSite,
    updateSite,
    deleteSite,
    reorder,
  };
}
