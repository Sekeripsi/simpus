import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { TerapiObatRow } from "./types";

interface PengobatanTabProps {
  rows: TerapiObatRow[];
  onChange: (rowIndex: number, field: keyof TerapiObatRow, value: string) => void;
  onAddRow: () => void;
}

const TERAPI_OBAT_COLUMNS: Array<{ key: keyof TerapiObatRow; label: string }> = [
  { key: "rSlash", label: "R/" },
  { key: "kode", label: "Kode" },
  { key: "nama", label: "Nama" },
  { key: "rDalam", label: "R/Dalam" },
  { key: "rLuar", label: "R/Luar" },
  { key: "caraPakai", label: "Cara Pakai" },
  { key: "keterangan", label: "Keterangan" },
];

export function PengobatanTab({ rows, onChange, onAddRow }: PengobatanTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Terapi Obat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Table aria-label="Terapi Obat">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {TERAPI_OBAT_COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  className="text-xs uppercase tracking-wide text-gray-500 font-semibold whitespace-normal"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={`obat-${rowIndex}`} className="hover:bg-transparent">
                {TERAPI_OBAT_COLUMNS.map((column) => (
                  <TableCell key={column.key} className="align-top">
                    <Input
                      value={row[column.key]}
                      onChange={(event) =>
                        onChange(rowIndex, column.key, event.target.value)
                      }
                      placeholder={column.label}
                      aria-label={`${column.label} baris ${rowIndex + 1}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="p-2">
        <Button type="button" variant="outline" size="sm" onClick={onAddRow}>
          Tambah Obat
        </Button>
      </CardFooter>
    </Card>
  );
}
