'use client'

import Script from 'next/script'

interface StructuredDataProps {
  type: 'organization' | 'website' | 'faqpage'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Bihar Opinion Poll',
          alternateName: 'बिहार ओपिनियन पोल',
          url: 'https://opinionpoll.co.in',
          logo: 'https://opinionpoll.co.in/images/Logo_OP.webp',
          description: 'Independent opinion poll platform for Bihar Assembly Elections 2025',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'info@opinionpoll.co.in',
            availableLanguage: ['Hindi', 'English']
          },
          sameAs: [
            'https://twitter.com/biharopinionpoll',
            'https://facebook.com/biharopinionpoll'
          ]
        }

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bihar Opinion Poll 2025',
          alternateName: 'बिहार ओपिनियन पोल 2025',
          url: 'https://opinionpoll.co.in',
          description: 'Bihar Assembly Election 2025 opinion poll - Real-time results, anonymous voting, transparent system',
          inLanguage: ['hi-IN', 'en-IN'],
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://opinionpoll.co.in/results?constituency={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        }

      case 'faqpage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data?.questions || [
            {
              '@type': 'Question',
              name: 'क्या यह आधिकारिक मतदान है?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'नहीं, यह एक स्वतंत्र ओपिनियन पोल है, आधिकारिक चुनाव नहीं। यह केवल जनता की राय जानने के लिए है।'
              }
            },
            {
              '@type': 'Question',
              name: 'क्या मेरी पहचान गुप्त रहेगी?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'हां, आपकी पहचान पूरी तरह से गोपनीय है। हम कोई व्यक्तिगत जानकारी नहीं मांगते या संग्रहीत नहीं करते।'
              }
            },
            {
              '@type': 'Question',
              name: 'क्या मैं एक से अधिक बार वोट कर सकता हूं?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'प्रत्येक विधानसभा क्षेत्र में केवल एक बार वोट किया जा सकता है। हमारी सिस्टम डुप्लिकेट वोट को रोकती है।'
              }
            },
            {
              '@type': 'Question',
              name: 'परिणाम कितने विश्वसनीय हैं?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'परिणाम वास्तविक समय में अपडेट होते हैं और भाग लेने वाले लोगों की राय को दर्शाते हैं। यह एक संकेतक है, गारंटी नहीं।'
              }
            },
            {
              '@type': 'Question',
              name: 'How is data privacy maintained?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We use browser fingerprinting for duplicate prevention without storing personal information. No names, emails, or phone numbers are collected. All data is anonymized.'
              }
            },
            {
              '@type': 'Question',
              name: 'When will the actual Bihar elections be held?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bihar Assembly Elections are scheduled for November 2025. This opinion poll helps gauge public sentiment before the actual voting.'
              }
            }
          ]
        }

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
      strategy="afterInteractive"
    />
  )
}
