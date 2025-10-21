import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <p className="mb-2">© 2025 Bihar Opinion Poll. All Rights Reserved.</p>
          <p className="text-sm text-gray-400">
            This is an independent opinion poll and is not affiliated with the Election Commission of India.
          </p>
        </div>
        
        {/* Footer Links */}
        <div className="flex justify-center items-center space-x-6 text-sm border-t border-gray-700 pt-4">
          <Link 
            href="/disclaimer" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Disclaimer
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/disclaimer#privacy" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/disclaimer#contact" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
