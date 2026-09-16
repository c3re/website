# Barrierefreiheits-Audit: c3RE

**Phase 1, Stand 16.09.2026. Vor Phase 2 ist eine ausdrückliche Freigabe erforderlich.**

Geprüfter Quellstand: `8e4b29d` (`implement new website design and simple language`),
Branch `feature/barrierefreiheit`. Das neue Design wurde vor Beginn dieses Audits
abgeschlossen und separat committet. Während des Audits wurden keine Website-Inhalte,
Templates, Styles, Skripte oder Deployment-Einstellungen geändert.

## 1. Kontext und Ergebnis

| Feld | Festgelegter Kontext |
| --- | --- |
| Website / Repository | c3RE e.V., Chaostreff Recklinghausen; Repository `website` |
| Ziel | Freiwillige Orientierung an WCAG 2.2, Stufe AA, vom Auftraggeber bestätigt |
| Zielgruppe | Technikinteressierte, Mitglieder, Besucherinnen und Besucher der Hackerhütte; auch Menschen mit Seh-, Motorik-, Lese- oder kognitiven Einschränkungen |
| Feedbackkontakt | `kontakt@c3re.de`, `02361 / 8488096`, beide ausdrücklich bestätigt |
| Standard-Farbschema | Immer dunkel, unabhängig vom Betriebssystem. Eine gespeicherte Nutzerauswahl hat Vorrang. Erneut ausdrücklich bestätigt. |
| Bestehende Sprachfassung | Standard und **Einfache Sprache**. Keine getrennte, geprüfte Leichte Sprache vorhanden. |
| Geprüfte Auslieferung | Lokaler Produktionsbuild unter `http://127.0.0.1:1315`, keine Änderung der Live-Website |

**Ergebnis: Der Stand ist noch nicht WCAG-2.2-AA-konform nachgewiesen.**
Es gibt bestätigte Probleme bei der Erkennbarkeit von Textlinks, hellen Textkontrasten,
verdecktem Tastaturfokus und weiteren unten beschriebenen Punkten.

- **113 axe-Prüfungen:** 14 Inhalts-/Übersichtsseiten × 2 Breiten × 2 Farbmodi ×
  2 Sprachfassungen sowie eine zusätzlich ausgelieferte Bibliotheks-Demoseite.
- **93 Prüfungen mit mindestens einem automatisch gemeldeten Verstoß**, 20 ohne.
  Das sind wiederholte Zustände derselben Komponenten, nicht 93 unabhängige Fehler.
- **Lighthouse Accessibility:** 96 oder 100 von 100 auf den 14 Website-Seiten;
  80 auf der Bibliotheks-Demoseite. Auch 100 ist kein Konformitätsnachweis.
- Reflow bei 320 CSS-Pixeln sowie erhöhte Textabstände: in den getesteten Zuständen
  kein horizontaler Seitenüberlauf und kein durch `overflow: hidden/clip` abgeschnittener
  Text festgestellt.
- Keine JavaScript-Laufzeitfehler in den 112 axe-Läufen der Website-Seiten.
- Native Schalter, Speicherung, Standortkopieren per Tastatur und die Grundseite ohne
  JavaScript funktionieren. Diese Eigenschaften müssen erhalten bleiben.

### Normative Abgrenzung

WCAG 2.2 AA ist hier das vereinbarte technische Ziel. Leichte Sprache, Vorlesen,
Atkinson Hyperlegible und ein Einstellungsmenü sind zusätzliche Projektanforderungen;
ihr Fehlen ist nicht automatisch ein Verstoß gegen ein AA-Erfolgskriterium.

WCAG-Ergebnisse allein belegen weder die vollständige EN 301 549 noch die Erfüllung
aller gesetzlichen Pflichten aus BFSG oder BITV. Die EN umfasst weitere Anforderungen,
zum Beispiel an Dokumente und Unterstützung. Fassungsstand und rechtliche Harmonisierung
sind gesondert zu prüfen, falls später eine rechtliche Verpflichtung angenommen wird.
Für dieses freiwillige Vorhaben werden keine zuständige Behörde, Schlichtungsstelle
oder gesetzlichen Erklärungspflichten erfunden.

## 2. Stack, Build und Auslieferung

- Hugo mit dem lokal versionierten Theme `themes/hugo-theme-flat`.
- Markdown mit YAML-Frontmatter; Hugo-Templates, CSS Custom Properties und kleine
  Vanilla-JavaScript-Dateien. Keine React-Laufzeit im produktiven Theme.
- `config.toml` enthält Navigation, Footer und Konfiguration. Bilder und PDFs liegen
  in `static/`; Theme-Dateien und lokale Schriften unter `themes/hugo-theme-flat/static/`.
- `Makefile`: `make check` führt Hugo mit `--panicOnWarning` und anschließend `minify`
  aus. Dieser Check besteht mit **Hugo 0.156.0**, der Version der vorhandenen CI.
- `.github/workflows/build.yml` prüft Pull Requests gegen `master` in `golang:1.26`.
  Der Workflow enthält bisher keine Browser- oder Barrierefreiheitstests.
- `make deploy_test` baut und überträgt per `rsync` auf `c3retest.shnbk.de`. Ein
  automatischer Produktionsdeploy ist im untersuchten Repository nicht dokumentiert.
  Es wurde kein Deployment ausgeführt.
- Der lokal ebenfalls installierte Hugo 0.161.1 warnt vor dem vorhandenen
  `languageCode`/`.Site.LanguageCode`. Das ist eine künftige Build-Migration,
  kein in diesem Audit behobener Barrierefreiheitsfehler.
- Vorhandene Laufzeitabrufe: `spaceapi.c3re.de` und `ical2json.c3re.de`.
  Schriften, Styles und Skripte der Website werden lokal ausgeliefert.

## 3. Vollständiges Seiteninventar

