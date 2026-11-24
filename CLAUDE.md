# CLAUDE.md

Personal portfolio and knowledge forge for **Marc Francisco**, a security-minded engineer (AppSec and SecOps) with six years of full-stack work, based in Dubai. One repo serves two purposes:

1. **Portfolio site.** A public site on Vercel, and the home page is the "Declassified Dossier".
2. **Anvil.** A private-by-default archive of CTF writeups (TryHackMe "Tripulante"), security notes, and AI-automation labs (n8n, Make, Zapier). An entry is published only when it is explicitly marked public.

Full design rationale: `C:\Users\MARKETING.USB\.claude\plans\this-project-workshop-folder-virtual-mango.md`.

## Stack

Astro 7 (static output, no UI framework; add one only when an island truly needs state) · MDX · Tailwind CSS 4 (`@tailwindcss/vite`, tokens in `@theme`) · GSAP 3.15 (ScrollTrigger, MotionPathPlugin) · Lenis · Font Awesome 7 svg-core · Fontsource fonts (Libre Bodoni, Poppins, Geist Mono), self-hosted · Pagefind · TypeScript strict. Node >= 22.

## Commands

```bash
npm run dev            # dev server, shows everything incl. drafts and real flags
astro dev --background # background dev server (astro dev stop | status | logs)
npm run build          # public build (PUBLIC_ONLY=1): drafts and private entries excluded, flags redacted
npm run build:private  # full local build, never deploy
npm run preview
npm run check          # astro check (catches bad frontmatter)
npm run lint           # eslint
npm run format         # prettier
npm run new -- <collection> <slug>   # scaffold an entry from templates/
```

If a script above is missing from `package.json`, add it rather than working around it.

Marc keeps `npm run dev` running on http://localhost:4321 in his own terminal. Use it for all visual and behaviour checks (sloplint `--url`, puppeteer). Never start another dev or preview server and never stop his. Run `npm run build` only to verify the production output itself (`dist/` contents, redaction greps), not to serve it.

## Layout

```
src/
  content.config.ts     # Zod schemas; glob loaders match only *.md / *.mdx
  content/
    projects/           # portfolio projects (.mdx)
    experience/         # career timeline entries
    cybersecurity/      # Anvil: security
      writeups/<platform>/  # thm/, htb/, picoctf/ -> collection "writeups"
      notes/<topic>/        # -> collection "notes"
    ai-automation/      # Anvil: automation
      <lab-slug>/index.md   # lab writeup -> collection "labs"
      <lab-slug>/workflow.json, scripts, docker-compose.yml   # artifacts beside the writeup; never imported, never bundled
  data/site.ts          # name, socials, skills, training, static fallbacks
  lib/                  # getPublic(), github fetcher, helpers
  components/ layouts/ pages/ scripts/ styles/
templates/              # starter frontmatter for each collection
public/                 # static assets; images at public/img/<slug>/
```

Routes: `/` (dossier), `/security`, `/projects`, `/projects/[slug]`, `/about`, `/anvil`, `/anvil/writeups`, `/anvil/labs`, `/anvil/notes`, `/tags/[tag]`, `/search`, `/rss.xml`.

## Content rules

- Every Anvil entry has `public: false` and `status: draft` by default. Production only ships `public: true` and `status: done`. Always read collections through `getPublic()`, never `getCollection()` directly in pages.
- Flags go in `<Flag value="THM{...}" />`. It renders the real value in dev and `THM{redacted}` in the public build. Never write a flag in plain text.
- `public: false` only keeps an entry out of the **site**; it is still committed to git. Anything that must never reach GitHub (raw notes with flags from active rooms, target IPs, loot) is named `*.private.md` / `*.private.mdx` or placed in a `_private/` folder. Both patterns are gitignored.
- Writeups for **active** TryHackMe rooms stay `public: false` (THM policy). Publish only retired or walkthrough-permitted rooms.
- Never put secrets, API keys, webhook URLs or credentials in content, workflow JSON or scripts. Strip credentials from n8n/Make exports before committing; use `.env` (gitignored) and keep `.env.example` current.
- Writeup frontmatter: `title, summary?, date, platform (thm|htb|picoctf|other), difficulty (info|easy|medium|hard|insane), roomUrl?, tags, status, public`.
- Lab frontmatter: `title, summary?, date, tool (n8n|make|zapier|docker|python|other), tags, status, public`.
- Note frontmatter: `title, summary?, topic, updated, tags, status, public`.
- Project frontmatter: `title, summary, stack[], role?, year, state (live|source|private|wip), featured, order, repo?, demo?, cover?, coverAlt?, draft`. `role` only when known (e.g. employer work), never assumed from a repo. Facts come from the repo itself (description, created year, demo URL); no embellishment.

