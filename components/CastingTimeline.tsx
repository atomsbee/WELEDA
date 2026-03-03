'use client'

const STEPS = [
  {
    chip: '03.03.–12.03.2026',
    chipColor: '#F59E0B',
    title: 'Bewerbungsphase',
    body: 'Poste dein Bewerbungsvideo bis zum 12.3.2026 (24:00 Uhr) auf TikTok oder Instagram. Tagge @weleda und nutze den Hashtag',
    tags: ['#weledacasting'],
    highlight: false,
  },
  {
    chip: 'Vorauswahl',
    chipColor: '#8B5CF6',
    title: 'WELEDA Auswahl',
    body: 'Wir wählen die Top-Creators aus. Wenn du dabei bist bekommst du eine DM von uns. Überzeuge uns mit:',
    tags: ['Kreativität', 'Vibe', 'Know-How', 'Authentizität'],
    highlight: false,
  },
  {
    chip: '13.03–17.03.2026',
    chipColor: '#EC4899',
    title: 'Voting-Phase',
    body: '1× täglich abstimmen, 5 Tage lang. Mach ordentlich Werbung für dich!',
    tags: ['1× täglich', '5 Tage'],
    highlight: false,
  },
  {
    chip: '9 TICKETS',
    chipColor: '#10B981',
    title: 'Finaleinzug',
    body: (
      <>
        2 x Top-Votes pro "Kategorie"<br />
        1 x Top Vote "Community"<br />
        2 x Wildcards von WELEDA
      </>
    ),
    tags: ['Wildcard', 'Community Vote'],
    highlight: false,
  },
  {
    chip: '22.03–25.03.2026',
    chipColor: '#F59E0B',
    title: 'Final Casting auf Teneriffa 🌴',
    body: 'Spannende Challenges, kreativer Content und echte Summer Vibes. Am Ende entscheidet die Jury bestehend aus Bene Schulz, Celine Bethmann & WoistLena, wer die drei Gesichter unserer neuen WELEDA Summer Campaign werden.',
    tags: ['✈️ All inclusive'],
    highlight: true,
  },
  {
    chip: 'TOP 3',
    chipColor: '#8B5CF6',
    title: 'Kampagnen-Shooting • 25.03.2026',
    body: 'Fotos + Videos für die WELEDA Summer Campaign.',
    tags: ['📸 Foto', '🎬 Video'],
    highlight: false,
  },
]

export default function CastingTimeline() {
  return (
    <section className="w-section overflow-hidden">

      {/* Section header */}
      <div className="text-center mb-12">
        <p className="w-eyebrow">DEINE REISE</p>
        <h2 className="w-h2">
          So läuft das{' '}
          <span className="w-gradient-text">Casting ab.</span>
        </h2>
        <p className="text-base mt-3" style={{ color: 'var(--text-muted)' }}>
          Von der Bewerbung bis zum Shooting &mdash; alle Schritte auf einen Blick.
        </p>
      </div>

      {/* Desktop / Tablet: always 6 cols, horizontal scroll on narrow md */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="relative min-w-[820px] max-w-[1380px] mx-auto px-4 md:px-10">
            {/* Gradient connecting line through badge centers */}
            <div
              className="absolute top-6 left-[4%] right-[4%] h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #F59E0B 0%, #8B5CF6 20%, #EC4899 40%, #10B981 60%, #F59E0B 80%, #8B5CF6 100%)',
                opacity: 0.45,
              }}
            />

            <div className="grid grid-cols-6 gap-2 xl:gap-3 pt-8">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`w-reveal w-d${i + 1}`}
                  data-animation="fade-up"
                >
                  <div className="relative h-full">
                    {/* Number badge */}
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                      style={{
                        background: step.chipColor,
                        boxShadow: `0 0 0 3px var(--badge-ring-color), 0 4px 12px ${step.chipColor}55`,
                      }}
                    >
                      {i + 1}
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-2xl pt-7 px-4 pb-4 h-full flex flex-col"
                      style={{
                        background: step.highlight ? 'rgba(245,158,11,0.09)' : 'var(--step-card-bg)',
                        border: step.highlight
                          ? '1px solid rgba(245,158,11,0.50)'
                          : `1px solid ${step.chipColor}28`,
                        backdropFilter: 'blur(12px)',
                        boxShadow: step.highlight ? '0 0 30px rgba(245,158,11,0.12)' : undefined,
                      }}
                    >
                      <div className="flex-1">
                        <span
                          className="inline-block text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full mb-2"
                          style={{
                            background: `${step.chipColor}20`,
                            color: step.chipColor,
                            border: `1px solid ${step.chipColor}50`,
                          }}
                        >
                          {step.chip}
                        </span>
                        <p
                          className="font-bold text-sm leading-tight mb-1.5"
                          style={{ color: step.highlight ? '#F59E0B' : 'var(--text-primary)' }}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {step.body}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {step.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${step.chipColor}15`,
                              color: step.chipColor,
                              border: `1px solid ${step.chipColor}40`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: compact vertical list */}
      <div className="lg:hidden max-w-lg mx-auto">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`w-reveal w-d${i + 1} flex gap-4 pb-6 relative`}
            data-animation="fade-up"
          >
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md z-10"
                style={{ background: step.chipColor }}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-px flex-1 mt-2"
                  style={{ background: `${step.chipColor}30`, minHeight: '32px' }}
                />
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${step.chipColor}20`,
                    color: step.chipColor,
                    border: `1px solid ${step.chipColor}50`,
                  }}
                >
                  {step.chip}
                </span>
                <p
                  className="font-bold text-sm"
                  style={{ color: step.highlight ? '#F59E0B' : 'var(--text-primary)' }}
                >
                  {step.title}
                </p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.body}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {step.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${step.chipColor}15`,
                      color: step.chipColor,
                      border: `1px solid ${step.chipColor}40`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
