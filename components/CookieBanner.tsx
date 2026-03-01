'use client'

import { useState, useEffect } from 'react'

const CONSENT_KEY = 'weleda-cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
    // Inject GA4 script only after acceptance
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA4_ID) {
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`
      script.async = true
      document.head.appendChild(script)
    }
  }

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'var(--bg-cookie)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-cookie)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
          This website uses cookies for anonymous analytics.{' '}
          <a href="/datenschutz" className="text-[#B478FF] underline hover:no-underline">
            Learn more
          </a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: 'var(--bg-chip)',
              border: '1px solid var(--border-chip)',
              color: 'var(--text-muted)',
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #B478FF)', color: '#ffffff' }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
