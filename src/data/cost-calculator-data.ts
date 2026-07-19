export interface DestinationCostProfile {
  slug: string;
  name: string;
  flightLowAUD: number;
  flightHighAUD: number;
  typicalDurationDays: number;
  bufferNights: number;
}

// Flight ranges and typical durations reflect what's published on this site's destination
// pages at time of writing — keep these two files in sync when either changes.
export const DESTINATION_COST_PROFILES: DestinationCostProfile[] = [
  { slug: 'netherlands', name: 'Netherlands', flightLowAUD: 1800, flightHighAUD: 2800, typicalDurationDays: 6, bufferNights: 2 },
  { slug: 'jamaica', name: 'Jamaica', flightLowAUD: 2400, flightHighAUD: 3600, typicalDurationDays: 6, bufferNights: 2 },
  { slug: 'peru', name: 'Peru', flightLowAUD: 2600, flightHighAUD: 4000, typicalDurationDays: 9, bufferNights: 2 },
  { slug: 'costa-rica', name: 'Costa Rica', flightLowAUD: 2600, flightHighAUD: 4000, typicalDurationDays: 7, bufferNights: 2 },
  { slug: 'australia', name: 'Australia (domestic)', flightLowAUD: 200, flightHighAUD: 700, typicalDurationDays: 4, bufferNights: 1 },
];

export const PRICE_BAND_RANGES_AUD: Record<string, { low: number; high: number; label: string }> = {
  under3k: { low: 1500, high: 3000, label: 'Under $3,000 AUD' },
  '3k-6k': { low: 3000, high: 6000, label: '$3,000–$6,000 AUD' },
  '6k-10k': { low: 6000, high: 10000, label: '$6,000–$10,000 AUD' },
  '10kplus': { low: 10000, high: 16000, label: '$10,000+ AUD' },
};

export const INSURANCE_RANGE_AUD = { low: 100, high: 300 };
