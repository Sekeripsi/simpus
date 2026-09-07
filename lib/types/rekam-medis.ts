/**
 * Type definitions for Rekam Medis (Medical Records) feature
 * Covers search filters, results, and state management
 * 
 * Updated to match normalized schema with related tables
 */

/** Enum for clinic/polyclinic types */
export enum Layanan {
  LANSIA = "lansia",
  INFEKSIUS_A = "infeksius_a",
  INFEKSIUS_B = "infeksius_b",
  INFEKSIUS_C = "infeksius_c",
  NON_INFEKSIUS_A = "non_infeksius_a",
  NON_INFEKSIUS_B = "non_infeksius_b",
  NON_INFEKSIUS_C = "non_infeksius_c",
  UGD = "ugd",
  GIGI = "gigi",
  KIA = "kia",
  UMUM = "umum",
}

/** Enum for attendance status */
export enum AttendanceStatus {
  HADIR = "HADIR",
  TIDAK_HADIR = "TIDAK_HADIR",
  PEMBATALAN = "PEMBATALAN",
}

/** Enum for HT/DM (Hypertension/Diabetes Mellitus) status */
export enum TargetStatus {
  TIDAK = "TIDAK",
  HT = "HT",
  DM = "DM",
  HT_DM = "HT_DM",
}

/** Enum for payment method */
export enum PaymentMethod {
  BPJS = "BPJS",
  MANDIRI = "MANDIRI",
  ASURANSI = "ASURANSI",
}

/** Search filter input from user */
export interface SearchFilters {
  name?: string;
  nik?: string;
  layanan?: string;
  enableTanggalRegistrasi?: boolean;
  tanggalRegistrasi?: string;
  enablePeriodeRegistrasi?: boolean;
  periodeStart?: string;
  periodeEnd?: string;
  pageSize?: string;
}

/** Single medical record/visit result */
export interface RekamMedisResult {
  id: string;
  tanggalKunjungan: string; // "23 Mar 2026"
  nomorAntrian: string; // "A-001"
  kehadiran: AttendanceStatus;
  nik: string;
  namaPasien: string;
  kelamin: string; // "L" or "P"
  umur: number; // in years
  targetHtDm: TargetStatus;
  pembayaran: PaymentMethod;
  status: "DRAFT" | "SELESAI";
  // Additional metadata
  createdAt?: string;
  updatedAt?: string;
}

/** API response format for search results */
export interface SearchResponse {
  data: RekamMedisResult[];
  pagination: {
    totalResults: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/** Error response format */
export interface ErrorResponse {
  error: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
  details?: string;
}

/** Search state managed by hook */
export interface SearchState {
  hasSearched: boolean;
  results: RekamMedisResult[];
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  totalResults: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

/** Hook return type for useRekamMedisSearch */
export interface UseRekamMedisSearchReturn {
  state: SearchState;
  search: (filters: SearchFilters) => Promise<void>;
  reset: () => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}
