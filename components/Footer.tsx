import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Logo — left */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/weleda-logo.svg"
            alt="WELEDA"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Copyright — center */}
        <p className="text-sm text-gray-500 order-3 sm:order-2">
          © {year} WELEDA AG. All rights reserved.
        </p>

        {/* Links — right */}
        <nav className="flex items-center gap-4 text-sm order-2 sm:order-3">
          <Link
            href="/privacy"
            className="text-gray-500 hover:text-[#0b4535] transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300" aria-hidden="true">
            |
          </span>
          <Link
            href="/imprint"
            className="text-gray-500 hover:text-[#0b4535] transition-colors"
          >
            Imprint
          </Link>
        </nav>
      </div>
    </footer>
  )
}
