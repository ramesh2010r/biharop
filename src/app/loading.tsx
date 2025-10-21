export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-gray-800 mb-2">लोड हो रहा है...</p>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
