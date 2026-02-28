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
  'vanilla-cloud': {
    key: 'vanilla-cloud',
    label: 'Vanilla Cloud',
    hashtag: '#VanillaCloud',
    tagline: 'Soft · Warm · Sensual',
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
    modelImage:
      '/img/Vanilla_Ausschnitt.jpg',
  },
  'mystic-aura': {
    key: 'mystic-aura',
    label: 'Mystic Aura',
    hashtag: '#MysticAura',
    tagline: 'Bold · Mysterious · Enchanting',
    primary: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#EDE9FE',
    bg: '#F5F3FF',
    border: '#C4B5FD',
    glow: 'rgba(124,58,237,0.3)',
    buttonBg: '#7C3AED',
    buttonText: '#fff',
    badgeBg: '#EDE9FE',
    badgeText: '#5B21B6',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #C084FC 100%)',
    gradientSubtle: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    modelImage:
      '/img/Mystic_Ausschnitt.jpg',
  },
  'tropical-crush': {
    key: 'tropical-crush',
    label: 'Tropical Crush',
    hashtag: '#TropicalCrush',
    tagline: 'Fresh · Vibrant · Energizing',
    primary: '#0b4535',
    secondary: '#52B788',
    accent: '#D1FAE5',
    bg: '#F0FDF4',
    border: '#6EE7B7',
    glow: 'rgba(11,69,53,0.3)',
    buttonBg: '#0b4535',
    buttonText: '#fff',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    gradient: 'linear-gradient(135deg, #0b4535 0%, #52B788 50%, #6EE7B7 100%)',
    gradientSubtle: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)',
    modelImage:
      '/img/Tropical_Ausschnitt.jpg',
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
  '✦ Vote for your favourite creator',
  '✦ 3 fragrance categories',
  '✦ One vote per category',
  '✦ Vanilla Cloud · Mystic Aura · Tropical Crush',
  '✦ Campaign runs 13.03 – 17.03.2026',
]
