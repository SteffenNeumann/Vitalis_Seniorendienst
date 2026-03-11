// ============================================================
// Vitalis Seniorendienst – main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Navigation ──────────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const navOverlay = document.querySelector('.nav-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  document.querySelectorAll('.nav__links a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeNav();
      closeEngagementBanner();
    }
  });

  function closeNav() {
    document.body.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  // ── Sticky Navigation ──────────────────────────────────
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const onScroll = () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Smooth Scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Aktiver Nav-Link ───────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── Cookie Banner ──────────────────────────────────────
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookiesDecision')) {
    setTimeout(() => cookieBanner.classList.add('is-visible'), 1500);
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookiesDecision', 'accepted');
      cookieBanner.classList.remove('is-visible');
    });
  }
  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookiesDecision', 'declined');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // ── FAQ Accordion (BEM-Klassen aus components.css) ─────
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Alle schließen
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        const ans = openItem.querySelector('.faq-item__answer');
        if (ans) ans.style.maxHeight = null;
        openItem.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
      });

      // Geklicktes öffnen
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });

    question.setAttribute('aria-expanded', 'false');
  });

  // ── Kontaktformular ────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const successMsg = document.getElementById('form-success');
      const errorMsg = document.getElementById('form-error');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet…';
      if (successMsg) successMsg.hidden = true;
      if (errorMsg) errorMsg.hidden = true;

      const formspreeUrl = contactForm.dataset.action || 'https://formspree.io/f/PLATZHALTER';

      try {
        const response = await fetch(formspreeUrl, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });
        if (response.ok) {
          contactForm.reset();
          if (successMsg) { successMsg.hidden = false; successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        } else throw new Error();
      } catch {
        if (errorMsg) errorMsg.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Nachricht senden';
      }
    });
  }

  // ── Floating Phone Button ──────────────────────────────
  const floatingBtn = document.querySelector('.floating-phone-btn');
  if (floatingBtn) {
    const contactSection = document.querySelector('.contact-grid, #kontakt');
    if (contactSection) {
      const obs = new IntersectionObserver(
        entries => floatingBtn.classList.toggle('is-hidden', entries[0].isIntersecting),
        { threshold: 0.1 }
      );
      obs.observe(contactSection);
    }
  }

  // ── Engagement Banner (nach 35 Sekunden Verweildauer) ──
  initEngagementBanner();

});

// ── Engagement Banner ─────────────────────────────────────
function initEngagementBanner() {
  const currentPage = window.location.pathname.split('/').pop();

  // Nicht auf Kontaktseite oder wenn schon in dieser Session gezeigt
  if (currentPage === 'kontakt.html') return;
  if (sessionStorage.getItem('engagementShown')) return;

  const banner = document.getElementById('engagement-banner');
  if (!banner) return;

  let shown = false;
  let idleTimer = null;

  function showBanner() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem('engagementShown', '1');
    banner.classList.add('is-visible');
    banner.setAttribute('aria-hidden', 'false');
    // Fokus auf Schließen-Button für Barrierefreiheit
    setTimeout(() => banner.querySelector('.engagement-banner__close')?.focus(), 300);
  }

  // Trigger 1: 35 Sekunden Verweildauer
  idleTimer = setTimeout(showBanner, 35000);

  // Trigger 2: Exit Intent (Desktop) – Maus verlässt Fenster nach oben
  const onMouseLeave = (e) => {
    if (e.clientY <= 0) showBanner();
  };
  document.addEventListener('mouseleave', onMouseLeave);

  // Trigger 3: Nach 60% Scroll-Tiefe + Zurückscrollen
  let maxScroll = 0;
  let scrollTriggerFired = false;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (pct > maxScroll) maxScroll = pct;
    // Wenn User >= 60% gescrolt hat und wieder nach oben scrollt
    if (maxScroll >= 60 && pct < maxScroll - 15 && !scrollTriggerFired) {
      scrollTriggerFired = true;
      clearTimeout(idleTimer);
      showBanner();
    }
  }, { passive: true });
}

function closeEngagementBanner() {
  const banner = document.getElementById('engagement-banner');
  if (banner) {
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
  }
}

