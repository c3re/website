# WCAG-Weiterarbeit und Audio: Umsetzungsbericht

Stand: **17.09.2026**, Branch `feature/barrierefreiheit`.
Rechtsrahmen: freiwilliges WCAG-2.2-AA-Ziel. Feedback wie bestätigt ausschließlich
über `kontakt@c3re.de` und `02361 / 8488096`, ohne Serverformular.

## Ergebnis

Die technischen Basisprobleme aus dem Audit wurden weiter bearbeitet und durch
eine dauerhafte Testsuite abgesichert. Die **elf bisherigen Markdown-Textkörper
bleiben unverändert** gegenüber `dd22591` (Dateiende-Whitespace ausgenommen).
Semantische Auszeichnungen und Metadaten ergänzt das Theme bei der Ausgabe.

**Keine uneingeschränkte Konformitätsbehauptung:** Tests mit echten Screenreadern,
Prüfung der Leichten Sprache durch die Zielgruppe, redaktionelle Freigaben,
PDF-Prüfungen und der Abgleich auf dem Produktionshost sind noch offen.
Ein Lighthouse-Ergebnis von 100 allein belegt keine vollständige WCAG-Konformität.

### Lokale Prüfergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| Hugo 0.156.0 und bestehende Minifizierung | `make check` erfolgreich |
| Schutz der Originaltexte | 11 Node-Tests bestanden |
| Browser-Tests | 270 bestanden, keine übersprungenen Tests |
| axe | 238 vollständige Seitenzustände plus 2 Panel-Prüfungen ohne gemeldete Verstöße |
| Zustände | Dunkel, Hell, hoher Kontrast, 150 % Schrift, Leicht/Dunkel, Leicht/Hell, Kombination aus Leicht/150 %/Kontrast/OpenDyslexic/Link-Hervorhebung |
| Breiten | Alle 17 ausgelieferten Inhalts-/Übersichts-/Fehlerseiten bei 1440 und 320 CSS-Pixeln |
| Tastatur | Vorwärts und rückwärts auf allen 17 Seiten; Skip-Link, freie Fokusziele und Panel zusätzlich geprüft |
| Live-Anzeigen | Pausieren, Fortsetzen, schnelles Umschalten bei laufender Abfrage sowie Fokus-/Detail-Erhalt beim Kalender-Refresh geprüft |
| Aufnahmen | Alle drei tatsächlichen MP3s mit Start, Pause, Stopp, Tempo und korrekter Sprachzuordnung geprüft |
| Fehlerseite | HTTP 404, geladene Assets, Lesehilfen, Skip-Link und Rückkehr zur Startseite an zwei unbekannten Adressen einschließlich verschachteltem Pfad geprüft |
| Lighthouse Accessibility | 17 Seiten mit jeweils 100/100 im normalen dunklen Modus; Statusdienste dabei kontrolliert blockiert |

Werkzeuge: `@playwright/test` 1.63.0, `@axe-core/playwright` 4.13.0,
Lighthouse 13.4.1, Chromium 153.0.8010.12. Alle npm-Pakete sind ausschließlich
`devDependencies`. Die produktive Website benötigt weiterhin nur Hugo und die
bereits vorhandene Minifizierung, keinen JavaScript-Bundler.

`axe` wird mit `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` ausgeführt.
Unvollständige automatische Prüfungen (`incomplete`) werden als Testanhang aufbewahrt,
nicht als bestanden oder als bestätigter Verstoß gezählt.

### Reproduzieren

```sh
npm ci
npx playwright install chromium
# Hugo 0.156.0 und minify müssen im PATH liegen.
npm run test:a11y
npm run audit:lighthouse
```

Die Git-Historie muss `dd22591` enthalten. Der CI-Checkout lädt dafür die vollständige
Historie. `test:a11y` baut die Website und startet seinen eigenen lokalen Testserver.
Der Testserver ist Entwicklungswerkzeug, kein neuer Produktionsdienst.

Die GitHub-Actions-Konfiguration enthält einen eigenen Accessibility-Job einschließlich
Ergebnis-Artefakten. Die oben genannten Ergebnisse stammen aus der **lokalen** Ausführung;
ein erfolgreicher GitHub-Lauf nach Push wird damit nicht vorweggenommen.