`D` = dunkel, `H` = hell, `S` = Standard, `E` = Einfache Sprache.
Die vier Zahlen sind **von axe beanstandete DOM-Elemente pro Zustand** bei 1440 px.
Bei 320 px waren die jeweiligen Anzahlen gleich. Lighthouse prüfte den dunklen
Standardzustand mit nicht verfügbaren Live-Diensten; Details siehe Abschnitt 5.

| URL | Inhaltsquelle / Template | Sprachfassungen | axe DS / DE / HS / HE | Lighthouse |
| --- | --- | --- | --- | --- |
| `/` | `content/_index.md`, `_default/index.html` | S + E | 3 / 3 / 20 / 21 | 96 |
| `/unsere-philosophie/` | `content/unsere-philosophie.md`, `single.html` | S + E | 0 / 1 / 15 / 17 | 100 |
| `/unvereinbarkeitserklaerung/` | `content/unvereinbarkeitserklaerung.md`, `single.html` | S + E | 3 / 3 / 18 / 19 | 96 |
| `/codeweek/` | `content/codeweek.md`, `single.html` | S + E | 3 / 2 / 18 / 18 | 96 |
| `/downloads/` | `content/downloads.md`, `single.html` | S + E | 0 / 1 / 15 / 17 | 100 |
| `/kontakt/` | `content/kontakt.md`, `single.html` | S + E | 2 / 3 / 17 / 19 | 96 |
| `/impressum/` | `content/impressum.md`, `single.html` | S + E | 1 / 1 / 16 / 17 | 96 |
| `/datenschutz/` | `content/datenschutz.md`, `single.html` | S + E | 1 / 2 / 16 / 18 | 96 |
| `/news/` | `content/news/_index.md`, `newsoverview.html` | S + E | 0 / 0 / 15 / 16 | 100 |
| `/news/test_diday_feb/` | `content/news/test_diday_feb.md`, `single.html` | S + E | 1 / 1 / 16 / 17 | 96 |
| `/test/` | `content/test.md`, `single.html` | S + E | 12 / 12 / 27 / 28 | 96 |
| `/categories/` | Generiert, `taxonomy.html` | gemeinsame Oberfläche + E-Beschriftung | 0 / 0 / 15 / 16 | 100 |
| `/categories/news/` | Generiert, `term.html` + `archive.html` | Titel/Beiträge mit Varianten | 0 / 0 / 15 / 16 | 100 |
| `/tags/` | Generiert, `taxonomy.html`, derzeit leer | gemeinsame Oberfläche + E-Beschriftung | 0 / 0 / 15 / 16 | 100 |
| `/lib/icofont/demo.html` | `themes/hugo-theme-flat/static/lib/icofont/demo.html` | Fremdsprachige Bibliotheksdemo, keine Schalter | 1 im einmaligen separaten Lauf | 80 |
| `/news/page/1/` | Hugo-Weiterleitungsdokument | Kein eigener Inhalt | Quellprüfung; sofortiges Meta-Refresh zu `https://c3re.de/news/` | Ziel `/news/` geprüft |

Es gibt elf Markdown-Dateien und 16 ausgelieferte HTML-Dateien einschließlich Demo
und Weiterleitung. `/test/` ist mit `draft: false` tatsächlich veröffentlicht.
Die Icon-Demo wird ebenfalls mit ausgeliefert, obwohl sie nicht im Menü steht.

Zusätzliche Ausgaben: RSS-Feeds, XML-Sitemap und die vorhandene `robots.txt`-Vorlage.
RSS nutzt die Originaltexte und englische Kanalbeschreibungen; die Schalter gelten
nicht in Feed-Readern. Hosting-eigene Fehlerseiten, insbesondere 404, sind durch den
lokalen Hugo-Build nicht ausreichend bestimmt und müssen auf dem Zielhost geprüft werden.

Der unversionierte Designexport `Website für C3RE e.V./` ist Referenzmaterial und kein
Teil der Hugo-Ausgabe. Externe Ziele wie Wiki, Chat, Codeweek-Unterseite, Kalender,
Dienste und soziale Netzwerke gehören nicht zur geprüften Website-Ausgabe.

### Downloads: separat zu prüfen

| Datei | Größe | Prüfstatus |
| --- | --- | --- |
| `static/dl/Satzung.pdf` | 57.708 Bytes, ca. 56,4 KiB | Nur inventarisiert und Erreichbarkeit geprüft |
| `static/dl/Beitragsordnung.pdf` | 27.754 Bytes, ca. 27,1 KiB | Nur inventarisiert und Erreichbarkeit geprüft |
| `static/dl/Unvereinbarkeitserklärung.pdf` | 29.368 Bytes, ca. 28,7 KiB | Nur inventarisiert und Erreichbarkeit geprüft |

Keine Aussage zu PDF-Tags, Lesereihenfolge, Sprache, Formularfeldern oder PDF/UA.
Die Original-PDFs wurden nicht verändert oder als barrierefrei eingestuft.

## 4. Komponenteninventar

Alle folgenden Layoutpfade liegen unter `themes/hugo-theme-flat/layouts/`.

