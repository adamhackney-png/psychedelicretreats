// Fetched once at build time and memoized so every listing page reuses the same rate.
const FALLBACK_RATE = 1.4293;
const FALLBACK_DATE = '2026-07-20';

let cached: Promise<{ rate: number; date: string }> | null = null;

async function fetchRate(): Promise<{ rate: number; date: string }> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=AUD');
    if (!res.ok) throw new Error(`FX API responded with ${res.status}`);
    const data = (await res.json()) as { date: string; rates: Record<string, number> };
    const rate = data.rates?.AUD;
    if (typeof rate !== 'number') throw new Error('FX API response missing AUD rate');
    return { rate, date: data.date };
  } catch (err) {
    console.warn(`[fx] Live USD→AUD rate fetch failed, using fallback rate: ${err}`);
    return { rate: FALLBACK_RATE, date: FALLBACK_DATE };
  }
}

export function getUsdToAudRate(): Promise<{ rate: number; date: string }> {
  if (!cached) cached = fetchRate();
  return cached;
}

export async function usdToAud(usd: number): Promise<number> {
  const { rate } = await getUsdToAudRate();
  return Math.round(usd * rate);
}
