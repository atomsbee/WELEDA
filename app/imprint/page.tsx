import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Imprint | WELEDA Community Voting',
  robots: { index: false },
}

export default function ImprintPage() {
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
          <h1 className="text-3xl font-bold text-weleda-dark mb-2">Imprint</h1>
          <p className="text-weleda-muted text-sm mb-8 pb-8 border-b border-weleda-card-border">
            Legal disclosure
          </p>

          <div className="space-y-8">
            <Section title="Company Information">
              <p className="text-weleda-muted">
                WELEDA AG<br />
                Möhlerstraße 3<br />
                73525 Schwäbisch Gmünd<br />
                Germany
              </p>
            </Section>

            <Section title="Contact">
              <p className="text-weleda-muted">
                Phone: [phone number to be added]<br />
                E-mail: [email address to be added]<br />
                Website:{' '}
                <a href="https://www.weleda.com" className="text-weleda-green underline">
                  www.weleda.com
                </a>
              </p>
            </Section>

            <Section title="Company Register">
              <p className="text-weleda-muted">
                Registered in the commercial register<br />
                Register court: [to be added]<br />
                Register number: [to be added]
              </p>
            </Section>

            <Section title="VAT ID">
              <p className="text-weleda-muted">
                VAT identification number:<br />
                [VAT ID to be added]
              </p>
            </Section>

            <Section title="Responsible for Content">
              <p className="text-weleda-muted">
                [Name and address of the responsible person to be added]
              </p>
            </Section>

            <Section title="Liability Disclaimer">
              <h3 className="font-semibold text-weleda-dark mb-2">Liability for Content</h3>
              <p className="text-weleda-muted mb-4">
                As a service provider we are responsible for our own content on these pages in
                accordance with general laws. We are not obligated to monitor transmitted or stored
                third-party information or to investigate circumstances indicating illegal activity.
              </p>

              <h3 className="font-semibold text-weleda-dark mb-2">Liability for Links</h3>
              <p className="text-weleda-muted">
                Our website contains links to external third-party websites over whose content we have
                no control. We therefore cannot accept any responsibility for such content. The
                respective provider or operator of the linked pages is always responsible for their content.
              </p>
            </Section>

            <Section title="Copyright">
              <p className="text-weleda-muted">
                The content and works created by the site operators on these pages are subject to
                copyright law. Reproduction, editing, distribution and any kind of exploitation beyond
                the limits of copyright law require the written consent of the respective author or creator.
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
