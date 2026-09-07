export function getBackendUrl(): string {
  return process.env.BACKEND_URL || "http://localhost:3003"
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api"
}
