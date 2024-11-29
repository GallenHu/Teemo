import { TableCell, TableRow } from "@/components/ui/table";

export function EmptyTableRow() {
  return (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="text-center text-gray-400">No data</div>
      </TableCell>
    </TableRow>
  );
}
