import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'

interface UserProfile {
  full_name: string
  company_name: string
  business_address: string
  city: string
  state: string
  zip_code: string
  phone: string
  default_payment_terms: string
  default_late_fee_percentage: number
}

export default function Settings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isActive, isOnTrial, trialDaysRemaining } = useSubscription()
  
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    company_name: '',
    business_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    default_payment_terms: 'Net 30',
    default_late_fee_percentage: 1.5,
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          ...profile,
        })

      if (error) throw error

      setMessage('✅ Profile saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setMessage('❌ Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return
    }

    alert('Subscription cancellation will be implemented with Stripe Customer Portal')
    // TODO: Implement Stripe Customer Portal
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-indigo-600">Settings</h1>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => signOut().then(() => navigate('/'))}
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">�� Subscription</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold text-lg">
                {isOnTrial && (
                  <span className="text-blue-600">
                    🎉 Free Trial ({trialDaysRemaining} days left)
                  </span>
                )}
                {isActive && !isOnTrial && (
                  <span className="text-green-600">✅ Active</span>
                )}
                {!isActive && (
                  <span className="text-red-600">❌ Inactive</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Plan</p>
              <p className="font-semibold text-lg text-gray-900">
                {isActive ? 'ContractKit Pro' : 'Free Trial Expired'}
              </p>
            </div>
          </div>

          {isActive && !isOnTrial && (
            <div className="flex gap-3">
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Cancel Subscription
              </button>
              <a
                href="https://billing.stripe.com/p/login/test_"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Manage Billing →
              </a>
            </div>
          )}

          {isOnTrial && (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Subscribe Now - $19/mo
            </button>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">👤 Profile Information</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Personal Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={profile.company_name}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={profile.business_address}
                  onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={profile.zip_code}
                    onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contract Defaults */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contract Defaults</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={profile.default_payment_terms}
                  onChange={(e) => setProfile({ ...profile, default_payment_terms: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Late Fee Percentage
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.default_late_fee_percentage}
                  onChange={(e) => setProfile({ ...profile, default_late_fee_percentage: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </main>
    </div>
  )
}
