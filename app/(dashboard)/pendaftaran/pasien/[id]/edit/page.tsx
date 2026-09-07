import { notFound } from "next/navigation"
import { PatientCreatePageForm } from "@/components/pendaftaran/components/PatientCreatePageForm"
import type { PatientListItem } from "@/lib/types/pendaftaran"
import { getBackendUrl } from "@/lib/config/api"
import { getServerToken } from "@/lib/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ubah Data Pasien",
}

interface PageProps {
  params: Promise<{ id: string }>
}

const API_BASE_URL = getBackendUrl()

export default async function PendaftaranPasienEditPage({ params }: PageProps) {
  const { id } = await params

  let patient: PatientListItem | null = null
  try {
    const token = await getServerToken()
    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/patients/${id}`, { headers, cache: "no-store" })
    if (!res.ok) {
      notFound()
    }
    const json = await res.json()
    patient = json.data ?? null
  } catch {
    notFound()
  }

  if (!patient) {
    notFound()
  }

  return <PatientCreatePageForm initialData={patient} />
}
