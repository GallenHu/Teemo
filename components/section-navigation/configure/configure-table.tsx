import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableTableRow } from "./draggable-table-row";
import { StaticTableRow } from "./static-table-row";
import type { ISiteItem } from "@/types";
import { useMemo, useState } from "react";

export function ConfigureTable({ sites }: { sites: ISiteItem[] }) {
  console.log(sites);

  const [activeId, setActiveId] = useState<string | number>();
  const [siteNames, setSiteNames] = useState(
    sites?.map((site) => site.name) || []
  );
  const selectedRow = useMemo(() => {
    if (!activeId) {
      return null;
    }
    return sites.find((site) => site.name === activeId);
  }, [activeId, sites]);
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSiteNames((siteNames) => {
        const oldIndex = siteNames.indexOf(active.id as string);
        const newIndex = siteNames.indexOf(over?.id as string) || 0;
        return arrayMove(siteNames, oldIndex, newIndex);
      });
    }

    setActiveId(undefined);
  }
  function handleDragCancel() {
    setActiveId(undefined);
  }
  function getSiteItemByName(name: string) {
    return sites.find((item) => item.name === name);
  }

  // https://codesandbox.io/s/react-table-drag-and-drop-sort-rows-with-dnd-kit-btpy9
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
      >
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[150px]">URL</TableHead>
              <TableHead className="w-[150px]">Icon</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={siteNames}
              strategy={verticalListSortingStrategy}
            >
              {siteNames.map((siteName) => (
                <DraggableTableRow
                  key={siteName}
                  row={getSiteItemByName(siteName)!}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>

        {createPortal(
          <DragOverlay>
            {selectedRow && (
              <Table className="w-full bg-gray-50">
                <TableBody>
                  <StaticTableRow row={selectedRow} />
                </TableBody>
              </Table>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <div className="py-5 flex justify-end">
        <Button variant="outline" size="sm">
          Add
        </Button>
      </div>
    </>
  );
}
