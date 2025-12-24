import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Success() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && sessionId) {
      updateSubscriptionStatus()
    } else {
      setLoading(false)
    }
  }, [user, sessionId])

  async function updateSubscriptionStatus() {
    try {
      console.log('Processing checkout session:', sessionId)

      // Get session details from Stripe to get customer ID
      const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY
      
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to retrieve session from Stripe')
      }

      const session = await response.json()
      console.log('Stripe session:', session)

      const customerId = session.customer
      const subscriptionId = session.subscription

      console.log('Customer ID:', customerId)
      console.log('Subscription ID:', subscriptionId)

      // Update subscription with Stripe IDs
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          trial_end: null,
        })
        .eq('user_id', user?.id)

      if (error) throw error

      console.log('Subscription updated successfully!')
    } catch (error: any) {
      console.error('Error updating subscription:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Subscription Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            🎉 Welcome to ContractKit Pro!
          </h1>
          <p className="text-xl opacity-90">
            Your subscription is now active
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Email Confirmation Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  📧 Check Your Email
                </h3>
                <p className="text-gray-700 mb-2">
                  A confirmation email has been sent to:
                </p>
                <p className="font-semibold text-blue-600 text-lg mb-3">
                  {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  It includes your receipt and subscription details. If you don't see it, check your spam folder.
                </p>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-xl mb-4">
              ✨ Your Pro Features:
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-gray-900">Unlimited Contracts</p>
                  <p className="text-sm text-gray-600">All 50 US states</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-gray-900">PDF Generation</p>
                  <p className="text-sm text-gray-600">Professional documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-900">Email Contracts</p>
                  <p className="text-sm text-gray-600">Send to clients instantly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">Invoice Tracking</p>
                  <p className="text-sm text-gray-600">Payment management</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">Legal Protection</p>
                  <p className="text-sm text-gray-600">State-compliant contracts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold text-gray-900">Priority Support</p>
                  <p className="text-sm text-gray-600">Fast response times</p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Monthly Subscription</span>
              <span className="font-bold text-gray-900 text-lg">$19.00/month</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Billed monthly • Cancel anytime • Manage in dashboard
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-indigo-700 hover:to-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Go to Dashboard →
          </button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Email{' '}
              <a href="mailto:contractkit.supp@gmail.com" className="text-indigo-600 hover:underline">
                contractkit.supp@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
