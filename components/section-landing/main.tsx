import React from "react";
import { TheLogo } from "./logo";
import { SearchBox } from "./search-box";

export function Main() {
  return (
    <main className="h-[calc(100%-57px)] relative">
      <div className="absolute left-1/2 -translate-x-2/4 top-1/3 w-[600px]">
        <TheLogo />
        <SearchBox />
      </div>
    </main>
  );
}
