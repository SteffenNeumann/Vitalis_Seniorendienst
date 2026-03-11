// ============================================================
// Vitalis Seniorendienst – animations.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  if (!('IntersectionObserver' in window)) {
    // Fallback: alles sofort sichtbar
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  };

  // ── Basis Observer: fügt 'is-visible' hinzu (passt zur CSS) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Alle Animations-Klassen beobachten (inkl. fade-in-left/right)
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .scale-in'
  );

  animatedElements.forEach(el => {
    if (prefersReduced) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

  // ── Stagger-Animation ──────────────────────────────────
  document.querySelectorAll('.stagger-children').forEach(parent => {
    const children = Array.from(parent.children);

    if (!prefersReduced) {
      children.forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(16px)';
        child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
      });
    }

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

  // ── Zahlen-Animation ───────────────────────────────────
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
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

});
