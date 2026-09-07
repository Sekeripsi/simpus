/**
 * Zod validation schemas for Medical Records (Rekam Medis)
 * Provides type-safe validation for CRUD operations and search
 * 
 * Updated to match normalized schema with separate related tables:
 * Pendaftaran, KajianAwal, Anamnesis, Pemeriksaan, Diagnosis,
 * Tindakan, Pengobatan, PulangRujuk, Asuhan, Lab, CatatanDokter
 */

import { z } from "zod";

// --- Pendaftaran (Registration) sub-schema ---
export const pendaftaranSchema = z.object({
  tglKunjungan: z
    .string()
    .datetime("Invalid visit date format")
    .or(z.coerce.date())
    .optional(),
  noAntrian: z
    .string()
    .min(1, "Nomor antrian is required")
    .max(20, "Nomor antrian must not exceed 20 characters"),
  unitLayanan: z
    .string()
    .max(100, "Unit layanan must not exceed 100 characters")
    .default(""),
  jenisLayanan: z
    .string()
    .max(100, "Jenis layanan must not exceed 100 characters")
    .default(""),
  noRegis: z
    .string()
    .max(50, "Nomor registrasi must not exceed 50 characters")
    .default(""),
  poliklinik: z
    .enum(["LANSIA", "INFEKSIUS_A", "INFEKSIUS_B", "INFEKSIUS_C", "NON_INFEKSIUS_A", "NON_INFEKSIUS_B", "NON_INFEKSIUS_C", "UGD", "GIGI", "KIA", "UMUM"], { message: "Poliklinik tidak valid" }),
  kehadiran: z
    .enum(["HADIR", "TIDAK_HADIR", "PEMBATALAN"], { message: "Status kehadiran tidak valid" }),
  targetStatus: z
    .enum(["TIDAK", "HT", "DM", "HT_DM"], { message: "Target status tidak valid" })
    .default("TIDAK"),
  pembayaran: z
    .enum(["BPJS", "MANDIRI", "ASURANSI"], { message: "Metode pembayaran tidak valid" }),
  catatan: z
    .string()
    .max(500, "Catatan must not exceed 500 characters")
    .optional(),
});

// --- KajianAwal sub-schema ---
const kajianAwalSchema = z.object({
  alergi: z.string().optional(),
  riwayatPenyakitDahulu: z.string().optional(),
  riwayatPenyakitKeluarga: z.string().optional(),
}).partial();

// --- Anamnesis sub-schema ---
const anamnesisSchema = z.object({
  keluhan: z.string().optional(),
}).partial();

// --- Pemeriksaan sub-schema ---
const pemeriksaanSchema = z.object({
  keadaan: z.string().optional(),
  kesadaran: z.enum(["KOMPOS_MENTIS", "APATIS", "SOMNOLENT", "SOPOR", "KOMA"]).optional(),
  respirasi: z.number().int().optional(),
  suhu: z.number().optional(),
  nadi: z.number().int().optional(),
  sistol: z.number().int().optional(),
  diastol: z.number().int().optional(),
}).partial();

// --- Diagnosis sub-schema ---
const diagnosisSchema = z.object({
  diagnosis: z.string().optional(),
  kodeIcd: z.string().max(50).optional(),
}).partial();

// --- Tindakan sub-schema ---
const tindakanSchema = z.object({
  tindakan: z.string().optional(),
}).partial();

// --- Pengobatan sub-schema ---
const pengobatanSchema = z.object({
  pengobatan: z.any().optional(), // JSON field
}).partial();

// --- PulangRujuk sub-schema ---
const pulangRujukSchema = z.object({
  tglPulang: z.string().datetime().or(z.coerce.date()).optional(),
  statusPulang: z.enum(["SEMBUH", "MEMBAIK", "KONTROL", "RUJUK", "MENINGGAL"]).optional(),
  kie: z.string().optional(),
  plan: z.string().optional(),
  rencKunjBerikutnya: z.string().datetime().or(z.coerce.date()).optional(),
  rencPemeriksaan6Bln: z.string().datetime().or(z.coerce.date()).optional(),
  rujukInternal: z.string().optional(),
  rujukEksternal: z.string().optional(),
}).partial();

// --- Asuhan sub-schema ---
const asuhanSchema = z.object({
  diagnosaData: z.string().optional(),
  diagnosa: z.string().optional(),
  intervensi: z.string().optional(),
  implementasi: z.string().optional(),
  evaluasi: z.string().optional(),
}).partial();

// --- Lab sub-schema ---
const labSchema = z.object({
  permintaanPemeriksaan: z.string().optional(),
}).partial();

// --- CatatanDokter sub-schema ---
const catatanDokterSchema = z.object({
  catatan: z.string().optional(),
}).partial();

