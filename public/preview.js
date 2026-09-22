// Reveal native disclosure ancestors when following a scorecard or source deep link.
// Text enlargement can wrap the header; keep anchor clearance tied to its actual size.
function updateHeaderClearance() {
  const header = document.querySelector('.site-header');
  if (header) {
    const height = Math.ceil(header.getBoundingClientRect().height);
    // Enlarged text may wrap navigation into several rows. Keep reading space
    // available instead of pinning a header that occupies most of the viewport.
    header.classList.toggle('header-expanded', height > innerHeight * .35);
    const clearance = getComputedStyle(header).position === 'sticky' ? height : 0;
    document.documentElement.style.setProperty('--header-clearance', `${clearance}px`);
  }
}
window.addEventListener('resize', updateHeaderClearance);
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderClearance();
  const header = document.querySelector('.site-header');
  if (header && 'ResizeObserver' in window) new ResizeObserver(updateHeaderClearance).observe(header);
  const nav = document.querySelector('.section-nav');
  nav?.addEventListener('focusin', event => {
    const link = event.target.closest('a');
    if (!link) return;
    // Some browsers reveal only a fragment of an off-screen inline link on Tab.
    // Scroll only this strip, keeping the entire focused label in view.
    requestAnimationFrame(() => {
      const box = nav.getBoundingClientRect(), target = link.getBoundingClientRect();
      if (target.right > box.right) nav.scrollLeft += target.right - box.right;
      if (target.left < box.left) nav.scrollLeft -= box.left - target.left;
    });
  });
});
function revealTarget() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  let parent = target;
  while (parent) {
    if (parent.tagName === 'DETAILS') parent.open = true;
    parent = parent.parentElement;
  }
  if (target.matches('.score-table tr')) {
    const detail = target.querySelector('details');
    if (detail) detail.open = true;
  }
  requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
}
window.addEventListener('hashchange', revealTarget);
document.addEventListener('DOMContentLoaded', revealTarget);
