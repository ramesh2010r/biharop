'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from './Header'
import DisclaimerBanner from './DisclaimerBanner'
import Footer from './Footer'
import PredictionGraph from './PredictionGraph'
import { getApiUrl } from '@/config/api'
import { generateResultImage } from '@/utils/generateResultImage'

interface District {
  id: number
  name_hindi: string
  name_english: string
}

interface Constituency {
  id: number
  district_id: number
  seat_no: number
  name_hindi: string
  name_english: string
  is_reserved: number
  reservation_type: string
}

interface ResultData {
  candidate_name: string
  candidate_name_hindi?: string
  candidate_name_english?: string
  party_name: string
  party_name_hindi?: string
  party_name_english?: string
  party_abbreviation: string
  total_votes: number
  percentage: number
}

interface BlackoutStatus {
  isBlackout: boolean
  message?: string
  nextAvailableDate?: string
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [districts, setDistricts] = useState<District[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [results, setResults] = useState<ResultData[]>([])
  const [blackoutStatus, setBlackoutStatus] = useState<BlackoutStatus>({ isBlackout: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check blackout status on mount
  useEffect(() => {
    checkBlackoutStatus()
    fetchDistricts()
    
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(iOS)
  }, [])

  // Handle URL parameters for direct constituency navigation
  useEffect(() => {
    const districtParam = searchParams?.get('district')
    const constituencyParam = searchParams?.get('constituency')
    
    if (districtParam && constituencyParam && districts.length > 0) {
      const districtId = parseInt(districtParam)
      const constituencyId = parseInt(constituencyParam)
      
      if (!isNaN(districtId) && !isNaN(constituencyId)) {
        setSelectedDistrict(districtId)
        // Fetch constituencies for this district first
        fetchConstituencies(districtId).then(() => {
          // Then set the constituency and fetch results
          setSelectedConstituency(constituencyId)
          fetchResults(constituencyId)
        })
      }
    }
  }, [searchParams, districts])

  const checkBlackoutStatus = async () => {
    try {
      const response = await fetch(getApiUrl('/api/blackout-status'))
      if (response.ok) {
        const data = await response.json()
        setBlackoutStatus(data)
      }
    } catch (err) {
      console.error('Error checking blackout status:', err)
    }
  }

  const fetchDistricts = async () => {
    try {
      const response = await fetch(getApiUrl('/api/districts'))
      if (response.ok) {
        const data = await response.json()
        setDistricts(data)
      }
    } catch (err) {
      console.error('Error fetching districts:', err)
    }
  }

  const fetchConstituencies = async (districtId: number) => {
    setLoading(true)
    try {
      const response = await fetch(getApiUrl(`/api/constituencies/${districtId}`))
      if (response.ok) {
        const data = await response.json()
        setConstituencies(data)
      }
    } catch (err) {
      setError('विधानसभा क्षेत्र लोड नहीं हो सके')
    } finally {
      setLoading(false)
    }
  }

  const fetchResults = async (constituencyId: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(getApiUrl(`/api/results/${constituencyId}`))
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'blackout_active') {
          setBlackoutStatus({ 
            isBlackout: true, 
            message: data.message,
            nextAvailableDate: data.nextAvailableDate
          })
          setResults([])
        } else {
          // Map the API response to match our interface
          const mappedResults = data.map((item: any) => ({
            ...item,
            candidate_name: item.candidate_name_hindi || item.candidate_name_english || item.candidate_name || 'नाम उपलब्ध नहीं',
            party_name: item.party_name_hindi || item.party_name_english || item.party_name || 'पार्टी उपलब्ध नहीं'
          }))
          setResults(mappedResults)
        }
      } else {
        setError('परिणाम लोड नहीं हो सके')
      }
    } catch (err) {
      setError('कृपया बाद में पुनः प्रयास करें')
    } finally {
      setLoading(false)
    }
  }

  const handleDistrictSelect = (districtId: number) => {
    setSelectedDistrict(districtId)
    setSelectedConstituency(null)
    setResults([])
    fetchConstituencies(districtId)
  }

