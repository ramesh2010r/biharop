import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | हमारे बारे में',
  description: 'Learn about Bihar Opinion Poll - an independent platform for gathering public opinion on Bihar Assembly Elections 2025.',
  alternates: {
    canonical: 'https://opinionpoll.co.in/about',
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-700 mb-4 leading-relaxed ">
              Bihar Opinion Poll is an independent digital platform dedicated to providing citizens a voice in 
              understanding public sentiment regarding the Bihar Assembly Elections 2025. We believe in the power 
              of collective opinion and transparent data to strengthen democratic discourse.
            </p>
            <p className="text-gray-700 leading-relaxed  hindi-text">
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why We Exist</h3>
            <p className="text-gray-700 mb-4 leading-relaxed ">
              Traditional opinion polls often have limited reach and sample sizes. Our digital platform democratizes 
              the polling process, allowing anyone with internet access to participate and view results. We aim to:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Provide a voice to every citizen interested in Bihar elections</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Offer transparent, real-time polling data</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Help understand constituency-level sentiment</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Foster informed political discourse</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">Complement traditional election analysis methods</span>
              </li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Important Disclaimer</h3>
              <p className="text-gray-700 mb-4 leading-relaxed ">
                Bihar Opinion Poll is an independent opinion survey platform and is NOT:
              </p>
              <ul className="list-none space-y-2 ml-0">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">An official voting platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Affiliated with the Election Commission of India</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Associated with any political party or candidate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">A predictor of actual election outcomes</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-4 leading-relaxed ">
                Our results are indicative of public opinion trends and should not be considered as actual 
                election results or predictions.
              </p>
            </div>
          </section>

          {/* Technology */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Technology</h3>
            <p className="text-gray-700 mb-4 leading-relaxed ">
              We use modern web technologies to ensure a fast, secure, and user-friendly experience:
            </p>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700"><strong>Secure Infrastructure:</strong> SSL encryption and secure data storage</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700"><strong>Duplicate Prevention:</strong> Browser fingerprinting technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700"><strong>Responsive Design:</strong> Works seamlessly on mobile, tablet, and desktop</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700"><strong>Real-time Updates:</strong> Live constituency-wise result aggregation</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-3 mt-1">•</span>
                <span className="text-gray-700"><strong>Bilingual Support:</strong> Full support for Hindi and English</span>
              </li>
            </ul>
          </section>

          {/* Transparency */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Transparency & Integrity</h3>
            <p className="text-gray-700 mb-4 leading-relaxed ">
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get In Touch</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Have questions, suggestions, or concerns? We&apos;d love to hear from you.
            </p>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-700">
                    <strong>General Inquiries:</strong> opinionpoll25@gmail.com
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Technical Support:</strong> opinionpoll25@gmail.com
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Website:</strong> <a href="https://opinionpoll.co.in" className="text-orange-600 hover:text-orange-700 underline">opinionpoll.co.in</a>
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 hindi-text">
                    <strong>संपर्क:</strong> opinionpoll25@gmail.com
                  </p>
                </div>
              </div>
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Acknowledgments</h3>
            <p className="text-gray-700 leading-relaxed ">
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
