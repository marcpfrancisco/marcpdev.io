import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** Matches the CSS scroll-padding-top (header height plus --spacing-xl) used by native anchors. */
function anchorOffset(): number {
  const styles = getComputedStyle(document.documentElement);
  const header = Number.parseFloat(styles.getPropertyValue('--header-h'));
  const gap = Number.parseFloat(styles.getPropertyValue('--spacing-xl'));
  return (Number.isFinite(header) ? header : 64) + (Number.isFinite(gap) ? gap : 40);
}

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis share one frame.
 * Touch keeps native scrolling (Lenis default `syncTouch: false`).
 */
export function createSmoothScroll(): () => void {
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    anchors: { offset: -anchorOffset() },
    // Never hijack scrolling inside the mobile menu or opted-out regions.
    prevent: (node: HTMLElement) => node.closest('[popover], [data-lenis-prevent]') !== null,
  });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  const tick = (time: number): void => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
