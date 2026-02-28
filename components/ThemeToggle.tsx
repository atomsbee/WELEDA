'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Monitor, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Render a placeholder with the same size to avoid layout shift
  if (!mounted) {
    return <div style={{ width: '92px', height: '34px', borderRadius: '9999px' }} />
  }

  const options: Array<{ value: string; Icon: React.ElementType; label: string }> = [
    { value: 'light', Icon: Sun, label: 'Light theme' },
    { value: 'system', Icon: Monitor, label: 'System theme' },
    { value: 'dark', Icon: Moon, label: 'Dark theme' },
  ]

  return (
    <div
      role="group"
      aria-label="Theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-chip)',
        border: '1px solid var(--border-chip)',
        borderRadius: '9999px',
        padding: '3px',
        gap: '1px',
      }}
    >
      {options.map(({ value, Icon, label }) => {
        const isActive = theme === value
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={isActive}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s ease, color 0.2s ease',
              background: isActive
                ? 'linear-gradient(135deg, #7C3AED, #B478FF)'
                : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <Icon size={13} strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}
