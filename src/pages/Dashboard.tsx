import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { format } from 'date-fns'
import { downloadPDF } from '../lib/storage/pdfStorage'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [contracts, setContracts] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contracts' | 'invoices'>('contracts')
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  async function loadData() {
    try {
      // Load subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()
      
      setSubscription(subData)

      // Load contracts
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      setContracts(contractsData || [])

      // Load invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      setInvoices(invoicesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'sent': return 'bg-blue-100 text-blue-700'
      case 'signed': return 'bg-green-100 text-green-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      case 'cancelled': return 'bg-gray-100 text-gray-500'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📄</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                ContractKit
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  {subscription?.plan_type === 'pro' ? '✨ Pro Member' : '🆓 Free Trial'}
                </p>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Manage your contracts and invoices in one place
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/new-contract')}
            className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition group"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">📄</div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Create Contract</h3>
                <p className="text-indigo-100 text-sm">
                  Generate a professional design contract
                </p>
              </div>
              <div className="ml-auto text-3xl group-hover:translate-x-2 transition">
                →
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/create-invoice')}
            className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition group"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">💰</div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Create Invoice</h3>
                <p className="text-green-100 text-sm">
                  Send a professional invoice to your client
                </p>
              </div>
              <div className="ml-auto text-3xl group-hover:translate-x-2 transition">
                →
              </div>
            </div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Total Contracts</div>
            <div className="text-3xl font-bold text-gray-900">{contracts.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Total Invoices</div>
            <div className="text-3xl font-bold text-gray-900">{invoices.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Unpaid Invoices</div>
            <div className="text-3xl font-bold text-orange-600">
              {invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">
              ${invoices
                .filter(inv => inv.status === 'paid')
                .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0)
                .toFixed(0)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('contracts')}
                className={`py-4 px-2 font-medium border-b-2 transition ${
                  activeTab === 'contracts'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📄 Contracts ({contracts.length})
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-4 px-2 font-medium border-b-2 transition ${
                  activeTab === 'invoices'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                💰 Invoices ({invoices.length})
              </button>
            </div>
          </div>

          {/* Contracts Tab */}
          {activeTab === 'contracts' && (
            <div className="p-6">
              {contracts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No contracts yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first contract to get started
                  </p>
                  <button
                    onClick={() => navigate('/new-contract')}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Create Contract
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {contract.project_name}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                contract.status
                              )}`}
                            >
                              {contract.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Client: {contract.client_name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Contract #{contract.contract_number} • Created{' '}
                            {format(new Date(contract.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {contract.pdf_url && (
                            <button
                              onClick={() =>
                                downloadPDF(contract.pdf_url, `Contract-${contract.contract_number}.pdf`)
                              }
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                            >
                              Download PDF
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="p-6">
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No invoices yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first invoice to get started
                  </p>
                  <button
                    onClick={() => navigate('/create-invoice')}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                  >
                    Create Invoice
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              Invoice #{invoice.invoice_number}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              {invoice.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Client: {invoice.client_name} • ${parseFloat(invoice.total_amount).toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')} • Created{' '}
                            {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {invoice.pdf_url && (
                            <button
                              onClick={() =>
                                downloadPDF(invoice.pdf_url, `Invoice-${invoice.invoice_number}.pdf`)
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                            >
                              Download PDF
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
