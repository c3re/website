# Manuelle Prüfung mit Hilfstechnologien

**Noch durchzuführen.** Diese Anleitung ist kein Protokoll bereits bestandener
Screenreader- oder Prüfgruppen-Tests. Automatische axe-/Lighthouse-Ergebnisse ersetzen
die folgenden Schritte nicht.

## Vorbereitung

1. Lokal `hugo server --bind 127.0.0.1 --port 1313` starten, oder einen freigegebenen
   Testhost verwenden. Für Telefone muss ein im gleichen Netz erreichbarer Testhost
   genutzt werden; `localhost` auf dem Telefon bezeichnet nicht den Mac.
2. Browser und Hilfstechnologie samt Version notieren. Eine frische Browsersitzung
   verwenden oder Lesehilfen im Panel zurücksetzen.
3. Startseite, Philosophie, Kontakt, Downloads, Newsdetail, Seitenübersicht und
   Barrierefreiheit prüfen. Danach die übrigen Seiten stichprobenartig vergleichen.
4. Jeweils normal und mit Leichter Sprache, 150 % Schrift, hohem Kontrast und
   OpenDyslexic prüfen. Auch Kombinationen verwenden.
5. Nie allein „sieht gut aus“ protokollieren: URL, Einstellung, genaue Schritte,
   erwartetes Verhalten, tatsächliches Verhalten und gegebenenfalls Screenshot festhalten.

## Tastatur ohne Screenreader

- Mit Tab beginnen: „Zum Inhalt“ muss zuerst erscheinen. Enter setzt den Fokus in
  den Hauptinhalt, nicht nur den Bildausschnitt.
- Mit Tab vorwärts und mit Umschalt+Tab rückwärts durch die komplette Seite gehen.
  Der Fokus muss sichtbar bleiben, auch unter dem kompakten Header und nahe dem rechten Tab.
- Menü, Hell/Dunkel und Barrierefreiheits-Tab mit Enter bzw. Leertaste bedienen.
- Panel öffnen; alle Schalter, Schriftgrößenbuttons, „Weitere Hilfen“ und Reset erreichen.
  Das nichtmodale Panel darf keine Tastaturfalle erzeugen. Escape schließt und gibt
  den Fokus an den Tab zurück.
- Auf dem Handy-Layout das Menü öffnen und mit Escape schließen. Der Fokus kehrt
  zum Menübutton zurück.
- Kalender: „Termindetails“ mit Enter öffnen/schließen; Standort mit Enter kopieren.
  Die Rückmeldung muss verständlich sein. Nach Aktualisierung dürfen Fokus und
  geöffnete Details nicht verloren gehen.
- „Live-Anzeigen pausieren“ aktivieren. Ein sichtbarer Hinweis muss erklären, dass
  Daten veraltet sein können. Nach Fortsetzen muss eine aktuelle Abfrage erfolgen.

## VoiceOver auf macOS mit Safari

1. VoiceOver mit Cmd+F5 aktivieren. In Safari die Tabulator-Navigation für alle
   Bedienelemente aktivieren. „VO“ steht für Ctrl+Option.
2. Mit VO+Pfeil rechts/links durch die Seite gehen. Mit VO+U den Rotor öffnen und
   Überschriften, Links und Bereiche prüfen.
3. Es darf genau eine sichtbare Hauptüberschrift geben. Navigation, Hauptinhalt,
   ergänzende Termine/Kontakte und Footer müssen sinnvoll auffindbar sein.
4. Barrierefreiheits-Tab aktivieren (VO+Leertaste). Schalternamen und Ein/Aus-Zustände
   müssen verständlich angesagt werden. Die Schriftgröße muss nach Änderung erkennbar sein.
5. Leichte Sprache einschalten: Es darf nur die aktive Fassung gelesen werden,
   insbesondere nicht gleichzeitig beide Menübeschriftungen oder beide Volltexte.
   Der Hinweis auf den noch ungeprüften Entwurf muss erreichbar sein.
