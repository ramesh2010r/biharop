'use client'

import React from 'react'
import Link from 'next/link'
import Header from './Header'
import DisclaimerBanner from './DisclaimerBanner'
import Footer from './Footer'
import StructuredData from './StructuredData'

export default function WelcomePage() {

  return (
    <>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <StructuredData type="faqpage" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />

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

        {/* Welcome Text - Enhanced Content */}
        <div className="max-w-4xl mx-auto text-center mb-12 bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 hindi-text mb-4">
            बिहार ओपिनियन पोल 2025 - स्वतंत्र एवं निष्पक्ष
          </h1>
          <div className="text-base md:text-lg text-gray-700 space-y-3 hindi-text text-left md:text-center">
            <p className="leading-relaxed">
              बिहार विधानसभा चुनाव 2025 के लिए भारत का सबसे विश्वसनीय और पारदर्शी ओपिनियन पोल प्लेटफॉर्म। 
              यह एक स्वतंत्र राय सर्वेक्षण मंच है जो जनता की वास्तविक आवाज को प्रतिबिंबित करता है।
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              हमारा प्लेटफॉर्म पूरी तरह से गुमनाम, सुरक्षित और निष्पक्ष है। प्रत्येक विधानसभा क्षेत्र से केवल एक बार मतदान करें। 
              वास्तविक समय में परिणाम देखें और जानें कि आपके क्षेत्र में कौन आगे है।
            </p>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center items-center mt-6 flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hindi-text">100% गोपनीय</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="hindi-text">सुरक्षित प्रणाली</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="hindi-text">पारदर्शी परिणाम</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hindi-text">ECI अनुपालन</span>
            </div>
          </div>
        </div>



        {/* Key Stats - Simplified */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-16 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 hindi-text mb-6 md:mb-8">
            बिहार विधानसभा चुनाव 2025
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">243</div>
              <p className="text-xs md:text-sm text-gray-600 hindi-text">विधानसभा सीटें</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">38</div>
              <p className="text-xs md:text-sm text-gray-600 hindi-text">जिले</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="text-xl md:text-3xl font-bold text-orange-600 mb-2">7.5 करोड़+</div>
              <p className="text-xs md:text-sm text-gray-600 hindi-text">मतदाता</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">नवंबर</div>
              <p className="text-xs md:text-sm text-gray-600 hindi-text">चुनाव माह</p>
            </div>
          </div>
        </div>

        {/* How it Works - Enhanced */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 hindi-text mb-6 md:mb-8">
            तीन आसान चरणों में मतदान करें
          </h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-base md:text-lg font-bold">
                1
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 hindi-text">जिला चुनें</h3>
              <p className="text-gray-600 text-xs md:text-sm hindi-text">बिहार के 38 जिलों में से अपना जिला चुनें</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-base md:text-lg font-bold">
                2
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 hindi-text">विधानसभा चुनें</h3>
              <p className="text-gray-600 text-xs md:text-sm hindi-text">243 विधानसभा क्षेत्रों में से अपनी सीट चुनें</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4 md:p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-base md:text-lg font-bold">
                3
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 hindi-text">मतदान करें</h3>
              <p className="text-gray-600 text-xs md:text-sm hindi-text">अपने पसंदीदा उम्मीदवार को वोट दें</p>
            </div>
          </div>
        </div>

        {/* About Bihar Elections - New Section */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-16 bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 hindi-text mb-4 md:mb-6">
            बिहार विधानसभा चुनाव 2025 के बारे में
          </h2>
          <div className="space-y-3 md:space-y-4 text-gray-700 text-sm md:text-base">
            <p className="hindi-text leading-relaxed text-left">
              बिहार विधानसभा चुनाव भारत के सबसे महत्वपूर्ण राज्य चुनावों में से एक है। 243 विधानसभा सीटों के लिए होने वाला यह चुनाव 
              राज्य की राजनीतिक दिशा तय करता है। 7.5 करोड़ से अधिक पंजीकृत मतदाताओं के साथ, बिहार का चुनावी परिदृश्य अत्यंत विविधतापूर्ण है।
            </p>
            <p className="hindi-text leading-relaxed text-left">
              हमारा ओपिनियन पोल प्लेटफॉर्म आपको चुनाव से पहले जनता की नब्ज़ जानने में मदद करता है। यह एक स्वतंत्र, गैर-राजनीतिक मंच है 
              जो केवल लोकतांत्रिक प्रक्रिया में जनता की भागीदारी को बढ़ावा देने के लिए बनाया गया है।
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 md:p-4 my-3 md:my-4">
              <p className="text-xs md:text-sm text-amber-800 hindi-text leading-relaxed text-left">
                <strong>महत्वपूर्ण:</strong> यह आधिकारिक मतदान नहीं है। यह एक राय सर्वेक्षण है जो जनता की वर्तमान भावना को समझने में मदद करता है। 
                वास्तविक चुनाव में भाग लेना आपका संवैधानिक कर्तव्य है।
              </p>
            </div>
          </div>
        </div>

        {/* Why Participate - New Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 hindi-text mb-6 md:mb-8">
            क्यों भाग लें इस ओपिनियन पोल में?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 hindi-text mb-1 md:mb-2">अपनी आवाज़ सुनाएं</h3>
                  <p className="text-xs md:text-sm text-gray-600 hindi-text leading-relaxed text-left">
                    चुनाव से पहले अपनी राय साझा करें और देखें कि अन्य लोग क्या सोचते हैं।
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 hindi-text mb-1 md:mb-2">वास्तविक समय परिणाम</h3>
                  <p className="text-xs md:text-sm text-gray-600 hindi-text leading-relaxed text-left">
                    तुरंत देखें कि आपके विधानसभा क्षेत्र में कौन उम्मीदवार आगे है।
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 hindi-text mb-1 md:mb-2">पूर्ण गोपनीयता</h3>
                  <p className="text-xs md:text-sm text-gray-600 hindi-text leading-relaxed text-left">
                    आपकी पहचान पूरी तरह गुमनाम रहती है। कोई व्यक्तिगत जानकारी संग्रहीत नहीं की जाती।
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
              <div className="flex items-start space-x-2 md:space-x-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 hindi-text mb-1 md:mb-2">तुरंत परिणाम</h3>
                  <p className="text-xs md:text-sm text-gray-600 hindi-text leading-relaxed text-left">
                    मतदान करते ही परिणाम देखें। कोई प्रतीक्षा नहीं, कोई देरी नहीं।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - New */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-16 mb-12 bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 hindi-text mb-4 md:mb-6">
            अक्सर पूछे जाने वाले प्रश्न
          </h2>
          <div className="space-y-3 md:space-y-4">
            <details className="group border-b pb-3 md:pb-4">
              <summary className="cursor-pointer text-sm md:text-base font-semibold text-gray-800 hindi-text list-none flex items-center justify-between">
                क्या यह आधिकारिक मतदान है?
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 md:mt-3 text-gray-600 text-xs md:text-sm hindi-text leading-relaxed text-left">
                नहीं, यह एक स्वतंत्र ओपिनियन पोल है, आधिकारिक चुनाव नहीं। यह केवल जनता की राय जानने के लिए है।
              </p>
            </details>
            
            <details className="group border-b pb-3 md:pb-4">
              <summary className="cursor-pointer text-sm md:text-base font-semibold text-gray-800 hindi-text list-none flex items-center justify-between">
                क्या मेरी पहचान गुप्त रहेगी?
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 md:mt-3 text-gray-600 text-xs md:text-sm hindi-text leading-relaxed text-left">
                हां, आपकी पहचान पूरी तरह से गोपनीय है। हम कोई व्यक्तिगत जानकारी नहीं मांगते या संग्रहीत नहीं करते।
              </p>
            </details>
            
            <details className="group border-b pb-3 md:pb-4">
              <summary className="cursor-pointer text-sm md:text-base font-semibold text-gray-800 hindi-text list-none flex items-center justify-between">
                क्या मैं एक से अधिक बार वोट कर सकता हूं?
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 md:mt-3 text-gray-600 text-xs md:text-sm hindi-text leading-relaxed text-left">
                प्रत्येक विधानसभा क्षेत्र में केवल एक बार वोट किया जा सकता है। हमारी सिस्टम डुप्लिकेट वोट को रोकती है।
              </p>
            </details>
            
            <details className="group pb-3 md:pb-4">
              <summary className="cursor-pointer text-sm md:text-base font-semibold text-gray-800 hindi-text list-none flex items-center justify-between">
                परिणाम कितने विश्वसनीय हैं?
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 md:mt-3 text-gray-600 text-xs md:text-sm hindi-text leading-relaxed text-left">
                परिणाम वास्तविक समय में अपडेट होते हैं और भाग लेने वाले लोगों की राय को दर्शाते हैं। यह एक संकेतक है, गारंटी नहीं।
              </p>
            </details>
          </div>
        </div>

        {/* View Results Button - Prominent CTA at Bottom */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 md:p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white hindi-text mb-3">
              वर्तमान परिणाम देखें
            </h2>
            <p className="text-white/90 hindi-text mb-6 text-sm md:text-base">
              सभी विधानसभा क्षेत्रों के वास्तविक समय परिणाम अभी देखें
            </p>
            <Link 
              href="/results" 
              className="inline-flex items-center space-x-2 bg-white text-blue-700 px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="hindi-text">परिणाम देखें</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </>
  )
}
