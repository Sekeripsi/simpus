"use client"

import { Search, UserPlus } from "lucide-react"
import { Icon } from "@/components/shared/Icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PatientSearchFilters } from "@/lib/types/pendaftaran"

interface PatientFilterSidebarProps {
  filters: PatientSearchFilters
  onFilterChange: (key: keyof PatientSearchFilters, value: string) => void
  onSearch: () => void
  onReset: () => void
  onAddData: () => void
  canAddData: boolean
}

export function PatientFilterSidebar({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onAddData,
  canAddData,
}: PatientFilterSidebarProps) {
  return (
    <Card className="w-[300px] shrink-0 h-fit sticky top-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Icon icon={Search} size="sm" className="text-primary" />
          Kriteria Pencarian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSearch()
          }}
          className="space-y-4"
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                NIK
              </label>
              <Input
                value={filters.nik}
                onChange={(e) => onFilterChange("nik", e.target.value)}
                placeholder="Nomor NIK"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Nama Pasien
              </label>
              <Input
                value={filters.nama}
                onChange={(e) => onFilterChange("nama", e.target.value)}
                placeholder="Nama Pasien"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Jenis Kelamin
              </label>
              <select
                value={filters.jenisKelamin}
                onChange={(e) => onFilterChange("jenisKelamin", e.target.value as any)}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Semua Jenis Kelamin</option>
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                No JKN
              </label>
              <Input
                value={filters.noJkn}
                onChange={(e) => onFilterChange("noJkn", e.target.value)}
                placeholder="Nomor JKN"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Alamat Tinggal
              </label>
              <Input
                value={filters.alamatDomisili}
                onChange={(e) => onFilterChange("alamatDomisili", e.target.value)}
                placeholder="Alamat"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              className="w-full bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all flex items-center justify-center gap-2 text-sm h-10 shadow-sm"
            >
              <Icon icon={Search} size="sm" />
              Cari Pasien
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full h-10 border border-gray-300 shadow-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all text-sm"
            >
              Reset Filter
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={onAddData}
              disabled={!canAddData}
              className="w-full bg-secondary text-white font-medium rounded-lg shadow-md hover:bg-secondary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all flex items-center justify-center gap-2 text-sm h-10"
            >
              <Icon icon={UserPlus} size="sm" />
              Tambah Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
