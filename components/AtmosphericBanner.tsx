import Image from 'next/image'

export default function AtmosphericBanner() {
  return (
    <section className="w-section relative overflow-hidden">
      <div className="w-container">
        <div
          className="w-reveal w-d0 relative rounded-3xl overflow-hidden"
          data-animation="fade-up"
          style={{ aspectRatio: '21/9' }}
        >
          <Image
            src="/img/atmospharisch.jpg"
            alt="Teneriffa — Dein WELEDA Sommer erwartet dich"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />

          {/* Dark overlay for text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.50) 100%)',
            }}
          />

          {/* Text overlay — centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p
              className="w-reveal w-d1 text-[10px] md:text-xs font-black tracking-[0.25em] uppercase mb-2"
              data-animation="fade-up"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              FINALE AUF TENERIFFA
            </p>
            <h3
              className="w-reveal w-d2 font-black text-xl md:text-3xl lg:text-4xl text-white leading-tight mb-2"
              data-animation="fade-up"
            >
              Dein WELEDA Sommer<br className="hidden sm:inline" /> erwartet dich.
            </h3>
            <p
              className="w-reveal w-d3 text-xs md:text-sm max-w-md leading-relaxed"
              data-animation="fade-up"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              Sonne, Strand und echte Summer Vibes — das große Finale auf Teneriffa wird unvergesslich.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
