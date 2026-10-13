import { test, expect } from "@playwright/test";
import { publishedPages, mockServices, preferences, waitForPageFeatures } from "../helpers.mjs";

const pages = await publishedPages();
const serviceOrigins = ["https://spaceapi.c3re.de", "https://ical2json.c3re.de"];

async function storedValues(page) {
    return page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
}

for (const path of pages) {
    test(`no passive storage or third-party embeds: ${path}`, async ({ page, context }) => {
        await page.addInitScript(() => {
            window.privacyWrites = [];
            for (const method of ["setItem", "removeItem", "clear"]) {
                const original = Storage.prototype[method];
                Storage.prototype[method] = function (...args) {
                    window.privacyWrites.push({ method, key: args[0] });
                    return original.apply(this, args);
                };
            }
        });
        await mockServices(page);
        const unexpected = [];
        const responses = [];
        page.on("response", response => responses.push(response));
        await page.route("**/*", route => {
            const request = route.request();
            const url = new URL(request.url());
            const local = url.origin === "http://127.0.0.1:4173";
            const service = serviceOrigins.includes(url.origin) && request.resourceType() === "fetch";
            if ((!local && !service) || request.method() !== "GET") {
                unexpected.push(request.url());
                return route.abort();
            }
            return route.fallback();
        });
        await page.goto(path);
        await waitForPageFeatures(page);
        await page.evaluate(async () => {
            const images = [...document.images].filter(image => image.getClientRects().length);
            images.forEach(image => { image.loading = "eager"; });
            await Promise.all(images.map(image => image.decode()));
            await document.fonts.ready;
        });
        expect(unexpected).toEqual([]);
        expect(await storedValues(page)).toEqual({ local: {}, session: {} });
        expect(await page.evaluate(() => window.privacyWrites)).toEqual([]);
        expect(await context.cookies()).toEqual([]);
        const cookieHeaders = await Promise.all(responses.map(async response => (await response.allHeaders())["set-cookie"]));
        expect(cookieHeaders.filter(Boolean)).toEqual([]);
        await expect(page.locator("iframe, object, embed, a[ping], link[rel=preconnect], link[rel=dns-prefetch]")).toHaveCount(0);
    });
}

test("shared language links do not save a preference, including hash changes", async ({ page }) => {
    await mockServices(page);
    await page.goto("/kontakt/#sprache=leicht&abschnitt=anreise");
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
    expect(await storedValues(page)).toEqual({ local: {}, session: {} });
    await page.evaluate(() => { location.hash = "sprache=std"; });
    await expect(page.locator("html")).toHaveAttribute("data-language", "standard");
    expect(await storedValues(page)).toEqual({ local: {}, session: {} });
    await page.evaluate(() => { location.hash = "sprache=leicht"; });
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
    expect(await storedValues(page)).toEqual({ local: {}, session: {} });
    await page.goto("/unsere-philosophie/");
    await expect(page.locator("html")).toHaveAttribute("data-language", "standard");
});

test("only chosen settings persist; reset forgets reading aids and legacy storage", async ({ page }) => {
    await mockServices(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Helles Design", exact: true }).click();
    await page.locator("#a11y-toggle").click();
    await page.locator("#easy-language").click();
    await page.locator("#font-size-up").click();
    expect(await storedValues(page)).toEqual({ local: { "c3re-theme": "light", "c3re-lang": "leicht", "c3re-fs": "125" }, session: {} });
    await page.goto("/kontakt/");
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
    await expect(page.locator("html")).toHaveAttribute("data-fs", "125");
    await page.evaluate(() => localStorage.setItem("c3re-simple", "1"));
    await page.locator("#a11y-toggle").click();
    await page.locator("#preferences-reset").click();
    expect(await storedValues(page)).toEqual({ local: { "c3re-theme": "light" }, session: {} });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-language", "standard");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("a shared link does not overwrite an explicitly saved language", async ({ page }) => {
    await preferences(page, { "c3re-lang": "std" });
    await mockServices(page);
    await page.goto("/kontakt/#sprache=leicht");
    await expect(page.locator("html")).toHaveAttribute("data-language", "easy");
    expect((await storedValues(page)).local).toEqual({ "c3re-lang": "std" });
});

test("live requests omit credentials and referrers and ignore response cookies", async ({ page, context }) => {
    await context.addCookies([{ name: "existing-test-session", value: "test-only", domain: ".c3re.de", path: "/", secure: true, sameSite: "None" }]);
    await page.addInitScript(() => {
        window.privacyFetches = [];
        const original = window.fetch;
        window.fetch = function (input, options) {
            window.privacyFetches.push({ url: String(input), credentials: options?.credentials, referrerPolicy: options?.referrerPolicy });
            return original.call(this, input, options);
        };
    });
    const headers = [];
    for (const origin of serviceOrigins) {
        await page.route(origin + "/**", async route => {
            headers.push(await route.request().allHeaders());
            await route.fulfill({
                headers: { "Access-Control-Allow-Origin": "*", "Set-Cookie": "unwanted-test-cookie=blocked; Path=/; SameSite=None; Secure" },
                json: origin === serviceOrigins[0] ? { state: { open: false } } : []
            });
        });
    }
    await page.goto("/");
    await expect(page.locator("#calendar")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator("#banner-status-label")).toContainText("geschlossen");
    expect(headers).toHaveLength(2);
    for (const header of headers) {
        expect(header.cookie).toBeUndefined();
        expect(header.authorization).toBeUndefined();
        expect(header.referer).toBeUndefined();
    }
    const fetches = await page.evaluate(() => window.privacyFetches);
    expect(fetches).toHaveLength(2);
    for (const request of fetches) {
        expect(request.credentials).toBe("omit");
        expect(request.referrerPolicy).toBe("no-referrer");
    }
    expect((await context.cookies()).map(cookie => cookie.name)).toEqual(["existing-test-session"]);
});

test("content policy blocks external scripts, frames, fonts and connections", async ({ page }) => {
    await mockServices(page);
    await page.goto("/");
    await page.route("https://third-party.invalid/**", route => route.abort());
    await page.evaluate(() => {
        window.privacyViolations = [];
        document.addEventListener("securitypolicyviolation", event => window.privacyViolations.push(event.effectiveDirective));
        const script = document.createElement("script");
        script.src = "https://third-party.invalid/tracker.js";
        document.body.append(script);
        const frame = document.createElement("iframe");
        frame.src = "https://third-party.invalid/embed";
        document.body.append(frame);
        new FontFace("Forbidden", "url(https://third-party.invalid/font.woff2)").load().catch(() => {});
        fetch("https://third-party.invalid/collect").catch(() => {});
    });
    await expect.poll(() => page.evaluate(() => window.privacyViolations)).toEqual(expect.arrayContaining(["script-src-elem", "frame-src", "font-src", "connect-src"]));
});
