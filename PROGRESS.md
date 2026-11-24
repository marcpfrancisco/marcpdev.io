# PROGRESS

Build log for the portfolio + Anvil. Plan: `C:\Users\MARKETING.USB\.claude\plans\this-project-workshop-folder-virtual-mango.md`. Conventions: [CLAUDE.md](CLAUDE.md).

Work goes one step at a time; each step is reviewed before the next starts.

## Status

| #   | Step                                                                       | Status               |
| --- | -------------------------------------------------------------------------- | -------------------- |
| 0   | Planning: concept, stack, positioning, design direction                    | done                 |
| 1   | Scaffold: git, Astro 7, integrations, dependencies                         | done (not committed) |
| 2   | Tooling: npm scripts, ESLint, Prettier, Husky, .editorconfig, .env.example | done (not committed) |
| 3   | Content layer: `content.config.ts` schemas, `getPublic()`, `site.ts`       | done (not committed) |
| 4   | Design tokens + base layout (fonts, `@theme`, Base layout, `<Icon>`)       | done (not committed) |
| 5   | Motion core: `motion.ts` (Lenis + GSAP, reduced-motion, cleanup)           | done (not committed) |
| 6   | Home, part 1: file header + opening fields + intro sequence                | done (not committed) |
| 7   | Home, part 2: Exhibits A–B (profile, experience with motion path)          | done (not committed) |
| 8   | Home, part 3: Exhibits C–E + contact                                       | done (not committed) |
| 9   | Projects: 12 project MDX files + `/projects` + `/projects/[slug]`          | done (not committed) |
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

### Step 3: Content layer (2026-11-24)

- `src/content.config.ts`: 5 collections (`writeups`, `notes`, `labs`, `projects`, `experience`), glob loaders matching `*.md`/`*.mdx` and skipping `_`-prefixed files. Zod v4 via `astro/zod`. Anvil entries default to `status: draft`, `public: false`.
- `src/lib/content.ts`: `isPublicBuild`, `getPublic()` (the only way pages read Anvil content), `getProjects()` (sorted, drafts dropped publicly), `getExperience()` (newest first), `evidenceCode()` (EV-01…).
- `src/data/site.ts`: person, three pillars, socials, skills (5 groups from the resume), training (TryHackMe paths complete/in-progress; AWS, Tech Academy and SHIELD marked attended, not certified), education, languages. Email is stored in parts. No phone number.
- `src/content/experience/`: 3 main roles + 3 earlier roles, from the resume verbatim. Pinion has no location because the resume gives none.
- `astro.config.mjs`: `site` from `SITE_URL`, defaulting to `https://marcfrancisco.vercel.app` (placeholder until the Vercel project exists). Static output, no trailing slash.
- Verified: `astro check` 0 errors, eslint clean. A fixture test (public+done, draft, public+unfinished) showed the private build returns 3 entries and the public build returns 1, and draft text is absent from `dist/`.

### Step 4: Design tokens + base layout (2026-11-24)

- `src/styles/tokens.css`: Tailwind 4 `@theme` with the default palette and font stacks wiped. OKLCH colours: cool graphite ground (hue 250), warm document-white ink (hue 85), champagne accent (hue 80) as a signal only, plus `redact`, `focus`, `error` and `success`. Also the type scale (display up to 7rem, held from 1440), the named spacing scale (`3xs` to `4xl`), easings, the page container, and layout and z-index variables with 60rem and 40rem breakpoints.
- `src/styles/global.css`: Hallmark stamp, Floor base (overflow-x clip, instant focus ring, heading measures and balance, disabled state, reduced-motion reset), `.container-page`, `.skip-link`, `.visually-hidden`, `.file-mono`.
- Fonts (self-hosted via Fontsource, CSP-safe): Libre Bodoni (display), Hanken Grotesk (body), Geist Mono (dossier material only). Fraunces and Geist removed.
- `src/lib/icons.ts` + `src/components/Icon.astro`: build-time inline SVG from Font Awesome path data, TryHackMe from simple-icons. No FA runtime or CSS.
- `src/layouts/BaseLayout.astro`: lang, title pattern, description, canonical, Open Graph, skip link, `<main id="main">`.
- `SiteHeader`: sticky, wordmark, four links with `aria-current`, one hairline action ("Request the file"). The mobile menu uses the native Popover API (no JS).
- `SiteFooter`: "End of file MF-0619", socials (new tab, labelled), year line.
- `src/data/navigation.ts`, `person.tagline` (hero sentence, 12 words), new favicon (redaction-bar mark).
- Temporary `src/pages/index.astro` to exercise the layout; replaced in step 6.
- Verified: astro check 0 errors, eslint clean, build OK. Hallmark sloplint render at 375, 1280, 1440 and 1920 showed the layout working, with no overflow and a working mobile menu. The remaining findings are about the placeholder hero only (FAIL 58, REFLEX 44c/79, WARN 77) and are owned by step 6. Fixed: footer year spacing, missing `:active`/`:disabled` states, hero sentence over 12 words.

