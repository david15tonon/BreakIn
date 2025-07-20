export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      {/* Navigation Skeleton */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
                <div className="ml-2 h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Skeleton */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-5 gap-2 bg-black/60 border border-white/5 rounded-lg p-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-black/40 border-white/5 rounded-lg p-4">
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Current Sprint Skeleton */}
            <div className="bg-black/40 border-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-64 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 w-16 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-28 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-black/40 border-white/5 rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-700 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-48 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Achievement Streak Skeleton */}
            <div className="bg-black/40 border-white/5 rounded-lg p-6">
              <div className="h-6 w-36 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="text-center">
                <div className="h-12 w-16 bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mx-auto mb-4"></div>
                <div className="h-2 w-full bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-28 bg-gray-700 rounded animate-pulse mx-auto"></div>
              </div>
            </div>

            {/* Level Progress Skeleton */}
            <div className="bg-black/40 border-white/5 rounded-lg p-6">
              <div className="h-6 w-28 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-36 bg-gray-700 rounded animate-pulse mx-auto"></div>
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="bg-black/40 border-white/5 rounded-lg p-6">
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-full bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