## Eingebundene Aufnahmen

| Seite / Sprachfassung | Bereitgestellte Datei | Ausgelieferte Datei | Dauer ungefähr |
| --- | --- | --- | --- |
| Startseite / normal | `Startseite-normal.mp3` | `static/audio/standard/startseite.mp3` | 87 s |
| Philosophie / normal | `Philosophie-normal.mp3` | `static/audio/standard/philosophie.mp3` | 119 s |
| Erklärung / normal | `Unvereinbarkeitserklärung-normal.mp3` | `static/audio/standard/unvereinbarkeitserklaerung.mp3` | 158 s |

Die Dateien wurden unverändert kopiert und per SHA-256 mit den Quellen verglichen.
Die Zuordnung steht in `data/audio.toml`. Kein Autoplay und kein automatischer
Rückfall auf eine Aufnahme der normalen Fassung bei aktivierter Leichter Sprache.
Die ältere Aufnahme unter `static/audio/einfache-sprache/` bleibt unverknüpft.
Ein vollständiger inhaltlicher Abgleich der neuen Aufnahmen mit den Texten ist
**redaktionell prüfen**; technische Abspielbarkeit ersetzt kein Hörlektorat.

## Bearbeitete Auditbefunde

- **A01:** Textlinks im Fließtext und Footer sind immer unterstrichen.
  „Links hervorheben“ bietet nur eine zusätzliche, abschaltbare Betonung.
- **A02:** Zwei helle Farbtokens abgedunkelt; Header-/Statushintergründe deckend.
- **A03/A09:** Fokusfreihaltung berücksichtigt Sticky-Header und Rand-Tab.
  Native Ankersprünge werden nicht nochmals nach `hashchange` ausgeführt, damit
  schnelles Weiter-Tabben nicht zurückgescrollt wird. Sprachanker bleiben zugeordnet.
- **A04:** Automatische Statuspulse enden nach vier Sekunden. Bewegungen sind
  zusätzlich abschaltbar, Betriebssystem-Vorgaben werden berücksichtigt.
  Kalender und Öffnungsstatus können pausiert werden, inklusive sichtbarer Warnung
  vor veralteten Werten und Abbruch laufender Abfragen.
- **A05/A06:** Beschreibende Bildalternativen in `data/accessibility.toml`;
  bekannte englische Passagen erhalten `lang="en"`. Das geschieht ohne Änderungen
  der bisherigen Markdown-Texte. Bildschrift bleibt ein manueller Prüfpunkt.
- **A07:** Zustände und Fokus bleiben bei erzwungenen Systemfarben erkennbar.
  Der aktive Schalterknopf hat auch im normalen dunklen Design ausreichenden Kontrast.
- **A08:** Verlinkte HTML-Seitenübersicht als zweiter Navigationsweg.
- **A10:** Kalenderdatum als echter Text innerhalb von `time`; kein unzuverlässiges
  `aria-label` am Datum. Beschreibungen über native, tastaturbedienbare `details`.
  Fokus und geöffnete Beschreibungen bleiben beim Refresh erhalten.
- **A11:** Die Icon-Demo liegt jetzt unter `themes/hugo-theme-flat/examples/`
  und wird nicht mehr als öffentliche Seite ausgeliefert.
- **A12/A13:** Externe Links öffnen standardmäßig im selben Tab. Explizit gewünschte
  neue Tabs bekommen einen zugänglichen Hinweis. PDF-Links nennen Typ und berechnete Größe.
- **A14/A15/A16:** Sprachwahl mit direktem Fragment-Link, sichtbarer Hinweis bei
  fehlender Fassung, aussagekräftige Titel für News-/Themenübersichten und getestete
  Schriftvergrößerung. Der normale News-Titel wird im Template ergänzt, weil das
  ursprüngliche Frontmatter dort einen leeren Titel enthält.

Hinzugekommen sind `/barrierefreiheit/`, `/seitenuebersicht/` und eine eigene
`404.html`. Ob der Zielhost die Fehlerseite tatsächlich mit HTTP 404 verwendet,
muss beim Deployment geprüft werden.

