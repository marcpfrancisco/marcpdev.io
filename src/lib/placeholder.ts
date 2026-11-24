/**
 * Honest image placeholders (antislop R-23): placehold.co frames in the page's own colours,
 * printing only their dimensions, so they never pass for a real photo or screenshot.
 * Replace each slot with the real asset when Marc supplies it.
 * CSP note: needs `img-src https://placehold.co` until every placeholder is gone.
 */

/** paper-3 ground and muted ink from tokens.css, as hex (placehold.co takes hex only). */
const GROUND = '1c1c21';
const INK = '9a9aa6';

export interface Placeholder {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export function placeholder(width: number, height: number): Placeholder {
  return {
    src: `https://placehold.co/${String(width)}x${String(height)}/${GROUND}/${INK}`,
    width,
    height,
  };
}
