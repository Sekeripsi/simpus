"use client"

import { useEffect } from "react"
import Link from "next/link"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/shared/Icon"
import { Lock } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error("Authentication error", {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="bg-white shadow-xl max-w-md w-full py-0">
        <CardContent className="p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Icon icon={Lock} size="xl" className="text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Authentication Error
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 text-center mb-4">
            An error occurred during authentication. Please try logging in again.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-6 text-sm">
              <p className="font-mono text-red-800 break-words">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={() => reset()} className="w-full">
              Try Again
            </Button>
            <Button
              render={<Link href="/login" />}
							nativeButton={false}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
