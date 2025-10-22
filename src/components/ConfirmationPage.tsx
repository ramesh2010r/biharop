'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from './Header'
import Footer from './Footer'
import { getApiUrl } from '@/config/api'

interface VoteData {
  candidate_name: string
  candidate_name_english: string
  party_abbreviation: string
  party_name: string
  party_symbol: string
  constituency_name: string
  constituency_id: number
  district_name: string
  district_id: number
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
        const parsedData = JSON.parse(storedVote)
        console.log('Loaded vote data from localStorage:', parsedData)
        
        // Check if the data has the required IDs (backward compatibility)
        if (!parsedData.district_id || !parsedData.constituency_id) {
          console.warn('Vote data missing district_id or constituency_id. User needs to vote again.')
        }
        
        setVoteData(parsedData)
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
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size for certificate design (landscape orientation)
      canvas.width = 1600
      canvas.height = 1200
      
      // Certificate background - cream/parchment color
      ctx.fillStyle = '#fffef7'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Decorative border
      ctx.strokeStyle = '#d97706' // orange-600
      ctx.lineWidth = 8
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
      
      // Inner border
      ctx.strokeStyle = '#fbbf24' // yellow-400
      ctx.lineWidth = 3
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120)

      // Decorative corners
      const drawCornerDecoration = (x: number, y: number, rotation: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.fillStyle = '#f59e0b' // orange-500
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(60, 0)
        ctx.lineTo(0, 60)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      
      drawCornerDecoration(100, 100, 0)
      drawCornerDecoration(canvas.width - 100, 100, Math.PI / 2)
      drawCornerDecoration(canvas.width - 100, canvas.height - 100, Math.PI)
      drawCornerDecoration(100, canvas.height - 100, -Math.PI / 2)

      // Load and draw logo at top center
      const logo = new Image()
      logo.crossOrigin = 'anonymous'
      logo.src = '/images/Logo_OP.webp'
      
      await new Promise((resolve, reject) => {
        logo.onload = resolve
        logo.onerror = () => {
          console.error('Failed to load logo')
          resolve(null)
        }
      })

      // Draw logo (maintaining aspect ratio 636x269)
      const logoWidth = 400
      const logoHeight = 400 * (269 / 636)
      ctx.drawImage(logo, (canvas.width - logoWidth) / 2, 120, logoWidth, logoHeight)

      // Certificate title
      let currentY = 120 + logoHeight + 60
      ctx.fillStyle = '#1e40af' // blue-700
      ctx.font = 'bold 56px serif'
      ctx.textAlign = 'center'
      ctx.fillText('मतदान प्रमाणपत्र', canvas.width / 2, currentY)
      ctx.font = '32px serif'
      ctx.fillText('Voting Certificate', canvas.width / 2, currentY + 45)

      // Decorative line
      currentY += 90
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(400, currentY)
      ctx.lineTo(canvas.width - 400, currentY)
      ctx.stroke()

      // Certificate text
      currentY += 60
      ctx.fillStyle = '#374151' // gray-700
      ctx.font = '32px serif'
      ctx.fillText('यह प्रमाणित किया जाता है कि', canvas.width / 2, currentY)

    // Voter details
    currentY += 90
    const isNota = voteData.candidate_name.includes('NOTA') || voteData.candidate_name.includes('उपरोक्त में से कोई नहीं')
    
    if (isNota) {
      ctx.fillStyle = '#dc2626' // red-600
      ctx.font = 'bold 68px serif'
      ctx.fillText('NOTA', canvas.width / 2, currentY)
      currentY += 65
      ctx.fillStyle = '#4b5563' // gray-600
      ctx.font = 'italic 38px serif'
      ctx.fillText('(उपरोक्त में से कोई नहीं)', canvas.width / 2, currentY)
    } else {
      ctx.fillStyle = '#1f2937' // gray-800
      ctx.font = 'bold 68px serif'
      ctx.fillText(voteData.candidate_name, canvas.width / 2, currentY)
      currentY += 65
      ctx.fillStyle = '#4b5563' // gray-600
      ctx.font = 'italic 40px serif'
      ctx.fillText(`(${voteData.party_name})`, canvas.width / 2, currentY)
    }

    // Location details
    currentY += 80
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 38px serif'
    ctx.fillText('को ओपिनियन पोल में अपनी राय दी', canvas.width / 2, currentY)

    // Constituency box
    currentY += 80
    ctx.fillStyle = '#fef3c7' // orange-50
    ctx.fillRect(250, currentY - 50, canvas.width - 500, 120)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.strokeRect(250, currentY - 50, canvas.width - 500, 120)
    
    ctx.fillStyle = '#1e40af' // blue-700
    ctx.font = 'bold 48px serif'
    ctx.fillText(voteData.constituency_name, canvas.width / 2, currentY)
    ctx.font = 'bold 42px serif'
    ctx.fillText(voteData.district_name, canvas.width / 2, currentY + 55)

    // Disclaimer - small text
    currentY += 105
    ctx.fillStyle = '#9ca3af' // gray-400
    ctx.font = '22px serif'
    ctx.fillText('यह वास्तविक मतदान नहीं है | यह केवल एक ओपिनियन पोल है', canvas.width / 2, currentY)

    // Call to action
    currentY += 55
    ctx.fillStyle = '#059669' // green-600
    ctx.font = 'bold 38px serif'
    ctx.fillText('🗳️ आप भी अपनी राय दें!', canvas.width / 2, currentY)      // Footer section
      currentY += 60
      ctx.fillStyle = '#6b7280' // gray-500
      ctx.font = '22px serif'
      ctx.fillText('बिहार विधानसभा चुनाव 2025 - ओपिनियन पोल', canvas.width / 2, currentY)

      // Website URL at bottom
      currentY += 50
      ctx.fillStyle = '#1e3a8a' // blue-900
      ctx.font = 'bold 32px serif'
      ctx.fillText('www.opinionpoll.co.in', canvas.width / 2, currentY)

      // Seal/stamp effect
      ctx.save()
      ctx.globalAlpha = 0.1
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(canvas.width - 250, canvas.height - 200, 100, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Convert canvas to blob (JPG format)
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92)
      })

      // Create file from blob
      const fileName = `bihar-voting-certificate-${Date.now()}.jpg`
      const file = new File([blob], fileName, { type: 'image/jpeg' })

      const shareText = `मैंने बिहार चुनाव ओपिनियन पोल में अपना मत ${voteData.constituency_name}, ${voteData.district_name} से दिया। आप भी अपनी राय दें!`
      const shareUrl = 'https://opinionpoll.co.in'
      const fullText = `${shareText}\n\n${shareUrl}`

      // Check if Web Share API with files is supported
      if (navigator.share) {
        try {
          // Try sharing with both text and files
          if (navigator.canShare && navigator.canShare({ files: [file], text: fullText })) {
            await navigator.share({
              text: fullText,
              files: [file],
            })
          } else if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Android fallback: some apps will show text from title
            await navigator.share({
              title: 'बिहार चुनाव ओपिनियन पोल',
              text: fullText,
              files: [file],
            })
          } else {
            // Just share text without image
            await navigator.share({
              title: 'बिहार चुनाव ओपिनियन पोल - मतदान प्रमाणपत्र',
              text: fullText,
              url: shareUrl,
            })
          }
        } catch (shareErr) {
          console.error('Share error:', shareErr)
          // If share fails, offer download
          const link = document.createElement('a')
          link.download = fileName
          link.href = URL.createObjectURL(blob)
          link.click()
          URL.revokeObjectURL(link.href)
          alert('इमेज डाउनलोड हो गई है! अब आप इसे मैन्युअली शेयर कर सकते हैं।')
        }
      } else {
        alert('आपका ब्राउज़र शेयरिंग का समर्थन नहीं करता। कृपया इमेज डाउनलोड करें और मैन्युअली शेयर करें।')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      alert('शेयर करने में त्रुटि हुई। कृपया पुनः प्रयास करें।')
    }
  }

  // Generate and download share image with certificate design
  const generateShareImage = async () => {
    if (!canvasRef.current || !voteData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for certificate design (landscape orientation)
    canvas.width = 1600
    canvas.height = 1200
    
    // Certificate background - cream/parchment color
    ctx.fillStyle = '#fffef7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Decorative border
    ctx.strokeStyle = '#d97706' // orange-600
    ctx.lineWidth = 8
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
    
    // Inner border
    ctx.strokeStyle = '#fbbf24' // yellow-400
    ctx.lineWidth = 3
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120)

    // Decorative corners
    const drawCornerDecoration = (x: number, y: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillStyle = '#f59e0b' // orange-500
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(60, 0)
      ctx.lineTo(0, 60)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    
    drawCornerDecoration(100, 100, 0)
    drawCornerDecoration(canvas.width - 100, 100, Math.PI / 2)
    drawCornerDecoration(canvas.width - 100, canvas.height - 100, Math.PI)
    drawCornerDecoration(100, canvas.height - 100, -Math.PI / 2)

    // Load and draw logo at top center
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.src = '/images/Logo_OP.webp'
    
    await new Promise((resolve) => {
      logo.onload = resolve
      logo.onerror = () => {
        console.error('Failed to load logo')
        resolve(null)
      }
    })

    // Draw logo (maintaining aspect ratio 636x269)
    const logoWidth = 400
    const logoHeight = 400 * (269 / 636)
    ctx.drawImage(logo, (canvas.width - logoWidth) / 2, 120, logoWidth, logoHeight)

    // Certificate title
    let currentY = 120 + logoHeight + 50
    ctx.fillStyle = '#1e40af' // blue-700
    ctx.font = 'bold 72px serif'
    ctx.textAlign = 'center'
    ctx.fillText('ओपिनियन पोल प्रमाणपत्र', canvas.width / 2, currentY)

    // Decorative line
    currentY += 80
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(350, currentY)
    ctx.lineTo(canvas.width - 350, currentY)
    ctx.stroke()

    // Certificate text
    currentY += 70
    ctx.fillStyle = '#374151' // gray-700
    ctx.font = 'bold 42px serif'
    ctx.fillText('यह प्रमाणित किया जाता है कि', canvas.width / 2, currentY)

    // Voter details
    currentY += 90
    const isNota = voteData.candidate_name.includes('NOTA') || voteData.candidate_name.includes('उपरोक्त में से कोई नहीं')
    
    if (isNota) {
      ctx.fillStyle = '#dc2626' // red-600
      ctx.font = 'bold 52px serif'
      ctx.fillText('NOTA', canvas.width / 2, currentY)
      currentY += 55
      ctx.fillStyle = '#4b5563' // gray-600
      ctx.font = 'italic 30px serif'
      ctx.fillText('(उपरोक्त में से कोई नहीं)', canvas.width / 2, currentY)
    } else {
      ctx.fillStyle = '#1f2937' // gray-800
      ctx.font = 'bold 52px serif'
      ctx.fillText(voteData.candidate_name, canvas.width / 2, currentY)
      currentY += 55
      ctx.fillStyle = '#4b5563' // gray-600
      ctx.font = 'italic 32px serif'
      ctx.fillText(`(${voteData.party_name})`, canvas.width / 2, currentY)
    }

    // Location details
    currentY += 70
    ctx.fillStyle = '#374151'
    ctx.font = '30px serif'
    ctx.fillText('को बिहार विधानसभा चुनाव ओपिनियन पोल में मत दिया', canvas.width / 2, currentY)

    // Constituency box
    currentY += 70
    ctx.fillStyle = '#fef3c7' // orange-50
    ctx.fillRect(300, currentY - 40, canvas.width - 600, 100)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.strokeRect(300, currentY - 40, canvas.width - 600, 100)
    
    ctx.fillStyle = '#1e40af' // blue-700
    ctx.font = 'bold 38px serif'
    ctx.fillText(voteData.constituency_name, canvas.width / 2, currentY)
    ctx.font = 'bold 32px serif'
    ctx.fillText(voteData.district_name, canvas.width / 2, currentY + 45)

    // Disclaimer - small text
    currentY += 100
    ctx.fillStyle = '#9ca3af' // gray-400
    ctx.font = '22px serif'
    ctx.fillText('यह वास्तविक मतदान नहीं है | यह केवल एक ओपिनियन पोल है', canvas.width / 2, currentY)

    // Call to action
    currentY += 50
    ctx.fillStyle = '#059669' // green-600
    ctx.font = 'bold 32px serif'
    ctx.fillText('🗳️ आप भी अपना मत दें और अपनी राय साझा करें!', canvas.width / 2, currentY)

    // Footer section
    currentY += 60
    ctx.fillStyle = '#6b7280' // gray-500
    ctx.font = '22px serif'
    ctx.fillText('बिहार विधानसभा चुनाव 2025 - ओपिनियन पोल', canvas.width / 2, currentY)

    // Website URL at bottom
    currentY += 50
    ctx.fillStyle = '#1e3a8a' // blue-900
    ctx.font = 'bold 32px serif'
    ctx.fillText('www.opinionpoll.co.in', canvas.width / 2, currentY)

    // Seal/stamp effect
    ctx.save()
    ctx.globalAlpha = 0.1
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(canvas.width - 250, canvas.height - 200, 100, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Download the image (JPG format)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `bihar-voting-certificate-${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Single Unified Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-10 px-6 text-center border-b-2 border-green-200">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 hindi-text mb-3">धन्यवाद!</h1>
              <p className="text-2xl md:text-3xl text-green-600 hindi-text font-semibold">
                आपका मत सफलतापूर्वक दर्ज कर लिया गया है।
              </p>
            </div>

            {/* Share Section */}
            <div className="py-8 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
              <h2 className="text-2xl font-bold text-gray-800 hindi-text text-center mb-2">
                अपने मित्रों के साथ साझा करें
              </h2>
              <p className="text-gray-600 hindi-text text-center mb-6">
                अधिक लोगों को ओपिनियन पोल में भाग लेने के लिए प्रोत्साहित करें
              </p>

              {/* Divider with Text */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-sm font-medium text-gray-500 bg-gradient-to-br from-orange-50 to-amber-50 hindi-text">सोशल मीडिया पर शेयर करें</span>
                </div>
              </div>

              {/* Social Media Icons - Compact */}
              <div className="flex justify-center gap-3">
                {/* WhatsApp */}
                <button
                  onClick={handleNativeShare}
                  className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="WhatsApp पर शेयर करें"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={handleNativeShare}
                  className="w-14 h-14 bg-black hover:bg-gray-800 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="X (Twitter) पर शेयर करें"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleNativeShare}
                  className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="Facebook पर शेयर करें"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                {/* Telegram */}
                <button
                  onClick={handleNativeShare}
                  className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="Telegram पर शेयर करें"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => {
                    generateShareImage()
                    setTimeout(() => {
                      alert('इमेज डाउनलोड हो गई है! अब Instagram app खोलें और डाउनलोड की गई इमेज शेयर करें।')
                    }, 500)
                  }}
                  className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="Instagram के लिए इमेज डाउनलोड करें"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Vote Details Section (if available) */}
            {voteData && (
              <div className="border-t-2 border-gray-100 py-8 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-xl font-bold text-gray-800 hindi-text text-center mb-6">
                  आपका मत विवरण
                </h3>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 hindi-text font-medium">उम्मीदवार:</span>
                    <span className="font-bold text-gray-800 hindi-text text-lg">{voteData.candidate_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 hindi-text font-medium">पार्टी:</span>
                    <span className="font-bold text-gray-800 hindi-text">{voteData.party_abbreviation}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 hindi-text font-medium">विधानसभा:</span>
                    <span className="font-bold text-gray-800 hindi-text">{voteData.constituency_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 hindi-text font-medium">जिला:</span>
                    <span className="font-bold text-gray-800 hindi-text">{voteData.district_name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* View Results Button */}
            <div className="text-center py-6 px-6 border-t-2 border-gray-100">
              <Link 
                href={voteData && voteData.district_id && voteData.constituency_id ? `/results?district=${voteData.district_id}&constituency=${voteData.constituency_id}` : '/results'}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base md:text-lg font-bold px-6 md:px-12 py-4 md:py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all whitespace-nowrap mb-4"
              >
                <span className="hindi-text">परिणाम देखें</span>
              </Link>
            </div>

            {/* Back to Home */}
            <div className="text-center py-6 px-6 border-t-2 border-gray-100">
              <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hindi-text transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                होम पेज पर वापस जाएं
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <Footer />
    </div>
  )
}