| Komponente / Dateien | Aufgabe und Prüfbezug |
| --- | --- |
| `_default/baseof.html` | `html lang="de"`, Standard-Dark-Attribute, Skip-Link, genau ein `main`, `aside`, Header/Footer |
| `partials/head.html`, `html-end.html` | Seitentitel, Metadaten, frühes Einstellungsskript, lokale CSS/JS/Schriften |
| `partials/header.html`, `preferences.html` | Hauptnavigation, aktive Seite, Sprachschalter und zwei Theme-Buttons |
| `partials/banner.html` | Dekoratives Banner mit textlichem Öffnungsstatus und pulsierendem Punkt |
| `partials/text.html`, `content-variants.html` | Beschriftungen und vollständige Standard-/Einfach-Fassungen |
| `_default/index.html`, `single.html` | Startseite, Informationsseiten und Newsdetail |
| `newsoverview.html`, `list.html`, `term.html`, `taxonomy.html` | News, Listen und generierte Themenübersichten |
| `partials/news-card.html`, `archive.html`, `pagination.html` | News-Vorschau, Archiv und Seitenwahl; aktuell keine mehrseitige Pagination |
| `partials/visit-info.html` | Treffzeit, Adresse und Anreise-Link |
| `partials/side-calendar.html` | Kalenderliste, Lade-/Fehler-/Leerzustand, kopierbarer Standort |
| `partials/side-door-status.html` | Offen/geschlossen/unbekannt, Zeitpunkt, Temperatur, No-JS-Hinweis |
| `partials/side-contact.html`, `footer.html` | Einheitliche Kontaktmöglichkeiten, Social-Links, Rechtstexte, RSS |
| `_default/_markup/render-heading.html`, `render-image.html` | Überschriftenanker, Alt-Texte, Bildunterschriften und Bildmaße |
| `_default/rss.xml`, `robots.txt` | Weitere Ausgabeformate; RSS ohne Sprachumschaltung |
| `partials/side-recent.html`, `side-categories.html`, `side-tags.html` | Im Grundlayout auskommentiert; alte englische Beschriftungen, bei Reaktivierung prüfen |
| `partials/comment.html`, `_markup/render-codeblock-mermaid.html`, KaTeX-Zweig in `head.html` | Aktuell nicht durch veröffentlichte Inhalte aktiviert; keine aktive Kommentar-, Diagramm- oder Formelfunktion geprüft |

Styles: `static/css/style.css`, `syntax.css`, `fonts.css` im Theme.
Skripte: `preferences.js`, `calendar.js`, `door-status.js`, `href_handling.js`
unter `themes/hugo-theme-flat/static/js/`.

Keine aktiven Formulare, Login-Verfahren, CAPTCHA, Cookie-Banner, Dialoge, Drag-and-drop,
Audio-/Videoelemente, Iframes oder Datentabellen auf den 14 Website-Seiten gefunden.
Entsprechende Prüfungen sind für den aktuellen Stand nicht anwendbar, müssen aber für
das geplante Einstellungsmenü und ein späteres Feedbackformular ergänzt werden.

## 5. Methode und Messergebnisse

### Automatisierte Prüfung

- Produktionsausgabe von `make check`, Hugo 0.156.0 und `minify`.
- Playwright **1.63.0**, `@axe-core/playwright` **4.13.0**, Chromium **153.0.8010.12**.
- axe-Tags exakt: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.
- Breiten **1440 und 320 CSS-Pixel**, Höhe 1000; beide Farbmodi und beide vorhandenen
  Sprachfassungen. Das emulierte System war hell, die Website-Auswahl wurde explizit gesetzt.
- Erfolgreiche echte Antworten der beiden öffentlichen APIs wurden einmal am
  16.09.2026 um 19:38:10 UTC aufgezeichnet und für die axe-Läufe lokal wiedergegeben.
  Damit wurden geladene Termine, Standortbuttons und eine geöffnete Hütte geprüft.
  Diese Testantworten sind keine neuen Website-Inhalte und wurden nicht eingebaut.
- Lighthouse **13.4.1**, ausschließlich Accessibility, Desktop 1440 × 1000,
  15 Seiten. API-Zugriffe wurden für reproduzierbare Fehlerzustände blockiert.
  Die Lighthouse-Punktzahlen decken deshalb nicht die erfolgreiche Kalenderanzeige ab;
  diese wurde in den axe-Läufen geprüft.
- Testwerkzeuge ausschließlich als **devDependencies in einem temporären
  Auditprojekt**, nicht in der Website und nicht als produktive CDN-Skripte installiert.
  Die spätere dauerhafte npm-/CI-Integration gehört zu Phase 5.

| axe-Regel | Prüfungen mit Befund | Beanstandete Elemente über alle Wiederholungen | Einordnung |
| --- | --- | --- | --- |
| `link-in-text-block` | 72 | 220 | WCAG 1.4.1; wiederholte Textlinkgestaltung |
| `color-contrast` | 56 | 876 | WCAG 1.4.3; ausschließlich heller Modus in dieser Matrix |
| `html-has-lang` | 1 | 1 | WCAG 3.1.1; Bibliotheks-Demoseite |

Lighthouse meldete zusätzlich `landmark-one-main` auf der Demo. Das ist eine
Struktur-/Best-Practice-Prüfung und wurde nicht nachträglich als weiterer axe-Verstoß
mit den angeforderten WCAG-Tags gezählt.

axe lieferte auch **unvollständige Prüfungen** (`incomplete`), insbesondere
`aria-prohibited-attr` an fünf `<time aria-label>`-Elementen je geladener Kalenderliste
sowie nicht automatisch auflösbare Kontraste an Symbolen und dem Banner mit Pseudoelement.
Diese wurden nicht als bestanden gewertet und nicht in die bestätigten Verstoßzahlen
eingerechnet.

### Ergänzende Browser- und Codeprüfungen

- Tab-Reihenfolge auf allen 14 Website-Seiten; erster Fokus ist der Skip-Link.
  Enter setzt den Fokus auf `main-content`. Zwei verdeckte Kalenderlinks bestätigt,
  siehe A03. Eine erste geometrische Meldung am Skip-Link wurde durch Hit-Testing als
  Fehlalarm ausgeschlossen: Der Skip-Link liegt mit höherem z-index über dem Header.
- Sprachschalter mit Leertaste, Theme-Button mit Enter und Standortkopieren mit Enter
  funktionieren; Erfolg wird über eine Live-Region ausgegeben.
- Alle 14 Seiten in beiden Sprachfassungen bei 320 und 640 px mit Zeilenhöhe 1,5,
  Wortabstand 0,16 em, Buchstabenabstand 0,12 em und Absatzabstand 2 em geprüft:
  keine horizontalen Seitenüberläufe bzw. gemessenen versteckten Textüberläufe.
- 320 px entspricht dem Reflow-Prüfbereich bei 400 % Zoom auf 1280 px Ausgangsbreite.
  Dies ersetzt **keine reale Browser-Zoom-Prüfung auf 200/400 %**, die noch mit
  VoiceOver/NVDA/TalkBack und den Zielbrowsern durchzuführen ist.
