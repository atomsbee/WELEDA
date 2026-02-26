import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | WELEDA Community Voting',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-weleda-bg">
      {/* Header */}
      <header className="bg-weleda-green py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Image src="/weleda-logo-white.svg" alt="WELEDA" width={120} height={34} className="w-28" />
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-weleda-card-border p-8 md:p-12">
          <h1 className="text-3xl font-bold text-weleda-dark mb-2">Privacy Policy</h1>
          <p className="text-weleda-muted text-sm mb-8 pb-8 border-b border-weleda-card-border">
            Last updated: February 2026
          </p>

          <div className="prose prose-sm max-w-none space-y-8">
            <Section title="1. Data Controller">
              <p className="text-weleda-muted">
                WELEDA AG<br />
                Möhlerstraße 3<br />
                73525 Schwäbisch Gmünd<br />
                Germany<br />
                <br />
                E-mail: privacy@weleda.de<br />
                Phone: [phone number to be added]
              </p>
            </Section>

            <Section title="2. Data Collected">
              <p className="text-weleda-muted">
                When participating in the Community Voting we collect the following data:
              </p>
              <ul className="list-disc pl-5 text-weleda-muted space-y-1">
                <li>First and last name (for identification)</li>
                <li>Email address (stored as an encrypted hash to prevent duplicate votes)</li>
                <li>IP address (stored as an encrypted hash for security purposes)</li>
                <li>Timestamp of the vote</li>
                <li>Selected creator</li>
              </ul>
              <p className="text-weleda-muted mt-3">
                <strong>Important:</strong> Your email address and IP address are never stored in plain text.
                Only a cryptographic hash (SHA-256) is stored, which cannot be traced back to the original data.
              </p>
            </Section>

            <Section title="3. Purpose of Processing">
              <ul className="list-disc pl-5 text-weleda-muted space-y-1">
                <li>Conducting and evaluating the Community Voting</li>
                <li>Preventing duplicate votes</li>
                <li>Protection against automated attacks (bot prevention)</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </Section>

            <Section title="4. Legal Basis">
              <p className="text-weleda-muted">
                The processing of your data is based on Art. 6(1)(a) GDPR (consent). You may withdraw
                your consent at any time with effect for the future. The lawfulness of processing carried
                out before the withdrawal remains unaffected.
              </p>
            </Section>

            <Section title="5. Retention Period">
              <p className="text-weleda-muted">
                Your data will be stored only for the duration of the campaign and up to 90 days after
                its conclusion in order to handle any queries. All personal data will then be
                irreversibly deleted.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p className="text-weleda-muted">You have the right to:</p>
              <ul className="list-disc pl-5 text-weleda-muted space-y-1">
                <li>Access your stored data (Art. 15 GDPR)</li>
                <li>Rectification of inaccurate data (Art. 16 GDPR)</li>
                <li>Erasure of your data (Art. 17 GDPR)</li>
                <li>Restriction of processing (Art. 18 GDPR)</li>
                <li>Data portability (Art. 20 GDPR)</li>
                <li>Object to processing (Art. 21 GDPR)</li>
              </ul>
            </Section>

            <Section title="7. Contact">
              <p className="text-weleda-muted">
                If you have questions about data protection, please contact:<br />
                <br />
                Data Protection Officer at WELEDA AG<br />
                E-mail: privacy@weleda.de<br />
                <br />
                You also have the right to lodge a complaint with the responsible supervisory authority.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-weleda-dark mb-3">{title}</h2>
      {children}
    </div>
  )
}
