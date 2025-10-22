interface ResultData {
  candidate_name: string
  candidate_name_hindi?: string
  candidate_name_english?: string
  party_name: string
  party_abbreviation: string
  total_votes: number
  percentage: number
}

interface ImageGenerationParams {
  constituencyName: string
  districtName: string
  results: ResultData[]
  totalVotes: number
}

export function generateResultImage(params: ImageGenerationParams): Promise<string> {
  return new Promise((resolve) => {
    const { constituencyName, districtName, results, totalVotes } = params
    
    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve('')
      return
    }

    // Set canvas size (1200x1600 for good quality)
    canvas.width = 1200
    canvas.height = 1600

    // Colors from website
    const headerGradientStart = '#fed7aa' // orange-200
    const headerGradientEnd = '#fef3c7' // orange-100
    const primaryBlue = '#1e40af' // blue-800
    const textDark = '#1f2937' // gray-800
    const textLight = '#6b7280' // gray-500
    const white = '#ffffff'
    const cardBg = '#fffbf5'

    // Load logo
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.src = '/images/Logo_OP.webp'
    
    logo.onload = () => {
      // Background
      ctx.fillStyle = cardBg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Header gradient
      const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      headerGradient.addColorStop(0, headerGradientStart)
      headerGradient.addColorStop(0.5, headerGradientEnd)
      headerGradient.addColorStop(1, headerGradientStart)
      ctx.fillStyle = headerGradient
      ctx.fillRect(0, 0, canvas.width, 200)

      // Draw logo in header (centered) - using original aspect ratio
      const logoHeight = 150
      const logoAspectRatio = logo.width / logo.height
      const logoWidth = logoHeight * logoAspectRatio
      ctx.drawImage(logo, (canvas.width - logoWidth) / 2, 25, logoWidth, logoHeight)

      // Title section with blue background
      const titleBgGradient = ctx.createLinearGradient(0, 200, 0, 350)
      titleBgGradient.addColorStop(0, '#1e40af')
      titleBgGradient.addColorStop(1, '#1e3a8a')
      ctx.fillStyle = titleBgGradient
      ctx.fillRect(0, 200, canvas.width, 150)

      ctx.fillStyle = white
      ctx.font = 'bold 42px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('मतदान परिणाम', canvas.width / 2, 260)

      ctx.font = '36px Arial'
      ctx.fillText(`${constituencyName}, ${districtName}`, canvas.width / 2, 320)

      // Results section
      let yPosition = 420
      const leftMargin = 80
      const rightMargin = canvas.width - 80
      const barWidth = canvas.width - 160

      // Draw each candidate result
      results.forEach((result, index) => {
        if (index >= 5) return // Show top 5 candidates
        
        // Candidate info
        ctx.fillStyle = textDark
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'left'
        
        // Position number
        ctx.fillStyle = primaryBlue
        ctx.fillText(`${index + 1}.`, leftMargin, yPosition)
        
        // Candidate name (handle undefined)
        ctx.fillStyle = textDark
        const candidateName = result.candidate_name || result.candidate_name_hindi || result.candidate_name_english || 'नाम उपलब्ध नहीं'
        ctx.fillText(candidateName, leftMargin + 60, yPosition)
        
        // Party name (full name instead of abbreviation)
        ctx.font = '28px Arial'
        ctx.fillStyle = textLight
        const partyName = result.party_name || result.party_abbreviation || 'N/A'
        ctx.fillText(`(${partyName})`, leftMargin + 60, yPosition + 35)
        
        // Percentage only (no vote count)
        ctx.font = 'bold 38px Arial'
        ctx.fillStyle = primaryBlue
        ctx.textAlign = 'right'
        ctx.fillText(`${result.percentage.toFixed(1)}%`, rightMargin, yPosition + 18)
        
        // Progress bar
        yPosition += 60
        const barY = yPosition
        const barHeight = 30
        
        // Background bar
        ctx.fillStyle = '#e5e7eb'
        ctx.beginPath()
        ctx.roundRect(leftMargin, barY, barWidth, barHeight, 15)
        ctx.fill()
        
        // Progress bar with gradient
        const progressWidth = (result.percentage / 100) * barWidth
        const barGradient = ctx.createLinearGradient(leftMargin, barY, leftMargin + progressWidth, barY)
        
        // Different colors for top 3
        if (index === 0) {
          barGradient.addColorStop(0, '#059669') // green-600
          barGradient.addColorStop(1, '#10b981') // green-500
        } else if (index === 1) {
          barGradient.addColorStop(0, '#2563eb') // blue-600
          barGradient.addColorStop(1, '#3b82f6') // blue-500
        } else if (index === 2) {
          barGradient.addColorStop(0, '#ea580c') // orange-600
          barGradient.addColorStop(1, '#f97316') // orange-500
        } else {
          barGradient.addColorStop(0, '#6b7280') // gray-500
          barGradient.addColorStop(1, '#9ca3af') // gray-400
        }
        
        ctx.fillStyle = barGradient
        ctx.beginPath()
        ctx.roundRect(leftMargin, barY, progressWidth, barHeight, 15)
        ctx.fill()
        
        yPosition += 70
      })

      // Watermark logo in center (moved UP)
      yPosition = (canvas.height / 2) - 50  // Center of canvas
      const watermarkHeight = 360  // 3x bigger (120 * 3)
      const watermarkAspectRatio = logo.width / logo.height
      const watermarkWidth = watermarkHeight * watermarkAspectRatio
      ctx.globalAlpha = 0.12 // Semi-transparent
      ctx.drawImage(logo, (canvas.width - watermarkWidth) / 2, yPosition, watermarkWidth, watermarkHeight)
      ctx.globalAlpha = 1.0 // Reset opacity

      // Website URL (no icon, centered)
      yPosition = canvas.height - 120
      ctx.font = 'bold 32px Arial'
      ctx.fillStyle = textDark
      ctx.textAlign = 'center'
      ctx.fillText('opinionpoll.co.in', canvas.width / 2, yPosition)

      // Disclaimer (Hindi only)
      yPosition = canvas.height - 70
      ctx.fillStyle = textLight
      ctx.font = '26px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('यह एक ओपिनियन पोल है, आधिकारिक परिणाम नहीं', canvas.width / 2, yPosition)
      
      // Copyright at bottom
      yPosition = canvas.height - 30
      ctx.font = '20px Arial'
      ctx.fillStyle = textLight
      ctx.textAlign = 'center'
      ctx.fillText('© 2025 Bihar Opinion Poll. All rights reserved.', canvas.width / 2, yPosition)

      // Convert to data URL (JPEG format with 95% quality)
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    
    logo.onerror = () => {
      console.error('Failed to load logo')
      // Still generate image without logo (JPEG format)
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
  })
}
