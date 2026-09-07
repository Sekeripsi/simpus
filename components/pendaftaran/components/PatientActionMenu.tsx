"use client"

import type { Role } from "@/lib/types/role"
import type { PatientListItem } from "@/lib/types/pendaftaran"
import { canDelete, canUpdate } from "@/lib/permissions-client"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/shared/Icon"
import { Edit, Trash2, PlusCircle } from "lucide-react"

interface PatientActionMenuProps {
  role: Role
  patient: PatientListItem
  onEdit: (patientId: string) => void
  onDelete: (patientId: string) => void
  onRegister: (patientId: string) => void
}

export function PatientActionMenu({
  role,
  patient,
  onEdit,
  onDelete,
  onRegister,
}: PatientActionMenuProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRegister(patient.id)}
        className="h-auto text-primary hover:text-primary bg-primary/10 px-2.5 py-1.5 rounded hover:bg-primary/20 transition-colors flex items-center gap-1"
        title="RM Baru"
      >
        <Icon icon={PlusCircle} size="sm" />
        RM Baru
      </Button>

      {canUpdate(role) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(patient.id)}
          className="h-auto text-secondary hover:text-secondary bg-secondary/10 px-2.5 py-1.5 rounded hover:bg-secondary/20 transition-colors flex items-center gap-1"
          title="Ubah"
        >
          <Icon icon={Edit} size="sm" />
          Ubah
        </Button>
      )}

      {canDelete(role) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(patient.id)}
          className="h-auto text-danger hover:text-danger bg-danger/10 px-2.5 py-1.5 rounded hover:bg-danger/20 transition-colors flex items-center gap-1"
          title="Hapus"
        >
          <Icon icon={Trash2} size="sm" />
          Hapus
        </Button>
      )}
    </div>
  )
}
