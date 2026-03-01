import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Impressum | WELEDA Summer Vote 2026',
  robots: { index: false },
}

export default function ImpressumPage() {
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Impressum</h1>
          <p className="text-sm mb-8 pb-8" style={{ color: 'var(--text-faint)', borderBottom: '1px solid var(--border-nav)' }}>
            Angaben gemäß § 5 TMG
          </p>

          <div className="space-y-8">
            <Section title="Unternehmensangaben">
              <p>
                WELEDA AG<br />
                Möhlerstraße 3–5<br />
                73525 Schwäbisch Gmünd<br />
                Deutschland
              </p>
            </Section>

            <Section title="Kontakt">
              <p>
                Telefon: +49 7171 919-0<br />
                E-Mail:{' '}
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

            <Section title="Handelsregister">
              <p>
                Eingetragen im Handelsregister des Amtsgerichts Ulm<br />
                Registernummer: HRB 700061
              </p>
            </Section>

            <Section title="Umsatzsteuer-ID">
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
                DE 145 118 375
              </p>
            </Section>

            <Section title="Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)">
              <p>
                WELEDA AG<br />
                Möhlerstraße 3–5<br />
                73525 Schwäbisch Gmünd<br />
                Deutschland
              </p>
            </Section>

            <Section title="Haftungsausschluss">
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Haftung für Inhalte
              </h3>
              <p className="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8–10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Haftung für Links
              </h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </Section>

            <Section title="Urheberrecht">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
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
