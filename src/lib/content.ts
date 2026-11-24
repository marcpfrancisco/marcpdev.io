import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * True for the deployed build (`npm run build` sets PUBLIC_ONLY=1).
 * Read server-side only; this module must never be imported by client scripts.
 */
export const isPublicBuild: boolean = import.meta.env.PUBLIC_ONLY === '1';

export type AnvilCollection = 'writeups' | 'notes' | 'labs';

/**
 * The only sanctioned way to read Anvil content in pages.
 * Dev: every entry, drafts included. Public build: `public: true` AND `status: done`.
 */
export async function getPublic<C extends AnvilCollection>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(
    collection,
    (entry: CollectionEntry<AnvilCollection>) =>
      !isPublicBuild || (entry.data.public && entry.data.status === 'done'),
  );
  return entries;
}

/** Projects ordered for display; drafts are dropped from the public build. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects', ({ data }) => !isPublicBuild || !data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** Experience ordered newest first by start month. */
export async function getExperience(): Promise<CollectionEntry<'experience'>[]> {
  const roles = await getCollection('experience');
  return roles.sort((a, b) => b.data.start.localeCompare(a.data.start));
}

/** Evidence code for the dossier, e.g. order 0 becomes "EV-01". */
export function evidenceCode(order: number): string {
  return `EV-${String(order + 1).padStart(2, '0')}`;
}

/** How each project state reads on the page. */
export const PROJECT_STATE_LABEL = {
  live: 'Live demo',
  source: 'Source',
  private: 'Private',
  wip: 'In progress',
} as const satisfies Record<CollectionEntry<'projects'>['data']['state'], string>;
