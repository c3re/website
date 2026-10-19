# Kleine Entdeckungen beim c3RE

## Die fünf Fundstücke

| Fundstück | Einstieg |
| --- | --- |
| Lokales Spielterminal | `/terminal/`, außerdem `[ >_ ]` im Footer |
| ASCII-Teekanne | `/418/`, über `ls` bzw. `open /418/` im Terminal |
| ASCII-Hackerhütte im Quelltext | Erster Kommentar vor dem Doctype jeder regulären HTML-Seite |
| Die große Leere | `/dev/null/`, Rückweg mit `cd /` |
| Haferkeksrezept | `/cookies.txt`, auch im Terminal-Verzeichnis |

Die drei zusätzlichen HTML-Seiten tragen `noindex` und `build.list: never`.
Sie erscheinen nicht in News oder XML-Sitemap. Footer, Quelltext und Terminal
führen zu den Fundstücken. Für einen zweiten zugänglichen Navigationsweg führt
die Seitenübersicht sie unter „Kleine Entdeckungen“ auf.
Das Keksrezept ist eine echte UTF-8-Textdatei.

## Bedienung

Das Terminal kennt `help`, `ls`, `philosophie`, `kontakt`, `open <Ziel>`, `cd <Ziel>`,
`whoami`, `pwd`, `mate`, `make mate`, `sudo make coffee`, `clear` und `exit`.
Nur fest vorgegebene interne Ziele werden geöffnet. Befehle werden niemals als
JavaScript, HTML, Systembefehl oder Serveranfrage ausgeführt. Ausgabe und Verlauf
sind auf 32 Einträge begrenzt; `clear`, Neuladen und Verlassen entfernen den Verlauf.
Pfeil hoch/runter im Eingabefeld holt bisherige Befehle. Es gibt keine globalen Shortcuts.
Das native aufklappbare Verzeichnis funktioniert auch ohne JavaScript.

## Datenschutz und Barrierefreiheit

Alles läuft auf der Website selbst. Keine Zusatzbibliotheken, Cookies, Browser-Speicherung,
Nutzungsstatistiken, Sounds oder externen Abfragen durch die Fundstücke. Die drei
Spiel-/Scherzseiten laden außerdem keine Live-Anzeigen. Die bereits vorhandenen
bewusst gewählten Darstellungsoptionen gelten weiterhin.

Die Einleitungen haben getrennte Leichte-Sprache-Entwürfe. Sie sind ebenso wie die
übrigen neuen Texte redaktionell bzw. durch eine Prüfgruppe zu prüfen.
Die Fundstücke werden in der gleichen axe-/Tastatur-/Responsive-/Datenschutz-Matrix
wie die übrigen Seiten getestet. `tests/browser/easter-eggs.spec.mjs` prüft die Bedienung.

## Quelltext-Kommentar beim Build erhalten

Go-Templates entfernen gewöhnliche HTML-Kommentare. `source-note.html` gibt den
festen, vertrauenswürdigen Kommentar deshalb als `safeHTML` aus. Er steht im
`baseof.html` vor dem Doctype. Keine Nutzereingaben werden dafür verwendet.

Beide Minifizierungsschritte müssen Kommentare behalten:

1. Hugo: `minify.tdewolff.html.keepComments = true` in `config.toml`.
2. Zweiter Minifier im Makefile: `--html-keep-comments`.

Ein Regressionstest prüft die ersten Bytes aller ausgelieferten regulären HTML-Seiten
im fertigen Produktionsbuild. Auch nach Minifizierung bleibt der Browser im Standardmodus.

## Optional: echter HTTP-Status 418

Hugo liefert eine statische `/418/index.html`. Vorschau und Testserver liefern
diese Seite mit **HTTP 200** aus. Die Zahl im Seitentitel ändert keinen HTTP-Status.

Für einen echten 418-Status muss der Betreiber die passende Regel auf dem Host
einrichten. Die folgenden Beispiele setzen Hosting im Domain-Wurzelverzeichnis
voraus und sind **Vorlagen, keine bereits installierte oder auf dem Zielhost geprüfte Konfiguration**.

### Apache mit mod_rewrite, z. B. bestehende Root-.htaccess ergänzen

```apache
ErrorDocument 418 /418/index.html
RewriteEngine On
RewriteRule ^418/?$ - [R=418,L]
```

Die Fehlerdokument-Adresse darf selbst nicht auf die Regel zurückfallen.
Bestehende Host-Regeln und `AllowOverride` berücksichtigen.

### Nginx, innerhalb des bestehenden server-Blocks

```nginx
location = /418 {
    return 308 /418/;
}

location = /418/ {
    error_page 418 /418/index.html;
    return 418;
}
```

`/418/index.html` muss über die vorhandene statische Dateiauslieferung erreichbar sein.
Nach Einrichtung Status 418, HTML-Inhalt, Schriften/Skripte, Rücklinks und Verhalten
des vorgeschalteten CDN gemeinsam prüfen. Keine automatische Änderung am Produktivhost.
