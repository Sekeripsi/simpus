import { PatientCreatePageForm } from "@/components/pendaftaran/components/PatientCreatePageForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pendaftaran Pasien Baru",
}

export default async function PendaftaranPasienBaruPage() {
  return <PatientCreatePageForm />
}