  const handleConstituencySelect = (constituencyId: number) => {
    setSelectedConstituency(constituencyId)
    fetchResults(constituencyId)
  }

  // Share Functions
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/results' : 'https://opinionpoll.bihar.gov.in/results'
  const getShareText = () => {
    const districtName = districts.find(d => d.id === selectedDistrict)?.name_hindi
    const constituencyName = constituencies.find(c => c.id === selectedConstituency)?.name_hindi
    
    if (constituencyName && districtName) {
      return `${constituencyName}, ${districtName} के लिए बिहार चुनाव ओपिनियन पोल परिणाम देखें! Check Bihar Election Opinion Poll Results!`
    }
    return 'बिहार चुनाव ओपिनियन पोल के परिणाम देखें! Check Bihar Election Opinion Poll Results!'
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleNativeShare = async () => {
    if (results.length === 0 || !selectedConstituency || !selectedDistrict) return

    try {
      // Get constituency and district names
      const constituencyObj = constituencies.find(c => c.id === selectedConstituency)
      const districtObj = districts.find(d => d.id === selectedDistrict)
      
      if (!constituencyObj || !districtObj) return

      // Generate image using the utility
      const imageDataUrl = await generateResultImage({
        constituencyName: constituencyObj.name_hindi,
        districtName: districtObj.name_hindi,
        results: results.slice(0, 5), // Top 5 candidates
        totalVotes: results.reduce((sum, r) => sum + r.total_votes, 0)
      })

      if (!imageDataUrl) {
        alert('इमेज जेनरेट करने में त्रुटि हुई')
        return
      }

      // Convert data URL to blob
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      
      // Create file from blob
      const file = new File([blob], `bihar-poll-results-${constituencyObj.name_hindi}.jpg`, { 
        type: 'image/jpeg' 
      })
      
      // WhatsApp formatted text with bold and line breaks
      const topCandidate = results[0]
      const shareText = `🗳️ *बिहार चुनाव ओपिनियन पोल - परिणाम*

📊 ${constituencyObj.name_hindi}, ${districtObj.name_hindi}

🥇 *शीर्ष उम्मीदवार:*
${topCandidate?.candidate_name || 'N/A'} (${topCandidate?.party_abbreviation})
${topCandidate?.percentage.toFixed(1)}% वोट

✅ पूर्ण परिणाम देखें और अपना मत दर्ज करें!`
      
      const shareUrl = 'https://opinionpoll.co.in/results'
      const fullText = `${shareText}\n\n🔗 ${shareUrl}`

      // Platform-specific sharing behavior
      if (isIOS) {
        // iOS: Share image with text (works well on iOS)
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'बिहार चुनाव ओपिनियन पोल - परिणाम',
              text: fullText,
              files: [file],
            })
            console.log('Content shared successfully on iOS')
          } catch (shareErr) {
            console.error('Share error:', shareErr)
            if ((shareErr as Error).name !== 'AbortError') {
              const link = document.createElement('a')
              link.download = `bihar-poll-results-${constituencyObj.name_hindi}.jpg`
              link.href = URL.createObjectURL(blob)
              link.click()
              URL.revokeObjectURL(link.href)
              alert('इमेज डाउनलोड हो गई है! अब आप इसे मैन्युअली शेयर कर सकते हैं।')
            }
          }
        }
      } else {
        // Android: Share text only, download button will appear separately
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'बिहार चुनाव ओपिनियन पोल - परिणाम',
              text: fullText,
            })
            console.log('Text shared successfully on Android')
          } catch (shareErr) {
            console.error('Share error:', shareErr)
            if ((shareErr as Error).name !== 'AbortError') {
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`
              window.open(whatsappUrl, '_blank')
            }
          }
        } else {
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`
          window.open(whatsappUrl, '_blank')
        }
      }
    } catch (err) {
      console.error('Error sharing:', err)
      alert('शेयर करने में त्रुटि हुई। कृपया पुनः प्रयास करें।')
    }
  }

  const handleDownloadImage = async () => {
    if (results.length === 0 || !selectedConstituency || !selectedDistrict) return

    const constituencyName = constituencies.find(c => c.id === selectedConstituency)?.name_hindi || ''
    const districtName = districts.find(d => d.id === selectedDistrict)?.name_hindi || ''
    const totalVotes = results.reduce((sum, r) => sum + r.total_votes, 0)

    const imageDataUrl = await generateResultImage({
      constituencyName,
      districtName,
      results: results.slice(0, 5), // Top 5 candidates
      totalVotes
    })

    if (imageDataUrl) {
      const link = document.createElement('a')
      link.download = `bihar-poll-results-${constituencyName}.jpg`
      link.href = imageDataUrl
      link.click()
    }
  }

  // Blackout State UI
  if (blackoutStatus.isBlackout && !selectedConstituency) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />

        <DisclaimerBanner />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="card bg-yellow-50 border-2 border-yellow-400 text-center">
              <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 hindi-text mb-4">सूचना</h1>
              <div className="text-lg text-gray-700 hindi-text mb-4 leading-relaxed">
                <p className="mb-4">
                  भारतीय चुनाव आयोग के नियमों के अनुसार, मतदान समाप्त होने से 48 घंटे पहले की अवधि के दौरान 
                  ओपिनियन पोल के परिणाम प्रदर्शित नहीं किए जा सकते।
                </p>
                <p className="text-base text-gray-600 mb-4">
                  In accordance with Election Commission of India regulations, opinion poll results cannot 
                  be displayed during the 48-hour period prior to the conclusion of polling.
                </p>
                {blackoutStatus.nextAvailableDate && (
                  <div className="bg-white p-4 rounded-lg mt-4">
                    <p className="font-semibold hindi-text">परिणाम देखने के लिए कृपया वापस आएं:</p>
                    <p className="text-2xl font-bold text-primary-600 mt-2">
                      {new Date(blackoutStatus.nextAvailableDate).toLocaleString('hi-IN', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                )}
              </div>
              <Link href="/" className="btn-primary mt-6">
                होम पेज पर वापस जाएं
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Normal Results Display
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <DisclaimerBanner />

      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Selection Card - Always show at top */}
        {!loading && !blackoutStatus.isBlackout && (
          <div className="max-w-5xl mx-auto mb-8">
            {/* Main Selection Card with Modern Design */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
              </div>

              {/* Content Container */}
              <div className="relative z-10 p-6 md:p-10">
                {/* Header with Icon */}
                <div className="flex items-center justify-center mb-6 md:mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white hindi-text">
                      क्षेत्र चयन
                    </h2>
                  </div>
                </div>

                {/* Selection Grid */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  {/* District Selector */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-white hindi-text font-semibold text-sm md:text-base">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span>जिला चुनें</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDistrict || ''}
                        onChange={(e) => handleDistrictSelect(Number(e.target.value))}
                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/30 focus:border-white text-gray-800 font-medium text-sm md:text-base appearance-none cursor-pointer transition-all duration-200 hover:shadow-lg"
                      >
                        <option value="">-- जिला चुनें --</option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name_hindi}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Constituency Selector */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-white hindi-text font-semibold text-sm md:text-base">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      <span>विधानसभा चुनें</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedConstituency || ''}
                        onChange={(e) => handleConstituencySelect(Number(e.target.value))}
                        disabled={!selectedDistrict}
                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-transparent rounded-xl focus:ring-4 focus:ring-white/30 focus:border-white text-gray-800 font-medium text-sm md:text-base appearance-none cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500 transition-all duration-200 hover:shadow-lg disabled:hover:shadow-none"
                      >
                        <option value="">-- विधानसभा चुनें --</option>
                        {constituencies.map((constituency) => (
                          <option key={constituency.id} value={constituency.id}>
                            {constituency.name_hindi}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simple Text Message */}
                {!selectedDistrict && (
                  <div className="mt-6 text-center">
                    <p className="text-white text-base md:text-lg hindi-text font-medium">
                      परिणाम देखने के लिए कृपया जिला और विधानसभा का चयन करें
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 hindi-text mb-6 md:mb-8 text-center">
          ओपिनियन पोल के परिणाम
        </h1>

        {/* Prediction Graph - Real-time Winner Prediction */}
        {!blackoutStatus.isBlackout && (
          <div className="max-w-5xl mx-auto mb-8">
            <PredictionGraph />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 hindi-text">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 hindi-text">परिणाम लोड हो रहे हैं...</p>
          </div>
        )}

        {/* Results Display Card */}
        {!loading && !blackoutStatus.isBlackout && results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Section 2: Results Display - Only show if results exist */}
              {results.length > 0 && (
                <>
                  <div className="py-6 md:py-8 px-4 md:px-6 border-b-2 border-gray-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 hindi-text mb-4 md:mb-6 text-center">
                      मतदान परिणाम
                    </h2>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold text-gray-800 hindi-text text-sm md:text-base">
                            {result.candidate_name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            {result.party_name} ({result.party_abbreviation})
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl md:text-3xl font-bold text-primary-600">
                            {result.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
                        <div
                          className="bg-primary-600 h-2.5 md:h-3 rounded-full transition-all duration-500"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <p className="text-xs md:text-sm text-gray-500 hindi-text text-center">
                    परिणाम प्रतिशत में दिखाए गए हैं
                  </p>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    परिणाम वास्तविक समय में अपडेट होते हैं
                  </p>
                </div>
              </div>

              {/* Section 3: Share Section with Gradient */}
              <div className="bg-gradient-to-br from-orange-50 to-blue-50 py-6 md:py-8 px-4 md:px-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 hindi-text mb-2 md:mb-3 text-center">
                  परिणाम साझा करें
                </h3>
                <p className="text-xs md:text-sm text-gray-600 hindi-text text-center mb-4">
                  इन परिणामों को अपने मित्रों के साथ साझा करें
                </p>

                {/* Social Media Share - Compact Grid */}
                <div className="pt-2">
                  <p className="text-xs md:text-sm text-gray-600 mb-3 hindi-text text-center">सोशल मीडिया पर शेयर करें:</p>
                  <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-sm mx-auto">
                    {/* WhatsApp */}
                    <button
                      onClick={handleNativeShare}
                      className="w-12 h-12 md:w-14 md:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="WhatsApp पर शेयर करें"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>

                    {/* Twitter/X */}
                    <button
                      onClick={handleNativeShare}
                      className="w-12 h-12 md:w-14 md:h-14 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="X (Twitter) पर शेयर करें"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={handleNativeShare}
                      className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="Facebook पर शेयर करें"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    {/* Telegram */}
                    <button
                      onClick={handleNativeShare}
                      className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="Telegram पर शेयर करें"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={() => {
                        handleDownloadImage()
                        alert('इमेज डाउनलोड हो गई है! अब Instagram app खोलें और Story/Post में यह इमेज अपलोड करें।')
                      }}
                      className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="Instagram पर शेयर करें"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                    </button>
                  </div>
                  
                  {/* Android: Download Results Button */}
                  {!isIOS && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleDownloadImage}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold hindi-text transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
                        title="परिणाम डाउनलोड करें"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        परिणाम डाउनलोड करें
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
              )}
            </div>
          </div>
        )}

        {/* No results message when constituency selected but no votes */}
        {selectedConstituency && !error && results.length === 0 && !loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden py-8 md:py-12 px-4 md:px-6 text-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm md:text-base text-gray-600 hindi-text">इस विधानसभा के लिए अभी तक कोई मत नहीं डाला गया है।</p>
            </div>
          </div>
        )}

        {/* Hidden canvas for image generation */}
        {results.length > 0 && <canvas ref={canvasRef} style={{ display: 'none' }} />}

      </main>

      <Footer />
    </div>
  )
}