### Step 5: Motion core (2026-11-24)

- `src/scripts/motion/index.ts`: boots after `document.fonts.ready`, registers ScrollTrigger and SplitText, and uses `gsap.matchMedia` (motion allowed, desktop at 64rem) plus a separate reduced-motion query. Sets `<html data-motion>` to `ready`, `reduced`, `failed` or `late`.
- `smooth-scroll.ts`: Lenis on `gsap.ticker`, feeding `ScrollTrigger.update`. Anchors are offset by the header, touch stays native, and the popover menu and `[data-lenis-prevent]` are excluded. Returns a cleanup function.
- `redact.ts`: markup API `data-redact`, `="scrub"`, `="manual"`, `data-redact-lines` (SplitText lines with autoSplit; re-splits never re-cover declassified text), plus `declassify(el)` for page timelines.
- `global.css`: bar overlays (`::after` scaled by `--redact`, transform-only) only under `(scripting: enabled) and (prefers-reduced-motion: no-preference)`; a 2.5s CSS failsafe; no bars in print. Cross-document view transitions (`@view-transition`, fade/settle).
- Lenis CSS moved into `global.css` so no inline `<style>` ships (CSP).
- Bundle: motion JS about 53 KB gzip (GSAP core, ScrollTrigger, SplitText, Lenis); CSS about 12 KB gzip.
- Verified with a puppeteer behaviour suite on a temporary lab page (deleted after), 18/18 passing: ready state and Lenis on; in-view bar wipes; manual bar holds; below-fold bars stay covered until scrolled; line split covers then clears; text intact for assistive tech; desktop scrub is partial mid-range (0.5); mobile falls back to enter-wipe; reduced motion means no Lenis and no bars; JS off means no bars; script blocked means the failsafe clears bars at 2.5s; no horizontal overflow at 1440 or 375; no console errors.
- Bugs found by the suite and fixed: (1) tweening an unset custom property jumped straight to its end value, so every wipe now uses `fromTo` from 1; (2) `gsap.matchMedia` with a conditions object never fires when every condition is false, so reduced motion on small screens has its own query.

### Step 6: Home, page 01 (2026-11-24)

