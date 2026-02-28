import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Teilnahmebedingungen | WELEDA Community Voting',
  robots: { index: false },
}

export default function TermsPage() {
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
          {/* Accent bar */}
          <div
            className="h-1 rounded-full mb-6 w-20"
            style={{ background: 'linear-gradient(90deg, #F59E0B, #B478FF, #FF6EB4)' }}
          />

          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Teilnahmebedingungen
          </h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            WELEDA Summer &amp; Body/Hair Mist Campaign — Community Vote 2026
          </p>
          <p className="text-sm mb-8 pb-8" style={{ color: 'var(--text-faint)', borderBottom: '1px solid var(--border-nav)' }}>
            Bitte lesen Sie diese Teilnahmebedingungen sorgfältig durch, bevor Sie an der WELEDA Community Abstimmung teilnehmen. Mit der Abgabe Ihrer Stimme akzeptieren Sie diese Bedingungen vollständig.
          </p>

          <div className="space-y-10">

            <Section title="1. Geltungsbereich">
              <p>
                Diese Teilnahmebedingungen gelten für die Teilnahme am WELEDA Community Vote im Rahmen der
                WELEDA Summer &amp; Body/Hair Mist Kampagne 2026 (nachfolgend „Kampagne"). Veranstalter ist die
                WELEDA AG, Möhlerstraße 3–5, 73525 Schwäbisch Gmünd (nachfolgend „WELEDA AG").
              </p>
              <p className="mt-3">
                Die Teilnahme ist freiwillig und kostenlos. Ein Kauf ist für die Teilnahme nicht erforderlich.
                Mit der Abgabe einer Stimme erklärt die teilnehmende Person ihr Einverständnis mit diesen
                Teilnahmebedingungen.
              </p>
            </Section>

            <Section title="2. Teilnahmeberechtigung">
              <p>
                Teilnahmeberechtigt sind natürliche Personen, die zum Zeitpunkt der Teilnahme das 18. Lebensjahr
                vollendet haben. Mitarbeiterinnen und Mitarbeiter der WELEDA AG sowie deren unmittelbare
                Familienangehörige sind von der Teilnahme ausgeschlossen.
              </p>
              <p className="mt-3">
                Jede Person darf pro Duftrichtung (Vanilla Cloud, Mystic Aura, Tropical Crush) genau eine (1)
                Stimme abgeben, insgesamt also maximal drei (3) Stimmen während des gesamten Kampagnenzeitraums.
                Die Überprüfung der Stimmen erfolgt anhand der E-Mail-Adresse. Mehrfachstimmabgaben sowie die
                Nutzung automatisierter Systeme oder sonstiger Manipulationen sind nicht zulässig und führen zum
                Ausschluss.
              </p>
            </Section>

            <Section title="3. Ablauf und Durchführung">
              <p>
                Die Kampagne läuft vom <strong style={{ color: 'var(--text-primary)' }}>13. März 2026 um 00:00 Uhr MEZ</strong> bis zum{' '}
                <strong style={{ color: 'var(--text-primary)' }}>17. März 2026 um 23:59 Uhr MEZ</strong> („Kampagnenzeitraum").
                Stimmen, die außerhalb dieses Zeitraums abgegeben werden, werden nicht berücksichtigt.
              </p>
              <p className="mt-3">
                WELEDA AG behält sich das Recht vor, die Kampagne jederzeit ohne Vorankündigung zu ändern,
                auszusetzen oder vorzeitig zu beenden, insbesondere wenn ein ordnungsgemäßer Ablauf aus technischen
                oder rechtlichen Gründen nicht gewährleistet werden kann.
              </p>
              <p className="mt-3">
                Die Gewinner und Gewinnerinnen in jeder Kategorie werden durch die höchste Anzahl verifizierter
                Stimmen ermittelt. Die Entscheidung der WELEDA AG ist endgültig und bindend.
              </p>
            </Section>

            <Section title="4. Nutzungsrechte">
              <p>
                Mit der Teilnahme am Voting bestätigen die teilnehmenden Personen, dass sie keine Inhalte
                einsenden oder verbreiten, die Rechte Dritter (insbesondere Urheberrechte, Markenrechte oder
                Persönlichkeitsrechte) verletzen.
              </p>
              <p className="mt-3">
                Sofern im Rahmen der Kampagne Inhalte eingereicht werden, räumen die Teilnehmenden der WELEDA AG
                das nicht-exklusive, weltweite, kostenfreie Recht ein, diese Inhalte im Rahmen der Kampagne zu
                verwenden, zu veröffentlichen und zu verbreiten. Eine darüber hinausgehende Nutzung erfolgt nur
                nach gesonderter Vereinbarung.
              </p>
            </Section>

            <Section title="5. Verzichtserklärung">
              <p>
                Die Teilnahme an der Kampagne erfolgt auf eigenes Risiko. WELEDA AG übernimmt keine Haftung für
                technische Störungen, Übertragungsfehler oder andere Umstände, die außerhalb ihres Einflussbereichs
                liegen und die Teilnahme beeinträchtigen könnten.
              </p>
              <p className="mt-3">
                WELEDA AG haftet nicht für Schäden, die direkt oder indirekt aus der Teilnahme an der Kampagne
                entstehen, es sei denn, es liegt grobe Fahrlässigkeit oder Vorsatz der WELEDA AG vor.
              </p>
            </Section>

            <Section title="6. Rechtsgarantie">
              <p>
                Die Teilnehmenden garantieren, dass alle von ihnen im Rahmen der Kampagne eingereichten oder
                geteilten Inhalte keine Rechte Dritter verletzen und nicht gegen geltendes Recht verstoßen.
                Für Ansprüche Dritter, die aus einer Verletzung dieser Garantie resultieren, stellen die
                Teilnehmenden WELEDA AG vollständig frei.
              </p>
            </Section>

            <Section title="7. Datenschutz">
              <p>
                Durch die Teilnahme erklären Sie sich damit einverstanden, dass WELEDA AG Ihren Namen und Ihre
                E-Mail-Adresse zum ausschließlichen Zweck der Überprüfung Ihrer Stimme und der Durchführung der
                Kampagne erfasst und verarbeitet. Ihre persönlichen Daten werden nicht an Dritte weitergegeben,
                es sei denn, dies ist gesetzlich vorgeschrieben.
              </p>
              <p className="mt-3">
                Alle personenbezogenen Daten werden innerhalb von 90 Tagen nach Ende der Kampagne unwiderruflich
                gelöscht. Ihre E-Mail-Adresse und IP-Adresse werden ausschließlich als kryptografischer Hash
                (SHA-256) gespeichert und sind nicht auf die ursprünglichen Daten zurückführbar.
              </p>
              <p className="mt-3">
                Weitere Informationen finden Sie in unserer{' '}
                <Link href="/privacy" className="underline" style={{ color: '#B478FF' }}>
                  Datenschutzerklärung
                </Link>.
              </p>
            </Section>

            <Section title="8. Verschwiegenheit">
              <p>
                Alle Informationen über das Abstimmungsergebnis und die Auswahl der Gewinnerinnen und Gewinner
                sind vertraulich zu behandeln, bis WELEDA AG eine offizielle Bekanntgabe macht. Die Teilnehmenden
                verpflichten sich, keine vertraulichen Informationen über den Kampagnenverlauf oder die Ergebnisse
                an Dritte weiterzugeben, bevor eine offizielle Veröffentlichung durch WELEDA AG erfolgt ist.
              </p>
            </Section>

            <Section title="9. Sonstige Bestimmungen">
              <p>
                Diese Teilnahmebedingungen unterliegen dem Recht der Bundesrepublik Deutschland. Gerichtsstand
                ist, soweit gesetzlich zulässig, Schwäbisch Gmünd.
              </p>
              <p className="mt-3">
                Sollten einzelne Bestimmungen dieser Teilnahmebedingungen unwirksam sein oder werden, bleiben die
                übrigen Bestimmungen davon unberührt. WELEDA AG behält sich das Recht vor, diese
                Teilnahmebedingungen jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht.
                Die weitere Teilnahme nach einer Änderung gilt als Zustimmung zu den aktualisierten Bedingungen.
              </p>
              <p className="mt-3">
                Bei Fragen zu dieser Kampagne oder diesen Teilnahmebedingungen wenden Sie sich bitte an:<br />
                WELEDA AG, Möhlerstraße 3–5, 73525 Schwäbisch Gmünd<br />
                E-Mail:{' '}
                <a href="mailto:info@weleda.de" className="underline" style={{ color: '#B478FF' }}>
                  info@weleda.de
                </a>
              </p>
            </Section>

          </div>

          {/* Footer note */}
          <p
            className="text-xs mt-10 pt-6"
            style={{ color: 'var(--text-faint)', borderTop: '1px solid var(--border-nav)' }}
          >
            Stand: Schwäbisch Gmünd, 27.02.2026 · WELEDA AG, Möhlerstraße 3–5, 73525 Schwäbisch Gmünd
          </p>
        </div>

      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  )
}
