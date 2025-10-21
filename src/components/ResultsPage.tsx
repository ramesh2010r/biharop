'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import DisclaimerBanner from './DisclaimerBanner'
import Footer from './Footer'
import { getApiUrl } from '@/config/api'

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
  party_name: string
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
  const [districts, setDistricts] = useState<District[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [results, setResults] = useState<ResultData[]>([])
  const [blackoutStatus, setBlackoutStatus] = useState<BlackoutStatus>({ isBlackout: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check blackout status on mount
  useEffect(() => {
    checkBlackoutStatus()
    fetchDistricts()
  }, [])

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
          setResults(data)
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
    if (!canvasRef.current || results.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 1080
    canvas.height = 1080

    // Load background image
    const background = new Image()
    background.crossOrigin = 'anonymous'
    background.src = '/images/vote-background.jpg'
    
    background.onload = async () => {
      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
      
      // Get constituency and district names
      const constituencyName = constituencies.find(c => c.id === selectedConstituency)?.name_hindi || ''
      const districtName = districts.find(d => d.id === selectedDistrict)?.name_hindi || ''
      
      // Get top result
      const topResult = results[0]
      
      // Configure text rendering
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw top candidate info - White text
      if (topResult) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 48px Arial, sans-serif'
        ctx.fillText(topResult.candidate_name || 'N/A', canvas.width / 2, 290)
        
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 40px Arial, sans-serif'
        ctx.fillText(topResult.party_name || topResult.party_abbreviation || '', canvas.width / 2, 345)
        
        // Percentage
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 52px Arial, sans-serif'
        ctx.fillText(`${topResult.percentage.toFixed(1)}%`, canvas.width / 2, 410)
      }
      
      // Draw location in yellow
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 36px Arial, sans-serif'
      ctx.fillText(`${constituencyName}`, canvas.width / 2, 920)
      
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.fillText(`${districtName}`, canvas.width / 2, 970)
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return
        
        try {
          const file = new File([blob], `bihar-poll-results-${constituencyName}.jpg`, { 
            type: 'image/jpeg' 
          })
          
          // Check if Web Share API with files is supported
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'बिहार चुनाव ओपिनियन पोल परिणाम',
              text: getShareText()
            })
          } else if (navigator.share) {
            // Fallback to sharing URL only
            await navigator.share({
              title: 'बिहार चुनाव ओपिनियन पोल परिणाम',
              text: getShareText(),
              url: shareUrl
            })
          } else {
            // Download as fallback
            const link = document.createElement('a')
            link.download = `bihar-poll-results-${constituencyName}.jpg`
            link.href = URL.createObjectURL(blob)
            link.click()
            URL.revokeObjectURL(link.href)
          }
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            console.error('Share failed:', err)
          }
        }
      }, 'image/jpeg', 0.85)
    }
    
    background.onerror = () => {
      console.error('Failed to load background image')
      alert('इमेज लोड करने में त्रुटि। कृपया पुनः प्रयास करें।')
    }
  }

  const generateResultImage = () => {
    if (!canvasRef.current || results.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match confirmation page (1080x1080)
    canvas.width = 1080
    canvas.height = 1080

    // Load background image
    const background = new Image()
    background.crossOrigin = 'anonymous'
    background.src = '/images/vote-background.jpg'
    
    background.onload = () => {
      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
      
      // Get constituency and district names
      const constituencyName = constituencies.find(c => c.id === selectedConstituency)?.name_hindi || ''
      const districtName = districts.find(d => d.id === selectedDistrict)?.name_hindi || ''
      
      // Get top 3 results
      const topResults = results.slice(0, 3)
      
      // Configure text rendering
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw top candidate (Position 1) - White text
      if (topResults[0]) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 48px Arial, sans-serif'
        ctx.fillText(topResults[0].candidate_name || 'N/A', canvas.width / 2, 290)
        
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 40px Arial, sans-serif'
        ctx.fillText(topResults[0].party_name || topResults[0].party_abbreviation || '', canvas.width / 2, 345)
        
        // Percentage in larger font
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 52px Arial, sans-serif'
        ctx.fillText(`${topResults[0].percentage.toFixed(1)}%`, canvas.width / 2, 410)
      }
      
      // Draw location in yellow at bottom
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 36px Arial, sans-serif'
      ctx.fillText(`${constituencyName}`, canvas.width / 2, 920)
      
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.fillText(`${districtName}`, canvas.width / 2, 970)
      
      // Convert canvas to blob and download as optimized JPG
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a')
          link.download = `bihar-poll-results-${constituencyName}.jpg`
          link.href = URL.createObjectURL(blob)
          link.click()
          URL.revokeObjectURL(link.href)
        }
      }, 'image/jpeg', 0.85)
    }
    
    background.onerror = () => {
      console.error('Failed to load background image')
      alert('इमेज लोड करने में त्रुटि। कृपया पुनः प्रयास करें।')
    }
  }

  // Blackout State UI
  if (blackoutStatus.isBlackout && !selectedConstituency) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <header className="bg-white shadow-md border-b-4 border-orange-500">
          {/* Top Tricolor Bar */}
          <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-1"></div>
          
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 hindi-text">
                  बिहार ओपिनियन पोल 2025
                </h1>
                <p className="text-sm text-gray-600 hindi-text">परिणाम पृष्ठ</p>
              </div>
            </Link>
          </div>
        </header>

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
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        {/* Top Tricolor Bar */}
        <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-1"></div>
        
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 hindi-text">
                बिहार ओपिनियन पोल 2025
              </h1>
              <p className="text-sm text-gray-600 hindi-text">परिणाम पृष्ठ</p>
            </div>
          </Link>
        </div>
      </header>

      <DisclaimerBanner />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 hindi-text mb-8 text-center">
          ओपिनियन पोल के परिणाम
        </h1>

        {/* Selection Area */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="card">
            <div className="grid md:grid-cols-2 gap-4">
              {/* District Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 hindi-text mb-2">
                  जिला चुनें
                </label>
                <select
                  value={selectedDistrict || ''}
                  onChange={(e) => handleDistrictSelect(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">-- जिला चुनें --</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name_hindi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Constituency Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 hindi-text mb-2">
                  विधानसभा चुनें
                </label>
                <select
                  value={selectedConstituency || ''}
                  onChange={(e) => handleConstituencySelect(Number(e.target.value))}
                  disabled={!selectedDistrict}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">-- विधानसभा चुनें --</option>
                  {constituencies.map((constituency) => (
                    <option key={constituency.id} value={constituency.id}>
                      {constituency.name_hindi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-4 bg-red-50 border-l-4 border-red-500 p-4">
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

        {/* Results Display */}
        {!loading && results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 hindi-text mb-6">
                मतदान परिणाम
              </h2>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 hindi-text">
                          {result.candidate_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.party_name} ({result.party_abbreviation})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary-600">
                          {result.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 hindi-text text-center">
                  परिणाम प्रतिशत में दिखाए गए हैं
                </p>
                <p className="text-xs text-gray-400 text-center mt-2">
                  परिणाम वास्तविक समय में अपडेट होते हैं
                </p>
              </div>
            </div>

            {/* Share Section */}
            <div className="card mt-6 bg-gradient-to-br from-orange-50 to-blue-50">
              <h3 className="text-lg font-semibold text-gray-800 hindi-text mb-3 text-center">
                परिणाम साझा करें
              </h3>
              <p className="text-sm text-gray-600 hindi-text text-center mb-4">
                इन परिणामों को अपने मित्रों के साथ साझा करें
              </p>

              {/* Share Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {/* Share with Image (Web Share API) */}
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span className="hindi-text">इमेज के साथ शेयर करें</span>
                </button>

                {/* Download Image */}
                <button
                  onClick={generateResultImage}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="hindi-text">इमेज डाउनलोड करें</span>
                </button>
              </div>

              {/* Social Media Share - All buttons use native share with image */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3 hindi-text text-center">सोशल मीडिया पर इमेज के साथ शेयर करें:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {/* WhatsApp - with image */}
                  <button
                    onClick={handleNativeShare}
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="WhatsApp पर इमेज शेयर करें"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>

                  {/* Twitter/X - with image */}
                  <button
                    onClick={handleNativeShare}
                    className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="X (Twitter) पर इमेज शेयर करें"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>

                  {/* Facebook - with image */}
                  <button
                    onClick={handleNativeShare}
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="Facebook पर इमेज शेयर करें"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  {/* Telegram - with image */}
                  <button
                    onClick={handleNativeShare}
                    className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="Telegram पर इमेज शेयर करें"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={() => {
                      generateResultImage()
                      alert('इमेज डाउनलोड हो गई है! अब Instagram app खोलें और Story/Post में यह इमेज अपलोड करें।')
                    }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    title="Instagram पर शेयर करें"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && results.length === 0 && selectedConstituency && (
          <div className="max-w-4xl mx-auto card text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-600 hindi-text">इस विधानसभा के लिए अभी तक कोई मत नहीं डाला गया है।</p>
          </div>
        )}

        {/* Prompt to Select */}
        {!selectedConstituency && !blackoutStatus.isBlackout && (
          <div className="max-w-4xl mx-auto card text-center py-12 bg-gradient-to-br from-blue-50 to-orange-50">
            <svg className="w-16 h-16 text-primary-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <p className="text-lg text-gray-700 hindi-text">परिणाम देखने के लिए कृपया जिला और विधानसभा का चयन करें</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
