# Technischer Betrieb ohne Cookie-Banner

Verbindliche Produktvorgabe: Die Website soll keine einwilligungspflichtigen
Tracking- oder Komfortdienste voraussetzen. Ein Cookie-Banner ist deshalb nicht
Teil der Website. Es wird keine Einwilligung durch bloße Nutzung fingiert.

## Technische Regeln

- Kein Setzen oder Auslesen von Cookies durch das Frontend; keine Besucherkennung,
  Werbepixel, Verhaltensanalyse, Fingerprinting oder Session-Replays.
- Schriften, Bilder, Icons, Skripte und Aufnahmen kommen vom Website-Host.
  Audio wird erst nach Start angefordert. Karten und soziale Netzwerke sind Links,
  keine eingebetteten Widgets, Kartenkacheln, Videos oder Skripte.
- Content Security Policy im HTML begrenzt Ressourcen auf den eigenen Ursprung.
  Die einzigen zusätzlichen Verbindungsziele sind `https://spaceapi.c3re.de` und
  `https://ical2json.c3re.de`. Fremde Frames und Plugins sind gesperrt. Lokale
  Inline-Skripte/-Stile bleiben für die vorhandenen Hugo-/Diagramm-Komponenten erlaubt;
  dies ist eine Ressourcenbegrenzung, kein umfassender XSS-Schutz.
- `no-referrer` verhindert die Weitergabe der Seitenadresse in Referrer-Headern.
- Die beiden öffentlichen Live-Abfragen verwenden `credentials: "omit"` und
  `referrerPolicy: "no-referrer"`. Sie senden keine Cookies/HTTP-Anmeldedaten und
  berücksichtigen keine `Set-Cookie`-Antworten. Die IP-Adresse ist beim Abruf
  technisch erforderlich; eine zusätzliche Verbindung ist nicht automatisch Tracking.
- Die Abfragen sind pausierbar. Öffnungsstatus wird etwa alle 30 Sekunden,
  der Kalender etwa alle 15 Minuten aktualisiert. Keine Übertragung lokaler Einstellungen.

## Zweckgebundene Darstellungseinstellungen

Nur das aktive Bedienen der Darstellungsschalter schreibt den gewählten Wert in
Local Storage. Ein frischer Seitenaufruf schreibt weder Local noch Session Storage.
Das gilt auch für Links mit `#sprache=leicht` oder `#easy-…`: Diese wählen nur die
Darstellung dieser Seite und überschreiben keine dauerhaft gewählte Sprache.

| Schlüssel | Gespeicherter Wert / ausdrücklich gewählte Funktion |
| --- | --- |
| `c3re-theme` | `dark` / `light`, Farbschema |
| `c3re-lang` | `std` / `leicht`, Textfassung |
| `c3re-fs` | `100` / `125` / `150`, Schriftgröße |
| `c3re-contrast` | `0` / `1`, Kontrast |
| `c3re-font` | `std` / `dys`, Leseschrift |
| `c3re-motion` | `0` / `1`, Bewegung |
| `c3re-links` | `0` / `1`, zusätzliche Link-Hervorhebung |
| `c3re-live-paused` | `0` / `1`, Pause der Live-Anzeigen |

Es gibt keine IDs, Zeitstempel oder Besuchsverläufe. Die Werte dienen ausschließlich
der Wiederherstellung der aktiv gewünschten Darstellung, auch auf Unterseiten und
bei späteren Besuchen. Sie bleiben bis zur Änderung, zum Zurücksetzen oder Löschen
der Website-Daten gespeichert. „Zurücksetzen“ entfernt die Lesehilfen und den alten
Schlüssel `c3re-simple`, behält aber das ausdrücklich gewählte Farbschema.
Blockierter Browserspeicher verhindert die Benutzung der Website nicht.

Die technische Gestaltung zielt auf die Ausnahme für einen ausdrücklich gewünschten
Dienst nach [§ 25 Abs. 2 Nr. 2 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html).
**Local Storage ist kein Ausweg aus § 25:** Auch dafür müssen Zweck und Erforderlichkeit
einschließlich der Speicherung über mehrere Besuche tragfähig sein. „First Party“ oder
„keine personenbezogenen Daten“ allein begründen keine Ausnahme. Eine verbindliche
rechtliche Freigabe wird durch diese technische Dokumentation nicht ersetzt.

## Informationen für Besucher

Das Panel verlinkt auf eine Ergänzung unter `/datenschutz/#technische-hinweise`.
`privacy-notes.html` ergänzt normale und leichte Fassung, ohne den ursprünglichen
Markdown-Textkörper zu überschreiben. Die leichte Ergänzung ist ebenfalls ein Entwurf.

Der bisherige Datenschutztext braucht eine gesonderte redaktionelle/rechtliche
Überarbeitung: Die Aussage, IP-haltige Protokolle könnten keiner Person zugeordnet
werden, und die pauschale Einverständniserklärung durch Nutzung sind keine Grundlage
für den neuen Betrieb. Hosting, tatsächliche Log-Zwecke, Rechtsgrundlagen, Empfänger
und Aufbewahrungsfristen müssen anhand des realen Betriebs konkretisiert werden.
Die technische Ergänzung ersetzt diese Prüfung nicht.

## Voraussetzung auf dem Produktionshost

Ein Hugo-Repository kann Einstellungen des Webservers, Reverse Proxys oder CDN
nicht garantieren. Vor Veröffentlichung müssen dort folgende Bedingungen gelten:

- Keine nachträglich eingefügten Analyse-Skripte, Tag-Manager, Werbe-Widgets,
  Tracking-Cookies, Sitzungskennungen oder Tracking-Weiterleitungen.
- HTML-, Asset- und Audioantworten setzen keine nicht erforderlichen Cookies.
  Auch Redirects und mögliche Cookies anderer c3RE-Subdomains mit `Domain=c3re.de`
  prüfen. Solche vorhandenen Domain-Cookies kann dieses Frontend nicht verhindern.
- Betreiber, Protokollierung und Datenschutzbedingungen der beiden Statusdienste
  verifizieren. Ein gemeinsamer Domainname ist kein Betreibernachweis.
- Hosting-/Access-Logs zweckgebunden, sparsam und mit festgelegter Löschfrist betreiben.
  Cookie-Einwilligung und DSGVO-Anforderungen an Serverprotokolle sind getrennte Fragen.

## Regressionstests

`tests/browser/privacy.spec.mjs` prüft alle ausgelieferten HTML-Seiten auf unzulässige
automatische Ursprünge, Cookies, Speicher-Schreibzugriffe und eingebettete Frames.
Die Seitenliste wird automatisch aus den HTML-Dateien des fertigen Builds ermittelt.
Zusätzliche Tests prüfen Sprachlinks, aktiv gewählte Einstellungen, Reset, die
Abfrageoptionen einschließlich simulierter Antwort-Cookies sowie CSP-Sperren.
Externe Live-Dienste werden dabei simuliert; das ist kein Nachweis ihrer produktiven
Antwortheader oder des produktiven Hosting-Verhaltens.

```sh
npm run test:a11y
# Gezielt nach einem Build:
npx playwright test tests/browser/privacy.spec.mjs --reporter=list
```

Auch spätere Easter Eggs müssen lokal und ohne Identifikatoren, zusätzliche
Speicherung, Tracking oder externe Einbettungen funktionieren.
Die umgesetzten Fundstücke sind in [EASTER-EGGS.md](EASTER-EGGS.md) beschrieben;
Terminalzustände bleiben nur im Arbeitsspeicher der geöffneten Seite.
