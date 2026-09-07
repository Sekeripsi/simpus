/**
 * Loading Skeleton for Medical Record Detail Page
 * Provides instant visual feedback while data is fetching
 */

export default function RekamMedisDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col transition-all duration-500">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 w-full shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col gap-1">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Patient Info Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-100"></div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 border-b border-gray-200">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Visit Info Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-100"></div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-3 justify-end">
          <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </main>
    </div>
  );
}
