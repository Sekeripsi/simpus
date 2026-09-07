/**
 * SearchFilters Component
 * Form for entering medical records search filters.
 * On submit, pushes filters to URL query params via router.push().
 * On reset, navigates to /rekam-medis (clears all params).
 */

"use client";

import { useState, useCallback, FormEvent, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { SearchFilters } from "@/lib/types/rekam-medis";
import { searchFiltersSchema } from "@/lib/validations/rekam-medis";
import { ZodError } from "zod";
import { Icon } from "@/components/shared/Icon";
import { Loader2, Search } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TanggalRegistrasi from "./fields/TanggalRegistrasi";
import NomorRM from "./fields/NomorRM";
import NamaPasien from "./fields/NamaPasien";
import Klinik from "./fields/Klinik";
import PeriodeRegistrasi from "./fields/PeriodeRegistrasi";

interface SearchFiltersProps {
  hasSearched?: boolean;
  initialFilters?: SearchFilters;
}

export interface FieldErrors {
  [key: string]: string[];
}

/**
 * Build a URL search string from filters, omitting empty values.
 */
function buildSearchParams(filters: SearchFilters): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string" && value.trim()) {
      const normalizedValue = value.trim();

      if (key === "layanan" && normalizedValue.toLowerCase() === "semua") {
        continue;
      }

      params.set(key, normalizedValue);
    } else if (typeof value === "boolean" && value) {
      params.set(key, "true");
    }
  }

  // Always reset to page 1 when filters change
  params.set("page", "1");

  return params.toString();
}

export function SearchFiltersForm({
  hasSearched = false,
  initialFilters = {},
}: SearchFiltersProps) {
  const router = useRouter();

  // Form state — initialized from URL params (via server props)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change with real-time error clearing
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const type = target.type;

      const value =
        type === "checkbox" && target instanceof HTMLInputElement
          ? target.checked
          : target.value;

      setFilters((prev) => ({
        ...prev,
        [name]: typeof value === "string" ? value || undefined : value,
      }));

      // Clear error for this field when user starts typing
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [fieldErrors]
  );

  const handleSelectChange = useCallback(
    (name: keyof SearchFilters, value: string | null) => {
      const normalizedValue = !value || value === "semua" ? undefined : value;

      setFilters((prev) => ({
        ...prev,
        [name]: normalizedValue,
      }));

      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [fieldErrors]
  );

  /**
   * Handle form submission — validate, then push to URL
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Only apply date filters if their respective checkboxes are checked
        const filtersToValidate = { ...filters };
        if (!filtersToValidate.enableTanggalRegistrasi) {
          delete filtersToValidate.tanggalRegistrasi;
        }
        if (!filtersToValidate.enablePeriodeRegistrasi) {
          delete filtersToValidate.periodeStart;
          delete filtersToValidate.periodeEnd;
        }

        if (filtersToValidate.layanan?.toLowerCase() === "semua") {
          delete filtersToValidate.layanan;
        }

        // Validate filters with Zod (Zod will strip the enable fields since they aren't in the schema, which is perfect)
        const validatedFilters = searchFiltersSchema.parse(filtersToValidate);

        // Clear any previous errors
        setFieldErrors({});

        // Merge back the enable flags so they appear in the URL
        const filtersForUrl = {
          ...validatedFilters,
          enableTanggalRegistrasi: filters.enableTanggalRegistrasi,
          enablePeriodeRegistrasi: filters.enablePeriodeRegistrasi,
        };

        // Build query string and navigate
        const queryString = buildSearchParams(filtersForUrl);
        router.push(`/rekam-medis?${queryString}`);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.flatten().fieldErrors as FieldErrors;
          setFieldErrors(errors);
        } else {
          console.error("Form submission error:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [filters, router]
  );

  /**
   * Handle form reset — navigate to base URL (clears all params)
   */
  const handleReset = useCallback(() => {
    setFilters({});
    setFieldErrors({});
    router.push("/rekam-medis");
  }, [router]);

  const dateRange = useMemo<DateRange | undefined>(() => {
    if (!filters.periodeStart && !filters.periodeEnd) return undefined;
    return {
      from: filters.periodeStart
        ? parse(filters.periodeStart, "yyyy-MM-dd", new Date())
        : undefined,
      to: filters.periodeEnd
        ? parse(filters.periodeEnd, "yyyy-MM-dd", new Date())
        : undefined,
    };
  }, [filters.periodeStart, filters.periodeEnd]);

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (range?.from) {
          newFilters.periodeStart = format(range.from, "yyyy-MM-dd");
        } else {
          delete newFilters.periodeStart;
        }

        if (range?.to) {
          newFilters.periodeEnd = format(range.to, "yyyy-MM-dd");
        } else {
          delete newFilters.periodeEnd;
        }

        return newFilters;
      });

      if (fieldErrors.periodeStart || fieldErrors.periodeEnd) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.periodeStart;
          delete newErrors.periodeEnd;
          return newErrors;
        });
      }
    },
    [fieldErrors.periodeStart, fieldErrors.periodeEnd]
  );

  const layananValue = filters.layanan || "semua";

  /**
   * Render error message for a field
   */
  const renderError = (fieldName: string) => {
    const errors = fieldErrors[fieldName];
    if (!errors || errors.length === 0) return null;

    return <p className="text-xs text-red-600 mt-1 font-medium">{errors[0]}</p>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kriteria Pencarian</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 flex-1"
        >

          <div className="flex flex-col gap-4 flex-1">
            <TanggalRegistrasi
              filters={filters}
              setFilters={setFilters}
              renderError={renderError}
            />

            <NomorRM
              filters={filters}
              setFilters={setFilters}
              renderError={renderError}
              handleChange={handleChange}
              fieldErrors={fieldErrors}
            />

            <NamaPasien
              filters={filters}
              setFilters={setFilters}
              renderError={renderError}
              handleChange={handleChange}
              fieldErrors={fieldErrors}
            />

            <Klinik
              filters={filters}
              setFilters={setFilters}
              renderError={renderError}
              handleChange={handleChange}
              fieldErrors={fieldErrors}
              handleSelectChange={handleSelectChange}
            />

            <PeriodeRegistrasi
              filters={filters}
              setFilters={setFilters}
              renderError={renderError}
              fieldErrors={fieldErrors}
              hasSearched={hasSearched}
              dateRange={dateRange}
              handleDateRangeChange={handleDateRangeChange}
            />
          </div>

          {/* Submit / Reset Actions */}
          <div
            className={`mt-2 flex flex-col-reverse justify-end gap-3 pt-4 border-t border-gray-100 ${hasSearched ? "" : "md:col-span-2 sm:flex-row"
              }`}
          >
            <Button
              type="reset"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-300 shadow-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Icon icon={Loader2} size="sm" className="animate-spin" />
                  {hasSearched ? "Menerapkan..." : "Mencari..."}
                </>
              ) : (
                <>
                  <Icon icon={Search} size="sm" />
                  {hasSearched ? "Terapkan" : "Cari Data RM"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
