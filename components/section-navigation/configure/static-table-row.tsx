import { TableCell, TableRow } from "@/components/ui/table";
import { DragHandler } from "./drag-handler";
import type { ISiteItem } from "@/types";

export function StaticTableRow({ row }: { row: ISiteItem }) {
  return (
    <TableRow>
      <TableCell>
        <div className="w-[100px] flex items-center gap-1.5">
          <DragHandler />
          <span>{row.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="w-[120px] truncate">{row.url}</div>
      </TableCell>
      <TableCell>
        <div className="w-[120px] truncate">{row.icon}</div>
      </TableCell>
      <TableCell className="text-right">&nbsp;</TableCell>
    </TableRow>
  );
}
