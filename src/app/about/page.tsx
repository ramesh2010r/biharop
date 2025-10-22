import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | हमारे बारे में',
  description: 'Learn about Bihar Opinion Poll - an independent platform for gathering public opinion on Bihar Assembly Elections 2025.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">About Us</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 hindi-text">हमारे बारे में</h2>

          {/* Mission */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Bihar Opinion Poll is an independent digital platform dedicated to providing citizens a voice in 
              understanding public sentiment regarding the Bihar Assembly Elections 2025. We believe in the power 
              of collective opinion and transparent data to strengthen democratic discourse.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed hindi-text">
              बिहार ओपिनियन पोल एक स्वतंत्र डिजिटल मंच है जो बिहार विधानसभा चुनाव 2025 के बारे में जनता की 
              राय को समझने के लिए नागरिकों को एक आवाज प्रदान करने के लिए समर्पित है। हम सामूहिक राय और 
              पारदर्शी डेटा की शक्ति में विश्वास करते हैं।
            </p>
          </section>

          {/* What We Do */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">🗳️ Opinion Collection</h4>
                <p className="text-gray-700 leading-relaxed">
                  We provide a secure, anonymous platform for citizens to express their opinions on candidates 
                  and parties across all 243 constituencies of Bihar.
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">📊 Real-time Results</h4>
                <p className="text-gray-700 leading-relaxed">
                  Display aggregated, real-time constituency-wise results to help understand public sentiment 
                  and polling trends across Bihar.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">🔒 Data Privacy</h4>
                <p className="text-gray-700 leading-relaxed">
                  We maintain strict privacy standards, ensuring all votes are anonymous while preventing 
                  duplicate submissions through secure fingerprinting.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">⚖️ ECI Compliance</h4>
                <p className="text-gray-700 leading-relaxed">
                  We strictly adhere to Election Commission of India guidelines, including the 48-hour blackout 
                  period before official voting.
                </p>
              </div>
            </div>
          </section>

          {/* Why We Exist */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why We Exist</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Traditional opinion polls often have limited reach and sample sizes. Our digital platform democratizes 
              the polling process, allowing anyone with internet access to participate and view results. We aim to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Provide a voice to every citizen interested in Bihar elections</li>
              <li>Offer transparent, real-time polling data</li>
              <li>Help understand constituency-level sentiment</li>
              <li>Foster informed political discourse</li>
              <li>Complement traditional election analysis methods</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">⚠️ Important Disclaimer</h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                Bihar Opinion Poll is an independent opinion survey platform and is NOT:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>An official voting platform</li>
                <li>Affiliated with the Election Commission of India</li>
                <li>Associated with any political party or candidate</li>
                <li>A predictor of actual election outcomes</li>
              </ul>
              <p className="text-gray-700 mt-4 leading-relaxed">
                Our results are indicative of public opinion trends and should not be considered as actual 
                election results or predictions.
              </p>
            </div>
          </section>

          {/* Technology */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Technology</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use modern web technologies to ensure a fast, secure, and user-friendly experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Secure Infrastructure:</strong> SSL encryption and secure data storage</li>
              <li><strong>Duplicate Prevention:</strong> Browser fingerprinting technology</li>
              <li><strong>Responsive Design:</strong> Works seamlessly on mobile, tablet, and desktop</li>
              <li><strong>Real-time Updates:</strong> Live constituency-wise result aggregation</li>
              <li><strong>Bilingual Support:</strong> Full support for Hindi and English</li>
            </ul>
          </section>

          {/* Transparency */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Transparency & Integrity</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We are committed to maintaining the highest standards of transparency and data integrity:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">All votes are anonymous and cannot be traced back to individuals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">One vote per person per constituency is strictly enforced</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Results are calculated in real-time from actual vote data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">No manual manipulation of data or results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Compliance with all applicable data protection regulations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Have questions, suggestions, or concerns? We&apos;d love to hear from you.
            </p>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <p className="text-gray-700 mb-2">
                <strong>General Inquiries:</strong> info@opinionpoll.co.in
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Technical Support:</strong> support@opinionpoll.co.in
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Website:</strong> <a href="https://opinionpoll.co.in" className="text-orange-600 hover:text-orange-700 underline">opinionpoll.co.in</a>
              </p>
              <p className="text-gray-700 mb-2 hindi-text">
                <strong>संपर्क:</strong> info@opinionpoll.co.in
              </p>
              <div className="mt-4">
                <Link 
                  href="/contact" 
                  className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Contact Us / संपर्क करें
                </Link>
              </div>
            </div>
          </section>

          {/* Acknowledgments */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Acknowledgments</h3>
            <p className="text-gray-700 leading-relaxed">
              We acknowledge the importance of democratic participation and thank all citizens who take the time 
              to share their opinions on our platform. Your participation makes this initiative meaningful and 
              helps create a more informed electorate.
            </p>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2025 Bihar Opinion Poll. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-orange-600 hover:text-orange-700">Terms of Service</Link>
            <Link href="/contact" className="text-orange-600 hover:text-orange-700">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
