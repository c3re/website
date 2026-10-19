# c3RE Website

Website des Chaostreffs Recklinghausen (c3RE e.V.): <https://c3re.de>

Die Seite ist ein statisches [Hugo](https://gohugo.io/)-Projekt. Die Inhalte
liegen als Markdown in `content/`, das Aussehen steckt im Theme
`themes/hugo-theme-flat`.

## Aufbau

| Ordner / Datei | Inhalt |
| --- | --- |
| `content/` | Seiten und News als Markdown |
| `themes/hugo-theme-flat/` | Layouts, CSS, JavaScript und Schriften |
| `static/` | Bilder, PDFs und Audiodateien |
| `data/` | Daten für Barrierefreiheit und Audio |
| `config.toml` | Hugo-Konfiguration und Hauptmenü |
| `tests/` | Inhalts-, Unit- und Browser-Tests |
| `worker/`, `wrangler.jsonc` | Cloudflare-Worker mit Passwortschutz für die Vorschau |
| `docs/` | Dokumentation zu Barrierefreiheit, Datenschutz, Gestaltung und Wiki-Theme |
| `PRODUCT.md` | Ziele und Gestaltungsprinzipien |

## Lokal bauen

Benötigt werden [Hugo](https://gohugo.io/installation/) (die CI nutzt
v0.161.1) und [minify](https://github.com/tdewolff/minify).

```sh
make            # baut die Seite nach public/ und minimiert sie
hugo server     # lokale Vorschau mit Live-Reload
```

Die Basis-URL lässt sich überschreiben, zum Beispiel
`make BASEURL=http://localhost:1313`. Standard ist `https://c3re.de`.

## Inhalte ändern

Seiten in `content/` bearbeiten und per Pull Request gegen `master`
einreichen. Die bestehenden Seiten haben neben dem normalen Text eine Fassung
in Leichter Sprache (Feld `easy` im Kopf der Datei). Der normale Text bleibt
dabei unverändert, das prüfen die Inhaltstests.

## Tests

```sh
npm ci
npm run test:content   # Originaltexte bleiben erhalten
npm run test:auth      # Passwortschutz des Workers
npm run test:a11y      # Inhalts-Tests, Build und Browser-Tests (axe, Playwright)
```

Die Inhaltstests vergleichen die Seitentexte mit einem festen Git-Stand
(`33278b4`) und brauchen deshalb die vollständige Git-Historie. Die
Browser-Tests laufen mit Chromium (`npx playwright install chromium`).

Bei jedem Pull Request gegen `master` baut die CI (`.github/workflows/build.yml`)
die Seite und führt die Barrierefreiheits-Tests aus.

## Weitere Dokumentation

- [Barrierefreiheit](docs/barrierefreiheit/BERICHT.md)
- [Datenschutz und Technik](docs/DATENSCHUTZ-TECHNIK.md)
- [Wiki.js-Theme im c3RE-Design](docs/wiki/README.md)
