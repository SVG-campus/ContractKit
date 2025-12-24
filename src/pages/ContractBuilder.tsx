import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function ContractBuilder() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Client info
    client_name: '',
    client_email: '',
    client_business: '',
    
    // Project details
    project_title: '',
    project_description: '',
    deliverables: '',
    
    // Financial
    total_fee: '',
    payment_schedule: 'Net 30',
    
    // Timeline
    start_date: '',
    completion_date: '',
    
    // Legal
    state: 'CA',
  })

  function updateField(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('contracts')
        .insert({
          user_id: user?.id,
          state: formData.state,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_business: formData.client_business,
          project_title: formData.project_title,
          project_description: formData.project_description,
          deliverables: formData.deliverables.split('\n').filter(d => d.trim()),
          total_fee: parseFloat(formData.total_fee),
          payment_schedule: formData.payment_schedule,
          start_date: formData.start_date,
          completion_date: formData.completion_date,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      alert('Contract created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Error creating contract:', error)
      alert('Error creating contract: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-bold">Create New Contract</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-gray-600">
              {step === 1 ? 'Client Info' : step === 2 ? 'Project Details' : 'Review'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Step 1: Client Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Client Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => updateField('client_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Client Email *</label>
                <input
                  type="email"
                  required
                  value={formData.client_email}
                  onChange={(e) => updateField('client_email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Client Business (Optional)</label>
                <input
                  type="text"
                  value={formData.client_business}
                  onChange={(e) => updateField('client_business', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Project Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.project_title}
                  onChange={(e) => updateField('project_title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Website Redesign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Description *</label>
                <textarea
                  required
                  value={formData.project_description}
                  onChange={(e) => updateField('project_description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe the project scope..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deliverables (one per line) *</label>
                <textarea
                  required
                  value={formData.deliverables}
                  onChange={(e) => updateField('deliverables', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Home page design&#10;Logo variations&#10;Brand guidelines"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Fee *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.total_fee}
                      onChange={(e) => updateField('total_fee', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="5000.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Terms *</label>
                  <select
                    value={formData.payment_schedule}
                    onChange={(e) => updateField('payment_schedule', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="50% upfront, 50% on completion">50/50 Split</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Completion Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.completion_date}
                    onChange={(e) => updateField('completion_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Review & Create</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Client</h3>
                  <p>{formData.client_name}</p>
                  <p className="text-sm text-gray-600">{formData.client_email}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Project</h3>
                  <p>{formData.project_title}</p>
                  <p className="text-sm text-gray-600">{formData.project_description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Fee & Timeline</h3>
                  <p>${parseFloat(formData.total_fee || '0').toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {formData.start_date} to {formData.completion_date}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🎉 Your contract will be generated with state-specific terms for <strong>{formData.state}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                ← Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Contract'}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
