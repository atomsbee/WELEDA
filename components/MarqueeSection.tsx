'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MARQUEE_ITEMS } from '@/lib/config/categories'

export default function MarqueeSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className='w-section !px-[0]'>
      <div
        className="overflow-hidden py-3"
        style={{
          background: 'var(--bg-card-inner)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid var(--border-nav)',
          borderBottom: '1px solid var(--border-nav)',
        }}
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4">
              <span className="text-xs font-bold tracking-widest uppercase flex-shrink-0" style={{ color: 'var(--text-chip)' }}>
                {item}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: i % 3 === 0 ? '#B478FF' : i % 3 === 1 ? '#E8C97A' : '#52B788' }}
              />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
