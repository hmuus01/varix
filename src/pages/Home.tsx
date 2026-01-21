import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Section, Card } from '@/components'
import { MarketingNavbar, MarketingFooter } from '@/components/MarketingLayout'

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-emerald-50 text-[var(--green)] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
      {children}
    </span>
  )
}

function PainPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
        <p className="text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <Card className="text-center relative" padding="lg">
      <div className="w-14 h-14 bg-[var(--green)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </Card>
  )
}

function Testimonial({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card padding="lg" className="flex flex-col h-full">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-slate-700 text-lg leading-relaxed flex-grow">
        "{quote}"
      </blockquote>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="font-semibold text-slate-900">{author}</p>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </Card>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-[var(--green)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-slate-200 pb-6">
      <h3 className="font-semibold text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </div>
  )
}

export default function Home() {
  useEffect(() => {
    document.title = 'Varix | Drawing Revision Comparison for Construction'
  }, [])

  return (
    <div className="min-h-screen">
      <MarketingNavbar />

      {/* Hero */}
      <Section background="white" padding="lg" className="pt-8 sm:pt-12">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Badge>V1 · Drawing comparison only · Early access</Badge>

            <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Compare drawing revisions.{' '}
              <span className="text-[var(--green)]">Capture every change.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload your drawings and instantly see what changed across revisions.
              Stop losing margin to missed variations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[var(--green)]">
                £399<span className="text-xl sm:text-2xl font-semibold text-slate-500">/month</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-300" />
              <p className="text-slate-600 font-medium">
                Founder pricing · First 15 customers only
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center text-lg font-semibold px-8 py-4 rounded-xl bg-[var(--green)] text-white hover:bg-[var(--green-dark)] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start free trial
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center text-lg font-semibold px-8 py-4 rounded-xl border-2 border-slate-300 text-slate-700 hover:border-[var(--green)] hover:text-[var(--green)] transition-colors"
              >
                See demo ↓
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-500 font-medium">
              No credit card required · 14-day free trial
            </p>
          </div>
        </Container>
      </Section>

      {/* Trust Badges */}
      <Section background="slate" padding="sm">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>UK-hosted data</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Encrypted files</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Results in seconds</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Pain Points */}
      <Section background="white" padding="lg">
        <Container size="md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
            Drawing revisions are where margin disappears
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Subcontractors lose 1-4% of project value to unidentified changes. That's £100k–£400k on a £10M package.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <PainPoint
              title="Missed changes"
              description="Rev 114 → Rev 121 had 63 changes. 4 were claimable variations worth £27k."
            />
            <PainPoint
              title="Notice periods expire"
              description="By the time you spot the change, your entitlement window has closed."
            />
            <PainPoint
              title="Changes hidden as 'coordination'"
              description="Scope creep disguised as minor adjustments. Work done, never claimed."
            />
            <PainPoint
              title="Manual comparison is too slow"
              description="Who has hours to overlay drawings? It gets skipped under time pressure."
            />
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section background="slate" padding="lg">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
            How it works
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
            Three steps. Under a minute. Every change highlighted.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <Step
              number={1}
              title="Upload your revisions"
              description="Drag and drop PDFs, DWGs, or images. We handle the rest."
            />
            <Step
              number={2}
              title="See every change"
              description="Additions, deletions, and modifications highlighted instantly."
            />
            <Step
              number={3}
              title="Export & claim"
              description="Download reports in PDF or Excel. Build your variation register."
            />
          </div>
        </Container>
      </Section>

      {/* Demo */}
      <Section id="demo" background="white" padding="lg">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
            See it in action
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-xl mx-auto">
            Watch how Varix catches changes you'd miss with manual review.
          </p>

          <div className="aspect-video max-w-4xl mx-auto bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Demo video coming soon</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section background="slate" padding="lg">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Trusted by construction professionals
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Testimonial
              quote="Found a £27k ceiling grid change we'd completely missed. Would've cost us at final account."
              author="James M."
              role="Commercial Manager, Drylining contractor"
            />
            <Testimonial
              quote="Spotted 7 claimable variations in week one. We'd have never picked them up from the revision pack."
              author="Sarah T."
              role="QS, M&E contractor"
            />
            <Testimonial
              quote="Dropped a flooring variation by £30k after catching an over-allowance from layout changes."
              author="Michael R."
              role="Senior QS, £100M+ projects"
            />
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section background="white" padding="lg">
        <Container size="md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            What you get
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Unlimited comparisons', desc: 'Compare as many drawings as you need' },
              { title: 'Unlimited team members', desc: 'Add your whole commercial team' },
              { title: 'PDF, DWG, image support', desc: 'All major drawing formats work' },
              { title: 'Excel & PDF export', desc: 'Reports ready for your variation register' },
              { title: 'Priority support', desc: 'Fast responses when you need help' },
              { title: 'Early feature access', desc: 'Be first to try new capabilities' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <CheckIcon />
                <div>
                  <p className="font-medium text-slate-900">{feature.title}</p>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="slate" padding="lg">
        <Container size="md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-6 max-w-2xl mx-auto">
            <FAQItem
              question="What file formats do you support?"
              answer="We support PDF, DWG, and common image formats (PNG, JPG, TIFF). More formats coming soon."
            />
            <FAQItem
              question="How accurate is the comparison?"
              answer="Our comparison engine detects pixel-level changes between revisions. You'll see additions in green, deletions in red, and modifications highlighted."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes. All files are encrypted in transit and at rest. We're UK-hosted and GDPR compliant. Your drawings are never shared or used for training."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely. No long-term contracts. Cancel anytime and you'll have access until the end of your billing period."
            />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section id="pricing" background="white" padding="lg">
        <Container size="sm">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Stop losing margin to missed changes
            </h2>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              Join construction teams already using Varix to catch every variation.
            </p>

            <div className="text-4xl sm:text-5xl font-extrabold mb-6">
              £399<span className="text-xl sm:text-2xl font-semibold text-slate-400">/month</span>
            </div>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center text-lg font-semibold px-8 py-4 rounded-xl bg-[var(--green)] text-white hover:bg-[var(--green-dark)] transition-all hover:shadow-lg"
            >
              Start free trial
            </Link>

            <p className="mt-4 text-sm text-slate-400">
              14-day free trial · No credit card required
            </p>
          </div>
        </Container>
      </Section>

      <MarketingFooter />
    </div>
  )
}
