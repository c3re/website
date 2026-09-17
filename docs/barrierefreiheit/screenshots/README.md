# Visuelle Nachweise

Die `vorher-*.png` stammen aus dem Phase-1-Audit vom 16.09.2026 zum Quellstand
`8e4b29d`. Sie zeigen den damaligen Stand vor der späteren Handoff-Überarbeitung.
Sie sind deshalb ein historischer Vergleich, kein pixelgenauer Vergleich nur eines
einzelnen WCAG-Fixes.

Die `nachher-*.png` zeigen den Stand der WCAG-Weiterarbeit vom 17.09.2026.
Sie wurden lokal aus dem Produktionsbuild erstellt. Kalender und Öffnungsstatus
verwenden dabei ausdrücklich **synthetische Testdaten**, keine Live-Termine.

Die Vergleichsseiten sind Startseite, Kontakt und Newsdetail. Weitere Bilder zeigen
das aktuelle Panel und die mobile Ansicht. Automatische Prüfberichte liegen als
generierte Artefakte unter `test-results/` und `a11y-reports/`.

Neue aktuelle Aufnahmen lassen sich nach `make check` mit
`node tests/screenshots.mjs` erstellen.

| Seite | Historisches Audit | Aktueller Stand |
| --- | --- | --- |
| Startseite | [Vorher](vorher-startseite.png) | [Nachher](nachher-startseite.png) |
| Kontakt | [Vorher](vorher-kontakt.png) | [Nachher](nachher-kontakt.png) |
| Newsdetail | [Vorher](vorher-news.png) | [Nachher](nachher-news.png) |

Zusätzlich: [Panel mit weiteren Hilfen](nachher-panel.png),
[mobile Startseite](nachher-mobil.png).
