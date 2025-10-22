import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative Border */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '12px solid #d97706',
            borderRadius: '20px',
            display: 'flex',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            textAlign: 'center',
          }}
        >
          {/* Logo Badge */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              width: '140px',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              border: '8px solid white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                display: 'flex',
              }}
            >
              🗳️
            </div>
          </div>

          {/* Main Heading */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: '900',
              color: '#78350f',
              marginBottom: '30px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '-1px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex' }}>बिहार चुनाव ओपिनियन पोल</div>
            <div
              style={{
                fontSize: '56px',
                color: '#92400e',
                marginTop: '10px',
                display: 'flex',
              }}
            >
              Bihar Election Opinion Poll 2025
            </div>
          </div>

          {/* Success Message */}
          <div
            style={{
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              padding: '40px 60px',
              borderRadius: '20px',
              border: '4px solid #16a34a',
              marginBottom: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#15803d',
                marginBottom: '15px',
                display: 'flex',
              }}
            >
              ✅ मैंने अपना मत सफलतापूर्वक दर्ज कर दिया है
            </div>
            <div
              style={{
                fontSize: '44px',
                color: '#166534',
                fontStyle: 'italic',
                display: 'flex',
              }}
            >
              I have successfully cast my vote
            </div>
          </div>

          {/* Call to Action */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              padding: '35px 50px',
              borderRadius: '20px',
              border: '4px solid #f59e0b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                fontSize: '50px',
                fontWeight: 'bold',
                color: '#b45309',
                display: 'flex',
                marginBottom: '12px',
              }}
            >
              👇 आप भी नीचे दिए गए लिंक पर क्लिक करके दर्ज करें
            </div>
            <div
              style={{
                fontSize: '42px',
                color: '#92400e',
                fontWeight: '600',
                display: 'flex',
              }}
            >
              Click the link below to cast your vote
            </div>
          </div>

          {/* Website URL */}
          <div
            style={{
              marginTop: '40px',
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1e3a8a',
              background: 'white',
              padding: '20px 50px',
              borderRadius: '15px',
              border: '4px solid #3b82f6',
              display: 'flex',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }}
          >
            🔗 opinionpoll.co.in
          </div>
        </div>

        {/* Corner Decorations */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            width: '80px',
            height: '80px',
            background: '#f59e0b',
            opacity: 0.2,
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            width: '80px',
            height: '80px',
            background: '#f59e0b',
            opacity: 0.2,
            borderRadius: '50%',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
