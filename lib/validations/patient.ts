import { z } from "zod"

export const AGAMA_OPTIONS = [
  "ISLAM",
  "KRISTEN",
  "KATOLIK",
  "HINDU",
  "BUDDHA",
  "KONGHUCU",
] as const

export const STATUS_KAWIN_OPTIONS = [
  "BELUM_KAWIN",
  "KAWIN",
  "CERAI_HIDUP",
  "CERAI_MATI",
] as const

export const LAYANAN_DIFABEL_OPTIONS = ["YA", "TIDAK"] as const

export const GOL_DARAH_OPTIONS = ["A", "B", "AB", "O"] as const
export const RHESUS_OPTIONS = ["POSITIF", "NEGATIF"] as const

export const createPatientSchema = z.object({
  nik: z
    .string()
    .min(1, "NIK is required")
    .max(32, "NIK must not exceed 32 characters"),
  noKk: z
    .string()
    .min(1, "No KK is required")
    .max(32, "No KK must not exceed 32 characters"),
  noJkn: z
    .string()
    .min(1, "No JKN is required")
    .max(50, "No JKN must not exceed 50 characters"),
  catatanJkn: z
    .string()
    .max(191, "Catatan JKN must not exceed 191 characters")
    .default(""),
  noJamkesos: z
    .string()
    .min(1, "No Jamkesos is required")
    .max(50, "No Jamkesos must not exceed 50 characters"),
  catatanJamkesos: z
    .string()
    .max(191, "Catatan Jamkesos must not exceed 191 characters")
    .default(""),
  nama: z
    .string()
    .min(2, "Nama must be at least 2 characters")
    .max(100, "Nama must not exceed 100 characters"),
  jenisKelamin: z
    .enum(["L", "P"], { message: "Jenis kelamin must be either L or P" }),
  tempatLahir: z
    .string()
    .max(100, "Tempat lahir must not exceed 100 characters")
    .optional(),
  tanggalLahir: z
    .string()
    .datetime("Invalid birth date format")
    .or(z.coerce.date())
    .optional(),
  umur: z
    .number()
    .int()
    .min(0)
    .optional(),
  agama: z.enum(AGAMA_OPTIONS).optional(),
  statusKawin: z.enum(STATUS_KAWIN_OPTIONS).optional(),
  alamatTinggal: z
    .string()
    .max(191, "Alamat tinggal must not exceed 191 characters")
    .optional(),
  alamatKtp: z
    .string()
    .max(191, "Alamat KTP must not exceed 191 characters")
    .optional(),
  alamatDomisili: z
    .string()
    .max(191, "Alamat domisili must not exceed 191 characters")
    .optional(),
  provinsi: z
    .string()
    .max(150, "Provinsi must not exceed 150 characters")
    .optional(),
  kabupaten: z
    .string()
    .max(150, "Kabupaten must not exceed 150 characters")
    .optional(),
  kecamatan: z
    .string()
    .max(150, "Kecamatan must not exceed 150 characters")
    .optional(),
  kelurahanDesa: z
    .string()
    .max(150, "Kelurahan/Desa must not exceed 150 characters")
    .optional(),
  rtRw: z
    .string()
    .max(50, "RT/RW must not exceed 50 characters")
    .optional(),
  noTlp: z
    .string()
    .max(20, "No Telp must not exceed 20 characters")
    .optional(),
  pemilikNoTlp: z
    .string()
    .max(150, "Pemilik No Telp must not exceed 150 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .optional(),
  layananDifabel: z.enum(LAYANAN_DIFABEL_OPTIONS).optional(),
  pendidikan: z
    .string()
    .max(100, "Pendidikan must not exceed 100 characters")
    .optional(),
  pekerjaan: z
    .string()
    .max(100, "Pekerjaan must not exceed 100 characters")
    .optional(),
  golDarah: z.enum(GOL_DARAH_OPTIONS).optional(),
  rhesus: z.enum(RHESUS_OPTIONS).optional(),
  namaIbuKandung: z
    .string()
    .max(150, "Nama ibu kandung must not exceed 150 characters")
    .optional(),
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>

export const patientIdSchema = z.object({
  id: z.string().uuid("Invalid patient ID"),
})

export type PatientIdInput = z.infer<typeof patientIdSchema>

export const updatePatientSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama must be at least 2 characters")
    .max(100, "Nama must not exceed 100 characters")
    .optional(),
  jenisKelamin: z
    .enum(["L", "P"], { message: "Jenis kelamin must be either L or P" })
    .optional(),
  tempatLahir: z
    .string()
    .max(100, "Tempat lahir must not exceed 100 characters")
    .optional(),
  tanggalLahir: z
    .string()
    .datetime("Invalid birth date format")
    .or(z.coerce.date())
    .optional(),
  umur: z
    .number()
    .int()
    .min(0)
    .optional(),
  agama: z.enum(AGAMA_OPTIONS).optional(),
  statusKawin: z.enum(STATUS_KAWIN_OPTIONS).optional(),
  alamatTinggal: z
    .string()
    .max(191, "Alamat tinggal must not exceed 191 characters")
    .optional(),
  alamatKtp: z
    .string()
    .max(191, "Alamat KTP must not exceed 191 characters")
    .optional(),
  alamatDomisili: z
    .string()
    .max(191, "Alamat domisili must not exceed 191 characters")
    .optional(),
  provinsi: z
    .string()
    .max(150, "Provinsi must not exceed 150 characters")
    .optional(),
  kabupaten: z
    .string()
    .max(150, "Kabupaten must not exceed 150 characters")
    .optional(),
  kecamatan: z
    .string()
    .max(150, "Kecamatan must not exceed 150 characters")
    .optional(),
  kelurahanDesa: z
    .string()
    .max(150, "Kelurahan/Desa must not exceed 150 characters")
    .optional(),
  rtRw: z
    .string()
    .max(50, "RT/RW must not exceed 50 characters")
    .optional(),
  nik: z
    .string()
    .max(32, "NIK must not exceed 32 characters")
    .optional(),
  noKk: z
    .string()
    .max(32, "No KK must not exceed 32 characters")
    .optional(),
  noJkn: z
    .string()
    .max(50, "No JKN must not exceed 50 characters")
    .optional(),
  catatanJkn: z
    .string()
    .max(191, "Catatan JKN must not exceed 191 characters")
    .optional(),
  noJamkesos: z
    .string()
    .max(50, "No Jamkesos must not exceed 50 characters")
    .optional(),
  catatanJamkesos: z
    .string()
    .max(191, "Catatan Jamkesos must not exceed 191 characters")
    .optional(),
  layananDifabel: z.enum(LAYANAN_DIFABEL_OPTIONS).optional(),
  pendidikan: z
    .string()
    .max(100, "Pendidikan must not exceed 100 characters")
    .optional(),
  pekerjaan: z
    .string()
    .max(100, "Pekerjaan must not exceed 100 characters")
    .optional(),
  golDarah: z.enum(GOL_DARAH_OPTIONS).optional(),
  rhesus: z.enum(RHESUS_OPTIONS).optional(),
  namaIbuKandung: z
    .string()
    .max(150, "Nama ibu kandung must not exceed 150 characters")
    .optional(),
  noTlp: z
    .string()
    .max(20, "No Telp must not exceed 20 characters")
    .optional(),
  pemilikNoTlp: z
    .string()
    .max(150, "Pemilik No Telp must not exceed 150 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .optional(),
})

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
