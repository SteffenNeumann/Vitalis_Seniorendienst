# Project Overview – Vitalis Seniorendienst Website

## Projektbeschreibung
Vollständige, responsive Unternehmenswebsite für die **Vitalis Seniorendienst GmbH** – Anbieter von Alltagsbegleitung, Haushaltshilfe und sozialer Betreuung für Senioren im Raum München/Erding.

## Zielgruppe
- **Primär**: Senioren (65+) mit Pflegegrad oder Betreuungsbedarf
- **Sekundär**: Angehörige, die Unterstützung für ihre Familie suchen
- **Accessibility-Fokus**: Große Schrift, hohe Kontraste, klare Navigation, touch-freundlich

## Technologie-Stack
- **HTML5** – semantisch korrekt, ARIA-konform
- **CSS3** – Custom Properties, Flexbox, CSS Grid, keine Framework-Abhängigkeit
- **Vanilla JavaScript** – Progressive Enhancement, keine Build-Tools nötig
- **Fonts**: **self-hosted** (woff2 in `assets/fonts/`, DSGVO-konform, kein Google-Fonts-Call) –
  **Fraunces** für Headings (`--font-heading`), **Source Sans 3** für Body (`--font-body`).
  Preload: `source-sans-3-latin.woff2` auf allen Seiten. (Früher: Google Fonts Inter/Playfair – 2026-07 getauscht.)
- **Icons**: Inline-SVG (Feather/Lucide-Stil), direkt im Markup eingebettet
- **Karte**: Leaflet.js + OpenStreetMap-Tiles; Landkreis-Flächen als inline-GeoJSON (`js/regionen-geo.js`)

## Farbpalette (real implementiert, `css/main.css` :root)
> Gedeckte Palette (blau/teal/greige). Die früher hier stehenden knalligeren Werte waren veraltet.

| Token | Hex | Verwendung |
|-------|-----|-----------|
| `--blue` | `#5079A5` | Primärfarbe: Buttons, Links, Akzente, Karten-Highlight |
| `--blue-dark` | `#3D6089` | Hover, Gradient-Endpunkt, Highlight-Rand |
| `--blue-soft` | `#EEF4FA` | Helle Akzent-Hintergründe (z. B. `.region-cta`) |
| `--blue-ghost` | `rgba(80,121,165,.08)` | Icon-Kreis-Füllungen |
| `--teal` / `--teal-dark` | `#327878` / `#2E6B6B` | Sekundärakzent, Badges |
| `--amber` / `--amber-dark` | `#C97B3A` / `#A85E1F` | Highlights, Sterne, Kontrast |
| `--ink` | `#1C2B3A` | Primärtext |
| `--ink-muted` | `#556070` | Sekundärtext |
| `--ink-light` | `#7A8A9A` | Tertiärtext, Bildunterschriften |
| `--ink-border` | `#CDD8E8` | Rahmen, Trennlinien |
| `--ink-bg` | `#F4F7FB` | Helles Blau-Grau für Sektionen |
| `--ink-warm` | `#F6F2EC` | Warmes Creme |
| `--white` | `#ffffff` | Karten, Formulare |
| `--color-danger` | `#d4534a` | Fehlermeldungen |

**Hinweis Hero:** Das Hero-Overlay auf index.html ist bewusst warm-creme (Espresso/Greige-Gradient in
`css/components.css`), nicht blau – auf Kundenwunsch (Blau wirkte zu kalt).

## Seiten-Struktur
| Datei | Seite | Status |
|-------|-------|--------|
| `index.html` | Startseite | ✅ Fertig |
| `ueber-uns.html` | Über uns | ✅ Fertig |
| `leistungen.html` | Leistungen | ✅ Fertig |
| `kostenuebernahme.html` | Kostenübernahme | ✅ Fertig |
| `faq.html` | FAQ | ✅ Fertig |
| `kontakt.html` | Kontakt | ✅ Fertig |
| `standorte.html` | Standorte | ✅ Fertig |
| `datenschutz.html` | Datenschutz | ✅ Fertig |
| `impressum.html` | Impressum | ✅ Fertig |
| `karriere.html` | Karriere | ✅ Fertig |

## Dateistruktur
```
/Vitalis_Seniorendienst/
├── index.html
├── ueber-uns.html
├── leistungen.html
├── kostenuebernahme.html
├── faq.html
├── kontakt.html
├── standorte.html
├── datenschutz.html
├── impressum.html
├── karriere.html
├── css/
│   ├── main.css          # Variablen, Reset, Typografie, Layout-Basis
│   ├── components.css    # Wiederverwendbare Komponenten (Buttons, Karten, Nav)
│   └── responsive.css    # Media Queries (Mobile-first)
├── js/
│   ├── main.js           # Navigation, Scroll, Suche, PLZ-Checker, Karten-Highlight-Aufruf
│   ├── animations.js     # Intersection Observer, Einblend-Animationen
│   └── regionen-geo.js   # Landkreis-Flächen (GeoJSON inline) für die Standorte-Karte (INT-217)
├── images/               # Hero-Bilder, Logo (avif), Badges
├── assets/
│   └── fonts/            # Self-hosted woff2 (Fraunces, Source Sans 3) – DSGVO
├── doc/                  # Quelldaten (PLZ-.numbers, Abo-Kosten) – nicht Teil des Deploys
└── Project-overview.md
```

