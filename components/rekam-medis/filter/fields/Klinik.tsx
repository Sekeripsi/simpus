import type { SearchFilters } from "@/lib/types/rekam-medis";
import { FieldErrors } from "../SearchFilters";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KlinikProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  renderError: (field: string) => React.ReactNode;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: FieldErrors;
  handleSelectChange: (name: keyof SearchFilters, value: string | null) => void;
}

const Klinik = ({ filters, setFilters, renderError, handleChange, fieldErrors, handleSelectChange }: KlinikProps) => {
  return (
    <>
      {/* Klinik Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="klinik" className="font-semibold text-gray-700">
          Klinik
        </Label>
        <Select
          value={filters.layanan || "semua"}
          onValueChange={(value) => handleSelectChange("layanan", value)}
        >
          <SelectTrigger
            id="klinik"
            className={`w-full h-10 bg-gray-50 focus:bg-white ${fieldErrors.klinik ? "border-red-300" : "border-gray-200"
              }`}
          >
            <SelectValue placeholder="Semua Klinik" />
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectItem value="semua">Semua Klinik</SelectItem>
            <SelectItem value="lansia">Poliklinik Lansia</SelectItem>
            <SelectItem value="infeksius_a">Poliklinik Infeksius A</SelectItem>
            <SelectItem value="infeksius_b">Poliklinik Infeksius B</SelectItem>
            <SelectItem value="infeksius_c">Poliklinik Infeksius C</SelectItem>
            <SelectItem value="non_infeksius_a">Poliklinik Non-Infeksius A</SelectItem>
            <SelectItem value="non_infeksius_b">Poliklinik Non-Infeksius B</SelectItem>
            <SelectItem value="non_infeksius_c">Poliklinik Non-Infeksius C</SelectItem>
            <SelectItem value="ugd">UGD (Unit Gawat Darurat)</SelectItem>
            <SelectItem value="gigi">Poliklinik Gigi &amp; Mulut</SelectItem>
            <SelectItem value="kia">KIA / KB</SelectItem>
            <SelectItem value="umum">Poliklinik Umum</SelectItem>
          </SelectContent>
        </Select>
        {renderError("klinik")}
      </div>
    </>
  )
}

export default Klinik;