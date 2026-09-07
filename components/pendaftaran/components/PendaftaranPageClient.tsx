"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { Role } from "@/lib/types/role"
import { AlertCircle } from "lucide-react"
import type {
  CreatePatientInput,
  UpdatePatientInput,
} from "@/lib/validations/patient"
import type { CreateMedicalRecordInput } from "@/lib/validations/rekam-medis"
import type {
  PatientSearchFilters,
  PendaftaranPatientsInitialData,
} from "@/lib/types/pendaftaran"
import { Icon } from "@/components/shared/Icon"
import { canCreate } from "@/lib/permissions-client"
import { usePendaftaranPatients } from "@/hooks/usePendaftaranPatients"
import { PatientTable } from "@/components/pendaftaran/components/PatientTable"
import { PatientActionMenu } from "@/components/pendaftaran/components/PatientActionMenu"
import { RegisterVisitDialog } from "@/components/pendaftaran/components/RegisterVisitDialog"
import { PatientFilterSidebar } from "@/components/pendaftaran/components/PatientFilterSidebar"

interface PendaftaranPageClientProps {
  userRole?: Role | null
  initialData?: PendaftaranPatientsInitialData
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "Terjadi kesalahan"
}

const INITIAL_FILTERS: PatientSearchFilters = {
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

export function PendaftaranPageClient({
  userRole,
  initialData,
}: PendaftaranPageClientProps) {
  const router = useRouter()
  const canAddData = userRole ? canCreate(userRole) : false
  const {
    state,
    search,
    goToPage,
    updatePatient,
    deletePatient,
    registerVisit,
  } = usePendaftaranPatients(initialData)

  const [filters, setFilters] = useState<PatientSearchFilters>(INITIAL_FILTERS)
  const [operationError, setOperationError] = useState<string | null>(null)
  const [registerPatientId, setRegisterPatientId] = useState<string | null>(null)

  const handleFilterChange = (key: keyof PatientSearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    void search(INITIAL_FILTERS)
  }

  const handleDeletePatient = async (patientId: string) => {
    if (!window.confirm("Hapus data pasien ini?")) {
      return
    }

    try {
      await deletePatient(patientId)
      setOperationError(null)
    } catch (error) {
      setOperationError(toErrorMessage(error))
    }
  }

  const handleRegisterVisit = async (payload: CreateMedicalRecordInput) => {
    try {
      const result = await registerVisit(payload)
      setOperationError(null)

      // Redirect to the newly created medical record detail page
      if (result?.id) {
        router.push(`/rekam-medis/${result.id}`)
      }
    } catch (error) {
      const message = toErrorMessage(error)
      setOperationError(message)
      throw error
    }
  }

  return (
    <div className="flex gap-2 min-w-0 transition-all duration-500">
      <PatientFilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={() => void search(filters)}
        onReset={handleResetFilters}
        onAddData={() => router.push("/pendaftaran/baru")}
        canAddData={canAddData}
      />

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {(state.error || operationError) && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg px-4 py-3 text-danger-700 text-sm flex items-start gap-2">
            <Icon icon={AlertCircle} size="sm" className="mt-0.5 shrink-0" />
            <span>{state.error || operationError}</span>
          </div>
        )}

        <PatientTable
          items={state.items}
          loading={state.loading}
          page={state.page}
          total={state.total}
          totalPages={state.totalPages}
          onPageChange={(page) => void goToPage(page)}
            renderActions={(patient) => (
            <PatientActionMenu
              role={userRole ?? "STAFF"}
              patient={patient}
              onEdit={(id) => router.push(`/pendaftaran/pasien/${id}/edit`)}
              onDelete={(id) => {
                void handleDeletePatient(id)
              }}
              onRegister={(id) => setRegisterPatientId(id)}
            />
          )}
        />
      </div>

      {registerPatientId && (
        <RegisterVisitDialog
          patientId={registerPatientId}
          onClose={() => setRegisterPatientId(null)}
          onSubmit={handleRegisterVisit}
        />
      )}
    </div>
  )
}

