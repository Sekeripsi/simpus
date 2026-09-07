import { NextRequest, NextResponse } from "next/server"
import { proxyToBackend } from "@/lib/api-proxy"
import { updatePatientSchema } from "@/lib/validations/patient"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyToBackend(request, `patients/${id}`)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = updatePatientSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { success: false, error: "Data pasien tidak valid", fieldErrors },
        { status: 400 }
      )
    }

    return proxyToBackend(request, `patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(parsed.data),
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyToBackend(request, `patients/${id}`, { method: "DELETE" })
}
