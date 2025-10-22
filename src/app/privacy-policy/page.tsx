import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | गोपनीयता नीति',
  description: 'Privacy Policy for Bihar Opinion Poll website. Learn how we collect, use, and protect your information.',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 hindi-text">गोपनीयता नीति</h2>
          
          <p className="text-sm text-gray-500 mb-8">Last Updated: January 2025</p>

          {/* Introduction */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Welcome to Bihar Opinion Poll (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website opinionpoll.co.in.
            </p>
            <p className="text-gray-700 leading-relaxed hindi-text">
              बिहार ओपिनियन पोल में आपका स्वागत है। हम आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध हैं और आपकी व्यक्तिगत 
              जानकारी की सुरक्षा सुनिश्चित करते हैं।
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h3>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">1.1 Voting Information</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>District and constituency selection</li>
              <li>Candidate preference (anonymous voting)</li>
              <li>Browser fingerprint for duplicate vote prevention</li>
              <li>Timestamp of vote submission</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">1.2 Technical Information</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">1.3 Google Analytics</h4>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use Google Analytics to analyze website traffic and user behavior. Google Analytics collects 
              information anonymously and reports website trends without identifying individual visitors.
            </p>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To process and record your opinion poll votes</li>
              <li>To prevent duplicate voting and maintain data integrity</li>
              <li>To display aggregated poll results</li>
              <li>To improve our website and user experience</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              You can control cookie settings through your browser preferences. However, disabling cookies 
              may affect the functionality of our website.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our website may contain advertisements served by Google AdSense and use Google Analytics for 
              website analytics. These third-party services have their own privacy policies and we encourage 
              you to review them:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                   className="text-orange-600 hover:text-orange-700 underline">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" 
                   className="text-orange-600 hover:text-orange-700 underline">
                  Google Advertising Policy
                </a>
              </li>
            </ul>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Disable cookies through your browser settings</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">7. Children&apos;s Privacy</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our website is intended for users who are 18 years of age or older. We do not knowingly collect 
              personal information from children under 18. If you believe we have collected information from 
              a child under 18, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Privacy Policy</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@opinionpoll.co.in
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Website:</strong> <a href="https://opinionpoll.co.in" className="text-orange-600 hover:text-orange-700 underline">opinionpoll.co.in</a>
              </p>
              <p className="text-gray-700 hindi-text">
                <strong>संपर्क:</strong> privacy@opinionpoll.co.in
              </p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">GDPR & Data Protection Compliance</h3>
            <p className="text-gray-700 leading-relaxed">
              We comply with applicable data protection laws including GDPR principles. Your data is processed 
              lawfully, fairly, and transparently. We only collect data necessary for our services and retain 
              it only as long as needed.
            </p>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2025 Bihar Opinion Poll. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms-of-service" className="text-orange-600 hover:text-orange-700">Terms of Service</Link>
            <Link href="/about" className="text-orange-600 hover:text-orange-700">About Us</Link>
            <Link href="/contact" className="text-orange-600 hover:text-orange-700">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
