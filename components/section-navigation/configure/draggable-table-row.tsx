import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandler } from "./drag-handler";
import { Pencil, Trash2 } from "lucide-react";
import type { ISiteItem } from "@/types";

interface Props {
  row: ISiteItem;
  onEdit?: () => void;
}

export const getSortableItemId = (item: ISiteItem) => {
  return item["url"];
};

export function DraggableTableRow({ row, onEdit, onDelete }: Props) {
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
          <TableCell>
            <div className="w-[100px] flex items-center gap-1.5">
              {/* add listeners to DragHandler */}
              <DragHandler {...listeners} />
              <div>{row.name}</div>
            </div>
          </TableCell>
          <TableCell>
            <div className="w-[120px] truncate">{row.url}</div>
          </TableCell>
          <TableCell>
            <div className="w-[120px] truncate">{row.icon}</div>
          </TableCell>
          <TableCell>
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                className="h-3 px-1.5 text-gray-500 hover:text-gray-700"
                onClick={onEdit}
              >
                <Pencil size={14} />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
