import { useEffect, useState } from 'react'
import { Container, Section, Card, Input, Button } from '@/components'
import MarketingLayout from '@/components/MarketingLayout'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Contact Us | Varix'
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to an API
    setSubmitted(true)
  }

  return (
    <MarketingLayout>
      <Section background="white" padding="lg">
        <Container size="sm">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Get in touch
            </h1>
            <p className="text-xl text-slate-600">
              Have questions about Varix? We'd love to hear from you.
            </p>
          </div>

          <Card padding="lg">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Message sent!
                </h2>
                <p className="text-slate-600">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="First name"
                    type="text"
                    placeholder="John"
                    required
                  />
                  <Input
                    label="Last name"
                    type="text"
                    placeholder="Smith"
                    required
                  />
                </div>

                <Input
                  label="Work email"
                  type="email"
                  placeholder="john@company.com"
                  required
                />

                <Input
                  label="Company"
                  type="text"
                  placeholder="Your company name"
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help?"
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[var(--green)] focus:ring-[var(--green)]/20 resize-none"
                  />
                </div>

                <Button type="submit" fullWidth size="lg">
                  Send message
                </Button>
              </form>
            )}
          </Card>

          {/* Alternative contact */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-2">
              Prefer email?
            </p>
            <a
              href="mailto:hello@varix.io"
              className="text-[var(--green)] font-semibold hover:underline"
            >
              hello@varix.io
            </a>
          </div>
        </Container>
      </Section>
    </MarketingLayout>
  )
}
