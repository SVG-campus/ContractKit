import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Success() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (user && sessionId) {
      // Update subscription status to active
      updateSubscriptionStatus()
    }
  }, [user, sessionId])

  async function updateSubscriptionStatus() {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          stripe_subscription_id: sessionId,
          trial_end: null,
        })
        .eq('user_id', user?.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ContractKit Pro! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Your subscription is now active
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">What's included:</h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Unlimited contracts for all 50 states
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Professional PDF generation
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Email contracts to clients
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Invoice tracking & payments
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Priority support
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
        >
          Go to Dashboard
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Receipt sent to {user?.email}
        </p>
      </div>
    </div>
  )
}
