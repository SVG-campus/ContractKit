import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { generateContractPDF } from '../lib/pdf/contractPDF'
import { uploadContractPDF } from '../lib/storage/pdfStorage'

export default function NewContract() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [scopeOfWork, setScopeOfWork] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [timeline, setTimeline] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [revisionsIncluded, setRevisionsIncluded] = useState('2')
  const [paymentSchedule, setPaymentSchedule] = useState('50% upfront, 50% on completion')
  const [governingState, setGoverningState] = useState('Wyoming')
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user) throw new Error('Not authenticated')

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error('Profile not found')

      // Generate contract number
      const contractNumber = `CNT-${Date.now()}`

      // Create contract in database
      const { data: contract, error: insertError } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          contract_number: contractNumber,
          client_name: clientName,
          client_email: clientEmail,
          client_company: clientCompany || null,
          project_name: projectName,
          project_description: projectDescription,
          scope_of_work: scopeOfWork,
          deliverables: deliverables,
          timeline: timeline,
          total_amount: parseFloat(totalAmount),
          revisions_included: parseInt(revisionsIncluded),
          payment_schedule: paymentSchedule,
          governing_state: governingState,
          effective_date: effectiveDate,
          status: 'draft',
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Generate PDF
      const pdfBlob = await generateContractPDF({
        contractNumber,
        effectiveDate,
        contractorName: profile.full_name,
        contractorEmail: user.email!,
        contractorAddress: profile.address || '',
        clientName,
        clientEmail,
        clientCompany: clientCompany || '',
        projectName,
        projectDescription,
        scopeOfWork,
        deliverables,
        timeline,
        totalAmount: parseFloat(totalAmount),
        revisionsIncluded: parseInt(revisionsIncluded),
        paymentSchedule,
        governingState,
      })

      // Upload PDF to storage
      await uploadContractPDF(contract.id, pdfBlob, contractNumber)

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        contract_id: contract.id,
        action: 'contract_created',
        details: {
          contract_number: contractNumber,
          client: clientName,
          project: projectName,
          amount: parseFloat(totalAmount),
        },
      })

      alert('✅ Contract created successfully!')
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Error creating contract:', err)
      setError(err.message || 'Failed to create contract')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Design Contract
          </h1>
          <p className="text-gray-600">
            Generate a professional, legally-binding contract
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Client Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Client Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Project Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brand Identity Design"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief overview of the project..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope of Work *
                </label>
                <textarea
                  value={scopeOfWork}
                  onChange={(e) => setScopeOfWork(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Be specific about what's included and what's not to avoid scope creep"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deliverables *
                </label>
                <textarea
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="List all files and assets the client will receive..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 4-6 weeks from deposit"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Terms */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Financial Terms</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Project Fee *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revisions Included *
                </label>
                <input
                  type="number"
                  value={revisionsIncluded}
                  onChange={(e) => setRevisionsIncluded(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="2"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of revision rounds included in the project fee
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Schedule *
                </label>
                <input
                  type="text"
                  value={paymentSchedule}
                  onChange={(e) => setPaymentSchedule(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="50% upfront, 50% on completion"
                  required
                />
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚖️ Legal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Governing State *
                </label>
                <select
                  value={governingState}
                  onChange={(e) => setGoverningState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  State laws that will govern this contract
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effective Date *
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contract Terms Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Contract Terms Included</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Intellectual Property Rights</li>
                  <li>• Termination Clause</li>
                  <li>• Kill Fee (50% of remaining balance)</li>
                  <li>• Confidentiality Agreement</li>
                  <li>• Timeline and Revision Terms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 shadow-lg"
            >
              {loading ? '⏳ Generating Contract...' : 'Generate & Download Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
