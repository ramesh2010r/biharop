'use client'

import React from 'react'
import Link from 'next/link'
import DisclaimerBanner from './DisclaimerBanner'
import Footer from './Footer'

export default function WelcomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header - Clean & Simple */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        {/* Top Tricolor Bar */}
        <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-1"></div>
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 hindi-text">
                  बिहार ओपिनियन पोल 2025
                </h1>
                <p className="text-sm text-gray-600 hindi-text">जनता की आवाज़</p>
              </div>
            </div>

            {/* Results Button */}
            <Link 
              href="/results" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hindi-text"
            >
              परिणाम देखें
            </Link>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero CTA Section - Simplified */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-center text-white">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-white/90 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <h2 className="text-4xl font-bold hindi-text mb-3">
                अपनी राय दें
              </h2>
              <p className="text-xl text-white/90 hindi-text">
                बिहार विधानसभा चुनाव 2025
              </p>
            </div>
            
            <Link 
              href="/vote" 
              className="inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span className="hindi-text">अभी मतदान करें</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <div className="flex justify-center items-center mt-6 space-x-4 text-sm text-white/80">
              <span className="hindi-text">✓ गुमनाम</span>
              <span>•</span>
              <span className="hindi-text">✓ सुरक्षित</span>
              <span>•</span>
              <span className="hindi-text">✓ निष्पक्ष</span>
            </div>
          </div>
        </div>

        {/* Welcome Text - Simplified */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 hindi-text mb-4">
            स्वतंत्र ओपिनियन पोल
          </h3>
          <p className="text-lg text-gray-600 hindi-text">
            आपकी राय पूर्णतया गुमनाम और सुरक्षित है
          </p>
        </div>



        {/* Key Stats - Simplified */}
        <div className="max-w-4xl mx-auto mt-16 mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 hindi-text mb-8">
            बिहार विधानसभा चुनाव 2025
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-blue-600 mb-2">243</div>
              <p className="text-sm text-gray-600 hindi-text">विधानसभा सीटें</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">38</div>
              <p className="text-sm text-gray-600 hindi-text">जिले</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-orange-600 mb-2">7.5 करोड़+</div>
              <p className="text-sm text-gray-600 hindi-text">मतदाता</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-purple-600 mb-2">नवंबर</div>
              <p className="text-sm text-gray-600 hindi-text">चुनाव माह</p>
            </div>
          </div>
        </div>

        {/* How it Works - Simplified */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 hindi-text mb-8">
            तीन आसान चरणों में मतदान करें
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2 hindi-text">जिला चुनें</h4>
              <p className="text-gray-600 text-sm hindi-text">अपना जिला चुनें</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2 hindi-text">विधानसभा चुनें</h4>
              <p className="text-gray-600 text-sm hindi-text">अपनी विधानसभा चुनें</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2 hindi-text">मतदान करें</h4>
              <p className="text-gray-600 text-sm hindi-text">उम्मीदवार चुनें</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
