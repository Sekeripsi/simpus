/**
 * Home page loading skeleton
 * Displayed while the dashboard is loading
 */

import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton"

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSkeleton />
      </div>
    </div>
  )
}
