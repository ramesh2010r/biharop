import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | संपर्क करें',
  description: 'Get in touch with Bihar Opinion Poll team. We are here to help with your questions and concerns.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
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
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 hindi-text">संपर्क करें</h2>
          
          <p className="text-gray-700 mb-10 leading-relaxed">
            We&apos;re here to help! If you have any questions, concerns, or feedback about Bihar Opinion Poll, 
            please don&apos;t hesitate to reach out to us.
          </p>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* General Inquiries */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">General Inquiries</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> opinionpoll25@gmail.com
              </p>
              <p className="text-gray-600 text-sm">
                For general questions about the opinion poll, how to participate, or understanding results.
              </p>
            </div>

            {/* Technical Support */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Technical Support</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> opinionpoll25@gmail.com
              </p>
              <p className="text-gray-600 text-sm">
                For technical issues, bugs, website problems, or voting difficulties.
              </p>
            </div>

            {/* Privacy & Legal */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Legal</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> opinionpoll25@gmail.com
              </p>
              <p className="text-gray-600 text-sm">
                For privacy concerns, data requests, legal inquiries, or terms of service questions.
              </p>
            </div>

            {/* Feedback & Suggestions */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Feedback & Suggestions</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> opinionpoll25@gmail.com
              </p>
              <p className="text-gray-600 text-sm">
                Share your suggestions, feature requests, or feedback to help us improve.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <details className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600">
                  How can I participate in the opinion poll?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Simply visit our{' '}
                  <Link href="/vote" className="text-orange-600 hover:text-orange-700 underline">voting page</Link>, 
                  select your district and constituency, choose your preferred candidate, and submit your vote. 
                  You can vote only once per constituency.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600">
                  Is my vote anonymous?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Yes, absolutely! Your vote is completely anonymous. We use browser fingerprinting only to 
                  prevent duplicate votes, but we do not collect any personally identifiable information.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600">
                  Are these results official election results?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  No. This is an independent opinion poll, not official voting. The results represent public 
                  opinion trends and should not be considered as predictions or actual election outcomes.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600">
                  I&apos;m having technical issues. What should I do?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  Please email us at opinionpoll25@gmail.com with details about the issue you&apos;re facing, 
                  including your browser type, device, and screenshots if possible. We&apos;ll respond within 24 hours.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600">
                  Can I change my vote after submission?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  No, once a vote is submitted, it cannot be changed. This ensures the integrity of the poll 
                  results. Please review your selection carefully before submitting.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600">
                  Is this website affiliated with any political party?
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  No, we are completely independent and not affiliated with any political party, candidate, 
                  or the Election Commission of India. We maintain strict neutrality.
                </p>
              </details>
            </div>
          </section>

          {/* Social Media */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <p className="text-gray-700 mb-4">
              Follow us on social media for updates and latest poll results:
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://twitter.com/BiharOpinionPoll" target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter / X
              </a>
              
              <a href="https://facebook.com/BiharOpinionPoll" target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </section>

          {/* Office Hours */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Response Time</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-3">
                <strong>Email Response:</strong> We typically respond to all inquiries within 24-48 hours.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Technical Issues:</strong> Critical technical issues are prioritized and addressed as quickly as possible.
              </p>
              <p className="text-gray-700 hindi-text">
                <strong>प्रतिक्रिया समय:</strong> हम सभी पूछताछ का 24-48 घंटों के भीतर उत्तर देते हैं।
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2025 Bihar Opinion Poll. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-orange-600 hover:text-orange-700">Terms of Service</Link>
            <Link href="/about" className="text-orange-600 hover:text-orange-700">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
