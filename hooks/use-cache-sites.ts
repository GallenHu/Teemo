import type { ISiteItem } from "@/types";
import { useEffect, useState } from "react";

export function useCacheSites() {
  const LOCAL_STORAGE_KEY = "logged-cache-sites";
  const [sites, setSites] = useState<ISiteItem[]>([]);

  const cacheSites = (sites: ISiteItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sites));
    setSites(sites);
  };

  useEffect(() => {
    const sites = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";

    try {
      const arr = JSON.parse(sites);
      setSites(arr);
    } catch (error) {
      setSites([]);
    }
  }, []);

  return { caches: sites, cacheSites };
}
