import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-8 px-4 sm:px-8" style={{ background: '#0b4535' }}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Logo — left */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/weleda-logo-white.svg"
            alt="WELEDA"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Copyright — center */}
        <p className="text-sm order-3 sm:order-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          © {year} WELEDA AG. All rights reserved.
        </p>

        {/* Links — right */}
        <nav className="flex items-center gap-6 text-sm order-2 sm:order-3">
          <Link
            href="/privacy"
            className="text-white/70 hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <span className="text-white/30" aria-hidden="true">
            |
          </span>
          <Link
            href="/imprint"
            className="text-white/70 hover:text-white transition-colors duration-200"
          >
            Imprint
          </Link>
        </nav>
      </div>
    </footer>
  )
}
