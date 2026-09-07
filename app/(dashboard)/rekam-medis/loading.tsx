/**
 * Rekam Medis page loading skeleton
 * Displayed while the medical records page is loading
 */

export default function RekamMedisLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-96 animate-pulse" />
        </div>

        {/* Filters/Search Skeleton */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <div className="h-10 bg-gray-100 rounded flex-1 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded w-24 animate-pulse" />
          </div>
        </div>

        {/* Records Table Skeleton */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="px-6 py-4 flex gap-4 border-b border-gray-200">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded flex-1 animate-pulse"
                />
              ))}
            </div>

            {/* Table Rows */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 flex gap-4 border-b border-gray-100 hover:bg-gray-50"
              >
                {[...Array(6)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-100 rounded flex-1 animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
