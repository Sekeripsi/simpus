import type { Role } from "@/lib/types/role"
import { PermissionAction, canPerformAction } from "@/lib/permissions"

export function canRead(role: Role): boolean {
  return canPerformAction(role, PermissionAction.READ)
}

export function canCreate(role: Role): boolean {
  return canPerformAction(role, PermissionAction.CREATE)
}

export function canUpdate(role: Role): boolean {
  return canPerformAction(role, PermissionAction.UPDATE)
}

export function canDelete(role: Role): boolean {
  return canPerformAction(role, PermissionAction.DELETE)
}
