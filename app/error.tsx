"use client"

import { useEffect } from "react"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "../components/shared/Icon"
import { AlertCircle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for monitoring/debugging
    logger.error("Application error", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="bg-white shadow-lg max-w-md w-full py-0">
        <CardContent className="p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Icon icon={AlertCircle} className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Oops! Something went wrong
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 text-center mb-2">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-6 text-sm">
              <p className="font-mono text-red-800 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-red-600 text-xs mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={() => reset()} className="w-full">
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = "/home")} variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
