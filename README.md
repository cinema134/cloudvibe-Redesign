# cloudvibe Website: Übergabe fürs Coding

Stand 24.11.2026. Dieser Ordner enthält das fertige Design der neuen Website von cloudvibe (IT-Dienstleister aus Goch) als klickbare HTML-Seiten plus Sitemap und die modularen Quellen. Er ist die Vorlage für die Umsetzung. Alles hier ist **Design und Ablauf**, es gibt **kein Backend**: Formulare senden nichts ab, Login und Downloads sind Attrappen.

**Zielsystem:** Laut Projektplanung wird die Website in **Odoo** (Website-Modul) umgesetzt. Formulare und Funktionen sollen später an Odoo-Apps hängen (siehe „Funktionen und Anbindung“). Wer anders umsetzt, nimmt die HTML-Seiten als verbindliche Vorlage für Aussehen, Texte und Verhalten.

## Ordner

| Pfad | Inhalt |
|---|---|
| `index.html` | Übersicht mit Links auf beide Fassungen, Sitemap und Wellen-Varianten (Startseite für GitHub Pages). |
| `einstellungen.js` | Für alle festgelegte Auswahl (Optionen, Module, Texte), erzeugt im Panel mit „Für alle festlegen“. Wird von allen Seiten geladen. Siehe `OPTIONEN.md` → Speichern. |
| `sitemap.html` | **Hier anfangen.** Seitenbaum zum Anklicken; je Seite Adresse, H1, Aufbau von oben nach unten, Buttons, Zusatzmodule, offene Punkte, Link zur Seite. |
| `OPTIONEN.md` | **Noch nicht final entschiedene Optionen** (Welle, Footer, Begriff, Aufzählung, Module …) mit Werten, Standard und Code-Stelle. **Diese müssen umschaltbar umgesetzt werden.** |
| `seiten/*.html` | Jede Seite als eigenständige HTML-Datei im **Standard** (CSS, JS, Schriften und Bilder eingebettet, daher groß). Im Browser öffnen, Links zwischen den Seiten funktionieren. |
| `seiten_mit_optionen/*.html` | Dieselben Seiten **mit Einstellungs-Panel** (unten rechts „Einstellungen“) zum Durchschalten aller Optionen, dazu `wellen-varianten.html` mit allen Wellen groß. |
| `quellen/` | Die eigentlichen Quellen, klein und modular. **Zum Lesen und Übernehmen besser geeignet als die großen Einzeldateien.** |
| `quellen/basis/` | Gemeinsame Teile: `basis.css` (Designsystem, alle Bausteine), `basis.js` (Kopfleiste, Menü, Dunkelmodus, Lexikon, Cookie-Karte, Welle, Fernwartung), `kopf.html`, `fuss.html`, `kontakt.html`, `abschluss.html`, `newsletter*.html`, `zusatzmodule.html`, `softwarekarten.html`, `lexikon.js` (alle Lexikon-Begriffe), `stimmen.json` (Kundenstimmen). `steuerung*.html` ist nur das Mockup-Panel und wird **nicht** umgesetzt. |
| `quellen/seiten/` | Je Seite `name.html` (Inhalt von `<main>`), `name.css`, `name.js`. |
| `quellen/assets/` | Schriften (`schriften.css`, eingebettet), Logo (`logo.txt` als Data-URL, Original `cloudvibe_logo_slogan.png` im Projekt), `team/` Fotos, `partner/` Logos. |
| `quellen/seiten.json` | Alle Seiten mit Pfad, SEO-Titel, Beschreibung, Telefonnummern, Begriff. |
| `quellen/bauen.mjs` | Bauskript, das aus den Quellen die Seiten zusammensetzt (zeigt, wie die Platzhalter ersetzt werden). |

**So entsteht eine Seite:** `basis/kopf.html` + `seiten/<name>.html` + `basis/fuss.html`; CSS = `schriften.css` + `basis.css` + ggf. CSS einer Vorlagenseite (`stil` in `seiten.json`) + `<name>.css`; JS = `lexikon.js` + `basis.js` + `<name>.js`. In den Quellen stehen Platzhalter, die `bauen.mjs` ersetzt: `{{LINK:id}}` Link auf eine Seite, `{{HC}}` Begriff „Gesundheitswesen“, `{{SUPPORT}}`/`{{SALES}}` Telefonnummern (national), `{{SUPPORT_TEL}}`/`{{SALES_TEL}}` für `tel:`-Links, `{{FW}}` Fernwartungs-Download, `{{PFEIL}}`/`{{CHEV}}`/`{{TEL}}` Symbole, `{{LOGO}}`, `{{BILD:…}}`, `{{FUSSMAIL}}` Mail je Bereich, `<!--@kontakt-->`, `<!--@stimmen:…-->`, `<!--@newsletter-->`, `<!--@softwarekarten-->`, `<!--@abschluss-->`.

