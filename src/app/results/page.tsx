import ResultsPage from '@/components/ResultsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Results | परिणाम - Bihar Opinion Poll 2025',
  description: 'View real-time results of Bihar Assembly Election 2025 opinion poll. See constituency-wise predictions, alliance seat counts, and live voting trends.',
  alternates: {
    canonical: 'https://opinionpoll.co.in/results',
  },
  keywords: ['bihar election results', 'bihar opinion poll results', 'bihar live results', 'constituency wise results', 'बिहार चुनाव परिणाम'],
}

export default function Results() {
  return <ResultsPage />
}
