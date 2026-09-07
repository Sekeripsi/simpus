/**
 * ResultsView Component
 * Displayed after a search is performed — sidebar filter + results table.
 * Shows filter sidebar on the left and results on the right.
 */

"use client";

import { FilterSidebar } from "./filter/FilterSidebar";
import { ResultsTable } from "./ResultsTable";
import type { SearchFilters, RekamMedisResult } from "@/lib/types/rekam-medis";
import { Icon } from "@/components/shared/Icon";
import { AlertCircle } from "lucide-react";

interface Pagination {
  totalResults: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ResultsViewProps {
  filters: SearchFilters;
  results: RekamMedisResult[] | null;
  pagination: Pagination | null;
  error: string | null;
  userRole?: string | null;
}

/** @deprecated Use HasilRekamMedisPage instead */
export function ResultsView({
  filters,
  results,
  pagination,
  error,
  userRole,
}: ResultsViewProps) {
  return (
    <main className="flex-1 w-full flex flex-col lg:flex-row gap-6 items-start px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
      {/* Filter Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0">
        <FilterSidebar
          hasSearched={true}
          initialFilters={filters}
          totalResults={pagination?.totalResults ?? 0}
        />
      </div>

      {/* Results Table */}
      <div className="w-full flex-1">
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
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-300 rounded-lg p-4 text-red-800 max-w-sm z-50">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircle} size="sm" className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
