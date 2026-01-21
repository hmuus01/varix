import { Link } from 'react-router-dom'
import { Navbar, Container, Section, Card, Logo } from '@/components'

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
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-red-600 font-bold text-sm">!</span>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
        <p className="text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  )
}

function Step({ number, title }: { number: number; title: string }) {
  return (
    <Card className="text-center" padding="lg">
      <div className="w-14 h-14 bg-[var(--green)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </Card>
  )
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <Card padding="lg" className="flex flex-col h-full">
      <blockquote className="text-slate-700 text-lg leading-relaxed flex-grow">
        "{quote}"
      </blockquote>
      <p className="mt-6 font-semibold text-slate-900 text-sm">— {author}</p>
    </Card>
  )
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <svg className="w-5 h-5 text-[var(--green)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-slate-700">{children}</span>
    </li>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

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
                Upload drawings
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center text-lg font-semibold px-8 py-4 rounded-xl border-2 border-slate-300 text-slate-700 hover:border-[var(--green)] hover:text-[var(--green)] transition-colors"
              >
                See demo ↓
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-500 font-medium">
              Only 6 of 15 founder spots left
            </p>
          </div>
        </Container>
      </Section>

      {/* Pain Points */}
      <Section background="white" padding="md">
        <Container size="md">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Drawing revisions are where margin disappears
          </h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <PainPoint
              title="Missed changes"
              description="Rev 114 → Rev 121 had 63 changes. 4 were claimable."
            />
            <PainPoint
              title="Notice periods expire"
              description="Entitlement gone before you see it."
            />
            <PainPoint
              title="Changes hidden as coordination"
              description="Work done, never claimed."
            />
            <PainPoint
              title="1–4% lost"
              description="£100k–£400k on a £10M package."
            />
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section background="slate" padding="lg">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Three clicks
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <Step number={1} title="Upload your revisions" />
            <Step number={2} title="See every change" />
            <Step number={3} title="Export & claim" />
          </div>
        </Container>
      </Section>

      {/* Demo */}
      <Section id="demo" background="white" padding="lg">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
            30-second demo
          </h2>

          <div className="aspect-video max-w-4xl mx-auto bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center">
            <p className="text-slate-500 font-medium">Demo video here</p>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section background="slate" padding="lg">
        <Container size="md">
          <div className="grid sm:grid-cols-2 gap-6">
            <Testimonial
              quote="Found a £27k ceiling grid change we'd completely missed. Would've cost us at final account."
              author="Commercial Manager, Drylining subcontractor"
            />
            <Testimonial
              quote="Spotted 7 claimable variations in week one. We'd have never picked them up from the revision pack."
              author="QS, M&E contractor"
            />
            <Testimonial
              quote="Revised drawings for a unit merge — extra drywall, doors, heating. Would've taken hours manually. This did it in seconds."
              author="Commercial QS on major residential works"
            />
            <Testimonial
              quote="Dropped a flooring variation by £30k after catching an over-allowance from layout changes. Paid for itself instantly."
              author="Senior QS working across £100M+ projects"
            />
          </div>
        </Container>
      </Section>

      {/* Pricing */}
      <Section id="pricing" background="white" padding="lg">
        <Container size="sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
            Simple pricing
          </h2>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center">
            <div className="text-5xl sm:text-6xl font-extrabold text-[var(--green)] mb-2">
              £399<span className="text-xl sm:text-2xl font-semibold text-slate-500">/month</span>
            </div>

            <ul className="text-left space-y-4 my-8 max-w-xs mx-auto">
              <PricingFeature>Unlimited comparisons</PricingFeature>
              <PricingFeature>Unlimited team members</PricingFeature>
              <PricingFeature>PDF, DWG, image support</PricingFeature>
              <PricingFeature>Excel + PDF export</PricingFeature>
            </ul>

            <Link
              to="/signup"
              className="block w-full text-center text-lg sm:text-xl font-semibold px-8 py-4 rounded-xl bg-[var(--green)] text-white hover:bg-[var(--green-dark)] transition-all hover:shadow-lg"
            >
              Start free trial — no card required
            </Link>

            <p className="mt-4 text-sm text-slate-600">
              Founder access includes higher limits and early features.
            </p>

            <p className="mt-2 text-sm text-slate-500 font-medium">
              Only 6 of 15 founder spots left
            </p>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section background="dark" padding="sm">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Logo variant="light" linkTo={undefined} />
              <span className="font-semibold text-white">Varix Intelligence</span>
            </div>
            <p className="text-sm text-slate-400">
              © 2025 Varix Intelligence Ltd · London
            </p>
          </div>
        </Container>
      </Section>
    </div>
  )
}
