"use client";
import "@algolia/autocomplete-theme-classic";
import React from "react";
import { Autocomplete } from "./auto-complete";

export function SearchBox() {
  const debounced = debouncePromise(
    (items: any[]) => Promise.resolve(items),
    300
  );

  function getSources({ query }) {
    return debounced([
      {
        sourceId: "suggestions",
        getItems() {
          if (!query) {
            return [];
          }

          return fetch(
            `/api/search/complete?query=${encodeURIComponent(query)}`
          )
            .then((response) => response.json())
            .then((data) => {
              const suggestions = data.suggestions || [];
              console.log(suggestions);
              return suggestions.map((s) => {
                return {
                  label: s.value,
                  url: s.serpapi_link,
                };
              });
            });
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          item({ item, components }) {
            return (
              <a href={item.url} className="aa-ItemLink">
                <div className="aa-ItemContent">
                  <div className="aa-ItemTitle">
                    <components.Highlight hit={item} attribute="label" />
                  </div>
                </div>
              </a>
            );
          },
        },
      },
    ]);
  }

  return <Autocomplete openOnFocus={true} getSources={getSources} />;
}

function debouncePromise(fn: any, time: number) {
  let timer: any = undefined;

  return function debounced(...args: any[]) {
    if (timer) {
      clearTimeout(timer); // Clear the timeout first if it's already defined.
    }

    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}
