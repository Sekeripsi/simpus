"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { ZodError, z } from "zod"
import {
  AGAMA_OPTIONS,
  GOL_DARAH_OPTIONS,
  LAYANAN_DIFABEL_OPTIONS,
  RHESUS_OPTIONS,
  STATUS_KAWIN_OPTIONS,
  createPatientSchema,
  updatePatientSchema,
  type CreatePatientInput,
  type UpdatePatientInput,
} from "@/lib/validations/patient"
import type { PatientListItem } from "@/lib/types/pendaftaran"
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

interface PatientFormDialogProps {
  mode: "create" | "edit"
  patient?: PatientListItem
  onSubmit: (payload: CreatePatientInput | UpdatePatientInput) => Promise<void>
  onClose: () => void
}

type PatientFormValues = {
  nik: string
  noKk: string
  noJkn: string
  catatanJkn: string
  noJamkesos: string
  catatanJamkesos: string
  nama: string
  jenisKelamin: "L" | "P"
  tempatLahir: string
  tanggalLahir: string
  agama: "" | (typeof AGAMA_OPTIONS)[number]
  statusKawin: "" | (typeof STATUS_KAWIN_OPTIONS)[number]
  alamatTinggal: string
  alamatKtp: string
  alamatDomisili: string
  provinsi: string
  kabupaten: string
  kecamatan: string
  kelurahanDesa: string
  rtRw: string
  noTlp: string
  pemilikNoTlp: string
  layananDifabel: "" | (typeof LAYANAN_DIFABEL_OPTIONS)[number]
  pendidikan: string
  pekerjaan: string
  golDarah: "" | (typeof GOL_DARAH_OPTIONS)[number]
  rhesus: "" | (typeof RHESUS_OPTIONS)[number]
  namaIbuKandung: string
  email: string
}

function getDefaultValues(patient?: PatientListItem): PatientFormValues {
  return {
    nik: patient?.nik || "",
    noKk: patient?.noKk || "",
    noJkn: patient?.noJkn || "",
    catatanJkn: patient?.catatanJkn || "",
    noJamkesos: patient?.noJamkesos || "",
    catatanJamkesos: patient?.catatanJamkesos || "",
    nama: patient?.nama || "",
    jenisKelamin: patient?.jenisKelamin || "L",
    tempatLahir: patient?.tempatLahir || "",
    tanggalLahir: patient?.tanggalLahir?.slice(0, 10) || "",
    agama: (patient?.agama as PatientFormValues["agama"]) || "",
    statusKawin: (patient?.statusKawin as PatientFormValues["statusKawin"]) || "",
    alamatTinggal: patient?.alamatTinggal || "",
    alamatKtp: patient?.alamatKtp || "",
    alamatDomisili: patient?.alamatDomisili || "",
    provinsi: patient?.provinsi || "",
    kabupaten: patient?.kabupaten || "",
    kecamatan: patient?.kecamatan || "",
    kelurahanDesa: patient?.kelurahanDesa || "",
    rtRw: patient?.rtRw || "",
    noTlp: patient?.noTlp || "",
    pemilikNoTlp: patient?.pemilikNoTlp || "",
    layananDifabel: (patient?.layananDifabel as PatientFormValues["layananDifabel"]) || "",
    pendidikan: patient?.pendidikan || "",
    pekerjaan: patient?.pekerjaan || "",
    golDarah: (patient?.golDarah as PatientFormValues["golDarah"]) || "",
    rhesus: (patient?.rhesus as PatientFormValues["rhesus"]) || "",
    namaIbuKandung: patient?.namaIbuKandung || "",
    email: patient?.email || "",
  }
}

function getFormResolverSchema(mode: "create" | "edit") {
  return z
    .object({
      nik:
        mode === "create"
          ? z.string().min(1, "NIK is required")
          : z.string().optional(),
      nama:
        mode === "create"
          ? z.string().min(2, "Nama must be at least 2 characters")
          : z.string().optional(),
      jenisKelamin: z.enum(["L", "P"]),
      noKk:
        mode === "create"
          ? z.string().min(1, "No KK is required")
          : z.string().optional(),
      noJkn:
        mode === "create"
          ? z.string().min(1, "No JKN is required")
          : z.string().optional(),
      noJamkesos:
        mode === "create"
          ? z.string().min(1, "No Jamkesos is required")
          : z.string().optional(),
    })
    .passthrough()
}

function getZodErrorMessage(error: ZodError): string {
  const issue = error.issues[0]
  return issue?.message || "Data tidak valid"
}

function toIsoDateString(dateValue: string, invalidDateMessage: string): string {
  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(invalidDateMessage)
  }

  return parsedDate.toISOString()
}

