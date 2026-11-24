import { gsap } from 'gsap';

/**
 * Page scenes. A page imports its scene module, which calls registerScene(); the motion core
 * runs every registered scene inside its gsap.matchMedia context once motion is allowed, so
 * scenes never handle reduced motion or the failsafe themselves. Anything created inside a
 * scene (tweens, timelines, ScrollTriggers, nested gsap.matchMedia) is reverted with it.
 */

export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  /** The Exhibit B route scrubs from here; redaction scrub waits for `desktop`. */
  tablet: '(min-width: 40rem)',
  phone: '(max-width: 39.999rem)',
  desktop: '(min-width: 64rem)',
  mobile: '(max-width: 63.999rem)',
} as const;

export type SceneCleanup = () => void;
export type Scene = () => SceneCleanup | undefined;

const scenes: Scene[] = [];

interface Running {
  readonly context: gsap.Context;
  readonly cleanups: SceneCleanup[];
}

/** The scenes currently running; null while the core is not running scenes. */
let running: Running | null = null;

function start(scene: Scene, into: SceneCleanup[]): void {
  const cleanup = scene();
  if (typeof cleanup === 'function') into.push(cleanup);
}

/**
 * Module scripts can evaluate after the core has booted (e.g. fonts already cached). A scene
 * registered then starts at once, inside a gsap.context, so it is reverted with the others
 * instead of leaking outside the core's matchMedia.
 */
export function registerScene(scene: Scene): void {
  scenes.push(scene);
  const current = running;
  if (current) {
    current.context.add(() => {
      start(scene, current.cleanups);
    });
  }
}

/** Called by the motion core. Returns one cleanup that tears every scene down. */
export function runScenes(): SceneCleanup {
  const cleanups: SceneCleanup[] = [];
  const context = gsap.context(() => {
    scenes.forEach((scene) => {
      start(scene, cleanups);
    });
  });
  running = { context, cleanups };

  return () => {
    running = null;
    cleanups.forEach((cleanup) => {
      cleanup();
    });
    context.revert();
  };
}

export function isDesktop(): boolean {
  return window.matchMedia(MEDIA.desktop).matches;
}
