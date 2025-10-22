'use client'

import { useEffect, useState } from 'react'
import { getApiUrl } from '@/config/api'

interface PartyGroupData {
  groupName: string
  groupColor: string
  totalSeats: number
  projectedSeats: number
  percentage: number
  leadingIn: number
  parties: string[]
}

export default function PredictionGraph() {
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<PartyGroupData[]>([])
  const [totalSeats] = useState(243)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetchPredictions()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPredictions, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(getApiUrl('/api/predictions/predictions'))
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions || [])
        setLastUpdated(new Date().toLocaleString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'short'
        }))
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch predictions:', error)
      setLoading(false)
    }
  }

  const majorityMark = Math.ceil(totalSeats / 2)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white hindi-text leading-tight drop-shadow-sm">
              बिहार विधानसभा चुनाव 2025 - विजेता पूर्वानुमान
            </h2>
            <p className="text-orange-100 text-sm mt-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated: {lastUpdated}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm font-semibold text-white">Live</span>
          </div>
        </div>
      </div>

      <div className="p-6">
      {/* No Data Message */}
      {predictions.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">अभी कोई डेटा उपलब्ध नहीं है</h3>
          <p className="text-gray-500 mb-1">No prediction data available yet</p>
          <p className="text-sm text-gray-400">मतदान शुरू होने के बाद पूर्वानुमान यहां प्रदर्शित होंगे</p>
          <p className="text-xs text-gray-400 mt-2">Predictions will appear here once voting begins</p>
        </div>
      )}

      {/* Predictions Graph */}
      {predictions.length > 0 && (
        <div className="grid gap-4 mb-6">
        {predictions.slice(0, 4).map((group, index) => (
          <div 
            key={group.groupName} 
            className="group bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
          >
            {/* Card Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                    index === 0 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    index === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                    'bg-gradient-to-br from-gray-500 to-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{group.groupName}</h3>
                    {group.projectedSeats >= majorityMark && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-lg">👑</span>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Majority</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl md:text-6xl font-black tracking-tight" style={{ color: group.groupColor }}>
                      {group.projectedSeats}
                    </span>
                    <span className="text-xl text-gray-400 font-medium">/ {totalSeats}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body - Progress Bar */}
            <div className="px-5 py-4">
              <div className="relative h-16 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                {/* Majority Mark Line - Only show on first item */}
                {index === 0 && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                    style={{ left: `${(majorityMark / totalSeats) * 100}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap shadow-sm">
                      Majority: {majorityMark}
                    </div>
                  </div>
                )}

                {/* Animated Progress Bar */}
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-xl"
                  style={{
                    width: `${(group.projectedSeats / totalSeats) * 100}%`,
                    background: `linear-gradient(135deg, ${group.groupColor} 0%, ${group.groupColor}cc 100%)`,
                    boxShadow: `0 0 20px ${group.groupColor}40`
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>

                {/* Leading Badge */}
                {group.leadingIn > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border-2" style={{ borderColor: group.groupColor }}>
                      <span className="font-bold text-sm" style={{ color: group.groupColor }}>
                        Leading in {group.leadingIn} seats
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Winner Prediction Card */}
      {predictions.length > 0 && predictions[0].projectedSeats >= majorityMark && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Predicted Winner</h3>
              <p className="text-green-700">
                <span className="font-bold">{predictions[0].groupName}</span> is projected to win with{' '}
                <span className="font-bold">{predictions[0].projectedSeats} seats</span> (
                {((predictions[0].projectedSeats / totalSeats) * 100).toFixed(1)}% of total seats)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border-t border-amber-100 px-6 py-4 mt-6">
        <p className="text-sm text-gray-700 text-center hindi-text flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          यह एक ओपिनियन पोल आधारित पूर्वानुमान है, आधिकारिक परिणाम नहीं
        </p>
      </div>
      </div>
    </div>
  )
}
