# Graph Report - .  (2026-11-23)

## Corpus Check
- Corpus is ~2,316 words - fits in a single context window. You may not need a graph.

## Summary
- 114 nodes · 119 edges · 29 communities (10 shown, 19 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 107,427 input · 0 output

## Community Hubs (Navigation)
- Dev Tooling Dependencies
- Project Docs and Anvil
- Publishing and Redaction Rules
- npm Scripts and Metadata
- TypeScript Config
- Core Runtime Dependencies
- Dossier Design System
- Favicon
- Markdown Renderer
- MDX Integration
- React Integration
- Sitemap Integration
- Personal Data Rules
- Geist Font
- Geist Mono Font
- Font Awesome Core
- Font Awesome Brands
- Font Awesome Solid
- GSAP
- Lenis
- React
- React DOM
- Tailwind CSS
- Tailwind Vite Plugin
- React Types
- React DOM Types
- Code Standards

## God Nodes (most connected - your core abstractions)
1. `Build plan steps 0-15` - 7 edges
2. `scripts` - 5 edges
3. `getPublic()` - 4 edges
4. `Motion core (src/scripts/motion.ts)` - 4 edges
5. `Definition of done` - 4 edges
6. `include` - 3 edges
7. `compilerOptions` - 3 edges
8. `Portfolio site` - 3 edges
9. `Declassified Dossier home concept` - 3 edges
10. `Public build (PUBLIC_ONLY=1)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Build plan steps 0-15` --references--> `Astro minimal template`  [EXTRACTED]
  PROGRESS.md → README.md
- `README.md (Astro Starter Kit: Minimal)` --cites--> `Astro documentation guides`  [INFERRED]
  README.md → AGENTS.md
- `Decisions log` --rationale_for--> `Stack (Astro 7, React 19 islands, Tailwind 4, GSAP, Lenis, Pagefind)`  [EXTRACTED]
  PROGRESS.md → CLAUDE.md
- `Personal data and facts rules` --conceptually_related_to--> `Open items (resume PDF, screenshots, THM rank, domain)`  [INFERRED]
  CLAUDE.md → PROGRESS.md
- `Hallmark floor` --rationale_for--> `Dark minimalist luxury design system`  [INFERRED]
  PROGRESS.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Public build privacy/redaction pipeline** — claude_getpublic, claude_flag_component, claude_public_build, claude_thm_policy, claude_definition_of_done [INFERRED 0.85]
- **Declassified Dossier visual and motion system** — claude_declassified_dossier, claude_redaction_bars, claude_design_tokens, claude_motion_system, progress_hallmark_floor [INFERRED 0.85]

## Communities (29 total, 19 thin omitted)

### Community 0 - "Dev Tooling Dependencies"
Cohesion: 0.15
Nodes (13): @astrojs/check, devDependencies, @astrojs/check, pagefind, prettier, prettier-plugin-astro, prettier-plugin-tailwindcss, typescript (+5 more)

### Community 1 - "Project Docs and Anvil"
Cohesion: 0.21
Nodes (9): Astro background dev server, Astro documentation guides, Anvil archive, Content collections (writeups, notes, labs, projects, experience), AGENTS.md cleanup item, Decisions log, Design rationale plan (virtual-mango plan file), README.md (Astro Starter Kit: Minimal) (+1 more)

### Community 2 - "Publishing and Redaction Rules"
Cohesion: 0.27
Nodes (11): Content rules, Definition of done, <Flag> component, getPublic(), Motion core (src/scripts/motion.ts), JS-off and reduced-motion visibility, Public build (PUBLIC_ONLY=1), Security headers (vercel.json strict CSP) (+3 more)

### Community 3 - "npm Scripts and Metadata"
Cohesion: 0.18
Nodes (10): engines, node, name, scripts, astro, build, dev, preview (+2 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.18
Nodes (10): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, compilerOptions, jsx, jsxImportSource, exclude (+2 more)

### Community 5 - "Core Runtime Dependencies"
Cohesion: 0.29
Nodes (7): astro, @astrojs/rss, @fontsource-variable/fraunces, dependencies, astro, @astrojs/rss, @fontsource-variable/fraunces

### Community 6 - "Dossier Design System"
Cohesion: 0.29
Nodes (7): Dark minimalist luxury design system, Declassified Dossier home concept, Design tokens (tokens.css / @theme), Portfolio site, Redaction bars scroll wipe, Vercel, Hallmark floor

### Community 7 - "Favicon"
Cohesion: 0.67
Nodes (3): Astro Logo, Dark-mode adaptive fill (prefers-color-scheme), Site Favicon (Astro logo mark)

## Knowledge Gaps
- **46 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core Runtime Dependencies` to `npm Scripts and Metadata`, `Markdown Renderer`, `MDX Integration`, `React Integration`, `Sitemap Integration`, `Geist Font`, `Geist Mono Font`, `Font Awesome Core`, `Font Awesome Brands`, `Font Awesome Solid`, `GSAP`, `Lenis`, `React`, `React DOM`, `Tailwind CSS`, `Tailwind Vite Plugin`, `React Types`, `React DOM Types`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `npm Scripts and Metadata`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._