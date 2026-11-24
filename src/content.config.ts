import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Match markdown only, and skip anything prefixed with `_` (drafts, partials).
 * Lab artifacts (workflow.json, docker-compose.yml, scripts) sit beside the
 * markdown and are never loaded or bundled.
 */
const MARKDOWN = ['**/[^_]*.md', '**/[^_]*.mdx'];

const tags = z.array(z.string().trim().toLowerCase()).default([]);

/** Shared by every Anvil entry. Private by default; nothing ships unless opted in. */
const anvilBase = z.object({
  title: z.string().min(1),
  summary: z.string().max(200).optional(),
  tags,
  status: z.enum(['draft', 'done']).default('draft'),
  public: z.boolean().default(false),
});

const writeups = defineCollection({
  loader: glob({ base: './src/content/cybersecurity/writeups', pattern: MARKDOWN }),
  schema: anvilBase.extend({
    date: z.coerce.date(),
    platform: z.enum(['thm', 'htb', 'picoctf', 'other']),
    difficulty: z.enum(['info', 'easy', 'medium', 'hard', 'insane']),
    roomUrl: z.url().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/cybersecurity/notes', pattern: MARKDOWN }),
  schema: anvilBase.extend({
    topic: z.string().min(1),
    updated: z.coerce.date(),
  }),
});

const labs = defineCollection({
  loader: glob({ base: './src/content/ai-automation', pattern: MARKDOWN }),
  schema: anvilBase.extend({
    date: z.coerce.date(),
    tool: z.enum(['n8n', 'make', 'zapier', 'docker', 'python', 'other']),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: MARKDOWN }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1).max(200),
      stack: z.array(z.string()).min(1),
      /** Only when known (e.g. employer work). Never assumed from a public repo. */
      role: z.string().optional(),
      year: z.number().int().min(2015).max(2100),
      /** live: public demo; source: code only; private: employer or NDA work, no repo. */
      state: z.enum(['live', 'source', 'private', 'wip']).default('source'),
      featured: z.boolean().default(false),
      /** Lower comes first; also drives the dossier evidence number (EV-01, EV-02...). */
      order: z.number().int().min(0),
      repo: z.url().optional(),
      demo: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Hide from the public build without deleting the file. */
      draft: z.boolean().default(false),
    }),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: MARKDOWN }),
  schema: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    location: z.string().min(1).optional(),
    /** ISO year-month, e.g. 2025-04. */
    start: z.string().regex(/^\d{4}-\d{2}$/),
    /** Omit for a current role. */
    end: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
    /** `main` roles get a full dossier entry; `earlier` roles collapse into one line. */
    kind: z.enum(['main', 'earlier']).default('main'),
    highlights: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    /**
     * The dossier entry: what was at risk, what was done, what changed. Each field only when a
     * real source states it; a missing field is left out, never inferred.
     */
    brief: z
      .object({
        risk: z.string().optional(),
        action: z.string(),
        result: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { writeups, notes, labs, projects, experience };