## Seiten

| Seite | Adresse | Fertige Datei | Quelle |
|---|---|---|---|
| Startseite | `/` | `seiten/index.html` | `quellen/seiten/startseite.html` |
| Gesundheitswesen | `/gesundheitswesen` | `seiten/gesundheitswesen.html` | `quellen/seiten/gesundheitswesen.html` |
| Arztpraxen und MVZ | `/gesundheitswesen/arztpraxen` | `seiten/gesundheitswesen-arztpraxen.html` | `quellen/seiten/arztpraxen.html` |
| Apotheken | `/gesundheitswesen/apotheken` | `seiten/gesundheitswesen-apotheken.html` | `quellen/seiten/apotheken.html` |
| Pflege und SAPV | `/gesundheitswesen/pflegeeinrichtungen` | `seiten/gesundheitswesen-pflegeeinrichtungen.html` | `quellen/seiten/pflege.html` |
| Telematikinfrastruktur | `/gesundheitswesen/telematikinfrastruktur` | `seiten/gesundheitswesen-telematikinfrastruktur.html` | `quellen/seiten/ti.html` |
| Sicherheits-Check (ersetzt Praxis-Check; alte Adresse `/gesundheitswesen/praxis-check` per 301 hierher) | `/sicherheits-check` | `seiten/sicherheits-check.html` | `quellen/seiten/sicherheitscheck.html` (+ `.js`: geführter Selbsttest) |
| Kanzleien | `/kanzleien` | `seiten/kanzleien.html` | `quellen/seiten/kanzleien.html` |
| Unternehmen | `/unternehmen` | `seiten/unternehmen.html` | `quellen/seiten/unternehmen.html` |
| Managed Services | `/managed-services` | `seiten/managed-services.html` | `quellen/seiten/managed.html` |
| KI sicher nutzen | `/ki-sicher-nutzen` | `seiten/ki-sicher-nutzen.html` | `quellen/seiten/ki.html` |
| Schulungen | `/leistungen/schulungen` | `seiten/leistungen-schulungen.html` | `quellen/seiten/schulungen.html` |
| DATEV | `/leistungen/datev` | `seiten/leistungen-datev.html` | `quellen/seiten/datev.html` |
| SelectLine | `/leistungen/selectline` | `seiten/leistungen-selectline.html` | `quellen/seiten/selectline.html` |
| Über uns | `/ueber-uns` | `seiten/ueber-uns.html` | `quellen/seiten/ueber.html` |
| Team | `/ueber-uns/team` | `seiten/ueber-uns-team.html` | `quellen/seiten/team.html` |
| Referenzen | `/ueber-uns/referenzen` | `seiten/ueber-uns-referenzen.html` | `quellen/seiten/referenzen.html` |
| Karriere | `/ueber-uns/karriere` | `seiten/ueber-uns-karriere.html` | `quellen/seiten/karriere.html` |
| News | `/news` | `seiten/news.html` | `quellen/seiten/news.html` |
| News-Beitrag (Muster) | `/news/datensicherung-in-der-praxis` | `seiten/news-datensicherung-in-der-praxis.html` | `quellen/seiten/newsbeitrag.html` |
| Newsletter | `/news/newsletter` | `seiten/news-newsletter.html` | `quellen/seiten/newsletter.html` |
| Termin vereinbaren | `/termin` | `seiten/termin.html` | `quellen/seiten/termin.html` |
| Support | `/support` | `seiten/support.html` | `quellen/seiten/support.html` |
| Ticket eröffnen | `/support/ticket` | `seiten/support-ticket.html` | `quellen/seiten/ticket.html` |
| Login Kundenportal | `/login` (noindex) | `seiten/login.html` | `quellen/seiten/login.html` |
| Lexikon | `/lexikon` | `seiten/lexikon.html` | `quellen/seiten/lexikon.html` |
| Impressum, Datenschutz, AGB | `/impressum` | `seiten/impressum.html` | `quellen/seiten/recht.html` |

