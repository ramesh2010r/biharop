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

  // Share via Web Share API with image
  const handleNativeShare = async () => {
    if (!canvasRef.current || !voteData) return

    try {
      // First generate the image
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Load the background image
      const backgroundImg = new Image()
      backgroundImg.crossOrigin = 'anonymous'
      backgroundImg.src = '/images/vote-background.jpg'
      
      await new Promise((resolve, reject) => {
        backgroundImg.onload = resolve
        backgroundImg.onerror = reject
      })

      // Set canvas size and draw
      canvas.width = 1080
      canvas.height = 1080
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)

      // Add text overlay (same as download function)
      const isNota = voteData.candidate_name === 'NOTA' || voteData.candidate_name === 'उपरोक्त में से कोई नहीं'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (isNota) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 48px Arial, sans-serif'
        ctx.fillText('NOTA', canvas.width / 2, 300)
        ctx.font = '28px Arial, sans-serif'
        ctx.fillText('उपरोक्त में से कोई नहीं', canvas.width / 2, 355)
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 26px Arial, sans-serif'
        ctx.fillText(`${voteData.constituency_name}, ${voteData.district_name}`, canvas.width / 2, 410)
      } else {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 42px Arial, sans-serif'
        ctx.fillText(voteData.candidate_name, canvas.width / 2, 290)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '26px Arial, sans-serif'
        ctx.fillText(`(${voteData.party_name})`, canvas.width / 2, 345)
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 26px Arial, sans-serif'
        ctx.fillText(`${voteData.constituency_name}, ${voteData.district_name}`, canvas.width / 2, 410)
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)
      })

      // Create file from blob
      const file = new File([blob], `bihar-opinion-poll-${voteData.constituency_name}.jpg`, { type: 'image/jpeg' })

      // Check if Web Share API with files is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'बिहार चुनाव ओपिनियन पोल',
          text: shareText,
          files: [file],
        })
      } else {
        // Fallback: just share URL
        if (navigator.share) {
          await navigator.share({
            title: 'बिहार चुनाव ओपिनियन पोल',
            text: shareText,
            url: shareUrl,
          })
        } else {
          alert('आपका ब्राउज़र शेयरिंग का समर्थन नहीं करता। कृपया इमेज डाउनलोड करें और मैन्युअली शेयर करें।')
        }
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  // Generate and download share image using background
  const generateShareImage = async () => {
    if (!canvasRef.current || !voteData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load the background image
    const backgroundImg = new Image()
    backgroundImg.crossOrigin = 'anonymous'
    
    // Use the background image from public folder
    backgroundImg.src = '/images/vote-background.jpg'
    
    backgroundImg.onload = () => {
      // Set canvas size to 1080x1080
      canvas.width = 1080
      canvas.height = 1080

      // Draw the background image
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)

      // Now overlay the dynamic text on specific positions
      // Based on template measurements: 1080x1080px
      // Blue box: top=211.19px, height=329.01px (bottom ~540px)
      // Text line visible at ~282px from top
      
      const isNota = voteData.candidate_name === 'NOTA' || voteData.candidate_name === 'उपरोक्त में से कोई नहीं'
      
      // Set text properties
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      if (isNota) {
        // For NOTA - three lines centered in blue box
        // Blue box center is around Y=375 (211 + 329/2)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 48px Arial, sans-serif'
        ctx.fillText('NOTA', canvas.width / 2, 300)
        
        ctx.font = '28px Arial, sans-serif'
        ctx.fillText('उपरोक्त में से कोई नहीं', canvas.width / 2, 355)
        
        // Constituency in yellow - positioned lower
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 26px Arial, sans-serif'
        ctx.fillText(`${voteData.constituency_name}, ${voteData.district_name}`, canvas.width / 2, 410)
      } else {
        // For regular candidate - three lines in blue box
        // Line 1: Candidate name (white)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 42px Arial, sans-serif'
        ctx.fillText(voteData.candidate_name, canvas.width / 2, 290)
        
        // Line 2: Party name (white, smaller)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '26px Arial, sans-serif'
        ctx.fillText(`(${voteData.party_name})`, canvas.width / 2, 345)
        
        // Line 3: Constituency and District (yellow) - positioned lower
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 26px Arial, sans-serif'
        ctx.fillText(`${voteData.constituency_name}, ${voteData.district_name}`, canvas.width / 2, 410)
      }

      // Download the image as optimized JPG
      const link = document.createElement('a')
      link.download = `bihar-opinion-poll-${voteData.constituency_name}.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.85)
      link.click()
    }

    backgroundImg.onerror = () => {
      console.error('Failed to load background image')
      alert('बैकग्राउंड इमेज लोड नहीं हो सकी। कृपया पुनः प्रयास करें।')
    }
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
              {/* Share with Image Button (Native Share API) */}
              {voteData && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span className="hindi-text">इमेज के साथ शेयर करें</span>
                </button>
              )}

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

                {/* Instagram - Download first, then share */}
                <button
                  onClick={() => {
                    generateShareImage()
                    setTimeout(() => {
                      alert('इमेज डाउनलोड हो गई है! अब Instagram app खोलें और डाउनलोड की गई इमेज शेयर करें।')
                    }, 500)
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                  title="Instagram के लिए इमेज डाउनलोड करें"
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
