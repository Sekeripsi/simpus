import type { Role } from "@/lib/types/role"

export interface PatientListItem {
  id: string
  nik: string
  noKk: string
  noJkn: string
  catatanJkn: string
  noJamkesos: string
  catatanJamkesos: string
  nama: string
  jenisKelamin: "L" | "P"
  tempatLahir?: string | null
  tanggalLahir?: string | null
  umur?: number | null
  agama?: string | null
  statusKawin?: string | null
  alamatTinggal?: string | null
  alamatKtp?: string | null
  alamatDomisili?: string | null
  provinsi?: string | null
  kabupaten?: string | null
  kecamatan?: string | null
  kelurahanDesa?: string | null
  rtRw?: string | null
  noTlp?: string | null
  pemilikNoTlp?: string | null
  email?: string | null
  layananDifabel?: string | null
  pendidikan?: string | null
  pekerjaan?: string | null
  golDarah?: string | null
  rhesus?: string | null
  namaIbuKandung?: string | null
  createdAt: string
  updatedAt: string
}

export interface PatientListResponse {
  success: boolean
  data: PatientListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface PatientSearchFilters {
  nik: string
  jenisKelamin: "" | "L" | "P"
  alamatKtp: string
  noKk: string
  nama: string
  tanggalLahir: string
  alamatDomisili: string
  noTlp: string
  noJkn: string
}

export interface PendaftaranUser {
  name?: string | null
  username?: string | null
  role: Role
}

export interface PendaftaranPatientsState {
  items: PatientListItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  filters: PatientSearchFilters
  loading: boolean
  error: string | null
}

export interface PendaftaranPatientsInitialData {
  items: PatientListItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
