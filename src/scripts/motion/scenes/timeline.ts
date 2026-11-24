import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA, registerScene } from '../registry';

/**
 * Exhibit B routing trail. The SVG route is built from the measured node positions (so it
 * passes through every node at any size) and rebuilt on every ScrollTrigger refresh.
 * From 40rem: the route draws and a dot travels it, scrubbed (linear) between first and last
 * node. Below 40rem: the route is drawn static, no dot (Hallmark scroll budget).
 * Nodes turn champagne as the reader reaches them, at every size.
 */

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, ScrollTrigger);

const READ_LINE = 'center 60%';
const SWAY_PX = 14;

interface Point {
  readonly x: number;
  readonly y: number;
}

function centreOf(element: Element, origin: DOMRect): Point {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - origin.left,
    y: rect.top + rect.height / 2 - origin.top,
  };
}

/** Gentle alternating bows between nodes: a routing trail, not a straight rule. */
function routeThrough(points: readonly Point[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points as [Point, ...Point[]];

  let previous = first;
  const segments = rest.map((point, index) => {
    const reach = (point.y - previous.y) * 0.35;
    const sway = Math.min(SWAY_PX, previous.x) * (index % 2 === 0 ? 1 : -1);
    const segment = `C ${String(previous.x + sway)} ${String(previous.y + reach)}, ${String(point.x + sway)} ${String(point.y - reach)}, ${String(point.x)} ${String(point.y)}`;
    previous = point;
    return segment;
  });

  return [`M ${String(first.x)} ${String(first.y)}`, ...segments].join(' ');
}

registerScene(() => {
  const section = document.querySelector<HTMLElement>('[data-scene="timeline"]');
  const routeRoot = section?.querySelector<HTMLElement>('[data-route-root]');
  const svg = routeRoot?.querySelector<SVGSVGElement>('[data-route]');
  const path = svg?.querySelector<SVGPathElement>('[data-route-path]');
  const dot = routeRoot?.querySelector<HTMLElement>('[data-route-dot]');
  if (!section || !routeRoot || !svg || !path || !dot) return undefined;

  const nodes = Array.from(routeRoot.querySelectorAll<HTMLElement>('[data-route-node]'));
  const firstNode = nodes.at(0);
  const lastNode = nodes.at(-1);
  if (nodes.length < 2 || !firstNode || !lastNode) return undefined;

  const build = (): void => {
    const origin = routeRoot.getBoundingClientRect();
    svg.setAttribute('width', String(origin.width));
    svg.setAttribute('height', String(origin.height));
    svg.setAttribute('viewBox', `0 0 ${String(origin.width)} ${String(origin.height)}`);
    path.setAttribute('d', routeThrough(nodes.map((node) => centreOf(node, origin))));
  };

  build();
  ScrollTrigger.addEventListener('refreshInit', build);

  nodes.forEach((node) => {
    ScrollTrigger.create({
      trigger: node,
      start: READ_LINE,
      // Stay reached for the rest of the page; only scrolling back above clears it.
      end: 'max',
      toggleClass: { targets: node, className: 'is-reached' },
    });
  });

  const mm = gsap.matchMedia();

  mm.add(MEDIA.tablet, () => {
    section.dataset.route = 'on';
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: firstNode,
          start: READ_LINE,
          endTrigger: lastNode,
          end: READ_LINE,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%' }, 0)
      .fromTo(
        dot,
        { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], end: 0 } },
        { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0, end: 1 } },
        0,
      );
  });

  mm.add(MEDIA.phone, () => {
    section.dataset.route = 'static';
  });

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', build);
    mm.revert();
    delete section.dataset.route;
  };
});
