# CLAUDE.md

Personal portfolio and knowledge forge for **Marc Francisco**, a security-minded engineer (AppSec and SecOps) with six years of full-stack work, based in Dubai. One repo serves two purposes:

1. **Portfolio site.** A public site on Vercel, and the home page is the "Declassified Dossier".
2. **Anvil.** A private-by-default archive of CTF writeups (TryHackMe "Tripulante"), security notes, and AI-automation labs (n8n, Make, Zapier). An entry is published only when it is explicitly marked public.

Full design rationale: `C:\Users\MARKETING.USB\.claude\plans\this-project-workshop-folder-virtual-mango.md`.

## Stack

Astro 7 (static output) · React 19 islands (only where state is needed) · MDX · Tailwind CSS 4 (`@tailwindcss/vite`, tokens in `@theme`) · GSAP 3.15 (ScrollTrigger, MotionPathPlugin) · Lenis · Font Awesome 7 svg-core · Fontsource variable fonts (Fraunces, Geist, Geist Mono) · Pagefind · TypeScript strict. Node >= 22.

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
- Writeup frontmatter: `title, date, platform (thm|htb|picoctf), difficulty (easy|medium|hard), room_url, tags, status, public`.
- Lab frontmatter: `title, date, tool (n8n|make|zapier|docker|python), tags, status, public`.
- Note frontmatter: `title, topic, tags, updated, public`.
- Project frontmatter: `title, summary, stack[], role, year, featured, order, repo, demo, cover, status (live|archived|wip)`.

## Personal data and facts

- **Never publish the phone number.** Assemble the email client-side or route it through a form service; never put it in plain markup.
- Employer work (Ducon, Arcanys, Solutions Resource) stays at resume level. No internal endpoints, configs, client names or screenshots of internal systems.
- Never invent a metric, testimonial, logo, certification or rank. The only numbers on the site are real ones from the resume (load time −25%, bugs −30%, promoted to SE II in six months) or fetched live (GitHub, THM). If a fact is missing, leave the slot out or mark it TODO. Do not fill it.

## Design system: dark minimalist luxury, Declassified Dossier

- **Concept.** The site is a classified case file on the subject. Redaction bars cover key lines and wipe away on scroll (GSAP `clip-path: inset()` scrub). Home sections are exhibits: Profile, Operations History (experience along a champagne MotionPath line), Evidence (projects), Field Training (THM paths), Capabilities (skills), and Contact ("Request full file"). The layout is left-aligned and editorial; never a centered full-screen hero.
- **Tokens only.** Every colour and font goes through tokens in `src/styles/tokens.css` / Tailwind `@theme`. No literal hex or `font-family` outside that file. Palette: base `#0A0A0B`, surface `#121214`, hairline `white/8%`, text `#EDEAE4`, muted `#8A8780`, one champagne accent `#C9A96E`. No decorative gradients, glows, cards inside cards, or emoji as icons.
- **Type.** Fraunces (display), Geist (body, 16px minimum), Geist Mono only for dossier material such as file numbers, dates and code. Labels are sentence or lower case, untracked. No tracked all-caps eyebrows, no middle-dot-joined meta strings, and no single italic word inside a roman heading.
- **Layout.** Mobile first from 360px. Breakpoints sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Capped centred container; at 1920 the gutters grow, not the measure. `overflow-x: clip` on html and body (never `hidden`, never `100vw`). Image grid tracks use `minmax(0, 1fr)`. Tap targets are at least 44px.
- **Copy.** About 80 words per screen. The first screen shows headline, one sentence and the primary action at 1280×800.
- **Icons.** Font Awesome via svg-core and per-icon imports, rendered to inline SVG through `<Icon>`. No kit script and no CDN.
- **Tailwind first.** Use utilities in markup. Custom CSS only for tokens, keyframes and motion paths. Class order comes from `prettier-plugin-tailwindcss`.

## Motion

- Set up all motion in one place, `src/scripts/motion.ts`. Lenis is driven by `gsap.ticker`, with `lenis.on('scroll', ScrollTrigger.update)`. Use `gsap.matchMedia()` for mobile, tablet and desktop variants. Pins and horizontal strips are `lg+` only.
- Clean up on `astro:before-swap`: kill ScrollTriggers and destroy Lenis.
- Animate only `transform`, `opacity` and `clip-path`. Never `transition: all`, and never animate width, height, top or left.
- `prefers-reduced-motion: reduce` means no Lenis, no scrub, bars removed and content shown instantly.
- Content must be fully visible with JS off. Hidden initial states are gated behind a `.js` class on `<html>`. Redaction bars are `aria-hidden` overlays; the real text is always in the DOM.
- Every interactive element gets `:focus-visible` styles that appear instantly.

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
