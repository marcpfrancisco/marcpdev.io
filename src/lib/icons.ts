import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowDown,
  faArrowUpRightFromSquare,
  faBars,
  faEnvelope,
  faFileArrowDown,
  faLock,
  faLockOpen,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { siTryhackme } from 'simple-icons';

export interface IconGlyph {
  readonly viewBox: string;
  readonly path: string;
}

function fromFontAwesome(definition: IconDefinition): IconGlyph {
  const [width, height, , , pathData] = definition.icon;
  // Duotone icons ship [secondary, primary]; solid/brands ship a single string.
  const path = Array.isArray(pathData) ? pathData.join(' ') : pathData;
  return { viewBox: `0 0 ${String(width)} ${String(height)}`, path };
}

/**
 * Registry of every icon the site may use. Path data is read at build time and
 * rendered as inline SVG by <Icon>; no Font Awesome runtime or CSS ships.
 * Add an icon here before using it.
 */
export const icons = {
  github: fromFontAwesome(faGithub),
  linkedin: fromFontAwesome(faLinkedin),
  tryhackme: { viewBox: '0 0 24 24', path: siTryhackme.path },
  envelope: fromFontAwesome(faEnvelope),
  resume: fromFontAwesome(faFileArrowDown),
  lock: fromFontAwesome(faLock),
  'lock-open': fromFontAwesome(faLockOpen),
  search: fromFontAwesome(faMagnifyingGlass),
  menu: fromFontAwesome(faBars),
  close: fromFontAwesome(faXmark),
  'arrow-down': fromFontAwesome(faArrowDown),
  external: fromFontAwesome(faArrowUpRightFromSquare),
} as const satisfies Record<string, IconGlyph>;

export type IconName = keyof typeof icons;
