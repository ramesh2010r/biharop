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
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm border-t border-gray-700 pt-4">
          <Link 
            href="/about" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            About Us
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/blog" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/privacy-policy" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/terms-of-service" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/contact" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact Us
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/disclaimer" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  )
}