### Abschlussprüfung der Fehlerseite

- **Symptom:** Unter `/missing/nested/page/` fehlten Gestaltung und Skripte;
  „Zur Startseite“ zeigte wieder auf die unbekannte Adresse.
- **Ursache:** `relativeURLs = true` machte die Links der statischen `404.html`
  vom angefragten Verzeichnis abhängig. Ein Test nur unter `/404.html` übersah das.
- **Korrektur:** `config.toml` verwendet jetzt `relativeURLs = false` für Pfade
  ab Website-Wurzel. Der Testserver liefert bei unbekannten HTML-Adressen die
  tatsächliche Fehlerseite mit Status 404 aus.
- **Regression:** Beide Fälle in `tests/browser/not-found.spec.mjs` scheiterten
  vor der Korrektur und bestanden danach. Auch der vollständige Lauf mit 270
  Browser-Tests und der Lighthouse-Lauf mit 17 Seiten bestanden anschließend.
- **Browsernachweis:** Nach Neustart der lokalen Hugo-Vorschau funktionierten
  Darstellung, Lesehilfen und Rücklinks auch am verschachtelten Fehlerpfad.
  Die Konsole meldete nur den erwarteten HTTP-404-Status des Hauptdokuments.
- **Status:** technisch behoben; die Einbindung als Fehlerseite auf dem Zielhost
  bleibt beim Deployment zu prüfen.

## Farben: Änderungen und Kontraste

sRGB-Kontrastberechnung nach WCAG. Werte gerundet; die jeweilige Schwelle wird mit
ungerundeten Werten bewertet. Markenlayout, Abstände und Logo wurden beibehalten.

| Anwendung | Vorher → nachher | Kontrast vorher → nachher |
| --- | --- | --- |
| Heller gedämpfter Text auf Footer `#e3e3e1` | `#6f6a66` → `#696460` | 4,16:1 → 4,55:1 |
| Heller Footerlink auf `#e3e3e1` | `#1f7a3d` → `#1d743a` | 4,18:1 → 4,52:1 |
| Dunkler Header, gedämpfter Text, ungünstig über Weiß | `rgba(32,33,36,.92)` → `#202124` | 4,09:1 → 5,20:1 |
| Heller Header über Schwarz, einschließlich korrigierter Textfarbe | `rgba(235,235,235,.92)` → `#ebebeb` | 3,76:1 → 4,90:1 |
| Aktiver Schalterknopf auf dunklem Mint-Track `#62de9e` | `#fff` → `#202124` | 1,69:1 → 9,55:1 |
| Aktiver Schalterknopf im hellen Modus | `#fff` → `#ebebeb` auf `#1d743a` | danach 4,88:1 |

Die beiden Header-Tokens werden auch für Statusflächen verwendet. So hängen deren
Kontraste nicht mehr von der darunterliegenden Banneraufnahme ab. Der optionale
Kontrastmodus behält die gelb-schwarze Handoff-Palette; beispielsweise erreicht
`#e6e6e6` auf `#111` 15,13:1 und `#ffe14d` auf `#111` 14,50:1.

## Status je WCAG-2.2-Kriterium (A und AA)

Die Matrix beschreibt den geprüften **HTML-Website-Umfang**, keine Zertifizierung.
„Erfüllt“ bedeutet: Umsetzung und vorhandene technische Nachweise stützen das
Kriterium im beschriebenen Umfang. „Teilweise“ bedeutet: Umsetzung vorhanden,
aber ein wesentlicher Inhalts-/Geräte-/Hilfstechnologie-Nachweis fehlt.
Die PDF-Dokumente und externe Websites sind nicht darin freigeprüft.

