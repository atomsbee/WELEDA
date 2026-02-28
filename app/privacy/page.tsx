import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | WELEDA Community Voting',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Abstimmung
        </Link>

        {/* Glass card */}
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-card)',
          }}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
          <p className="text-sm mb-8 pb-8" style={{ color: 'var(--text-faint)', borderBottom: '1px solid var(--border-nav)' }}>
            Last updated: February 2026
          </p>

          <div className="space-y-8">
            <Section title="1. Data Controller">
              <p>
                WELEDA AG<br />
                Möhlerstraße 3<br />
                73525 Schwäbisch Gmünd<br />
                Germany<br />
                <br />
                E-mail:{' '}
                <a href="mailto:privacy@weleda.de" className="underline" style={{ color: '#B478FF' }}>
                  privacy@weleda.de
                </a>
              </p>
            </Section>

            <Section title="2. Data Collected">
              <p>When participating in the Community Voting we collect the following data:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>First and last name (for identification)</li>
                <li>Email address (stored as an encrypted hash to prevent duplicate votes)</li>
                <li>IP address (stored as an encrypted hash for security purposes)</li>
                <li>Timestamp of the vote</li>
                <li>Selected creator</li>
              </ul>
              <p className="mt-3">
                <strong style={{ color: 'var(--text-primary)' }}>Important:</strong> Your email address and IP address are never stored in plain text.
                Only a cryptographic hash (SHA-256) is stored, which cannot be traced back to the original data.
              </p>
            </Section>

            <Section title="3. Purpose of Processing">
              <ul className="list-disc pl-5 space-y-1">
                <li>Conducting and evaluating the Community Voting</li>
                <li>Preventing duplicate votes</li>
                <li>Protection against automated attacks (bot prevention)</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </Section>

            <Section title="4. Legal Basis">
              <p>
                The processing of your data is based on Art. 6(1)(a) GDPR (consent). You may withdraw
                your consent at any time with effect for the future. The lawfulness of processing carried
                out before the withdrawal remains unaffected.
              </p>
            </Section>

            <Section title="5. Retention Period">
              <p>
                Your data will be stored only for the duration of the campaign and up to 90 days after
                its conclusion in order to handle any queries. All personal data will then be
                irreversibly deleted.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Access your stored data (Art. 15 GDPR)</li>
                <li>Rectification of inaccurate data (Art. 16 GDPR)</li>
                <li>Erasure of your data (Art. 17 GDPR)</li>
                <li>Restriction of processing (Art. 18 GDPR)</li>
                <li>Data portability (Art. 20 GDPR)</li>
                <li>Object to processing (Art. 21 GDPR)</li>
              </ul>
            </Section>

            <Section title="7. Contact">
              <p>
                If you have questions about data protection, please contact:<br />
                <br />
                Data Protection Officer at WELEDA AG<br />
                E-mail:{' '}
                <a href="mailto:privacy@weleda.de" className="underline" style={{ color: '#B478FF' }}>
                  privacy@weleda.de
                </a>
                <br />
                <br />
                You also have the right to lodge a complaint with the responsible supervisory authority.
              </p>
            </Section>
          </div>
        </div>

      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  )
}
