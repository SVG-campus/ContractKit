import { useState } from 'react'
import { signUp, signIn } from '../lib/supabase'

export default function LandingComplete() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [error, setError] = useState('')

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (mode === 'signup') {
        const result = await signUp(email, password)
        console.log('Signup success:', result)
      } else {
        const result = await signIn(email, password)
        console.log('Signin success:', result)
      }
      // Redirect happens automatically via useAuth
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          textAlign: 'center',
          color: '#667eea'
        }}>
          ContractKit
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '32px'
        }}>
          Professional contracts for designers
        </p>

        {/* Toggle Sign Up / Sign In */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px' 
        }}>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              background: mode === 'signup' ? '#667eea' : '#f3f4f6',
              color: mode === 'signup' ? 'white' : '#374151'
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              background: mode === 'signin' ? '#667eea' : '#f3f4f6',
              color: mode === 'signin' ? 'white' : '#374151'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ 
          marginTop: '24px',
          textAlign: 'center', 
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          {mode === 'signup' 
            ? '14-day free trial • No credit card required'
            : 'Forgot password? Contact support'}
        </p>
      </div>
    </div>
  )
}
