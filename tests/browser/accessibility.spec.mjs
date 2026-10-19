import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { publishedPages, mockServices, preferences, waitForPageFeatures } from "../helpers.mjs";

const pages = await publishedPages();
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const variants = [
    { name: "dark", values: { "c3re-theme": "dark" } },
    { name: "light", values: { "c3re-theme": "light" } },
    { name: "high-contrast", values: { "c3re-contrast": "1" } },
    { name: "150-percent", values: { "c3re-fs": "150" } },
    { name: "easy-dark", values: { "c3re-lang": "leicht" } },
    { name: "easy-light", values: { "c3re-lang": "leicht", "c3re-theme": "light" } },
    { name: "combined", values: { "c3re-lang": "leicht", "c3re-fs": "150", "c3re-contrast": "1", "c3re-font": "dys", "c3re-links": "1" } }
];

for (const width of [1440, 320]) {
    for (const variant of variants) {
        for (const path of pages) {
            test(`${path} ${variant.name} ${width}px`, async ({ page }, testInfo) => {
                await page.setViewportSize({ width, height: 1000 });
                await preferences(page, variant.values);
                await mockServices(page);
                const errors = [];
                page.on("pageerror", error => errors.push(error.message));
                page.on("requestfailed", request => {
                    if (request.url().startsWith("http://127.0.0.1:4173/")) errors.push(`${request.url()}: ${request.failure().errorText}`);
                });
                const response = await page.goto(path);
                expect(response.status()).toBe(200);
                await waitForPageFeatures(page);
                await page.evaluate(() => document.fonts.ready);
                expect(errors).toEqual([]);
                const result = await new AxeBuilder({ page }).withTags(tags).analyze();
                await testInfo.attach("axe-incomplete", { body: JSON.stringify(result.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))), contentType: "application/json" });
                expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
                expect(await page.locator("main").count()).toBe(1);
                expect(await page.locator("h1:visible").count()).toBe(1);
                const skippedLevels = await page.locator("main :is(h1,h2,h3,h4,h5,h6):visible").evaluateAll(headings => {
                    const levels = headings.map(heading => Number(heading.tagName.slice(1)));
                    return levels.filter((level, index) => index && level > levels[index - 1] + 1);
                });
                expect(skippedLevels).toEqual([]);
                expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
                const duplicateIds = await page.evaluate(() => {
                    const ids = [...document.querySelectorAll("[id]")].map(e => e.id);
                    return ids.filter((id, index) => ids.indexOf(id) !== index);
                });
                expect(duplicateIds).toEqual([]);
                expect(errors).toEqual([]);
            });
        }
    }
}

for (const theme of ["dark", "light"]) {
    test(`panel controls ${theme}`, async ({ page }) => {
        await preferences(page, { "c3re-theme": theme });
        await mockServices(page);
        await page.goto("/");
        await page.getByRole("button", { name: "Barrierefreiheit", exact: true }).click();
        await page.locator(".a11y-more > summary").click();
        const result = await new AxeBuilder({ page }).withTags(tags).include("#a11y-panel").include("#a11y-toggle").analyze();
        expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
    });
}
