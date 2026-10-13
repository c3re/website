import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { publishedPages } from "./helpers.mjs";

const output = new URL("../a11y-reports/lighthouse/", import.meta.url);
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ["tests/serve.mjs"], { env: { ...process.env, PORT: "4174" }, stdio: ["ignore", "pipe", "inherit"] });
let browser;
const results = [];
try {
    await Promise.race([
        once(server.stdout, "data"),
        once(server, "exit").then(() => { throw new Error("Lighthouse test server did not start"); })
    ]);
    browser = await chromium.launch({ args: ["--remote-debugging-port=9335"] });
    for (const path of await publishedPages()) {
        const { lhr, report } = await lighthouse("http://127.0.0.1:4174" + path, {
            port: 9335,
            onlyCategories: ["accessibility"],
            output: "json",
            logLevel: "error",
            formFactor: "desktop",
            screenEmulation: { mobile: false, width: 1440, height: 1000, deviceScaleFactor: 1, disabled: false },
            throttlingMethod: "provided",
            blockedUrlPatterns: ["https://spaceapi.c3re.de/*", "https://ical2json.c3re.de/*"]
        });
        const failures = Object.values(lhr.audits).filter(audit => audit.score !== null && audit.score < 1).map(audit => ({ id: audit.id, title: audit.title }));
        results.push({ path, score: lhr.categories.accessibility.score, failures, version: lhr.lighthouseVersion, date: lhr.fetchTime });
        await writeFile(new URL(path.replaceAll("/", "_") + ".json", output), report);
        console.log(`${path}: ${Math.round(lhr.categories.accessibility.score * 100)}/100 ${failures.map(f => f.id).join(", ")}`);
    }
    await writeFile(new URL("summary.json", output), JSON.stringify(results, null, 2));
    if (results.some(result => result.failures.length)) process.exitCode = 1;
} finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
}
