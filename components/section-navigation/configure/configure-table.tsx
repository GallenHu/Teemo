import { createPortal } from "react-dom";
import {
  Table,
  TableBody,
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
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableTableRow, getSortableItemId } from "./draggable-table-row";
import { StaticTableRow } from "./static-table-row";
import { EmptyTableRow } from "./empty-table-row";
import type { ISiteItem } from "@/types";
import { useEffect, useMemo, useState } from "react";

interface Props {
  sites: ISiteItem[];
  onSort?: (oldIndex: number, newIndex: number) => void;
  onClickCreate?: () => void;
}

export function ConfigureTable({ sites, onSort, onClickCreate }: Props) {
  const [activeId, setActiveId] = useState<string | number>();
  const [sortedSiteUrls, setSortedSiteUrls] = useState<string[]>([]);

  const selectedRow = useMemo(() => {
    if (!activeId) {
      return null;
    }
    return sites.find((site) => getSortableItemId(site) === activeId);
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
      const oldIndex = sites.findIndex(
        (item) => getSortableItemId(item) === (active.id as string)
      );
      const newIndex =
        sites.findIndex(
          (item) => getSortableItemId(item) === (over?.id as string)
        ) || 0;

      onSort?.(oldIndex, newIndex);
    }

    setActiveId(undefined);
  }
  function handleDragCancel() {
    setActiveId(undefined);
  }

  useEffect(() => {
    const sorted = sites.sort((a, b) => a.order - b.order);
    setSortedSiteUrls(sorted.map((item) => getSortableItemId(item)));
  }, [sites]);

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
              <TableHead className="w-[100px]">NAME</TableHead>
              <TableHead className="w-[150px]">URL</TableHead>
              <TableHead className="w-[150px]">ICON</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites?.length ? (
              <SortableContext
                items={sortedSiteUrls}
                strategy={verticalListSortingStrategy}
              >
                {sites.map((site) => (
                  <DraggableTableRow key={getSortableItemId(site)} row={site} />
                ))}
              </SortableContext>
            ) : (
              <EmptyTableRow />
            )}
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
        <Button variant="outline" size="sm" onClick={onClickCreate}>
          Add
        </Button>
      </div>
    </>
  );
}
