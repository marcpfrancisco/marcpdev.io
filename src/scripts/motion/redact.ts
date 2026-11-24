import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { MEDIA } from './registry';

/**
 * Declassify: redaction bars wipe off as content enters the viewport.
 *
 * Markup API (bars are CSS ::after overlays scaled by --redact, 1 = covered, 0 = gone):
 *   data-redact            one element; bar wipes once on enter
 *   data-redact="scrub"    bar is scrubbed by scroll on desktop (linear), wipes on enter elsewhere
 *   data-redact="manual"   left covered; a page timeline reveals it (e.g. the hero intro)
 *   data-redact-lines      block of text split into lines, one bar per line, staggered
 *
 * The text itself never moves: only the overlay's transform changes.
 */

const WIPE = { duration: 0.8, ease: 'power3.inOut' } as const;
const ENTER_START = 'top 85%';

/** The unset custom property has no numeric start value, so every wipe states it. */
const COVERED = { '--redact': 1 } as const;

function wipeOnEnter(element: HTMLElement): void {
  gsap.fromTo(element, COVERED, {
    '--redact': 0,
    ...WIPE,
    scrollTrigger: { trigger: element, start: ENTER_START, once: true },
  });
}

function initSingles(): void {
  const elements = gsap.utils.toArray<HTMLElement>('[data-redact]');
  const scrubbed = elements.filter((element) => element.dataset.redact === 'scrub');

  elements
    .filter((element) => element.dataset.redact !== 'manual' && element.dataset.redact !== 'scrub')
    .forEach(wipeOnEnter);

  if (scrubbed.length === 0) return;

  // Only scrub elements depend on the breakpoint, so only they re-run on resize.
  const mm = gsap.matchMedia();
  mm.add(MEDIA.desktop, () => {
    scrubbed.forEach((element) => {
      gsap.fromTo(element, COVERED, {
        '--redact': 0,
        ease: 'none',
        scrollTrigger: { trigger: element, start: ENTER_START, end: 'top 45%', scrub: true },
      });
    });
  });
  mm.add(MEDIA.mobile, () => {
    scrubbed.forEach(wipeOnEnter);
  });
}

/** Blocks whose lines have already been declassified; re-splits must not re-cover them. */
const declassified = new WeakSet<HTMLElement>();

function initLines(): void {
  gsap.utils.toArray<HTMLElement>('[data-redact-lines]').forEach((block) => {
    let wipe: gsap.core.Tween | undefined;

    SplitText.create(block, {
      type: 'lines',
      linesClass: 'redact-line',
      aria: 'auto',
      autoSplit: true,
      onSplit(self) {
        // A re-split (resize, font swap) replaces the line elements: drop the old wipe.
        wipe?.scrollTrigger?.kill();
        wipe?.kill();

        // The block-level bar is the pre-split fallback; line bars take over now.
        gsap.set(block, { '--redact': 0 });

        if (declassified.has(block)) {
          gsap.set(self.lines, { '--redact': 0 });
          return;
        }

        wipe = gsap.fromTo(self.lines, COVERED, {
          '--redact': 0,
          ...WIPE,
          stagger: 0.08,
          scrollTrigger: { trigger: block, start: ENTER_START, once: true },
          onComplete: () => {
            declassified.add(block);
          },
        });
      },
    });
  });
}

export function initRedactions(): void {
  initSingles();
  initLines();
}

/** Reveal one manual bar now; used by page timelines. */
export function declassify(element: Element, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.fromTo(element, COVERED, { '--redact': 0, ...WIPE, ...vars });
}
