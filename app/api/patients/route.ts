import { NextRequest, NextResponse } from "next/server"
import { proxyToBackend } from "@/lib/api-proxy"
import { createPatientSchema } from "@/lib/validations/patient"

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "patients")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createPatientSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { success: false, error: "Data pasien tidak valid", fieldErrors },
        { status: 400 }
      )
    }

    return proxyToBackend(request, "patients", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}
