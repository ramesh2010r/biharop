'use client'

import Script from 'next/script'

interface StructuredDataProps {
  type: 'organization' | 'website' | 'faqpage' | 'dataset' | 'article' | 'breadcrumb'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': 'https://opinionpoll.co.in/#organization',
          name: 'Bihar Opinion Poll',
          alternateName: 'बिहार ओपिनियन पोल',
          legalName: 'Bihar Opinion Poll - Independent Survey Platform',
          url: 'https://opinionpoll.co.in',
          logo: {
            '@type': 'ImageObject',
            '@id': 'https://opinionpoll.co.in/#logo',
            url: 'https://opinionpoll.co.in/images/Logo_OP.webp',
            width: 636,
            height: 269,
            caption: 'Bihar Opinion Poll Logo'
          },
          description: 'Independent opinion poll platform for Bihar Assembly Elections 2025. Real-time results from 243 constituencies. Anonymous, secure, and transparent voting system.',
          foundingDate: '2025-01-01',
          keywords: 'bihar election, opinion poll, assembly election, election survey, voting poll, election results, bihar politics',
          areaServed: {
            '@type': 'State',
            name: 'Bihar',
            '@id': 'https://www.wikidata.org/wiki/Q1165'
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'Customer Service',
              email: 'info@opinionpoll.co.in',
              availableLanguage: ['Hindi', 'English']
            },
            {
              '@type': 'ContactPoint',
              contactType: 'Technical Support',
              email: 'support@opinionpoll.co.in',
              availableLanguage: ['Hindi', 'English']
            }
          ],
          sameAs: [
            'https://twitter.com/biharopinionpoll',
            'https://facebook.com/biharopinionpoll'
          ],
          knowsAbout: [
            'Bihar Elections',
            'Political Surveys',
            'Opinion Polls',
            'Electoral Analysis',
            'Democratic Participation'
          ]
        }

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://opinionpoll.co.in/#website',
          name: 'Bihar Opinion Poll 2025',
          alternateName: 'बिहार ओपिनियन पोल 2025',
          url: 'https://opinionpoll.co.in',
          description: 'Bihar Assembly Election 2025 opinion poll - Real-time results from 243 constituencies, anonymous voting, transparent and secure system. Participate in India\'s most trusted election survey.',
          inLanguage: ['hi-IN', 'en-IN'],
          copyrightYear: 2025,
          copyrightHolder: {
            '@id': 'https://opinionpoll.co.in/#organization'
          },
          publisher: {
            '@id': 'https://opinionpoll.co.in/#organization'
          },
          potentialAction: [
            {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://opinionpoll.co.in/results?constituency={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            },
            {
              '@type': 'VoteAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://opinionpoll.co.in/vote'
              },
              description: 'Cast your opinion poll vote for Bihar Assembly Elections 2025'
            }
          ],
          about: {
            '@type': 'Event',
            name: 'Bihar Assembly Elections 2025',
            description: '243 constituency assembly elections in Bihar',
            startDate: '2025-11-01T00:00:00+05:30',
            endDate: '2025-11-30T23:59:59+05:30',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'State',
              name: 'Bihar',
              addressCountry: 'IN',
              address: {
                '@type': 'PostalAddress',
                addressRegion: 'Bihar',
                addressCountry: 'IN'
              }
            },
            image: 'https://opinionpoll.co.in/images/Logo_OP.webp',
            organizer: {
              '@id': 'https://opinionpoll.co.in/#organization'
            },
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            isAccessibleForFree: true,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: 'https://opinionpoll.co.in/vote'
            }
          }
        }

      case 'dataset':
        // NEW: Dataset schema for AI systems to understand our data structure
        return {
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          '@id': 'https://opinionpoll.co.in/#dataset',
          name: 'Bihar Assembly Election 2025 Opinion Poll Results',
          description: 'Real-time opinion poll data for Bihar Assembly Elections 2025 covering all 243 constituencies across 38 districts. Updated continuously with anonymous voter preferences.',
          url: 'https://opinionpoll.co.in/results',
          keywords: [
            'bihar election data',
            'opinion poll results',
            'constituency wise results',
            'election survey data',
            'political trends',
            'voting patterns',
            'assembly seats prediction'
          ],
          creator: {
            '@id': 'https://opinionpoll.co.in/#organization'
          },
          publisher: {
            '@id': 'https://opinionpoll.co.in/#organization'
          },
          datePublished: '2025-01-01',
          dateModified: new Date().toISOString(),
          temporalCoverage: '2025-01-01/2025-12-31',
          spatialCoverage: {
            '@type': 'State',
            name: 'Bihar',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 25.0961,
              longitude: 85.3131
            }
          },
          variableMeasured: [
            'Constituency-wise vote count',
            'Party-wise preferences',
            'District-wise aggregated results',
            'Real-time participation statistics'
          ],
          distribution: [
            {
              '@type': 'DataDownload',
              encodingFormat: 'application/json',
              contentUrl: 'https://opinionpoll.co.in/api/results'
            }
          ],
          license: 'https://opinionpoll.co.in/terms-of-service'
        }

      case 'article':
        // NEW: Article schema for content pages
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': data?.url || 'https://opinionpoll.co.in/#article',
          headline: data?.headline || 'Bihar Assembly Elections 2025 - Live Opinion Poll',
          description: data?.description || 'Comprehensive opinion poll coverage of Bihar Assembly Elections 2025 with real-time results from 243 constituencies.',
          image: 'https://opinionpoll.co.in/images/Logo_OP.webp',
          author: {
            '@id': 'https://opinionpoll.co.in/#organization'
          },
          publisher: {
            '@id': 'https://opinionpoll.co.in/#organization'
          },
          datePublished: data?.datePublished || '2025-01-01T00:00:00+05:30',
          dateModified: data?.dateModified || new Date().toISOString(),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data?.url || 'https://opinionpoll.co.in'
          },
          articleSection: 'Politics',
          keywords: data?.keywords || 'bihar election, opinion poll, assembly election, election results',
          inLanguage: 'hi-IN',
          about: {
            '@type': 'Thing',
            name: 'Bihar Assembly Elections 2025',
            description: 'State legislative assembly elections in Bihar'
          }
        }

      case 'breadcrumb':
        // NEW: Breadcrumb for better AI understanding of site structure
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.breadcrumbs || [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://opinionpoll.co.in'
            }
          ]
        }

      case 'faqpage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': 'https://opinionpoll.co.in/#faq',
          mainEntity: data?.questions || [
            {
              '@type': 'Question',
              name: 'क्या यह आधिकारिक मतदान है? / Is this official voting?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'नहीं, यह एक स्वतंत्र ओपिनियन पोल है, आधिकारिक चुनाव नहीं। यह केवल जनता की राय जानने के लिए है। This is an independent opinion poll, not official voting. It is only for understanding public sentiment.'
              }
            },
            {
              '@type': 'Question',
              name: 'क्या मेरी पहचान गुप्त रहेगी? / Will my identity remain confidential?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'हां, आपकी पहचान पूरी तरह से गोपनीय है। हम कोई व्यक्तिगत जानकारी नहीं मांगते या संग्रहीत नहीं करते। Yes, your identity is completely confidential. We do not ask for or store any personal information.'
              }
            },
            {
              '@type': 'Question',
              name: 'क्या मैं एक से अधिक बार वोट कर सकता हूं? / Can I vote more than once?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'प्रत्येक विधानसभा क्षेत्र में केवल एक बार वोट किया जा सकता है। हमारी सिस्टम डुप्लिकेट वोट को रोकती है। You can vote only once per assembly constituency. Our system prevents duplicate voting.'
              }
            },
            {
              '@type': 'Question',
              name: 'परिणाम कितने विश्वसनीय हैं? / How reliable are the results?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'परिणाम वास्तविक समय में अपडेट होते हैं और भाग लेने वाले लोगों की राय को दर्शाते हैं। यह एक संकेतक है, गारंटी नहीं। Results update in real-time and reflect the opinions of participants. This is an indicator, not a guarantee.'
              }
            },
            {
              '@type': 'Question',
              name: 'How many constituencies are covered in Bihar?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bihar has 243 assembly constituencies across 38 districts. Our opinion poll covers all 243 constituencies with real-time results.'
              }
            },
            {
              '@type': 'Question',
              name: 'How is data privacy maintained?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We use browser fingerprinting for duplicate prevention without storing personal information. No names, emails, or phone numbers are collected. All data is anonymized and encrypted.'
              }
            },
            {
              '@type': 'Question',
              name: 'When will the actual Bihar elections be held?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bihar Assembly Elections are scheduled for November 2025. This opinion poll helps gauge public sentiment before the actual voting.'
              }
            },
            {
              '@type': 'Question',
              name: 'Which parties are participating in Bihar elections 2025?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Major parties include BJP, JDU, RJD, Congress, and other regional parties. The opinion poll covers all major parties and independent candidates across 243 constituencies.'
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
