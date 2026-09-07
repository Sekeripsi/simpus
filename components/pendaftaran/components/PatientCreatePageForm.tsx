"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ZodError } from "zod"
import {
  AGAMA_OPTIONS,
  GOL_DARAH_OPTIONS,
  createPatientSchema,
  updatePatientSchema,
  LAYANAN_DIFABEL_OPTIONS,
  STATUS_KAWIN_OPTIONS,
  RHESUS_OPTIONS,
} from "@/lib/validations/patient"
import type { PatientListItem } from "@/lib/types/pendaftaran"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApiErrorResponse {
  success?: boolean
  error?: string
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
  if (!birthDate) return "-"
  const parts = birthDate.split("-")
  if (parts.length !== 3) return "-"
  const [yearString, monthString, dayString] = parts
  const year = Number(yearString)
  const month = Number(monthString)
  const day = Number(dayString)
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return "-"
  const parsedDate = new Date(year, month - 1, day)
  const isValidDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  if (!isValidDate) return "-"
  const today = new Date()
  let age = today.getFullYear() - year
  const birthdayHasPassedThisYear =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day)
  if (!birthdayHasPassedThisYear) age -= 1
  if (age < 0) age = 0
  return `${age} Tahun`
}

interface PatientCreatePageFormProps {
  initialData?: PatientListItem
}

