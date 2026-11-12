/**
 * Albers-style geometric pattern: small triangles and squares on a loose grid,
 * dense around one anchor point and thinning out with distance. Deterministic
 * per seed, so a listing or category always gets the same arrangement.
 */

export type FieldColor = 'cobalt' | 'forest' | 'tomato' | 'marigold' | 'acid' | 'pink' | 'sky';

/** Background hex + which ink reads on it ('k' = black, 'w' = white on dark). */
export const FIELDS: Record<FieldColor, { bg: string; ink: 'k' | 'w' }> = {
  cobalt: { bg: '#2340e8', ink: 'w' },
  forest: { bg: '#0f6b4a', ink: 'w' },
  tomato: { bg: '#c9341b', ink: 'w' },
  marigold: { bg: '#ffc21a', ink: 'k' },
  acid: { bg: '#5fd35f', ink: 'k' },
  pink: { bg: '#ff9ec0', ink: 'k' },
  sky: { bg: '#9ed8f5', ink: 'k' },
};

export const CATEGORY_FIELD: Record<string, FieldColor> = {
  psilocybin: 'cobalt',
  ayahuasca: 'forest',
  'san-pedro-and-other': 'tomato',
  breathwork: 'marigold',
  cannabis: 'acid',
  luxury: 'pink',
  integration: 'sky',
};

export const FIELD_ORDER: FieldColor[] = ['marigold', 'pink', 'sky', 'cobalt', 'tomato', 'acid', 'forest'];

export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A stable field colour for any slug (used where there is no category colour). */
export function fieldFor(slug: string): FieldColor {
  return FIELD_ORDER[hashSeed(slug) % FIELD_ORDER.length];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PatternOptions {
  seed: number | string;
  ink: 'k' | 'w';
  cols?: number;
  rows?: number;
  /** Where the cluster is densest, as 0–1 fractions of width/height. */
  anchor?: [number, number];
  /** Higher = cluster falls off faster (smaller). */
  reach?: number;
}

const CELL = 20;

export function patternSvg({ seed, ink, cols = 18, rows = 14, anchor = [1, 0], reach = 1.5 }: PatternOptions): string {
  const s = typeof seed === 'string' ? hashSeed(seed) : seed;
  const r = mulberry32(s);
  const solidShare = 0.35 + r() * 0.4;
  const squareShare = 0.08 + r() * 0.25;
  const K = '#0d0d0d';
  const W = '#fbfaf6';
  const parts: string[] = [];
  const f = (n: number) => n.toFixed(1);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const dx = (i + 0.5) / cols - anchor[0];
      const dy = (j + 0.5) / rows - anchor[1];
      const d = Math.hypot(dx, dy);
      let p = Math.max(0, Math.min(0.93, 1.2 - d * reach));
      p *= 0.75 + 0.5 * r();
      if (r() > p) continue;

      const x = i * CELL;
      const y = j * CELL;
      const g = 2.2;
      const a: [number, number] = [x + g, y + g];
      const b: [number, number] = [x + CELL - g, y + g];
      const c: [number, number] = [x + CELL - g, y + CELL - g];
      const e: [number, number] = [x + g, y + CELL - g];
      const isSquare = r() < squareShare;
      let isSolid = r() < solidShare;
      if (d > 0.55 && r() < 0.6) isSolid = false;

      if (isSquare) {
        const sz = CELL * 0.42;
        const o = (CELL - sz) / 2;
        parts.push(
          isSolid
            ? `<rect x="${f(x + o)}" y="${f(y + o)}" width="${f(sz)}" height="${f(sz)}" fill="${ink === 'k' ? K : W}"/>`
            : `<rect x="${f(x + o)}" y="${f(y + o)}" width="${f(sz)}" height="${f(sz)}" fill="none" stroke="${ink === 'k' ? K : W}" stroke-width="1.5"/>`,
        );
      } else {
        const options = [
          [a, b, e],
          [a, b, c],
          [b, c, e],
          [a, c, e],
        ];
        const tri = options[Math.floor(r() * 4)];
        const pts = tri.map(([px, py]) => `${f(px)},${f(py)}`).join(' ');
        parts.push(
          isSolid
            ? `<polygon points="${pts}" fill="${K}"${ink === 'w' ? ' fill-opacity="0.42"' : ''}/>`
            : `<polygon points="${pts}" fill="none" stroke="${ink === 'k' ? K : W}" stroke-width="1.5"/>`,
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols * CELL} ${rows * CELL}" preserveAspectRatio="${anchor[0] >= 0.5 ? 'xMax' : 'xMin'}${anchor[1] >= 0.5 ? 'YMax' : 'YMin'} meet" aria-hidden="true" focusable="false">${parts.join('')}</svg>`;
}