- `prefers-reduced-motion: reduce` schaltet die Statusanimation aus.
  `forced-colors: active` zeigt fehlende sichtbare Schalterzustände, siehe A07.
- Direkter Anreise-Anker funktioniert in beiden Fassungen; ein anders benannter
  Philosophie-Anker funktioniert beim Sprachwechsel nicht, siehe A09.
- Lokale Navigations- und Downloadziele aus den 14 Seiten liefern HTTP 200.
  Externe Links wurden nicht systematisch auf Erreichbarkeit oder Barrierefreiheit geprüft.
- Auf dem minifizierten Produktionsstand nochmals geprüft: Speicherung nach Reload,
  nutzbare Grundseite mit deaktiviertem JavaScript, funktionierende Schalter bei
  verweigertem `localStorage` sowie verständliche Meldungen bei API-Ausfall.

**Nicht durchgeführt:** reale Screenreader-Tests, Tests mit Menschen aus der Zielgruppe,
PDF-Inhaltsprüfung, DGS-Prüfung, vollständige DIN-Normenprüfung und Prüfung des
Produktionshostings. Browser-Automation wird nicht als manueller Screenreader-Test ausgegeben.

### Nachweise und Reproduktion

Lokales Audit-Arbeitsverzeichnis dieser Sitzung:

```text
/var/folders/dg/pg323lwj4kg1cyvxjrctl1nw0000gn/T/opencode/c3re-a11y/
```

Dort liegen die festgeschriebenen Werkzeugversionen in `package.json` und `package-lock.json`
sowie `audit.mjs`, `lighthouse.mjs`, `manual.mjs` und `controls.mjs`.
`results/summary.json` enthält alle 113 axe-Ergebnisse mit Selektoren, HTML-Ausschnitten
und gemessenen Kontrasten; die vollständigen Einzelberichte liegen daneben.
`lighthouse/summary.json` und die Einzelberichte enthalten die Lighthouse-Ergebnisse.
`results/manual-summary.json` und `controls-summary.json` enthalten die Zusatzprüfungen.

Wichtige Screenshots: `results/forced-colors.png`, `results/focus-_downloads_.png`,
`results/focus-_news_.png` sowie die zustandsbezogenen Screenshots der Startseite,
Kontaktseite und Newsdetailseite. Die drei erstgenannten Bilder wurden visuell angesehen.
Das temporäre Verzeichnis ist kein dauerhaftes CI-Artefakt; seine wesentlichen
Ergebnisse sind deshalb in diesem versionierten Bericht enthalten.

Reproduktionsablauf bei vorhandenem Audit-Arbeitsverzeichnis:

```sh
# Im Repository, mit Hugo 0.156.0 und minify im PATH:
make check
python3 -m http.server 1315 --bind 127.0.0.1 --directory public

# In einem zweiten Terminal, im oben genannten Audit-Arbeitsverzeichnis:
npm ci
npx playwright install chromium
npm run audit
npm run lighthouse
node manual.mjs
node controls.mjs
```

## 6. Befunde und Lösungsvorschläge

Schweregrad: **kritisch** = wesentliche Nutzung blockiert; **hoch** = bestätigtes
A/AA-Problem mit deutlicher Auswirkung; **mittel** = begrenztes Problem oder klar
benannter Prüfbedarf; **niedrig** = ergänzende Verbesserung. Nicht jeder Runbook-Wunsch
wird künstlich als WCAG-Verstoß klassifiziert.

