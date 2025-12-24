import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LandingComplete from './pages/LandingComplete'
import Dashboard from './pages/Dashboard'
import ContractBuilder from './pages/ContractBuilder'
import AuthCallback from './pages/AuthCallback'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading ContractKit...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user ? <LandingComplete /> : <Navigate to="/dashboard" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/contracts/new" element={user ? <ContractBuilder /> : <Navigate to="/" />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
