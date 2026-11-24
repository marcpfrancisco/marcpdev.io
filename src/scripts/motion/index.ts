import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initRedactions } from './redact';
import { MEDIA, runScenes } from './registry';
import { createSmoothScroll } from './smooth-scroll';

/**
 * Motion core. Loaded once by BaseLayout as a bundled module (CSP: script-src 'self').
 *
 * <html data-motion> states, read by CSS:
 *   (absent)  script not booted yet; the CSS failsafe clears bars after 2.5s
 *   ready     scenes running; GSAP owns the bars
 *   reduced   prefers-reduced-motion; no smooth scroll, no bars
 *   failed    a scene threw; bars removed so content is never stuck behind them
 *   late      booted after the CSS failsafe already cleared the bars; keep them cleared
 *
 * The main context gates on reduced motion only, so a resize never re-covers declassified
 * text; breakpoint-specific motion lives in nested matchMedia calls.
 */

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;

/** Must match the failsafe delay in global.css (2.5s), minus a safety margin. */
const FAILSAFE_MS = 2300;

function boot(): void {
  const mm = gsap.matchMedia();
  const late = performance.now() > FAILSAFE_MS;

  mm.add(MEDIA.reduce, () => {
    root.dataset.motion = 'reduced';
  });

  mm.add(MEDIA.motion, () => {
    try {
      const destroyScroll = createSmoothScroll();
      if (late) {
        root.dataset.motion = 'late';
        return destroyScroll;
      }

      initRedactions();
      const destroyScenes = runScenes();
      root.dataset.motion = 'ready';
      ScrollTrigger.refresh();

      return () => {
        destroyScenes();
        destroyScroll();
      };
    } catch (error) {
      root.dataset.motion = 'failed';
      reportError(error);
      return undefined;
    }
  });
}

// Split and measure only after the web fonts settle, so line breaks are final.
document.fonts.ready.then(boot).catch((error: unknown) => {
  reportError(error);
  boot();
});