## Personal data and facts

- **Never publish the phone number.** Assemble the email client-side or route it through a form service; never put it in plain markup.
- **Everything in `public/` ships to the live site**, linked or not. Before adding any file there, check it for the phone number or other private data.
  - Original resumes live in the gitignored `private/resumes/`.
  - The site links only `public/assets/resumes/marc-francisco-application-security-resume.pdf`, which must be a phone-free copy. The link appears only when that file exists (`src/lib/public-file.ts`).
- **Certificates** live in `public/assets/certificates/`. Their details in `src/data/site.ts` are transcribed from the PDFs (names, dates, IDs), never inferred.
- **Image placeholders** are `src/lib/placeholder.ts` (placehold.co, no text parameter, labelled as placeholders in alt text and captions). They stand in for the portrait and the live-demo screenshots until Marc supplies the real files. Never generate or scrape a real-looking substitute.
- **Employer details:** never name the specific employer sites that had security findings. Keep findings at "the company's web apps" level.
- Employer work (Ducon, Arcanys, Solutions Resource) stays at resume level. No internal endpoints, configs, client names or screenshots of internal systems.
- Never invent a metric, testimonial, logo, certification or rank. The only numbers on the site are real ones from the resume (load time −25%, bugs −30%, promoted to SE II in six months) or fetched live (GitHub, THM). If a fact is missing, leave the slot out or mark it TODO. Do not fill it.

## Design system: Declassified Dossier on black, bone and cobalt

