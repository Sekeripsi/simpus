/**
 * Login page loading skeleton
 * Displayed while the login page is loading
 */

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-6">
        {/* Logo Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-40 mx-auto animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-48 mx-auto animate-pulse" />
        </div>

        {/* Form Skeleton */}
        <div className="space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Submit Button */}
          <div className="h-10 bg-blue-200 rounded animate-pulse mt-6" />
        </div>

        {/* Footer Skeleton */}
        <div className="text-center space-y-2">
          <div className="h-4 bg-gray-100 rounded w-32 mx-auto animate-pulse" />
          <div className="h-4 bg-blue-100 rounded w-24 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  )
}
