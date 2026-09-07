import type { Role } from "@/lib/types/role"

/**
 * Enum for permission actions
 * Represents the four CRUD operations
 */
export enum PermissionAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

/**
 * Permission matrix: defines which actions each role is allowed to perform
 *
 * ADMIN: Full access to all actions
 * STAFF: Full CRUD access (all actions)
 * DOCTOR: Read-only access
 */
export const rolePermissions: Record<Role, PermissionAction[]> = {
  ADMIN: [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.DELETE,
  ],
  STAFF: [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.DELETE,
  ],
  DOCTOR: [
    PermissionAction.READ,
  ],
}

/**
 * Helper function to check if a role can perform a specific action
 *
 * @param role - The user's role
 * @param action - The action to check (CREATE, READ, UPDATE, DELETE)
 * @returns true if the role is allowed to perform the action, false otherwise
 */
export function canPerformAction(
  role: Role,
  action: PermissionAction
): boolean {
  const permissions = rolePermissions[role]
  // If role doesn't exist in permissions matrix, deny by default
  if (!permissions) {
    return false
  }
  return permissions.includes(action)
}
