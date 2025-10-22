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
      const response = await fetch(getApiUrl('/api/results/predictions'))
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

      {/* Predictions Graph */}
      <div className="space-y-4 mb-6">
        {predictions.slice(0, 4).map((group, index) => (
          <div key={group.groupName} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{group.groupName}</h3>
                  <p className="text-xs text-gray-500">
                    {group.parties.slice(0, 3).join(', ')}
                    {group.parties.length > 3 && ` +${group.parties.length - 3} more`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold" style={{ color: group.groupColor }}>
                    {group.projectedSeats}
                  </span>
                  <span className="text-sm text-gray-500">/ {totalSeats}</span>
                </div>
                <p className="text-xs text-gray-500">{group.percentage.toFixed(1)}% votes</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
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
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out flex items-center justify-end px-3"
                style={{
                  width: `${(group.projectedSeats / totalSeats) * 100}%`,
                  background: `linear-gradient(90deg, ${group.groupColor}, ${group.groupColor}dd)`
                }}
              >
                <span className="text-white font-bold text-sm drop-shadow">
                  {group.projectedSeats >= majorityMark && '👑 Majority'}
                </span>
              </div>

              {/* Leading In Badge */}
              {group.leadingIn > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                  Leading in {group.leadingIn} seats
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

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
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ⚠️ यह एक ओपिनियन पोल आधारित पूर्वानुमान है, आधिकारिक परिणाम नहीं | 
          This is an opinion poll-based prediction, not official results
        </p>
      </div>
    </div>
  )
}
