import { Link } from 'react-router-dom'
import { Logo, Container } from '@/components'
import { useAuth } from '@/context/AuthContext'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export function MarketingNavbar() {
  const { user, loading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Logo />

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/pricing"
              className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm hidden sm:block"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm hidden sm:block"
            >
              About
            </Link>

            {loading ? (
              <div className="w-20 h-9 bg-slate-100 animate-pulse rounded-lg" />
            ) : user ? (
              <>
                <Link
                  to="/app"
                  className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-[var(--green)] text-white hover:bg-[var(--green-dark)] transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export function MarketingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      <Container>
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo variant="light" linkTo="/" />
            <p className="mt-4 text-slate-400 text-sm">
              Never miss a drawing change again. Compare revisions instantly.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><a href="/#demo" className="text-slate-400 hover:text-white transition-colors">Demo</a></li>
              <li><Link to="/signup" className="text-slate-400 hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Varix Intelligence Ltd. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            London, UK
          </p>
        </div>
      </Container>
    </footer>
  )
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-grow">{children}</main>
      <MarketingFooter />
    </div>
  )
}