**Hauptmenü:** Gesundheitswesen ▾ (Übersicht, Arztpraxen und MVZ, Apotheken, Pflege und SAPV, Telematikinfrastruktur, Praxis-Check) · Kanzleien · Unternehmen · Leistungen ▾ (Managed Services, KI sicher nutzen, DATEV, SelectLine; Klick auf „Leistungen“ führt zu Managed Services) · Über uns ▾ (Übersicht, Team, Referenzen, Karriere, News). Rechts: „Support ▾“ (Fernwartung starten, Ticket eröffnen, Anrufen, Kurzanleitung PDF, Kundenportal) „Ticket“ (Wort + Symbol, ruhig) und blauer Button „Fernwartung“ (lädt QuickSupport). „Termin vereinbaren“ steht im Hero der Startseite, Bereichs- und Leistungsseiten; daneben auf Startseite, Gesundheitswesen, Arztpraxen, Apotheken, Pflege, Kanzleien und Unternehmen „Selbsttest starten“ (führt zum Sicherheits-Check mit `?branche=…#selbsttest`), auf den übrigen „E-Mail schreiben“. Der Menüpunkt „Praxis-Check IT-Sicherheit“ unter Gesundheitswesen führt zum Sicherheits-Check (`?branche=gesundheit`). **Sicherheits-Check:** Hero als Entscheidung (prüfen lassen oder Selbsttest); der geführte Selbsttest (Branche, eine Frage pro Schritt, Ja/Nein/Weiß ich nicht, Verzweigungen, Erklärkarte, Auswertung in Worten, Kontaktformular mit Erreichbarkeit, Ergebnis nur mit Häkchen) steht in `sicherheitscheck.js` (Fragen in `FRAGEN`). DATEV: cloudvibe supportet DATEV, ist aber kein DATEV-Partner und vertreibt DATEV nicht; so formulieren. Kein Menüpunkt und keine Seite Kontakt: Kontakt-Links sind `mailto:`-Links.

## Designsystem (verbindlich)

- **Hell ist Standard.** Hintergrund `#fff`, Text `#14171C`, gedämpft `#4F5663`, Linie `#E3E8F0`, Blau `#2D6CDF`, Grün-Text `#1E8A1A`, Grün-Fläche `#E8F5E7`, Akzent-Grün `#2EB329`. Seitenverlauf `#fff → #F4F7FC (55 %) → #E6EDF8`.
- **Dunkel** (nur per Schalter, im Mockup `?dunkel=1`): Hintergrund `#0B0D10`, Fläche `#121A27`, Text `#fff`, gedämpft `#AEB5C2`, Linie `#252A33`, Grün-Text `#4BD545`. Offen: Blau als kleine Schrift auf Dunkel hat nur Kontrast 3,6 bis 4,0.
- **Schriften:** Comfortaa 300/700 (Überschriften), Mozilla Text 400/700 (Text). H1 Comfortaa 300, Zeilenhöhe 1,07, Laufweite -0,02em, Hervorhebung `<b>` in 700 und Blau. Lead 19 px / 1,55, gedämpft.
- **Formen:** Kopfleiste 75 px hoch, Radius 100 px, Milchglas (`color-mix(in srgb, var(--bg) 66%, transparent)`, blur 18). Textkacheln als Milchglas mit Kante (Radius 30, blur 34). Buttons Radius 100 px, Padding 16 × 30, 700 16 px.
- **Buttons:** Haupt Blau ohne Verlauf; „Anrufen“ helle grüne Fläche (Grün nur für Anrufen); andere Zweitbuttons mit Rahmen.
- **Logo:** immer das Original. Frei links neben der Leiste, 90 px hoch, 70 px Abstand; Logo und Leiste zusammen höchstens 1440 px breit. Wird es eng, misst `basis.js` nach (erst „Termin“ kurz, dann Support als Symbol, nie Überlagerung). Unter 1040 px sitzt das Logo in der Leiste.
- **Keine Farbverlaufs-Streifen:** keine kurzen Akzentbalken Grün → Blau (an Karten, Kacheln, Tooltips, Listen, Schritten). Funktionslinien neutral grau. Verlauf nur in der Welle und im Zitat-Symbol.
- **Werkzeugseiten** (Termin, Ticket, Login, Support, Lexikon) ohne Hero: nur das Werkzeug sichtbar, H1 nur für Suchmaschinen und Screenreader.
- **Hintergründe** wechseln hell/Fläche, nie zwei gleiche direkt untereinander. Keine flachen Kartenraster, keine aufgesetzten Tags, viel Weißraum.
- **Welle:** feine Linien Grün → Blau, **bewegt nur im Hero der Startseite** (Canvas, `CV.zeichne` in `basis.js`, Werte in `startseite.js` → `LINIEN`). Unterseiten der Gesundheitswelt haben eine stehende Wellenkante unten im Hero, sonst ruhiger Hero. Nie in Karten oder Abschnitten. Zur Wahl stehen außerdem Bänder-Varianten nach Entwurf eines Kollegen (`CV.BAENDER`, `CV.baender`; Startseite mit `?welle=original|origRuhig|origKraeftig|origOhne|seide|ruhig|zart|linien`); **Standard ist „Aktuell“ (Linien), final noch offen** (siehe `OPTIONEN.md`).
- **Bereichs-Welten:** gemeinsame Basis, Akzente nur im Detail. Gesundheitswesen Grün → Teal, Kanzleien Petrol, Unternehmen grauer Hero mit Blauschleier. Leistungsseiten neutral.
- **Footer:** Standard ist **K Kompakt** (alle Angaben in zwei Zeilen: Marke und Social, Telefon Beratung/Support, Bereichs-Mail und Ticket, Firmensitz und Büro, Servicezeiten; darunter Links und Rechtliches); A bis D bleiben als Option (siehe `OPTIONEN.md`).
- **Heros:** alle Hauptseiten gleich hoch (780 px bei 1440 × 900), Funktionsseiten einheitlich kompakt; eigener Touch je Bereich über Hintergrund und Farbe der Wellenkante. Höhe, Stil und Wellenart sind Optionen (siehe `OPTIONEN.md`).

