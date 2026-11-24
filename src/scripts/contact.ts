/**
 * Email reveal. The address is never present as a string in the HTML: the button carries
 * its two parts in data attributes, and a click swaps the button for a mailto link.
 * Works without the motion core (no GSAP), so it runs with reduced motion too.
 */

function revealEmail(button: HTMLButtonElement): void {
  const { u: user, d: domain } = button.dataset;
  if (!user || !domain) return;

  const address = `${user}@${domain}`;
  const link = document.createElement('a');
  link.href = `mailto:${address}`;
  link.textContent = address;
  // Revealed in the routing slip's email row; the cobalt underline marks it as the live route.
  link.className = 'text-md text-ink underline decoration-accent underline-offset-4';
  button.replaceWith(link);
  link.focus();
}

document.querySelectorAll<HTMLButtonElement>('[data-email-reveal]').forEach((button) => {
  button.addEventListener(
    'click',
    () => {
      revealEmail(button);
    },
    { once: true },
  );
});
