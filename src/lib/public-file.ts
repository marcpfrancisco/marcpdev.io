import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * True when a file actually ships from /public (checked at build time).
 * Links to downloadable files render only when this is true, so no link ever 404s.
 */
export function publicFileExists(publicPath: string): boolean {
  return existsSync(join(process.cwd(), 'public', publicPath));
}
