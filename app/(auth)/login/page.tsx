import LoginForm from "@/components/auth/LoginForm"
import Image from "next/image"
import type { Metadata } from "next"

import LogoImage from "@/public/images/logo.png"

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke sistem manajemen puskesmas",
  robots: {
    index: false,
  },
}

export default function LoginPage() {
  return (
    <main className="h-full flex flex-col items-center justify-between bg-background relative overflow-hidden">
      <div className="flex justify-center items-center">
        <Image src={LogoImage} alt="Logo" width={100} height={100} className="w-8 h-8" />
        <h1 className="font-playfair text-xl font-normal">Simpus</h1>
      </div>
      <LoginForm />
      <div className="text-center">
        <p className="text-xs font-poppins">©2026 Simpus. All rights reserved.</p>
      </div>
    </main>
  )
}
