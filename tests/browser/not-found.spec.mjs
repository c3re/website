import { test, expect } from "@playwright/test";
import { mockServices } from "../helpers.mjs";

for (const path of ["/missing-page/", "/missing/nested/page/"]) {
    test(`error page works at the requested address: ${path}`, async ({ page }) => {
        await mockServices(page);
        const failedAssets = [];
        page.on("response", response => {
            if (response.url().startsWith("http://127.0.0.1:4173/") && response.status() >= 400 && response.request().resourceType() !== "document") {
                failedAssets.push(response.url());
            }
        });
        const response = await page.goto(path);
        expect(response.status()).toBe(404);
        await expect(page.getByRole("heading", { name: "Seite nicht gefunden", exact: true })).toBeVisible();
        await expect(page.locator("#a11y-toggle")).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        expect(failedAssets).toEqual([]);
        const home = page.getByRole("link", { name: "Zur Startseite", exact: true });
        expect(await home.evaluate(link => new URL(link.href).pathname)).toBe("/");
        await page.keyboard.press("Tab");
        await expect(page.locator(".skip-link")).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.locator("#main-content")).toBeFocused();
        expect(new URL(page.url()).pathname).toBe(path);
        await home.click();
        await expect(page).toHaveURL("http://127.0.0.1:4173/");
    });
}
