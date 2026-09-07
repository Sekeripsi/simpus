import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import type { DetailRow } from "./types";

interface DetailRowsTableProps {
  rows: DetailRow[];
}

export function DetailRowsTable({ rows }: DetailRowsTableProps) {
  const midpoint = Math.ceil(rows.length / 2);
  const sections = [rows.slice(0, midpoint), rows.slice(midpoint)].filter(
    (sectionRows) => sectionRows.length > 0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {sections.map((sectionRows, sectionIndex) => (
        <Table key={`section-${sectionIndex}`}>
          <TableBody>
            {sectionRows.map((item) => (
              <TableRow key={item.label} className="hover:bg-transparent">
                <TableCell className="bg-secondary/5 text-xs uppercase tracking-wide text-gray-700 font-semibold whitespace-normal align-top w-64">
                  {item.label}
                </TableCell>
                <TableCell className="text-sm text-gray-800 wrap-break-word whitespace-normal">
                  {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  );
}
