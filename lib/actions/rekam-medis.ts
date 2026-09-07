"use server";

import { searchFiltersSchema, paginationSchema } from "@/lib/validations/rekam-medis";
import { SearchFilters } from "@/lib/types/rekam-medis";
import { getBackendUrl } from "@/lib/config/api";
import { getServerToken } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { ZodError } from "zod";

interface SearchResult {
  id: string;
  tanggalKunjungan: string;
  nomorAntrian: string;
  kehadiran: string;
  nik: string;
  namaPasien: string;
  kelamin: string;
  umur: number;
  targetHtDm: string;
  pembayaran: string;
}

interface SearchActionResponse {
  success: boolean;
  data?: {
    results: SearchResult[];
    pagination: {
      totalResults: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const API_BASE_URL = getBackendUrl();

export async function searchRekamMedis(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchActionResponse> {
  try {
    const validatedFilters = searchFiltersSchema.parse(filters);
    const validatedPagination = paginationSchema.parse({ page, pageSize });

    const params = new URLSearchParams();
    if (validatedFilters.name) params.set("name", validatedFilters.name);
    if (validatedFilters.nik) params.set("nik", validatedFilters.nik);
    if (validatedFilters.layanan) params.set("layanan", validatedFilters.layanan);
    if (validatedFilters.tanggalRegistrasi) params.set("tanggalRegistrasi", validatedFilters.tanggalRegistrasi);
    if (validatedFilters.periodeStart) params.set("periodeStart", validatedFilters.periodeStart);
    if (validatedFilters.periodeEnd) params.set("periodeEnd", validatedFilters.periodeEnd);
    params.set("page", String(validatedPagination.page));
    params.set("pageSize", String(validatedPagination.pageSize));

    const token = await getServerToken()
    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/rekam-medis/search?${params.toString()}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || "Gagal mengambil data rekam medis",
      };
    }

    const json = await res.json();
    return {
      success: true,
      data: {
        results: json.data ?? [],
        pagination: json.pagination ?? {
          totalResults: 0,
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "Validasi filter gagal",
        fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    logger.error("[searchRekamMedis] Error:", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Terjadi kesalahan saat mencari data rekam medis",
    };
  }
}
