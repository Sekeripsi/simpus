import { Icon } from "@/components/shared/Icon";
import { IdCard, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SearchFilters } from "@/lib/types/rekam-medis";
import { FieldErrors } from "../SearchFilters";

interface NomorRMProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  renderError: (field: string) => React.ReactNode;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: FieldErrors;
}

const NomorRM = ({ filters, setFilters, renderError, handleChange, fieldErrors }: NomorRMProps) => {
  const handleClear = () => {
    setFilters({ ...filters, nik: "" });
  };

  return (
    <>
      {/* NIK */}
      <div className="space-y-2">
        <Label htmlFor="nik" className="font-semibold text-gray-700">
          NIK
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon icon={IdCard} size="sm" className="text-gray-400" />
          </div>
          <Input
            type="text"
            id="nik"
            name="nik"
            placeholder="16 digit NIK"
            value={filters.nik || ""}
            onChange={handleChange}
            className={`h-10 pl-10 pr-10 bg-gray-50 focus:bg-white ${fieldErrors.nik ? "border-red-300" : "border-gray-200"
              }`}
          />
          {filters.nik && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear NIK"
            >
              <Icon icon={X} size="sm" />
            </button>
          )}
        </div>
        {renderError("nik")}
      </div>
    </>
  )
}

export default NomorRM;