import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button } from '@/components'
import MarketingLayout from '@/components/MarketingLayout'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | Varix'
  }, [])

  return (
    <MarketingLayout>
      <section className="py-20 sm:py-32">
        <Container size="sm">
          <div className="text-center">
            <p className="text-[var(--green)] font-bold text-lg mb-4">404</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Page not found
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg">Go home</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg">Contact support</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </MarketingLayout>
  )
}