- `FileStrip`: the file's running head as separate `<dl>` cells: file no. (types in), clearance, reviewed (build date), folio "p. 01 of 06".
- `DossierHero`: left-set file card. Subject (`<h1>` Marc Francisco, display), Role, Base, Status as a `<dl>` with mono sentence-case labels and hairline rows. One sentence (`person.tagline`, 12 words), one primary action "Open the file" pointing to `#exhibit-a`, and a "Scroll to declassify" cue on md+. It fills the first screen, with content top and action bottom.
- `Stamp`: hairline champagne "Declassified" with the review date, rotated -6°, beside the fields on desktop and below them on mobile.
- `ButtonLink` (ui): square primary (ink fill, one per page) and secondary (hairline), with hover, active and focus states.
- Motion: new `registry.ts` (scenes, shared `MEDIA` queries, late registration runs immediately) and `scenes/intro.ts`: the number types in (steps), the subject bar then the role bar wipe, and the stamp lands (fade and settle). About 1.1s on desktop, double speed on mobile. Skippable by key, pointer, wheel or touch; once per session (`sessionStorage`, guarded). The intro has the same CSS failsafe contract as the bars.
- Core restructure: the main motion context now depends only on reduced motion. Only `data-redact="scrub"` elements get a nested desktop/mobile matchMedia, so resizing across 64rem no longer re-covers declassified text.
- Fixed from screenshots: role capitalisation (new `person.roleLine`), stamp stretching to the row height, the mobile file strip wrapping the date, a duplicate "Request the file" action (it stays in the header only).
- Verified: astro check 0 errors, eslint clean. Hallmark sloplint hero stage at 1280, 1440, 1920 and 375: 0 FAIL, 0 WARN, 1 REFLEX (26b, waived: states live in Tailwind utilities). Fold passes at 1280×800 (headline, sentence and action visible). Puppeteer intro suite, 9/9: covered at first paint; full story plays; no console errors; same-session reload doesn't replay; a keypress skips; reduced motion and no-JS are complete and static; the failsafe completes the page with the script blocked; mobile finishes fast with no overflow.
- Known gap: `#exhibit-a` doesn't exist until step 7.

### Step 7: Home, Exhibits A and B (2026-11-24)