| ID / Befund | Seite / Komponente | WCAG-Kriterium / Einordnung | Schweregrad | Lösungsvorschlag nach Freigabe |
| --- | --- | --- | --- | --- |
| A01: Textlinks unterscheiden sich ausschließlich durch Farbe. Abstand zur umgebenden Textfarbe nur 1,06:1 dunkel bzw. 1,83:1 hell. | Fließtexte auf zehn Seiten in mindestens einer Sprachfassung; globale `a`-Regel in `style.css` | **1.4.1 A**, durch axe bestätigt | hoch | Links im Fließtext standardmäßig unterstreichen. Der optionale Schalter darf später zusätzliche Hervorhebung liefern, die Basis darf nicht davon abhängen. |
| A02: Kleine Texte und Footerlinks unterschreiten 4,5:1 im hellen Design. | `.site-subtitle`, `.calendar-month`, Besuchsinformationen, `.footer-label`, Footerlinks | **1.4.3 AA**, durch axe bestätigt | hoch | Zwei helle Farbtokens minimal abdunkeln, anschließend alle Hintergrundkombinationen erneut messen. Vorschläge unten. |
| A03: Der fixierte Header verdeckt fokussierte Links vollständig. | `/downloads/` und `/news/`, Einfache Sprache, 1440 px; Link „Alle Termine ansehen“ | **2.4.11 AA**, mit Tastatur und Hit-Testing bestätigt | hoch | `scroll-padding-top` für den Scrollcontainer und geeignetes `scroll-margin` für Fokusziele; tatsächliche Headerhöhe berücksichtigen oder Sticky-Verhalten anpassen. Nicht nur Überschriften behandeln. |
| A04: Der Öffnungspunkt pulsiert automatisch unbegrenzt. Automatische Datenaktualisierung hat ebenfalls keinen Pausen-/Häufigkeitsregler. | `.status-dot`, `door-status.js` alle 30 s, `calendar.js` alle 15 min | **2.2.2 A**; Bewegung und automatisch aktualisierte Information prüfen/abstellen | hoch | Basisanimation kurz halten oder pausierbar machen; Aktualisierung pausierbar machen bzw. Häufigkeit wählbar. „Animationen aus“ zusätzlich im gemeinsamen Menü. `prefers-reduced-motion` allein ist kein Ersatz für alle betroffenen Mechanismen. |
| A05: Das DI-Day-Plakat hat nur `alt="DI-Day"`; die Aussage „Jeden ersten Sonntag digital freier werden!“ fehlt als Textäquivalent. | `/news/test_diday_feb/`, beide Fassungen | **1.1.1 A**; zusätzlich **1.4.5 AA** auf notwendige Bildschrift prüfen | hoch | Relevanten Plakattext als HTML-Bildbeschreibung oder ergänzenden Text bereitstellen, visuelle Darstellung erhalten. Text redaktionell prüfen. |
| A06: Längere englische Aussagen sind nicht als Englisch ausgezeichnet. | Philosophie „Be excellent to each other!“, Startseiten-Motto, Footer „FRIENDS & FAMILY“, News-Schluss | **3.1.2 AA**, Codeprüfung | hoch | Sprachwechsel für tatsächliche englische Passagen mit `lang="en"` auszeichnen. Eigennamen und übliche Lehnwörter nicht pauschal als Fehler behandeln. |
| A07: Unter Forced Colors verschwinden die Schiebemarkierung und die sichtbare Unterscheidung zwischen gewähltem und ungewähltem Theme. | `preferences.html`, `style.css`; Screenshot `forced-colors.png` | **1.4.11 AA**, visuell bestätigter Verlust der Zustandsdarstellung | mittel | Sichtbare Kontur/Häkchen/Textzustand mit Systemfarben; `aria-pressed` behalten. Mit Windows High Contrast zusätzlich praktisch verifizieren. |
| A08: Eine zweite globale Möglichkeit, Informationsseiten zu finden, fehlt. Die XML-Sitemap ist keine im UI angebotene Inhaltsübersicht. | Navigation; besonders Philosophie, Erklärung, Codeweek und Newsübersicht | **2.4.5 AA**, Code-/Navigationsprüfung | mittel | Eine verlinkte HTML-Inhaltsübersicht ergänzen oder die inhaltliche Querverlinkung systematisch ausbauen. Newsübersicht sichtbar erreichbar machen. |
| A09: Sprachwechsel lässt einzelne Anker auf unsichtbare Inhalte zeigen. | `/unsere-philosophie/#hackerethik`; einfaches Ziel heißt `simple-hackerethik-unsere-grundsätze` | Projektanforderung zuverlässige Sprach-/Ankernavigation; kein zusätzlicher automatischer WCAG-Befund | mittel | Gemeinsame stabile Ankerkennungen oder explizite Zuordnung pro Fassung verwenden. Direkt verlinkbare Sprachwahl im selben Controller ergänzen. |
| A10: Kalender-Datumsbeschriftung setzt auf `aria-label` am `time`-Element. axe kann die Unterstützung nicht bestätigen. Beschreibungen sind teilweise nur in nativen `title`-Tooltips vorhanden. | `calendar.js`, fünf Datumskacheln und Ereignisbeschreibungen | **1.3.1 A / 4.1.2 A: Prüfbedarf**; Zugang zu Beschreibungen zusätzlich **2.1.1 A** prüfen. Native Browser-Tooltips nicht pauschal als 1.4.13-Verstoß behandeln. | mittel | Vollständiges lesbares Datum als Text im `time` anbieten; Beschreibungen bei Bedarf in einer tastaturbedienbaren Detailansicht statt nur als `title`. Mit Screenreadern prüfen. |
| A11: Die ausgelieferte Icon-Demo hat kein `lang` und kein `main`. | `/lib/icofont/demo.html` | **3.1.1 A** bestätigt; `landmark-one-main` zusätzlich als Lighthouse-Strukturbefund | hoch | Demo aus der Auslieferung ausschließen, falls nicht benötigt; andernfalls regulär sprachlich/semantisch erschließen. Entfernung erst nach Freigabe. |
| A12: Externe Links öffnen per Skript neue Tabs, meist ohne verständlichen Hinweis. | `href_handling.js`, Textlinks und Social-Links | Runbook-Anforderung, W3C-Technik G201; nicht allein ein pauschaler AA-Verstoß | niedrig | Möglichst im gleichen Tab öffnen oder sichtbaren/zugänglichen Hinweis ergänzen. Pfeil allein nicht voraussetzen. |
| A13: Downloadlinks nennen in Standard-Sprache Dateityp und Größe nicht ausdrücklich. | `/downloads/` | Runbook-Anforderung; Linkzweck **2.4.4 A** im Kontext prüfen | niedrig | „PDF, … KiB“ an den Links ausgeben; Original-PDF-Prüfung separat verfolgen. |
| A14: Sprachfassungen sind nicht direkt per URL wählbar. Für künftig fehlende einfache Inhalte würde das Template still auf das Original zurückfallen. Im Live-Kalender fehlen einfache Fassungen für z. B. „Plenum“. | `preferences.js`, `content-variants.html`, `calendar.js` | Anforderungen an Sprachfassungen/DIN-Ziel; nicht automatisch AA-Verstoß | mittel | Ein einziges erweiterbares Sprachsystem, URL-Auswahl und sichtbarer Fehlhinweis. Redaktionelle Pflege der Kalendertexte vereinbaren. |
| A15: Generierte Übersichten verlieren die individuelle Bezeichnung im dynamischen Seitentitel; `categories` und `tags` heißen beide „Themenübersicht“. | `taxonomy.html`, `archive.html`, Titelaktualisierung in `preferences.js` | **2.4.2 A / 2.4.6 AA**, Verbesserung der Orientierung | niedrig | Kategorie-/Schlagwortname auch im einfachen Titel erhalten bzw. erklären. |
| A16: Viele Schriftgrößen sind feste px-Werte. Ein bloßes Ändern der Root-Schriftgröße würde den geplanten Größenmodus nicht ausreichend umsetzen. | `style.css`, einschließlich `html { font-size: 16px; }` | Voraussetzung für Phase 3; **1.4.4 AA** anschließend tatsächlich testen, derzeit kein allein daraus abgeleiteter Verstoß | mittel | Textgrößen behutsam auf rem skalieren und bei 125/150 % sowie echtem Browser-Zoom prüfen. |

### Reproduktion der verdeckten Fokusziele (A03)

