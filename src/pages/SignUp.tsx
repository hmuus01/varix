import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, formatAuthError } from '@/lib/supabaseClient'
import { Button, Input, Card, Logo } from '@/components'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Sign Up | Varix'
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error('Sign up failed:', error.message, error)
        setError(formatAuthError(error))
        return
      }

      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists. Please log in instead.')
        return
      }

      // Email confirmation required
      if (data.user && !data.session) {
        setSuccess(true)
      } else if (data.session) {
        // Auto-confirmed, redirect to app
        navigate('/app')
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError(formatAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Logo />
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md" padding="lg">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Check your email
              </h1>
              <p className="text-slate-600 mb-6">
                We've sent a confirmation link to <strong className="text-slate-900">{email}</strong>.
                Please click the link to activate your account.
              </p>
              <p className="text-sm text-slate-500">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-[var(--green)] font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <>
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
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3"
                    role="alert"
                  >
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
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
            </>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-slate-500">
        © 2025 Varix Intelligence Ltd
      </footer>
    </div>
  )
}
