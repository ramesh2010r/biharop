import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">पृष्ठ नहीं मिला</h2>
        <p className="text-gray-600 mb-6">Page Not Found</p>
        
        <p className="text-sm text-gray-500 mb-8">
          क्षमा करें, यह पृष्ठ मौजूद नहीं है।
          <br />
          Sorry, the page you are looking for doesn&apos;t exist.
        </p>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          मुख्य पृष्ठ पर जाएं / Go to Home
        </Link>
      </div>
    </div>
  )
}
