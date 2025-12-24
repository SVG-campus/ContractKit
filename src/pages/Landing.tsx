import { useState } from 'react'
import { signInWithMagicLink } from '../lib/supabase'

export default function Landing() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16">
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
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: '5-Minute Setup', text: 'Answer 8 questions. Get a contract instantly.' },
            { icon: '⚖️', title: 'State-Specific', text: 'Compliant with laws in all 50 states + DC.' },
            { icon: '💰', title: 'Get Paid Faster', text: 'Built-in invoicing. Track payments easily.' }
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