| Kriterium | Stufe | Status | Nachweis / verbleibende Grenze |
| --- | --- | --- | --- |
| 1.1.1 Nicht-Text-Inhalte | A | teilweise | HTML-Alternativen ergänzt; inhaltliche Bild-/PDF-Prüfung offen |
| 1.2.1 Reine Audio-/Videoinhalte | A | teilweise | Originaltexte zu den drei Aufnahmen vorhanden; vollständiger Hör-/Textabgleich offen |
| 1.2.2 Untertitel, aufgezeichnet | A | nicht anwendbar | Keine Videos |
| 1.2.3 Audiodeskription oder Medienalternative | A | nicht anwendbar | Keine synchronisierten Videos |
| 1.2.4 Untertitel, live | AA | nicht anwendbar | Kein Live-Video |
| 1.2.5 Audiodeskription, aufgezeichnet | AA | nicht anwendbar | Keine Videos |
| 1.3.1 Informationen und Beziehungen | A | erfüllt | Landmarks, Überschriften, Listen, native Details und Textdatum; HTML geprüft |
| 1.3.2 Bedeutungstragende Reihenfolge | A | erfüllt | Logische DOM-Reihenfolge, keine rein visuell umsortierten Inhalte |
| 1.3.3 Sensorische Eigenschaften | A | erfüllt | Beschriftete Bedienelemente, keine ausschließlich farb-/positionsgebundenen Anweisungen |
| 1.3.4 Ausrichtung | AA | erfüllt | Keine Ausrichtungssperre; flexibles Layout |
| 1.3.5 Eingabezweck bestimmen | AA | nicht anwendbar | Keine persönlichen Eingabefelder; E-Mail/Telefon statt Formular bestätigt |
| 1.4.1 Benutzung von Farbe | A | erfüllt | Dauerhafte Link-Unterstreichung, textliche Zustände und sichtbare Schalterpositionen |
| 1.4.2 Audiosteuerung | A | erfüllt | Kein Autoplay; Pause und Stopp erreichbar |
| 1.4.3 Kontrast, Minimum | AA | erfüllt | Korrigierte Tokens, deckende Statusflächen, axe-Matrix ohne Kontrastverstöße |
| 1.4.4 Textgröße ändern | AA | teilweise | 150-%-Modus getestet; echte Browser-Zoom-/Textzoom-Prüfung auf Zielgeräten offen |
| 1.4.5 Schriftgrafiken | AA | teilweise | Plakattext als Alternative; Bewertung der Bildschrift und ihrer Ausnahmen manuell offen |
| 1.4.10 Umbruch | AA | erfüllt | Alle 17 Seiten bei 320 CSS-Pixeln in sieben Zuständen ohne Seitenüberlauf |
| 1.4.11 Nicht-Text-Kontrast | AA | teilweise | Schalter/Fokus verbessert und Forced Colors technisch geprüft; vollständige visuelle Geräteprüfung offen |
| 1.4.12 Textabstände | AA | teilweise | Kontaktseite und Panel mit erhöhten Abständen ohne gemessenen horizontalen Überlauf; vollständige Prüfung auf Abschneidung/Überlagerung offen |
| 1.4.13 Inhalt bei Hover/Fokus | AA | erfüllt | Keine überdeckenden eigenen Hover-Tooltips; reservierte Überschriftenanker und native Browserhinweise |
| 2.1.1 Tastatur | A | erfüllt | Navigation, Lesehilfen, Kalenderdetails, Kopieren und Audio getestet |
| 2.1.2 Keine Tastaturfalle | A | erfüllt | Vorwärts-/Rückwärtslauf und nichtmodales Panel mit Escape |
| 2.1.4 Zeichentasten-Kurzbefehle | A | nicht anwendbar | Keine eigenen Ein-Zeichen-Kurzbefehle |
| 2.2.1 Zeiteinteilung anpassbar | A | nicht anwendbar | Keine zeitbegrenzte Nutzereingabe; API-Timeouts sind keine Eingabefristen |
| 2.2.2 Pausieren, beenden, ausblenden | A | erfüllt | Begrenzte Pulse, Motion-Schalter, pausierbare Live-Anzeigen und stoppbare Wiedergabe |
| 2.3.1 Dreimaliges Blitzen / Grenzwerte | A | teilweise | Kleine, kurze Logoanimation und abschaltbare Bewegung; abschließende visuelle Grenzwertprüfung bei Zoom offen |
| 2.4.1 Blöcke umgehen | A | erfüllt | Skip-Link zuerst, Fokus gelangt in das einzige Main |
| 2.4.2 Seite mit Titel | A | erfüllt | Individuelle Server-/Clienttitel einschließlich News, Themen und Fehlerseite |
| 2.4.3 Fokusreihenfolge | A | erfüllt | Barrierefreiheits-Tab vor dem Hauptinhalt; Tests vorwärts/rückwärts |
| 2.4.4 Linkzweck im Kontext | A | erfüllt | Aussagekräftige Namen im Kontext, PDF-Metadaten und normalisierter DI-Day-Link |
| 2.4.5 Verschiedene Möglichkeiten | AA | erfüllt | Navigation plus verlinkte HTML-Seitenübersicht |
| 2.4.6 Überschriften und Beschriftungen | AA | erfüllt | Eindeutige UI-Beschriftungen, sichtbares H1 und nachvollziehbare Hierarchie |
| 2.4.7 Fokus sichtbar | AA | erfüllt | Kontrastierender Fokusrahmen und Tastaturtests |
| 2.4.11 Fokus nicht verdeckt, Minimum | AA | erfüllt | Header-/Rand-Tab-Kollisionen behandelt, schnelle Anker-/Tab-Abfolge als Regression geprüft |
| 2.5.1 Zeigergesten | A | nicht anwendbar | Keine eigenen Mehrpunkt-/Pfadgesten |
| 2.5.2 Zeigerabbruch | A | erfüllt | Native Klickaktionen, keine Auslösung auf Pointer-down |
| 2.5.3 Beschriftung im Namen | A | erfüllt | Sichtbare Namen und zugängliche Namen stimmen überein; Symbole haben Funktionsnamen |
| 2.5.4 Bewegungsaktivierung | A | nicht anwendbar | Keine Gerätebewegungssteuerung |
| 2.5.7 Ziehbewegungen | AA | nicht anwendbar | Keine Drag-only-Funktionen |
| 2.5.8 Zielgröße, Minimum | AA | erfüllt | axe-Prüfung der Zielgrößen; Hauptschalter mindestens 44 px, Audio-/Größenbuttons mindestens 32/36 px |
| 3.1.1 Sprache der Seite | A | erfüllt | `lang="de"`; fremde Icon-Demo nicht mehr ausgeliefert |
| 3.1.2 Sprache von Teilen | AA | teilweise | Bekannte englische Aussagen und Kalender-Motto markiert; zukünftige externe Kalendertexte redaktionell prüfen |
| 3.2.1 Bei Fokus | A | erfüllt | Fokus allein löst keine Navigation oder Wiedergabe aus |
| 3.2.2 Bei Eingabe | A | erfüllt | Vorhersehbare ausdrücklich gewählte Einstellungen, keine automatischen Formularaktionen |
| 3.2.3 Konsistente Navigation | AA | erfüllt | Gemeinsamer Header/Footer auf allen Seiten |
| 3.2.4 Konsistente Erkennung | AA | erfüllt | Gemeinsame Komponenten und Beschriftungen |
| 3.2.6 Konsistente Hilfe | A | erfüllt | Kontakt in Sidebar/Footer sowie eigene Barrierefreiheitsseite |
| 3.3.1 Fehlerkennzeichnung | A | nicht anwendbar | Keine zu validierende Formulareingabe; Medien-/Netzfehler als Statusmeldungen behandelt |
| 3.3.2 Beschriftungen / Anweisungen | A | erfüllt | Einstellungen, Schriftgrößen und Audioaktionen beschriftet |
| 3.3.3 Vorschlag bei Fehler | AA | nicht anwendbar | Keine frei einzugebenden Formularwerte |
| 3.3.4 Fehlervermeidung, rechtlich/finanziell/Daten | AA | nicht anwendbar | Keine entsprechenden Transaktionen |
| 3.3.7 Redundante Eingabe | A | nicht anwendbar | Keine mehrstufige Datenerfassung |
| 3.3.8 Zugängliche Authentifizierung, Minimum | AA | nicht anwendbar | Kein Login, keine CAPTCHA |
| 4.1.2 Name, Rolle, Wert | A | teilweise | Native Controls/ARIA und Zustände technisch geprüft; praktische Screenreader-Bestätigung offen |
| 4.1.3 Statusmeldungen | AA | teilweise | Live-Regionen für Bedien-/Fehler-/Kopiermeldungen; tatsächliches Ansageverhalten mit Screenreadern noch prüfen |