- **Concept.** The site is a classified case file on the subject. Redaction bars cover key lines and wipe away on scroll (GSAP `clip-path: inset()` scrub). Home sections are exhibits: Profile, Operations History (experience along a cobalt MotionPath line), Evidence (projects), Field Training (THM paths), Capabilities (skills), and Contact ("Request full file"). The layout is left-aligned and editorial; never a centered full-screen hero.
- **Tokens only.** Every colour and font goes through a token in `src/styles/tokens.css` (Tailwind `@theme`, default palette wiped). OKLCH only. Marc's three-colour system: **primary soft black** (`paper` ground, `paper-2` raised band, `paper-3` hover; never #000), **complementary bone** (`ink`, `ink-2`; also `sheet` for real paper objects with `sheet-ink` text), **accent cobalt** (`accent`; `accent-ink` black text on cobalt fills; `accent-deep` for cobalt on bone). Contrast rules: never bone text on cobalt (3:1) or cobalt text on bone (3:1); small cobalt text only on `paper`/`paper-2`. `muted` for tertiary text. No decorative gradients, glows, or emoji icons.
- **Type.** Libre Bodoni for display (weight 400), Poppins for body and UI (400, 500 and 600; Marc's explicit request, recorded as a Hallmark waiver), Geist Mono only for dossier material via `.file-mono` (file numbers, dates, evidence codes). Labels are sentence case and untracked. No tracked all-caps eyebrows, no middle-dot meta strings, and no single italic word inside a roman heading.
- **Layout.** Mobile first from 360px. Breakpoints sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Capped centred container; at 1920 the gutters grow, not the measure. `overflow-x: clip` on html and body (never `hidden`, never `100vw`). Image grid tracks use `minmax(0, 1fr)`. Tap targets are at least 44px.
- **Sections.** Every page section is a `Section` (`src/components/dossier/Section.astro`): a full-bleed band (tone `base`, `raised` or `signal`) on one 12-column grid, with a sticky exhibit rail in cols 1-3 (cobalt letter, name, folio) and content in cols 4-12. Never offset or narrow a section by hand. Tones alternate base and raised. No solid accent-colour bands (Marc found the full cobalt field harsh): cobalt stays in rules, markers, small signals and the primary button. The contact close (`ContactClose.astro`) is a routing slip on the raised band with a 2px cobalt top rule. Band padding is `--section-pad` (96/72/56px).
- **Objects only for real objects.** No generic cards or tinted boxes. Object styling is reserved for things that are physical in the dossier: evidence prints (`EvidencePrint.astro`), certificates (`CertificateCard.astro`, bone paper with a folded corner that follows `--band`), and the stamp. Everything else is typography, rules and bands.
- **Copy.** About 80 words per screen. The first screen shows headline, one sentence and the primary action at 1280×800.
- **Icons.** Register an icon in `src/lib/icons.ts` (Font Awesome path data, or simple-icons for brands Font Awesome lacks, such as TryHackMe), then render it with `<Icon name="..." />`. Output is inline SVG with no runtime, no FA CSS and no CDN. Decorative by default; pass `label` when the icon is a control's only content.
- **Tailwind first.** Use utilities in markup. Custom CSS only for tokens, keyframes and motion paths. Class order comes from `prettier-plugin-tailwindcss`.

## Motion

- All motion lives in `src/scripts/motion/` (`index.ts` boots, `smooth-scroll.ts` runs Lenis, `redact.ts` handles the bars), loaded once by BaseLayout. Lenis runs on `gsap.ticker` and feeds `ScrollTrigger.update`; touch keeps native scroll. `gsap.matchMedia()` gates everything on `(prefers-reduced-motion: no-preference)`, with `(min-width: 64rem)` for desktop-only scrub and pins.
- Redaction markup API: `data-redact` (wipes once on enter), `data-redact="scrub"` (scroll-scrubbed and linear on desktop, enter-wipe elsewhere), `data-redact="manual"` (a page timeline calls `declassify(el)`), `data-redact-lines` (SplitText lines, one bar each, staggered). Bars are `::after` overlays scaled by `--redact`. Always tween with `fromTo` from 1, because the unset custom property has no start value.
- Page-specific motion is a **scene**: a module under `src/scripts/motion/scenes/` that calls `registerScene()` from `registry.ts`, imported by the page's `<script>`. The core runs scenes only when motion is allowed and reverts them on change, so scenes never check reduced motion themselves. Breakpoint-specific motion inside a scene uses its own `gsap.matchMedia()` with `MEDIA.desktop` or `MEDIA.mobile`; never make the main context depend on the breakpoint.
- `<html data-motion>` is `ready`, `reduced`, `failed` or `late`. A CSS failsafe clears the bars 2.5s after load if the script never boots. Bars only render under `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.
- Page transitions are cross-document view transitions (`@view-transition`), with no client router, so every page boots fresh and needs no swap cleanup.
- Animate only `transform`, `opacity` and `clip-path`. Never `transition: all`, and never animate width, height, top or left.
- `prefers-reduced-motion: reduce` means no Lenis, no scrub, bars removed and content shown instantly.
- Content must be fully visible with JS off. Hidden or covered initial states are gated behind `@media (scripting: enabled)`, never behind a class an inline script adds. Redaction bars are pseudo-element overlays; the real text is always in the DOM.
- Scroll budget (Hallmark): one scroll-scrubbed pattern per page on structural targets only (bars, one display element, a path line), never moving body text. `linear` (`ease: 'none'`) when scrubbing.
- Every interactive element gets `:focus-visible` styles that appear instantly, plus hover, active and disabled states.
- No custom cursor and no parallax (Hallmark floor). No inline `style=""` attributes either: the strict CSP blocks them, so use Tailwind arbitrary values such as `h-(--header-h)`.

## Code standards

- TypeScript strict, with no `any`. Use named exports and explicit return types on exported functions (Google TS style). ESLint flat config: `eslint-config-airbnb-extended`, `typescript-eslint` strict-type-checked, `eslint-plugin-astro`, `jsx-a11y`. Format with Prettier.
- Keep components small and single-purpose. Content lives in collections or `src/data`, never hard-coded in markup.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). Husky with lint-staged runs lint and typecheck on commit; never bypass with `--no-verify`.

## Security

- Static output only, with no server routes unless explicitly decided.
- `vercel.json` sets a strict CSP (`script-src 'self'` with hashes, no `unsafe-inline`), HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and `frame-ancestors 'none'`. Re-check the CSP whenever a script or external origin is added.
- No `set:html` or `dangerouslySetInnerHTML` on anything that is not author-controlled. External links use `rel="noopener noreferrer"`.
- Build-time secrets (such as `GITHUB_TOKEN`) are read via `import.meta.env` without the `PUBLIC_` prefix, so they never reach the client.
- Commit the lockfile and pin versions. Run `npm audit` before releases.

## Definition of done

- `npm run check`, `npm run lint` and `npm run build` all pass.
- After the public build, `grep -r "THM{" dist/` shows only `THM{redacted}`, and draft or private slugs are absent from `dist/`.
- Layout verified at 360, 768, 1024, 1440 and 1920 widths with no horizontal overflow.
- Reduced-motion and JS-off checks: all content is readable.
- Lighthouse 95 or higher on all categories; no CSP violations in the console.
