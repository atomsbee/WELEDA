export type CategoryKey = 'vanilla-cloud' | 'mystic-aura' | 'tropical-crush'

export interface CategoryConfig {
  key: CategoryKey
  label: string
  hashtag: string
  tagline: string
  // Colors
  primary: string
  secondary: string
  accent: string
  bg: string
  border: string
  glow: string
  buttonBg: string
  buttonText: string
  badgeBg: string
  badgeText: string
  // Gradients (CSS)
  gradient: string
  gradientSubtle: string
  // Image paths
  modelImage: string
}

export const CATEGORIES: Record<CategoryKey, CategoryConfig> = {
  // ── Gourmand (1) ── Warm golden / amber tones
  'mystic-aura': {
    key: 'mystic-aura',
    label: 'Gourmand',
    hashtag: '#Gourmand',
    tagline: 'Soft · Warm · Sensual',
    primary: '#FBBF24',
    secondary: '#FDE68A',
    accent: '#FEF3C7',
    bg: '#FFFBEB',
    border: '#FDE68A',
    glow: 'rgba(251,191,36,0.30)',
    buttonBg: '#FBBF24',
    buttonText: '#fff',
    badgeBg: '#FEF3DC',
    badgeText: '#92400E',
    gradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 50%, #FDE68A 100%)',
    gradientSubtle: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    modelImage: '/img/Mystic_Ausschnitt.jpg',
  },
  // ── Floriental (2) ── Cool blue tones
  'tropical-crush': {
    key: 'tropical-crush',
    label: 'Floriental',
    hashtag: '#Floriental',
    tagline: 'Bold · Mysterious · Oriental',
    primary: '#60A5FA',
    secondary: '#BAE6FD',
    accent: '#E0F2FE',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    glow: 'rgba(96,165,250,0.30)',
    buttonBg: '#60A5FA',
    buttonText: '#fff',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 50%, #BAE6FD 100%)',
    gradientSubtle: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
    modelImage: '/img/Tropical_Ausschnitt.jpg',
  },
  // ── Fruity (3) ── Soft pink tones
  'vanilla-cloud': {
    key: 'vanilla-cloud',
    label: 'Fruity',
    hashtag: '#Fruity',
    tagline: 'Sweet · Tropical · Vibrant',
    primary: '#F472B6',
    secondary: '#FBCFE8',
    accent: '#FCE7F3',
    bg: '#FDF2F8',
    border: '#FBCFE8',
    glow: 'rgba(244,114,182,0.25)',
    buttonBg: '#F472B6',
    buttonText: '#fff',
    badgeBg: '#FCE7F3',
    badgeText: '#9D174D',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #F472B6 50%, #FBCFE8 100%)',
    gradientSubtle: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
    modelImage: '/img/Vanilla_Ausschnitt.jpg',
  },
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[]

export function getCategoryConfig(key: string | null | undefined): CategoryConfig | null {
  if (!key) return null
  return CATEGORIES[key as CategoryKey] ?? null
}

export const HERO_BG_IMAGE =
  '/img/Weleda_ApplicationShot_Tropical%20Crush_768x1344px_BG%201.png'

export const PRODUCT_IMAGE =
  '/img/hero-product-image.jpg'

export const MARQUEE_ITEMS = [
  '✦ Community Vote 13.–17.03.2026',
  '✦ Gourmand · Floriental · Fruity',
  '✦ 3 neue Kampagnengesichter gesucht',
  '✦ Jetzt für deinen Fave voten',
  '✦ Live-Casting auf Teneriffa 22.–25.03.',
  '✦ #weledacasting #weledafragrancemists',
  '✦ 1× täglich abstimmen',
  '✦ Werde das Gesicht der WELEDA Fragrance Campaign',
]
