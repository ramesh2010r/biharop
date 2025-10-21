import Link from 'next/link'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header with tri-color */}
      <div className="bg-white border-b-4 border-[#FF9933]">
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            वापस जाएं / Go Back
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 hindi-text mb-2">
            महत्वपूर्ण सूचना / Important Notice
          </h1>
          <p className="text-gray-600">
            डिस्क्लेमर और शर्तें / Disclaimer and Terms
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice Card */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-start space-x-4">
              <svg className="w-10 h-10 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-900 hindi-text mb-4">
                  स्वतंत्र ओपिनियन पोल
                </h2>
                <p className="text-blue-800 hindi-text text-lg leading-relaxed mb-4">
                  यह एक स्वतंत्र ओपिनियन पोल है और इसका भारत निर्वाचन आयोग से कोई संबंध नहीं है। 
                  परिणाम केवल जनमत दर्शाते हैं और किसी भी आधिकारिक चुनाव परिणाम का पूर्वानुमान नहीं हैं।
                </p>
                <p className="text-blue-700 text-base leading-relaxed">
                  This is an independent opinion poll and is not affiliated with the Election Commission of India. 
                  The results reflect public opinion only and are not predictions of any official election results.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Disclaimer Sections */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 hindi-text mb-4">
              1. उद्देश्य / Purpose
            </h3>
            <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
              इस मंच का उद्देश्य बिहार की जनता को एक डिजिटल प्लेटफॉर्म प्रदान करना है जहाँ वे अपनी राय व्यक्त कर सकें। 
              यह किसी भी राजनीतिक दल या उम्मीदवार का समर्थन या विरोध नहीं करता है।
            </p>
            <p className="text-gray-600 leading-relaxed">
              The purpose of this platform is to provide the people of Bihar with a digital space to express their opinions. 
              It does not endorse or oppose any political party or candidate.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 hindi-text mb-4">
              2. डेटा संग्रहण / Data Collection
            </h3>
            <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
              हम केवल निम्नलिखित जानकारी एकत्र करते हैं:
            </p>
            <ul className="list-disc list-inside text-gray-700 hindi-text mb-3 space-y-2">
              <li>आपका निर्वाचन क्षेत्र (स्वयं चयनित)</li>
              <li>आपका मत (स्वयं चयनित उम्मीदवार)</li>
              <li>ब्राउज़र फ़िंगरप्रिंट (डुप्लिकेट वोट रोकने के लिए)</li>
              <li>IP पता (सुरक्षा के लिए)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              We only collect the following information: your constituency (self-selected), your vote (self-selected candidate), 
              browser fingerprint (to prevent duplicate voting), and IP address (for security purposes).
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 id="privacy" className="text-xl font-bold text-gray-900 hindi-text mb-4">
              3. गोपनीयता / Privacy
            </h3>
            <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
              आपका मत पूर्णतः गोपनीय है। हम किसी भी व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करते हैं। 
              आपका नाम, फोन नंबर, ईमेल या पता संग्रहीत नहीं किया जाता है।
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your vote is completely confidential. We do not collect any personally identifiable information. 
              Your name, phone number, email, or address are not stored.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 hindi-text mb-4">
              4. ECI अनुपालन / ECI Compliance
            </h3>
            <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
              यह प्लेटफॉर्म भारत निर्वाचन आयोग के दिशानिर्देशों का पालन करता है:
            </p>
            <ul className="list-disc list-inside text-gray-700 hindi-text mb-3 space-y-2">
              <li>मतदान समाप्ति से 48 घंटे पहले परिणाम प्रदर्शन बंद कर दिया जाएगा</li>
              <li>यह ओपिनियन पोल है, आधिकारिक मतदान नहीं</li>
              <li>कोई राजनीतिक विज्ञापन या प्रचार सामग्री प्रदर्शित नहीं की जाती है</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              This platform complies with Election Commission of India guidelines: results display will be stopped 48 hours 
              before polling ends, this is an opinion poll not official voting, and no political advertisements or campaign 
              material is displayed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 hindi-text mb-4">
              5. सीमाएं / Limitations
            </h3>
            <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
              कृपया ध्यान दें:
            </p>
            <ul className="list-disc list-inside text-gray-700 hindi-text mb-3 space-y-2">
              <li>यह परिणाम वैज्ञानिक नमूनाकरण पर आधारित नहीं है</li>
              <li>यह केवल भाग लेने वाले लोगों की राय को दर्शाता है</li>
              <li>यह आधिकारिक चुनाव परिणाम का पूर्वानुमान नहीं है</li>
              <li>परिणाम वास्तविक समय में बदल सकते हैं</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Please note: these results are not based on scientific sampling, they only reflect the opinions of participants, 
              they are not predictions of official election results, and results may change in real-time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 hindi-text mb-4">
              6. अस्वीकरण / Disclaimer
            </h3>
            <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
              इस प्लेटफॉर्म के निर्माता, संचालक, या रखरखावकर्ता किसी भी तरह से परिणामों की सटीकता की गारंटी नहीं देते हैं। 
              यह केवल सूचना के उद्देश्य से है और किसी भी कानूनी या आधिकारिक निर्णय के लिए उपयोग नहीं किया जाना चाहिए।
            </p>
            <p className="text-gray-600 leading-relaxed">
              The creators, operators, or maintainers of this platform do not guarantee the accuracy of results in any way. 
              This is for informational purposes only and should not be used for any legal or official decision-making.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1 rounded-lg">
            <div className="bg-white rounded-lg p-8">
              <h3 id="contact" className="text-xl font-bold text-gray-900 hindi-text mb-4">
                संपर्क करें / Contact Us
              </h3>
              <p className="text-gray-700 hindi-text mb-3 leading-relaxed">
                यदि आपके कोई प्रश्न या चिंताएं हैं, तो कृपया हमसे संपर्क करें।
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions or concerns, please contact us.
              </p>
              <div className="text-blue-600 font-medium">
                📧 Email: info@biharopinionpoll.in<br/>
                📞 Support: Available during polling hours
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
            >
              मुख्य पृष्ठ पर वापस जाएं / Return to Main Page
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Bihar Opinion Poll | स्वतंत्र ओपिनियन पोल
          </p>
        </div>
      </footer>
    </div>
  )
}
