import { useNavigate } from 'react-router-dom'

export default function Cancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 text-lg">
            No worries! You can subscribe anytime.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Your free trial is still active! Continue creating contracts and subscribe when you're ready.
          </p>
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">You still have access to:</p>
            <ul className="text-left space-y-1">
              <li>• 14-day free trial</li>
              <li>• All features unlocked</li>
              <li>• No credit card required</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
          >
            Try Again Later
          </button>
        </div>
      </div>
    </div>
  )
}