1. Desktop 1440 × 900 öffnen und Einfache Sprache einschalten.
2. `/downloads/` aufrufen. Mit Tab und Enter den Skip-Link benutzen.
3. Mit Tab durch die Dokumentlinks und den erklärenden Link zur Vereins-Erklärung
   bis zum Kalenderlink in der Sidebar weitergehen.
4. Der Kalenderlink erhält einen 2-px-Fokusrahmen, liegt aber vollständig hinter dem
   Header. Im Test lag sein Rechteck bei y = 44 bis 63,5 px; Hit-Testing traf `.header`.
5. Auf `/news/` wurde dasselbe bei y = 115 bis 134,5 px reproduziert;
   Hit-Testing traf `.header-tools`.

### Minimale Farbvorschläge, noch nicht angewendet

| Rolle / Hintergrund | Aktuell | Gemessener Kontrast | Vorschlag | Rechnerischer Kontrast danach |
| --- | --- | --- | --- | --- |
| Heller gedämpfter Text auf Footer `#e3e3e1` | `#6f6a66` | 4,159:1 | `#696460` | 4,549:1 |
| Derselbe Text auf Block `#ebebe9` | `#6f6a66` | 4,477:1 | `#696460` | 4,897:1 |
| Heller Link auf Footer `#e3e3e1` | `#1f7a3d` | 4,180:1 | `#1d743a` | 4,525:1 |

Berechnet aus den sRGB-Hexwerten nach der WCAG-Luminanzformel. axe rundet die
Ausgangswerte auf 4,15/4,47/4,17 ab. Die Vorschläge sind kleine lokale Änderungen,
keine bereits freigegebenen Markenfarben. Halbtransparente Hintergründe, Hover-/Fokus-
zustände, Schalter und Banner müssen danach erneut im Browser geprüft werden.
Ein späterer 7:1-Modus benötigt ein gesondertes, vollständig geprüftes Tokenset.

## 7. Bestehende Spracharchitektur und DIN-Ziel

### Technische Umsetzung

1. Jede der elf Markdown-Dateien enthält den Originaltext sowie `simple.title`,
   `simple.summary` und `simple.content` im YAML-Frontmatter.
2. `content-variants.html` rendert den Originaltext und die einfache Markdown-Fassung
   in getrennte Bereiche mit `data-language="standard"` bzw. `"simple"`.
3. `text.html` stellt dasselbe Muster für Navigation, Titel, Footer und kurze UI-Texte bereit.
4. `<html data-simple="false">` ist der Ausgangswert. `preferences.js` liest vor
   dem Stylesheet-Laden `c3re-simple` aus `localStorage`; `"1"` aktiviert den Modus.
5. Der Schalter verwendet einen nativen Button mit `aria-pressed`. CSS versteckt die
   inaktive Fassung mit `display: none`; sie ist damit auch im Accessibility Tree verborgen.
6. `preferenceschange` aktualisiert die dynamischen Kalender-/Türtexte. Speicherung
   ist mit `try/catch` geschützt; `storage`-Ereignisse synchronisieren offene Tabs.
7. Die URLs bleiben gleich. Es gibt keine Sprachroute und keinen Sprachparameter.
   Einfache Überschriften erhalten `simple-` vor ihren IDs. Die Ankerabbildung funktioniert
   nur, wenn die restliche Kennung gleich ist, siehe A09.
8. Für Kalenderdaten werden vorhandene `summary_simple`/`description_simple` unterstützt.
   „Open Chaos“ wird erklärt; bei sonstigen unveränderten Namen erscheint ein Hinweis.

### Stärken

- Inhalte bleiben in Hugo/Markdown pflegbar, ohne Übersetzungsdienst oder neue Laufzeit.
- Alle elf Inhaltsdateien besitzen eine einfache Fassung, auch Rechtstexte und Testseite.
- Originalfassungen bleiben zugänglich; Original-PDFs sind in einfacher Sprache als
  nicht vereinfachte Dokumente gekennzeichnet.
- Größerer Fließtext und größere Zeilenhöhe im einfachen Modus.
- Fachbegriffe werden vielfach erklärt. Lade-/Fehler-/Kopiermeldungen wechseln mit.
- Kein Tracking und kein serverseitiges Speichern der Sprachwahl.

### Lücken gegenüber dem Vorhaben „Leichte Sprache nach DIN SPEC 33429“

**Die bestehende Einfache Sprache darf nicht in „Leichte Sprache“ umbenannt werden.**
Eine zusätzliche Fassung muss redaktionell erstellt und mit der Zielgruppe geprüft werden.
Der vollständige Normtext liegt nicht im Repository vor; dieses Audit ist eine
Lückenanalyse, keine vollständige Klauselprüfung oder DIN-Zertifizierung.

| Bereich | Beobachtung / Lücke | Notwendiger nächster Schritt |
| --- | --- | --- |
| Zielgruppe und Prüfbeteiligung | Keine dokumentierte Prüfung durch Menschen mit Lernschwierigkeiten | Prüfgruppe und redaktionell Verantwortliche benennen; Verständlichkeitsprüfung dokumentieren |
| Sprachliche Komplexität | Teilweise lange Absätze, Nebensätze und mehrere Begriffe auf einmal, z. B. Einstieg von `simple.content` der Philosophie und Vereinsgeschichte | Leichte Fassung eigenständig schreiben: kurze Sinnschritte, klare Bezüge, geeignete Wortwahl; Normtext und Prüfgruppe einbeziehen |
| Inhaltliche Orientierung | Einfache Startseite beginnt ausführlich mit Geschichte und Fachbegriffen, Besuchsinformationen kommen später | Für einfache/leichte Fassung Wichtigstes zuerst prüfen; alle notwendigen Fakten und rechtlichen Aussagen erhalten |
| Darstellung | Globale automatische Silbentrennung, `text-wrap: pretty/balance`, keine für Leichte Sprache abgestimmte redaktionelle Zeilenstruktur | Geeignete Darstellung zusammen mit der Prüfgruppe festlegen; nicht durch pauschale Worttrennung ersetzen |
| Erklärende Bilder | Bisher vor allem Vereinsfotos und Plakat; keine gezielt getesteten Verständnishilfen | Nur hilfreiche, sachlich korrekte Bilder ergänzen; Alternativtexte und Lizenzen prüfen |
| Nachvollziehbare Qualität | Kein Prüfdatum, keine dokumentierten Rückmeldungen oder Freigabe je Fassung | Redaktions-/Prüfstatus neben den Inhalten pflegen; keine unbelegte Normkonformität behaupten |
| Abdeckung | Keine leichte Fassung; Kalendertexte teilweise ohne einfache Fassung; PDFs und externe Seiten unverändert | Fehlende Fassungen sichtbar kennzeichnen, Verantwortlichkeiten und Umfang festlegen |
| Zugang | Ein gemeinsamer Headerbereich existiert, aber noch kein zentrales Einstellungsmenü und keine verlinkbare Sprachwahl | Bestehenden Controller erweitern; Standard / Einfach / Leicht als gegenseitig ausschließende Auswahl |

