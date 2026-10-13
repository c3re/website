import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/browser",
    timeout: 45000,
    expect: { timeout: 10000 },
    fullyParallel: true,
    workers: 2,
    retries: 0,
    reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
    use: {
        baseURL: "http://127.0.0.1:4173",
        locale: "de-DE",
        timezoneId: "Europe/Berlin",
        viewport: { width: 1440, height: 1000 },
        colorScheme: "light",
        reducedMotion: "reduce",
        trace: "retain-on-failure",
        screenshot: "only-on-failure"
    },
    webServer: {
        command: "node tests/serve.mjs",
        url: "http://127.0.0.1:4173/",
        reuseExistingServer: false,
        timeout: 15000
    }
});
