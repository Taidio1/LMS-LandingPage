// ── Scroll Reveal ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// ── Animated Counters ─────────────────────────
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function animateCounter(el: HTMLElement): void {
  const target = parseInt(el.dataset.target ?? '0', 10);
  const display = el.dataset.display ?? String(target);
  const duration = 1800;
  const startTime = performance.now();

  function tick(now: number): void {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOutQuad(progress) * target);
    el.textContent = value.toLocaleString('pl-PL');
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = display;
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target as HTMLElement);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll<HTMLElement>('.counter').forEach((el) => {
  counterObserver.observe(el);
});
