import { useEffect } from 'react'
import { Container, Section } from '@/components'
import MarketingLayout from '@/components/MarketingLayout'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Varix'
  }, [])

  return (
    <MarketingLayout>
      <Section background="white" padding="lg">
        <Container size="md">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 mb-8">
              Last updated: January 2025
            </p>

            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Introduction</h2>
              <p className="text-slate-600 mb-4">
                Varix Intelligence Ltd ("Varix", "we", "us", or "our") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you use our drawing comparison service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Information We Collect</h2>
              <p className="text-slate-600 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Account information (name, email, company name)</li>
                <li>Drawing files you upload for comparison</li>
                <li>Usage data and analytics</li>
                <li>Communications with our support team</li>
              </ul>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your drawing comparisons</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-slate-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. Your
                drawing files are encrypted in transit and at rest.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Data Retention</h2>
              <p className="text-slate-600 mb-4">
                We retain your information for as long as your account is active or as needed to provide
                you services. You can request deletion of your data at any time by contacting us.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">
                Under GDPR and UK data protection laws, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-slate-600">
                <strong>Email:</strong> privacy@varix.io<br />
                <strong>Address:</strong> Varix Intelligence Ltd, London, UK
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </MarketingLayout>
  )
}
