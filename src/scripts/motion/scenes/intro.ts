import { gsap } from 'gsap';
import { isDesktop, registerScene } from '../registry';

/**
 * Dossier page 01 intro, about 1.1s on desktop and half that on mobile:
 * the file number types in, the subject's bar wipes, then the role's, then the stamp lands.
 * Plays once per session; any key, pointer, wheel or touch skips straight to the end.
 */

const SEEN_KEY = 'mf:intro-seen';
const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const;

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false; // storage blocked: just play it
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // storage blocked: the intro will play again next visit, which is harmless
  }
}

registerScene(() => {
  const hero = document.querySelector<HTMLElement>('[data-scene="intro"]');
  if (!hero) return undefined;

  const root = document.documentElement;
  const bars = hero.querySelectorAll<HTMLElement>('[data-redact="manual"]');
  const typed = document.querySelectorAll<HTMLElement>('[data-intro="type"]');
  const stamp = hero.querySelector<HTMLElement>('[data-intro="stamp"]');

  const finish = (): void => {
    root.dataset.intro = 'done';
    markIntroSeen();
  };

  if (hasSeenIntro()) {
    gsap.set(bars, { '--redact': 0 });
    finish();
    return undefined;
  }

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: finish,
  });

  timeline
    .fromTo(
      typed,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'steps(7)' },
      0,
    )
    .fromTo(bars, { '--redact': 1 }, { '--redact': 0, duration: 0.6, stagger: 0.25 }, 0.15);

  if (stamp) {
    timeline.fromTo(
      stamp,
      { opacity: 0, scale: 1.12 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
      0.75,
    );
  }

  // Mobile plays the same story at double speed (about 0.55s).
  timeline.timeScale(isDesktop() ? 1 : 2);

  const skip = (): void => {
    timeline.progress(1);
  };
  SKIP_EVENTS.forEach((type) => {
    window.addEventListener(type, skip, { once: true, passive: true });
  });

  return () => {
    SKIP_EVENTS.forEach((type) => {
      window.removeEventListener(type, skip);
    });
    timeline.progress(1);
  };
});
