export interface NavItem {
  readonly label: string;
  readonly href: string;
  /** Dossier file code shown in the mobile menu. */
  readonly code: string;
  /** False until the route exists. A nav link must never lead to a missing page (antislop R-24). */
  readonly built: boolean;
}

const allNav: readonly NavItem[] = [
  { label: 'Work', href: '/projects', code: 'EV', built: true },
  { label: 'Security', href: '/security', code: 'SEC', built: false },
  // The section is branded Anvil on its own page; the nav uses the plain word visitors expect.
  { label: 'Writeups', href: '/anvil', code: 'ARC', built: false },
  { label: 'About', href: '/about', code: 'BIO', built: false },
];

export const primaryNav: readonly NavItem[] = allNav.filter((item) => item.built);

/** The one header action: jump to the contact exhibit on the dossier. */
export const contactAction = { label: 'Request the file', href: '/#contact' } as const;