Auch für die Einfache Sprache nach DIN ISO 24495-1 ist eine redaktionelle Prüfung
offen: Relevanz für die Zielgruppe, Auffindbarkeit, Verständlichkeit und praktische
Nutzbarkeit lassen sich nicht mit axe bestätigen.

## 8. Umsetzungsplan für Phase 2–5

Die folgenden Punkte sind **Planung, keine Freigabe zur Umsetzung**.
Schätzungen sind Personenstunden für dieses kleine Hugo-Projekt, einschließlich
Entwicklung und technischer Prüfung, ohne Wartezeiten, rechtliche Beratung,
professionelle Übersetzung, Prüfgruppe oder externe Abnahme.

| Phase | Themenblock / vorgeschlagene Commits | Umfang | Aufwand |
| --- | --- | --- | --- |
| 2 | `fix base accessibility and contrast`; `fix focus and live updates`; `improve content semantics and navigation` | A01–A13 priorisieren: dauerhafte Textlink-Erkennung, minimale Farben, freie Fokusziele, pausierbare Bewegung/Updates, passende Sprachmarkierung/Bildbeschreibung, verständliche Kalenderdaten, zweite Navigation und Auslieferungsbereinigung | **12–20 h** |
| 3 | `unify accessibility preferences`; `add reading and display options`; `add speech controls and language variants` | Bestehende Schalter in ein zugängliches Headerpanel integrieren; Sprachwahl, rem-Größen, Kontrast, Atkinson, Abstände, Links, Bewegung, Vorlesen, Zurücksetzen. Leselineal optional gesondert entscheiden. | **24–40 h** |
| 4 | `add accessibility information and feedback` | Freiwillige Informationsseite im Footer, ehrlicher Stand/offene Inhalte, bestätigte Kontakte. Formular nur mit geklärter bestehender Server-/Mailanbindung. Keine erfundene Behörde oder Pflicht-DGS-Erklärung. | **6–12 h**, abhängig vom Formularbackend |
| 5 | `add accessibility regression tests and documentation` | DevDependencies/npm-Scripts/CI, alle Seiten und Einstellungen, Tastatur-/Fokus-/Fallback-/Medientests, Screenshots, echte Zoom- und Screenreader-Prüfschritte, Kriterienmatrix und Abschlussbericht | **12–20 h** |
| Redaktion | Separate Textfreigaben statt unbelegter automatischer Abnahme | Alle neuen/umformulierten Texte prüfen; leichte Fassungen erstellen und mit Prüfgruppe überarbeiten | **12–24 h interner Aufwand als grobe Planung**, externe Prüfgruppe separat |

Technischer Gesamtumfang: **54–92 h**, etwa 7–12 Arbeitstage à 8 Stunden,
zuzüglich Redaktion und externer Prüfungen.

### Architekturvorschlag für das gemeinsame Menü

- `preferences.js` und `preferences.html` bleiben die einzigen Einstellungs-Einstiegspunkte.
  Kein zweites Sprachsystem und keine voneinander unabhängigen Einstellungs-Controller.
- Das boolesche Sprachmodell auf `standard` / `simple` / `easy` erweitern.
  Vorhandene `simple.*`-Inhalte weiterverwenden; eine zusätzliche leichte Fassung
  erhält einen eigenen Inhaltsbereich im selben Rendering-Muster.
- Bereits gespeicherte `c3re-theme`- und `c3re-simple`-Werte verlustfrei in den
  erweiterten, versionierten Einstellungszustand übernehmen. Priorität einer
  direkt verlinkten Sprachwahl gegenüber Speicherung ausdrücklich festlegen und testen.
- Ein normalisierter Zustand setzt HTML-`data`-Attribute und CSS-Variablen.
  Dynamische Komponenten erhalten weiterhin ein gemeinsames Änderungsereignis.
- Dunkel bleibt der Standard. Für reduzierte Bewegung und stärkeren Kontrast
  Systemeinstellungen als Startwerte verwenden, soweit keine eigene Wahl vorliegt.
  `forced-colors` mit Systemfarben unterstützen, nicht durch das Farbschema aushebeln.
- Frühinitialisierung klein und vor dem ersten Rendern; Speicherung ausfallsicher.
  Ohne JavaScript bleiben Originalinhalt, Kontakt und Navigation nutzbar.
- Native Auswahl-/Bedienelemente, Escape, Fokus-Rückgabe und Statusmeldungen.
  Falls ein modaler Dialog gewählt wird: Fokus hinein, innerhalb halten, zurückgeben.
  Ein nichtmodales Panel darf keine unnötige Fokusfalle erzeugen.
- Vorlesen nur bei vorhandener Web Speech API; deutsche Stimme, klarer Start/Pause/Stopp,
  nur sichtbarer `main`-Text. Beim Sprach-/Seitenwechsel laufende Ausgabe stoppen.
  Ob eine Stimme lokal oder über den Browseranbieter arbeitet, vor einer Aussage wie
  „keine Übertragung“ prüfen; bei strikter lokaler Vorgabe nur geeignete lokale Stimmen nutzen.
