import { test, expect } from "@playwright/test";
import { mockServices } from "../helpers.mjs";

for (const path of ["/", "/unsere-philosophie/", "/unvereinbarkeitserklaerung/"]) {
    test(`provided recording: ${path}`, async ({ page }) => {
        const requests = [];
        page.on("request", request => { if (request.url().endsWith(".mp3")) requests.push(request.url()); });
        await mockServices(page);
        await page.goto(path);
        expect(requests).toEqual([]);
        await expect(page.locator("#audio-bar")).toBeHidden();
        await page.locator("#page-audio").evaluate(audio => audio.volume = 0);
        await page.locator("#a11y-toggle").click();
        await expect(page.locator("#audio-start")).toBeEnabled();
        await page.locator("#audio-start").click();
        await expect(page.locator("#audio-bar")).toBeVisible();
        await expect.poll(() => page.locator("#page-audio").evaluate(audio => audio.duration)).toBeGreaterThan(60);
        await page.locator("#audio-pause").click();
        await expect(page.locator("#audio-bar")).toHaveAttribute("data-state", "paused");
        await page.locator("#audio-speed").click();
        expect(await page.locator("#page-audio").evaluate(audio => audio.playbackRate)).toBe(1.25);
        await page.locator("#audio-stop").click();
        await expect(page.locator("#audio-bar")).toBeHidden();
        await expect(page.locator("#a11y-toggle")).toBeFocused();
        await page.locator("#a11y-toggle").click();
        await page.locator("#easy-language").click();
        await expect(page.locator("#audio-start")).toBeDisabled();
    });
}
