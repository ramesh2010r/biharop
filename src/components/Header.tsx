import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Centered Logo */}
        <div className="flex justify-center">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <div className="relative w-48 sm:w-56 md:w-72 lg:w-80 h-auto">
              <Image
                src="/images/Logo_OP.webp"
                alt="Bihar Opinion Poll Logo"
                width={636}
                height={269}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
