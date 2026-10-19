# Aktueller Umsetzungsstand

Dieser Stand umfasst die nach dem Phase-1-Audit beauftragten Design-Anpassungen
und die am 17.09.2026 freigegebene WCAG-Weiterarbeit. Er ersetzt keine vollständige
WCAG-Abnahme. Die Kriterienmatrix und Prüfergebnisse stehen in [BERICHT.md](BERICHT.md).

## Verbindliche Vorgaben

- Menü und Barrierefreiheitsfunktionen aus `design_handoff_c3re_website/`,
  Variante 1c mit Vorlese-Leiste aus 1a, im vorhandenen Hugo-Theme umgesetzt.
- Das neue Logo bleibt proportional 60 px breit. Der Signalfehler-Effekt läuft
  kurz beim Laden; reduzierte Bewegung wird berücksichtigt.
- Dunkel bleibt nach erneuter ausdrücklicher Bestätigung der Standard.
  Eine gespeicherte manuelle Auswahl hat Vorrang, nicht die Systemeinstellung.
- Die normale Textfassung stammt wieder aus dem ursprünglichen Stand `33278b4`.
  Nur eine getrennte Leichte-Sprache-Fassung wird ergänzt.
- Keine Browserstimme: Vorlesen verwendet die freigegebenen Audiodateien.
  Die bereits vorhandene Aufnahme unter `static/audio/einfache-sprache/` bleibt
  auf ausdrücklichen Wunsch unverknüpft.

## Umgesetzt

- Kompakter Header beim Scrollen und stabile Menüpositionen beim Sprachwechsel.
- Hell-/Dunkel-Schalter im Header; mobiler Menübutton mit Tastaturbedienung.
- Schwebender Barrierefreiheits-Tab am rechten Rand mit Zähler aktiver Hilfen.
- Leichte Sprache, Schriftgröße 100/125/150 %, hoher Kontrast und OpenDyslexic.
- OpenDyslexic lokal unter `static/fonts/`, einschließlich Herkunfts- und Lizenznachweis.
- Zurücksetzen der vier Lesehilfen, Escape und Fokus-Rückgabe am Panel.
- Nur der Banner zeigt den Türstatus, Zeitpunkt und Temperatur; Details bleiben
  in 9-px-Terminalschrift. Das separate Sidebar-Widget ist entfernt.
- Audio-Leiste unter der Navigation mit Pause/Fortsetzen, Stopp, Zeit/Fortschritt
  und Geschwindigkeit 0,8× / 1× / 1,25×. Sichtbar erst bei gestarteter Wiedergabe.
- Ohne zugeordnete Aufnahme ist „Seite vorlesen“ deaktiviert und nennt den Grund.
- Dauerhaft unterstrichene Textlinks, korrigierte helle Kontraste und deckende
  Header-/Statusflächen schützen die Lesbarkeit unabhängig von Hintergrundbildern.
- „Weitere Hilfen“ bietet abschaltbare Animationen, zusätzliche Link-Hervorhebung
  und pausierbare Live-Anzeigen. Eine Pause wird sichtbar als solche gekennzeichnet.
- Kalenderdetails sind per Tastatur zugänglich; Fokus und geöffnete Details bleiben
  bei einer Aktualisierung erhalten. Vollständige Datumsangaben sind als Text vorhanden.
- Neue Seitenübersicht, Barrierefreiheitsinformationen und eine eigene Fehlerseite.
- URLs ab Website-Wurzel erhalten Gestaltung und Rücklinks der Fehlerseite auch
  unter verschachtelten unbekannten Adressen; dafür bestehen Regressionstests.
- Dauerhafte Node-, Playwright-, axe- und Lighthouse-Prüfungen mit GitHub-Actions-Anbindung.
- Lokale Easter Eggs: Terminal, Teekanne, `/dev/null/`, Keksrezept
  und Quelltext-Kommentar ganz am Anfang, einschließlich des minifizierten Builds.
  Bedienung und Hosting-Vorlage stehen in [EASTER-EGGS.md](../EASTER-EGGS.md).
