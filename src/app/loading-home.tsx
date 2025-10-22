export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-16 w-32 bg-white/20 rounded"></div>
            <div className="h-10 w-32 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner Skeleton */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-3">
          <div className="h-4 bg-yellow-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section Skeleton */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gray-200 rounded-xl h-64"></div>
        </div>

        {/* Welcome Text Skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-200 rounded-xl h-48"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>

        {/* How it Works Skeleton */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <div className="bg-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="h-4 bg-gray-700 rounded w-48 mx-auto mb-4"></div>
          <div className="h-3 bg-gray-700 rounded w-64 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