6. Die englischen Aussagen der Philosophie und das englische Motto sollen als
   Englisch ausgezeichnet sein. Namen und Zitate dürfen nicht doppelt vorgelesen werden.
7. Im Kalender das vollständige Datum einschließlich Jahr prüfen; die grafische
   Datumsbox darf nicht als unverständliche Folge aus isolierten Zeichen vorgelesen werden.
8. In Startseite, Philosophie und Erklärung die Aufnahme starten. Keine Aufnahme
   darf beim Laden automatisch beginnen. Pause/Fortsetzen, Tempo und Stopp testen.
   Bei Sprachwechsel muss die normale Aufnahme stoppen; fehlende leichte Aufnahmen
   dürfen nicht durch normale ersetzt werden.
9. Die Aufnahmen vollständig mit den normalen Texten abgleichen. Inhaltliche Abweichungen
   als redaktionellen Punkt erfassen, nicht als bestandenen Transkript-Test ausgeben.

## VoiceOver auf iPhone/iPad

1. VoiceOver unter Einstellungen → Bedienungshilfen aktivieren. Safari auf dem
   freigegebenen Testhost öffnen.
2. Mit einem Finger rechts/links wischen, mit Doppeltippen aktivieren. Über den Rotor
   auf Überschriften bzw. Links wechseln und abschnittsweise navigieren.
3. Menü und Barrierefreiheits-Tab müssen mit verständlichem Namen auffindbar sein.
   Das Panel muss auch im Querformat scrollbar und vollständig bedienbar bleiben.
4. 150 % Schrift, Leichte Sprache und OpenDyslexic kombinieren. Es darf kein Inhalt
   hinter dem Panel oder unter dem Header unerreichbar werden.
5. Audio starten, pausieren, beenden und danach weiter durch die Seite navigieren.
   Insbesondere Fokus-Rückgabe nach Stopp prüfen.
6. E-Mail- und Telefonlinks nur bis zur Auswahl des passenden Programms prüfen;
   keine Testanrufe oder Nachrichten ungefragt senden.

## NVDA auf Windows mit Firefox und Chrome/Edge

1. NVDA starten. Als NVDA-Taste wird üblicherweise Einfügen oder die Feststelltaste verwendet.
2. Mit H/Umschalt+H Überschriften, K/Umschalt+K Links und D die Bereiche durchgehen.
   Mit NVDA+F7 die Elementliste prüfen.
3. Mit Tab zu den Schaltern wechseln und mit Leertaste bzw. Enter bedienen. Name,
   Rolle und Zustand müssen zusammenpassen. Es darf keine ungewollte Seitennavigation geben.
4. Zwischen beiden Sprachfassungen wechseln und anschließend eine Unterseite öffnen.
   Die Auswahl muss erhalten bleiben. Nur die aktive Fassung darf in der Elementliste stehen.
5. Die URL `/kontakt/#sprache=leicht&abschnitt=anreise` in einem frischen Tab öffnen.
   Erwartet: leichte Fassung und der passende Anreise-Abschnitt.
6. Windows-Kontrastdesign einschalten. Gewähltes Theme, Schalterpositionen und
   Fokusrahmen müssen auch ohne die Markenfarben erkennbar bleiben.
7. Netzverbindung bzw. Statusdienste im Test blockieren. Fehler dürfen nicht als
   „geschlossen“ oder als erfundene Termine erscheinen. Rückmeldungen sollen einmal
   sinnvoll angesagt werden, nicht ständig die laufende Lektüre unterbrechen.

## TalkBack auf Android mit Chrome

1. TalkBack in den Bedienungshilfen aktivieren und die Seite öffnen.
2. Mit einem Finger rechts/links wischen; mit Doppeltippen aktivieren. Über das
   TalkBack-Menü bzw. die Lesesteuerung auf Überschriften und Bedienelemente wechseln
   (die genaue Geste hängt von der TalkBack-Version ab).
3. Prüfen, ob Navigation, Lesehilfen und Kontakt in einer sinnvollen Reihenfolge
   erreichbar sind. Zustände der Schalter müssen vorgelesen werden.
