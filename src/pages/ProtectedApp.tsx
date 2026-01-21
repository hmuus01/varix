import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { Navbar, Container, Card, Button, Spinner } from '@/components'

export default function ProtectedApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" className="text-[var(--green)]" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="app" user={user} onLogout={handleLogout} loading={loggingOut} />

      <main className="py-8 sm:py-12">
        <Container>
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome to Varix
            </h1>
            <p className="text-slate-600 mt-1">
              Never miss a drawing change again.
            </p>
          </div>

          {/* Main Action Card */}
          <Card padding="lg" className="mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="flex-shrink-0 w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-xl font-semibold text-slate-900">
                  Create a comparison set
                </h2>
                <p className="text-slate-600 mt-1">
                  Upload one or more drawing revisions and let Varix highlight every change across versions.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button size="lg">
                  Upload drawings
                </Button>
              </div>
            </div>
          </Card>

          {/* Empty State / Recent Comparisons */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Empty state cards */}
            <Card padding="md" className="border-dashed border-2 border-slate-300 bg-slate-50/50">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">No comparisons yet</p>
                <p className="text-sm text-slate-400 mt-1">Upload your first drawing set</p>
              </div>
            </Card>

            <Card padding="md" className="border-dashed border-2 border-slate-300 bg-slate-50/50 hidden sm:block">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">Add more drawings</p>
                <p className="text-sm text-slate-400 mt-1">Compare multiple revisions</p>
              </div>
            </Card>

            <Card padding="md" className="border-dashed border-2 border-slate-300 bg-slate-50/50 hidden lg:block">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">Track changes</p>
                <p className="text-sm text-slate-400 mt-1">Export and claim variations</p>
              </div>
            </Card>
          </div>

          {/* Quick Tips Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick tips</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--green)] font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Upload PDFs or DWGs</p>
                  <p className="text-xs text-slate-500 mt-0.5">We support all major formats</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--green)] font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Review highlighted changes</p>
                  <p className="text-xs text-slate-500 mt-0.5">Every difference is marked</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--green)] font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Export your report</p>
                  <p className="text-xs text-slate-500 mt-0.5">PDF or Excel format</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
