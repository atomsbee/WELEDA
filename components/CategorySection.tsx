'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { CATEGORIES, CATEGORY_KEYS } from '@/lib/config/categories'

export default function CategorySection() {
  const shouldReduceMotion = useReducedMotion()

  const scrollToCategory = (key: string) => {
    const el = document.getElementById(`category-${key}`) || document.getElementById('influencer-grid')
    if (!el) return
    const headerOffset = 120
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section className="w-section">
      <div className="w-container">
        <div className="text-center mb-10">
          <p className="w-eyebrow">JETZT ABSTIMMEN</p>
          <h2 className="w-h2">
            Wähle deine{' '}
            <span className="w-gradient-text">Duftwelt.</span>
          </h2>
          <p
            className="text-sm mt-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Eine Stimme pro Kategorie - Entdecke alle Drei und vote für deinen Favoriten
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CATEGORY_KEYS.map((key, i) => {
            const cat = CATEGORIES[key]
            return (
              <div
                key={key}
                className={`w-reveal w-d${i + 1}`}
                data-animation="fade-up"
              >
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => scrollToCategory(key)}
                  style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-card)',
                    boxShadow: `0 0 40px ${cat.glow}`,
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={cat.modelImage}
                      alt={cat.label}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 90vw, 30vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 100%)' }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                      style={{ background: cat.gradient, mixBlendMode: 'screen' }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 md:px-4 py-4 md:py-6 flex flex-col items-center text-center">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-xs md:text-md leading-tight mb-2"
                      style={{ background: cat.gradient, color: 'white' }}
                    >
                      {cat.hashtag}
                    </div>
                    <p
                      className="text-xs mb-3"
                      style={{ color: 'rgba(255,255,255,0.70)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                    >
                      {cat.tagline}
                    </p>
                    <span
                      className="text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 md:px-4 py-1 md:py-1.5 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.30)',
                        color: 'white',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      Jetzt abstimmen
                    </span>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
