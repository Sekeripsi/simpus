"use client"

import { useMemo, type ReactNode } from "react"
import type { PatientListItem } from "@/lib/types/pendaftaran"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/shared/Icon"
import { Users, Search } from "lucide-react"

interface PatientTableProps {
  items: PatientListItem[]
  loading: boolean
  page: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  renderActions: (patient: PatientListItem) => ReactNode
}

function calculateAge(birthDate: string): number {
  const dob = new Date(birthDate)
  const today = new Date()

  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }

  return age
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  const pages: (number | string)[] = []

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) {
      pages.push("...")
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push("...")
    }

    pages.push(totalPages)
  }

  return pages
}

export function PatientTable({
  items,
  loading,
  page,
  total,
  totalPages,
  onPageChange,
  renderActions,
}: PatientTableProps) {
  const pageNumbers = useMemo(
    () => generatePageNumbers(page, totalPages),
    [page, totalPages]
  )

  if (loading) {
    return (
      <Card className="flex-1 min-w-0 bg-white border border-gray-100 overflow-hidden animate-pulse">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 h-16"></div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex-1 min-w-0 bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
          <Icon icon={Users} size="sm" className="text-primary" />
          Daftar Pasien
        </CardTitle>
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 px-2.5 py-1 text-xs font-bold shadow-sm"
        >
          {total} pasien terdaftar
        </Badge>
      </CardHeader>

      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-18rem)]">
        <Table className="min-w-full divide-y divide-gray-200 text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                NIK
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Nama Pasien
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Kelamin / Umur
              </TableHead>
              <TableHead className="px-4 py-4 text-left font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Alamat
              </TableHead>
              <TableHead className="px-4 py-4 text-right font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-xs">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500 text-sm">
                    <Icon icon={Search} size="xl" className="mx-auto text-gray-400 mb-4" />
                    <p className="font-medium">Tidak ada data pasien ditemukan</p>
                    <p className="text-xs text-gray-400">
                      Coba ubah kriteria pencarian Anda
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-primary/10 transition-colors">
              <TableCell className="px-4 py-4 whitespace-nowrap font-bold text-primary">{patient.nik}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{patient.nama}</div>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {patient.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"} / {patient.tanggalLahir ? calculateAge(patient.tanggalLahir) : "-"} Thn
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-600 max-w-[300px] truncate">
                    {patient.alamatDomisili || patient.alamatKtp || patient.alamatTinggal || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                    {renderActions(patient)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {items.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
          <div>
            Menampilkan {items.length} data pada halaman ini
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 border border-gray-200 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </Button>
            {pageNumbers.map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-1.5 text-gray-400">
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={page === p ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p as number)}
                  className={`px-3 py-1.5 border rounded transition-colors ${page === p
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
