import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bihar Election Opinion Poll 2025 | बिहार चुनाव ओपिनियन पोल',
  description: 'Independent opinion poll for Bihar Assembly Election 2025. Express your opinion anonymously. बिहार विधानसभा चुनाव 2025 के लिए स्वतंत्र ओपिनियन पोल।',
  keywords: 'Bihar Election, Opinion Poll, Assembly Election 2025, Voting, बिहार चुनाव, ओपिनियन पोल',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi-IN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} font-hindi`}>
        <GoogleAnalytics />
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