## Design-Prinzipien (Senior-freundlich)
1. **Mindestschriftgröße**: 16px Body, 18px+ für wichtige Inhalte
2. **Kontrastverhältnis**: WCAG AA (4.5:1 für Text, 3:1 für UI-Elemente)
3. **Touch-Targets**: Mindestens 48x48px für alle interaktiven Elemente
4. **Einfache Navigation**: Maximal 2 Klicks zum Ziel
5. **Klare Hierarchie**: Keine überladenen Layouts, viel Weißraum
6. **Große CTAs**: Prominent platzierte Rückruf-Buttons
7. **Telefonnummer immer sichtbar**: Sticky in der Navigation

## SEO-Fokus-Keywords
- Alltagsbegleitung München / Erding
- Haushaltshilfe Senioren (mehrfach einbauen laut Briefing)
- Pflegegrad §45a SGB XI
- Seniorenbetreuung Landkreis Erding / Ebersberg / Freising

## Inhaltliche Platzhalter (auf Anfrage zu befüllen)
- ~~PLZ-Liste für Einzugsgebiet~~ ✅ geliefert & eingebaut (88 PLZ, INT-217)
- Pflegekassen-Leistungstabelle (Kostenübernahme-Seite)
- Team-Fotos & Mitarbeiterdaten
- Echte Kundenzitate / Testimonials
- Zertifikate & Auszeichnungen
- Partner-Logos (AOK, DAK, Pflegenetzwerk Erding)

## Externe Abhängigkeiten
- **Keine Google Fonts** mehr – Fonts self-hosted (DSGVO, `assets/fonts/`)
- **Leaflet.js 1.9.4** (unpkg CDN) + OpenStreetMap-Tiles für die Standorte-Karte
- **Landkreis-Grenzen**: einmalig zur Build-Zeit aus `georef-germany-kreis` (opendatasoft) geholt und
  per **mapshaper** zu 5 Highlight-Flächen verschmolzen/vereinfacht → als `js/regionen-geo.js` inline
  eingebettet (zur Laufzeit **kein** externer Call, kein fetch/CORS)
- **openPLZ-API** (openplzapi.org): einmalig für die PLZ→Landkreis-Zuordnung genutzt (nicht zur Laufzeit)
- Formspree oder ähnlich für Kontaktformular (Platzhalter, Backend noch offen)

## Implementierungs-Phasen
1. **Phase 1**: CSS Design-System + Komponenten (main.css, components.css) ✅
2. **Phase 2**: Startseite (index.html) + Navigation + Footer ✅
3. **Phase 3**: Leistungen, Über uns, FAQ ✅
4. **Phase 4**: Kostenübernahme, Kontakt, Standorte ✅
5. **Phase 5**: Datenschutz, Impressum, Karriere ✅
6. **Phase 6**: Echtdaten einfügen (Tel, Adresse, PLZ, Testimonials) ⬜

## Noch zu befüllen (wenn Daten vorliegen)
- Telefonnummer (überall `+4989XXXXXXXX` ersetzen)
- Echte Adresse (überall `Musterstraße 1, 85435 Erding` prüfen)
- ~~PLZ-Liste für Standorte-Karte~~ ✅ eingebaut (standorte.html, 88 PLZ + interaktive Karte)
- Pflegekassen-Leistungsbeträge aktuell prüfen (kostenuebernahme.html)
- Echte Testimonials (index.html, ueber-uns.html)
- Team-Fotos und Namen (ueber-uns.html)
- Logo-Datei (SVG Platzhalter überall eingebaut)
- Formspree-ID für Kontaktformular (kontakt.html, `data-action="..."`)
- Impressum: Geschäftsführer, HRB-Nummer, USt-ID

## Offene Fragen
- [ ] Logo-Datei vorhanden?
- [ ] Team-Fotos vorhanden?
- [ ] Kontaktformular-Backend (Formspree / eigenes)?
- [x] PLZ-Liste für Einzugsgebiet – geliefert (88 PLZ, INT-217) & im PLZ-Checker integriert
- [x] Karte (INT-217) – interaktive Landkreis-Hervorhebung bei PLZ-Eingabe (mapyx verworfen, da kein Embed)
- [ ] Pflegekassen-Leistungsbeträge (aktuell 2024/2025)
- [ ] Echte Testimonials / Kundenzitate

## Changelog

### 2026-07-19 – INT-217: Standorte-Seite Umbau (Regionen, PLZ-Checker, CTA, Karte)
Branch `steffen/int-215-kostentabelle-leistungen-10k`

- **Regionen:** Intro-Text emotionalisiert („In diesen Regionen sind wir für Sie da – zuverlässig,
  persönlich und mit viel Herz im Alltag."). Kachel-Liste neu = **7 Regionen** (Erding, Ebersberg,
  Freising, Moosburg, Landshut, **München Nord**, **Dorfen und Umgebung**) **ohne Untertexte**.
  Alte Einzelorte Ismaning/Garching/Unterföhring → in „München Nord" aufgegangen.
  Inline-Style-Wildwuchs in saubere BEM-Komponente `.region-grid` / `.region-card` überführt (components.css).
