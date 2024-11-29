import { TableCell, TableRow } from "@/components/ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandler } from "./drag-handler";
import type { ISiteItem } from "@/types";

export const getSortableItemId = (item: ISiteItem) => {
  return item["url"];
};

export function DraggableTableRow({ row }: { row: ISiteItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getSortableItemId(row) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      {isDragging ? (
        <TableCell className="bg-slate-200" colSpan={4}>
          &nbsp;
        </TableCell>
      ) : (
        <>
          <TableCell className="w-[100px]">
            <div className="flex items-center gap-1.5">
              {/* add listeners to DragHandler */}
              <DragHandler {...listeners} />
              <div>{row.name}</div>
            </div>
          </TableCell>
          <TableCell className="w-[150px]">{row.url}</TableCell>
          <TableCell className="w-[150px]">
            <div className="w-full truncate">{row.icon}</div>
          </TableCell>
          <TableCell className="text-right">操作</TableCell>
        </>
      )}
    </TableRow>
  );
}
