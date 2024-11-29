import { TableCell, TableRow } from "@/components/ui/table";
import { DragHandler } from "./drag-handler";
import type { ISiteItem } from "@/types";

export function StaticTableRow({ row }: { row: ISiteItem }) {
  return (
    <TableRow>
      <TableCell className="w-[100px]">
        <div className="flex items-center gap-1.5">
          <DragHandler />
          <span>{row.name}</span>
        </div>
      </TableCell>
      <TableCell className="w-[150px]">{row.url}</TableCell>
      <TableCell className="w-[150px]">
        <div className="w-full truncate">{row.icon}</div>
      </TableCell>
      <TableCell className="text-right">操作</TableCell>
    </TableRow>
  );
}
