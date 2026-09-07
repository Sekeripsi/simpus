import { Icon } from "@/components/shared/Icon";
import { User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SearchFilters } from "@/lib/types/rekam-medis";
import { FieldErrors } from "../SearchFilters";

interface NamaPasienProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  renderError: (field: string) => React.ReactNode;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: FieldErrors;
}

const NamaPasien = ({ filters, setFilters, renderError, handleChange, fieldErrors }: NamaPasienProps) => {
  const handleClear = () => {
    setFilters({ ...filters, name: "" });
  };

  return (
    <>
      {/* Nama Pasien */}
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold text-gray-700">
          Nama Pasien
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon icon={User} size="sm" className="text-gray-400" />
          </div>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Ketik nama pasien..."
            value={filters.name || ""}
            onChange={handleChange}
            className={`h-10 pl-10 pr-10 bg-gray-50 focus:bg-white ${fieldErrors.name ? "border-red-300" : "border-gray-200"
              }`}
          />
          {filters.name && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear Nama Pasien"
            >
              <Icon icon={X} size="sm" />
            </button>
          )}
        </div>
        {renderError("name")}
      </div>
    </>
  )
}

export default NamaPasien;