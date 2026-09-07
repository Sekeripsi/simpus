/**
 * ResultsTable Component
 * Displays medical records search results in a paginated table.
 * Pagination navigates via URL query params (router.push).
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { RekamMedisResult, SearchFilters } from "@/lib/types/rekam-medis";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Search, Edit, CheckCircle } from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ResultsTableProps {
  results: RekamMedisResult[];
  isLoading?: boolean;
  totalResults: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  userRole?: string | null;
  currentFilters: SearchFilters;
}

/**
 * Map attendance status to Indonesian label and color
 */
function getAttendanceDisplay(status: string) {
  switch (status) {
    case "HADIR":
    case "hadir":
      return { label: "Hadir", color: "bg-green-100 text-green-800" };
    case "TIDAK_HADIR":
    case "tidak_hadir":
      return { label: "Tidak Hadir", color: "bg-gray-100 text-gray-800" };
    case "PEMBATALAN":
    case "pembatalan":
      return { label: "Pembatalan", color: "bg-yellow-100 text-yellow-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800" };
  }
}

/**
 * Map payment method to Indonesian and appropriate styling
 */
function getPaymentDisplay(method: string) {
  switch (method) {
    case "BPJS":
      return {
        label: "BPJS",
        color: "border-secondary/30 bg-secondary/10 text-secondary",
      };
    case "Mandiri":
    case "MANDIRI":
      return {
        label: "Mandiri",
        color: "border-primary/30 bg-primary/10 text-primary",
      };
    case "Asuransi":
    case "ASURANSI":
      return {
        label: "Asuransi",
        color: "border-secondary/40 bg-secondary/20 text-secondary",
      };
    default:
      return {
        label: method,
        color: "border-gray-200 bg-gray-50 text-gray-700",
      };
  }
}

/**
 * Get target status styling
 */
function getTargetStatusDisplay(status: string) {
  if (status === "-") {
    return { label: "-", color: "text-gray-500" };
  }
  switch (status) {
    case "HT":
      return { label: "HT", color: "bg-red-100 text-red-800" };
    case "DM":
      return { label: "DM", color: "bg-orange-100 text-orange-800" };
    case "HT_DM":
      return { label: "HT/DM", color: "bg-purple-100 text-purple-800" };
    default:
      return { label: status, color: "text-gray-500" };
  }
}

/**
 * Generate array of page numbers for pagination
 */
const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
]

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
}

/**
 * Build URL with current filters and a specific page number
 */
function buildPageUrl(
  filters: SearchFilters,
  page: number,
  pageSize: number
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (key === "pageSize") {
      continue;
    }

    if (typeof value === "string" && value.trim()) {
      params.set(key, value.trim());
    }
  }

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  return `/rekam-medis?${params.toString()}`;
}

export function ResultsTable({
  results,
  isLoading = false,
  totalResults,
  currentPage,
  pageSize,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  userRole,
  currentFilters,
}: ResultsTableProps) {
  const router = useRouter();
  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalResults);

  const canEdit = userRole !== "DOCTOR";

  const handleEdit = useCallback(
    (recordId: string) => {
      router.push(`/rekam-medis/${recordId}`);
    },
    [router]
  );

  /** Navigate to a specific page via URL */
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        router.push(buildPageUrl(currentFilters, page, pageSize));
      }
    },
    [router, currentFilters, totalPages, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      const nextPageSize = parseInt(value, 10);
      router.push(buildPageUrl(currentFilters, 1, nextPageSize));
    },
    [router, currentFilters]
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="transition-all duration-700 ease-in-out flex-1 w-full flex flex-col gap-4 opacity-100 translate-y-0 relative z-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-100 h-16"></div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="transition-all duration-700 ease-in-out flex-1 min-w-0 w-full flex flex-col gap-4 opacity-100 translate-y-0 relative z-0 overflow-hidden">
      {/* Header */}
      <CardHeader className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <Icon icon={Database} size="sm" className="text-primary" />
          Hasil Pencarian
        </h3>
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 px-2.5 py-1 text-xs font-bold shadow-sm"
        >
          {totalResults} data ditemukan
        </Badge>
      </CardHeader>

      {/* Table */}
      <div className="max-h-[calc(100vh-18rem)] overflow-x-auto overflow-y-auto">
        <Table className="min-w-full divide-y divide-gray-200 text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Tgl Kunjungan
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                No. Antrian
              </TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Kehadiran
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                No. RM
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Nama Pasien
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Kelamin/Umur
              </TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Sasaran HT/DM
              </TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Prolanis
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Pembayaran
              </TableHead>
              <TableHead className="px-4 py-4 text-right font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="px-6 py-12 text-center">
                  <div className="text-gray-500 text-sm">
                    <Icon icon={Search} size="xl" className="mx-auto text-gray-400 mb-4" />
                    <p className="font-medium">Tidak ada data ditemukan</p>
                    <p className="text-xs text-gray-400">
                      Coba ubah filter pencarian Anda
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              results.map((record) => {
                const attendance = getAttendanceDisplay(record.kehadiran);
                const payment = getPaymentDisplay(record.pembayaran);
                const targetStatus = getTargetStatusDisplay(record.targetHtDm);

                return (
                  <TableRow key={record.id} className="hover:bg-primary/10 transition-colors">
                    <TableCell className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {record.tanggalKunjungan}
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap font-bold text-primary">
                      {record.nomorAntrian}
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-center">
                      <Badge className={attendance.color}>{attendance.label}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {record.nik}
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{record.namaPasien}</div>
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {record.kelamin} / {record.umur} Thn
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-center">
                      {targetStatus.label === "-" ? (
                        <span className="text-white">-</span>
                      ) : (
                        <Badge className="text-white">{targetStatus.label}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-center text-gray-500">
                      -
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={payment.color}>
                        {payment.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {record.status === "SELESAI" ? (
                          <Badge
                            variant="outline"
                            className="bg-success-100 text-success-700 border-primary text-xs font-semibold px-2.5 py-1.5"
                          >
                            <Icon icon={CheckCircle} size="sm" className="text-primary" />
                            <p className="text-primary">Selesai</p>
                          </Badge>
                        ) : canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record.id)}
                            className="h-auto text-secondary hover:text-secondary bg-secondary/10 px-2.5 py-1.5 rounded hover:bg-secondary/20 transition-colors tooltip flex items-center gap-1"
                            title="Ubah"
                          >
                            <Icon icon={Edit} size="sm" />
                            Ubah
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {results.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
          <div>
            Menampilkan {startRecord} hingga {endRecord} dari {totalResults} Entri
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-xs text-gray-600">
                Tampilkan
              </label>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-500">/ halaman</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="px-3 py-1.5 border border-gray-200 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </Button>
              {pageNumbers.map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-3 py-1.5 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    className={`px-3 py-1.5 border rounded transition-colors ${currentPage === page
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1.5 border border-gray-200 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
