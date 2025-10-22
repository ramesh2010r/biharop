import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | सेवा की शर्तें',
  description: 'Terms of Service for using Bihar Opinion Poll website. Read our usage terms and conditions.',
  alternates: {
    canonical: '/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
            ← मुख्य पृष्ठ पर वापस जाएं / Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 hindi-text">सेवा की शर्तें</h2>
          
          <p className="text-sm text-gray-500 mb-8">Last Updated: January 2025</p>

          {/* Introduction */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">1. Acceptance of Terms</h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              By accessing and using opinionpoll.co.in (&quot;the Website&quot;), you accept and agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify hindi-text">
              इस वेबसाइट का उपयोग करके, आप इन सेवा की शर्तों को स्वीकार करते हैं। यदि आप सहमत नहीं हैं, 
              तो कृपया इस वेबसाइट का उपयोग न करें।
            </p>
          </section>

          {/* Purpose */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">2. Purpose of the Website</h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              Bihar Opinion Poll is an independent platform designed to gather public opinion regarding the 
              Bihar Assembly Elections 2025. This is NOT an official electoral process and has no legal binding.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-gray-800 font-semibold">⚠️ Important Disclaimer:</p>
              <ul className="list-none space-y-2 ml-0 mt-2">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">This is an opinion poll, not actual voting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Results are indicative and not official election results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">This platform is not affiliated with the Election Commission of India</span>
                </li>
              </ul>
            </div>
          </section>

          {/* User Eligibility */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">3. User Eligibility</h3>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">You must be at least 18 years old to participate</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">You must be a resident or have interest in Bihar elections</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">You can vote only once per constituency</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Duplicate votes are automatically prevented through browser fingerprinting</span>
              </li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">4. Prohibited Activities</h3>
            <p className="text-gray-700 mb-4">Users are strictly prohibited from:</p>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Attempting to vote multiple times</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Using automated tools, bots, or scripts to manipulate results</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Reverse engineering or attempting to breach website security</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Spreading misinformation about poll results</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Harassing or threatening other users or administrators</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Using the website for any illegal purposes</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Attempting to access admin areas without authorization</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">5. Intellectual Property</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              All content on this website, including but not limited to text, graphics, logos, images, and software, 
              is the property of Bihar Opinion Poll or its content suppliers and is protected by copyright and 
              intellectual property laws.
            </p>
          </section>

          {/* Data Usage */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">6. Data and Privacy</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              Your use of this website is also governed by our{' '}
              <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline font-medium">
                Privacy Policy
              </Link>
              . By using this website, you consent to the collection and use of information as described in our 
              Privacy Policy.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">7. Disclaimer of Warranties</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4 leading-relaxed text-justify">
                THE WEBSITE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO WARRANTIES, 
                EXPRESS OR IMPLIED, REGARDING:
              </p>
              <ul className="list-none space-y-2 ml-0">
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Accuracy, reliability, or completeness of poll results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Uninterrupted or error-free operation of the website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Prediction of actual election outcomes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Security of data transmission</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">8. Limitation of Liability</h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              Bihar Opinion Poll and its operators shall not be liable for any direct, indirect, incidental, 
              special, or consequential damages arising from:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Use or inability to use the website</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Reliance on poll results for any decision-making</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Unauthorized access to your data</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Technical errors or interruptions</span>
              </li>
            </ul>
          </section>

          {/* ECI Compliance */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">9. Election Commission Compliance</h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              We comply with Election Commission of India (ECI) guidelines regarding opinion polls:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Poll results will be hidden during the 48-hour blackout period before voting</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Appropriate disclaimers are displayed throughout the website</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">This is clearly marked as an opinion poll, not official voting</span>
              </li>
            </ul>
          </section>

          {/* Modifications */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">10. Modifications to Terms</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting on this page. Your continued use of the website after any changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">11. Termination</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              We reserve the right to terminate or suspend access to our website immediately, without prior 
              notice, for any reason, including breach of these Terms of Service.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">12. Governing Law</h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              These Terms of Service shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the 
              courts in Patna, Bihar.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">13. Contact Information</h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-justify">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <p className="text-gray-700 mb-3 flex items-start">
                <strong className="min-w-[80px]">Email:</strong>
                <span>legal@opinionpoll.co.in</span>
              </p>
              <p className="text-gray-700 flex items-start">
                <strong className="min-w-[80px]">Website:</strong>
                <a href="https://opinionpoll.co.in" className="text-orange-600 hover:text-orange-700 underline">opinionpoll.co.in</a>
              </p>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2025 Bihar Opinion Poll. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>
            <Link href="/about" className="text-orange-600 hover:text-orange-700">About Us</Link>
            <Link href="/contact" className="text-orange-600 hover:text-orange-700">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
