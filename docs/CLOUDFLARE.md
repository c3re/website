# Vorschau auf Cloudflare Workers

- Adresse: https://c3re.sagorski.org
- Worker: `c3re-website`
- Konfiguration: `wrangler.jsonc`
- Live-Stand: Workers Static Assets mit `worker/index.mjs` und HTTP-Basic-Auth
  vor der Asset-Auslieferung.
- Eigene Fehlerseite: `404.html`, auch für verschachtelte unbekannte Pfade.
- Workers-Logs, workers.dev und Versions-Vorschauadressen sind deaktiviert.

## Aktueller Stand: 6. Oktober 2026

Die Demo wurde mit dem verfeinerten Header, dem einzelnen Sonne/Mond-Schalter,
der Tablet-Navigation und dem bündigen LED-Banner aktualisiert. Die aktive Version
ist `cc7c3731-f629-465d-a388-c8d72facd6af`, vollständig mit 100 % veröffentlicht.
Der frühere Stand `c526eba7-30d4-49f1-ac9e-3919472d0bc6` bleibt als frühere Version
in Cloudflare verfügbar.

Veröffentlicht wurde der gesamte geprüfte Projektstand einschließlich der schon
vorher vorhandenen Datenschutz-Ergänzungen, PDF-Footerlinks und Fundstücke.
Die dazugehörigen Quellen, Tests und Worker-Konfiguration werden zusammen mit
diesem Übergabestand auf `feature/barrierefreiheit` in GitHub gespeichert.
Lokale Designexporte, Originaldateien außerhalb der Website und macOS-Metadaten
sind nicht Teil dieses Git-Commits.

Die Veröffentlichung erfolgte mit Wrangler 4.93.0:

```sh
WRANGLER_SEND_METRICS=false wrangler deploy --keep-vars \
  --message "Publish refined header and exclude local metadata from demo assets"
```

Der Build kopiert `static/.assetsignore` jetzt ausdrücklich in das fertige
`public/`-Verzeichnis. Dadurch werden lokale `.DS_Store`- und README-Dateien beim
Asset-Upload ausgeschlossen, auch nachdem die Minifizierung den Ausgabeordner
ersetzt hat.

Prüfung: Build und Dry-Run erfolgreich; sieben Authentifizierungstests sowie
zwölf Browserprüfungen für Fundstücke und Fehlerseiten bestanden. Die UI war
zuvor mit 324 Browserprüfungen und elf Originaltextprüfungen geprüft worden.
Neun öffentliche HTTP-Prüfungen bestätigten die Anmeldepflicht für Seiten,
Skripte, Styles, Bilder, Audio und PDFs sowie die Abweisung falscher Zugangsdaten.
Nach der abschließenden Veröffentlichung wurden drei öffentliche Pfade erneut
auf `401` und `private, no-store` geprüft.

Die Cloudflare-API bestätigt die aktive Version, `raw_run_worker_first: true`,
`serve_directly: false`, beide vorhandenen Secret-Bindings sowie deaktivierte
workers.dev- und Versions-Vorschauadressen. Die Zugangsdaten wurden nicht geändert.
Die Darstellung wurde vor der Veröffentlichung lokal geprüft; ein angemeldeter
Browserabruf der Live-Seiten erfolgte in dieser Runde mangels verfügbarer
Demo-Zugangsdaten nicht.

## Passwortschutz: Erstveröffentlichung

Am 28.09.2026 wurde der HTTP-Basic-Auth-Schutz für die gesamte Demo über
Cloudflare MCP veröffentlicht. Die damalige Worker-Version war
`c526eba7-30d4-49f1-ac9e-3919472d0bc6` mit 169 statischen Dateien.

Am selben Tag wurde Game of Life vollständig entfernt: Seite, Skripte,
Spielstile, Footer-Symbol und Verweise in Terminal, Seitenübersicht und
Quelltext-Kommentar. `/life/`, `/life`, `/life/index.html`, `/js/life.js` und
`/js/life-grid.js` liefern nach Anmeldung die normale 404-Seite. 11 Inhaltstests,
7 Authentifizierungstests, 12 Browserprüfungen und 17 Live-Prüfungen bestanden.
Der Passwortschutz und die UTF-8-Auslieferung von `cookies.txt` sind weiter aktiv.

`assets.run_worker_first = true` führt den Worker für alle Pfade aus, auch für
direkte Bild-, Audio-, CSS- und PDF-Adressen. Ohne gültige Anmeldung antwortet er
mit `401` und fordert über den Browserdialog Zugangsdaten an. Fehlen die Secrets,
liefert er `503` statt ungeschützter Inhalte. Antworten werden mit
`Cache-Control: private, no-store` ausgeliefert.

Der Worker ergänzt für reine Textdateien ausdrücklich
`Content-Type: text/plain; charset=utf-8`. `static/cookies.txt` ist bereits korrekt
als UTF-8 gespeichert. Die explizite Angabe verhindert eine falsche Interpretation
von Umlauten beim direkten Öffnen der Textdatei. Diese Auslieferungskorrektur ist
ebenfalls live.

Benutzername und Passwort werden über die Cloudflare-Secrets `DEMO_USERNAME`
und `DEMO_PASSWORD` gesetzt; ihre Werte stehen nicht im Repository. Bei einer
erstmaligen Aktivierung über die CLI die Werte interaktiv eingeben und dann
veröffentlichen:

```sh
wrangler secret put DEMO_USERNAME
wrangler secret put DEMO_PASSWORD
wrangler deploy
```