// Global: Schließen-Button
document.addEventListener('click', e => {
  if (e.target.closest('.engagement-banner__close') || e.target.closest('.engagement-banner__overlay')) {
    closeEngagementBanner();
  }
});


/* ══ NAV INLINE-SUCHE ════════════════════════════════════════ */
(function() {
  const PAGES = [
    { title: 'Startseite',      desc: 'Alltagsbegleitung & Haushaltshilfe für Senioren',        url: 'index.html',           keys: 'start home betreuung senioren' },
    { title: 'Unsere Leistungen', desc: 'Haushaltshilfe, Arztbegleitung, Einkaufen & mehr',     url: 'leistungen.html',      keys: 'leistungen haushalt kochen arzt einkaufen reinigung' },
    { title: 'Über uns',        desc: 'Das Team & unsere Werte',                                 url: 'ueber-uns.html',       keys: 'über uns team mitarbeiter werte qualität' },
    { title: 'Kostenübernahme', desc: 'Pflegekasse übernimmt Kosten – §45a SGB XI',              url: 'kostenuebernahme.html',keys: 'kosten pflegekasse krankenkasse 45a sgb finanzierung kostenlos' },
    { title: 'Häufige Fragen',  desc: 'FAQ – Antworten auf die häufigsten Fragen',               url: 'faq.html',             keys: 'faq fragen antworten hilfe wie was wann' },
    { title: 'Kontakt',         desc: 'Kostenlose Beratung – wir rufen Sie zurück',              url: 'kontakt.html',         keys: 'kontakt anrufen email telefon beratung formular' },
    { title: 'Standorte',       desc: 'Erding, München, Freising & Umgebung',                   url: 'standorte.html',       keys: 'standorte erding münchen freising ebersberg garching gebiet' },
    { title: 'Karriere',        desc: 'Jobs bei Vitalis Seniorendienst',                         url: 'karriere.html',        keys: 'karriere job stelle bewerbung arbeit alltagsbegleiter' },
    { title: 'Datenschutz',     desc: 'Datenschutzerklärung',                                    url: 'datenschutz.html',     keys: 'datenschutz dsgvo privacy' },
    { title: 'Impressum',       desc: 'Impressum & rechtliche Angaben',                          url: 'impressum.html',       keys: 'impressum rechtlich firma' }
  ];

  const nav      = document.querySelector('.nav');
  const openBtn  = document.getElementById('searchOpen');
  const closeBtn = document.getElementById('searchClose');
  const wrap     = document.getElementById('navSearchWrap');
  const input    = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  const results  = document.getElementById('searchResults');
  const empty    = document.getElementById('searchEmpty');

  if (!nav || !openBtn || !wrap) return;

  function openSearch() {
    nav.classList.add('is-searching');
    wrap.setAttribute('aria-hidden', 'false');
    setTimeout(() => { if (input) input.focus(); }, 320);
  }

  function closeSearch() {
    nav.classList.remove('is-searching');
    wrap.setAttribute('aria-hidden', 'true');
    if (input) input.value = '';
    if (dropdown) dropdown.classList.remove('is-visible');
    if (results) results.innerHTML = '';
    if (empty) empty.hidden = true;
  }

  function renderResults(q) {
    results.innerHTML = '';
    empty.hidden = true;
    dropdown.classList.remove('is-visible');
    if (!q.trim()) return;
    const ql = q.toLowerCase();
    const hits = PAGES.filter(p =>
      p.title.toLowerCase().includes(ql) ||
      p.desc.toLowerCase().includes(ql) ||
      p.keys.includes(ql)
    );
    if (!hits.length) {
      empty.hidden = false;
      dropdown.classList.add('is-visible');
      return;
    }
    hits.forEach(p => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = `<a href="${p.url}"><span class="search-result__title">${p.title}</span><span class="search-result__desc">${p.desc}</span></a>`;
      results.appendChild(li);
    });
    dropdown.classList.add('is-visible');
  }

  openBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (input) {
    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const a = results.querySelector('a'); if (a) a.click(); }
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.key === 'k') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
  });
  document.addEventListener('click', e => {
    if (nav.classList.contains('is-searching') &&
        !wrap.contains(e.target) && !openBtn.contains(e.target)) closeSearch();
  });
})();
