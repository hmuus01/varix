import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import SignUp from '@/pages/SignUp'
import Login from '@/pages/Login'
import ProtectedApp from '@/pages/ProtectedApp'
import { isMissingEnvVars } from '@/lib/supabaseClient'

function MissingEnvError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Missing Environment Variables</h1>
        <p className="text-gray-700 mb-4">
          The following Supabase environment variables are required:
        </p>
        <ul className="text-left bg-gray-100 p-4 rounded font-mono text-sm mb-4">
          <li className="text-red-600">VITE_SUPABASE_URL</li>
          <li className="text-red-600">VITE_SUPABASE_ANON_KEY</li>
        </ul>
        <p className="text-gray-600 text-sm">
          Please add these to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file.
        </p>
      </div>
    </div>
  )
}

function App() {
  if (isMissingEnvVars) {
    return <MissingEnvError />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<ProtectedApp />} />
      </Routes>
    </Router>
  )
}

export default App
