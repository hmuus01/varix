import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import SignUp from '@/pages/SignUp'
import Login from '@/pages/Login'
import ProtectedApp from '@/pages/ProtectedApp'
import NotFound from '@/pages/NotFound'
import Pricing from '@/pages/Pricing'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import Upload from '@/pages/Upload'
import { ProtectedRoute, AuthRoute } from '@/components'
import { isMissingEnvVars, isInvalidAnonKey } from '@/lib/supabaseClient'

function EnvConfigError({ type }: { type: 'missing' | 'invalid' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg text-center border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {type === 'missing' ? 'Missing Environment Variables' : 'Invalid Supabase Configuration'}
        </h1>

        {type === 'missing' ? (
          <>
            <p className="text-slate-600 mb-6">
              The following environment variables are required to connect to Supabase:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-left mb-6">
              <p className="text-red-600">VITE_SUPABASE_URL</p>
              <p className="text-red-600">VITE_SUPABASE_ANON_KEY</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-600 mb-6">
              The <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">VITE_SUPABASE_ANON_KEY</code> appears to be invalid.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-left mb-6">
              <p className="text-amber-800 text-sm font-medium mb-2">How to fix:</p>
              <ol className="text-amber-700 text-sm space-y-2 list-decimal list-inside">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                <li>Select your project → Settings → API</li>
                <li>Copy the <strong>anon/public</strong> key or <strong>publishable</strong> key</li>
                <li>Update your <code className="bg-amber-100 px-1 rounded">.env.local</code> file</li>
              </ol>
            </div>
          </>
        )}

        <p className="text-slate-500 text-sm">
          Add these to your <code className="bg-slate-100 px-1.5 py-0.5 rounded">.env.local</code> file and restart the dev server.
        </p>
      </div>
    </div>
  )
}

function App() {
  if (isMissingEnvVars) {
    return <EnvConfigError type="missing" />
  }

  if (isInvalidAnonKey) {
    return <EnvConfigError type="invalid" />
  }

  return (
    <Router>
      <Routes>
        {/* Marketing pages */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Auth pages - redirect to /app if already logged in */}
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />

        {/* App pages - require authentication */}
        <Route path="/app" element={<ProtectedRoute><ProtectedApp /></ProtectedRoute>} />
        <Route path="/app/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
