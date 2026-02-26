'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  campaignActive: boolean
  endDate: string | null
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function HeroSection({ campaignActive, endDate }: HeroSectionProps) {
  const scrollToGrid = () => {
    const el = document.getElementById('influencer-grid')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0b4535 0%, #0d5240 50%, #0b4535 100%)' }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative leaf elements */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-10">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C50 20 100 80 200 200 L0 200 Z" fill="#52B788" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 200 C150 180 100 120 0 0 L200 0 Z" fill="#52B788" />
        </svg>
      </div>

      {/* Floating background circles */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.06 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.04 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-white pointer-events-none"
        style={{ opacity: 0.05 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-4 py-16 max-w-4xl mx-auto"
      >
        {/* Logo */}
        <motion.div variants={item} className="mb-8">
          <Image
            src="/weleda-logo-white.svg"
            alt="WELEDA"
            width={180}
            height={50}
            priority
            className="w-36 md:w-48"
          />
        </motion.div>

        {/* Gold Badge */}
        <motion.div variants={item} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid #D4A853', color: '#D4A853' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-weleda-gold inline-block" />
            Community Vote · 30 Creators · Your Vote Counts!
            <span className="w-1.5 h-1.5 rounded-full bg-weleda-gold inline-block" />
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-3 leading-none"
        >
          WELEDA&apos;S
          <br />
          <span className="text-weleda-gold">NEXT TOPMODEL</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl font-light italic mb-6"
          style={{ color: '#D4A853' }}
        >
          Community Voting
        </motion.p>

        {/* Body text */}
        <motion.p
          variants={item}
          className="text-white/80 text-base md:text-lg max-w-xl mb-3 leading-relaxed"
        >
          Vote for the next face of WELEDA! Cast your vote for your favourite creator.
        </motion.p>

        {/* Campaign end date */}
        {endDate && (
          <motion.p variants={item} className="text-white/50 text-sm mb-8">
            {campaignActive ? `Voting open until ${endDate}` : `Voting ended on ${endDate}`}
          </motion.p>
        )}

        {/* CTA Button */}
        <motion.button
          variants={item}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={scrollToGrid}
          className="mt-4 w-full sm:w-auto px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase shadow-lg min-h-[52px]"
          style={{ background: '#D4A853', color: '#0b4535' }}
        >
          Vote Now →
        </motion.button>
      </motion.div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#FAFAF8" />
        </svg>
      </div>
    </section>
  )
}
