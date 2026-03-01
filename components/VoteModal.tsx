'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import type { Influencer } from '@/types'
import { getCategoryConfig, CATEGORIES, CATEGORY_KEYS } from '@/lib/config/categories'

const voteSchema = z.object({
  name: z.string().min(2, 'Mindestens 2 Zeichen erforderlich').max(100, 'Maximal 100 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  gdprConsent: z.boolean().refine((v) => v === true, 'Bitte stimme der Datenschutzerklärung zu.'),
  honeypot: z.string().optional(),
})

type VoteFormFields = z.infer<typeof voteSchema>

type ModalState = 'form' | 'loading' | 'success' | 'already_voted' | 'error'

interface VoteModalProps {
  influencer: Influencer | null
  onClose: () => void
  onVoteSuccess?: (influencerId: string, newVoteCount?: number) => void
}

const slideVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function VoteModal({ influencer, onClose, onVoteSuccess }: VoteModalProps) {
  const [modalState, setModalState] = useState<ModalState>('form')
  const [submittedName, setSubmittedName] = useState('')
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const cat = getCategoryConfig(influencer?.category ?? null)

  const otherCategories = CATEGORY_KEYS
    .filter((k) => k !== influencer?.category)
    .map((k) => CATEGORIES[k])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VoteFormFields>({
    resolver: zodResolver(voteSchema),
    defaultValues: { name: '', email: '', gdprConsent: false, honeypot: '' },
  })

  if (!influencer) return null

  const accentColor = cat?.primary ?? '#7C3AED'
  const btnStyle = cat
    ? { background: cat.gradient, color: '#fff' }
    : { background: 'linear-gradient(135deg, #7C3AED, #B478FF)', color: '#fff' }

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-input)',
    color: 'var(--text-primary)',
    borderRadius: '0.75rem',
  }

  const onSubmit = async (data: VoteFormFields) => {
    setModalState('loading')
    setSubmittedName(data.name)

    try {
      const res = await fetch('/api/votes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          influencerId: influencer.id,
          category: influencer.category,
          honeypot: data.honeypot ?? '',
        }),
      })

      const json = (await res.json()) as {
        success?: boolean
        error?: string
        data?: { newVoteCount?: number }
      }

      if (json.success) {
        setModalState('success')
        onVoteSuccess?.(influencer.id, json.data?.newVoteCount)
      } else if (json.error === 'already_voted') {
        setModalState('already_voted')
      } else {
        setModalState('error')
      }
    } catch {
      setModalState('error')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        style={{ background: 'var(--bg-modal-overlay)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
          style={{
            background: 'var(--bg-modal)',
            backdropFilter: 'blur(40px)',
            border: '1px solid var(--border-modal)',
            boxShadow: isDark
              ? '0 25px 80px rgba(0,0,0,0.7), 0 0 40px rgba(180,120,255,0.1)'
              : '0 25px 80px rgba(90,60,130,0.18), 0 0 40px rgba(140,80,220,0.08)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Category accent bar */}
          {cat && (
            <div className="h-1.5 w-full" style={{ background: cat.gradient }} />
          )}

          {/* Header */}
          <div
            className="flex items-center justify-between p-5"
            style={{ borderBottom: '1px solid var(--border-nav)' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--border-input)' }}>
                <Image
                  src={influencer.photo_url}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Für {influencer.name} voten
                </p>
                {cat ? (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={isDark
                      ? { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }
                      : { background: 'var(--bg-chip)', border: '1px solid var(--border-chip)', color: 'var(--text-chip)' }
                    }
                  >
                    {cat.hashtag}
                  </span>
                ) : (
                  <p className="text-xs" style={{ color: accentColor }}>
                    {influencer.handle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'var(--bg-chip)',
                border: '1px solid var(--border-chip)',
              }}
              aria-label="Schließen"
            >
              <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 overflow-hidden">
            <AnimatePresence mode="wait">

              {/* FORM / LOADING */}
              {(modalState === 'form' || modalState === 'loading') && (
                <motion.div
                  key="form"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Dein Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Vor- und Nachname"
                        disabled={modalState === 'loading'}
                        className="w-full px-4 py-3 text-sm focus:outline-none disabled:opacity-50 transition-all"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = accentColor
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}25`
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-input)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Deine E-Mail-Adresse <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="name@example.com"
                        disabled={modalState === 'loading'}
                        className="w-full px-4 py-3 text-sm focus:outline-none disabled:opacity-50 transition-all"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = accentColor
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}25`
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-input)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Honeypot */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input
                        {...register('honeypot')}
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* GDPR */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          {...register('gdprConsent')}
                          type="checkbox"
                          disabled={modalState === 'loading'}
                          className="mt-0.5 w-4 h-4 flex-shrink-0"
                          style={{ accentColor }}
                        />
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                          <a href="/datenschutz" target="_blank" className="underline hover:no-underline" style={{ color: accentColor }}>
                            Datenschutzerklärung
                          </a>{' '}
                          zu.
                        </span>
                      </label>
                      {errors.gdprConsent && (
                        <p className="text-red-400 text-xs mt-1">{errors.gdprConsent.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={modalState === 'loading' || !isValid}
                      className="w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                      style={btnStyle}
                    >
                      {modalState === 'loading' ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Wird gesendet…
                        </>
                      ) : (
                        'Jetzt abstimmen'
                      )}
                    </button>

                    {/* Confirmation note */}
                    <p className="text-center text-xs leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                      Mit deiner Stimmabgabe stimmst du unseren{' '}
                      <a href="/nutzungsbedingungen" target="_blank" className="underline hover:no-underline" style={{ color: accentColor }}>
                        Teilnahmebedingungen
                      </a>{' '}
                      zu. 1 Vote pro Kategorie.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* SUCCESS */}
              {modalState === 'success' && (
                <motion.div
                  key="success"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-center py-6 space-y-4"
                >
                  {/* Confetti + checkmark */}
                  <div className="relative flex items-center justify-center h-20">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full pointer-events-none"
                        style={{ backgroundColor: i % 2 === 0 ? accentColor : '#E8C97A' }}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i / 12) * Math.PI * 2) * 60,
                          y: Math.sin((i / 12) * Math.PI * 2) * 60,
                          opacity: [1, 1, 0],
                        }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                      />
                    ))}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: cat?.gradient ?? 'linear-gradient(135deg, #7C3AED, #B478FF)' }}
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      Danke für deinen Vote! 💜
                    </h3>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-chip)' }}>
                      Du hast für{' '}
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{influencer.name}</span>{' '}
                      in der Kategorie{' '}
                      <span className="font-semibold" style={{ color: accentColor }}>{cat?.label ?? 'dieser Kategorie'}</span>{' '}
                      abgestimmt. Du kannst noch in weiteren Kategorien abstimmen — entscheide weise!
                    </p>
                  </div>

                  {otherCategories.length > 0 && (
                    <div
                      className="rounded-xl p-4 text-left"
                      style={{ background: 'var(--bg-chip)', border: '1px solid var(--border-chip)' }}
                    >
                      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Du kannst noch in anderen Kategorien abstimmen:
                      </p>
                      <div className="flex flex-col gap-2">
                        {otherCategories.map((oc) => (
                          <div
                            key={oc.key}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                            style={{
                              background: 'var(--bg-input)',
                              border: '1px solid var(--border-input)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: oc.primary }} />
                            {oc.label}
                            <span className="ml-auto text-[10px]" style={{ color: 'var(--text-faint)' }}>{oc.hashtag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity text-white"
                    style={btnStyle}
                  >
                    Schließen
                  </button>
                </motion.div>
              )}

              {/* ALREADY VOTED */}
              {modalState === 'already_voted' && (
                <motion.div
                  key="already_voted"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-center py-6 space-y-4"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'var(--bg-chip)', border: '1px solid var(--border-chip)' }}
                  >
                    <span className="text-3xl">💚</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      Du hast in dieser Kategorie bereits abgestimmt.
                    </h3>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                      Schau dir die anderen Kategorien an!
                    </p>
                  </div>

                  {otherCategories.length > 0 && (
                    <div
                      className="rounded-xl p-4 text-left"
                      style={{ background: 'var(--bg-chip)', border: '1px solid var(--border-chip)' }}
                    >
                      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Du kannst noch in anderen Kategorien abstimmen:
                      </p>
                      <div className="flex flex-col gap-2">
                        {otherCategories.map((oc) => (
                          <div
                            key={oc.key}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                            style={{
                              background: 'var(--bg-input)',
                              border: '1px solid var(--border-input)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: oc.primary }} />
                            {oc.label}
                            <span className="ml-auto text-[10px]" style={{ color: 'var(--text-faint)' }}>{oc.hashtag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full font-medium text-sm transition-all"
                    style={{
                      background: 'var(--bg-chip)',
                      border: '1px solid var(--border-chip)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Schließen
                  </button>
                </motion.div>
              )}

              {/* ERROR */}
              {modalState === 'error' && (
                <motion.div
                  key="error"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-center py-6 space-y-4"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Etwas ist schiefgelaufen.</h3>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Bitte versuche es erneut oder lade die Seite neu.</p>
                  </div>
                  <button
                    onClick={() => setModalState('form')}
                    className="w-full py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity text-white"
                    style={btnStyle}
                  >
                    Nochmal versuchen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
