import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Section, Button } from '@/components'
import MarketingLayout from '@/components/MarketingLayout'

export default function About() {
  useEffect(() => {
    document.title = 'About Us | Varix - Drawing Revision Comparison'
  }, [])

  return (
    <MarketingLayout>
      {/* Hero */}
      <Section background="white" padding="lg">
        <Container size="md">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Built for construction professionals
            </h1>
            <p className="text-xl text-slate-600">
              Varix was born from the frustration of manually comparing drawing revisions
              and watching recoverable margin slip through the cracks.
            </p>
          </div>
        </Container>
      </Section>

      {/* Story */}
      <Section background="slate" padding="lg">
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                Our mission
              </h2>
              <p className="text-slate-600 mb-4">
                Every construction project generates hundreds of drawing revisions. Hidden in those
                changes are variations worth thousands—sometimes millions—in recoverable costs.
              </p>
              <p className="text-slate-600 mb-4">
                The problem? Manual comparison is slow, error-prone, and often skipped under
                time pressure. By the time issues surface, notice periods have expired.
              </p>
              <p className="text-slate-600">
                Varix automates the comparison process, highlighting every change in seconds.
                No more missed variations. No more lost margin.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <div className="text-5xl font-extrabold text-[var(--green)] mb-4">1-4%</div>
              <p className="text-slate-600">
                The typical margin lost to unidentified drawing changes on major projects.
                On a £10M package, that's £100k–£400k walking out the door.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section background="white" padding="lg">
        <Container size="md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            What we believe
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Speed matters</h3>
              <p className="text-slate-600 text-sm">
                If a tool slows you down, it won't get used. Varix works in seconds, not hours.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Clarity over complexity</h3>
              <p className="text-slate-600 text-sm">
                Changes should be obvious at a glance. We obsess over making results clear and actionable.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Your data is yours</h3>
              <p className="text-slate-600 text-sm">
                Drawings contain sensitive project information. We treat security as non-negotiable.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="slate" padding="lg">
        <Container size="sm">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Ready to stop losing margin?
            </h2>
            <p className="text-slate-600 mb-8">
              Join the construction teams already using Varix to catch every change.
            </p>
            <Link to="/signup">
              <Button size="lg">Start free trial</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </MarketingLayout>
  )
}
