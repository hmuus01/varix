import { Link } from 'react-router-dom'
import Logo from './Logo'
import Button from './Button'
import Container from './Container'

interface NavbarProps {
  variant?: 'marketing' | 'app'
  user?: { email?: string } | null
  onLogout?: () => void
  loading?: boolean
}

export default function Navbar({ variant = 'marketing', user, onLogout, loading }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Logo />

          {variant === 'marketing' ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="#pricing"
                className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block"
              >
                Pricing
              </a>
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-[var(--green)] text-white hover:bg-[var(--green-dark)] transition-colors"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              {user?.email && (
                <span className="text-sm text-slate-600 hidden sm:block truncate max-w-[200px]">
                  {user.email}
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={onLogout}
                loading={loading}
              >
                Log out
              </Button>
            </div>
          )}
        </nav>
      </Container>
    </header>
  )
}
