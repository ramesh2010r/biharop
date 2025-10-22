import WelcomePage from '@/components/WelcomePage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'बिहार विधानसभा चुनाव 2025 ओपिनियन पोल | स्वतंत्र राय सर्वेक्षण',
  description: 'बिहार विधानसभा चुनाव 2025 के लिए भारत का सबसे विश्वसनीय ओपिनियन पोल। 243 सीटों के लिए वास्तविक समय परिणाम। गुमनाम, सुरक्षित और निष्पक्ष। अभी अपनी राय दें और देखें कौन आगे है।',
  keywords: [
    'bihar election 2025',
    'bihar opinion poll',
    'bihar assembly election',
    'विधानसभा चुनाव बिहार',
    'बिहार ओपिनियन पोल',
    'bihar vidhan sabha election',
    'election results bihar',
    'bihar constituency results',
    'जिला wise results',
    'मतदान सर्वेक्षण',
    'opinion survey bihar',
    'bihar election prediction',
    'वोटिंग poll बिहार',
    '243 assembly seats',
    'real time results'
  ],
  openGraph: {
    title: 'बिहार विधानसभा चुनाव 2025 - स्वतंत्र ओपिनियन पोल',
    description: '243 विधानसभा सीटों के लिए वास्तविक समय परिणाम। गुमनाम और सुरक्षित मतदान। अभी भाग लें!',
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'बिहार विधानसभा चुनाव 2025 ओपिनियन पोल',
    description: '243 सीटों के लिए वास्तविक समय परिणाम। गुमनाम, सुरक्षित, निष्पक्ष।',
  },
  alternates: {
    canonical: 'https://opinionpoll.co.in',
  },
}

export default function Home() {
  return <WelcomePage />
}
