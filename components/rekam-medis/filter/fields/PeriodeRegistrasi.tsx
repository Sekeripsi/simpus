import { DatePicker } from "@/components/shared/DatePicker";
import { DatePickerWithRange } from "@/components/shared/DateRangePicker";
import { Label } from "@/components/ui/label";
import { FieldErrors } from "../SearchFilters";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { SearchFilters } from "@/lib/types/rekam-medis";

interface PeriodeRegistrasiProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  renderError: (field: string) => React.ReactNode;
  fieldErrors: FieldErrors;
  hasSearched: boolean;
  dateRange: DateRange | undefined;
  handleDateRangeChange: (range: DateRange | undefined) => void;
}

const PeriodeRegistrasi = ({ filters, setFilters, renderError, fieldErrors, hasSearched, dateRange, handleDateRangeChange }: PeriodeRegistrasiProps) => {
  const [enablePeriodeRegistrasi, setEnablePeriodeRegistrasi] = useState(!!filters.enablePeriodeRegistrasi)
  return (
    <>
      {/* Periode Registrasi Range */}
      <div
        className={`space-y-4 ${hasSearched ? "" : "md:col-span-2"}`}
      >
        <Label className="font-semibold text-gray-700">
          Periode Registrasi (Rentang)
        </Label>
        <div className="w-full flex gap-2 items-center">
          <Checkbox
            id="enablePeriodeRegistrasi"
            name="enablePeriodeRegistrasi"
            checked={!!filters.enablePeriodeRegistrasi}
            onCheckedChange={(checked) => {
              setFilters({
                ...filters,
                enablePeriodeRegistrasi: checked === true,
              });
              setEnablePeriodeRegistrasi(checked === true)
            }}
            className="w-5 h-5 cursor-pointer"
          />
          <DatePickerWithRange
            className={
              fieldErrors.periodeStart || fieldErrors.periodeEnd
                ? "border border-red-300 rounded-md flex-1"
                : "flex-1"
            }
            date={dateRange}
            setDate={handleDateRangeChange}
            disabled={!enablePeriodeRegistrasi}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({
                ...filters,
                periodeStart: new Date().toISOString().split("T")[0],
                periodeEnd: new Date().toISOString().split("T")[0],
              });
            }}
            className="px-3 py-2 border rounded-lg text-sm font-semibold hover:cursor-pointer"
            disabled={!enablePeriodeRegistrasi}
          >
            Today
          </Button>
        </div>
        {renderError("periodeStart") || renderError("periodeEnd")}
      </div>
    </>
  )
}

export default PeriodeRegistrasi;