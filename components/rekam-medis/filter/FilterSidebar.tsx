/**
 * FilterSidebar Component
 * Wraps SearchFilters in a responsive sidebar
 * Sticky on desktop, collapsible drawer on mobile
 */

"use client";

import type { SearchFilters } from "@/lib/types/rekam-medis";
import { SearchFiltersForm } from "./SearchFilters";
import { Card, CardContent } from "@/components/ui/card";

interface FilterSidebarProps {
  hasSearched?: boolean;
  initialFilters?: SearchFilters;
  totalResults?: number;
}

export function FilterSidebar({
  hasSearched = false,
  initialFilters = {},
}: FilterSidebarProps) {
  return (
    <SearchFiltersForm
      hasSearched={hasSearched}
      initialFilters={initialFilters}
    />
  );
}
