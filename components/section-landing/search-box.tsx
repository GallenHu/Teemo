"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ReactSearchAutocomplete } from "react-search-autocomplete-rev";

interface Item {
  id: number;
  value: string;
}

const ENGINE_URL = {
  baidu: "https://www.baidu.com/s?wd=$key$",
  google: "https://www.google.com/search?newwindow=1&q=$key$",
  bing: "https://www.bing.com/search?q=$key$",
} as Record<string, string>;

export function SearchBox() {
  const { resolvedTheme } = useTheme();
  const [styling, setStyling] = useState<any>(undefined);
  const [items, setItems] = useState<Item[]>([]);

  const handleOnSearch = async (query: string, results: any[]) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    fetch(`/api/search/complete?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data || []);
      });
  };

  const handleOnSelect = (item: Item) => {
    const str = item.value;
    const url = ENGINE_URL["google"].replace("$key$", str);
    window.open(url, "_blank", "noopener");
  };

  const formatResult = (item: Item) => {
    return <span>{item.value}</span>;
  };

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
    <ReactSearchAutocomplete
      className="search-auto-complete"
      items={items}
      onSearch={handleOnSearch}
      onSelect={handleOnSelect}
      autoFocus
      showNoResults={false}
      formatResult={formatResult}
      fuseOptions={{
        // At what point does the match algorithm give up.
        // A threshold of 0.0 requires a perfect match (of both letters and location),
        //a threshold of 1.0 would match anything.
        threshold: 1,
        shouldSort: false,
        keys: ["id", "value"],
      }}
      // necessary, otherwise the results will be blank
      resultStringKeyName="value"
      styling={styling}
    />
  );
}
