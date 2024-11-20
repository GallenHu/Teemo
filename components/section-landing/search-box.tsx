"use client";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { useEffect } from "react";

export function SearchBox() {
  const items = [{ value: "Apple" }, { value: "Banana" }];

  useEffect(() => {
    autocomplete({
      container: "#autocomplete",
      placeholder: "Search for products",
      getSources({ query }) {
        return fetch(`/api/search/complete?query=${encodeURIComponent(query)}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            return [
              {
                sourceId: "suggestions",
                getItems() {
                  return data.suggestions;
                },
                getItemInputValue({ item }) {
                  return item.value;
                },
                // ...
              },
            ] as any;
          });
      },
    });
  }, []);

  return <div id="autocomplete"></div>;
}