- **Vitalis-West-Kachel:** letzte Kachel `.region-card--branch` (blaue Gradient-Akzentkachel) verlinkt
  extern auf `https://www.vitalis-west.de/` (`target="_blank" rel="noopener"` + „öffnet in neuem Tab").
- **CTA „Ihr Ort ist nicht dabei?":** schwache gestrichelte Box → solide, präsente Akzent-Karte
  `.region-cta` (Gradient-Topbar, Icon, großer Button).
- **PLZ-Checker:** mit allen **88 echten Kunden-PLZ** aus `doc/PLZ suchen_Vitalis Gebiet _2026-05-04_all.numbers`
  befüllt (`PLZ_DATA` in js/main.js). Landkreis-Zuordnung via openPLZ-API, auf die 7 Regionen gemappt
  (Ebersberg 21, München Nord 19, Freising 17, Erding 16, Landshut 10, Dorfen 4, Moosburg 1).
- **Interaktive Karte (statt mapyx):** mapyx.io bietet kein Embed/API (nur PNG) und kann nicht auf die
  Suche reagieren → stattdessen **interaktive Landkreis-Hervorhebung** umgesetzt: Gibt der Besucher seine
  PLZ ein, wird der zugehörige Landkreis auf der Leaflet-Karte umrandet, eingefärbt und angezoomt.
  Landkreis-Flächen aus `georef-germany-kreis` (opendatasoft), via mapshaper zu **5 Highlight-Flächen**
  verschmolzen/vereinfacht (Erding, Ebersberg, Freising, Landshut=Stadt+LK, München=Stadt+LK) und als
  `js/regionen-geo.js` (~8 KB, inline, kein fetch/CORS) eingebunden. Dorfen→Lkr. Erding, Moosburg→Lkr.
  Freising (korrekte Kreis-Zuordnung). Verifiziert für alle 5 Highlight-Fälle + No-Match-Reset.
- Verifiziert per Playwright (Desktop 1280 + Mobile 390): 8 Kacheln, Branch-Link, CTA und
  PLZ-Checker-Rückmeldungen (inkl. Edge-Cases) korrekt.

### 2026-07-19 – Kostenübernahme-Feinschliff, Footer- & Mobile-Fixes
Branch `steffen/int-215-kostentabelle-leistungen-10k`

- **INT-215 (Kostenübernahme-Tabelle):**
  - Hausnotruf-Zeile: echter Partner-Link zum kostenfreien Lifeo-Formular gesetzt
    (`https://anfrage.lifeo.de/`, öffnet in neuem Tab) statt Platzhalter auf `kontakt.html`.
  - Pflegehilfsmittel zum Verbrauch: Betrag **40 €/Monat** final bestätigt (gesetzl. Stand §40 SGB XI),
    TODO-Kommentar entfernt.
  - ⏳ Offen: Link zum internen „Alle Leistungen der Pflegekasse"-Formular (kommt vom Kunden);
    veraltete 2026-Beträge (Pflegegeld/Sachleistungen) noch nicht korrigiert (wartet auf Freigabe).
- **INT-158 (Footer Spaltenbreite):** Zeilenumbrüche in den Footer-Kategorien behoben –
  `word-break: break-all` → `overflow-wrap: anywhere` (E-Mail/Telefon brechen nicht mehr mitten im Wort);
  4-Spalten-Grid greift jetzt erst ab **1280px** statt 1024px (dazwischen roomy 2-spaltig).
  Verifiziert per Playwright bei 1024/1200px.
- **INT-152 (Mobile Design):** horizontales Scrollen auf Mobile beseitigt
  (`.nav__search-wrap { overflow:hidden }` im geschlossenen Zustand, `.hero__stat-label` bricht um),
  Touch-Targets auf **44px** angehoben (Tel/E-Mail-Links, Nav-Such-Buttons, Breadcrumb, Tabellen-Inline-Links),
  Buttons dürfen auf ≤767px umbrechen. Alle Regeln auf `≤767px` begrenzt → kein Desktop-Regress.
  Verifiziert per Playwright @375px: index/kostenuebernahme/standorte ohne horizontalen Scroll.
- **INT-159 (Darkmode):** storniert – für die Senioren-Zielgruppe kein Mehrwert bei hohem Pflegeaufwand.

> **Doku-Pflege erledigt (2026-07-19):** „Technologie-Stack", „Farbpalette", „Dateistruktur" und
> „Externe Abhängigkeiten" auf den realen Stand gebracht (self-hosted Fonts, gedeckte Palette,
> `regionen-geo.js`, Leaflet/opendatasoft/mapshaper).

---
*Erstellt: 2026-03-11 | Letzte Änderung: 2026-07-19 (INT-217 komplett + Doku-Sync) | Status: In Umsetzung (Kunden-Feedback-Runde)*