4. Panel bei 150 % Schrift und in beiden Ausrichtungen bedienen. Auch den letzten
   Schalter unter „Weitere Hilfen“ sowie Reset erreichen.
5. Kalenderdetails öffnen, Standort kopieren und die Rückmeldung anhören.
6. Aufnahme starten/pausieren/stoppen. Danach muss die Navigation mit TalkBack
   ohne verlorenen Fokus fortgesetzt werden können.

## Zoom, Abstände, Kontrast und Bewegung

- **Echten Browser-Zoom** auf 200 % und 400 % einstellen, nicht nur eine mobile
  Gerätesimulation und nicht nur Touch-Pinch-Zoom. Die Zoomanzeige des Browsers prüfen.
  Bei etwa 1280 px Ausgangsbreite entspricht 400 % ungefähr 320 CSS-Pixeln.
- Alle Bedienflächen und Texte müssen ohne Informations-/Funktionsverlust zugänglich
  sein. Kontrollieren, ob horizontal gescrollt werden muss oder überlange Wörter abgeschnitten sind.
- Zusätzlich reine Textvergrößerung prüfen, sofern der Browser diese anbietet.
- Nach W3C-Textabstandsvorgaben prüfen: Zeilenhöhe 1,5; Absatzabstand 2 em;
  Buchstabenabstand 0,12 em; Wortabstand 0,16 em. Besonders Menü, Panel und Audio-Leiste prüfen.
- Hoher Kontrast ist eine Option. Die normale helle und dunkle Darstellung muss
  unabhängig davon lesbar sein; insbesondere den Footer kontrollieren.
- Betriebssystem auf reduzierte Bewegung stellen. Logo-Glitch und Statuspulse
  müssen ausbleiben. Zusätzlich den Schalter „Animationen aus“ testen.
- Auch ohne diese Einstellung dürfen automatisch gestartete Statuspulse nicht
  endlos laufen. Die Statusanzeige muss als Text verständlich bleiben.

## Inhalte und Dokumente

- Bilder mit den Alternativtexten vergleichen, insbesondere Hackerhütte, Cap’n Crunch
  und DI-Day-Plakat. Bildschrift und ihre Textalternative inhaltlich abgleichen.
- Leichte-Sprache-Texte mit einer geeigneten Prüfgruppe testen. Keine DIN-Konformität
  allein aus Sprachgefühl oder einem automatisierten Lesbarkeitswert ableiten.
- Die drei PDFs separat mit geeigneten PDF-/Screenreader-Werkzeugen prüfen:
  Tags, Sprache, Titel, Lesereihenfolge, Alternativtexte und gegebenenfalls Formularfelder.
- Die neue Barrierefreiheitsinformation sowie rechtliche Angaben redaktionell bzw.
  rechtlich freigeben. Den tatsächlichen 404-Status und die Fehlerseite auf dem Zielhost prüfen.

## Neue Fundstücke

- Der Footer-Link zum Terminal sowie die PDF-Links müssen verständliche
  Namen haben. Die PDFs selbst sind dadurch noch nicht barrierefrei geprüft.
- Terminal: Eingabefeld „Befehl“ erreichen, `help`, einen unbekannten Befehl,
  `sudo make coffee` und `clear` ausführen. Nur die neue Antwort soll sinnvoll
  angesagt werden; der Wechsel zwischen deutscher und englischer Antwort muss stimmen.

## Protokollvorlage

| Feld | Eintrag |
| --- | --- |
| Datum / prüfende Person | |
| Gerät, Betriebssystem, Browser, Hilfstechnologie und Version | |
| URL und Einstellungen | |
| Prüfschritte | |
| Erwartetes Ergebnis | |
| Tatsächliches Ergebnis / gesprochene Ausgabe | |
| Bestanden / nicht bestanden / nicht anwendbar | |
| Screenshot bzw. Nachweis | |
| Weiterer Handlungsbedarf | |
