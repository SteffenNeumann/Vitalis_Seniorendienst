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
| Primary Blue | `#2f5dff` | Buttons, Links, Akzente |
| Deep Blue | `#0f2ccf` | Hover-States, Header-Gradient |
| Sage Green | `#4b916d` | Erfolg, Vertrauen, sekundäre Akzente |
| Off-White | `#f1f0ef` | Sektionshintergründe |
| Near Black | `#151414` | Primärtext |
| Dark Gray | `#383838` | Sekundärtext |
| White | `#ffffff` | Karten, Formulare |
| Amber | `#f9ad4d` | Highlights, Sterne (Testimonials) |

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
- [ ] PLZ-Liste für Einzugsgebiet
- [ ] Pflegekassen-Leistungsbeträge (aktuell 2024/2025)
- [ ] Echte Testimonials / Kundenzitate

---
*Erstellt: 2026-03-11 | Status: In Planung*
