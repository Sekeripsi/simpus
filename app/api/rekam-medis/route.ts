import { NextRequest, NextResponse } from "next/server"
import { proxyToBackend } from "@/lib/api-proxy"
import { createMedicalRecordSchema } from "@/lib/validations/rekam-medis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createMedicalRecordSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { success: false, error: "Data rekam medis tidak valid", fieldErrors },
        { status: 400 }
      )
    }

    return proxyToBackend(request, "rekam-medis", {
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
