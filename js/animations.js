// ============================================================
// Vitalis Seniorendienst – animations.js
// Dezente Einblend-Animationen via Intersection Observer
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Kein Animations-Support oder reduzierte Bewegung bevorzugt
  if (!('IntersectionObserver' in window)) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Basis Intersection Observer ────────────────────────
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Alle Animations-Klassen beobachten
  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-up, .slide-left, .slide-right'
  );

  animatedElements.forEach(el => {
    if (prefersReduced) {
      // Bei reduzierter Bewegung sofort sichtbar machen
      el.classList.add('animated');
    } else {
      el.style.opacity = '0';
      observer.observe(el);
    }
  });

  // ── Stagger-Animation für Kinderlemente ────────────────
  document.querySelectorAll('.stagger-children').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      if (!prefersReduced) {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
      }
    });

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach(child => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    staggerObserver.observe(parent);
  });

  // ── Zahlen-Hochzähl-Animation ──────────────────────────
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(el, target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countObserver.observe(el);
  });

  function animateCount(el, target) {
    if (prefersReduced) { el.textContent = target; return; }
    const duration = 1500;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

});
