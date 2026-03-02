'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const VIDEO_SRC = 'https://weleda-voting-videos.s3.eu-central-1.amazonaws.com/video/videoplayback.mp4'
const VIDEO_POSTER = '/img/maxresdefault.jpg'

interface StepCard {
  num: number
  accent: string
  title: string
  body?: React.ReactNode
  items?: { icon: string; text: React.ReactNode }[]
}

const STEP_CARDS: StepCard[] = [
  {
    num: 1,
    accent: 'rgb(124,58,237)',
    title: 'Video erstellen',
    body: (
      <>
        Bewirb dich mit einem <strong>Video auf TikTok oder Instagram</strong> (mind. 30 Sek, max. 5 Min). Zeig, warum <strong>genau DU</strong> eines der drei neuen Faces unserer <strong>WELEDA Summer Body & Hair Mist Campaign</strong> werden solltest.
      </>
    ),
  },
  {
    num: 2,
    accent: 'rgb(244,114,182)',
    title: 'Produkt vorstellen',
    body: (
      <>
        Stell uns deine liebsten <strong>WELEDA Serum Booster Drops und/oder das UV Glow Fluid</strong> vor. Was feierst du daran? Wann benutzt du es? Warum passt es perfekt zu dir?
      </>
    ),
  },
  {
    num: 3,
    accent: 'rgb(251,191,36)',
    title: 'Wichtige Regeln',
    items: [
      { icon: '🎬', text: <>Lade dein Video als <strong>Feed-Post oder Reel auf TikTok oder Instagram</strong> hoch (keine Story)</> },
      { icon: '📍', text: 'Folge und markiere @weleda (IG & TikTok)' },
      { icon: '#️⃣', text: <><strong>#weledacasting #weledafragrancemists</strong></> },
    ],
  },
]

export default function HowToSection() {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [seeking, setSeeking] = useState(false)

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = useCallback(() => {
    const v = playerRef.current
    if (!v || !v.duration || seeking) return
    setPlayed(v.currentTime / v.duration)
  }, [seeking])

  const handleSeekMouseDown = useCallback(() => setSeeking(true), [])
  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value))
  }, [])
  const handleSeekMouseUp = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    const v = playerRef.current
    if (v && v.duration) v.currentTime = parseFloat((e.target as HTMLInputElement).value) * v.duration
  }, [])

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    setIsMuted(v === 0)
  }, [])
  const handleMuteToggle = useCallback(() => setIsMuted(m => !m), [])

  useEffect(() => {
    const v = playerRef.current
    if (!v) return
    if (isPlaying) {
      v.play().catch(() => setIsPlaying(false))
    } else {
      v.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const v = playerRef.current
    if (v) v.volume = volume
  }, [volume])

  useEffect(() => {
    const v = playerRef.current
    if (v) v.muted = isMuted
  }, [isMuted])

  return (
    <section id="how-to-section" className="w-section w-section-flush-top">
      <div className="w-container space-y-12 md:space-y-16">

        {/* ── STEP CARDS ────────────────────────────────────── */}
        <div>
          <div className="w-reveal w-d0 flex flex-col items-center justify-center mb-10 md:mb-14" data-animation="fade-up">
            <p className="w-eyebrow">SO FUNKTIONIERT ES</p>
            <h2 className="w-h2">
              Und so{' '}
              <span className="w-gradient-text">geht&apos;s.</span>
            </h2>
            <p
              className="hidden md:block text-sm leading-relaxed text-right flex-shrink-0 mt-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Poste dein Bewerbungsvideo, überzeuge uns und die Community — und flieg mit uns nach Teneriffa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STEP_CARDS.map((card) => (
              <div
                key={card.num}
                className={`w-reveal w-d${card.num} relative rounded-2xl p-7 md:p-8 overflow-hidden
                           hover:-translate-y-1 transition-transform duration-300`}
                data-animation="fade-up"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <span
                  className="absolute top-4 right-6 font-black select-none pointer-events-none"
                  style={{ fontSize: '80px', lineHeight: 1, opacity: 0.06, color: card.accent }}
                  aria-hidden="true"
                >
                  {card.num}
                </span>

                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: card.accent }} />
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: card.accent }}>
                    Schritt {card.num}
                  </p>
                </div>

                <h3 className="font-black text-xl mb-3" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>

                {card.items ? (
                  <ul className="space-y-3">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                        <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {card.body}
                  </p>
                )}
              </div>
            ))}

            {/* Card 4 — CTA + availability */}
            <div
              className="w-reveal w-d4 relative rounded-2xl p-7 md:p-8 overflow-hidden
                         hover:-translate-y-1 transition-transform duration-300"
              data-animation="fade-up"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(244,114,182,0.07))',
                border: '1px solid rgba(124,58,237,0.20)',
              }}
            >
              <p
                className="text-2xl md:text-3xl font-black mb-5 leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Let&apos;s go – wir wollen DICH sehen 💚
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                Mit deiner Teilnahme garantierst du uns, dass du vom{' '}
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  22.03.2026 – 26.03.2026
                </span>{' '}
                für das Live-Casting und die mögl. anschließende Produktion zur Verfügung stehst.
              </p>
              <Link
                href="/nutzungsbedingungen"
                className="inline-flex items-center gap-1 text-sm font-semibold
                           underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: 'rgb(124,58,237)' }}
              >
                Alle Teilnahmebedingungen →
              </Link>
            </div>
          </div>
        </div>

        {/* ── VIDEO EMBED ───────────────────────────────────── */}
        <div
          className="w-reveal w-d1 relative w-full rounded-2xl overflow-hidden group/video"
          data-animation="fade-up"
          style={{ aspectRatio: '16/9' }}
        >
          <div className="absolute inset-0">
            <video
              ref={playerRef}
              src={VIDEO_SRC}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (playerRef.current) setDuration(playerRef.current.duration)
              }}
              onEnded={() => { setIsPlaying(false); setHasEnded(true); setPlayed(0) }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Poster + play button — before first play OR after video ends */}
          {(!hasStarted || hasEnded) && (
            <div
              className="absolute inset-0 cursor-pointer group z-[3]"
              onClick={() => {
                setHasStarted(true)
                setHasEnded(false)
                setPlayed(0)
                const v = playerRef.current
                if (v) v.currentTime = 0
                setIsPlaying(true)
              }}
            >
              <Image
                src={VIDEO_POSTER}
                alt="WELEDA Erklärvideo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              {/* Brand color tint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(244,114,182,0.25), rgba(124,58,237,0.20))',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Bottom fade for text readability */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 40%, transparent 65%)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="md:w-20 md:h-20 w-14 h-14 rounded-full flex items-center justify-center
                             group-hover:scale-110 transition-transform duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '2px solid rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <svg className="w-8 h-8 ml-1.5" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Click anywhere on video to toggle play/pause + centered play button when paused */}
          {hasStarted && !hasEnded && (
            <div
              className="absolute inset-0 cursor-pointer z-[1] flex items-center justify-center"
              onClick={() => setIsPlaying(p => !p)}
            >
              {!isPlaying && (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center
                             transition-transform duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(0,0,0,0.45)',
                    border: '2px solid rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <svg className="w-8 h-8 ml-1.5" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Custom control bar */}
          {hasStarted && !hasEnded && (
            <div
              className={`absolute bottom-0 left-0 right-0 z-[2] transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'
                }`}
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                paddingBottom: '14px',
              }}
            >
              <div className="px-4 pb-2 pt-8">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onTouchStart={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  onTouchEnd={() => {
                    setSeeking(false)
                    const v = playerRef.current
                    if (v && v.duration) v.currentTime = played * v.duration
                  }}
                  className="w-full cursor-pointer appearance-none"
                  style={{ accentColor: '#B478FF', height: '4px' }}
                />
              </div>

              <div className="px-4 flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                             hover:scale-110 transition-transform duration-150"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <span className="text-white text-xs font-mono flex-shrink-0 tabular-nums">
                  {formatTime(played * duration)} / {formatTime(duration)}
                </span>

                <div className="flex-1" />

                <button
                  onClick={handleMuteToggle}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                             hover:scale-110 transition-transform duration-150"
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                  className="w-20 cursor-pointer appearance-none flex-shrink-0"
                  style={{ accentColor: '#B478FF', height: '4px' }}
                />

                <button
                  onClick={() => {
                    const container = playerRef.current?.parentElement?.parentElement
                    if (!container) return
                    if (document.fullscreenElement) {
                      document.exitFullscreen()
                    } else {
                      container.requestFullscreen()
                    }
                  }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                             hover:scale-110 transition-transform duration-150 ml-1"
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
