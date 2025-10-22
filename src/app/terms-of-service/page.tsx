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
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              By accessing and using opinionpoll.co.in (&quot;the Website&quot;), you accept and agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
            <p className="text-gray-700 leading-relaxed hindi-text">
              इस वेबसाइट का उपयोग करके, आप इन सेवा की शर्तों को स्वीकार करते हैं। यदि आप सहमत नहीं हैं, 
              तो कृपया इस वेबसाइट का उपयोग न करें।
            </p>
          </section>

          {/* Purpose */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Purpose of the Website</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Bihar Opinion Poll is an independent platform designed to gather public opinion regarding the 
              Bihar Assembly Elections 2025. This is NOT an official electoral process and has no legal binding.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-gray-800 font-semibold">⚠️ Important Disclaimer:</p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>This is an opinion poll, not actual voting</li>
                <li>Results are indicative and not official election results</li>
                <li>This platform is not affiliated with the Election Commission of India</li>
              </ul>
            </div>
          </section>

          {/* User Eligibility */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. User Eligibility</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You must be at least 18 years old to participate</li>
              <li>You must be a resident or have interest in Bihar elections</li>
              <li>You can vote only once per constituency</li>
              <li>Duplicate votes are automatically prevented through browser fingerprinting</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Prohibited Activities</h3>
            <p className="text-gray-700 mb-4">Users are strictly prohibited from:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Attempting to vote multiple times</li>
              <li>Using automated tools, bots, or scripts to manipulate results</li>
              <li>Reverse engineering or attempting to breach website security</li>
              <li>Spreading misinformation about poll results</li>
              <li>Harassing or threatening other users or administrators</li>
              <li>Using the website for any illegal purposes</li>
              <li>Attempting to access admin areas without authorization</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              All content on this website, including but not limited to text, graphics, logos, images, and software, 
              is the property of Bihar Opinion Poll or its content suppliers and is protected by copyright and 
              intellectual property laws.
            </p>
          </section>

          {/* Data Usage */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Data and Privacy</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer of Warranties</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4 leading-relaxed">
                THE WEBSITE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO WARRANTIES, 
                EXPRESS OR IMPLIED, REGARDING:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Accuracy, reliability, or completeness of poll results</li>
                <li>Uninterrupted or error-free operation of the website</li>
                <li>Prediction of actual election outcomes</li>
                <li>Security of data transmission</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Bihar Opinion Poll and its operators shall not be liable for any direct, indirect, incidental, 
              special, or consequential damages arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use or inability to use the website</li>
              <li>Reliance on poll results for any decision-making</li>
              <li>Unauthorized access to your data</li>
              <li>Technical errors or interruptions</li>
            </ul>
          </section>

          {/* ECI Compliance */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">9. Election Commission Compliance</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We comply with Election Commission of India (ECI) guidelines regarding opinion polls:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Poll results will be hidden during the 48-hour blackout period before voting</li>
              <li>Appropriate disclaimers are displayed throughout the website</li>
              <li>This is clearly marked as an opinion poll, not official voting</li>
            </ul>
          </section>

          {/* Modifications */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications to Terms</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting on this page. Your continued use of the website after any changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We reserve the right to terminate or suspend access to our website immediately, without prior 
              notice, for any reason, including breach of these Terms of Service.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the 
              courts in Patna, Bihar.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@opinionpoll.co.in
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Website:</strong> <a href="https://opinionpoll.co.in" className="text-orange-600 hover:text-orange-700 underline">opinionpoll.co.in</a>
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