Das frühere Kriterium 4.1.1 wurde aus WCAG 2.2 entfernt. Für eine gesonderte Bewertung
nach älteren Fassungen bzw. EN 301 549 bleibt die HTML-Prüfung trotzdem relevant;
doppelte IDs werden in der Testsuite ausdrücklich ausgeschlossen.

## Redaktionell und rechtlich prüfen

Die folgenden neuen oder umformulierten Angaben sind keine bereits extern freigegebenen Texte:

| Bestand | Kennzeichnung / Quelle |
| --- | --- |
| Neue Seite „Barrierefreiheit“, normale und leichte Fassung | **Redaktionell und rechtlich prüfen**, sichtbar als Entwurf; `content/barrierefreiheit.md` |
| Bildalternativen einschließlich DI-Day-Plakat | **Redaktionell prüfen**, `data/accessibility.toml` |
| Neue UI-Texte zu Bewegungen, Links, Live-Pause, Kalenderdetails und Meldungen | **Redaktionell prüfen**, Partials und `preferences.js` / `calendar.js` |
| Seitenübersicht, Fehlerseite und generierte Übersichtstitel | **Redaktionell prüfen**, neue Templates und `page-title.html` |
| Größe und Typ der PDF-Links | Aus tatsächlicher Datei berechnet; Bezeichnungen **redaktionell prüfen** |
| Bestehende Leichte-Sprache-Entwürfe | Weiterhin **redaktionell und durch Prüfgruppe prüfen**; in dieser Arbeitsrunde nicht inhaltlich erweitert |
| Aufnahmen und Textgleichheit | **Redaktionell prüfen**; Audioquellen unverändert übernommen |

