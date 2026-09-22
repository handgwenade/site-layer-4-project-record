/* Clipboard access only follows an explicit click. No email or filing submission. */
document.querySelectorAll('[data-copy-target]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const feedback = document.getElementById(button.getAttribute('aria-describedby'));
    if (!target || !feedback) return;
    feedback.textContent = '';
    const text = target.innerText.trim();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      feedback.textContent = `${button.dataset.copyLabel} copied.`;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = 'Copy unavailable. Text selected; use your device’s Copy command.';
    }
  });
});