- `ExhibitHeader`: the running head for each exhibit (mono "Exhibit A Profile", folio "p. 02 of 06").
- `ExhibitProfile` (#exhibit-a): head "I build what I secure." (the page's one scrubbed display element, `data-redact="scrub"`), two-sentence profile declassified by line, and three pillars as a `<dl>` with hairline tops.
- `ExhibitHistory` (#exhibit-b): head computed from the career start ("Seven years in production code."), three main roles (dates in mono, company in display, role and location, one lead highlight each), then an "Earlier" entry collapsing three roles. The full highlights and stacks are kept for `/about`.
- Route (`scenes/timeline.ts`): an SVG path built from the measured node centres (passes within 1px of every node), rebuilt on every ScrollTrigger refresh. From 40rem it draws (DrawSVG) and a champagne dot travels it (MotionPath), both scrubbed linearly from the first to the last node. Below 40rem the route is drawn static with no dot. Nodes turn champagne when reached and stay so until you scroll back above. Static fallback: a hairline spine with square nodes.
- Facts: the years claim is now computed (`yearsInPractice()` from June 2019, giving "seven"). The previous "six years" understated it. Profile and pillar copy were tightened to the screen budget. Ducon highlights merged to four (no fact dropped). Arcanys leads with its real metrics.
- Registry: `MEDIA.tablet` and `MEDIA.phone` added. Intro section now wraps `FileStrip` and `DossierHero`, which is a `<div>`.
- Prose links (`a:not([class])`) gained hover and active states in the base layer.
- Verified against the production build: astro check 0, eslint clean, sloplint 0 FAIL. Two WARNs accepted: 58 (93 words in Exhibit A's viewport, just over the 80 budget) and 77 (four sections; C to E come in step 8). Route suite 11/11: route on with the static spine hidden; path through every node; reached state at the right scroll positions and kept; the line draws further as you scroll; the dot moves; no errors; resize to phone gives a static route with no dot; no overflow; reduced motion and no-JS give the static spine with no SVG and no bars. Intro suite still passes.
- Bugs caught by the suite: (1) nodes lost their reached state after scrolling past (toggleClass default end), fixed with `end: 'max'`; (2) a CSS-file-scoped `:active` reflex, fixed with real prose-link states instead of a waiver.
- Process note: a user `astro dev` server occupies :4321, so `astro preview` falls back to :4322. Several mid-step checks had hit the dev server; all were re-run against the production build.

### Step 8: Home, Exhibits C to E and contact, plus the finish review (2026-11-24)

- Project content seeded early (needed by Exhibit C): 10 MDX files in `src/content/projects/`. The AppSec case study is resume-level and private. The 9 repos were chosen by Marc, with facts from the GitHub API (description, created year, demo URL); nothing is embellished. 5 are featured. Schema: `role` is optional (never assumed from a repo); `state` is live, source, private or wip.
- `ExhibitEvidence` (C): an evidence register. Rows run EV-01 to EV-05 (code, title declassified on entry, summary, stack, year, state) and link to `/projects/[slug]`. The last row reads "EV-06 to 10, Open the full index".
- `ExhibitTraining` (D): the head is computed ("Three paths complete, one open."). TryHackMe paths (complete in accent, in progress) sit beside events and courses (marked attended, never shown as certified). Latest public writeups appear only once they exist.
- `ExhibitCapabilities` (E): a real table (caption plus row headers) whose skill lines declassify by line, restacked on phones.
- `ContactClose` (#contact): "Request the full file.", one sentence, and an email reveal (`src/scripts/contact.ts`). The address is assembled from data attributes on click, then focused. Without JS, a LinkedIn fallback shows. Links to GitHub, LinkedIn and TryHackMe, then a signature.
- Deviation: the pinned horizontal evidence strip from the plan was not built. It would be a third scroll pattern, and there are no project screenshots for it to carry. It can return once screenshots exist.
- Hallmark finish review (fresh-context subagent) verdict: fix, with 7 findings, all applied. (1) The empty right column in History now holds each role's start year in large display type. (2) The "all projects" link became the register's last row. (3) The hero's dead band is closed: the sentence and action sit under the fields. (4) The nav label "Anvil" became "Writeups" (the route and page brand stay Anvil). (5) The footer is just the end-of-file line and copyright, with no repeated name or links. (6) Training column heads are mono file labels with the handle as a value. (7) The contact section is balanced, with the email reveal under the sentence. Not applied, pending Marc: sourcing each capability row, and anchoring "I build what I secure." to a specific fact.
- Fixed from sloplint: a visually-hidden thead painting under row text (removed; caption and row headers remain), Exhibit A's heading sitting nearer the header than its content (regrouped), and tighter role gaps pushing over the word budget (reverted to 144px).
- Verified on the production build: astro check 0, eslint clean, sloplint 0 FAIL, 1 WARN accepted (58: 93 words in Exhibit A's viewport). The step-8 suite passes 7/7: the email is not in the markup, reveal works and takes focus, evidence and capability bars clear, no errors, the no-JS fallback works, and phones show no overflow with folios on one line. Route 11/11 and intro still pass.
- Known gap: `/projects`, `/projects/[slug]`, `/security`, `/anvil` and `/about` don't exist yet (steps 9 to 11), so the nav and evidence links 404 until then.

### Redesign pass: palette, grid, bands, objects (2026-11-24)

Marc's verdict: clean but plain, cheap, boxy, offset, with huge gaps and a pale palette. Approved plan: `C:\Users\MARKETING.USB\.claude\plans\this-project-workshop-folder-virtual-mango.md`. Revised mid-pass at Marc's request:

- **Palette** (`tokens.css`, OKLCH, token names unchanged):
  - **primary soft black** (`paper`, `paper-2`, `paper-3`; never #000)
  - **complementary bone** (`ink`, `ink-2`, plus `sheet` and `sheet-ink` for paper objects)
  - **accent cobalt** (`accent`, black `accent-ink` on fills, `accent-deep` on bone)
  - The navy, bone and red "Intel" set came first and was replaced because the orange-red hurt the eyes.
  - Every pair checked: bone on black 13.7-15.6:1, cobalt on black 4.6-5.2:1, black on cobalt 5.2:1, deep cobalt on bone 6:1.
- **Type:** Poppins for body and UI (400, 500, 600; Marc's request, recorded as a Hallmark waiver). Libre Bodoni stays for display, capped at 6rem so the name holds one line at 1920. Geist Mono stays for file markings. Hanken Grotesk removed.
- **Layout:** new `Section.astro`, a full-bleed band on one 12-column grid with a sticky exhibit rail (cobalt letter, name, folio) in cols 1-3 and content in cols 4-12. Bands alternate base and raised. `--section-pad` is 112/72/56px, down from 176px gaps.
  - Verified by script: every section's rail and content start at identical x at 768, 1024, 1440 and 1920, with zero overflow from 320 to 1920.
  - `ExhibitSheet` and `ExhibitHeader` were deleted; no offsets or narrowed sections remain.
- **Objects only for real things:**
  - `EvidencePrint` (bone mat, cobalt EV tag) for the live-demo placeholders.
  - `CertificateCard` (bone paper, black ink, a folded corner that follows the band via `--band`, deep-cobalt state, ID, date, PDF link, an outlined card for the open path).
  - The stamp in cobalt.
  - A permanent `Redacted` bar (new) where information really is withheld: EV-01 employer systems, on the register row and in the case-file facts. The dossier idea therefore survives in the page's end state.
- **Exhibits:**
  - A: one heading level (the lead pillar marked only by its cobalt rule); "Engineering" became "Five stacks shipped"; profile copy de-duplicated.
  - B: route timeline; the duplicate large years were removed.
  - C: prints, then the register.
  - D: certificate objects, plus events as a list; the THM handle is labelled "Profile, Tripulante".
  - E: aligned table; five tools per discipline with an "N more" disclosure (no skill is lost); source notes are the link text.
- **Contact:** first built as a solid cobalt band, then reworked at Marc's request (too harsh). It is now a routing slip on the raised band: a 2px cobalt top rule, a § rail marker, labelled rows (Email reveal, GitHub, LinkedIn, TryHackMe, resume when present) and a signature. The footer joins it with no gap.
- **Hallmark finish review** (fresh context): fix. Applied:
  - permanent redactions
  - stats band removed (a generic pattern that repeated later heads)
  - large years removed
  - single head size in A
  - THM handle labelled
  - contact joined to the footer
  - display capped at 6rem

  Not applied: cutting Capabilities row padding by 40%, which pushed that screen to 112 words (floor rule 13).

- **Inner pages** (`/projects`, `/projects/[slug]`) rebuilt on `Section`; case notes moved to a raised section.
- Verified on the dev server: astro check 0 errors, eslint clean, build OK. sloplint on home: 0 FAIL, 1 WARN accepted (58: 94 words, Capabilities). Inner pages (app scope) clean. Suites: fix 7/7, route 11/11, intro 8 (plus the known regex artifact), step-8 7/7, alignment script pass.
- Process: Marc's dev server stopped mid-pass, so `npm run dev` was restarted on :4321 in the background.

### Marc's answers applied (2026-11-24)

- **Titles:** Role is now "Software engineer moving into application security"; Status is "Open to application security and SOC roles". Marc has been a software engineer since 2019; his security experience is AppSec work at Ducon plus TryHackMe training.
- **Role briefs from Marc's facts:**
  - Ducon: the risk came from his own audit of all five company web apps. The domains are deliberately not named: publishing that specific live employer sites had injection or XSS exposure would invite attacks and could breach confidentiality.
  - Arcanys: risk is complex Angular scripts and slow queries; action is a refactor, query fixes and transactional queries.
  - Solutions Resource: a manual spreadsheet for DTR and payroll, replaced with an Angular and Spring app. Bountiply and Syngenta Tiwalap were added as highlights.
- **Loan tracker summary:** multi-currency, multi-tenant, PH and UAE lenders. JCFAP and Hades are still unanswered.
- **Certificates** (from the PDFs in `public/assets/certificates/`): Pre Security (30 Aug 2026, THM-PBR2XQP2ZX), Cyber Security 101 (14 Sep 2026, THM-WFL8XDQHIO), SOC Level 1 (3 Nov 2026, no ID printed). The PDFs corrected the path names: "SOC Level 1", not "SOC Analyst"; "Cyber Security 101". Rows show date, ID and a Certificate link. Links render only if the file exists at build time. Durations are kept in data for /security.
- **Placeholders (R-23, Marc's choice: placehold.co, no text param):** `src/lib/placeholder.ts`. A hero portrait slot (4:5, eager, fetchpriority high, stamp overlapping the corner, caption "Photograph, placeholder"). Evidence prints for the live demos in Exhibit C and a screenshot figure on live project pages, all labelled as placeholders in alt text and captions. CSP needs `img-src https://placehold.co` until they are replaced (step 13).
- **Dates:** one formatter (`src/lib/format.ts`: `fileDate`, `fileDateFromIso`, `fileMonth`). en-GB Intl printed "Sept".
- **Density fixes:** compact evidence rows on home (summaries stay on the index and case files); history entries are paced at least 22rem each on desktop.
- **Resumes:** the three originals contained the phone number. At Marc's direction they were moved to the gitignored `private/resumes/`. He chose the Application Security resume for download: the link appears when a phone-free copy is placed at `public/assets/resumes/marc-francisco-application-security-resume.pdf`. Verified: `dist/assets` ships only certificates.
- Verified on the dev server: sloplint 0 FAIL, 1 WARN accepted (58, Capabilities lists). All suites pass (fix 7/7, route 11/11, intro, step-8). Lint, types and build are clean.

### Step 9: Projects (2026-11-24)

- `/projects`: the evidence index. Every project in register order, with the count and live-demo summary computed from content. No stack filter: 10 entries read faster as one list than behind controls (C-3).
- `/projects/[slug]` (10 pages): a case file with the evidence code, title (declassified), summary, and actions (primary "Open the live demo" or "Read the source"; the external-link icon marks leaving the site). Facts as a `<dl>`: year, state, role only when known, stack. A private notice for employer work. Case notes on an attachment sheet only when the entry has a body (no empty section). Previous, index and next navigation.
- Shared `EvidenceRow` (Exhibit C and the index) and `PROJECT_STATE_LABEL`. `FileStrip` gained `section` (replaces the folio on inner pages) and opt-in `typed`, so only the home page clips the file number for the intro.
- `.prose-file` styles for MDX case notes and writeups.
- Verified on the dev server: all 11 routes return 200. sloplint with `--scope app` (inner pages; the landing-hero rules don't apply to an index or detail page) is clean on /projects, /projects/appsec-hardening and /projects/jcfap-cms. No overflow at 1440 or 375.

### Antislop review and fix batch (2026-11-24)

Five parallel reviewers (antislop: ui, copywriting, human/a11y, layoutmobile, code) checked the home page. Mode: during (global preference). Applied:

- **Copy (R-36, R-38, Marc's direction):** new headline "I secure the apps I ship."; tagline "Seven years writing production code, now hardening it against attack."; profile anchored to Ducon facts. SOC is framed as TryHackMe training, not paid work. The writeups claim was removed until one exists. Meta summary rewritten. The SOC pillar says "Training on TryHackMe".
- **Role entries:** a new `brief` (risk, action, result) field in the experience schema, filled only from the resume. Ducon has no result and Arcanys has no risk yet: these are questions for Marc. Locations are shown on /about only.
- **Capability sources (Marc said yes):** `SkillGroup.sources` (label, href, note) at group level, in an "On file" column linking to the exhibits or EV-01.
- **"Too plain":** new `ExhibitSheet` (folder tab on a paper-2 sheet). A, C and E sit on sheets; B stays on the desk; D becomes two offset attachment sheets (D1, D2); E is a narrower right-set index card. Application security leads the pillars at larger size with an accent rule. "Complete" moved from accent to ink.
- **A11y bugs:** the mobile menu link now closes the popover; Tab is trapped inside the open menu; the focus ring appears instantly (`outline-color` set globally so transition-colors cannot fade it); same-page anchors move focus to their target section (`tabindex="-1"`); 44px hit areas on the wordmark, nav links, THM handle and source links. New `src/scripts/nav.ts`.
- **Layout:** the evidence register uses 5 columns only from lg (it was crushed at md); responsive role gaps; exhibit labels never break mid-phrase; "Earlier" dates are nowrap.
- **Code:** registry runs late-registered scenes inside a `gsap.context` (no leak); Lenis anchor offset matches CSS scroll padding; constants reused; stale and misleading comments removed; shared `pad2` helper; React integration and the Airbnb React lint configs removed (no islands; the unused 220 KB chunk is gone); display font preloaded.
- **Domain:** `marcpdev.io` set as the canonical `site`.
- **Verified (on Marc's dev server, :4321):** sloplint 0 FAIL, 1 WARN accepted (58: 94 words). New fix suite 7/7 (menu link closes and focuses #contact, Tab wraps, ring instant, anchor focus, sources resolve, tabs present). Step-8 suite, route 11/11 and intro still pass.
- **Not applied, needs Marc:** portrait (R-23), live-demo screenshots, certificate or badge images, and the facts for the Risk/Result gaps (question list in the chat).

## Decisions log

- 2026-11-23: Astro 7 instead of the planned 5 (current release). Font Awesome 7 instead of 6.
- 2026-11-23: Anvil content moved from the repo root into `src/content/cybersecurity/` and `src/content/ai-automation/` (Astro convention, one content root). Lab artifacts sit beside their writeup; loaders match only `*.md`/`*.mdx`. Empty folders are kept with `.gitkeep`.
- 2026-11-23: `.gitignore` rewritten. Committed: lockfile, `.vscode/extensions.json`, `.claude/skills`, and graphify `graph.json`, `GRAPH_REPORT.md`, `manifest.json`. Ignored: env and secret files, key material, build output, logs, OS and editor files, `.claude/settings.local.json`, the graphify cache and HTML, and private content (`*.private.md(x)`, `_private/`, lab runtime data, pcaps, `.ovpn`, `loot/`).
- 2026-11-23: ESLint pinned to 9.x and eslint-plugin-astro to 1.x, because eslint-config-airbnb-extended and jsx-a11y peer on ESLint 9 and astro plugin 2+ needs ESLint 10. Revisit when Airbnb supports 10.
- 2026-11-23: (project-local design skills) is excluded from lint and format.
- 2026-11-24: Faces changed from Fraunces/Geist (Hallmark "saturated") to Libre Bodoni + Hanken Grotesk; Geist Mono kept for dossier material.
- 2026-11-24: Palette sat near Hallmark's "Kiln" theme (dark / high-contrast serif / warm). It now differs in three ways: a cool graphite ground, square hairline controls, and no filled accent button.
- 2026-11-24: Custom crosshair cursor dropped (Hallmark floor bans custom cursors). The DECLASSIFIED stamp stays as the single signature moment because the concept was user-chosen, despite Hallmark listing stamps as a cliché.
- 2026-11-24: The evidence register replaces the pinned horizontal strip until project screenshots exist.
- 2026-11-24: The nav says "Writeups"; "Anvil" is the brand on the `/anvil` page itself.
- 2026-11-24: The footer is minimal; the contact section owns the name and links.
- 2026-11-24: The home dossier shows one lead highlight per role, chosen by frontmatter order; `/about` carries the full record. This keeps each screen near Hallmark's 80-word budget without dropping facts.
- 2026-11-24: Year counts are computed at build time from the career start, never hard-coded.
- 2026-11-24: GSAP ScrollTrigger is the scroll engine (user request) but follows Hallmark's scroll budget: structural targets only, linear scrub, a static end state for no-JS and reduced motion, scrub on desktop only. The dossier will use two scroll patterns (bar wipe plus the motion-path line), one more than Hallmark's budget of one per page. This is waived because the user explicitly asked for motion-path animation.
- 2026-11-24: No client router. Page transitions use native cross-document view transitions, so there is no swap lifecycle to clean up.
- 2026-11-24: Mobile nav uses the native Popover API, so it needs no JS and no inline script.
- 2026-11-24: No inline `style=""` anywhere (strict CSP); use Tailwind arbitrary values.
- 2026-11-23: Hallmark floor adopted: no tracked all-caps labels and no middle-dot meta strings, so dossier labels are sentence case in mono.

## Open items / needed from Marc

- Redacted resume PDF (no phone number).
- Project screenshots.
- THM rank/badges (the public profile returned 429 during research).
- Domain: confirmed `marcpdev.io` (2026-11-24), now the default `site` in `astro.config.mjs`. Connect it in Vercel during step 15.

## Cleanup

- None open.
