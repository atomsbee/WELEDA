'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Influencer } from '@/types'

const voteSchema = z.object({
  name: z.string().min(2, 'At least 2 characters required').max(100, 'Maximum 100 characters'),
  email: z.string().email('Invalid email address'),
  gdprConsent: z.boolean().refine((v) => v === true, 'Please accept the privacy policy.'),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VoteFormFields>({
    resolver: zodResolver(voteSchema),
    defaultValues: { name: '', email: '', gdprConsent: false, honeypot: '' },
  })

  if (!influencer) return null

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
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-weleda-card-border">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={influencer.photo_url}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-weleda-dark">
                  Vote for {influencer.name}
                </p>
                <p className="text-xs" style={{ color: '#52B788' }}>
                  {influencer.handle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* FORM / LOADING STATE */}
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
                      <label className="block text-sm font-medium text-weleda-dark mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="First and last name"
                        disabled={modalState === 'loading'}
                        className="w-full px-4 py-3 rounded-xl border border-weleda-card-border text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green disabled:opacity-60 transition-colors"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-weleda-dark mb-1.5">
                        Your Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="name@example.com"
                        disabled={modalState === 'loading'}
                        className="w-full px-4 py-3 rounded-xl border border-weleda-card-border text-sm focus:outline-none focus:border-weleda-green focus:ring-1 focus:ring-weleda-green disabled:opacity-60 transition-colors"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Honeypot — visually hidden */}
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
                          className="mt-0.5 w-4 h-4 accent-weleda-green flex-shrink-0"
                        />
                        <span className="text-xs text-weleda-muted leading-relaxed">
                          I agree to the processing of my data in accordance with the{' '}
                          <a
                            href="/privacy"
                            target="_blank"
                            className="text-weleda-green underline hover:no-underline"
                          >
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                      {errors.gdprConsent && (
                        <p className="text-red-500 text-xs mt-1">{errors.gdprConsent.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={modalState === 'loading' || !isValid}
                      className="w-full py-3.5 rounded-full bg-weleda-green text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-opacity-90 flex items-center justify-center gap-2"
                    >
                      {modalState === 'loading' ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Vote'
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* SUCCESS STATE */}
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
                  {/* Checkmark + confetti */}
                  <div className="relative flex items-center justify-center h-20">
                    {/* Confetti burst */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full pointer-events-none"
                        style={{ backgroundColor: i % 2 === 0 ? '#0b4535' : '#D4A853' }}
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
                    {/* Checkmark circle */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: '#0b4535' }}
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-weleda-dark">Your vote has been counted!</h3>
                    <p className="text-weleda-muted text-sm mt-2">
                      Thank you {submittedName}, you voted for{' '}
                      <span className="font-semibold text-weleda-green">{influencer.name}</span>.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full bg-weleda-green text-white font-bold text-sm hover:bg-opacity-90 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              )}

              {/* ALREADY VOTED STATE */}
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
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                    <span className="text-3xl">💚</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-weleda-dark">You have already voted!</h3>
                    <p className="text-weleda-muted text-sm mt-2">
                      You have already voted for this creator. Only one vote per creator is allowed.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full border border-weleda-card-border text-weleda-dark font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              )}

              {/* ERROR STATE */}
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
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-weleda-dark">Something went wrong.</h3>
                    <p className="text-weleda-muted text-sm mt-2">
                      Please try again or reload the page.
                    </p>
                  </div>
                  <button
                    onClick={() => setModalState('form')}
                    className="w-full py-3 rounded-full bg-weleda-green text-white font-medium text-sm hover:bg-opacity-90 transition-colors"
                  >
                    Try Again
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
