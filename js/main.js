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

  // ── Leistungs-Finder Wizard ────────────────────────────
  initLeistungsWizard();

  // ── Neue interaktive Features ─────────────────────────
  initPlzChecker();
  initKontaktVorauswahl();
  initFuerWenCheck();

});

// ── Engagement Banner ─────────────────────────────────────
// Gemeinsamer State (module-level, damit closeEngagementBanner Zugriff hat)
const _engagementState = { trapFn: null, previousFocusEl: null };
let _engagementShown = false;
let _engagementRepeatTimer = null;

const ENGAGEMENT_REPEAT_DELAY = 30000; // 30 Sekunden

function _showEngagementBanner() {
  const banner = document.getElementById('engagement-banner');
  if (!banner || _engagementShown) return;
  _engagementShown = true;

  banner.classList.add('is-visible');
  banner.setAttribute('aria-hidden', 'false');

  // Fokus merken und auf Close-Button setzen
  _engagementState.previousFocusEl = document.activeElement;
  setTimeout(() => banner.querySelector('.engagement-banner__close')?.focus(), 300);

  // Focus-Trap aktivieren
  _engagementState.trapFn = function(e) {
    if (e.key !== 'Tab') return;
    const focusable = banner.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  banner.addEventListener('keydown', _engagementState.trapFn);
}

function initEngagementBanner() {
  const currentPage = window.location.pathname.split('/').pop();

  // Auf diesen Seiten kein Banner anzeigen
  const excludedPages = ['kontakt.html', 'datenschutz.html', 'impressum.html', 'karriere.html'];
  if (excludedPages.includes(currentPage)) return;

  // Test-Modus: ?noBanner in der URL oder localStorage.noBanner deaktiviert das Banner seitenübergreifend
  if (new URLSearchParams(window.location.search).has('noBanner')) {
    localStorage.setItem('noBanner', '1');
    return;
  }
  if (localStorage.getItem('noBanner')) return;

  const banner = document.getElementById('engagement-banner');
  if (!banner) return;

  // Referenzen für späteres Aufräumen der Erst-Trigger
  let scrollHandler = null;
  let mouseLeaveHandler = null;

  // Page Visibility – Timer nur bei aktivem Tab laufen lassen
  let timerRemaining = 35000;
  let timerStart = Date.now();
  let idleTimer = setTimeout(showBannerAndCleanup, timerRemaining);

  function pauseTimer() {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      timerRemaining -= (Date.now() - timerStart);
      if (timerRemaining < 0) timerRemaining = 0;
      idleTimer = null;
    }
  }

  function resumeTimer() {
    if (_engagementShown) return;
    if (idleTimer !== null) return;
    timerStart = Date.now();
    idleTimer = setTimeout(showBannerAndCleanup, timerRemaining);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseTimer();
    else resumeTimer();
  });

  function showBannerAndCleanup() {
    cleanupTriggers();
    _showEngagementBanner();
  }

  // Trigger-Listener aufräumen (Erst-Trigger, nicht der Repeat-Timer)
  function cleanupTriggers() {
    if (idleTimer !== null) { clearTimeout(idleTimer); idleTimer = null; }
    if (mouseLeaveHandler) { document.removeEventListener('mouseleave', mouseLeaveHandler); mouseLeaveHandler = null; }
    if (scrollHandler) { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
  }

  // Trigger 2: Exit Intent (Desktop) – Maus verlässt Fenster nach oben
  mouseLeaveHandler = (e) => {
    if (e.clientY <= 0) showBannerAndCleanup();
  };
  document.addEventListener('mouseleave', mouseLeaveHandler);

  // Trigger 3: Nach 60% Scroll-Tiefe + Zurückscrollen
  let maxScroll = 0;
  scrollHandler = () => {
    if (document.body.scrollHeight <= window.innerHeight) return;
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (pct > maxScroll) maxScroll = pct;
    if (maxScroll >= 60 && pct < maxScroll - 15) {
      showBannerAndCleanup();
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

function closeEngagementBanner() {
  const banner = document.getElementById('engagement-banner');
  if (banner) {
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
    // Focus-Trap entfernen
    if (_engagementState.trapFn) {
      banner.removeEventListener('keydown', _engagementState.trapFn);
      _engagementState.trapFn = null;
    }
    // Fokus auf vorheriges Element zurücksetzen
    if (_engagementState.previousFocusEl && _engagementState.previousFocusEl.focus) {
      _engagementState.previousFocusEl.focus();
      _engagementState.previousFocusEl = null;
    }
  }

  // State zurücksetzen und Banner nach 30 Sekunden erneut zeigen
  _engagementShown = false;
  if (_engagementRepeatTimer) clearTimeout(_engagementRepeatTimer);
  _engagementRepeatTimer = setTimeout(_showEngagementBanner, ENGAGEMENT_REPEAT_DELAY);
}

// Global: Schließen-Button + ESC-Taste
document.addEventListener('click', e => {
  if (e.target.closest('.engagement-banner__close') || e.target.closest('.engagement-banner__overlay')) {
    closeEngagementBanner();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && _engagementShown) closeEngagementBanner();
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


// ══ LEISTUNGS-FINDER WIZARD ══════════════════════════════════
// Schrittweiser Fragebogen zur personalisierten Leistungsberechnung.
// Rein clientseitig – kein Backend erforderlich.

function initLeistungsWizard() {
  // Elemente nur auf der Kostenübernahme-Seite vorhanden
  const wizard = document.querySelector('.wizard');
  if (!wizard) return;

  // ── Pflegekassen-Daten (Stand 2026) ───────────────────
  const DATA = {
    entlastung: { 1: 131, 2: 131, 3: 131, 4: 131, 5: 131 },    // §45b, alle PG – Stand 2026
    pflegegeld:  { 1: 0,   2: 332, 3: 573, 4: 765, 5: 947 },   // ab PG 2
    sachleist:   { 1: 0,   2: 761, 3: 1432, 4: 1778, 5: 2200 },// ab PG 2 (Basis für UW-Berechnung)
    verhinder:   { 1: 0,   2: 3539, 3: 3539, 4: 3539, 5: 3539 } // §39, ab PG 2, Jahresbetrag – ab 2026
  };

  // ── Wizard-State ──────────────────────────────────────
  let selectedPG     = null;
  let selectedPflege = null;
  let uwAktiv        = true;
  let vpAktiv        = true;
  let vpCalcOpen     = false;

  // ── DOM-Referenzen ────────────────────────────────────
  const progressFill  = document.getElementById('wizardProgressFill');
  const progressLabel = document.getElementById('wizardProgressLabel');
  const progressSteps = wizard.querySelectorAll('.wizard__progress-step');

  const stepHasPG   = document.getElementById('wizardStep1');
  const stepNoPG    = document.getElementById('wizardStepNoPG');
  const step2       = document.getElementById('wizardStep2');
  const step3       = document.getElementById('wizardStep3');
  const stepResult  = document.getElementById('wizardResult');

  // ── Hilfsfunktionen ───────────────────────────────────

  function formatEur(amount, period) {
    const num = amount.toLocaleString('de-DE');
    return period === 'monat' ? `${num} €/Monat` : `bis zu ${num} €/Jahr`;
  }

  // Schritt einblenden, anderen ausblenden (mit Animation)
  function showStep(stepEl, progressPct, labelText, activeStepIdx) {
    // Alle Schritte ausblenden
    [stepHasPG, stepNoPG, step2, step3, stepResult].forEach(el => {
      if (el) el.hidden = true;
    });

    // Progressbar aktualisieren
    if (progressFill)  progressFill.style.width = progressPct + '%';
    if (progressLabel) progressLabel.textContent = labelText;
    progressSteps.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeStepIdx);
      dot.classList.toggle('is-done',   i < activeStepIdx);
    });

    // Ziel-Schritt einblenden (kurze Verzögerung damit hidden entfernt wird vor Animation)
    if (stepEl) {
      stepEl.hidden = false;
      // Fokus auf ersten interaktiven Element setzen (Barrierefreiheit)
      setTimeout(() => {
        const first = stepEl.querySelector('button, a, input');
        if (first) first.focus({ preventScroll: true });
      }, 50);
    }
  }

  // ── Ergebnis berechnen und rendern ────────────────────

  function renderResult() {
    const pg     = selectedPG;
    const pflege = selectedPflege;

    const leistungen = document.getElementById('wizardResultLeistungen');
    const gesamt     = document.getElementById('wizardResultGesamt');
    const pgLabel    = document.getElementById('wizardResultPGLabel');
    if (!leistungen || !gesamt || !pgLabel) return;

    pgLabel.textContent = `Pflegegrad ${pg}`;

    // VP-Monatsschätzung (anteilig Jahresrestmonate)
    const heuteMonat  = new Date().getMonth() + 1;
    const restMonate  = 13 - heuteMonat;
    const monatNamen  = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
    const monatName   = monatNamen[heuteMonat - 1];
    const vpMonatlich = Math.round(DATA.verhinder[pg] / restMonate);

    // Flags
    const hatPflegegeld = (pflege === 'angehoerige' || pflege === 'beides') && DATA.pflegegeld[pg] > 0;
    const hatUW         = (pflege === 'pflegedienst' || pflege === 'beides') && DATA.sachleist[pg] > 0;
    const hatVP         = DATA.verhinder[pg] > 0;
    const uwBetrag      = hatUW ? Math.round(DATA.sachleist[pg] * 0.4 * 100) / 100 : 0;

    // Monatliche Gesamtsumme
    let gesamtMonat = DATA.entlastung[pg];
    if (hatPflegegeld)       gesamtMonat += DATA.pflegegeld[pg];
    if (hatUW && uwAktiv)    gesamtMonat += uwBetrag;
    if (hatVP && vpAktiv)    gesamtMonat += vpMonatlich;

    // HTML-Items aufbauen
    let html = '';

    // Entlastungsbetrag
    html += `
      <div class="wizard__result-item wizard__result-item--highlight" role="listitem">
        <p class="wizard__result-item-name">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Entlastungsbetrag §45b SGB XI
        </p>
        <span class="wizard__result-item-betrag">${DATA.entlastung[pg].toLocaleString('de-DE')} €/Monat</span>
      </div>`;

    // Pflegegeld
    if (hatPflegegeld) {
      html += `
      <div class="wizard__result-item wizard__result-item--secondary" role="listitem">
        <p class="wizard__result-item-name">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Pflegegeld
        </p>
        <span class="wizard__result-item-betrag">${DATA.pflegegeld[pg].toLocaleString('de-DE')} €/Monat</span>
      </div>`;
    }

    // UW – Umwidmung §45a (Toggle-Karte)
    if (hatUW) {
      const inactiveClass = uwAktiv ? '' : ' wizard__result-item--inactive';
      const btnLabel      = uwAktiv ? '× deaktivieren' : '+ aktivieren';
      html += `
      <div class="wizard__result-item wizard__result-item--highlight wizard__result-item--toggleable${inactiveClass}" role="listitem">
        <div class="wizard__result-item-main">
          <p class="wizard__result-item-name">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            UW – Umwidmung §45a SGB XI
          </p>
          <p class="wizard__result-item-sub">40 % von ${DATA.sachleist[pg].toLocaleString('de-DE')} € Sachleistungsbudget</p>
          ${uwAktiv ? `<p class="wizard__result-item-warning">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Ihr Pflegegeld wird durch die UW anteilig um bis zu 40 % gekürzt.
          </p>` : ''}
        </div>
        <div class="wizard__result-item-right">
          <span class="wizard__result-item-betrag">${uwBetrag.toLocaleString('de-DE')} €/Monat</span>
          <button class="wizard__toggle-btn${uwAktiv ? '' : ' wizard__toggle-btn--off'}" data-wizard-toggle="uw" type="button" aria-pressed="${uwAktiv}">${btnLabel}</button>
        </div>
      </div>`;
    }

    // VP – Verhinderungspflege §39 (Toggle-Karte)
    if (hatVP) {
      const inactiveClass = vpAktiv ? '' : ' wizard__result-item--inactive';
      const btnLabel      = vpAktiv ? '× ausblenden' : '+ einblenden';
      const monatEnde     = monatNamen[11]; // Dezember
      const calcHtml = vpCalcOpen ? `
        <div class="wizard__vp-calc" role="note" aria-label="Berechnungsdetail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong>${DATA.verhinder[pg].toLocaleString('de-DE')} € Jahresbudget</strong> ÷ ${restMonate} Restmonate (${monatName}–${monatEnde} ${new Date().getFullYear()}) = ca. <strong>${vpMonatlich.toLocaleString('de-DE')} €/Monat</strong></span>
        </div>` : '';
      html += `
      <div class="wizard__result-item wizard__result-item--secondary wizard__result-item--toggleable${inactiveClass}" role="listitem">
        <div class="wizard__result-item-main">
          <div class="wizard__result-item-name-row">
            <p class="wizard__result-item-name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Verhinderungspflege §39 SGB XI
            </p>
            <button class="wizard__calc-btn${vpCalcOpen ? ' is-active' : ''}" data-wizard-toggle="vp-calc" type="button" aria-pressed="${vpCalcOpen}" aria-label="${vpCalcOpen ? 'Berechnung schließen' : 'Berechnung anzeigen'}">
              ${vpCalcOpen
                ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg> Schließen`
                : `Wie berechnet? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`
              }
            </button>
          </div>
          ${calcHtml}
        </div>
        <div class="wizard__result-item-right">
          <span class="wizard__result-item-betrag wizard__result-item-betrag--amber">ca. ${vpMonatlich.toLocaleString('de-DE')} €/Monat</span>
          <button class="wizard__toggle-btn wizard__toggle-btn--teal${vpAktiv ? '' : ' wizard__toggle-btn--off'}" data-wizard-toggle="vp" type="button" aria-pressed="${vpAktiv}">${btnLabel}</button>
        </div>
      </div>`;
    }

    leistungen.innerHTML = html;

    // Gesamt-Box
    const gesamtMonatStr = gesamtMonat.toLocaleString('de-DE');
    let gesamtHtml = `
      <button class="wizard__result-gesamt-restart" data-wizard-action="restart" type="button" aria-label="Neu starten">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4.95L1 10"/></svg>
        Neu starten
      </button>
      <div>
        <p class="wizard__result-gesamt-label">Monatlicher Rahmen</p>
        <p class="wizard__result-gesamt-betrag">${gesamtMonatStr} €/Monat</p>`;
    if (hatVP && vpAktiv) {
      gesamtHtml += `<p class="wizard__result-gesamt-note">VP anteilig (${restMonate} Restmonate) · Jahresdeckel ${DATA.verhinder[pg].toLocaleString('de-DE')} €</p>`;
    }
    gesamtHtml += `</div>`;
    gesamt.innerHTML = gesamtHtml;
  }

  // ── Event-Listener ────────────────────────────────────

  wizard.addEventListener('click', e => {
    const action = e.target.closest('[data-wizard-action]')?.dataset.wizardAction;
    const pg     = e.target.closest('[data-wizard-pg]')?.dataset.wizardPg;
    const pflege = e.target.closest('[data-wizard-pflege]')?.dataset.wizardPflege;
    const toggle = e.target.closest('[data-wizard-toggle]')?.dataset.wizardToggle;

    // Toggle UW / VP / VP-Calc
    if (toggle === 'uw')      { uwAktiv    = !uwAktiv;    renderResult(); return; }
    if (toggle === 'vp')      { vpAktiv    = !vpAktiv;    renderResult(); return; }
    if (toggle === 'vp-calc') { vpCalcOpen = !vpCalcOpen; renderResult(); return; }

    // Schritt 1: Pflegegrad vorhanden?
    if (action === 'pg-yes') {
      showStep(step2, 66, 'Schritt 2 von 3', 1);
    }
    if (action === 'pg-no') {
      showStep(stepNoPG, 33, 'Schritt 1 von 3 – kein Pflegegrad', 0);
    }

    // Schritt 2: Pflegegrad auswählen
    if (pg) {
      selectedPG = parseInt(pg, 10);
      showStep(step3, 100, 'Schritt 3 von 3', 2);
    }

    // Schritt 3: Pflegeart auswählen
    if (pflege) {
      selectedPflege = pflege;
      renderResult();
      // Alle Schritte vollständig markieren
      progressSteps.forEach(dot => dot.classList.add('is-done'));
      showStep(stepResult, 100, 'Ihr Ergebnis', 2);
    }

    // Navigation: zurück
    if (action === 'back-to-1') {
      showStep(stepHasPG, 33, 'Schritt 1 von 3', 0);
    }
    if (action === 'back-to-2') {
      showStep(step2, 66, 'Schritt 2 von 3', 1);
    }
    if (action === 'restart') {
      selectedPG     = null;
      selectedPflege = null;
      uwAktiv        = true;
      vpAktiv        = true;
      showStep(stepHasPG, 33, 'Schritt 1 von 3', 0);
    }
  });
}


// ══ PFLEGEGRADE TAB-STEPPER ══════════════════════════════
// Schaltet zwischen den 5 Pflegegrad-Panels um.
// Unterstützt Maus/Touch sowie Tastatur (Pfeiltasten im tablist).

(function initPflegegradeTabs() {
  const tabsContainer = document.getElementById('pflegegrade-tabs');
  if (!tabsContainer) return;

  const tabs   = Array.from(tabsContainer.querySelectorAll('.pg-tabs__tab'));
  const panels = Array.from(tabsContainer.querySelectorAll('.pg-tabs__panel'));

  if (!tabs.length || !panels.length) return;

  function activateTab(targetTab) {
    // Alle deaktivieren
    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => {
      p.classList.remove('is-active');
      p.hidden = true;
    });

    // Ziel-Tab aktivieren
    targetTab.classList.add('is-active');
    targetTab.setAttribute('aria-selected', 'true');
    targetTab.removeAttribute('tabindex');

    // Zugehöriges Panel einblenden: hidden zuerst entfernen, dann Klasse für Animation setzen
    const panelId = targetTab.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.hidden = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => panel.classList.add('is-active'));
      });
    }
  }

  // Klick-Handler
  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  // Tastatur-Navigation (Pfeiltasten im tablist gemäß ARIA-Pattern)
  tabsContainer.addEventListener('keydown', e => {
    const currentTab = document.activeElement;
    if (!currentTab || !currentTab.classList.contains('pg-tabs__tab')) return;

    const currentIndex = tabs.indexOf(currentTab);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
})();

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
(function () {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============================================================
// PLZ-CHECKER (standorte.html)
// ============================================================
function initPlzChecker() {
  const input    = document.getElementById('plzInput');
  const feedback = document.getElementById('plz-feedback');
  if (!input || !feedback) return;

  const PLZ_DATA = {
    // Landkreis Erding
    '85435': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85445': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85452': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85456': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85457': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85461': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85462': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85463': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85464': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    '85465': { name: 'Landkreis Erding',    coords: [48.3059, 12.0714] },
    // Landkreis Ebersberg
    '85560': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85567': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85570': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85579': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85586': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85591': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85598': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85599': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85604': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85614': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85622': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85625': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85630': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85635': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    '85640': { name: 'Landkreis Ebersberg', coords: [48.0774, 11.9664] },
    // Landkreis Freising
    '85354': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    '85356': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    '85368': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    '85375': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    '85386': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    '85391': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    '85395': { name: 'Landkreis Freising',  coords: [48.3975, 11.7251] },
    // Landkreis Moosburg
    '85405': { name: 'Landkreis Moosburg',  coords: [48.4655, 11.9338] },
    '85416': { name: 'Landkreis Moosburg',  coords: [48.4655, 11.9338] },
    '85417': { name: 'Landkreis Moosburg',  coords: [48.4655, 11.9338] },
    // Landkreis Landshut
    '84028': { name: 'Landkreis Landshut',  coords: [48.5369, 12.1545] },
    '84030': { name: 'Landkreis Landshut',  coords: [48.5369, 12.1545] },
    '84032': { name: 'Landkreis Landshut',  coords: [48.5369, 12.1545] },
    '84034': { name: 'Landkreis Landshut',  coords: [48.5369, 12.1545] },
    '84036': { name: 'Landkreis Landshut',  coords: [48.5369, 12.1545] },
    // Einzelorte
    '85737': { name: 'Ismaning',            coords: [48.2286, 11.6826] },
    '85748': { name: 'Garching',            coords: [48.2489, 11.6529] },
    '85774': { name: 'Unterföhring',        coords: [48.1855, 11.7218] }
  };

  function checkPlz(val) {
    feedback.className = 'plz-checker__feedback';
    if (val.length < 5) {
      feedback.innerHTML = '';
      return;
    }
    const entry = PLZ_DATA[val];
    if (entry) {
      feedback.classList.add('plz-checker__feedback--match');
      feedback.innerHTML =
        '<div class="plz-checker__result plz-checker__result--match">' +
          '<span class="plz-checker__result-icon" aria-hidden="true">\u2713</span>' +
          '<div class="plz-checker__result-content">' +
            '<strong>Ja! Wir sind in Ihrer Region t\u00e4tig.</strong>' +
            '<span class="plz-checker__region-name">' + entry.name + '</span>' +
            '<a href="kontakt.html" class="btn btn-primary btn-sm">Jetzt kostenlos beraten lassen</a>' +
          '</div>' +
        '</div>';
      if (window.vitalisMap) {
        var mapEl = document.getElementById('map');
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function() { window.vitalisMap.flyTo(entry.coords, 12); }, 400);
        }
      }
    } else {
      feedback.classList.add('plz-checker__feedback--no-match');
      feedback.innerHTML =
        '<div class="plz-checker__result plz-checker__result--no-match">' +
          '<span class="plz-checker__result-icon" aria-hidden="true">\u25cb</span>' +
          '<div class="plz-checker__result-content">' +
            '<strong>Diese PLZ liegt noch nicht in unserem Einzugsgebiet.</strong>' +
            '<span>Sprechen Sie uns an \u2013 unser Gebiet w\u00e4chst stetig.</span>' +
            '<a href="tel:+4989XXXXXXXX" class="btn btn-phone btn-sm">Jetzt anrufen</a>' +
          '</div>' +
        '</div>';
    }
  }

  input.addEventListener('input', function() {
    input.value = input.value.replace(/\D/g, '').slice(0, 5);
    checkPlz(input.value);
  });
}

// ============================================================
// KONTAKT-VORAUSWAHL (kontakt.html)
// ============================================================
function initKontaktVorauswahl() {
  var container = document.getElementById('kontakt-vorauswahl');
  if (!container) return;

  var buttons  = container.querySelectorAll('[data-prefill]');
  var textarea = document.getElementById('message');
  var subject  = document.getElementById('form-subject');

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var wasActive = btn.classList.contains('is-active');

      // Deactivate all
      buttons.forEach(function(b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });

      if (!wasActive) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        if (textarea) {
          textarea.value = btn.dataset.prefill;
          textarea.dispatchEvent(new Event('input'));
        }
        if (subject) {
          subject.value = btn.dataset.subject;
        }

        if (textarea) {
          var offset = 100;
          var top = textarea.getBoundingClientRect().top + window.scrollY - offset;
          setTimeout(function() {
            window.scrollTo({ top: top, behavior: 'smooth' });
            setTimeout(function() { textarea.focus(); }, 350);
          }, 50);
        }
      } else {
        // Deactivate: clear fields
        if (textarea) textarea.value = '';
        if (subject) subject.value = 'Kontaktanfrage \u2013 Vitalis Seniorendienst';
      }
    });
  });
}

// ============================================================
// FÜR-WEN MINI-CHECK (index.html)
// ============================================================
function initFuerWenCheck() {
  var container = document.getElementById('fuer-wen');
  if (!container) return;

  var buttons = container.querySelectorAll('.fuer-wen__btn[data-target]');

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.dataset.target;
      var panel    = document.getElementById(targetId);
      var isOpen   = btn.getAttribute('aria-expanded') === 'true';

      // Close all (FAQ-accordion pattern)
      buttons.forEach(function(b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-expanded', 'false');
      });
      container.querySelectorAll('.fuer-wen__panel').forEach(function(p) {
        p.classList.remove('is-open');
        p.style.maxHeight = null;
        p.setAttribute('aria-hidden', 'true');
      });

      // Open target if it was closed
      if (!isOpen && panel) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// ─── Schritt-2 "Mehr erfahren" Toggle ───────────────────────
(function () {
  var btn = document.querySelector('.step__mehr-btn');
  if (!btn) return;
  var panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (!panel) return;

  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      btn.querySelector('.step__mehr-btn-label') && (btn.querySelector('.step__mehr-btn-label').textContent = 'Mehr erfahren');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}());
