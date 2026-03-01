import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | WELEDA Summer Vote 2026',
  robots: { index: false },
}

export default function DatenschutzPage() {
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Datenschutzerklärung</h1>
          <p className="text-sm mb-8 pb-8" style={{ color: 'var(--text-faint)', borderBottom: '1px solid var(--border-nav)' }}>
            Stand: Februar 2026
          </p>

          <div className="space-y-8">
            <Section title="1. Verantwortlicher">
              <p>
                WELEDA AG<br />
                Möhlerstraße 3<br />
                73525 Schwäbisch Gmünd<br />
                Deutschland<br />
                <br />
                E-Mail:{' '}
                <a href="mailto:privacy@weleda.de" className="underline" style={{ color: '#B478FF' }}>
                  privacy@weleda.de
                </a>
              </p>
            </Section>

            <Section title="2. Erhobene Daten">
              <p>Bei der Teilnahme am Community Voting erheben wir folgende Daten:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Vor- und Nachname (zur Identifikation)</li>
                <li>E-Mail-Adresse (gespeichert als verschlüsselter Hash zur Verhinderung von Mehrfachstimmen)</li>
                <li>IP-Adresse (gespeichert als verschlüsselter Hash zu Sicherheitszwecken)</li>
                <li>Zeitstempel der Stimmabgabe</li>
                <li>Gewählter Creator</li>
              </ul>
              <p className="mt-3">
                <strong style={{ color: 'var(--text-primary)' }}>Wichtig:</strong> Ihre E-Mail-Adresse und IP-Adresse werden niemals im Klartext gespeichert.
                Es wird ausschließlich ein kryptografischer Hash (SHA-256) gespeichert, der nicht auf die ursprünglichen Daten zurückgeführt werden kann.
              </p>
            </Section>

            <Section title="3. Zweck der Verarbeitung">
              <ul className="list-disc pl-5 space-y-1">
                <li>Durchführung und Auswertung des Community Votings</li>
                <li>Verhinderung von Mehrfachstimmen</li>
                <li>Schutz vor automatisierten Angriffen (Bot-Prävention)</li>
                <li>Erfüllung gesetzlicher Pflichten</li>
              </ul>
            </Section>

            <Section title="4. Rechtsgrundlage">
              <p>
                Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Sie können Ihre
                Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
                Verarbeitung bleibt unberührt.
              </p>
            </Section>

            <Section title="5. Speicherdauer">
              <p>
                Ihre Daten werden ausschließlich für die Dauer der Kampagne und bis zu 90 Tage nach deren Abschluss gespeichert,
                um etwaige Anfragen bearbeiten zu können. Anschließend werden alle personenbezogenen Daten unwiderruflich gelöscht.
              </p>
            </Section>

            <Section title="6. Ihre Rechte">
              <p>Sie haben das Recht auf:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
            </Section>

            <Section title="7. Kontakt Datenschutz">
              <p>
                Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                <br />
                Datenschutzbeauftragter der WELEDA AG<br />
                E-Mail:{' '}
                <a href="mailto:privacy@weleda.de" className="underline" style={{ color: '#B478FF' }}>
                  privacy@weleda.de
                </a>
                <br />
                <br />
                Sie haben zudem das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren.
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
