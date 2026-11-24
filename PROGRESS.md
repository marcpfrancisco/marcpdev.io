# PROGRESS

Build log for the portfolio + Anvil. Plan: `C:\Users\MARKETING.USB\.claude\plans\this-project-workshop-folder-virtual-mango.md`. Conventions: [CLAUDE.md](CLAUDE.md).

Work goes one step at a time; each step is reviewed before the next starts.

## Status

| #   | Step                                                                       | Status               |
| --- | -------------------------------------------------------------------------- | -------------------- |
| 0   | Planning: concept, stack, positioning, design direction                    | done                 |
| 1   | Scaffold: git, Astro 7, integrations, dependencies                         | done (not committed) |
| 2   | Tooling: npm scripts, ESLint, Prettier, Husky, .editorconfig, .env.example | done (not committed) |
| 3   | Content layer: `content.config.ts` schemas, `getPublic()`, `site.ts`       | todo                 |
| 4   | Design tokens + base layout (fonts, `@theme`, Base layout, `<Icon>`)       | todo                 |
| 5   | Motion core: `motion.ts` (Lenis + GSAP, reduced-motion, cleanup)           | todo                 |
| 6   | Home, part 1: file header + opening fields + intro sequence                | todo                 |
| 7   | Home, part 2: Exhibits A–B (profile, experience with motion path)          | todo                 |
| 8   | Home, part 3: Exhibits C–E + contact                                       | todo                 |
| 9   | Projects: 12 project MDX files + `/projects` + `/projects/[slug]`          | todo                 |
| 10  | Anvil: hub, writeups, labs, notes, `<Flag>`, sample entries, templates     | todo                 |
| 11  | `/security`, `/about`, tags, search (Pagefind), RSS, sitemap               | todo                 |
| 12  | Build-time GitHub/THM fetchers with fallbacks                              | todo                 |
| 13  | Security headers (`vercel.json` CSP), privacy checks                       | todo                 |
| 14  | Verification: check, lint, build, redaction grep, viewports, Lighthouse    | todo                 |
| 15  | Deploy to Vercel                                                           | todo                 |

## Done

### Step 0: Planning (2026-11-23)

- Scope moved from a writeups-only site to a full portfolio, with Anvil as the knowledge/lab section.
- Positioning: security-minded engineer (AppSec + SecOps) with six years of full-stack work, sourced from the resume.
- Home concept: Declassified Dossier (redaction bars wipe away on scroll, sections presented as exhibits).
- Design: dark minimalist luxury; Fraunces / Geist / Geist Mono; champagne accent `#C9A96E`.

### Step 1: Scaffold (2026-11-23)

- `git init` on `main`.
- Astro 7.4 minimal template with `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`, Tailwind 4 via `@tailwindcss/vite`.
- Installed gsap 3.15, lenis 1.3, Font Awesome 7 svg-core with solid and brands, Fontsource variable fonts, @astrojs/rss.
- Dev dependencies: pagefind, @astrojs/check, typescript 6, prettier with the astro and tailwind plugins.
- Content roots: `cybersecurity/` and `ai-automation/` (created by user, empty).
- CLAUDE.md written.

### Step 2: Tooling (2026-11-23)

- Scripts: `dev`, `build` (public, `cross-env PUBLIC_ONLY=1`), `build:private`, `preview`, `check`, `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `verify`. The `new` scaffolder comes in step 10 with the templates.
- ESLint 9 flat config (`eslint.config.mjs`): eslint-config-airbnb-extended (base + react + TS), typescript-eslint strictTypeChecked + stylisticTypeChecked (TS files), eslint-plugin-astro recommended + jsx-a11y-strict, eslint-config-prettier last. Named exports are enforced (`import-x/no-default-export`) except in config files and pages.
- Prettier with the astro and tailwind plugins; `.editorconfig`, `.gitattributes` (LF), `.env.example` (`GITHUB_TOKEN`, `PUBLIC_ONLY`).
- Husky pre-commit: `lint-staged` (eslint --fix, prettier) + `astro check`.
- `.gitignore` adds `.vercel/`, the graphify cache and machine-local files, and `.vscode` except extensions.
- Removed the duplicate `AGENTS.md`.
- Verified: lint, format:check and build pass; a probe file confirmed the any, default-export and img alt rules fire.

## Decisions log

- 2026-11-23: Astro 7 instead of the planned 5 (current release). Font Awesome 7 instead of 6.
- 2026-11-23: Anvil content moved from the repo root into `src/content/cybersecurity/` and `src/content/ai-automation/` (Astro convention, one content root). Lab artifacts sit beside their writeup; loaders match only `*.md`/`*.mdx`. Empty folders are kept with `.gitkeep`.
- 2026-11-23: `.gitignore` rewritten. Committed: lockfile, `.vscode/extensions.json`, `.claude/skills`, and graphify `graph.json`, `GRAPH_REPORT.md`, `manifest.json`. Ignored: env and secret files, key material, build output, logs, OS and editor files, `.claude/settings.local.json`, the graphify cache and HTML, and private content (`*.private.md(x)`, `_private/`, lab runtime data, pcaps, `.ovpn`, `loot/`).
- 2026-11-23: ESLint pinned to 9.x and eslint-plugin-astro to 1.x, because eslint-config-airbnb-extended and jsx-a11y peer on ESLint 9 and astro plugin 2+ needs ESLint 10. Revisit when Airbnb supports 10.
- 2026-11-23: (project-local design skills) is excluded from lint and format.
- 2026-11-23: Hallmark floor adopted: no tracked all-caps labels and no middle-dot meta strings, so dossier labels are sentence case in mono.

## Open items / needed from Marc

- Redacted resume PDF (no phone number).
- Project screenshots.
- THM rank/badges (the public profile returned 429 during research).
- Domain (idea: `marcfrancisco.dev`).

## Cleanup

- needs (the sitemap warns without it). Set it in step 3 once the URL is known; the Vercel URL works for now.
