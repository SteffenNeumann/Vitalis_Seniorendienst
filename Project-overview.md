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
- **Fonts**: Google Fonts (Inter für Body, Playfair Display für Headings)
- **Icons**: Lucide Icons (SVG, eingebettet)

## Farbpalette (Markenfarben)
| Farbe | Hex | Verwendung |
|-------|-----|-----------|
| Primary Blue | `#3b6cb7` | Buttons, Links, Hauptakzent |
| Primary Dark | `#2a518f` | Hover-States, Gradient-Endpunkt |
| Primary Light | `#e8eef8` | Helle Hintergründe, Akzent-BG |
| Secondary Teal | `#4a9d8f` | Sekundärakzent, Badges |
| Accent Amber | `#f4a261` | Highlights, Sterne, Kontrastakzent |
| Text Dark | `#1e2d45` | Primärtext |
| Text Muted | `#5a6a80` | Sekundärtext |
| BG Light | `#f0f4fb` | Helles Blau-Grau für Sektionen |
| BG Cream | `#f5f1eb` | Warmes Creme |
| BG Warm | `#faf8f5` | Warmes Off-White |
| Border | `#d0dae8` | Rahmen, Trennlinien |
| White | `#ffffff` | Karten, Formulare |
| Success | `#2e7d5e` | Erfolgsmeldungen |

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
│   ├── main.js           # Navigation, Scroll-Effekte, allg. Interaktivität
│   └── animations.js     # Intersection Observer, Einblend-Animationen
├── assets/
│   ├── images/           # Hero-Bilder, Team-Fotos (Platzhalter)
│   ├── icons/            # SVG-Icons
│   └── fonts/            # Lokale Fonts (optional)
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
- PLZ-Liste für Einzugsgebiet (Karte Standorte-Seite)
- Pflegekassen-Leistungstabelle (Kostenübernahme-Seite)
- Team-Fotos & Mitarbeiterdaten
- Echte Kundenzitate / Testimonials
- Zertifikate & Auszeichnungen
- Partner-Logos (AOK, DAK, Pflegenetzwerk Erding)

## Externe Abhängigkeiten
- Google Fonts (Inter, Playfair Display)
- Leaflet.js (OpenStreetMap für Standorte-Karte)
- Formspree oder ähnlich für Kontaktformular (Platzhalter)

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
- PLZ-Liste für Standorte-Karte (standorte.html)
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
- [ ] mapyx.io-Karten-PNG (Kunde exportiert, INT-217)
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
- **Karte:** `orte`-Marker auf die 7 Regionen angeglichen. ⏳ Offen: „Neue Karte → Mapyx". mapyx.io
  bietet **kein Embed/iframe/API**, nur PNG-Export → Kunde exportiert Karte mit allen 88 PLZ als PNG,
  Einbau als `images/einzugsgebiet-mapyx.png` (Anleitung als Kommentar im Karten-Block hinterlegt);
  bis dahin bleibt die Leaflet/OSM-Karte als funktionierender Platzhalter.
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

> **Hinweis Doku-Pflege:** Abschnitte „Technologie-Stack" und „Farbpalette" oben sind teils veraltet
> (Fonts real: Fraunces + Source Sans 3, self-hosted/DSGVO; gedecktere Palette) – separate Aufräumaufgabe.

---
*Erstellt: 2026-03-11 | Letzte Änderung: 2026-07-19 | Status: In Umsetzung (Kunden-Feedback-Runde)*
