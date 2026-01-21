import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Button, Input, Card, Logo } from '@/components'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      console.error('Sign up failed:', error.message, error)
      setError(error.message)
      return
    }

    // Check if email confirmation is required
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError('This email is already registered. Please log in instead.')
      return
    }

    if (data.user && !data.session) {
      setMessage('Check your email to confirm your account before logging in.')
    } else if (data.session) {
      navigate('/app')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="p-4">
        <Logo />
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Create account
            </h1>
            <p className="text-slate-600 mt-2">
              Sign up to get started with Varix
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              helperText="Must be at least 6 characters"
              autoComplete="new-password"
              disabled={loading}
            />

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm"
                role="status"
              >
                {message}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--green)] font-semibold hover:underline focus:outline-none focus:underline"
            >
              Log in
            </Link>
          </p>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-slate-500">
        © 2025 Varix Intelligence Ltd
      </footer>
    </div>
  )
}