Über MCP können beide Secret-Bindings und der Worker gemeinsam veröffentlicht
werden. Bei späteren Veröffentlichungen erhält `keep_bindings: ["secret_text"]`
die bereits hinterlegten Zugangsdaten.

Um die Asset-Auslieferungsreihenfolge zu ändern, das vorhandene Asset-Manifest
erneut bei `assets-upload-session` registrieren und den zurückgegebenen
Abschluss-Token als `assets.jwt` zusammen mit
`assets.config.run_worker_first: true` veröffentlichen. Bereits vorhandene
Dateien müssen dabei nicht erneut übertragen werden. `keep_assets: true`
allein übernimmt auch die alte Asset-Konfiguration und eignet sich daher nicht
für diese Änderung. Die veröffentlichte Version muss unter
`resources.script_runtime.assets` den Wert `raw_run_worker_first: true`
und `serve_directly: false` zeigen.

Lokale Prüfung:

```sh
npm run test:auth
wrangler deploy --dry-run
```

Die sieben Authentifizierungstests prüfen abgewiesene Anfragen, ungültige
Zugangsdaten, fehlende Secrets, geschützte Dateien, Range- und HEAD-Anfragen,
Weiterleitungen, UTF-8-Zugangsdaten und die verbindliche Worker-Reihenfolge.
16 Prüfungen an der öffentlichen Adresse bestätigten `401` ohne Anmeldung bzw.
mit falschen Zugangsdaten sowie `200` mit gültigen Zugangsdaten für Seiten,
Text-, CSS-, Audio- und PDF-Dateien. HEAD-Anfragen und die eigene 404-Seite
funktionieren ebenfalls. Der Inhalt von `cookies.txt` stimmt bytegenau mit
der UTF-8-Quelldatei überein und wird mit dem richtigen Zeichensatz ausgeliefert.
Der Live-Browser bestätigte die Anmeldung, die Startseite auf Desktop und Mobil
ohne horizontalen Überlauf sowie `UTF-8` und korrekt dargestellte Umlaute in
`cookies.txt`.
workers.dev und Versions-Vorschauadressen sind weiterhin deaktiviert.

## Build

Voraussetzungen: Hugo Extended ab 0.158 und das `minify`-Programm von
tdewolff/minify. Auf macOS sind beide über Homebrew verfügbar:

```sh
brew install hugo minify
make BASEURL=https://c3re.sagorski.org check
```

Die Adresse wird nur für diesen Build überschrieben. Die allgemeine
Hugo-Konfiguration behält ihre bisherige Hauptdomain.

## Veröffentlichung

Die Erstveröffentlichung am 27.09.2026 erfolgte über Cloudflare MCP:

1. Den fertigen `public/`-Ordner bauen und prüfen.
2. Ein Asset-Manifest beim Worker über `assets-upload-session` registrieren.
3. Die von Cloudflare angeforderten Dateien mit dem kurzlebigen Upload-Token
   an die Asset-Upload-API übertragen.
4. Die Asset-Version mit dem Abschluss-Token über MCP veröffentlichen.
5. `c3re.sagorski.org` als Custom Domain mit dem Worker verbinden.

Es wurden keine API-Schlüssel im Repository gespeichert. Cloudflare verwaltet
DNS und das HTTPS-Zertifikat für die Custom Domain.

Die bestehende Weiterleitungsregel der Zone für `*.sagorski.org` enthält eine
Ausnahme `http.host ne "c3re.sagorski.org"`, damit diese Vorschau erreichbar ist.
Die Ausnahme für `champagne-tycoon.sagorski.org` bleibt ebenfalls bestehen.
Diese Zonenregel wird separat von `wrangler.jsonc` verwaltet.

Eine zusätzliche Configuration Rule deaktiviert Web Analytics/RUM und Zaraz
ausschließlich für `c3re.sagorski.org`.

## Prüfung und bestehender Bot-Schutz

Geprüft wurden HTTPS über öffentliche DNS-Auflösung, Startseite und Unterseiten,
PDF- und Audioabrufe, die eigene 404-Seite, mobile Darstellung, Farbschema,
Leichte Sprache sowie echte Kalender- und Öffnungsdaten. 11 Inhaltstests,
5 Unit-Tests und 31 ausgewählte Browser-Tests bestanden beim Deployment.
Nach Übernahme der Configuration Rule lud der Live-Browser keine externen
Analyse-Skripte und meldete keine fehlgeschlagenen Netzwerkanfragen.

Auf der bestehenden Zone `sagorski.org` sind Bot Fight Mode, JavaScript Detections
und AI Labyrinth aktiviert. Cloudflare ergänzt daher Sicherheitscode und kann
das Cookie `cf_clearance` setzen; im Live-Test trat dies auf. Die lokale
Datenschutzprüfung ist somit kein Nachweis eines vollständig cookiefreien
Cloudflare-Betriebs. Die domainweiten Sicherheitsfunktionen wurden durch dieses
Deployment nicht abgeschaltet. Bot Fight Mode unterstützt laut
[Cloudflare-Dokumentation](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/#limitations)
keine Ausnahme über WAF- oder Page Rules für eine einzelne Subdomain.

Für weitere Veröffentlichungen kann derselbe MCP-Ablauf verwendet werden.
Alternativ baut und veröffentlicht `npx wrangler deploy` mit bestehender
Cloudflare-Anmeldung anhand der hinterlegten Konfiguration. Die Datei
`static/.assetsignore` schließt lokale Metadaten und README-Dateien aus.

Die Veröffentlichung ist eine Momentaufnahme des lokalen Arbeitsstands.
Automatische Veröffentlichungen bei Git-Push sind nicht eingerichtet.
