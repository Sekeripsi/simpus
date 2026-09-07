"use client"
import { useState } from "react"
import { ErrorIcon, Icon } from "@/components/shared/Icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Invalid username or password")
        setIsPending(false)
        return
      }

      const days = 1
      const expires = new Date(Date.now() + days * 864e5).toUTCString()

      document.cookie = `auth-token=${data.token}; path=/; expires=${expires}; SameSite=Lax`
      document.cookie = `auth-user=${JSON.stringify(data.user)}; path=/; expires=${expires}; SameSite=Lax`

      window.location.href = "/home"
    } catch {
      setError("An unexpected error occurred")
      setIsPending(false)
    }
  }

  return (
    <div className="w-md flex flex-col justify-center gap-16 font-poppins">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-6xl font-normal text-foreground font-playfair">
          Selamat Datang
        </h2>
        <p className="text-sm font-poppins">Masukkan username dan password anda</p>
      </div>

      <form onSubmit={handleSubmit} method="POST" className="space-y-5">
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="username"
              className="block text-sm font-semibold leading-6 text-gray-700 ml-1"
            >
              Username <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Masukkan username anda"
              className="block h-12 w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="password"
              className="block text-sm font-semibold leading-6 text-gray-700"
            >
              Password <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Masukkan password anda"
              className="block h-12 w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
            />
          </Field>

          {error && (
            <div className="flex items-center gap-2">
              <ErrorIcon />
              <FieldDescription className="text-red-500">
                {error}
              </FieldDescription>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="font-poppins flex h-12 w-full justify-center rounded-full bg-main-blue px-3 py-3 text-sm font-bold leading-6 text-white shadow-lg hover:bg-main-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] hover:cursor-pointer"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Icon icon={Loader2} className="animate-spin text-white" size="sm" />
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
