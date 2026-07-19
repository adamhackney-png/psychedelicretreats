export const SITE = {
  name: 'Psychedelic Retreats Australia',
  shortName: 'Psychedelic Retreats',
  url: 'https://psychedelicretreats.com.au',
  description:
    'An independent Australian directory and information hub for legal psychedelic retreats, Australian clinical services, breathwork retreats, and integration support.',
  contactEmail: 'info@psychedelicretreats.com.au',
  ownerName: 'Adam Hackney',
  twitter: '@psychedelicretreatsau',
} as const;

export const NAV_LINKS = [
  { label: 'Retreats', href: '/retreats/' },
  { label: 'Clinics', href: '/clinics/ketamine/' },
  { label: 'Integration', href: '/integration/' },
  { label: 'Destinations', href: '/destinations/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'News', href: '/news/' },
  { label: 'Tools', href: '/tools/retreat-match/' },
] as const;

export const RETREAT_CATEGORIES = [
  { slug: 'psilocybin', label: 'Psilocybin Retreats', description: 'Legal facilitated psilocybin retreats abroad.' },
  { slug: 'ayahuasca', label: 'Ayahuasca Retreats', description: 'Traditional and clinical ayahuasca retreats in jurisdictions where it is legal.' },
  { slug: 'san-pedro-and-other', label: 'San Pedro & Other Plant Medicines', description: 'Huachuma / San Pedro and other legally-offered plant medicine retreats.' },
  { slug: 'breathwork', label: 'Breathwork Retreats', description: 'Legal, substance-free consciousness practices — including in Australia.' },
  { slug: 'cannabis', label: 'Cannabis Retreats', description: 'Retreats in jurisdictions with legal cannabis frameworks.' },
  { slug: 'luxury', label: 'Luxury Retreats', description: 'Higher-tier accommodation and service retreats across modalities.' },
] as const;

export const DESTINATIONS = [
  { slug: 'netherlands', name: 'Netherlands' },
  { slug: 'jamaica', name: 'Jamaica' },
  { slug: 'peru', name: 'Peru' },
  { slug: 'costa-rica', name: 'Costa Rica' },
  { slug: 'mexico', name: 'Mexico' },
  { slug: 'oregon', name: 'Oregon, USA' },
  { slug: 'australia', name: 'Australia' },
] as const;

export const PRICE_BANDS: Record<string, string> = {
  under3k: 'Under $3,000 AUD',
  '3k-6k': '$3,000–$6,000 AUD',
  '6k-10k': '$6,000–$10,000 AUD',
  '10kplus': '$10,000+ AUD',
};

export const CRISIS_SUPPORT = {
  name: 'Lifeline',
  phone: '13 11 14',
  url: 'https://www.lifeline.org.au',
};
