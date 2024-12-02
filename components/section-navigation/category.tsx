"use client";

import { SiteItem } from "./site-item";
import type { ISiteItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Category({
  name,
  items,
}: {
  name: string;
  items: ISiteItem[];
}) {
  return (
    <Card className="w-full my-5">
      <CardHeader className="relative group">
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          {items.map((site) => (
            <SiteItem key={site.name} {...site} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