- „Downloads“ ist aus dem Hauptmenü entfernt. Satzung, Beitragsordnung und
  Unvereinbarkeitserklärung sind im Footer direkt mit Dateityp und Größe verlinkt.
  `pdf-meta.html` berechnet diese Angaben gemeinsam für Footer- und Markdown-Links.

## Texte und Sprachvarianten

Alle elf Markdown-Dateien enthalten den unveränderten normalen Text und einen
zusätzlichen `easy`-Block im Frontmatter. Die zwischenzeitlichen `simple`-Blöcke
wurden entfernt. Der Vergleich aller normalen Textkörper gegen `33278b4` besteht,
wobei Leerzeichen/Zeilenumbrüche am Dateiende beim automatischen Vergleich
ausgenommen sind. Veraltete Aussagen und historische Links wurden dabei nicht
eigenmächtig redaktionell korrigiert.

`easy.title`, `easy.summary` und `easy.content` sind **redaktionell prüfen**.
Die Fassungen sind als Entwürfe gekennzeichnet und noch nicht durch eine Prüfgruppe
geprüft. Es wird keine DIN-konforme oder zertifizierte Leichte Sprache behauptet.
Die normale Fassung erhält keine aus den Vereinfachungen übernommenen Erklärungen.
Für den ausdrücklich gewünschten Betrieb ohne Cookie-Banner ergänzt das Theme
separate technische Datenschutzhinweise; der ursprüngliche Markdown-Textkörper bleibt erhalten.

Gemeinsame Texte stehen in `partials/text.html`, ganze Seitenfassungen in
`partials/content-variants.html`. `data-language="standard|easy"` steuert die
Sichtbarkeit. Die inaktive Fassung wird für assistive Technik ausgeblendet.
Im Menü reservieren unsichtbare Textvarianten die nötige Breite, ohne als zusätzliche
Beschriftung im Accessibility Tree zu erscheinen.

Der Sprachzustand kann als Fragment geteilt werden, etwa `/#sprache=leicht` oder
`/kontakt/#sprache=leicht&abschnitt=anreise`. Fragmente werden nicht an den Server
übertragen. Abschnittsanker bekommen in der leichten Fassung das Präfix `easy-`.
Das Öffnen solcher Links speichert keine Sprachwahl und überschreibt keine
ausdrücklich gespeicherte Einstellung.

## Lokale Einstellungen

Ein Controller in `static/js/preferences.js` verwaltet folgende Keys:

| Key | Werte |
| --- | --- |
| `c3re-theme` | `dark`, `light` |
| `c3re-lang` | `std`, `leicht` |
| `c3re-fs` | `100`, `125`, `150` |
| `c3re-contrast` | `0`, `1` |
| `c3re-font` | `std`, `dys` |
| `c3re-motion` | `0`, `1`; ohne gespeicherte Wahl zählt die Systemeinstellung |
| `c3re-links` | `0`, `1` |
| `c3re-live-paused` | `0`, `1` |

Die alte Auswahl `c3re-simple=1` wird nur übernommen, wenn noch kein `c3re-lang`
vorhanden ist. Speicherzugriffe sind mit `try/catch` abgesichert. Reset setzt die
Lesehilfen zurück, löscht ihre gespeicherten Schlüssel einschließlich `c3re-simple`
und behält das ausdrücklich gewählte Farbschema bei. Kontrast und
Bewegung orientieren sich danach wieder an den Systemeinstellungen; die ausdrückliche
Dark-Standardvorgabe bleibt davon unabhängig.
Ohne JavaScript sind Originaltexte und Navigation weiterhin benutzbar.

Nur die aktive Auswahl eines Bedienelements schreibt dessen Wert. Frische
Seitenaufrufe schreiben keine Browserdaten. Die technischen Voraussetzungen für
den Betrieb ohne Cookie-Banner stehen in [DATENSCHUTZ-TECHNIK.md](../DATENSCHUTZ-TECHNIK.md).

## Zugeordnete Audiodateien

Die drei neu freigegebenen Aufnahmen sind in der normalen Sprachfassung verfügbar:

| Seite | Datei | Ungefähre Dauer |
| --- | --- | --- |
| Startseite | `static/audio/standard/startseite.mp3` | 1:27 |
| Philosophie | `static/audio/standard/philosophie.mp3` | 1:59 |
| Unvereinbarkeitserklärung | `static/audio/standard/unvereinbarkeitserklaerung.mp3` | 2:38 |

Die Kopien stimmen per SHA-256 mit den bereitgestellten Dateien überein.
Start, Pause und Stopp wurden mit allen drei tatsächlichen Aufnahmen geprüft.
Für Leichte Sprache werden diese normalen Aufnahmen nicht verwendet.

### Weitere Audiodateien zuordnen

1. Die freigegebenen Dateien unter `static/audio/` ablegen.
2. In `data/audio.toml` die jeweilige Seiten-URL und Sprachfassung zuordnen:

```toml
[pages."/"]
standard = "/audio/startseite.mp3"
easy = "/audio/startseite-leicht.mp3"
```

Die Pfade sind ein **Konfigurationsbeispiel**, keine vorhandenen Aufnahmen.
Fehlt eine Zuordnung, bleibt Vorlesen für diese Sprachfassung deaktiviert.
Es gibt keinen automatischen Rückfall auf die Aufnahme einer anderen Sprachfassung.
Aufnahmen müssen zum freigegebenen Inhalt passen.

Es wird erst nach dem Start geladen. Nur Dateien derselben Website werden akzeptiert.
Sprach- und Seitenwechsel stoppen die Wiedergabe; die Audio-Leiste bleibt bei Pause
bedienbar und verschwindet beim Beenden.

## Prüfungen

Die dauerhafte Testsuite liegt unter `tests/`:

```sh
npm ci
npx playwright install chromium
npm run test:a11y
npm run audit:lighthouse
```

Voraussetzungen sind Hugo 0.156.0, `minify`, Node.js 22 und die vollständige
Git-Historie für den Originaltextvergleich gegen `33278b4`. `npm run test:a11y`
baut selbst und startet den lokalen Testserver.

Geprüft werden alle ausgelieferten HTML-Seiten, beide Sprachfassungen, beide Themes,
hoher Kontrast, 150 % Schrift sowie eine kombinierte Einstellung bei 320 und 1440 px.
Hinzu kommen Tastatur-, Audio-, Fokus-, Textabstands-, Storage- und Live-Pausenprüfungen
sowie Prüfungen auf passive Speicherung, Cookies und unerlaubte externe Ressourcen.
Aktuelle Zahlen und Grenzen stehen in [BERICHT.md](BERICHT.md).

## Weiter offen

- Die in `BERICHT.md` benannten manuellen und inhaltlichen Prüfungen; keine vollständige
  WCAG-2.2-AA-Konformitätsaussage allein aufgrund automatisierter Tests.
- Redaktionelle und gegebenenfalls rechtliche Prüfung der Leichte-Sprache-Entwürfe,
  insbesondere Impressum und Datenschutz; Prüfung durch die Zielgruppe.
- Weitere passende Audiodateien für die übrigen Seiten und Leichte Sprache.
- PDF-Prüfung sowie reale Screenreader- und Browser-Zoom-Tests. Die CI ist konfiguriert,
  muss nach einem späteren Push auch auf GitHub durchlaufen.
- Redaktionelle/rechtliche Freigabe der ergänzten technischen Datenschutzhinweise
  sowie Abgleich des ursprünglichen Datenschutztextes mit dem tatsächlichen Hosting.
  Bedingungen und bekannte Alttext-Probleme stehen in `docs/DATENSCHUTZ-TECHNIK.md`.

**Redaktionell prüfen:** alle neuen Leichte-Sprache-Texte, die Panelbeschriftungen,
Hinweise zu fehlenden Aufnahmen und Statusmeldungen. `privacy-notes.html` ergänzt
die Datenschutzerklärung um Speicherung, lokale Ressourcen und Live-Abfragen in
beiden Sprachfassungen, ohne den Original-Seitentext umzuschreiben.