## Bausteine (alle in `basis.css`, Beispiele in den Seiten)

Hero (Startseite mit Kacheln; Unterseiten `.uhero` mit Pfad statt Eyebrow) · Text mit Bild · Kacheln · Fakten · „So starten wir“ als **Zeitleiste ohne Nummern** (`.st-reihe`) · Leistungen im Detail `.ld` (aufklappbar, anfangs alle zu: Ausgangslage / Was wir tun / Was du davon hast) · FAQ (`<details name="faq">`, nur eine offen) · Kundenstimmen als Bühne (ein großes Zitat, Pfeile/Punkte) · Softwarekarten DATEV/SelectLine · Team-Karte 4:5 · News-Karte · Newsletter (Karte und Zeile) · Kontaktblock mit Formular · kurzer Abschluss · Lexikon-Begriff im Fließtext (blau, ohne Unterstreichung, Erklärung im Milchglas-Tooltip) · Cookie-Karte unten links.

**Module:** Jeder Abschnitt in `<main>` ist im Mockup ein- und ausschaltbar. Abschnitte mit Klasse **`mod-aus`** und alle **Zusatzmodule** (`data-extra`) sind **aktuell ausgeblendet**: Sie gehören nicht in die erste Umsetzung, sollen aber als Option erhalten bleiben (z. B. als Odoo-Snippet). Die Sitemap zeigt sie blass bzw. als „Zusatzmodule“.

## Funktionen und Anbindung

| Funktion | Seite | Im Mockup | Ziel |
|---|---|---|---|
| Kontaktformular | Bereichs- und Leistungsseiten | Vorname, Nachname, Firma, E-Mail, Anliegen Pflicht; Telefon optional; Seite im verdeckten Feld | Odoo CRM (Lead) |
| Ticket in 3 Schritten | `/support/ticket` | Prüfung, Dringlichkeit, Screenshot, Danke mit Ticketnummer | Odoo Helpdesk |
| Termin | `/termin` | 8 Terminarten (`?art=erst|ti|check|datev|sl|ki|rueck|kunde`), Angaben, Bestätigung | Buchungssystem/Odoo Termine (offen) |
| Newsletter | News, Newsletter, Beitrag | Anmeldung mit Rubriken, Double-Opt-in, Abmelden ohne Konto | Odoo E-Mail-Marketing |
| Karriere | `/ueber-uns/karriere` | Stellen aus Daten (`#stellen-daten`), Detail `#stelle-N`, Bewerbung in 3 Schritten | Odoo Recruitment |
| Login Kundenportal | `/login` | Anmelden, Passwort vergessen, Link gesendet, angemeldet (`?demo=…`) | Odoo-Portal (`/my`), Zugang richtet cloudvibe ein |
| Fernwartung | Support-Menü, Support, Login | **keine Seite**: direkter Download der QuickSupport-.exe, danach Hinweis „Datei öffnen, ID am Telefon nennen“ | Link in `seiten.json` → `fernwartung` |
| Cookie-Karte | alle | notwendig / Statistik / externe Medien, Footer-Link „Cookie-Einstellungen“ | Consent-Lösung |
| Lexikon | `/lexikon` + Tooltips | Suche, Filter, A bis Z, Anker `#lx-<schlüssel>` | statisch |

