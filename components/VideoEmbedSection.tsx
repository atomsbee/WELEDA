'use client'

const VIDEO_URL = '' // swap with YouTube/Vimeo embed URL when ready

export default function VideoEmbedSection() {
  return (
    <section className="content-section pb-16 md:pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl overflow-hidden"
             style={{ background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)' }}>

          <div className="relative w-full aspect-video">
            {VIDEO_URL ? (
              <iframe
                src={VIDEO_URL}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write;
                       encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="WELEDA SoMe Erklärvideo"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col
                              items-center justify-center gap-4"
                   style={{ background: 'linear-gradient(135deg,rgba(244,114,182,0.08),rgba(124,58,237,0.08))' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                     style={{ background: 'rgba(124,58,237,0.12)',
                              border: '2px solid rgba(124,58,237,0.30)' }}>
                  <svg className="w-7 h-7 ml-1" fill="rgb(124,58,237)" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold"
                   style={{ color: 'var(--text-muted)' }}>
                  Video folgt ab 03./04.03.2026
                </p>
              </div>
            )}

            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full
                            text-xs font-bold z-10"
                 style={{ background: 'rgba(124,58,237,0.12)',
                          border: '1px solid rgba(124,58,237,0.25)',
                          color: 'rgb(124,58,237)' }}>
              Ab 03./04.03.2026
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-sm font-semibold mb-0.5"
               style={{ color: 'var(--text-primary)' }}>Erklärvideo</p>
            <p className="text-xs"
               style={{ color: 'var(--text-muted)' }}>
              Hier kommt dann ab 03./04.03 noch ein Erklärvideo
              unseres SoMe Teams dazu
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
