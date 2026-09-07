import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { SearchFilters } from "@/lib/types/rekam-medis";
import { useState } from "react";
import { format, parse } from "date-fns";

interface TanggalRegistrasiProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  renderError: (field: string) => React.ReactNode;
}

const TanggalRegistrasi = ({ filters, setFilters, renderError }: TanggalRegistrasiProps) => {

  const [enableTanggalRegistrasi, setEnableTanggalRegistrasi] = useState(!!filters.enableTanggalRegistrasi)

  return (
    <>
      {/* Tanggal Registrasi Tunggal */}
      <div className="space-y-2">
        <Label htmlFor="tanggalRegistrasi" className="font-semibold text-gray-700">
          Tgl Registrasi (Khusus)
        </Label>
        <div className="relative flex gap-2 justify-center items-center">
          <Checkbox
            id="enableTanggalRegistrasi"
            name="enableTanggalRegistrasi"
            checked={!!filters.enableTanggalRegistrasi}
            onCheckedChange={(checked) => {
              setFilters({
                ...filters,
                enableTanggalRegistrasi: checked === true,
              });
              setEnableTanggalRegistrasi(checked === true)
            }}
            className="w-5 h-5 cursor-pointer"
          />
          <DatePicker
            disabled={!enableTanggalRegistrasi}
            date={filters.tanggalRegistrasi ? parse(filters.tanggalRegistrasi, "yyyy-MM-dd", new Date()) : undefined}
            setDate={(date) => {
              setFilters({
                ...filters,
                tanggalRegistrasi: date ? format(date, "yyyy-MM-dd") : undefined,
              });
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({
                ...filters,
                tanggalRegistrasi: new Date().toISOString().split("T")[0],
              });
            }}
            className="px-3 py-2 border rounded-lg text-sm font-semibold hover:cursor-pointer"
            disabled={!enableTanggalRegistrasi}
          >
            Today
          </Button>
        </div>
        {renderError("tanggalRegistrasi")}
      </div>
    </>
  )
}

export default TanggalRegistrasi;