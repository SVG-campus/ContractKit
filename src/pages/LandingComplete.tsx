import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LandingComplete() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        navigate('/dashboard')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate('/dashboard')
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📄</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                ContractKit
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </a>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <div>
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
              🎉 30-Day Free Trial • No Credit Card Required
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Professional Design Contracts in{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Minutes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop losing money on scope creep. Generate legally-binding contracts tailored for designers, 
              freelancers, and creative professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsSignUp(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition shadow-xl hover:shadow-2xl text-lg"
              >
                Start Free Trial →
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition text-lg">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✓ No credit card required  ✓ 30-day free trial  ✓ Cancel anytime
            </p>
          </div>

          {/* Right: Auth Form */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {isSignUp ? '🚀 Create Your Account' : '👋 Welcome Back'}
            </h3>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition shadow-lg disabled:opacity-50"
              >
                {loading ? 'Loading...' : isSignUp ? 'Start Free Trial' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>

            {isSignUp && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  🎁 Get 30 days free when you sign up!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        <p className="text-center text-gray-500 mb-8 font-medium">TRUSTED BY DESIGNERS AT</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
          <div className="text-center text-2xl font-bold text-gray-400">Figma</div>
          <div className="text-center text-2xl font-bold text-gray-400">Adobe</div>
          <div className="text-center text-2xl font-bold text-gray-400">Sketch</div>
          <div className="text-center text-2xl font-bold text-gray-400">Webflow</div>
          <div className="text-center text-2xl font-bold text-gray-400">Framer</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Everything You Need to Protect Your Work</h2>
          <p className="text-xl text-gray-600">Professional contracts in minutes, not hours</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-600">Generate professional contracts in under 2 minutes with our smart form builder.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-3">Legally Sound</h3>
            <p className="text-gray-600">Every contract is compliant with state laws and includes all necessary clauses.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-3">Save Thousands</h3>
            <p className="text-gray-600">Skip the $500+ lawyer fees. Get professional contracts for $19/month.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-2xl font-bold mb-3">PDF Download</h3>
            <p className="text-gray-600">Download professional PDFs ready to send to clients immediately.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-2xl font-bold mb-3">Email Direct</h3>
            <p className="text-gray-600">Send contracts directly to clients for review and signature via email.</p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🗂️</div>
            <h3 className="text-2xl font-bold mb-3">Version Control</h3>
            <p className="text-gray-600">Track all contract versions and changes with automatic audit logs.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Start with 30 days free. No credit card required.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>3 Free Contracts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>3 Free Invoices</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>PDF Generation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Email Delivery</span>
              </li>
            </ul>
            <button
              onClick={() => setIsSignUp(true)}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Start Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-2xl border-2 border-indigo-700 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 font-bold rounded-full text-sm">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$19</span>
              <span className="text-white/80">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-white">
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Unlimited Contracts</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Unlimited Invoices</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>PDF Generation</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Email Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Version Control</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Priority Support</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>All 50 US States</span>
              </li>
            </ul>
            <button
              onClick={() => setIsSignUp(true)}
              className="w-full px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start 30-Day Free Trial
            </button>
            <p className="text-center text-white/80 text-sm mt-4">
              First 30 days free • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-white mb-6">
            Ready to Protect Your Creative Work?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of designers who trust ContractKit for their legal protection
          </p>
          <button
            onClick={() => setIsSignUp(true)}
            className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-2xl text-lg"
          >
            Start Your 30-Day Free Trial →
          </button>
          <p className="text-white/80 text-sm mt-4">
            No credit card required • 3 free contracts to test
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📄</span>
                <span className="text-xl font-bold">ContractKit</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional design contracts made simple.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:contractkit.supp@gmail.com" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 ContractKit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
