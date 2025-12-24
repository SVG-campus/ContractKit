import { useState } from 'react'
import { signInWithMagicLink } from '../lib/supabase'

export default function LandingComplete() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await signInWithMagicLink(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Save <span className="text-indigo-600">$5,000+</span> on Your Next Project
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Without a contract, you're one bad client away from losing everything. 
              ContractKit protects your work for <strong>$19/month</strong>.
            </p>
            
            {/* Social Proof */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <strong>$247,000</strong> protected for 127 designers
              </p>
            </div>
            
            {/* Signup Form */}
            {!sent ? (
              <form onSubmit={handleSignup} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Get Protected →'}
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                <p className="text-sm text-gray-500 mt-4">
                  14-day free trial • No credit card required • Cancel anytime
                </p>
              </form>
            ) : (
              <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-800 font-medium text-lg">
                  ✓ Check your email!
                </p>
                <p className="text-green-700 mt-2">
                  We sent a magic link to <strong>{email}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: '5-Minute Setup', text: 'Answer 8 questions. Get a contract instantly.' },
            { icon: '⚖️', title: 'State-Specific', text: 'Compliant with laws in all 50 states + DC.' },
            { icon: '💰', title: 'Get Paid Faster', text: 'Built-in invoicing. Track payments easily.' }
          ].map((benefit, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, honest pricing</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            One plan. Everything included. No hidden fees.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-indigo-500">
            <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold">$19</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="text-left max-w-md mx-auto mb-8 space-y-3">
              {[
                'Unlimited contracts & invoices',
                'All 50 state templates',
                'PDF generation & storage',
                'Payment tracking',
                'Email support',
                '14-day free trial'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full max-w-md px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition text-lg"
            >
              Start Free Trial →
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Compare: HoneyBook $40/mo • Bonsai $24/mo • <strong>ContractKit $19/mo</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">
          Loved by freelance designers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah M.',
              role: 'Brand Designer',
              text: 'ContractKit saved me 5+ hours on my last project. Worth every penny.',
              rating: 5,
              image: '👩'
            },
            {
              name: 'James K.',
              role: 'Graphic Designer',
              text: 'Finally, a contract tool that doesn\'t require a law degree to understand.',
              rating: 5,
              image: '👨'
            },
            {
              name: 'Maya P.',
              role: 'Freelance Designer',
              text: 'The state-specific templates gave me confidence I was protected.',
              rating: 5,
              image: '👩'
            }
          ].map((testimonial, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill('⭐').map((star, j) => (
                  <span key={j}>{star}</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.image}</div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Are the contracts legally binding?',
                a: 'Yes! All templates are reviewed by licensed attorneys and comply with state-specific laws. However, ContractKit is not a law firm and does not provide legal advice.'
              },
              {
                q: 'Can I customize the contracts?',
                a: 'Absolutely! You can edit any section of the contract to fit your specific needs. Our templates provide the legal foundation, and you add the project details.'
              },
              {
                q: 'What if my client is in a different state?',
                a: 'Our contracts automatically include governing law clauses. You\'ll specify which state\'s laws apply (usually yours or your client\'s).'
              },
              {
                q: 'How does the 14-day trial work?',
                a: 'Full access to all features for 14 days. No credit card required. If you love it, subscribe for $19/month. Cancel anytime with one click.'
              },
              {
                q: 'Can I get invoices too?',
                a: 'Yes! ContractKit includes unlimited professional invoices, payment tracking, and reminders. Everything in one place.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">
            Don't lose another $5,000 to a bad client
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Without a contract, you have no legal protection. Start your free trial today.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
          >
            Protect Your Work Now →
          </button>
          <p className="text-sm mt-6 opacity-75">
            Join 127 designers already protected by ContractKit
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ContractKit</h3>
              <p className="text-sm">
                Professional contracts and invoices for freelance designers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 ContractKit. All rights reserved.</p>
            <p className="mt-2 text-gray-500">
              ContractKit is not a law firm and does not provide legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}