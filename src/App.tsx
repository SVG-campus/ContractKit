import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Landing />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to ContractKit!</h1>
        <p className="mt-4">Logged in as: {user.email}</p>
        <button 
          onClick={async () => {
            const { signOut } = await import('./lib/supabase')
            signOut()
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default App
