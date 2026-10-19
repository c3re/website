# Kopfbereich und Farbschema, 6. Oktober 2026

## Anlass und Ergebnis

Der Hell/Dunkel-Schalter wirkte im vorhandenen Entwurf losgelöst. Auch der
Übergang zwischen Navigation und LED-Banner sollte stimmiger werden.

- Ein einzelner Sonne/Mond-Knopf ersetzt die doppelte Farbschema-Pille.
  Er zeigt das angebotene Farbschema; zugänglicher Name und Tooltip wechseln mit.
  Das gewählte Schema bleibt unter dem bisherigen Schlüssel gespeichert.
- Auf dem Desktop steht der Knopf in der Navigationszeile. Bis einschließlich
  959 px stehen Logo, Farbschema und Menü in einer gemeinsamen Kopfzeile.
  CSS und `header.js` verwenden denselben Umschaltpunkt.
- Das LED-Banner ist auf 1100 px begrenzt, entsprechend der inneren Breite des
  Inhaltsbereichs. Es hat 20 px Seitenabstand, 16 px Abstand zum Header und 10 px
  Eckenradius. Der bisherige Verlauf zum Seitenhintergrund entfällt.
- Auf kleinen Geräten folgen Hilfen-Tab und Panel der tatsächlichen Headerhöhe,
  damit der Tab die Statusanzeige im verkleinerten Kopfbereich nicht verdeckt.
- Schaltflächen bleiben mindestens 44 × 44 px groß. Sichtbarer Tastaturfokus,
  dunkles Standardschema und die bisherigen Lesehilfen bleiben verfügbar.

## Prüfung

- `make check` und 11 Originaltextprüfungen bestanden.
- 56 bestehende Browserprüfungen für Interaktion, Vorlesen und Datenschutz bestanden.
- 266 axe-/Layoutprüfungen bei 320 und 1440 px bestanden, jeweils für beide
  Farbschemata, hohen Kontrast, 150 % Schrift, Leichte Sprache und kombinierte
  Hilfen. Zusätzlich bestanden die zwei Prüfungen des geöffneten Hilfen-Panels.
- Bei 320, 390, 768, 959, 960 und 1024 px: kein horizontaler Überlauf, kein
  Überdecken der Statusanzeige, passende Navigation. Enter und Leertaste schalten
  das Farbschema; Menü und Escape funktionieren auch auf Tablets.
- Der vorgemerkte Commit wurde separat ohne die übrigen offenen Änderungen
  exportiert und mit `make check` gebaut. Header und Banner dieses Stands wurden
  bei 320, 959, 960 und 1440 px in beiden Farbschemata mit axe geprüft.

Die Screenshots in diesem Ordner zeigen den gesamten lokalen Arbeitsstand mit
simulierten Kalender- und Öffnungsdaten. Sie sind kein Nachweis aktueller
Öffnungszeiten. Die offenen manuellen Barrierefreiheitsprüfungen stehen weiterhin
in `docs/barrierefreiheit/`.

## Build und Übergabestand

Der isolierte Build deckte ältere Hugo-Verweise auf. Die bereits lokal vorhandenen
Umstellungen von `languageCode` auf `locale`, `.Site.Data` auf `hugo.Data` sowie
des RSS-Sprachfelds auf `.Site.Language.Locale` wurden geprüft und übernommen.
Beide CI-Jobs verwenden dafür dieselbe lokal geprüfte Hugo-Version 0.161.1.

Die UI-Änderung wurde als `dd81abf` auf `feature/barrierefreiheit` zu
`origin/feature/barrierefreiheit` übertragen. `origin/master` und
`upstream/master` enthielten beim ersten Fetch keine neueren Basis-Commits.

Auf ausdrücklichen Folgeauftrag wurde die Demo ebenfalls aktualisiert. Dabei
wurde der gesamte geprüfte Website-Stand einschließlich der vorher vorhandenen
Datenschutz-Ergänzungen, Fundstücke, PDF-Footerlinks und Worker-Konfiguration
veröffentlicht und für GitHub gesichert. Der Menüpunkt Downloads bleibt daher
in der Demo entfernt; seine bisherige Seitenadresse ist weiterhin verfügbar.

Die aktive Cloudflare-Version ist `cc7c3731-f629-465d-a388-c8d72facd6af`.
Der Passwortschutz und die bisherigen Zugangsdaten bleiben bestehen.
