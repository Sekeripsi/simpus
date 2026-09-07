"use client"

import { useCallback, useEffect, useState } from "react"
import type { CreatePatientInput, UpdatePatientInput } from "@/lib/validations/patient"
import type { CreateMedicalRecordInput } from "@/lib/validations/rekam-medis"
import type {
  PatientListResponse,
  PendaftaranPatientsInitialData,
  PendaftaranPatientsState,
  PatientSearchFilters,
} from "@/lib/types/pendaftaran"

interface ApiErrorResponse {
  error?: string
}

const EMPTY_FILTERS: PatientSearchFilters = {
  nik: "",
  jenisKelamin: "",
  alamatKtp: "",
  noKk: "",
  nama: "",
  tanggalLahir: "",
  alamatDomisili: "",
  noTlp: "",
  noJkn: "",
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse
    return data.error || fallback
  } catch {
    return fallback
  }
}

export function usePendaftaranPatients(initialData?: PendaftaranPatientsInitialData) {
  const [state, setState] = useState<PendaftaranPatientsState>({
    items: initialData?.items ?? [],
    page: initialData?.page ?? 1,
    pageSize: initialData?.pageSize ?? 10,
    total: initialData?.total ?? 0,
    totalPages: initialData?.totalPages ?? 0,
    filters: EMPTY_FILTERS,
    loading: false,
    error: null,
  })

  const load = useCallback(async (targetPage: number, filters: PatientSearchFilters) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: String(state.pageSize),
      })

      const entries = Object.entries(filters) as [keyof PatientSearchFilters, string][]

      entries.forEach(([key, value]) => {
        const trimmedValue = value.trim()
        if (trimmedValue) {
          params.set(key, trimmedValue)
        }
      })

      const response = await fetch(`/api/patients?${params.toString()}`)
      const data = (await response.json()) as PatientListResponse

      if (!response.ok || !data.success) {
        throw new Error("Gagal memuat data pasien")
      }

      setState((prev) => ({
        ...prev,
        items: data.data,
        page: data.pagination.page,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        filters,
        loading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      }))
    }
  }, [state.pageSize])

  useEffect(() => {
    if (initialData) {
      return
    }

    void load(1, EMPTY_FILTERS)
  }, [initialData, load])

  const createPatient = useCallback(async (payload: CreatePatientInput) => {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Gagal membuat pasien"))
    }

    await load(state.page, state.filters)
  }, [load, state.page, state.filters])

  const updatePatient = useCallback(async (id: string, payload: UpdatePatientInput) => {
    const response = await fetch(`/api/patients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Gagal mengubah data pasien"))
    }

    await load(state.page, state.filters)
  }, [load, state.page, state.filters])

  const deletePatient = useCallback(async (id: string) => {
    const response = await fetch(`/api/patients/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Gagal menghapus data pasien"))
    }

    await load(state.page, state.filters)
  }, [load, state.page, state.filters])

  const registerVisit = useCallback(async (payload: CreateMedicalRecordInput) => {
    const response = await fetch("/api/rekam-medis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Gagal mendaftarkan kunjungan")
    }

    await load(state.page, state.filters)
    return data.data
  }, [load, state.page, state.filters])

  return {
    state,
    reload: () => load(state.page, state.filters),
    search: (filters: PatientSearchFilters) => load(1, filters),
    goToPage: (page: number) => load(page, state.filters),
    createPatient,
    updatePatient,
    deletePatient,
    registerVisit,
  }
}
