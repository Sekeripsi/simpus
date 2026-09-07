import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3003"

const HOP_BY_HOP_HEADERS = [
  "host", "connection", "keep-alive", "proxy-authenticate",
  "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade",
]

export async function proxyToBackend(
  request: NextRequest,
  path: string,
  options?: { method?: string; body?: BodyInit | null }
) {
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

  const headers = new Headers(request.headers)
  HOP_BY_HOP_HEADERS.forEach((h) => headers.delete(h))
  headers.delete("cookie")

  const authToken = request.cookies.get("auth-token")?.value
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(url, {
      method: options?.method ?? request.method,
      headers,
      body: options?.body ?? (["GET", "HEAD"].includes(request.method) ? undefined : await request.blob()),
    })

    const responseHeaders = new Headers(response.headers)
    HOP_BY_HOP_HEADERS.forEach((h) => responseHeaders.delete(h))

    const text = await response.text()
    let data: Record<string, unknown>

    try {
      data = JSON.parse(text) as Record<string, unknown>
    } catch {
      return NextResponse.json(
        { error: "Backend returned an invalid response" },
        { status: 502 }
      )
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch {
    return NextResponse.json(
      { error: "Backend service unavailable" },
      { status: 502 }
    )
  }
}
