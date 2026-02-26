import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum | WELEDA Community Voting',
  robots: { index: false },
}

export default function ImpressumPage() {
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
          <h1 className="text-3xl font-bold text-weleda-dark mb-2">Impressum</h1>
          <p className="text-weleda-muted text-sm mb-8 pb-8 border-b border-weleda-card-border">
            Angaben gemäß § 5 TMG ·{' '}
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-medium">
              Placeholder — WELEDA Rechtsabteilung ergänzt Inhalt
            </span>
          </p>

          <div className="space-y-8">
            <Section title="Angaben gemäß § 5 TMG">
              <p className="text-weleda-muted">
                WELEDA AG<br />
                Möhlerstraße 3<br />
                73525 Schwäbisch Gmünd<br />
                Deutschland
              </p>
            </Section>

            <Section title="Kontakt">
              <p className="text-weleda-muted">
                Telefon: [Telefonnummer einzufügen]<br />
                E-Mail: [E-Mail-Adresse einzufügen]<br />
                Website:{' '}
                <a href="https://www.weleda.com" className="text-weleda-green underline">
                  www.weleda.com
                </a>
              </p>
            </Section>

            <Section title="Registereintrag">
              <p className="text-weleda-muted">
                Eintragung im Handelsregister<br />
                Registergericht: [Registergericht einzufügen]<br />
                Registernummer: [Registernummer einzufügen]
              </p>
            </Section>

            <Section title="Umsatzsteuer-ID">
              <p className="text-weleda-muted">
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                [USt-ID einzufügen]
              </p>
            </Section>

            <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
              <p className="text-weleda-muted">
                [Name und Adresse der verantwortlichen Person einzufügen]
              </p>
            </Section>

            <Section title="Haftungsausschluss">
              <h3 className="font-semibold text-weleda-dark mb-2">Haftung für Inhalte</h3>
              <p className="text-weleda-muted mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
                rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="font-semibold text-weleda-dark mb-2">Haftung für Links</h3>
              <p className="text-weleda-muted">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
                keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </Section>

            <Section title="Urheberrecht">
              <p className="text-weleda-muted">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
                und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
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
