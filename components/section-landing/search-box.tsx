"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ReactSearchAutocomplete } from "react-search-autocomplete-rev";
import { useSearch } from "@/hooks/use-search";

interface Item {
  id: number; // the id field is mandatory.
  value: string;
}

const ENGINE_URL = {
  baidu: "https://www.baidu.com/s?wd=$key$",
  google: "https://www.google.com/search?newwindow=1&q=$key$",
  bing: "https://www.bing.com/search?q=$key$",
} as Record<string, string>;

export function SearchBox() {
  const { engine } = useSearch();
  const { resolvedTheme } = useTheme();
  const [styling, setStyling] = useState<any>(undefined);
  const [items, setItems] = useState<Item[]>([]);
  const [url, setUrl] = useState("");

  let isOpening = false;

  /**
   * handleOnSearch
   * 将在文字输入和键盘事件中调用
   * @param query
   * @param results
   * @param keyCode
   * @returns
   */
  const handleOnSearch = async (
    query: string,
    results: any[],
    keyCode: number
  ) => {
    if (isOpening) return;
    if (keyCode === 13) {
      openSearchUrl(url, query);
      return;
    }
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    fetch(`/api/search/complete?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data || []);
      });
  };

  const handleOnSelect = (item: Item) => {
    openSearchUrl(url, item.value);
  };

  const openSearchUrl = (url: string, search: string) => {
    if (isOpening) return;

    isOpening = true;
    setTimeout(() => {
      isOpening = false;
    }, 300);

    window.open(url.replace("$key$", search), "_blank", "noopener");
  };

  const formatResult = (item: Item) => {
    return <span>{item.value}</span>;
  };

  useEffect(() => {
    setUrl(ENGINE_URL[engine]);
  }, [engine]);

  useEffect(() => {
    setStyling(
      resolvedTheme === "dark"
        ? {
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid #27272a",
            hoverBackgroundColor: "#27272a",
            lineColor: "#27272a",
          }
        : undefined
    );
  }, [resolvedTheme]);

  return (
    <>
      <ReactSearchAutocomplete
        className="search-auto-complete"
        items={items}
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        autoFocus
        showNoResults={false}
        formatResult={formatResult}
        disableFuse={true}
        fuseOptions={{
          // At what point does the match algorithm give up.
          // A threshold of 0.0 requires a perfect match (of both letters and location),
          //a threshold of 1.0 would match anything.
          threshold: 1,
          shouldSort: false,
          // `keys` represent the keys in `items` where the search will be
          // performed.
          // keys: ["id", "value"],
        }}
        // If your list of items does not
        // have a "name" key, use `resultStringKeyName` to tell what key
        // (string) to use to display in the results.
        // necessary, otherwise the results will be blank
        resultStringKeyName="value"
        styling={styling}
      />
    </>
  );
}
