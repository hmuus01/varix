import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Button, Input, Card, Logo } from '@/components'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      console.error('Login failed:', error.message, error)
      setError(error.message)
      return
    }

    navigate('/app')
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
              Welcome back
            </h1>
            <p className="text-slate-600 mt-2">
              Log in to your Varix account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="Enter your password"
              required
              autoComplete="current-password"
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

            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-[var(--green)] font-semibold hover:underline focus:outline-none focus:underline"
            >
              Sign up
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
