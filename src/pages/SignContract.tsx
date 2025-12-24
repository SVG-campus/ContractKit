import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function SignContract() {
  const { contractId } = useParams()
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Signature form
  const [clientName, setClientName] = useState('')
  const [signatureText, setSignatureText] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [ipAddress, setIpAddress] = useState('')

  useEffect(() => {
    loadContract()
    getIPAddress()
  }, [contractId])

  async function getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIpAddress(data.ip)
    } catch (error) {
      console.error('Error getting IP:', error)
    }
  }

  async function loadContract() {
    try {
      if (!contractId) {
        setError('Invalid contract link')
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

      if (fetchError) throw fetchError

      if (!data) {
        setError('Contract not found')
        setLoading(false)
        return
      }

      if (data.status === 'signed') {
        setError('This contract has already been signed')
        setLoading(false)
        return
      }

      setContract(data)
      setClientName(data.client_name)
    } catch (err: any) {
      setError(err.message || 'Failed to load contract')
    } finally {
      setLoading(false)
    }
  }

  async function handleSign() {
    if (!contract) return

    if (!clientName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!signatureText.trim()) {
      setError('Please type your name to sign')
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms to continue')
      return
    }

    setSigning(true)
    setError('')

    try {
      const signedAt = new Date().toISOString()

      // Update contract with signature
      const { error: updateError } = await supabase
        .from('contracts')
        .update({
          status: 'signed',
          client_signature: signatureText,
          client_signed_at: signedAt,
          client_ip_address: ipAddress,
        })
        .eq('id', contractId)

      if (updateError) throw updateError

      // Create signature record
      await supabase.from('contract_signatures').insert({
        contract_id: contractId,
        signer_name: clientName,
        signer_email: contract.client_email,
        signature_text: signatureText,
        ip_address: ipAddress,
        user_agent: navigator.userAgent,
      })

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: contract.user_id,
        contract_id: contractId,
        action: 'contract_signed',
        details: {
          signer: clientName,
          signed_at: signedAt,
          ip: ipAddress,
        },
      })

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to sign contract')
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    )
  }

  if (error && !contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Contract</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Please contact the sender if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Signed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for signing the contract. Both parties will receive a copy via email.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-green-900 mb-3">✨ What happens next?</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>You'll receive a confirmation email with a copy of the signed contract</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📄</span>
                <span>The designer will be notified and work will begin as outlined</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💼</span>
                <span>Keep this contract for your records</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Contract Number:</span>
                <p className="font-semibold text-gray-900">{contract.contract_number}</p>
              </div>
              <div>
                <span className="text-gray-600">Signed Date:</span>
                <p className="font-semibold text-gray-900">
                  {format(new Date(), 'MMM dd, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Project:</span>
                <p className="font-semibold text-gray-900">{contract.project_name}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <p className="font-semibold text-gray-900">
                  ${parseFloat(contract.total_amount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {contract.pdf_url && (
            <div className="mt-6 text-center">
              <a
                href={contract.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                📥 Download Signed Contract
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">📄</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                ContractKit
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Review & Sign Contract
            </h1>
            <p className="text-gray-600">
              Please review the contract details below and sign to proceed
            </p>
          </div>

          {/* Contract Details */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Contract Number</h3>
                <p className="text-lg font-bold text-gray-900">{contract.contract_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Effective Date</h3>
                <p className="text-lg font-bold text-gray-900">
                  {format(new Date(contract.effective_date), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Name</h3>
                <p className="text-lg font-bold text-gray-900">{contract.project_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Amount</h3>
                <p className="text-lg font-bold text-green-600">
                  ${parseFloat(contract.total_amount).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Scope of Work</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{contract.scope_of_work}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Deliverables</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{contract.deliverables}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Timeline</h3>
                  <p className="text-gray-700">{contract.timeline}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Schedule</h3>
                  <p className="text-gray-700">{contract.payment_schedule}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Revisions Included</h3>
                <p className="text-gray-700">{contract.revisions_included} rounds of revisions</p>
              </div>
            </div>
          </div>

          {/* PDF Download */}
          {contract.pdf_url && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <a
                href={contract.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                📄 View Full Contract PDF
              </a>
            </div>
          )}
        </div>

        {/* Signature Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✍️ Sign Contract</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                placeholder="Enter your full legal name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Your Name to Sign *
              </label>
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-2xl font-signature text-center"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                placeholder="Your signature"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                This will serve as your electronic signature
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  required
                />
                <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer">
                  <span className="font-semibold">I agree to the terms and conditions</span> outlined in this contract.
                  By signing, I acknowledge that I have read, understood, and agree to be bound by all terms
                  of this agreement. This electronic signature is legally binding.
                </label>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600">
              <p className="mb-2">📌 <strong>Legal Notice:</strong></p>
              <p>
                By clicking "Sign Contract", you agree that your electronic signature is the legal equivalent
                of your manual signature on this contract. This signature is secured with your IP address
                ({ipAddress}) and timestamp for authenticity.
              </p>
            </div>

            <button
              onClick={handleSign}
              disabled={signing || !clientName || !signatureText || !agreedToTerms}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 shadow-lg"
            >
              {signing ? '✍️ Signing Contract...' : '✍️ Sign Contract'}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 This signature process is secure and legally binding</p>
        </div>
      </div>
    </div>
  )
}
