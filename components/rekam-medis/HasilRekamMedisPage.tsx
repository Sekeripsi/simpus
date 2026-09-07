"use client";

import Link from "next/link";
import type { SearchFilters, RekamMedisResult } from "@/lib/types/rekam-medis";
import { FilterSidebar } from "@/components/rekam-medis/filter/FilterSidebar";
import { ResultsTable } from "@/components/rekam-medis/ResultsTable";
import { Icon } from "@/components/shared/Icon";
import {
  AlertCircle,
  Search,
} from "lucide-react";
import { Card } from "../ui/card";

interface Pagination {
  totalResults: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface HasilRekamMedisPageProps {
  userRole?: string | null;
  filters: SearchFilters;
  results: RekamMedisResult[] | null;
  pagination: Pagination | null;
  error: string | null;
}

/** Summarize active filters for the subtitle ribbon */
function summarizeFilters(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.name) parts.push(`Nama: "${filters.name}"`);
  if (filters.nik) parts.push(`NIK: ${filters.nik}`);
  if (filters.layanan) {
    const labels: Record<string, string> = {
      umum: "Poli Umum",
      gigi: "Poli Gigi",
      kia: "KIA/KB",
      anak: "Poli Anak",
      igd: "IGD",
    };
    parts.push(labels[filters.layanan] ?? filters.layanan);
  }
  if (filters.tanggalRegistrasi)
    parts.push(`Tgl: ${filters.tanggalRegistrasi}`);
  if (filters.periodeStart || filters.periodeEnd) {
    parts.push(
      `Periode: ${filters.periodeStart ?? "..."} s/d ${filters.periodeEnd ?? "..."}`
    );
  }

  return parts.length > 0 ? parts.join("  ·  ") : "Semua data";
}

export function HasilRekamMedisPage({
  userRole,
  filters,
  results,
  pagination,
  error,
}: HasilRekamMedisPageProps) {
  const filterSummary = summarizeFilters(filters);

  return (
    <div className="flex gap-2 min-w-0">
      <aside className="w-[300px] shrink-0 flex-col">
        <FilterSidebar
          initialFilters={filters}
          totalResults={pagination?.totalResults ?? 0}
        />
      </aside>

      {/* Results Area */}
      <div className="flex-1 min-w-0">
        <ResultsTable
          results={results ?? []}
          totalResults={pagination?.totalResults ?? 0}
          currentPage={pagination?.currentPage ?? 1}
          pageSize={pagination?.pageSize ?? 10}
          totalPages={pagination?.totalPages ?? 0}
          hasNextPage={pagination?.hasNextPage ?? false}
          hasPreviousPage={pagination?.hasPreviousPage ?? false}
          userRole={userRole}
          currentFilters={filters}
        />
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-300 rounded-lg p-4 text-red-800 max-w-sm z-50 shadow-lg">
          <div className="flex items-start gap-3">
            <Icon
              icon={AlertCircle}
              size="sm"
              className="text-red-600 shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
