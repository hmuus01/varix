import { useEffect } from 'react'
import { Container, Section } from '@/components'
import MarketingLayout from '@/components/MarketingLayout'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service | Varix'
  }, [])

  return (
    <MarketingLayout>
      <Section background="white" padding="lg">
        <Container size="md">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-500 mb-8">
              Last updated: January 2025
            </p>

            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-600 mb-4">
                By accessing or using the Varix service, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-slate-600 mb-4">
                Varix provides a cloud-based drawing comparison service that allows users to upload
                drawing revisions and identify changes between versions. The service is provided
                "as is" and "as available."
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. User Accounts</h2>
              <p className="text-slate-600 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account. You agree to notify us
                immediately of any unauthorized use.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Acceptable Use</h2>
              <p className="text-slate-600 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Upload content that infringes on intellectual property rights</li>
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
              </ul>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Intellectual Property</h2>
              <p className="text-slate-600 mb-4">
                You retain all rights to the drawings and content you upload. By uploading content,
                you grant us a limited license to process your files for the purpose of providing
                the comparison service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Payment Terms</h2>
              <p className="text-slate-600 mb-4">
                Subscription fees are billed monthly in advance. You may cancel your subscription
                at any time, and you will continue to have access until the end of your billing period.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="text-slate-600 mb-4">
                To the maximum extent permitted by law, Varix shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages resulting from your use of
                or inability to use the service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">8. Changes to Terms</h2>
              <p className="text-slate-600 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of
                material changes via email or through the service. Continued use after changes
                constitutes acceptance.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">9. Governing Law</h2>
              <p className="text-slate-600 mb-4">
                These terms are governed by the laws of England and Wales. Any disputes shall be
                subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">10. Contact</h2>
              <p className="text-slate-600">
                For questions about these Terms, contact us at legal@varix.io
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </MarketingLayout>
  )
}
