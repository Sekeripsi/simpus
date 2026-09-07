"use server"

import { logger } from "@/lib/logger"
import { loginSchema } from "@/lib/validations/auth"
import { getBackendUrl } from "@/lib/config/api"
import { cookies } from "next/headers"
import { ZodError } from "zod"

export interface LoginActionState {
  success?: boolean
  error?: string
  errors?: Record<string, string>
}

const API_BASE_URL = getBackendUrl()

export async function loginAction(
  _prevState: LoginActionState | undefined,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const input = {
      username: formData.get("username"),
      password: formData.get("password"),
    }

    const validatedInput = loginSchema.parse(input)
    logger.info("Login attempt", { username: validatedInput.username })

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: validatedInput.username,
        password: validatedInput.password,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Invalid username or password" }))
      return { error: err.message || "Invalid username or password" }
    }

    const data = await res.json()
    const cookieStore = await cookies()

    cookieStore.set("auth-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    cookieStore.set("auth-user", JSON.stringify(data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    logger.info("Login successful", { username: validatedInput.username })
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const errorMessages: Record<string, string> = {}
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && Array.isArray(messages) && messages.length > 0) {
          errorMessages[field] = messages[0]
        }
      }
      return { errors: errorMessages }
    }

    logger.error("Unexpected error during login", error instanceof Error ? error : { message: String(error) })
    return { error: "An unexpected error occurred" }
  }

  return { error: "An unexpected error occurred" }
}
