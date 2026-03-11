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

});

// ── Engagement Banner ─────────────────────────────────────
// Gemeinsamer State für Focus-Trap (benötigt von init + close)
const _engagementState = { trapFn: null, previousFocusEl: null };

function initEngagementBanner() {
  const currentPage = window.location.pathname.split('/').pop();

  // Fix 3: Auf diesen Seiten kein Banner anzeigen
  const excludedPages = ['kontakt.html', 'datenschutz.html', 'impressum.html', 'karriere.html'];
  if (excludedPages.includes(currentPage)) return;
  if (sessionStorage.getItem('engagementShown')) return;

  const banner = document.getElementById('engagement-banner');
  if (!banner) return;

  let shown = false;

  // Fix 2: Referenzen für späteres Aufräumen
  let scrollHandler = null;
  let mouseLeaveHandler = null;

  // Fix 4: Page Visibility – Timer nur bei aktivem Tab laufen lassen
  let timerRemaining = 35000;
  let timerStart = Date.now();
  let idleTimer = setTimeout(showBanner, timerRemaining);

  function pauseTimer() {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      timerRemaining -= (Date.now() - timerStart);
      if (timerRemaining < 0) timerRemaining = 0;
      idleTimer = null;
    }
  }

  function resumeTimer() {
    if (shown) return;
    if (idleTimer !== null) return; // läuft bereits
    timerStart = Date.now();
    idleTimer = setTimeout(showBanner, timerRemaining);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseTimer();
    else resumeTimer();
  });

  function showBanner() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem('engagementShown', '1');
    banner.classList.add('is-visible');
    banner.setAttribute('aria-hidden', 'false');

    // Fix 2: Nicht mehr benötigte Listener entfernen
    cleanupTriggers();

    // Fix 1: Fokus merken und auf Close-Button setzen
    _engagementState.previousFocusEl = document.activeElement;
    setTimeout(() => banner.querySelector('.engagement-banner__close')?.focus(), 300);

    // Fix 1: Focus-Trap aktivieren
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

  // Fix 2: Trigger-Listener aufräumen nach Anzeige
  function cleanupTriggers() {
    if (idleTimer !== null) { clearTimeout(idleTimer); idleTimer = null; }
    if (mouseLeaveHandler) { document.removeEventListener('mouseleave', mouseLeaveHandler); mouseLeaveHandler = null; }
    if (scrollHandler) { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
  }

  // Trigger 2: Exit Intent (Desktop) – Maus verlässt Fenster nach oben
  mouseLeaveHandler = (e) => {
    if (e.clientY <= 0) showBanner();
  };
  document.addEventListener('mouseleave', mouseLeaveHandler);

  // Trigger 3: Nach 60% Scroll-Tiefe + Zurückscrollen
  let maxScroll = 0;
  scrollHandler = () => {
    // Fix 5: Division-durch-Null absichern
    if (document.body.scrollHeight <= window.innerHeight) return;

    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (pct > maxScroll) maxScroll = pct;
    // Wenn User >= 60% gescrolt hat und wieder nach oben scrollt
    if (maxScroll >= 60 && pct < maxScroll - 15) {
      cleanupTriggers();
      showBanner();
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

function closeEngagementBanner() {
  const banner = document.getElementById('engagement-banner');
  if (banner) {
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
    // Fix 1: Focus-Trap entfernen
    if (_engagementState.trapFn) {
      banner.removeEventListener('keydown', _engagementState.trapFn);
      _engagementState.trapFn = null;
    }
    // Fix 1: Fokus auf vorheriges Element zurücksetzen
    if (_engagementState.previousFocusEl && _engagementState.previousFocusEl.focus) {
      _engagementState.previousFocusEl.focus();
      _engagementState.previousFocusEl = null;
    }
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


// ══ LEISTUNGS-FINDER WIZARD ══════════════════════════════════
// Schrittweiser Fragebogen zur personalisierten Leistungsberechnung.
// Rein clientseitig – kein Backend erforderlich.

function initLeistungsWizard() {
  // Elemente nur auf der Kostenübernahme-Seite vorhanden
  const wizard = document.querySelector('.wizard');
  if (!wizard) return;

  // ── Pflegekassen-Daten (Stand 2024/2025) ──────────────
  const DATA = {
    entlastung: { 1: 125, 2: 125, 3: 125, 4: 125, 5: 125 },   // §45b, alle PG
    pflegegeld:  { 1: 0,   2: 332, 3: 573, 4: 765, 5: 947 },   // ab PG 2
    sachleist:   { 1: 0,   2: 761, 3: 1432, 4: 1778, 5: 2200 },// ab PG 2
    verhinder:   { 1: 0,   2: 1612, 3: 1612, 4: 1612, 5: 1612 },// ab PG 2, Jahresbetrag
    kurzzeit:    { 1: 0,   2: 1774, 3: 1774, 4: 1774, 5: 1774 } // ab PG 2, Jahresbetrag
  };

  // ── Wizard-State ──────────────────────────────────────
  let selectedPG    = null;
  let selectedPflege = null;

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
    const pg    = selectedPG;
    const pflege = selectedPflege;

    // Leistungs-Items aufbauen
    const leistungen = document.getElementById('wizardResultLeistungen');
    const gesamt     = document.getElementById('wizardResultGesamt');
    const pgLabel    = document.getElementById('wizardResultPGLabel');
    if (!leistungen || !gesamt || !pgLabel) return;

    pgLabel.textContent = `Pflegegrad ${pg}`;
    leistungen.innerHTML = '';

    let gesamtMonat = 0;
    let gesamtJahr  = 0;
    const items = [];

    // Entlastungsbetrag – immer bei allen PG
    items.push({
      name: 'Entlastungsbetrag §45b SGB XI',
      betrag: DATA.entlastung[pg],
      period: 'monat',
      type: 'highlight',
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
    });
    gesamtMonat += DATA.entlastung[pg];

    // Pflegegeld – wenn Angehörige oder Beides, ab PG 2
    if ((pflege === 'angehoerige' || pflege === 'beides') && DATA.pflegegeld[pg] > 0) {
      items.push({
        name: 'Pflegegeld',
        betrag: DATA.pflegegeld[pg],
        period: 'monat',
        type: 'secondary',
        icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>'
      });
      gesamtMonat += DATA.pflegegeld[pg];
    }

    // Sachleistungen – wenn Pflegedienst oder Beides, ab PG 2
    if ((pflege === 'pflegedienst' || pflege === 'beides') && DATA.sachleist[pg] > 0) {
      items.push({
        name: 'Pflegesachleistungen',
        betrag: DATA.sachleist[pg],
        period: 'monat',
        type: 'highlight',
        icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'
      });
      gesamtMonat += DATA.sachleist[pg];
    }

    // Verhinderungspflege – ab PG 2
    if (DATA.verhinder[pg] > 0) {
      items.push({
        name: 'Verhinderungspflege',
        betrag: DATA.verhinder[pg],
        period: 'jahr',
        type: 'secondary',
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
      });
      gesamtJahr += DATA.verhinder[pg];
    }

    // Kurzzeitpflege – ab PG 2
    if (DATA.kurzzeit[pg] > 0) {
      items.push({
        name: 'Kurzzeitpflege',
        betrag: DATA.kurzzeit[pg],
        period: 'jahr',
        type: 'amber',
        icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
      });
      gesamtJahr += DATA.kurzzeit[pg];
    }

    // HTML für Leistungs-Items bauen
    leistungen.innerHTML = items.map(item => {
      const modClass = item.type === 'highlight' ? 'wizard__result-item--highlight'
                     : item.type === 'secondary'  ? 'wizard__result-item--secondary'
                     : '';
      const betragClass = item.type === 'amber' ? 'wizard__result-item-betrag wizard__result-item-betrag--amber'
                        : 'wizard__result-item-betrag';
      return `
        <div class="wizard__result-item ${modClass}" role="listitem">
          <p class="wizard__result-item-name">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${item.icon}</svg>
            ${item.name}
          </p>
          <span class="${betragClass}">${formatEur(item.betrag, item.period)}</span>
        </div>`;
    }).join('');

    // Gesamt-Box aufbauen
    const gesamtMonatStr = gesamtMonat.toLocaleString('de-DE');
    const gesamtJahrStr  = (gesamtMonat * 12 + gesamtJahr).toLocaleString('de-DE');
    gesamt.innerHTML = `
      <div>
        <p class="wizard__result-gesamt-label">Monatlicher Rahmen</p>
        <p class="wizard__result-gesamt-betrag">${gesamtMonatStr} €/Monat</p>
        <p class="wizard__result-gesamt-note">+ bis zu ${(gesamtJahr).toLocaleString('de-DE')} €/Jahr für Vertretungs- und Kurzzeitpflege</p>
      </div>`;
  }

  // ── Event-Listener ────────────────────────────────────

  wizard.addEventListener('click', e => {
    const action = e.target.closest('[data-wizard-action]')?.dataset.wizardAction;
    const pg     = e.target.closest('[data-wizard-pg]')?.dataset.wizardPg;
    const pflege = e.target.closest('[data-wizard-pflege]')?.dataset.wizardPflege;

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
      selectedPG = null;
      selectedPflege = null;
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
