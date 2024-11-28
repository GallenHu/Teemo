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

export function StaticTableRow({ row }: { row: ISiteItem }) {
  return (
    <TableRow>
      <TableCell className="w-[100px]">
        <DragHandler />
        <span>{row.name}</span>
      </TableCell>
      <TableCell className="w-[150px]">{row.url}</TableCell>
      <TableCell className="w-[150px]">
        <div className="w-full truncate">{row.icon}</div>
      </TableCell>
      <TableCell className="text-right">操作</TableCell>
    </TableRow>
  );
}
