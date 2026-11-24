/**
 * Navigation behaviour that HTML alone does not give:
 * 1. A native popover only closes on Escape, outside click or its invoker, so a link inside
 *    the full-screen mobile menu would navigate behind it. Links close the menu first.
 * 2. While the menu is open, Tab wraps inside it instead of walking the page underneath.
 * 3. Smooth scrolling never moves focus, so same-page anchors focus their target
 *    (sections carry tabindex="-1") and screen readers announce where the reader landed.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initMobileMenu(menu: HTMLElement): void {
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a[href]')) {
      menu.hidePopover();
    }
  });

  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items.at(0);
    const last = items.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function samePageTarget(link: HTMLAnchorElement): HTMLElement | null {
  const url = new URL(link.href);
  if (url.pathname !== window.location.pathname || !url.hash) return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

function initAnchorFocus(): void {
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href*="#"]') : null;
    if (!(link instanceof HTMLAnchorElement)) return;
    const target = samePageTarget(link);
    if (!target) return;
    // Let the scroll (native or Lenis) start, then hand focus over without a second jump.
    requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
  });
}

const menu = document.getElementById('mobile-nav');
if (menu) initMobileMenu(menu);
initAnchorFocus();
