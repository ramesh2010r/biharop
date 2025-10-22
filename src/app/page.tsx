import WelcomePage from '@/components/WelcomePage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'बिहार विधानसभा चुनाव 2025 ओपिनियन पोल | स्वतंत्र राय सर्वेक्षण',
  description: 'बिहार विधानसभा चुनाव 2025 के लिए भारत का सबसे विश्वसनीय ओपिनियन पोल। 243 सीटों के लिए वास्तविक समय परिणाम। गुमनाम, सुरक्षित और निष्पक्ष। अभी अपनी राय दें और देखें कौन आगे है।',
  openGraph: {
    title: 'Bihar Election Opinion Poll 2025 | बिहार चुनाव ओपिनियन पोल',
    description: 'मैंने अपना मत सफलतापूर्वक दर्ज कर दिया है। आप भी नीचे दिए गए लिंक पर क्लिक करके दर्ज करें।',
    url: 'https://opinionpoll.co.in',
    siteName: 'Bihar Opinion Poll',
    images: [
      {
        url: 'https://opinionpoll.co.in/images/og-share-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bihar Election Opinion Poll 2025 - Cast Your Vote',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bihar Election Opinion Poll 2025 | बिहार चुनाव ओपिनियन पोल',
    description: 'मैंने अपना मत सफलतापूर्वक दर्ज कर दिया है। आप भी अपनी राय दें।',
    images: ['https://opinionpoll.co.in/images/og-share-image.jpg'],
  },
  keywords: [
    // High-volume primary keywords
    'bihar election 2025',
    'bihar opinion poll',
    'bihar assembly election',
    'bihar vidhan sabha election',
    'bihar election results',
    
    // Long-tail keywords (low competition, high intent)
    'bihar election 2025 opinion poll',
    'bihar election survey 2025',
    'bihar assembly election opinion poll',
    'bihar vidhan sabha chunav 2025',
    'bihar election constituency wise results',
    'bihar opinion poll 2025 today',
    'bihar assembly seats prediction 2025',
    'bihar election live poll',
    'bihar constituency wise opinion poll',
    '243 seats bihar election',
    
    // Hindi keywords (low competition)
    'बिहार चुनाव 2025',
    'बिहार ओपिनियन पोल 2025',
    'विधानसभा चुनाव बिहार',
    'बिहार चुनाव सर्वेक्षण',
    'बिहार विधानसभा सीट',
    'बिहार मतदान 2025',
    'बिहार इलेक्शन पोल',
    'बिहार चुनाव नतीजे',
    'विधानसभा सीट बिहार',
    '243 सीट बिहार',
    
    // District/region specific (very low competition)
    'patna election poll 2025',
    'gaya election opinion poll',
    'muzaffarpur election survey',
    'bhagalpur constituency poll',
    'darbhanga election 2025',
    
    // Party-specific keywords (moderate competition)
    'bjp bihar opinion poll 2025',
    'rjd bihar poll 2025',
    'jdu bihar election poll',
    'congress bihar opinion poll',
    'nda bihar poll 2025',
    'india alliance bihar poll',
    
    // User intent keywords (low competition)
    'how to vote bihar opinion poll',
    'bihar election prediction website',
    'free bihar opinion poll',
    'online bihar voting survey',
    'anonymous bihar poll',
    'real time bihar election results',
    'live bihar opinion poll',
    'instant bihar election survey',
    
    // Question-based keywords (low competition)
    'who will win bihar election 2025',
    'which party winning bihar 2025',
    'bihar election winner prediction',
    'best opinion poll bihar',
    'trusted bihar election survey',
    
    // Location + time combinations (very low competition)
    'bihar election poll january 2025',
    'bihar constituency results live',
    'bihar district wise voting trend',
    'bihar assembly election tracker',
    'bihar election live updates poll'
  ],
  alternates: {
    canonical: 'https://opinionpoll.co.in',
  },
}

export default function Home() {
  return <WelcomePage />
}
