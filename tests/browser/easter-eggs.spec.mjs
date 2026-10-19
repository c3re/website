import { test, expect } from "@playwright/test";
import { publishedPages, mockServices, waitForPageFeatures } from "../helpers.mjs";

const pages = await publishedPages();
const eggPaths = ["/terminal/", "/418/", "/dev/null/"];

test("the source discovery is first in every minified HTML document", async ({ request }) => {
    for (const path of pages) {
        const html = await (await request.get(path)).text();
        expect(html.startsWith("<!--\n")).toBe(true);
        expect(html.slice(0, html.indexOf("-->"))).toContain("Du liest den Quelltext.");
        expect(html.slice(0, html.indexOf("-->"))).toContain("/terminal/");
        expect(html.indexOf("-->")).toBeLessThan(html.toLowerCase().indexOf("<!doctype html>"));
    }
});

test("the recipe is a real UTF-8 text file", async ({ request }) => {
    const response = await request.get("/cookies.txt");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("text/plain");
    expect(await response.text()).toContain("ausschließlich in der Küche");
    expect(await response.text()).toContain("180 °C");
    expect(response.headers()["set-cookie"]).toBeUndefined();
});

test("footer discoveries and hidden paths are connected", async ({ page }) => {
    await mockServices(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Terminal öffnen", exact: true }).click();
    await expect(page).toHaveURL(/\/terminal\/$/);
    await page.locator(".terminal-directory summary").click();
    await page.locator('#terminal-directory a[data-route="teapot"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Teekanne");
    expect(await page.evaluate(() => document.compatMode)).toBe("CSS1Compat");
    await page.goto("/seitenuebersicht/");
    await page.locator(".site-map-discoveries summary").click();
    await expect(page.locator(".site-map-discoveries a:visible")).toHaveCount(3);
});

test("terminal commands are local text, not HTML or remote instructions", async ({ page, context }) => {
    await page.goto("/terminal/");
    await expect(page.locator("#terminal-form")).toBeVisible();
    const requests = [];
    page.on("request", request => requests.push(request.url()));
    const input = page.locator("#terminal-command");
    for (const [command, answer] of [["help", "Befehle anzeigen"], ["ls", "/cookies.txt"], ["sudo make coffee", "Permission denied"], ["make mate", "echte Flasche"], ["whoami", "Mehr müssen wir nicht wissen"]]) {
        await input.fill(command);
        await input.press("Enter");
        await expect(page.locator("#terminal-history li").last()).toContainText(answer);
    }
    const markup = '<img src="https://third-party.invalid/track" onerror="window.injected=true">';
    await input.fill(markup);
    await input.press("Enter");
    await expect(page.locator("#terminal-history li").last()).toContainText(markup);
    await expect(page.locator("#terminal-history img")).toHaveCount(0);
    expect(await page.evaluate(() => window.injected)).toBeUndefined();
    await input.fill("open https://third-party.invalid/");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/terminal\/$/);
    await expect(page.locator("#terminal-status")).toContainText("Diesen Weg kenne ich nicht");
    await input.fill("sudo make coffee");
    await input.press("Enter");
    await expect(page.locator("#terminal-status")).toHaveAttribute("lang", "en");
    await input.fill("clear");
    await input.press("Enter");
    await expect(page.locator("#terminal-status")).toHaveAttribute("lang", "de");
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => ({ ...localStorage, ...sessionStorage }))).toEqual({});
    expect(await context.cookies()).toEqual([]);
});

test("terminal history, quick commands, clear and navigation work by keyboard", async ({ page }) => {
    await page.goto("/terminal/");
    await page.getByRole("button", { name: "Befehl mate ausführen", exact: true }).click();
    const input = page.locator("#terminal-command");
    await expect(input).toBeFocused();
    await input.fill("noch nicht ausgeführt");
    await input.press("ArrowUp");
    await expect(input).toHaveValue("mate");
    await input.press("ArrowDown");
    await expect(input).toHaveValue("noch nicht ausgeführt");
    await input.fill("clear");
    await input.press("Enter");
    await expect(page.locator("#terminal-history li")).toHaveCount(0);
    await input.press("ArrowUp");
    await expect(input).toHaveValue("");
    await input.fill("open /dev/null");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/dev\/null\/$/);
    await page.getByRole("link", { name: "cd /: zurück zur Startseite", exact: true }).click();
    await expect(page).toHaveURL("http://127.0.0.1:4173/");
});

test("terminal output is bounded and disappears on reload", async ({ page }) => {
    await page.goto("/terminal/");
    await expect(page.locator("#terminal-form")).toBeVisible();
    await page.evaluate(() => {
        for (let index = 0; index < 40; index++) {
            document.getElementById("terminal-command").value = "whoami";
            document.getElementById("terminal-form").requestSubmit();
        }
    });
    await expect(page.locator("#terminal-history li")).toHaveCount(32);
    await page.reload();
    await expect(page.locator("#terminal-history li")).toHaveCount(0);
});

for (const path of eggPaths) {
    test(`the discovery works without live services or new storage: ${path}`, async ({ page }) => {
        const calls = await mockServices(page);
        await page.goto(path);
        await waitForPageFeatures(page);
        expect(calls).toEqual({ door: 0, calendar: 0 });
        expect(await page.evaluate(() => ({ ...localStorage, ...sessionStorage }))).toEqual({});
    });
}

test("discoveries retain navigation and explanations without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
        const page = await context.newPage();
        await page.goto("http://127.0.0.1:4173/terminal/");
        await expect(page.locator("#terminal-form")).toBeHidden();
        await page.locator(".terminal-directory summary").click();
        await page.locator('#terminal-directory a[data-route="teapot"]').click();
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Teekanne");
        await page.getByRole("link", { name: "Zur Startseite", exact: true }).click();
        await expect(page).toHaveURL("http://127.0.0.1:4173/");
    } finally {
        await context.close();
    }
});
