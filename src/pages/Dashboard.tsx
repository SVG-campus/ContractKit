import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signOut } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ContractKit</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Contracts</div>
            <div className="text-3xl font-bold">{contracts.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Active Projects</div>
            <div className="text-3xl font-bold">
              {contracts.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold">
              ${contracts.reduce((sum, c) => sum + (parseFloat(c.total_fee) || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Create Contract Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/contracts/new')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            + Create New Contract
          </button>
        </div>

        {/* Contracts List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Contracts</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">No contracts yet</h3>
              <p className="text-gray-600 mb-6">Create your first contract to get started</p>
              <button
                onClick={() => navigate('/contracts/new')}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Create Contract
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <div key={contract.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{contract.project_title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{contract.client_name}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>${parseFloat(contract.total_fee).toLocaleString()}</span>
                        <span>•</span>
                        <span>{new Date(contract.created_at).toLocaleDateString()}</span>
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
