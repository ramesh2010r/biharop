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
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-6 border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            बिहार विधानसभा चुनाव 2025 - विजेता पूर्वानुमान
          </h2>
          <p className="text-sm text-gray-600 mt-1">Based on current opinion poll trends</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 animate-pulse text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" />
            </svg>
            Live
          </div>
          <p className="text-xs text-gray-500 mt-1">Updated: {lastUpdated}</p>
        </div>
      </div>

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
        <div className="space-y-4 mb-6">
        {predictions.slice(0, 4).map((group, index) => (
          <div key={group.groupName} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{group.groupName}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold" style={{ color: group.groupColor }}>
                    {group.projectedSeats}
                  </span>
                  <span className="text-gray-500">/ {totalSeats}</span>
                </div>
                <p className="text-sm text-gray-600">{group.percentage.toFixed(1)}% votes</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
              {/* Majority Mark Line */}
              {index === 0 && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(majorityMark / totalSeats) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-600 font-semibold whitespace-nowrap">
                    Majority: {majorityMark}
                  </div>
                </div>
              )}

              {/* Projected Seats Bar */}
              <div
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(group.projectedSeats / totalSeats) * 100}%`,
                  background: `linear-gradient(90deg, ${group.groupColor}, ${group.groupColor}dd)`
                }}
              />

              {/* Leading In Badge */}
              {group.leadingIn > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                  Leading in {group.leadingIn} seats
                </div>
              )}
              
              {/* Majority Badge */}
              {group.projectedSeats >= majorityMark && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-sm drop-shadow-lg flex items-center gap-1">
                  <span className="text-xl">👑</span>
                  <span>Majority</span>
                </div>
              )}
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
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center hindi-text flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          यह एक ओपिनियन पोल आधारित पूर्वानुमान है, आधिकारिक परिणाम नहीं
        </p>
      </div>
    </div>
  )
}
