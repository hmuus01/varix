import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Section, Card, Button } from '@/components'
import MarketingLayout from '@/components/MarketingLayout'

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-[var(--green)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Pricing() {
  useEffect(() => {
    document.title = 'Pricing | Varix - Drawing Revision Comparison'
  }, [])

  return (
    <MarketingLayout>
      {/* Hero */}
      <Section background="white" padding="lg">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              One plan, everything included. No hidden fees, no per-user charges.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pricing Card */}
      <Section background="slate" padding="lg">
        <Container size="sm">
          <Card padding="lg" className="border-2 border-[var(--green)] shadow-xl">
            <div className="text-center mb-8">
              <span className="inline-block bg-emerald-50 text-[var(--green)] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
                Founder Pricing
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-2">
                £399<span className="text-xl sm:text-2xl font-semibold text-slate-500">/month</span>
              </div>
              <p className="text-slate-600">
                Limited to first 15 customers
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Unlimited drawing comparisons',
                'Unlimited team members',
                'PDF, DWG, and image support',
                'Excel and PDF export',
                'Priority email support',
                'Early access to new features',
                'No long-term commitment',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/signup" className="block">
              <Button fullWidth size="lg">
                Start free trial — no card required
              </Button>
            </Link>

            <p className="text-center text-sm text-slate-500 mt-4">
              14-day free trial. Cancel anytime.
            </p>
          </Card>

          {/* FAQ Teaser */}
          <div className="mt-12 text-center">
            <p className="text-slate-600">
              Questions? <Link to="/contact" className="text-[var(--green)] font-semibold hover:underline">Get in touch</Link>
            </p>
          </div>
        </Container>
      </Section>

      {/* Comparison Table */}
      <Section background="white" padding="lg">
        <Container size="md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Why Varix?
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Save hours weekly</h3>
              <p className="text-slate-600 text-sm">Stop manually comparing drawings. Get results in seconds.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Recover lost revenue</h3>
              <p className="text-slate-600 text-sm">Catch every claimable variation before deadlines pass.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Reduce risk</h3>
              <p className="text-slate-600 text-sm">Document every change for bulletproof audit trails.</p>
            </div>
          </div>
        </Container>
      </Section>
    </MarketingLayout>
  )
}
