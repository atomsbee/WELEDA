'use client'
import Link from 'next/link'

export default function HowToSection() {
  return (
    <section className="content-section py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">

        <p className="text-xs font-bold tracking-[0.2em] uppercase
                      text-center mb-3"
           style={{ color: 'rgb(124,58,237)' }}>
          SO FUNKTIONIERT ES
        </p>

        <h2 className="text-3xl md:text-4xl font-black text-center mb-10"
            style={{ color: 'var(--text-primary)' }}>
          Und so geht's
        </h2>

        <div className="rounded-2xl p-6 md:p-10"
             style={{ background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)' }}>

          {/* BODY COPY */}
          <p className="text-sm md:text-base leading-relaxed mb-8"
             style={{ color: 'var(--text-secondary)' }}>
            Bewirb dich mit einem Video auf TikTok oder Instagram
            (mind. 30 Sekunden, max. 5 Minuten). Zeig uns, warum
            genau DU eines der drei neuen Faces unserer WELEDA
            Summer Body & Hair Mist Campaign werden solltest. Stell
            uns in deinem Video deine liebsten WELEDA Serum Booster
            Drops und/oder das UV Glow Fluid vor und erzähl, warum
            das dein Go-To-Produkt für den Sommer ist. Was feierst
            du daran? Wann benutzt du es? Warum passt es perfekt
            zu dir?
          </p>

          {/* WICHTIG BLOCK */}
          <div className="rounded-xl p-5 mb-8"
               style={{ background: 'rgba(124,58,237,0.06)',
                        border: '1px solid rgba(124,58,237,0.18)' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-4"
               style={{ color: 'rgb(124,58,237)' }}>Wichtig</p>
            <ul className="space-y-3">
              {[
                'Lade dein Video als Feed-Post oder Reel auf TikTok oder Instagram hoch (keine Story)',
                'Folge und markiere @weleda (IG & TikTok)',
                'Nutze die Hashtags #weledacasting #weledafragrancemists',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-5 h-5 rounded-full flex-shrink-0 flex
                                   items-center justify-center text-xs font-black mt-0.5"
                        style={{ background: 'rgba(124,58,237,0.15)',
                                 color: 'rgb(124,58,237)' }}>
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <p className="text-base md:text-lg font-black text-center mb-8"
             style={{ color: 'var(--text-primary)' }}>
            Let's go – wir wollen DICH sehen 💚
          </p>

          {/* AVAILABILITY NOTICE */}
          <div className="rounded-xl p-5"
               style={{ background: 'rgba(244,114,182,0.06)',
                        border: '1px solid rgba(244,114,182,0.18)' }}>
            <p className="text-sm leading-relaxed"
               style={{ color: 'var(--text-secondary)' }}>
              Mit deiner Teilnahme garantierst du uns, dass du am
              Finale teilnehmen kannst. Das bedeutet, dass du vom{' '}
              <span className="font-bold"
                    style={{ color: 'var(--text-primary)' }}>
                22.03.2026 – 26.03.2026
              </span>{' '}
              für das Live-Casting, das Finale und die mögl.
              anschließende Produktion zur Verfügung stehen kannst.
              Die kompletten Teilnahmebedingungen findest du{' '}
              <Link href="/nutzungsbedingungen"
                    className="font-semibold underline underline-offset-2
                               hover:opacity-70 transition-opacity"
                    style={{ color: 'rgb(124,58,237)' }}>
                hier
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
