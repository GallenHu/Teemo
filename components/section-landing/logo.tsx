"use client";
import React from "react";
import { useSearch } from "@/hooks/use-search";
import { Icons } from "../global/icons";

export function TheLogo() {
  const { engine, toggleEngine } = useSearch();

  return (
    <div
      className="w-full text-center -mt-[140px]"
      onClick={() => toggleEngine()}
    >
      <div className="inline-block w-[300px] h-[150px]">
        {engine === "baidu" && <Icons.baidu />}
        {engine === "google" && <Icons.google />}
      </div>
    </div>
  );
}
