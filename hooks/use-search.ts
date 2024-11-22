import { useEffect, useState } from "react";

export function useSearch() {
  const LOCAL_STORAGE_KEY = "search-engine";
  const [engine, setEngine] = useState<string>("baidu");

  useEffect(() => {
    setEngine(localStorage.getItem(LOCAL_STORAGE_KEY) || "baidu");
  });

  const toggleEngine = () => {
    if (engine === "baidu" || engine === "") {
      setEngine("google");
      localStorage.setItem(LOCAL_STORAGE_KEY, "google");
    } else {
      setEngine("baidu");
      localStorage.setItem(LOCAL_STORAGE_KEY, "baidu");
    }
  };

  return { engine, toggleEngine };
}
