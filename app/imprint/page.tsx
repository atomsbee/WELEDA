import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Imprint | WELEDA Community Voting',
  robots: { index: false },
}

export default function ImprintPage() {
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Imprint</h1>
          <p className="text-sm mb-8 pb-8" style={{ color: 'var(--text-faint)', borderBottom: '1px solid var(--border-nav)' }}>
            Legal disclosure pursuant to § 5 TMG (Germany)
          </p>

          <div className="space-y-8">
            <Section title="Company Information">
              <p>
                WELEDA AG<br />
                Möhlerstraße 3–5<br />
                73525 Schwäbisch Gmünd<br />
                Germany
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Phone: +49 7171 919-0<br />
                E-mail:{' '}
                <a href="mailto:info@weleda.de" className="underline" style={{ color: '#B478FF' }}>
                  info@weleda.de
                </a>
                <br />
                Website:{' '}
                <a href="https://www.weleda.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#B478FF' }}>
                  www.weleda.com
                </a>
              </p>
            </Section>

            <Section title="Company Register">
              <p>
                Registered in the commercial register of the District Court Ulm<br />
                Register number: HRB 700061
              </p>
            </Section>

            <Section title="VAT ID">
              <p>
                VAT identification number pursuant to § 27a UStG:<br />
                DE 145 118 375
              </p>
            </Section>

            <Section title="Responsible for Content (§ 55 Abs. 2 RStV)">
              <p>
                WELEDA AG<br />
                Möhlerstraße 3–5<br />
                73525 Schwäbisch Gmünd<br />
                Germany
              </p>
            </Section>

            <Section title="Liability Disclaimer">
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Liability for Content
              </h3>
              <p className="mb-4">
                As a service provider we are responsible for our own content on these pages in
                accordance with general laws (§ 7 Abs. 1 TMG). We are not obligated to monitor
                transmitted or stored third-party information or to investigate circumstances
                indicating illegal activity (§§ 8–10 TMG).
              </p>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Liability for Links
              </h3>
              <p>
                Our website contains links to external third-party websites over whose content we have
                no control. We therefore cannot accept any responsibility for such content. The
                respective provider or operator of the linked pages is always responsible for their content.
                Linked pages were checked for possible legal violations at the time of linking. Illegal
                content was not recognisable at the time.
              </p>
            </Section>

            <Section title="Copyright">
              <p>
                The content and works created by the site operators on these pages are subject to
                German copyright law. Reproduction, editing, distribution and any kind of exploitation
                beyond the limits of copyright law require the written consent of the respective author
                or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
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