export function PatientCreatePageForm({ initialData }: PatientCreatePageFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState({
    nik: initialData?.nik || "",
    noKk: initialData?.noKk || "",
    noJkn: initialData?.noJkn || "",
    catatanJkn: initialData?.catatanJkn || "",
    noJamkesos: initialData?.noJamkesos || "",
    catatanJamkesos: initialData?.catatanJamkesos || "",
    nama: initialData?.nama || "",
    jenisKelamin: (initialData?.jenisKelamin as "L" | "P") || "L",
    tempatLahir: initialData?.tempatLahir || "",
    tanggalLahir: initialData?.tanggalLahir ? initialData.tanggalLahir.split("T")[0] : "",
    agama: initialData?.agama || "",
    statusKawin: initialData?.statusKawin || "",
    alamatTinggal: initialData?.alamatTinggal || "",
    alamatKtp: initialData?.alamatKtp || "",
    alamatDomisili: initialData?.alamatDomisili || "",
    provinsi: initialData?.provinsi || "",
    kabupaten: initialData?.kabupaten || "",
    kecamatan: initialData?.kecamatan || "",
    kelurahanDesa: initialData?.kelurahanDesa || "",
    rtRw: initialData?.rtRw || "",
    noTlp: initialData?.noTlp || "",
    pemilikNoTlp: initialData?.pemilikNoTlp || "",
    layananDifabel: initialData?.layananDifabel || "",
    pendidikan: initialData?.pendidikan || "",
    pekerjaan: initialData?.pekerjaan || "",
    golDarah: initialData?.golDarah || "",
    rhesus: initialData?.rhesus || "",
    namaIbuKandung: initialData?.namaIbuKandung || "",
    email: initialData?.email || "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const schema = isEdit ? updatePatientSchema : createPatientSchema
      const payload = schema.parse({
        nik: form.nik,
        noKk: form.noKk,
        noJkn: form.noJkn,
        catatanJkn: form.catatanJkn || "",
        noJamkesos: form.noJamkesos,
        catatanJamkesos: form.catatanJamkesos || "",
        nama: form.nama,
        jenisKelamin: form.jenisKelamin,
        tanggalLahir: form.tanggalLahir ? toIsoDateString(form.tanggalLahir, "Tanggal lahir tidak valid") : undefined,
        tempatLahir: form.tempatLahir || undefined,
        agama: form.agama || undefined,
        statusKawin: form.statusKawin || undefined,
        alamatTinggal: form.alamatTinggal || undefined,
        alamatKtp: form.alamatKtp || undefined,
        alamatDomisili: form.alamatDomisili || undefined,
        provinsi: form.provinsi || undefined,
        kabupaten: form.kabupaten || undefined,
        kecamatan: form.kecamatan || undefined,
        kelurahanDesa: form.kelurahanDesa || undefined,
        rtRw: form.rtRw || undefined,
        layananDifabel: form.layananDifabel || undefined,
        pendidikan: form.pendidikan || undefined,
        pekerjaan: form.pekerjaan || undefined,
        golDarah: form.golDarah || undefined,
        rhesus: form.rhesus || undefined,
        namaIbuKandung: form.namaIbuKandung || undefined,
        noTlp: form.noTlp || undefined,
        pemilikNoTlp: form.pemilikNoTlp || undefined,
        email: form.email || undefined,
      })

      const url = isEdit ? `/api/patients/${initialData.id}` : "/api/patients"
      const method = isEdit ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as ApiErrorResponse
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Gagal ${isEdit ? "mengubah" : "membuat"} pasien`)
      }
      router.push("/pendaftaran")
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
  }

  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-primary/10 py-2 px-4 gap-0">
        <CardTitle>
          <h1>{isEdit ? "Ubah" : "Tambah"} Data Pasien</h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-2">
        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10 py-2 px-4 gap-0">
            <CardTitle>1. Nomor Identitas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-2 gap-2">
            <div>
              <Label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">NIK</Label>
              <Input id="nik" value={form.nik} onChange={(e) => setForm((prev) => ({ ...prev, nik: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="16 digit" required />
            </div>
            <div>
              <Label htmlFor="noKk" className="block text-sm font-medium text-gray-700 mb-1">No KK</Label>
              <Input id="noKk" value={form.noKk} onChange={(e) => setForm((prev) => ({ ...prev, noKk: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Nomor kartu keluarga" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10 py-2 px-4 gap-0">
            <CardTitle>2. Jaminan Kesehatan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-2 gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="noJkn" className="block text-sm font-medium text-gray-700 mb-1">No JKN</Label>
                <Input id="noJkn" value={form.noJkn} onChange={(e) => setForm((prev) => ({ ...prev, noJkn: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Nomor JKN" />
              </div>
              <div>
                <Label htmlFor="catatanJkn" className="block text-sm font-medium text-gray-700 mb-1">Catatan JKN</Label>
                <Input id="catatanJkn" value={form.catatanJkn} onChange={(e) => setForm((prev) => ({ ...prev, catatanJkn: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Catatan JKN" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="noJamkesos" className="block text-sm font-medium text-gray-700 mb-1">No JAMKESOS</Label>
                <Input id="noJamkesos" value={form.noJamkesos} onChange={(e) => setForm((prev) => ({ ...prev, noJamkesos: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Nomor JAMKESOS" />
              </div>
              <div>
                <Label htmlFor="catatanJamkesos" className="block text-sm font-medium text-gray-700 mb-1">Catatan JAMKESOS</Label>
                <Input id="catatanJamkesos" value={form.catatanJamkesos} onChange={(e) => setForm((prev) => ({ ...prev, catatanJamkesos: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Catatan JAMKESOS" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10 py-2 px-4 gap-0">
            <CardTitle>3. Data Dasar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-2 gap-2">
            <div>
              <Label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama</Label>
              <Input id="nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Masukkan nama" />
            </div>
            <div>
              <Label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</Label>
              <Select value={form.jenisKelamin} onValueChange={(value) => setForm((prev) => ({ ...prev, jenisKelamin: value as "L" | "P" }))}>
                <SelectTrigger id="jenisKelamin" className="w-full px-3 py-2 border border-gray-200 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="tempatLahir" className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</Label>
                <Input id="tempatLahir" value={form.tempatLahir} onChange={(e) => setForm((prev) => ({ ...prev, tempatLahir: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Masukkan tempat lahir" />
              </div>
              <div>
                <Label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</Label>
                <Input id="tanggalLahir" type="date" value={form.tanggalLahir} onChange={(e) => setForm((prev) => ({ ...prev, tanggalLahir: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <Label htmlFor="derivedAge" className="block text-sm font-medium text-gray-700 mb-1">Umur</Label>
                <Input id="derivedAge" aria-label="Umur" value={calculateDerivedAgeLabel(form.tanggalLahir)} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="agama" className="block text-sm font-medium text-gray-700 mb-1">Agama</Label>
                <Select value={form.agama || undefined} onValueChange={(value) => setForm((prev) => ({ ...prev, agama: value as (typeof AGAMA_OPTIONS)[number] }))}>
                  <SelectTrigger id="agama" className="w-full px-3 py-2 border border-gray-200 rounded-lg"><SelectValue placeholder="Pilih agama" /></SelectTrigger>
                  <SelectContent>
                    {AGAMA_OPTIONS.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="statusKawin" className="block text-sm font-medium text-gray-700 mb-1">Status Perkawinan</Label>
                <Select value={form.statusKawin || undefined} onValueChange={(value) => setForm((prev) => ({ ...prev, statusKawin: value as (typeof STATUS_KAWIN_OPTIONS)[number] }))}>
                  <SelectTrigger id="statusKawin" className="w-full px-3 py-2 border border-gray-200 rounded-lg"><SelectValue placeholder="Pilih status perkawinan" /></SelectTrigger>
                  <SelectContent>
                    {STATUS_KAWIN_OPTIONS.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10 py-2 px-4 gap-0">
            <CardTitle>4. Alamat Tinggal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-2 gap-2">
            <div>
              <Label htmlFor="alamatTinggal" className="block text-sm font-medium text-gray-700 mb-1">Alamat Tinggal</Label>
              <Input id="alamatTinggal" value={form.alamatTinggal} onChange={(e) => setForm((prev) => ({ ...prev, alamatTinggal: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Alamat pasien" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="alamatKtp" className="block text-sm font-medium text-gray-700 mb-1">Alamat KTP</Label>
                <Input id="alamatKtp" value={form.alamatKtp} onChange={(e) => setForm((prev) => ({ ...prev, alamatKtp: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Alamat sesuai KTP" />
              </div>
              <div>
                <Label htmlFor="alamatDomisili" className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</Label>
                <Input id="alamatDomisili" value={form.alamatDomisili} onChange={(e) => setForm((prev) => ({ ...prev, alamatDomisili: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Alamat domisili saat ini" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="provinsi" className="block text-sm font-medium text-gray-700 mb-1">Provinsi</Label>
                <Input id="provinsi" value={form.provinsi} onChange={(e) => setForm((prev) => ({ ...prev, provinsi: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Provinsi" />
              </div>
              <div>
                <Label htmlFor="kabupaten" className="block text-sm font-medium text-gray-700 mb-1">Kabupaten</Label>
                <Input id="kabupaten" value={form.kabupaten} onChange={(e) => setForm((prev) => ({ ...prev, kabupaten: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Kabupaten" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</Label>
                <Input id="kecamatan" value={form.kecamatan} onChange={(e) => setForm((prev) => ({ ...prev, kecamatan: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Kecamatan" />
              </div>
              <div>
                <Label htmlFor="kelurahanDesa" className="block text-sm font-medium text-gray-700 mb-1">Kelurahan/Desa</Label>
                <Input id="kelurahanDesa" value={form.kelurahanDesa} onChange={(e) => setForm((prev) => ({ ...prev, kelurahanDesa: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Kelurahan atau desa" />
              </div>
            </div>
            <div>
              <Label htmlFor="rtRw" className="block text-sm font-medium text-gray-700 mb-1">RT/RW</Label>
              <Input id="rtRw" value={form.rtRw} onChange={(e) => setForm((prev) => ({ ...prev, rtRw: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Contoh: 001/002" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10 py-2 px-4 gap-0">
            <CardTitle>5. Nomor Kontak</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-2 gap-2">
            <div>
              <Label htmlFor="noTlp" className="block text-sm font-medium text-gray-700 mb-1">No Telepon</Label>
              <Input id="noTlp" value={form.noTlp} onChange={(e) => setForm((prev) => ({ ...prev, noTlp: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <Label htmlFor="pemilikNoTlp" className="block text-sm font-medium text-gray-700 mb-1">Pemilik No Telepon</Label>
              <Input id="pemilikNoTlp" value={form.pemilikNoTlp} onChange={(e) => setForm((prev) => ({ ...prev, pemilikNoTlp: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Pemilik no telepon" />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
              <Input id="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="email@contoh.com" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10 py-2 px-4 gap-0">
            <CardTitle>6. Data Pendukung</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-2 gap-2">
            <div>
              <Label htmlFor="layananDifabel" className="block text-sm font-medium text-gray-700 mb-1">Layanan Difabel</Label>
              <Select value={form.layananDifabel || undefined} onValueChange={(value) => setForm((prev) => ({ ...prev, layananDifabel: value as (typeof LAYANAN_DIFABEL_OPTIONS)[number] }))}>
                <SelectTrigger id="layananDifabel" className="w-full px-3 py-2 border border-gray-200 rounded-lg"><SelectValue placeholder="Pilih layanan difabel" /></SelectTrigger>
                <SelectContent>
                  {LAYANAN_DIFABEL_OPTIONS.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pendidikan" className="block text-sm font-medium text-gray-700 mb-1">Pendidikan</Label>
              <Input id="pendidikan" value={form.pendidikan} onChange={(e) => setForm((prev) => ({ ...prev, pendidikan: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Contoh: SMA" />
            </div>
            <div>
              <Label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</Label>
              <Input id="pekerjaan" value={form.pekerjaan} onChange={(e) => setForm((prev) => ({ ...prev, pekerjaan: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Pekerjaan" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="golDarah" className="block text-sm font-medium text-gray-700 mb-1">Golongan Darah</Label>
                <Select value={form.golDarah || undefined} onValueChange={(value) => setForm((prev) => ({ ...prev, golDarah: value as (typeof GOL_DARAH_OPTIONS)[number] }))}>
                  <SelectTrigger id="golDarah" className="w-full px-3 py-2 border border-gray-200 rounded-lg"><SelectValue placeholder="Pilih golongan darah" /></SelectTrigger>
                  <SelectContent>
                    {GOL_DARAH_OPTIONS.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rhesus" className="block text-sm font-medium text-gray-700 mb-1">Rhesus</Label>
                <Select value={form.rhesus || undefined} onValueChange={(value) => setForm((prev) => ({ ...prev, rhesus: value as (typeof RHESUS_OPTIONS)[number] }))}>
                  <SelectTrigger id="rhesus" className="w-full px-3 py-2 border border-gray-200 rounded-lg"><SelectValue placeholder="Pilih rhesus" /></SelectTrigger>
                  <SelectContent>
                    {RHESUS_OPTIONS.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="namaIbuKandung" className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu Kandung</Label>
              <Input id="namaIbuKandung" value={form.namaIbuKandung} onChange={(e) => setForm((prev) => ({ ...prev, namaIbuKandung: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Nama ibu kandung" />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-sm text-danger-700 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/pendaftaran")} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            Batal
          </Button>
          <Button variant="default" type="submit" disabled={saving} onClick={() => void submit()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