## SEO (Pflicht)

Jede Seite hat im `<head>` Titel (~60 Zeichen), Beschreibung (~155), Canonical, Open Graph und JSON-LD (ProfessionalService, WebSite, WebPage, BreadcrumbList, Service bei Leistungsseiten, FAQPage aus den FAQ). Genau eine H1. Login ist `noindex`. Werte stehen in `quellen/seiten.json` und sind 1:1 übernehmbar. Beim Livegang: 301-Weiterleitungen von der alten cloudvibe.de, XML-Sitemap, robots.txt, später `llms.txt`.

## Inhaltliche Regeln

- Ansprache **Du**. **Keine Gedankenstriche** (– oder —) als Satzzeichen. **Nie Preise, Rabatte, Prozente.** SLA ohne Zeiten und Zahlen. „Kein Callcenter“ nirgends.
- Zahlen, Fristen, Zertifikate, Zitate nur mit Beleg. Drei Zielgruppen gleichberechtigt; Apotheken und Pflege immer einzeln nennen.
- Telefonnummern sichtbar national (`02823 8901434-60` Beratung, `-00` Support), nur im Footer mit +49; `tel:`-Links und JSON-LD international.
- Begriff „Gesundheitswesen“ (Alternative „Healthcare“ noch umschaltbar).

## Nur Mockup, nicht umsetzen

Das Einstellungs-Panel selbst und die Leiste „Bearbeiten · Speichern · Einstellungen“ (nur in `seiten_mit_optionen/`) sind Werkzeuge zum Abstimmen. **Die Optionen dahinter aber nicht:** Sie werden laut `OPTIONEN.md` umschaltbar umgesetzt (z. B. als Theme-Option), weil cloudvibe sie erst später final entscheidet. Kennzeichnung „Beispiel“ an Kundenstimmen entfällt, sobald echte, freigegebene Stimmen vorliegen.

## Noch offen (Zulieferungen, nicht erfinden)

QuickSupport-Download-Link · PDF-Kurzanleitung · Kundenportal-Link · Ticketnummernform · Regel außerhalb der Servicezeiten · Buchungssystem und Video-Tool für Termine · Partner-Logos · SLA-Inhalte · Umfang Praxis-Check · Team-Fotos/Rollen/Einwilligungen · Social-Media-Links · **echte Kundenstimmen mit Freigabe** (bis dahin fiktive Beispiele in `stimmen.json`) · Stelleninhalte · Bestätigung Sales-Nummer, support@, AGB · Datenschutzerklärung neu (inkl. Formulare, Termin, Ticket, Cookie-Karte, Newsletter) · TI-Fristen und BSI-Zahlen vor Livegang mit aktuellen Quellen prüfen.

**Stammdaten:** cloudvibe GmbH, Firmensitz Maria-Niemann-Weg 10, 47574 Goch; Büro Von-Monschaw-Str. 12a, 47574 Goch. HRB 18521 AG Kleve, Geschäftsführung Lukas M. Kowal, USt-ID DE358683658. Servicezeiten Mo bis Fr 8 bis 17 Uhr. Mail je Bereich: kontakt@, wecare@ (Gesundheitswesen), weenable@ (Kanzleien, Unternehmen), hire@ (Karriere), support@.

**Neu erzeugen:** im Projekt `Mockup/_quellen/` den Befehl `node bauen.mjs --uebergabe` ausführen; das überschreibt diesen Ordner mit dem aktuellen Stand (README, OPTIONEN.md und einstellungen.js bleiben).

**Hosting:** Repository https://github.com/cinema134/cloudvibe-Redesign, GitHub Pages aus dem Zweig `main`, Hauptordner.
