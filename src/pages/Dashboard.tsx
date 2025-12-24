import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { createCheckoutSession } from '../lib/stripe'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isOnTrial, isActive, trialDaysRemaining, loading: subLoading } = useSubscription()
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    loadContracts()
  }, [])

  async function loadContracts() {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setContracts(data || [])
    } catch (error) {
      console.error('Error loading contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  async function handleUpgrade() {
    if (!user?.email) {
      alert('User email not found')
      return
    }

    setCheckoutLoading(true)
    try {
      await createCheckoutSession(user.email)
    } catch (error: any) {
      console.error('Stripe checkout error:', error)
      alert('Failed to open checkout: ' + error.message)
      setCheckoutLoading(false)
    }
  }

  // Show trial expired message
  const trialExpired = !isActive && !isOnTrial

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">ContractKit</h1>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Trial Expired Banner */}
      {trialExpired && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold">30-Day Trial Expired</p>
                  <p className="text-sm opacity-90">
                    Subscribe now to continue creating contracts
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="px-6 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg disabled:opacity-50"
              >
                {checkoutLoading ? 'Loading...' : 'Subscribe Now - $19/mo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Trial Banner */}
      {!subLoading && isOnTrial && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-semibold">30-Day Free Trial Active</p>
                  <p className="text-sm opacity-90">
                    {trialDaysRemaining} days remaining • Enjoy unlimited access
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg disabled:opacity-50"
              >
                {checkoutLoading ? 'Loading...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1 font-medium">Total Contracts</div>
            <div className="text-4xl font-bold text-gray-900">{contracts.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1 font-medium">Active Projects</div>
            <div className="text-4xl font-bold text-gray-900">
              {contracts.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1 font-medium">Total Revenue</div>
            <div className="text-4xl font-bold text-green-600">
              ${contracts.reduce((sum, c) => sum + (parseFloat(c.total_fee) || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Create Contract Button - Locked if trial expired */}
        <div className="mb-6">
          {trialExpired ? (
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl"
            >
              🔒 Subscribe to Create Contracts
            </button>
          ) : (
            <button
              onClick={() => navigate('/contracts/new')}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              + Create New Contract
            </button>
          )}
        </div>

        {/* Contracts List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Contracts</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-7xl mb-4">📄</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">No contracts yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Create your first contract to get started protecting your work</p>
              {!trialExpired && (
                <button
                  onClick={() => navigate('/contracts/new')}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
                >
                  Create Your First Contract
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <div key={contract.id} className="p-6 hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">{contract.project_title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{contract.client_name}</p>
                      <div className="flex gap-6 text-sm text-gray-500">
                        <span className="font-medium text-green-600">
                          ${parseFloat(contract.total_fee).toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>{new Date(contract.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        contract.status === 'active' ? 'bg-green-100 text-green-800' :
                        contract.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
