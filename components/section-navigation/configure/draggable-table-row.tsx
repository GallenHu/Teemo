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
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandler } from "./drag-handler";
import type { ISiteItem } from "@/types";

export function DraggableTableRow({ row }: { row: ISiteItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.name });

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
          <TableCell className="font-medium">
            {/* add listeners to DragHandler */}
            <DragHandler {...listeners} />
            <span>{row.name}</span>
          </TableCell>
          <TableCell>{row.url}</TableCell>
          <TableCell>
            <div className="max-w-[150px] truncate">{row.icon}</div>
          </TableCell>
          <TableCell className="text-right">操作</TableCell>
        </>
      )}
    </TableRow>
  );
}
