'use client'

const REQUIREMENTS_LEFT = [
  'Du bist mind. 18 Jahre alt',
  'Wohnsitz in DE, AT oder CH',
  'Öffentliches Instagram oder TikTok Profil',
  'Video als Reel / TikTok hochladen (keine Story)',
  '@WELEDA taggen',
  '#weledacasting nutzen',
  'Vom 22.03.2026–26.03.2026 verfügbar sein',
]

const BENEFITS = [
  {
    icon: '🌟',
    title: 'Kampagnen-Face',
    sub: 'Mit etwas Glück wirst du eines von 3 neuen Gesichtern der WELEDA Summer Campaign',
    color: '#F59E0B',
  },
  {
    icon: '✈️',
    title: 'Teneriffa — all inclusive',
    sub: 'Reise, Unterkunft & Verpflegung — alles von WELEDA',
    color: '#10B981',
  },
  {
    icon: '📸',
    title: 'Kampagnen-Shooting',
    sub: 'Professioneller Foto- und Video-Content für die Summer Campaign',
    color: '#EC4899',
  },
  {
    icon: '💜',
    title: 'WELEDA Social Feature',
    sub: 'Feature auf den offiziellen WELEDA Kanälen',
    color: '#8B5CF6',
  },
  {
    icon: '📜',
    title: 'Faire Bedingungen',
    sub: 'Nutzungsrechte & transparente Konditionen',
    color: '#60A5FA',
  },
]

export default function WasduWissenmussSection() {
  return (
    <section className="w-section">
      <div className="w-container">
        <div className="text-center mb-10">
          {/* <p className="w-eyebrow">GUT ZU WISSEN</p> */}
          <h2 className="w-h2">
            Was du wissen{' '}
            <span className="w-gradient-text">musst.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          {/* LEFT CARD — clean checklist */}
          <div
            className="w-reveal w-d1 rounded-3xl p-6 md:p-8 h-full"
            data-animation="fade-left"
            style={{
              background: 'var(--wissen-left-bg)',
              border: '1px solid var(--wissen-left-border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.15)' }}
              >
                📋
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#8B5CF6' }}>
                  Voraussetzungen
                </p>
                <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Mitmachen</p>
              </div>
            </div>

            <ul className="space-y-3">
              {REQUIREMENTS_LEFT.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                    style={{
                      background: 'rgba(16,185,129,0.15)',
                      border: '1px solid rgba(16,185,129,0.35)',
                    }}
                  >
                    <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1.5,5 4,7.5 8.5,2" />
                    </svg>
                  </div>
                  <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>{req}</span>
                </li>
              ))}
            </ul>

            <p
              className="text-xs mt-6 pt-5 leading-relaxed"
              style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--wissen-left-border)' }}
            >
              Mit der Teilnahme stimmst du unseren{' '}
              <a
                href="/nutzungsbedingungen"
                className="underline underline-offset-2 font-semibold hover:opacity-70 transition-opacity"
                style={{ color: 'rgb(124, 58, 237)' }}
              >
                Teilnahmebedingungen (AGB)
              </a>{' '}
              zu.
            </p>
          </div>

          {/* RIGHT CARD — premium benefits */}
          <div
            className="w-reveal w-d2 rounded-3xl p-6 md:p-8 h-full relative overflow-hidden"
            data-animation="fade-right"
            style={{
              background: 'var(--wissen-right-bg)',
              border: '1px solid rgba(139,92,246,0.25)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, var(--glow-blob-color) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.15)' }}
              >
                🎁
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#EC4899' }}>
                  Deine Belohnung
                </p>
                <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Das bekommst du</p>
              </div>
            </div>

            <div className="space-y-2.5 relative z-10">
              {BENEFITS.map((benefit, bi) => (
                <div
                  key={bi}
                  className="flex items-start gap-3 rounded-2xl p-3"
                  style={{
                    background: `${benefit.color}09`,
                    border: `1px solid ${benefit.color}25`,
                  }}
                >
                  <span className="text-xl flex-shrink-0 leading-none mt-0.5">{benefit.icon}</span>
                  <div>
                    <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {benefit.title}
                    </p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      {benefit.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
