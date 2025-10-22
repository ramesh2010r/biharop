import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Bihar Election Opinion Poll 2025 | बिहार चुनाव ओपिनियन पोल',
    template: '%s | Bihar Opinion Poll'
  },
  description: 'Independent opinion poll for Bihar Assembly Election 2025. Express your opinion anonymously and view real-time constituency-wise results. बिहार विधानसभा चुनाव 2025 के लिए स्वतंत्र ओपिनियन पोल।',
  keywords: ['Bihar Election', 'Opinion Poll', 'Assembly Election 2025', 'Voting', 'बिहार चुनाव', 'ओपिनियन पोल', 'विधानसभा चुनाव', 'Constituency Results', 'Political Survey'],
  authors: [{ name: 'Opinion Poll Bihar Team' }],
  creator: 'Opinion Poll Bihar',
  publisher: 'Opinion Poll Bihar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://opinionpoll.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: 'https://opinionpoll.co.in',
    title: 'Bihar Election Opinion Poll 2025 | बिहार चुनाव ओपिनियन पोल',
    description: 'मैंने अपना मत सफलतापूर्वक दर्ज कर दिया है। आप भी नीचे दिए गए लिंक पर क्लिक करके दर्ज करें। I have successfully cast my vote. Click the link below to cast your vote.',
    siteName: 'Bihar Opinion Poll',
    images: [
      {
        url: 'https://opinionpoll.co.in/images/og-share-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bihar Opinion Poll - Cast Your Vote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bihar Election Opinion Poll 2025 | बिहार चुनाव ओपिनियन पोल',
    description: 'मैंने अपना मत सफलतापूर्वक दर्ज कर दिया है। आप भी अपनी राय दें।',
    images: ['https://opinionpoll.co.in/images/og-share-image.jpg'],
    creator: '@BiharOpinionPoll',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  // AI-friendly metadata
  other: {
    'google-site-verification': 'your-google-verification-code',
    'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'googlebot': 'index, follow',
    'bingbot': 'index, follow',
    'language': 'Hindi, English',
    'coverage': 'Bihar, India',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '1 day',
    'author': 'Bihar Opinion Poll Team',
    'geo.region': 'IN-BR',
    'geo.placename': 'Bihar',
    'geo.position': '25.0961;85.3131',
    'ICBM': '25.0961, 85.3131',
    // AI crawlers specific
    'ai-content-declaration': 'ai-assisted',
    'content-type': 'political-survey-data',
    'data-freshness': 'real-time',
    'update-frequency': 'continuous',
  },
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
