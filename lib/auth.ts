import type { Role } from "@/lib/types/role"

export interface AuthUser {
  id: string
  username: string
  name: string
  role: Role
}

function parseAuthUser(value: string | undefined): AuthUser | null {
  if (!value) return null
  try {
    const user = JSON.parse(value) as AuthUser
    if (user && user.username && user.role) return user
    return null
  } catch {
    return null
  }
}

export async function getAuth(): Promise<AuthUser | null> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  return parseAuthUser(cookieStore.get("auth-user")?.value)
}

export async function getServerToken(): Promise<string | undefined> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value
}

export function getClientAuth(): AuthUser | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    /(?:^|;\s*)auth-user=([^;]*)/
  )
  if (!match) return null
  return parseAuthUser(decodeURIComponent(match[1]))
}
