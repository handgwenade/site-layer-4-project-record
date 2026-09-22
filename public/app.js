const filterButtons = [...document.querySelectorAll('.filter-button')];
const findings = [...document.querySelectorAll('.finding')];
const emptyMessage = document.querySelector('#filter-empty');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });

    let visibleCount = 0;
    findings.forEach((finding) => {
      const visible = selected === 'all' || finding.dataset.kind === selected;
      finding.hidden = !visible;
      finding.classList.toggle('contrast', visible && visibleCount % 2 === 1);
      if (visible) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount !== 0;
  });
});
