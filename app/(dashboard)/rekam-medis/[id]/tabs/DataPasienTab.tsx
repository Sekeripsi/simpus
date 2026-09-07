import { DetailRowsTable } from "./DetailRowsTable";
import type { DetailRow } from "./types";

interface DataPasienTabProps {
  rows: DetailRow[];
}

export function DataPasienTab({ rows }: DataPasienTabProps) {
  return (
    <DetailRowsTable rows={rows} />
  );
}
