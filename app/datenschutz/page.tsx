import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | WELEDA Community Voting',
  robots: { index: false },
}

export default function DatenschutzPage() {
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
          <h1 className="text-3xl font-bold text-weleda-dark mb-2">Datenschutzerklärung</h1>
          <p className="text-weleda-muted text-sm mb-8 pb-8 border-b border-weleda-card-border">
            Letzte Aktualisierung: Februar 2026 ·{' '}
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs font-medium">
              Placeholder — WELEDA Rechtsabteilung ergänzt Inhalt
            </span>
          </p>

          <div className="prose prose-sm max-w-none space-y-8">
            <Section title="1. Verantwortlicher">
              <p className="text-weleda-muted">
                WELEDA AG<br />
                Möhlerstraße 3<br />
                73525 Schwäbisch Gmünd<br />
                Deutschland<br />
                <br />
                E-Mail: datenschutz@weleda.de<br />
                Telefon: [Telefonnummer einzufügen]
              </p>
            </Section>

            <Section title="2. Erhobene Daten">
              <p className="text-weleda-muted">
                Bei der Teilnahme am Community Voting erheben wir folgende Daten:
              </p>
              <ul className="list-disc pl-5 text-weleda-muted space-y-1">
                <li>Vorname und Nachname (zur Identifikation)</li>
                <li>E-Mail-Adresse (als verschlüsselter Hash, um Mehrfachabstimmungen zu verhindern)</li>
                <li>IP-Adresse (als verschlüsselter Hash, für Sicherheitszwecke)</li>
                <li>Zeitstempel der Abstimmung</li>
                <li>Gewählter Influencer</li>
              </ul>
              <p className="text-weleda-muted mt-3">
                <strong>Wichtig:</strong> Ihre E-Mail-Adresse und IP-Adresse werden niemals im Klartext
                gespeichert. Es wird ausschließlich ein kryptografischer Hash (SHA-256) gespeichert,
                der keine Rückschlüsse auf die Originaldaten erlaubt.
              </p>
            </Section>

            <Section title="3. Zweck der Verarbeitung">
              <ul className="list-disc pl-5 text-weleda-muted space-y-1">
                <li>Durchführung und Auswertung des Community Votings</li>
                <li>Verhinderung von Mehrfachabstimmungen</li>
                <li>Schutz vor automatisierten Angriffen (Bot-Prävention)</li>
                <li>Einhaltung rechtlicher Verpflichtungen</li>
              </ul>
            </Section>

            <Section title="4. Rechtsgrundlage">
              <p className="text-weleda-muted">
                Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO
                (Einwilligung). Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
                widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt
                davon unberührt.
              </p>
            </Section>

            <Section title="5. Speicherdauer">
              <p className="text-weleda-muted">
                Ihre Daten werden ausschließlich für die Dauer der Kampagne und bis zu 90 Tage nach
                deren Ende gespeichert, um eventuelle Anfragen bearbeiten zu können. Danach werden
                alle personenbezogenen Daten unwiderruflich gelöscht.
              </p>
            </Section>

            <Section title="6. Ihre Rechte">
              <p className="text-weleda-muted">Sie haben das Recht auf:</p>
              <ul className="list-disc pl-5 text-weleda-muted space-y-1">
                <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
            </Section>

            <Section title="7. Kontakt">
              <p className="text-weleda-muted">
                Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                <br />
                Datenschutzbeauftragte/r der WELEDA AG<br />
                E-Mail: datenschutz@weleda.de<br />
                <br />
                Sie haben zudem das Recht, bei der zuständigen Aufsichtsbehörde Beschwerde einzulegen.
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