function calculateDerivedAgeLabel(birthDate: string): string {
  if (!birthDate) {
    return "-"
  }

  const parts = birthDate.split("-")
  if (parts.length !== 3) {
    return "-"
  }

  const [yearString, monthString, dayString] = parts
  const year = Number(yearString)
  const month = Number(monthString)
  const day = Number(dayString)

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return "-"
  }

  const parsedDate = new Date(year, month - 1, day)
  const isValidDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day

  if (!isValidDate) {
    return "-"
  }

  const today = new Date()
  let age = today.getFullYear() - year

  const birthdayHasPassedThisYear =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day)

  if (!birthdayHasPassedThisYear) {
    age -= 1
  }

  if (age < 0) {
    age = 0
  }

  return `${age} Tahun`
}

export function PatientFormDialog({
  mode,
  patient,
  onSubmit,
  onClose,
}: PatientFormDialogProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolver = zodResolver(getFormResolverSchema(mode), undefined, {
    raw: true,
  }) as unknown as Resolver<PatientFormValues>

  const { register, handleSubmit, setValue, watch } = useForm<PatientFormValues>({
    resolver,
    defaultValues: getDefaultValues(patient),
  })

  const submit = handleSubmit(
    async (values) => {
      setSaving(true)
      setError(null)

      try {
        const payload =
          mode === "create"
            ? createPatientSchema.parse({
              nik: values.nik,
              noKk: values.noKk,
              noJkn: values.noJkn,
              catatanJkn: values.catatanJkn || "",
              noJamkesos: values.noJamkesos,
              catatanJamkesos: values.catatanJamkesos || "",
              nama: values.nama,
              jenisKelamin: values.jenisKelamin,
              tanggalLahir: values.tanggalLahir
                ? toIsoDateString(values.tanggalLahir, "Tanggal lahir tidak valid")
                : undefined,
              tempatLahir: values.tempatLahir || undefined,
              agama: values.agama || undefined,
              statusKawin: values.statusKawin || undefined,
              alamatTinggal: values.alamatTinggal || undefined,
              alamatKtp: values.alamatKtp || undefined,
              alamatDomisili: values.alamatDomisili || undefined,
              provinsi: values.provinsi || undefined,
              kabupaten: values.kabupaten || undefined,
              kecamatan: values.kecamatan || undefined,
              kelurahanDesa: values.kelurahanDesa || undefined,
              rtRw: values.rtRw || undefined,
              layananDifabel: values.layananDifabel || undefined,
              pendidikan: values.pendidikan || undefined,
              pekerjaan: values.pekerjaan || undefined,
              golDarah: values.golDarah || undefined,
              rhesus: values.rhesus || undefined,
              namaIbuKandung: values.namaIbuKandung || undefined,
              noTlp: values.noTlp || undefined,
              pemilikNoTlp: values.pemilikNoTlp || undefined,
              email: values.email || undefined,
            })
            : updatePatientSchema.parse({
              nama: values.nama || undefined,
              jenisKelamin: values.jenisKelamin || undefined,
              tanggalLahir: values.tanggalLahir
                ? toIsoDateString(values.tanggalLahir, "Tanggal lahir tidak valid")
                : undefined,
              tempatLahir: values.tempatLahir || undefined,
              agama: values.agama || undefined,
              statusKawin: values.statusKawin || undefined,
              alamatTinggal: values.alamatTinggal || undefined,
              alamatKtp: values.alamatKtp || undefined,
              alamatDomisili: values.alamatDomisili || undefined,
              provinsi: values.provinsi || undefined,
              kabupaten: values.kabupaten || undefined,
              kecamatan: values.kecamatan || undefined,
              kelurahanDesa: values.kelurahanDesa || undefined,
              rtRw: values.rtRw || undefined,
              nik: values.nik || undefined,
              noKk: values.noKk || undefined,
              noJkn: values.noJkn || undefined,
              catatanJkn: values.catatanJkn || undefined,
              noJamkesos: values.noJamkesos || undefined,
              catatanJamkesos: values.catatanJamkesos || undefined,
              layananDifabel: values.layananDifabel || undefined,
              pendidikan: values.pendidikan || undefined,
              pekerjaan: values.pekerjaan || undefined,
              golDarah: values.golDarah || undefined,
              rhesus: values.rhesus || undefined,
              namaIbuKandung: values.namaIbuKandung || undefined,
              noTlp: values.noTlp || undefined,
              pemilikNoTlp: values.pemilikNoTlp || undefined,
              email: values.email || undefined,
            })

        await onSubmit(payload)
        onClose()
      } catch (submitError) {
        if (submitError instanceof ZodError) {
          setError(getZodErrorMessage(submitError))
        } else if (submitError instanceof Error) {
          setError(submitError.message)
        } else {
          setError("Data tidak valid")
        }
      } finally {
        setSaving(false)
      }
    },
    (invalidErrors) => {
      const firstError = Object.values(invalidErrors)[0]
      if (firstError?.message && typeof firstError.message === "string") {
        setError(firstError.message)
        return
      }
      setError("Data tidak valid")
    }
  )

  return (
    <Dialog open>
      <DialogContent className="w-full max-w-xl sm:max-w-xl p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Tambah Pasien" : "Ubah Data Pasien"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="p-5 space-y-3">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </Label>
              <Input
                id="nik"
                {...register("nik")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="16 digit"
              />
            </div>
            <div>
              <Label htmlFor="noKk" className="block text-sm font-medium text-gray-700 mb-1">
                No KK
              </Label>
              <Input
                id="noKk"
                {...register("noKk")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Nomor kartu keluarga"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="noJkn" className="block text-sm font-medium text-gray-700 mb-1">
                No.JKN
              </Label>
              <Input
                id="noJkn"
                {...register("noJkn")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Nomor JKN"
              />
            </div>
            <div>
              <Label htmlFor="noJamkesos" className="block text-sm font-medium text-gray-700 mb-1">
                No JAMKESOS
              </Label>
              <Input
                id="noJamkesos"
                {...register("noJamkesos")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Nomor JAMKESOS"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </Label>
            <Input
              id="nama"
              {...register("nama")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Masukkan nama"
            />
          </div>

          <div>
            <Label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kelamin
            </Label>
            <Select
              value={watch("jenisKelamin")}
              onValueChange={(value) =>
                setValue("jenisKelamin", value as "L" | "P", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="jenisKelamin" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="tempatLahir" className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
              </Label>
              <Input
                id="tempatLahir"
                {...register("tempatLahir")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Masukkan tempat lahir"
              />
            </div>
            <div>
              <Label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </Label>
              <Input
                id="tanggalLahir"
                type="date"
                {...register("tanggalLahir")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="derivedAge" className="block text-sm font-medium text-gray-700 mb-1">
                Umur
              </Label>
              <Input
                id="derivedAge"
                aria-label="Umur"
                value={calculateDerivedAgeLabel(watch("tanggalLahir"))}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="agama" className="block text-sm font-medium text-gray-700 mb-1">
                Agama
              </Label>
              <Select
                value={watch("agama") || undefined}
                onValueChange={(value) =>
                  setValue("agama", value as (typeof AGAMA_OPTIONS)[number], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="agama" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  {AGAMA_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusKawin" className="block text-sm font-medium text-gray-700 mb-1">
                Status Perkawinan
              </Label>
              <Select
                value={watch("statusKawin") || undefined}
                onValueChange={(value) =>
                  setValue("statusKawin", value as (typeof STATUS_KAWIN_OPTIONS)[number], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="statusKawin" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Pilih status perkawinan" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_KAWIN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="alamatTinggal" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Tinggal
            </Label>
            <Input
              id="alamatTinggal"
              {...register("alamatTinggal")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Alamat pasien"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="provinsi" className="block text-sm font-medium text-gray-700 mb-1">
                Provinsi
              </Label>
              <Input
                id="provinsi"
                {...register("provinsi")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Provinsi"
              />
            </div>
            <div>
              <Label htmlFor="kabupaten" className="block text-sm font-medium text-gray-700 mb-1">
                Kabupaten
              </Label>
              <Input
                id="kabupaten"
                {...register("kabupaten")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Kabupaten"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700 mb-1">
                Kecamatan
              </Label>
              <Input
                id="kecamatan"
                {...register("kecamatan")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Kecamatan"
              />
            </div>
            <div>
              <Label htmlFor="kelurahanDesa" className="block text-sm font-medium text-gray-700 mb-1">
                Kelurahan/Desa
              </Label>
              <Input
                id="kelurahanDesa"
                {...register("kelurahanDesa")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Kelurahan atau desa"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rtRw" className="block text-sm font-medium text-gray-700 mb-1">
                RT/RW
              </Label>
              <Input
                id="rtRw"
                {...register("rtRw")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Contoh: 001/002"
              />
            </div>
            <div>
              <Label htmlFor="noTlp" className="block text-sm font-medium text-gray-700 mb-1">
                No Telepon
              </Label>
              <Input
                id="noTlp"
                {...register("noTlp")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="layananDifabel" className="block text-sm font-medium text-gray-700 mb-1">
                Layanan Difabel
              </Label>
              <Select
                value={watch("layananDifabel") || undefined}
                onValueChange={(value) =>
                  setValue("layananDifabel", value as (typeof LAYANAN_DIFABEL_OPTIONS)[number], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="layananDifabel" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Pilih layanan difabel" />
                </SelectTrigger>
                <SelectContent>
                  {LAYANAN_DIFABEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pendidikan" className="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan
              </Label>
              <Input
                id="pendidikan"
                {...register("pendidikan")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Contoh: SMA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700 mb-1">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaan"
                {...register("pekerjaan")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Pekerjaan"
              />
            </div>
            <div>
              <Label htmlFor="golDarah" className="block text-sm font-medium text-gray-700 mb-1">
                Golongan Darah
              </Label>
              <Select
                value={watch("golDarah") || undefined}
                onValueChange={(value) =>
                  setValue("golDarah", value as (typeof GOL_DARAH_OPTIONS)[number], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="golDarah" className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <SelectValue placeholder="Pilih golongan darah" />
                </SelectTrigger>
                <SelectContent>
                  {GOL_DARAH_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="namaIbuKandung" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Ibu Kandung
            </Label>
            <Input
              id="namaIbuKandung"
              {...register("namaIbuKandung")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Nama ibu kandung"
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
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
