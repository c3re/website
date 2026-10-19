import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

// Discover every shipped HTML page, including new pages and the custom error page.
export async function publishedPages() {
    const root = new URL("../public/", import.meta.url).pathname;
    const pages = [];
    async function visit(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) await visit(path);
            else if (entry.name.endsWith(".html")) {
                const html = await readFile(path, "utf8");
                if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) continue;
                const route = "/" + relative(root, path).replace(/\\/g, "/").replace(/index\.html$/, "");
                pages.push(route);
            }
        }
    }
    await visit(root);
    return pages.sort();
}

export async function mockServices(page, options = {}) {
    const tomorrow = Math.floor(Date.now() / 1000) + 86400;
    const calendar = options.calendar || [
        { start: tomorrow, summary: "Open Chaos - c3RE e.V.", location: "Hackerhütte, Westcharweg 101", description: "All Creatures are welcome! Gemeinsam programmieren und löten." },
        { start: tomorrow + 86400, summary: "Testtermin", location: "Hackerhütte, Westcharweg 101", url: "http://127.0.0.1:4173/kontakt/", description: "Ein Termin für den automatisierten Test." }
    ];
    const counts = { door: 0, calendar: 0 };
    await page.route("https://spaceapi.c3re.de/**", async route => {
        counts.door++;
        await route.fulfill({ json: options.door || { state: { open: true, lastchange: Math.floor(Date.now() / 1000) - 3600 }, sensors: { temperature: [{ location: "Clubraum", value: 23.3, unit: "°C" }] } } });
    });
    await page.route("https://ical2json.c3re.de/**", async route => {
        counts.calendar++;
        await route.fulfill({ json: calendar });
    });
    return counts;
}

export async function preferences(page, values = {}) {
    await page.addInitScript(values => {
        for (const [key, value] of Object.entries(values)) localStorage.setItem(key, String(value));
    }, values);
}

export async function waitForPageFeatures(page) {
    await page.waitForFunction(() => !document.getElementById("a11y-toggle").hidden);
    const calendar = page.locator("#calendar");
    if (await calendar.count()) await page.waitForFunction(() => document.getElementById("calendar").getAttribute("aria-busy") === "false");
    if (await page.locator("#terminal-form").count()) await page.locator("#terminal-form").waitFor({ state: "visible" });
}