/** Schema for creating a medical record (RekamMedis) */
export const createMedicalRecordSchema = z.object({
  pasienId: z.string().min(1, "Patient ID is required"),
  pendaftaran: pendaftaranSchema,
  kajianAwal: kajianAwalSchema.optional(),
  anamnesis: anamnesisSchema.optional(),
  pemeriksaan: pemeriksaanSchema.optional(),
  diagnosis: diagnosisSchema.optional(),
  tindakan: tindakanSchema.optional(),
  pengobatan: pengobatanSchema.optional(),
  pulangRujuk: pulangRujukSchema.optional(),
  asuhan: asuhanSchema.optional(),
  lab: labSchema.optional(),
  catatanDokter: catatanDokterSchema.optional(),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;

/** Schema for updating a medical record */
export const updateMedicalRecordSchema = z.object({
  pendaftaran: pendaftaranSchema.partial().optional(),
  kajianAwal: kajianAwalSchema.optional(),
  anamnesis: anamnesisSchema.optional(),
  pemeriksaan: pemeriksaanSchema.optional(),
  diagnosis: diagnosisSchema.optional(),
  tindakan: tindakanSchema.optional(),
  pengobatan: pengobatanSchema.optional(),
  pulangRujuk: pulangRujukSchema.optional(),
  asuhan: asuhanSchema.optional(),
  lab: labSchema.optional(),
  catatanDokter: catatanDokterSchema.optional(),
});

export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;

/** Schema for medical record ID validation */
export const medicalRecordIdSchema = z.object({
  id: z.string().uuid("Invalid medical record ID"),
});

export type MedicalRecordIdInput = z.infer<typeof medicalRecordIdSchema>;

/** Schema for search filter inputs - all fields optional for flexibility */
export const searchFiltersSchema = z.object({
  name: z
    .string()
    .max(100, "Nama pasien maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  nik: z
    .string()
    .max(32, "NIK maksimal 32 karakter")
    .optional()
    .or(z.literal("")),
  layanan: z
    .string()
    .refine(
      (val) => !val || ["lansia", "infeksius_a", "infeksius_b", "infeksius_c", "non_infeksius_a", "non_infeksius_b", "non_infeksius_c", "ugd", "gigi", "kia", "umum"].includes(val.toLowerCase()),
      "Poliklinik tidak valid"
    )
    .optional()
    .or(z.literal("")),
  tanggalRegistrasi: z
    .string()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Format tanggal tidak valid (YYYY-MM-DD)"
    )
    .optional()
    .or(z.literal("")),
  periodeStart: z
    .string()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Format tanggal mulai tidak valid (YYYY-MM-DD)"
    )
    .optional()
    .or(z.literal("")),
  periodeEnd: z
    .string()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Format tanggal selesai tidak valid (YYYY-MM-DD)"
    )
    .optional()
    .or(z.literal("")),
})
  .refine(
    (data) => {
      // If periodeStart exists, periodeEnd must also exist
      if (data.periodeStart && !data.periodeEnd) {
        return false;
      }
      // If periodeEnd exists, periodeStart must also exist
      if (data.periodeEnd && !data.periodeStart) {
        return false;
      }
      return true;
    },
    {
      message: "Tanggal mulai dan selesai harus diisi bersama",
      path: ["periodeStart"], // This will show the error on periodeStart field
    }
  )
  .refine(
    (data) => {
      // Start date must be before end date
      if (data.periodeStart && data.periodeEnd) {
        const start = new Date(data.periodeStart);
        const end = new Date(data.periodeEnd);
        if (start > end) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Tanggal mulai harus sebelum tanggal selesai",
      path: ["periodeEnd"],
    }
  );

/** Type inference from schema */
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;

/** Schema for pagination parameters */
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .min(1, "Halaman harus >= 1")
    .default(1),
  pageSize: z.coerce
    .number()
    .min(1, "Ukuran halaman harus >= 1")
    .max(100, "Ukuran halaman maksimal 100")
    .default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/** Combined schema for API requests */
export const searchRekamMedisRequestSchema = searchFiltersSchema.merge(
  paginationSchema
);

export type SearchRekamMedisRequest = z.infer<
  typeof searchRekamMedisRequestSchema
>;

/** Schema for validating single result (used in mock data) */
export const rekamMedisResultSchema = z.object({
  id: z.string().uuid("ID harus berupa UUID"),
  tanggalKunjungan: z.string(),
  nomorAntrian: z.string(),
  kehadiran: z.enum(["HADIR", "TIDAK_HADIR", "PEMBATALAN"]),
  nik: z.string(),
  namaPasien: z.string(),
  kelamin: z.enum(["L", "P"]),
  umur: z.number().min(0).max(150),
  targetHtDm: z.enum(["TIDAK", "HT", "DM", "HT_DM"]),
  pembayaran: z.enum(["BPJS", "MANDIRI", "ASURANSI"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type RekamMedisResultType = z.infer<typeof rekamMedisResultSchema>;

/** Schema for search response */
export const searchResponseSchema = z.object({
  data: z.array(rekamMedisResultSchema),
  pagination: z.object({
    totalResults: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type SearchResponseType = z.infer<typeof searchResponseSchema>;

/** Schema for error responses */
export const errorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
  details: z.string().optional(),
});

export type ErrorResponseType = z.infer<typeof errorResponseSchema>;
