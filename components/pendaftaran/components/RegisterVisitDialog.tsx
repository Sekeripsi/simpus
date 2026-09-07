"use client"

import { useState } from "react"
import { ZodError } from "zod"
import {
  createMedicalRecordSchema,
  pendaftaranSchema,
  type CreateMedicalRecordInput,
} from "@/lib/validations/rekam-medis"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface RegisterVisitDialogProps {
  patientId: string
  onSubmit: (payload: CreateMedicalRecordInput) => Promise<void>
  onClose: () => void
}

function getZodErrorMessage(error: ZodError): string {
  const issue = error.issues[0]
  return issue?.message || "Input pendaftaran tidak valid"
}

function toIsoDateString(dateValue: string, invalidDateMessage: string): string {
  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(invalidDateMessage)
  }

  return parsedDate.toISOString()
}

export function RegisterVisitDialog({
  patientId,
  onSubmit,
  onClose,
}: RegisterVisitDialogProps) {
  const [form, setForm] = useState({
    visitDate: new Date().toISOString().slice(0, 10),
    queueNumber: "",
    serviceUnit: "Poliklinik",
    serviceType: "Rawat Jalan",
    registrationNumber: "",
    clinic: "UMUM",
    attendance: "HADIR",
    targetHtDm: "TIDAK",
    paymentMethod: "BPJS",
    notes: "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setError(null)

    try {
      const payload = createMedicalRecordSchema.parse({
        pasienId: patientId,
        pendaftaran: pendaftaranSchema.parse({
          tglKunjungan: toIsoDateString(form.visitDate, "Tanggal kunjungan tidak valid"),
          noAntrian: form.queueNumber,
          poliklinik: form.clinic,
          unitLayanan: form.serviceUnit || undefined,
          jenisLayanan: form.serviceType || undefined,
          noRegis: form.registrationNumber || undefined,
          kehadiran: form.attendance,
          targetStatus: form.targetHtDm,
          pembayaran: form.paymentMethod,
          catatan: form.notes || undefined
        })
      })

      console.log("payload: ", payload)

      await onSubmit(payload)
      onClose()
    } catch (submitError) {
      console.log(submitError)
      if (submitError instanceof ZodError) {
        setError(getZodErrorMessage(submitError))
      } else if (submitError instanceof Error) {
        setError(submitError.message)
      } else {
        setError("Input pendaftaran tidak valid")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open>
      <DialogContent className="w-full max-w-xl sm:max-w-xl p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Daftarkan Kunjungan
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Kunjungan
              </Label>
              <Input
                id="visitDate"
                type="date"
                value={form.visitDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, visitDate: event.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="queueNumber" className="block text-sm font-medium text-gray-700 mb-1">
                No. Antrian
              </Label>
              <Input
                id="queueNumber"
                value={form.queueNumber}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, queueNumber: event.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="A-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="serviceUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Layanan
              </Label>
              <Input
                id="serviceUnit"
                value={form.serviceUnit}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, serviceUnit: event.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Contoh: Poliklinik"
              />
            </div>
            <div>
              <Label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Layanan
              </Label>
              <Input
                id="serviceType"
                value={form.serviceType}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, serviceType: event.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Contoh: Rawat Jalan"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
              No Registrasi
            </Label>
            <Input
              id="registrationNumber"
              value={form.registrationNumber}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, registrationNumber: event.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Nomor registrasi kunjungan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-1">
                Poliklinik
              </Label>
              <Select
                value={form.clinic}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, clinic: value ?? prev.clinic }))
                }
              >
                <SelectTrigger id="clinic" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANSIA">Lansia</SelectItem>
                  <SelectItem value="INFEKSIUS_A">Infeksius A</SelectItem>
                  <SelectItem value="INFEKSIUS_B">Infeksius B</SelectItem>
                  <SelectItem value="INFEKSIUS_C">Infeksius C</SelectItem>
                  <SelectItem value="NON_INFEKSIUS_A">Non Infeksius A</SelectItem>
                  <SelectItem value="NON_INFEKSIUS_B">Non Infeksius B</SelectItem>
                  <SelectItem value="NON_INFEKSIUS_C">Non Infeksius C</SelectItem>
                  <SelectItem value="UGD">UGD</SelectItem>
                  <SelectItem value="GIGI">Gigi</SelectItem>
                  <SelectItem value="KIA">KIA</SelectItem>
                  <SelectItem value="UMUM">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="attendance" className="block text-sm font-medium text-gray-700 mb-1">
                Kehadiran
              </Label>
              <Select
                value={form.attendance}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, attendance: value ?? prev.attendance }))
                }
              >
                <SelectTrigger id="attendance" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HADIR">Hadir</SelectItem>
                  <SelectItem value="TIDAK_HADIR">Tidak Hadir</SelectItem>
                  <SelectItem value="PEMBATALAN">Pembatalan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="targetHtDm" className="block text-sm font-medium text-gray-700 mb-1">
                Target HT/DM
              </Label>
              <Select
                value={form.targetHtDm}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, targetHtDm: value ?? prev.targetHtDm }))
                }
              >
                <SelectTrigger id="targetHtDm" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TIDAK">Tidak</SelectItem>
                  <SelectItem value="HT">HT</SelectItem>
                  <SelectItem value="DM">DM</SelectItem>
                  <SelectItem value="HT_DM">HT/DM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Pembayaran
              </Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, paymentMethod: value ?? prev.paymentMethod }))
                }
              >
                <SelectTrigger id="paymentMethod" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPJS">BPJS</SelectItem>
                  <SelectItem value="MANDIRI">Mandiri</SelectItem>
                  <SelectItem value="ASURANSI">Asuransi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={3}
              placeholder="Catatan tambahan (opsional)"
            />
          </div>

          {error && (
            <div className="text-sm text-danger-700 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            variant="default"
            disabled={saving}
            onClick={() => void submit()}
          >
            {saving ? "Mendaftarkan..." : "Daftarkan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
