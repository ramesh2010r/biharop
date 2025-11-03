import VotingPage from '@/components/VotingPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cast Your Vote | अपनी राय दें - Bihar Opinion Poll',
  description: 'Cast your vote for Bihar Assembly Election 2025. Choose your district, constituency, and preferred candidate. Anonymous and secure voting.',
  alternates: {
    canonical: 'https://opinionpoll.co.in/vote',
  },
  keywords: ['bihar vote', 'cast vote bihar', 'bihar opinion poll vote', 'bihar election voting', 'मतदान बिहार'],
}

export default function Vote() {
  return <VotingPage />
}
