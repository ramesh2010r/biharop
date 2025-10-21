import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  showResultsButton?: boolean
}

export default function Header({ showResultsButton = true }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200">
      <div className="container mx-auto px-4 pt-2 md:pt-3">
        <div className="flex items-center justify-between">
          {/* Logo Only */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <div className="relative w-64 md:w-80 lg:w-96 h-auto">
              <Image
                src="/images/Logo_OP.webp"
                alt="Bihar Opinion Poll Logo"
                width={384}
                height={384}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
          </Link>

          {/* Results Button */}
          {showResultsButton && (
            <Link 
              href="/results" 
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 md:px-10 lg:px-12 py-3 md:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hindi-text text-base md:text-lg lg:text-xl whitespace-nowrap"
            >
              परिणाम देखें
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
