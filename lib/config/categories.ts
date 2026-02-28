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
  // ── Vanilla Cloud ── Soft pink tones
  'vanilla-cloud': {
    key: 'vanilla-cloud',
    label: 'Vanilla Cloud',
    hashtag: '#VanillaCloud',
    tagline: 'Soft · Warm · Sensual',
    primary: '#DB2777',
    secondary: '#FBCFE8',
    accent: '#FCE7F3',
    bg: '#FDF2F8',
    border: '#F9A8D4',
    glow: 'rgba(219,39,119,0.25)',
    buttonBg: '#DB2777',
    buttonText: '#fff',
    badgeBg: '#FCE7F3',
    badgeText: '#9D174D',
    gradient: 'linear-gradient(135deg, #BE185D 0%, #DB2777 50%, #EC4899 100%)',
    gradientSubtle: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
    modelImage: '/img/Vanilla_Ausschnitt.jpg',
  },
  // ── Mystic Aura ── Warm golden / amber tones
  'mystic-aura': {
    key: 'mystic-aura',
    label: 'Mystic Aura',
    hashtag: '#MysticAura',
    tagline: 'Bold · Mysterious · Enchanting',
    primary: '#C7933A',
    secondary: '#E8C97A',
    accent: '#F5E6C8',
    bg: '#FEF9F0',
    border: '#E8C97A',
    glow: 'rgba(199,147,58,0.3)',
    buttonBg: '#C7933A',
    buttonText: '#fff',
    badgeBg: '#FEF3DC',
    badgeText: '#92600A',
    gradient: 'linear-gradient(135deg, #C7933A 0%, #E8C97A 50%, #F5C842 100%)',
    gradientSubtle: 'linear-gradient(135deg, #FEF9F0 0%, #FEF3DC 100%)',
    modelImage: '/img/Mystic_Ausschnitt.jpg',
  },
  // ── Tropical Crush ── Cool blue tones
  'tropical-crush': {
    key: 'tropical-crush',
    label: 'Tropical Crush',
    hashtag: '#TropicalCrush',
    tagline: 'Fresh · Vibrant · Energizing',
    primary: '#1D4ED8',
    secondary: '#93C5FD',
    accent: '#DBEAFE',
    bg: '#EFF6FF',
    border: '#93C5FD',
    glow: 'rgba(29,78,216,0.3)',
    buttonBg: '#1D4ED8',
    buttonText: '#fff',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    gradient: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #93C5FD 100%)',
    gradientSubtle: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    modelImage: '/img/Tropical_Ausschnitt.jpg',
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
  '/img/Vanilla_Cloud_ingredients_final_square.jpg'

export const MARQUEE_ITEMS = [
  '✦ Community Vote 13.–17.03.2026',
  '✦ Vanilla Cloud · Mystic Aura · Tropical Crush',
  '✦ 3 neue Kampagnengesichter gesucht',
  '✦ Jetzt für deinen Fave voten',
  '✦ Live-Casting auf Teneriffa 22.–25.03.',
  '✦ #weledacasting #fragrancemists',
  '✦ 1× täglich abstimmen',
  '✦ Werde das Gesicht der WELEDA Fragrance Campaign',
]
