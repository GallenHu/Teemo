"use client";

import { SiteItem } from "./site-item";
import type { ISiteItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EllipsisVerticalIcon,
  FolderPen,
  Trash2,
  SquarePlus,
} from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

export function Category({
  name,
  items,
}: {
  name: string;
  items: ISiteItem[];
}) {
  const [siteNames, setSiteNames] = useState(items.map((item) => item.name));

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSiteNames((names) => {
        const oldIndex = names.indexOf(active.id as string);
        const newIndex = names.indexOf(over?.id as string) || 0;

        return arrayMove(names, oldIndex, newIndex);
      });
    }
  }

  function getSiteItemByName(name: string) {
    return items.find((item) => item.name === name);
  }

  return (
    <Card className="w-full">
      <CardHeader className="relative group">
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={siteNames}>
              {siteNames.map((name) => (
                <SiteItem key={name} {...getSiteItemByName(name)!} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  );
}
