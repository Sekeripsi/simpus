import { PendaftaranPageClient } from "@/components/pendaftaran/components/PendaftaranPageClient"
import type { PatientListItem } from "@/lib/types/pendaftaran"
import { Metadata } from "next"
import { getBackendUrl } from "@/lib/config/api"
import { getAuth, getServerToken } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Pendaftaran",
}

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 10

const API_BASE_URL = getBackendUrl()

async function fetchInitialPatients(): Promise<{
  patients: PatientListItem[]
  total: number
}> {
  try {
    const token = await getServerToken()
    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(
      `${API_BASE_URL}/patients?page=${INITIAL_PAGE}&pageSize=${INITIAL_PAGE_SIZE}`,
      { headers, cache: "no-store" }
    )
    if (!res.ok) {
      return { patients: [], total: 0 }
    }
    const json = await res.json()
    return {
      patients: json.data ?? [],
      total: json.pagination?.total ?? 0,
    }
  } catch {
    return { patients: [], total: 0 }
  }
}

export default async function PendaftaranPage() {
  const auth = await getAuth()
  const { patients, total } = await fetchInitialPatients()

  return (
    <PendaftaranPageClient
      userRole={auth?.role}
      initialData={{
        items: patients,
        page: INITIAL_PAGE,
        pageSize: INITIAL_PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / INITIAL_PAGE_SIZE),
      }}
    />
  )
}
