import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/weleda.ag',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
        <path fill="currentColor" d="M21 12.055C21 7.054 16.97 3 12.001 3 7.03 3.001 3 7.054 3 12.056c0 4.519 3.291 8.265 7.593 8.944v-6.327H8.309v-2.617h2.286V10.06c0-2.27 1.344-3.522 3.4-3.522.985 0 2.014.176 2.014.176v2.228h-1.135c-1.117 0-1.466.698-1.466 1.415v1.698h2.495l-.398 2.617h-2.098v6.327C17.71 20.319 21 16.574 21 12.055Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/weleda/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
        <path fill="currentColor" d="M12 3.5c-2.307 0-2.597.01-3.503.051-.906.042-1.524.185-2.064.395a4.144 4.144 0 0 0-1.506.98 4.144 4.144 0 0 0-.98 1.506c-.211.54-.355 1.159-.396 2.062C3.511 9.402 3.5 9.69 3.5 12c0 2.308.01 2.597.051 3.503.042.905.185 1.523.395 2.063.218.56.508 1.033.98 1.506.473.473.947.764 1.505.98.542.211 1.159.355 2.064.396.907.04 1.196.051 3.505.051s2.597-.01 3.504-.051c.904-.043 1.524-.185 2.065-.395a4.144 4.144 0 0 0 1.504-.98c.473-.474.763-.948.98-1.507.21-.54.354-1.158.396-2.063.04-.906.051-1.195.051-3.504s-.01-2.598-.051-3.505c-.043-.904-.186-1.523-.395-2.062a4.144 4.144 0 0 0-.98-1.506 4.144 4.144 0 0 0-1.507-.98c-.541-.211-1.16-.355-2.064-.396-.907-.04-1.195-.051-3.505-.051H12Zm-.762 1.532h.763c2.27 0 2.538.008 3.434.049.829.037 1.28.176 1.579.292.396.154.68.34.977.637.298.297.482.58.636.977.117.299.255.75.292 1.578.041.896.05 1.164.05 3.433 0 2.268-.009 2.538-.05 3.434-.037.829-.176 1.278-.292 1.578a2.655 2.655 0 0 1-.637.976c-.297.298-.58.481-.977.636-.298.116-.748.255-1.578.293-.896.04-1.164.05-3.434.05-2.27 0-2.54-.01-3.435-.05-.829-.038-1.278-.177-1.578-.293a2.656 2.656 0 0 1-.977-.636 2.655 2.655 0 0 1-.638-.977c-.116-.299-.255-.75-.292-1.578-.04-.896-.049-1.165-.049-3.435s.009-2.537.049-3.433c.038-.829.176-1.28.293-1.58.154-.395.34-.68.637-.977.297-.297.58-.48.977-.635.3-.117.75-.255 1.578-.293.784-.036 1.088-.047 2.672-.048v.002Zm5.3 1.411a1.02 1.02 0 1 0 0 2.04 1.02 1.02 0 0 0 0-2.04ZM12 7.635a4.366 4.366 0 1 0-.136 8.732 4.366 4.366 0 0 0 .136-8.732Zm0 1.531a2.834 2.834 0 1 1 0 5.668 2.834 2.834 0 0 1 0-5.668Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/user/weleda',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
        <path fill="currentColor" d="M12.058 5.65h.1c.925.003 5.61.037 6.874.377a2.261 2.261 0 0 1 1.592 1.597c.114.428.194.994.248 1.578l.011.117.025.292.009.117c.073 1.029.082 1.992.083 2.202v.084a36.093 36.093 0 0 1-.092 2.318l-.01.118-.01.117c-.056.644-.139 1.283-.264 1.753a2.26 2.26 0 0 1-1.592 1.598c-1.305.35-6.265.375-6.953.377h-.16c-.347 0-1.785-.007-3.293-.059l-.19-.007-.099-.004-.192-.008-.192-.008c-1.25-.055-2.438-.144-2.986-.293a2.262 2.262 0 0 1-1.592-1.596c-.125-.47-.208-1.11-.265-1.753l-.009-.118-.009-.117A34.874 34.874 0 0 1 3 12.042v-.139c.002-.242.011-1.078.072-2l.008-.116.003-.059.01-.117.024-.292.011-.117c.054-.584.134-1.151.248-1.578a2.261 2.261 0 0 1 1.592-1.597c.548-.146 1.737-.236 2.986-.293l.19-.008.194-.006.097-.004.193-.008c1.07-.034 2.142-.053 3.213-.057l.217-.001ZM10.2 9.26v5.421l4.676-2.71-4.677-2.71Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://ch.linkedin.com/company/weleda',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
        <path fill="currentColor" d="M4 5.146C4 4.513 4.526 4 5.175 4h13.65C19.474 4 20 4.513 20 5.146v13.708c0 .633-.526 1.146-1.175 1.146H5.175C4.526 20 4 19.487 4 18.854V5.146Zm4.943 12.248v-7.225H6.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212v-4.035c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V13.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025v-1.022h-2.4c.03.678 0 7.225 0 7.225h2.4Z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://www.pinterest.de/weledaag/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
        <path fill="currentColor" d="M12.006 3a9 9 0 0 0-3.28 17.384c-.079-.712-.15-1.807.03-2.584a4473.5 4473.5 0 0 1 1.056-4.475s-.269-.539-.269-1.335c0-1.252.726-2.186 1.63-2.186.766 0 1.138.576 1.138 1.268 0 .772-.492 1.926-.746 2.996-.212.895.45 1.627 1.333 1.627 1.6 0 2.83-1.688 2.83-4.123 0-2.154-1.55-3.66-3.76-3.66-2.561 0-4.064 1.92-4.064 3.905 0 .774.298 1.603.67 2.054a.27.27 0 0 1 .062.259c-.068.283-.22.895-.25 1.02-.039.164-.13.2-.301.12-1.125-.523-1.827-2.166-1.827-3.487 0-2.839 2.063-5.445 5.947-5.445 3.122 0 5.549 2.224 5.549 5.197 0 3.102-1.957 5.599-4.67 5.599-.913 0-1.77-.474-2.064-1.034l-.56 2.14c-.204.781-.753 1.761-1.12 2.359a9 9 0 1 0 2.666-17.6Z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--bg-footer)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-footer)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        {/* Top row: logo left, social icons right */}
        <div className="flex items-center justify-between py-6">
          <Link href="/" aria-label="WELEDA home" className="flex-shrink-0">
            <Image
              src="/img/weleda-logo-white.svg"
              alt="WELEDA"
              width={120}
              height={40}
              className="h-8 w-auto weleda-logo"
            />
          </Link>

          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-chip)',
                }}
              >
                <span style={{ color: 'var(--text-chip)' }} className="group-hover:opacity-100 opacity-70 transition-opacity duration-200">
                  {s.icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border-footer)' }} />

        {/* Bottom: copyright + legal */}
        <div className="py-5 flex flex-col items-center gap-3">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {year} WELEDA AG. Alle Rechte vorbehalten.
          </p>
          <nav className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="footer-nav-link">Datenschutz</Link>
            <span aria-hidden="true" style={{ color: 'var(--text-faint)' }}>|</span>
            <Link href="/terms" className="footer-nav-link">Teilnahmebedingungen</Link>
            <span aria-hidden="true" style={{ color: 'var(--text-faint)' }}>|</span>
            <Link href="/imprint" className="footer-nav-link">Impressum</Link>
          </nav>
        </div>

      </div>
    </footer>
  )
}
