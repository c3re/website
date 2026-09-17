import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mockServices } from "./helpers.mjs";

const output = new URL("../docs/barrierefreiheit/screenshots/", import.meta.url);
const server = spawn(process.execPath, ["tests/serve.mjs"], { env: { ...process.env, PORT: "4175" }, stdio: ["ignore", "pipe", "inherit"] });
let browser;
try {
    await once(server.stdout, "data");
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    await mockServices(page);
    for (const [name, path] of [["startseite", "/"], ["kontakt", "/kontakt/"], ["news", "/news/test_diday_feb/"]]) {
        await page.goto("http://127.0.0.1:4175" + path);
        await page.waitForFunction(() => document.querySelector(".calendar-event"));
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
            const visibleImages = [...document.images].filter(image => image.getClientRects().length && image.getBoundingClientRect().top < innerHeight && image.getBoundingClientRect().bottom > 0);
            visibleImages.forEach(image => { image.loading = "eager"; });
            await Promise.all(visibleImages.map(image => image.decode()));
            // Let decoded images reach the compositor before capturing the viewport.
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        await page.screenshot({ path: new URL(`nachher-${name}.png`, output).pathname });
    }
    await page.goto("http://127.0.0.1:4175/");
    await page.locator("#a11y-toggle").click();
    await page.locator(".a11y-more summary").click();
    await page.screenshot({ path: new URL("nachher-panel.png", output).pathname });
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 320, height: 812 });
    await page.screenshot({ path: new URL("nachher-mobil.png", output).pathname });
} finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
}
