"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "../components/shared/Icon"
import { AlertCircle, Home, ArrowRight } from "lucide-react"

export default function NotFound() {
  const pathname = usePathname()

  useEffect(() => {
    // Log 404 for monitoring
    logger.warn("Page not found", {
      path: pathname ?? "unknown",
    })
  }, [pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl -z-10"></div>

      {/* Main Content */}
      <Card className="max-w-2xl w-full bg-white/80 backdrop-blur-sm shadow-xl py-0">
        <CardContent className="p-8 md:p-10">
          <div className="text-center mb-12">
          {/* Large 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
              404
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto"></div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-xl"></div>
              <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-blue-100">
                <Icon icon={AlertCircle} className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Halaman Tidak Ditemukan
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman telah dipindahkan atau terhapus.
          </p>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {/* Primary Button - Go to Home */}
            <Button
              render={<Link href="/home" />}
							nativeButton={false}
              className="group h-auto gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon icon={Home} className="w-5 h-5" />
              <span>Kembali ke Dashboard</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-sm text-slate-500">
            <p>
              Jika Anda merasa ini adalah kesalahan,{" "}
              <Button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/"
                  }
                }}
                variant="link"
                className="h-auto p-0 text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
              >
                hubungi dukungan
              </Button>
              .
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 text-center">
          <p className="text-xs text-slate-500 font-medium">
            SIMPUS - Sistem Informasi Manajemen Puskesmas
          </p>
        </div>
        </CardContent>
      </Card>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-slate-900/90 text-slate-100 text-xs p-3 rounded-lg max-w-xs backdrop-blur-sm border border-slate-700">
          <p className="font-mono">
            Path: <span className="text-blue-400">{pathname ?? "N/A"}</span>
          </p>
        </div>
      )}
    </div>
  )
}