- WCAG-Basisverbesserungen gelten stets. Alternative Schrift, größere Abstände,
  zusätzlicher Kontrast und alternative Texte sind bewusste Einstellungen.

### Abnahmebedingungen

1. Null bestätigte axe-Verstöße in allen vereinbarten Zuständen, einschließlich
   Hoher Kontrast, 150 % Schrift, Einfach und Leicht; `incomplete`-Befunde manuell auflösen.
2. Keine verdeckten Fokusziele bei vorwärts/rückwärts Tab und geänderter Textgröße.
3. Reflow bei 320 px, echter Zoom 200/400 %, Textabstände, Forced Colors und reduzierte
   Bewegung ohne Informations-/Funktionsverlust.
4. Bestehende einfache Inhalte, gespeicherte Auswahl, Downloads und direkte Anker
   funktionieren weiter; fehlende Fassungen sind ausdrücklich kenntlich gemacht.
5. Tests auf macOS/iOS mit VoiceOver, Windows mit NVDA und Android mit TalkBack
   tatsächlich durchführen und Ergebnisse dokumentieren.
6. Redaktionelle Freigaben, PDF-Status und gegebenenfalls rechtliche Prüfung vor
   einer öffentlichen Konformitätsaussage berücksichtigen.

## 9. Redaktionell und rechtlich zu prüfen

**Alle folgenden neu geschriebenen oder umformulierten Website-Texte aus dem
vorangegangenen Design-Commit sind „redaktionell prüfen“.** Diese Markierung ist
keine Behauptung, dass sie falsch sind; eine fachliche Freigabe liegt nicht vor.

| Textbestand | Quelle / Umfang |
| --- | --- |
| Sämtliche einfachen Seitentitel, Zusammenfassungen und Volltexte | `simple.title`, `simple.summary`, `simple.content` in allen elf Markdown-Dateien aus Abschnitt 3 |
| Einfache Navigation und Footerbeschriftungen | `config.toml`, `text.html`, `header.html`, `footer.html` |
| Einstellungen, Status- und Fehlermeldungen, Kalenderhinweise, Kopiermeldungen | `preferences.html`, `preferences.js`, `calendar.js`, `door-status.js`, Sidebar-Partials, `banner.html` |
| Neue Besuchshinweise, Archiv-/News-Beschriftungen und Alternativtexte/Bildtitel | `visit-info.html`, `news-card.html`, `archive.html`, `taxonomy.html`, Startseiten-Markdown |
| Rückblick statt veralteter Zukunftsankündigung für Codeweek 2025 | `content/codeweek.md`, beide Fassungen |
| Informationen über lokale Speicherung und Live-Abfragen | `content/datenschutz.md`, beide Fassungen; zusätzlich **rechtlich prüfen** |
| Einfache Erklärungen von Impressum, Datenschutz und Unvereinbarkeit | Entsprechende Markdown-Dateien; zusätzlich **rechtlich/inhaltlich prüfen** |
| Zukünftige Alt-Texte, Beschreibungen, Erklärungs-/Feedbacktexte und leichte Fassungen | Noch nicht erstellt; nach Freigabe einzeln in `BERICHT.md` protokollieren |

Die im Original vorhandenen Rechtsverweise TMG/RStV sowie Aussagen der
Datenschutzerklärung über IP-Adressen, Einwilligung und Datenverarbeitung sind
**rechtlich prüfen**. Das Audit ersetzt sie nicht eigenmächtig. Auch der Apple-Maps-Link
mit Hausnummer 103 gegenüber der angegebenen Adresse 101 ist redaktionell zu klären.

## 10. Offene Entscheidungen und Freigabe

Bereits entschieden: freiwilliger Rahmen, beide Feedbackkontakte, Standard-Dark.

Vor bzw. während der späteren Umsetzung zu klären:

- Wer übernimmt Redaktion und Freigabe der einfachen/leichten Texte? Welche Prüfgruppe
  prüft die Leichte Sprache?
- Sollen `/test/` und die Icon-Demo öffentlich bleiben? Ihre Entfernung ist in Phase 1
  ausdrücklich nicht erfolgt.
- Welcher vorhandene Server-/Mailweg kann ein Feedbackformular verarbeiten? Hugo
  selbst nimmt keine Formularnachrichten entgegen. Bis zur Klärung bestehen E-Mail
  und Telefon als erreichbare Kontakte.
- Wer prüft die drei PDFs? Soll zusätzlich HTML angeboten werden?
- Einbeziehung von externem Wiki, Diensten, Kalender und Codeweek-Unterseite separat
  beauftragen; sie sind nicht durch die Tests dieses Repositories abgedeckt.
- Der DIN-Volltext und eine Zielgruppenprüfung sind für eine belastbare Aussage zur
  Leichten Sprache heranzuziehen. Keine Nutzung eines Prüf-/Inclusion-Europe-Logos
  ohne erfüllte Bedingungen und passende Nutzungsrechte.
- Ein externer BITV-/WCAG-Test vor dem Livegang wird empfohlen. Die freiwillige
  Einordnung rechtfertigt keine ungeprüfte Aussage vollständiger Konformität.

### Referenzen

- [WCAG 2.2, W3C Recommendation](https://www.w3.org/TR/WCAG22/)
- [W3C: Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [W3C: Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [W3C: Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [W3C: G201, Hinweis auf neue Fenster](https://www.w3.org/WAI/WCAG22/Techniques/general/G201)
- [EN 301 549 V3.2.1, ETSI](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
- DIN SPEC 33429 und DIN ISO 24495-1 als vereinbarte redaktionelle Zielreferenzen;
  keine vollständige Normkonformität in diesem Audit bewertet.

**Hier endet Phase 1. Phase 2–5 und die Behebung der Befunde beginnen erst nach
ausdrücklicher Freigabe.**
