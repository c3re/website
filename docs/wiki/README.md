# Wiki.js im c3RE-Design

`wikijs-theme.css` überträgt Farben und Schriften von www.c3re.de auf Wiki.js 2.x
(Dunkel und Hell, Mono-Schrift für Code, grüne Akzentfarbe, sichtbarer Fokus).

## Einbau

1. In Wiki.js als Administrator anmelden.
2. **Administration → Theme**.
3. Theme **Dark** wählen und "Dark Mode" einschalten (entspricht dem Standard der Webseite).
   Optional die Primärfarbe auf `#62de9e` stellen.
4. Den Inhalt von `wikijs-theme.css` in das Feld **CSS Override** einfügen und speichern.
5. Neu laden mit Strg+F5.

## Hinweise

- Das Wiki-Dark/Hell-Umschalten folgt dem Wiki.js-Theme, nicht dem Schalter der Webseite.
- Die Schriften werden von `https://www.c3re.de/fonts/…` geladen. Das klappt nur, wenn die
  Webseite dafür den Header `Access-Control-Allow-Origin: https://wiki.c3re.de` sendet
  (siehe `worker/index.mjs`). Ohne das nutzt das Wiki System-Schriften; das Design bleibt lesbar.
  Datenschutz-freundlicher ist, die drei Schriftdateien im Wiki selbst abzulegen.
- Wiki.js ändert Klassennamen zwischen Versionen. Nach einem Update das Wiki kurz prüfen.
- Getestet wurde nur gegen die Farbwerte der Webseite, nicht gegen eine laufende Wiki-Instanz.
