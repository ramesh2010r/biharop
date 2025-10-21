'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Footer from './Footer'

interface VoteData {
  candidate_name: string
  candidate_name_english: string
  party_abbreviation: string
  party_name: string
  party_symbol: string
  constituency_name: string
  district_name: string
  voted_at: string
}

export default function ConfirmationPage() {
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Retrieve vote data from localStorage
    const storedVote = localStorage.getItem('lastVote')
    if (storedVote) {
      try {
        setVoteData(JSON.parse(storedVote))
      } catch (err) {
        console.error('Error parsing vote data:', err)
      }
    }
  }, [])

  // Polyfill for roundRect if not available
  useEffect(() => {
    if (typeof CanvasRenderingContext2D !== 'undefined') {
      if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, width: number, height: number, radius: number) {
          this.beginPath()
          this.moveTo(x + radius, y)
          this.lineTo(x + width - radius, y)
          this.quadraticCurveTo(x + width, y, x + width, y + radius)
          this.lineTo(x + width, y + height - radius)
          this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
          this.lineTo(x + radius, y + height)
          this.quadraticCurveTo(x, y + height, x, y + height - radius)
          this.lineTo(x, y + radius)
          this.quadraticCurveTo(x, y, x + radius, y)
          this.closePath()
          return this
        }
      }
    }
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://opinionpoll.bihar.gov.in'
  const shareText = 'मैंने बिहार चुनाव ओपिनियन पोल में अपनी राय दर्ज की है! आप भी भाग लें। I voted in Bihar Election Opinion Poll!'

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Share via Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'बिहार चुनाव ओपिनियन पोल',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  // Generate and download share image (matching your design)
  const generateShareImage = async () => {
    if (!canvasRef.current || !voteData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size (Instagram square format)
    canvas.width = 1080
    canvas.height = 1080

    // Create tricolor gradient background
    const topGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height / 3)
    topGradient.addColorStop(0, '#FF9933')
    topGradient.addColorStop(0.5, '#FFB366')
    topGradient.addColorStop(1, '#FFC999')
    
    const middleGradient = ctx.createLinearGradient(0, canvas.height / 3, canvas.width, 2 * canvas.height / 3)
    middleGradient.addColorStop(0, '#FFFFFF')
    middleGradient.addColorStop(1, '#F0F0F0')
    
    const bottomGradient = ctx.createLinearGradient(0, 2 * canvas.height / 3, canvas.width, canvas.height)
    bottomGradient.addColorStop(0, '#99CC99')
    bottomGradient.addColorStop(0.5, '#66BB66')
    bottomGradient.addColorStop(1, '#138808')

    // Fill background sections
    ctx.fillStyle = topGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height / 3)
    
    ctx.fillStyle = middleGradient
    ctx.fillRect(0, canvas.height / 3, canvas.width, canvas.height / 3)
    
    ctx.fillStyle = bottomGradient
    ctx.fillRect(0, 2 * canvas.height / 3, canvas.width, canvas.height / 3)

    // Add semi-transparent white overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header text - "मैंने अपनी राय दर्ज की !"
    ctx.fillStyle = '#2D3E9E' // Navy blue
    ctx.font = 'bold 72px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('मैंने अपनी राय दर्ज की !', canvas.width / 2, 120)

    // Blue box for candidate info
    const boxY = 180
    const boxHeight = 180
    const boxPadding = 80
    
    ctx.fillStyle = '#2D3E9E'
    ctx.roundRect(boxPadding, boxY, canvas.width - 2 * boxPadding, boxHeight, 15)
    ctx.fill()

    // Candidate name in white (or "NOTA" with special styling)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 56px Arial, sans-serif'
    ctx.textAlign = 'center'
    
    const isNota = voteData.candidate_name === 'NOTA' || voteData.candidate_name === 'उपरोक्त में से कोई नहीं'
    
    if (isNota) {
      ctx.fillText('NOTA', canvas.width / 2, boxY + 75)
      ctx.font = '36px Arial, sans-serif'
      ctx.fillText('उपरोक्त में से कोई नहीं', canvas.width / 2, boxY + 125)
    } else {
      ctx.fillText(voteData.candidate_name, canvas.width / 2, boxY + 75)
      
      // Party name
      ctx.font = '32px Arial, sans-serif'
      ctx.fillText(`(${voteData.party_name})`, canvas.width / 2, boxY + 125)
    }

    // Constituency and District in yellow
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 36px Arial, sans-serif'
    ctx.fillText(`${voteData.constituency_name}, ${voteData.district_name}`, canvas.width / 2, boxY + 165)

    // Logo section - "बिहार ओपिनियन पोल 2025" with hand image
    const logoY = 450
    
    // Red text "बिहार"
    ctx.fillStyle = '#DC2626'
    ctx.font = 'bold 52px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('बिहार', canvas.width / 2 - 20, logoY)
    
    // Main title "ओपिनियन पोल"
    ctx.fillStyle = '#DC2626'
    ctx.font = 'bold 88px Arial, sans-serif'
    ctx.fillText('ओपिनियन पोल', canvas.width / 2, logoY + 85)
    
    // Year "2025" in blue box
    ctx.fillStyle = '#2D3E9E'
    ctx.fillRect(canvas.width / 2 + 180, logoY + 20, 140, 65)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Arial, sans-serif'
    ctx.fillText('2025', canvas.width / 2 + 250, logoY + 65)

    // Voting instruction with red bar
    const instructionY = logoY + 180
    ctx.fillStyle = '#DC2626'
    ctx.fillRect(80, instructionY - 10, 10, 80)
    
    ctx.fillStyle = '#1F2937'
    ctx.font = '28px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('अधिक जानकारी एवं वोट के लिए', 100, instructionY + 15)
    ctx.fillText('नीचे दिए गए वेबसाइट की खोलें।', 100, instructionY + 50)
    
    ctx.fillStyle = '#DC2626'
    ctx.font = 'bold 32px Arial, sans-serif'
    ctx.fillText('https://opinionpoll.co.in/', 100, instructionY + 95)

    // Add voting hand emoji/icon representation
    ctx.font = 'bold 120px Arial, sans-serif'
    ctx.fillText('☝️', canvas.width / 2, logoY + 250)

    // Bottom blue bar with call to action
    ctx.fillStyle = '#2D3E9E'
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 32px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('आप भी अपनी राय देने के लिए नीचे दिए गए लिंक पे क्लिक करें', canvas.width / 2, canvas.height - 45)

    // Download the image
    const link = document.createElement('a')
    link.download = `bihar-opinion-poll-${voteData.constituency_name}.png`
    link.href = canvas.toDataURL('image/png', 0.95)
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header - Clean & Simple */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        {/* Top Tricolor Bar */}
        <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-1"></div>
        
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 hindi-text">
                बिहार ओपिनियन पोल 2025
              </h1>
              <p className="text-sm text-gray-600 hindi-text">मतदान पुष्टि</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 hindi-text mb-2">धन्यवाद!</h1>
            <p className="text-xl text-green-600 hindi-text">आपका मत सफलतापूर्वक दर्ज कर लिया गया है।</p>
            <p className="text-gray-600 mt-2">Your opinion has been successfully registered.</p>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-6">
            <Link href="/results" className="btn-primary text-lg px-8 py-3 inline-block">
              ओपिनियन पोल के परिणाम देखें
            </Link>
          </div>

          {/* Share Section */}
          <div className="card text-center bg-gradient-to-br from-orange-50 to-blue-50">
            <h3 className="text-lg font-semibold text-gray-800 hindi-text mb-2">
              अपने मित्रों के साथ साझा करें
            </h3>
            <p className="text-gray-600 text-sm mb-4 hindi-text">
              अधिक लोगों को ओपिनियन पोल में भाग लेने के लिए प्रोत्साहित करें
            </p>
            
            {/* Share Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hindi-text">कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span className="hindi-text">लिंक कॉपी करें</span>
                  </>
                )}
              </button>

              {/* Download Image Button */}
              {voteData && (
                <button
                  onClick={generateShareImage}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="hindi-text">इमेज डाउनलोड करें</span>
                </button>
              )}
            </div>

            {/* Social Media Quick Share */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 hindi-text">सोशल मीडिया पर शेयर करें:</p>
              <div className="flex justify-center gap-3">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                  title="WhatsApp पर शेयर करें"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                  title="X (Twitter) पर शेयर करें"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                  title="Facebook पर शेयर करें"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                  title="Telegram पर शेयर करें"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Hidden canvas for image generation */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Vote Details Card (if available) */}
          {voteData && (
            <div className="card mt-6 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="text-lg font-semibold text-gray-800 hindi-text mb-3">
                आपका मत विवरण
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 hindi-text">उम्मीदवार:</span>
                  <span className="font-semibold text-gray-800 hindi-text">{voteData.candidate_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 hindi-text">पार्टी:</span>
                  <span className="font-semibold text-gray-800 hindi-text">{voteData.party_abbreviation}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 hindi-text">विधानसभा:</span>
                  <span className="font-semibold text-gray-800 hindi-text text-sm">{voteData.constituency_name}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 hindi-text">जिला:</span>
                  <span className="font-semibold text-gray-800 hindi-text">{voteData.district_name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/" className="text-primary-600 hover:text-primary-700 hindi-text">
              होम पेज पर वापस जाएं
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
