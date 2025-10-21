'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  name_hindi: string
  name_english: string
  district_id: number
  is_reserved: boolean
  reservation_type: string
  seat_no?: number
}

interface Party {
  party_id: number
  name_hindi: string
  name_english: string
  abbreviation: string
  symbol_url?: string
  color_code?: string
}

interface Candidate {
  candidate_id: number
  name_hindi: string
  name_english: string
  party_id: number
  constituency_id: number
  photo_url?: string
  party?: Party
}

export default function VotingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [districts, setDistricts] = useState<District[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [systemSettings, setSystemSettings] = useState({
    duplicate_vote_prevention: true,
    blackout_enforcement: true,
    anonymous_voting: true
  })
  
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<number | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)

  // Fetch districts and system settings on mount
  useEffect(() => {
    fetchDistricts()
    fetchSystemSettings()
  }, [])

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch(getApiUrl('/api/settings/public'))
      if (response.ok) {
        const data = await response.json()
        setSystemSettings(data)
      }
    } catch (err) {
      console.error('Failed to fetch system settings:', err)
    }
  }

  const fetchDistricts = async () => {
    setLoading(true)
    try {
      const response = await fetch(getApiUrl('/api/districts'))
      if (response.ok) {
        const data = await response.json()
        setDistricts(data)
      } else {
        setError('जिले लोड नहीं हो सके')
      }
    } catch (err) {
      setError('कृपया बाद में पुनः प्रयास करें')
    } finally {
      setLoading(false)
    }
  }

  const fetchConstituencies = async (districtId: number) => {
    setLoading(true)
    try {
      const response = await fetch(getApiUrl(`/api/constituencies/${districtId}`))
      if (response.ok) {
        const data = await response.json()
        setConstituencies(data)
      } else {
        setError('विधानसभा क्षेत्र लोड नहीं हो सके')
      }
    } catch (err) {
      setError('कृपया बाद में पुनः प्रयास करें')
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidates = async (constituencyId: number) => {
    setLoading(true)
    try {
      const response = await fetch(getApiUrl(`/api/candidates/${constituencyId}`))
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      } else {
        setError('उम्मीदवार लोड नहीं हो सके')
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
    setSelectedCandidate(null)
    fetchConstituencies(districtId)
    setStep(2)
  }

  const handleConstituencySelect = (constituencyId: number) => {
    setSelectedConstituency(constituencyId)
    setSelectedCandidate(null)
    fetchCandidates(constituencyId)
    setStep(3)
  }

  const handleCandidateSelect = (candidateId: number) => {
    setSelectedCandidate(candidateId)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setSelectedDistrict(null)
      setConstituencies([])
    } else if (step === 3) {
      setStep(2)
      setSelectedConstituency(null)
      setSelectedCandidate(null)
      setCandidates([])
    }
  }

  // Combined function to select candidate and submit vote
  const handleCandidateSelectAndSubmit = async (candidateId: number) => {
    console.log('Button clicked! Candidate ID:', candidateId)
    
    if (!selectedConstituency) {
      setError('कृपया पहले विधानसभा चुनें')
      return
    }

    // Check if already voted - only if duplicate prevention is enabled
    if (systemSettings.duplicate_vote_prevention) {
      const hasVoted = localStorage.getItem('hasVoted')
      console.log('Has voted?', hasVoted)
      
      if (hasVoted) {
        setError('आप पहले ही मतदान कर चुके हैं')
        setSelectedCandidate(candidateId)
        return
      }
    } else {
      console.log('Duplicate vote prevention is disabled, allowing vote')
    }

    // Set the selected candidate
    setSelectedCandidate(candidateId)
    setError('')
    setLoading(true)
    
    console.log('Submitting vote:', { 
      constituency_id: selectedConstituency, 
      candidate_id: candidateId,
      candidateType: typeof candidateId
    })

    try {
      const response = await fetch(getApiUrl('/api/vote'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          constituency_id: selectedConstituency,
          candidate_id: candidateId,
        }),
      })

      console.log('Vote response status:', response.status)

      if (response.ok) {
        // Store vote details for sharing
        const constituency = constituencies.find(c => c.id === selectedConstituency)
        const district = districts.find(d => d.id === selectedDistrict)
        
        if (candidateId === -1) {
          // NOTA vote
          const voteData = {
            candidate_name: 'NOTA - उपरोक्त में से कोई नहीं',
            candidate_name_english: 'None of the Above',
            party_abbreviation: 'NOTA',
            party_name: 'NOTA',
            party_symbol: '',
            constituency_name: constituency?.name_hindi || '',
            district_name: district?.name_hindi || '',
            voted_at: new Date().toISOString()
          }
          localStorage.setItem('lastVote', JSON.stringify(voteData))
        } else {
          const candidate = candidates.find(c => c.candidate_id === candidateId)
          if (candidate) {
            const voteData = {
              candidate_name: candidate.name_hindi,
              candidate_name_english: candidate.name_english,
              party_abbreviation: candidate.party?.abbreviation || 'IND',
              party_name: candidate.party?.name_hindi || 'निर्दलीय',
              party_symbol: candidate.party?.symbol_url || '',
              constituency_name: constituency?.name_hindi || '',
              district_name: district?.name_hindi || '',
              voted_at: new Date().toISOString()
            }
            localStorage.setItem('lastVote', JSON.stringify(voteData))
          }
        }
        
        // Only set hasVoted flag if duplicate prevention is enabled
        if (systemSettings.duplicate_vote_prevention) {
          localStorage.setItem('hasVoted', 'true')
        }
        console.log('Vote successful, redirecting to confirmation...')
        router.push('/confirmation')
      } else {
        const data = await response.json()
        console.error('Vote error:', data)
        setError(data.message || 'मतदान में त्रुटि हुई')
        setSelectedCandidate(null)
      }
    } catch (err) {
      console.error('Vote exception:', err)
      setError('कृपया बाद में पुनः प्रयास करें')
      setSelectedCandidate(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedCandidate || !selectedConstituency) {
      setError('कृपया एक उम्मीदवार चुनें')
      return
    }

    // Check if already voted - only if duplicate prevention is enabled
    if (systemSettings.duplicate_vote_prevention && localStorage.getItem('hasVoted')) {
      setError('आप पहले ही मतदान कर चुके हैं')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(getApiUrl('/api/vote'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          constituency_id: selectedConstituency,
          candidate_id: selectedCandidate,
        }),
      })

      if (response.ok) {
        // Only set hasVoted flag if duplicate prevention is enabled
        if (systemSettings.duplicate_vote_prevention) {
          localStorage.setItem('hasVoted', 'true')
        }
        router.push('/confirmation')
      } else {
        const data = await response.json()
        setError(data.message || 'मतदान में त्रुटि हुई')
      }
    } catch (err) {
      setError('कृपया बाद में पुनः प्रयास करें')
    } finally {
      setLoading(false)
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
              <p className="text-sm text-gray-600 hindi-text">मतदान पृष्ठ</p>
            </div>
          </Link>
        </div>
      </header>

      <DisclaimerBanner />

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            {/* Step 1 */}
            <button
              onClick={() => {
                if (step > 1) {
                  setStep(1);
                  setSelectedConstituency(null);
                  setSelectedCandidate(null);
                  setCandidates([]);
                }
              }}
              disabled={step === 1}
              className={`flex flex-col items-center cursor-pointer hover:opacity-80 transition ${step === 1 ? 'cursor-default' : ''}`}
              style={{width: '80px', minWidth: '80px'}}
            >
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold text-base sm:text-lg ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-xs sm:text-sm font-medium hindi-text text-gray-700 text-center mt-2 sm:mt-3">जिला</span>
            </button>
            
            {/* Connector 1 */}
            <div className={`flex-1 h-0.5 sm:h-1 -mt-4 sm:-mt-6 mx-1 sm:mx-2 ${
              step > 1 ? 'bg-primary-600' : 'bg-gray-300'
            }`} />
            
            {/* Step 2 */}
            <button
              onClick={() => {
                if (step > 2 && selectedDistrict) {
                  setStep(2);
                  setSelectedCandidate(null);
                  setCandidates([]);
                }
              }}
              disabled={step <= 1 || !selectedDistrict}
              className={`flex flex-col items-center transition ${step > 1 && selectedDistrict ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`}
              style={{width: '80px', minWidth: '80px'}}
            >
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold text-base sm:text-lg ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-xs sm:text-sm font-medium hindi-text text-gray-700 text-center mt-2 sm:mt-3">विधानसभा</span>
            </button>
            
            {/* Connector 2 */}
            <div className={`flex-1 h-0.5 sm:h-1 -mt-4 sm:-mt-6 mx-1 sm:mx-2 ${
              step > 2 ? 'bg-primary-600' : 'bg-gray-300'
            }`} />
            
            {/* Step 3 */}
            <button
              onClick={() => {
                // Step 3 cannot go back once reached
              }}
              disabled={true}
              className="flex flex-col items-center cursor-default"
              style={{width: '80px', minWidth: '80px'}}
            >
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold text-base sm:text-lg ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-xs sm:text-sm font-medium hindi-text text-gray-700 text-center mt-2 sm:mt-3">उम्मीदवार</span>
            </button>
          </div>
        </div>

        {/* Step 1: Select District */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 hindi-text mb-2 relative inline-block">
                अपना जिला चुनें
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
              </h2>
              <p className="text-gray-600 hindi-text text-sm mt-3">चरण 1 of 3</p>
            </div>
            {!loading && districts.length === 0 && (
              <div className="col-span-2 mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700 hindi-text text-base">जिले लोड नहीं हो सके</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600 hindi-text">लोड हो रहा है...</p>
                </div>
              ) : (
                districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => handleDistrictSelect(district.id)}
                    className="card hover:shadow-lg transition-shadow text-left hover:bg-blue-50"
                  >
                    <h3 className="text-lg font-semibold hindi-text text-gray-800">{district.name_hindi}</h3>
                    <p className="text-sm text-gray-500 mt-1">{district.name_english}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Constituency */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 hindi-text mb-2 relative inline-block">
                अपनी विधानसभा चुनें
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              </h2>
              <p className="text-gray-600 hindi-text text-sm mt-3">चरण 2 of 3</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600 hindi-text">लोड हो रहा है...</p>
                </div>
              ) : (
                constituencies.map((constituency) => (
                  <button
                    key={constituency.id}
                    onClick={() => handleConstituencySelect(constituency.id)}
                    className="card hover:shadow-lg transition-shadow text-left hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        #{constituency.seat_no}
                      </span>
                      {constituency.is_reserved && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                          {constituency.reservation_type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold hindi-text">{constituency.name_hindi}</h3>
                    <p className="text-sm text-gray-500 mt-1">{constituency.name_english}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Select Candidate - EVM Style */}
        {step === 3 && (
          <div className="flex flex-col items-center py-4 sm:py-4 md:py-8 px-2 sm:px-4">
            {/* Compact Important Notice - Above Heading */}
            <div className="w-full max-w-full sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-2.5 sm:p-3 shadow-md">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-blue-900 text-base sm:text-lg font-black">i</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs sm:text-sm font-normal hindi-text leading-tight">
                      नीले बटन पर क्लिक करते ही आपकी वोटिंग हो जाएगी

                    </p>
                    <p className="text-white text-xs sm:text-sm font-normal hindi-text leading-tight mt-1">
                      एक बार वोट देने के बाद बदलाव संभव नहीं है
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Heading */}
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 hindi-text mb-2 relative inline-block">
                अपना उम्मीदवार चुनें
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
              </h3>
              <p className="text-gray-600 hindi-text text-sm mt-3">चरण 3 of 3 • नीला बटन दबाएं</p>
            </div>
            
                        <div className="w-full max-w-full sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] bg-gradient-to-b from-[#f8f8f8] to-[#e8e8e8] border-[3px] md:border-[3px] border-[#aaa] rounded-xl sm:rounded-xl md:rounded-xl p-4 sm:p-4 md:p-5 shadow-[0_4px_10px_rgba(0,0,0,0.15)] sm:shadow-[0_6px_12px_rgba(0,0,0,0.15)] flex flex-col gap-2.5 sm:gap-2.5 md:gap-3">
              {/* Header Bar - Constituency Info */}
              <div className="h-auto min-h-[24px] sm:min-h-[24px] md:min-h-[28px] bg-gradient-to-r from-slate-600 to-slate-700 rounded flex items-center justify-center px-3 py-1.5">
                <div className="text-center">
                  <div className="text-white text-[9px] sm:text-[10px] md:text-xs font-medium opacity-90">जिला: {districts.find(d => d.id === selectedDistrict)?.name_hindi || ''}</div>
                  <div className="text-white text-xs sm:text-sm md:text-base font-bold hindi-text">
                    विधानसभा: {constituencies.find(c => c.id === selectedConstituency)?.name_hindi || ''}
                  </div>
                </div>
              </div>
              {/* Candidate Rows */}
              {candidates.map((candidate, index) => (
                <div key={candidate.candidate_id}>
                  <div
                    className="grid grid-cols-[1fr_auto] items-stretch bg-transparent border border-[#ccc] rounded-lg h-auto min-h-[60px] sm:min-h-[64px] md:min-h-[68px] px-3 sm:px-3 md:px-4 py-2 transition-all gap-4"
                  >
                    {/* Left Column: Logo + Candidate/Party Info (White Background) */}
                    <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 flex-1 min-w-0 border border-gray-200">
                      {/* Party Logo */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg overflow-hidden flex justify-center items-center bg-white border-2 border-gray-300 flex-shrink-0 shadow-sm">
                        {candidate.party?.symbol_url ? (
                          <img
                            src={candidate.party.symbol_url}
                            alt={candidate.party.abbreviation}
                            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain"
                            onError={(e) => {
                              console.error('Failed to load party symbol:', candidate.party?.symbol_url);
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs font-bold text-gray-500">${candidate.party?.abbreviation || 'IND'}</span>`;
                              }
                            }}
                            onLoad={() => console.log('Loaded party symbol:', candidate.party?.symbol_url)}
                          />
                        ) : (
                          <span className="text-xs font-bold text-gray-500">
                            {candidate.party?.abbreviation || 'IND'}
                          </span>
                        )}
                      </div>
                      {/* Candidate and Party Names */}
                      <div className="flex flex-col justify-center min-w-0 flex-1 gap-0.5">
                        <div className="text-base sm:text-base md:text-lg font-bold text-gray-900 hindi-text leading-tight break-words">
                          {candidate.name_hindi}
                        </div>
                        <div className="text-xs sm:text-sm md:text-sm text-gray-600 font-medium italic leading-tight">
                          {candidate.party?.abbreviation || 'IND'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column: LED + Button (Transparent Background) */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      {/* LED Indicator */}
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${
                          selectedCandidate === candidate.candidate_id
                            ? 'bg-red-600 shadow-[0_0_10px_red]'
                            : 'bg-gray-300 shadow-[0_0_2px_rgba(0,0,0,0.2)]'
                        }`}
                      >
                        {selectedCandidate === candidate.candidate_id && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                            style={{
                              color: '#991b1b',
                              filter: 'brightness(0.85) drop-shadow(0px 1px 1px rgba(0,0,0,0.5))',
                            }}
                          >
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                          </svg>
                        )}
                      </div>
                      
                      {/* Blue Button */}
                      <button
                        onClick={() => {
                          handleCandidateSelectAndSubmit(candidate.candidate_id);
                        }}
                        disabled={loading}
                        className={`w-20 h-9 sm:w-24 sm:h-10 md:w-28 md:h-11 bg-[#0b3776] rounded-2xl cursor-pointer flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold leading-[1] flex-shrink-0 py-0 select-none ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        style={{
                          transition: 'all 0.1s ease-out',
                          transform: 'translateZ(0)',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                        }}
                        onMouseDown={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(3px) scale(0.98)';
                            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.4)';
                            e.currentTarget.style.backgroundColor = '#092d5f';
                          }
                        }}
                        onMouseUp={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                            e.currentTarget.style.backgroundColor = '#0b3776';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                            e.currentTarget.style.backgroundColor = '#0b3776';
                          }
                        }}
                      >
                        {loading && selectedCandidate === candidate.candidate_id ? (
                          <div className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="hindi-text block" style={{ lineHeight: '1', paddingTop: '1px' }}>वोट दें</span>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Error Message - Shows below the candidate row */}
                  {error && selectedCandidate === candidate.candidate_id && (
                    <div className="mt-2 bg-red-50/40 border-l-2 border-red-300 rounded-r px-2.5 py-1.5">
                      <p className="text-red-600 text-xs font-normal hindi-text">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* NOTA Option */}
              <div>
                <div className="grid grid-cols-[1fr_auto] items-stretch bg-transparent border-2 border-red-500 rounded-lg h-auto min-h-[60px] sm:min-h-[64px] md:min-h-[68px] px-3 sm:px-3 md:px-4 py-2 transition-all gap-4">
                  {/* Left Column: NOTA Info */}
                  <div className="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2 flex-1 min-w-0 border border-red-200">
                    {/* NOTA Icon */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg overflow-hidden flex justify-center items-center bg-white border-2 border-red-500 flex-shrink-0 shadow-sm">
                      <span className="text-xl font-bold text-red-600">✗</span>
                    </div>
                    {/* NOTA Text */}
                    <div className="flex flex-col justify-center min-w-0 flex-1 gap-0.5">
                      <div className="text-base sm:text-base md:text-lg font-bold text-red-700 hindi-text leading-tight break-words">
                        NOTA - उपरोक्त में से कोई नहीं
                      </div>
                      <div className="text-xs sm:text-sm md:text-sm text-red-600 font-medium italic leading-tight">
                        None of the Above
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: LED + Button */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    {/* LED Indicator */}
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${
                        selectedCandidate === -1
                          ? 'bg-red-600 shadow-[0_0_10px_red]'
                          : 'bg-gray-300 shadow-[0_0_2px_rgba(0,0,0,0.2)]'
                      }`}
                    >
                      {selectedCandidate === -1 && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                          style={{
                            color: '#991b1b',
                            filter: 'brightness(0.85) drop-shadow(0px 1px 1px rgba(0,0,0,0.5))',
                          }}
                        >
                          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Blue Button */}
                    <button
                      onClick={() => {
                        handleCandidateSelectAndSubmit(-1);
                      }}
                      disabled={loading}
                      className={`w-20 h-9 sm:w-24 sm:h-10 md:w-28 md:h-11 bg-[#0b3776] rounded-2xl cursor-pointer flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold leading-[1] flex-shrink-0 py-0 select-none ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{
                        transition: 'all 0.1s ease-out',
                        transform: 'translateZ(0)',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                      }}
                      onMouseDown={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = 'translateY(3px) scale(0.98)';
                          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.4)';
                          e.currentTarget.style.backgroundColor = '#092d5f';
                        }
                      }}
                      onMouseUp={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                          e.currentTarget.style.backgroundColor = '#0b3776';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                          e.currentTarget.style.backgroundColor = '#0b3776';
                        }
                      }}
                    >
                      {loading && selectedCandidate === -1 ? (
                        <div className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="hindi-text block" style={{ lineHeight: '1', paddingTop: '1px' }}>वोट दें</span>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Error Message for NOTA */}
                {error && selectedCandidate === -1 && (
                  <div className="mt-2 bg-red-50/40 border-l-2 border-red-300 rounded-r px-2.5 py-1.5">
                    <p className="text-red-600 text-xs font-normal hindi-text">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Bar - Voting Instruction */}
              <div className="h-auto min-h-[24px] sm:min-h-[24px] md:min-h-[28px] bg-gradient-to-r from-slate-600 to-slate-700 rounded flex items-center justify-center px-3 py-1.5">
                <span className="text-white text-[10px] sm:text-xs md:text-sm font-semibold text-center hindi-text leading-tight">
                  एक यूजर एक बार ही वोट डाल सकता है
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
