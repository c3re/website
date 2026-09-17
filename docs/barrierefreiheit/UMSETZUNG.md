# Aktueller Umsetzungsstand

Dieser Stand folgt den nach dem Phase-1-Audit ausdrücklich beauftragten
Design-Anpassungen. Er ersetzt keine vollständige WCAG-Abnahme.

## Verbindliche Vorgaben

- Menü und Barrierefreiheitsfunktionen aus `design_handoff_c3re_website/`,
  Variante 1c mit Vorlese-Leiste aus 1a, im vorhandenen Hugo-Theme umgesetzt.
- Das neue Logo bleibt proportional 60 px breit. Der Signalfehler-Effekt läuft
  kurz beim Laden; reduzierte Bewegung wird berücksichtigt.
- Dunkel bleibt nach erneuter ausdrücklicher Bestätigung der Standard.
  Eine gespeicherte manuelle Auswahl hat Vorrang, nicht die Systemeinstellung.
- Die normale Textfassung stammt wieder aus dem ursprünglichen Stand `dd22591`.
  Nur eine getrennte Leichte-Sprache-Fassung wird ergänzt.
- Keine Browserstimme: Vorlesen verwendet später bereitgestellte Audiodateien.
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

## Texte und Sprachvarianten

Alle elf Markdown-Dateien enthalten den unveränderten normalen Text und einen
zusätzlichen `easy`-Block im Frontmatter. Die zwischenzeitlichen `simple`-Blöcke
wurden entfernt. Der Vergleich aller normalen Textkörper gegen `dd22591` besteht,
wobei Leerzeichen/Zeilenumbrüche am Dateiende beim automatischen Vergleich
ausgenommen sind. Veraltete Aussagen und historische Links wurden dabei nicht
eigenmächtig redaktionell korrigiert.

`easy.title`, `easy.summary` und `easy.content` sind **redaktionell prüfen**.
Die Fassungen sind als Entwürfe gekennzeichnet und noch nicht durch eine Prüfgruppe
geprüft. Es wird keine DIN-konforme oder zertifizierte Leichte Sprache behauptet.
Die normale Fassung erhält keine zusätzlichen erklärenden Absätze.

Gemeinsame Texte stehen in `partials/text.html`, ganze Seitenfassungen in
`partials/content-variants.html`. `data-language="standard|easy"` steuert die
Sichtbarkeit. Die inaktive Fassung wird für assistive Technik ausgeblendet.
Im Menü reservieren unsichtbare Textvarianten die nötige Breite, ohne als zusätzliche
Beschriftung im Accessibility Tree zu erscheinen.

Der Sprachzustand kann als Fragment geteilt werden, etwa `/#sprache=leicht` oder
`/kontakt/#sprache=leicht&abschnitt=anreise`. Fragmente werden nicht an den Server
übertragen. Abschnittsanker bekommen in der leichten Fassung das Präfix `easy-`.

## Lokale Einstellungen

Ein Controller in `static/js/preferences.js` verwaltet folgende Keys:

| Key | Werte |
| --- | --- |
| `c3re-theme` | `dark`, `light` |
| `c3re-lang` | `std`, `leicht` |
| `c3re-fs` | `100`, `125`, `150` |
| `c3re-contrast` | `0`, `1` |
| `c3re-font` | `std`, `dys` |

Die alte Auswahl `c3re-simple=1` wird nur übernommen, wenn noch kein `c3re-lang`
vorhanden ist. Speicherzugriffe sind mit `try/catch` abgesichert. Reset setzt die
Lesehilfen zurück und behält das ausdrücklich gewählte Farbschema bei.
Ohne JavaScript sind Originaltexte und Navigation weiterhin benutzbar.

## Audiodateien später zuordnen

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

- `make check` mit Hugo 0.156.0 und der vorhandenen Minifizierung erfolgreich.
- JavaScript-Syntaxprüfungen erfolgreich.
- Originaltextvergleich für elf Markdown-Dateien erfolgreich.
- 14 Seiten mit Standard-/Leicht-Fassung bei 150 % Schrift und 320/768/1440 px:
  kein horizontaler Seitenüberlauf, ein sichtbares H1 und ein Main, keine doppelten IDs.
- Schalter, Größen-Endstufen, OpenDyslexic-Ladevorgang, Speicherung, Zähler, Reset,
  Escape, No-JS- und gesperrter-Storage-Fall geprüft.
- Zusätzliche axe-Prüfung des neuen Panels/Tabs im hohen Kontrast ohne gemeldete
  Verstöße. Das ist keine erneute vollständige Prüfung aller Website-Zustände.
- Audio-Leiste mit einer ausschließlich im Test eingesetzten synthetischen
  Aufnahme geprüft: kein Autoplay, Start, Pause, Fortsetzen, Tempo, Fortschritt,
  Stopp/Fokus-Rückgabe sowie Sprach-/Seitenwechsel.

Die Prüfscripte dieser Sitzung liegen im temporären Auditprojekt
`/var/folders/dg/pg323lwj4kg1cyvxjrctl1nw0000gn/T/opencode/c3re-a11y/`:
`handoff.mjs` und `audio-test.mjs`. Die dauerhafte CI-Integration bleibt eine
gesonderte Aufgabe.

## Weiter offen

- Die umfassenden Basisbefunde und manuellen Prüfungen aus `AUDIT.md`, soweit nicht
  durch die gezielt beauftragten Komponentenänderungen berührt; keine vollständige
  WCAG-2.2-AA-Konformitätsaussage.
- Redaktionelle und gegebenenfalls rechtliche Prüfung der Leichte-Sprache-Entwürfe,
  insbesondere Impressum und Datenschutz; Prüfung durch die Zielgruppe.
- Passende, freigegebene Audiodateien und deren Zuordnung.
- PDF-Prüfung, reale Screenreader- und Browser-Zoom-Tests sowie dauerhafte CI-Tests.
- Ergänzung der Datenschutzhinweise zur Einstellungsspeicherung als gesonderte
  redaktionelle Änderung. Der Originaltext wurde auf Wunsch nicht erweitert.

**Redaktionell prüfen:** alle neuen Leichte-Sprache-Texte, die Panelbeschriftungen,
Hinweise zu fehlenden Aufnahmen und Statusmeldungen. Ein rechtlich zu prüfender
Hinweisvorschlag für die Speicherung lautet: „Die gewählten Lese- und
Darstellungseinstellungen werden ausschließlich lokal in Ihrem Browser gespeichert.
Sie können sie über das Panel zurücksetzen oder durch Löschen der Website-Daten
entfernen.“ Dieser Vorschlag ist nicht in den Original-Seitentext eingebaut.