Die elf bisherigen Textkörper wurden nicht neu formuliert. Englische `lang`-Markierungen,
die Überschriftenebenen und die Ergänzung leerer Übersichtstitel erfolgen im Theme.
Die als `di.day` ohne Schema gespeicherte Zieladresse wird beim Rendern zu `https://di.day`.
Die bestehenden rechtlichen Texte bleiben unverändert; keine neue rechtliche Vollständigkeit
wird daraus abgeleitet.

## Offene externe Prüfungen

- Praktische Prüfungen mit VoiceOver (macOS/iOS), NVDA und TalkBack anhand
  [MANUELLE-PRUEFUNG.md](MANUELLE-PRUEFUNG.md).
- Browser-Zoom 200/400 %, reine Textvergrößerung, reale Kontrastdesigns und mobile
  Ausrichtungen auf den Zielgeräten. Die automatisierten 320-px-Prüfungen sind
  kein vorgetäuschter Hardware-/Screenreader-Test.
- Prüfung der Leichten Sprache durch eine geeignete Prüfgruppe, Abgleich von
  Bildbeschreibungen und Aufnahmen sowie rechtliche Freigabe neuer Angaben.
- Separate Prüfung von `Satzung.pdf`, `Beitragsordnung.pdf` und
  `Unvereinbarkeitserklärung.pdf`; keine PDF/UA- oder sonstige Konformität behauptet.
- Weitere Aufnahmen, Prüfung externer Websites und Konfiguration der produktiven
  Fehlerseite. Ein Serverformular wurde zugunsten von E-Mail/Telefon ausdrücklich abgewählt.

**Empfehlung:** vor einer öffentlichen Konformitätsaussage und vor dem Livegang
einen unabhängigen BITV-/WCAG-Test beauftragen. Das freiwillige Ziel ersetzt weder
die Inhaltsprüfung noch gegebenenfalls einschlägige rechtliche Pflichten.

## Nachweise

- Historisches Audit: [AUDIT.md](AUDIT.md)
- Technische Bedien-/Integrationshinweise: [UMSETZUNG.md](UMSETZUNG.md)
- Vorher-/Nachher-Bilder: [screenshots/README.md](screenshots/README.md)
- Aktuelle generierte Berichte: `test-results/results.json` und
  `a11y-reports/lighthouse/summary.json`; GitHub Actions archiviert sie bei späteren Läufen.
