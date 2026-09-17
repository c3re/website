import { test, expect } from "@playwright/test";
import { publishedPages, mockServices, preferences } from "../helpers.mjs";

const pages = await publishedPages();

test("dark default, persistence, panel keyboard controls and reset", async ({ page }) => {
    await mockServices(page);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Helles Design", exact: true }).click();
    await page.locator("#a11y-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#a11y-panel")).toBeVisible();
    await page.locator("#easy-language").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
    await page.locator("#font-size-up").click();
    await page.locator("#font-size-up").click();
    await expect(page.locator("#a11y-panel")).toBeVisible();
    await expect(page.locator("#font-size-up")).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(page.locator("#a11y-toggle")).toBeFocused();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute("data-fs", "150");
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
    await page.locator("#a11y-toggle").click();
    await page.locator("#preferences-reset").click();
    await expect(page.locator("#a11y-panel")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-fs", "100");
    await expect(page.locator("html")).toHaveAttribute("data-language", "standard");
});

test("settings work with blocked storage", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } }));
    await mockServices(page);
    await page.goto("/");
    await page.locator("#a11y-toggle").click();
    await page.locator("#easy-language").click();
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
});

test("original content and navigation work without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.locator('.content[data-language="standard"]')).toBeVisible();
    await expect(page.locator('.content[data-language="easy"]')).toBeHidden();
    await expect(page.locator("#main-menu")).toBeVisible();
    await expect(page.locator("#a11y-toggle")).toBeHidden();
    await context.close();
});

for (const path of pages) {
    test(`keyboard focus stays visible: ${path}`, async ({ page }) => {
        await preferences(page, { "c3re-lang": "leicht" });
        await mockServices(page);
        await page.goto(path);
        await expect(page.locator("#calendar")).toHaveAttribute("aria-busy", "false");
        await page.evaluate(() => document.fonts.ready);
        await page.keyboard.press("Tab");
        await expect(page.locator(".skip-link")).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.locator("#main-content")).toBeFocused();
        const total = await page.locator("a[href]:visible, button:enabled:visible, summary:visible").count();
        for (const direction of ["Tab", "Shift+Tab"]) {
            for (let index = 0; index < total + 1; index++) {
                await page.keyboard.press(direction);
                await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                const failure = await page.evaluate(() => {
                    const active = document.activeElement;
                    if (active === document.body) return null;
                    const rect = active.getBoundingClientRect();
                    const style = getComputedStyle(active);
                    const points = [rect.top + 2, rect.top + rect.height / 2, rect.bottom - 2];
                    const visible = points.some(y => {
                        if (y < 0 || y >= innerHeight) return false;
                        const node = document.elementFromPoint(rect.left + rect.width / 2, y);
                        return node && active.contains(node);
                    });
                    return !visible || style.outlineStyle === "none" ? { text: active.textContent, tag: active.tagName, top: rect.top, visible, outline: style.outlineStyle } : null;
                });
                expect(failure).toBeNull();
            }
        }
    });
}

test("full keyboard access to calendar descriptions and retained focus on refresh", async ({ page }) => {
    await page.clock.install();
    const calls = await mockServices(page);
    await page.goto("/");
    const summary = page.locator(".calendar-description summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".calendar-description").first()).toHaveAttribute("open", "");
    await expect(page.locator('.calendar-description').first().locator('[lang="en"]')).toHaveText("All Creatures are welcome!");
    await page.clock.fastForward(15 * 60 * 1000);
    await expect.poll(() => calls.calendar).toBeGreaterThan(1);
    await expect(page.locator("#calendar")).toHaveAttribute("aria-busy", "false");
    await expect(summary).toBeFocused();
    await expect(page.locator(".calendar-description").first()).toHaveAttribute("open", "");
});

test("paused live displays make no requests and resume immediately", async ({ page }) => {
    await page.clock.install();
    await preferences(page, { "c3re-live-paused": "1" });
    const calls = await mockServices(page);
    await page.goto("/");
    await page.clock.fastForward(15 * 60 * 1000);
    expect(calls).toEqual({ door: 0, calendar: 0 });
    await expect(page.locator("#calendar")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator(".side-calendar .live-note")).toBeVisible();
    await page.locator("#a11y-toggle").click();
    await page.locator(".a11y-more summary").click();
    await page.locator('[data-toggle-preference="livePaused"]').click();
    await expect.poll(() => calls.calendar).toBe(1);
    await expect.poll(() => calls.door).toBe(1);
});

test("text spacing and 400-percent-equivalent reflow", async ({ page }) => {
    await preferences(page, { "c3re-lang": "leicht", "c3re-fs": "150", "c3re-font": "dys" });
    await mockServices(page);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/kontakt/");
    await page.addStyleTag({ content: "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.locator("#a11y-toggle").click();
    expect(await page.locator("#a11y-panel").evaluate(e => e.scrollWidth > e.clientWidth)).toBe(false);
});

test("rapid pause and resume does not strand an in-flight request", async ({ page }) => {
    let release;
    let calls = 0;
    await page.route("https://spaceapi.c3re.de/**", route => route.fulfill({ json: { state: { open: false } } }));
    await page.route("https://ical2json.c3re.de/**", async route => {
        calls++;
        if (calls === 1) await new Promise(resolve => { release = resolve; });
        await route.fulfill({ json: [] }).catch(() => {});
    });
    await page.goto("/");
    await expect.poll(() => calls).toBe(1);
    await page.locator("#a11y-toggle").click();
    await page.locator(".a11y-more summary").click();
    await page.locator('[data-toggle-preference="livePaused"]').click();
    await page.locator('[data-toggle-preference="livePaused"]').click();
    release();
    await expect.poll(() => calls).toBeGreaterThan(1);
    await expect(page.locator("#calendar")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator("#calendar-status")).toContainText("keine Termine");
});

test("system preferences and visible switch states in forced colors", async ({ page }) => {
    await mockServices(page);
    await page.emulateMedia({ reducedMotion: "reduce", contrast: "more", forcedColors: "active" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "1");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
    expect(await page.locator(".status-dot").evaluate(e => getComputedStyle(e).animationName)).toBe("none");
    await page.locator("#a11y-toggle").click();
    const outline = await page.locator('[data-toggle-preference="contrast"] .a11y-switch-track').evaluate(e => getComputedStyle(e).outlineWidth);
    expect(parseFloat(outline)).toBeGreaterThan(0);
});
