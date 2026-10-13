import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import worker from "../worker/index.mjs";

const credentials = { DEMO_USERNAME: "demo-test-user", DEMO_PASSWORD: "demo-test-password" };
const authorization = (username, password) => `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
const allowed = authorization(credentials.DEMO_USERNAME, credentials.DEMO_PASSWORD);

function environment(fetchAsset = () => { throw new Error("Unauthenticated request reached assets"); }) {
    return { ...credentials, ASSETS: { fetch: fetchAsset } };
}

test("all site paths and request methods require authentication before asset access", async () => {
    for (const path of ["/", "/kontakt/", "/css/style.css", "/audio/standard/startseite.mp3", "/dl/Satzung.pdf", "/missing/nested/page/"]) {
        for (const method of ["GET", "HEAD", "OPTIONS"]) {
            const response = await worker.fetch(new Request(`https://demo.example${path}`, { method }), environment());
            assert.equal(response.status, 401, `${method} ${path}`);
            assert.match(response.headers.get("WWW-Authenticate"), /^Basic realm="c3RE Demo"/);
            assert.equal(response.headers.get("Cache-Control"), "private, no-store");
        }
    }
});

test("incorrect usernames, passwords and malformed credentials remain denied", async () => {
    for (const header of [
        authorization("wrong-user", credentials.DEMO_PASSWORD),
        authorization(credentials.DEMO_USERNAME, "wrong-password"),
        authorization("", ""),
        "Bearer token", "Basic !!!", "Basic A", "Basic /w==", "Basic", `${allowed}, ${allowed}`
    ]) {
        const response = await worker.fetch(new Request("https://demo.example/", { headers: { Authorization: header } }), environment());
        assert.equal(response.status, 401);
    }
});

test("missing secrets fail closed instead of exposing files", async () => {
    for (const missing of [{ DEMO_PASSWORD: undefined }, { DEMO_USERNAME: undefined }, { DEMO_PASSWORD: "" }, { DEMO_USERNAME: "" }]) {
        const response = await worker.fetch(new Request("https://demo.example/", { headers: { Authorization: allowed } }), { ...environment(), ...missing });
        assert.equal(response.status, 503);
    }
});

test("authenticated files are streamed with private caching and without forwarding credentials", async () => {
    let assetRequest;
    const env = environment(request => {
        assetRequest = request;
        return new Response("audio bytes", { status: 206, headers: { "Content-Type": "audio/mpeg", "Content-Range": "bytes 0-10/100", "Cache-Control": "public, max-age=3600", Vary: "Accept-Encoding" } });
    });
    const response = await worker.fetch(new Request("https://demo.example/audio/demo.mp3?preview=1", {
        headers: { Authorization: allowed, Range: "bytes=0-10" }
    }), env);
    assert.equal(assetRequest.url, "https://demo.example/audio/demo.mp3?preview=1");
    assert.equal(assetRequest.headers.get("Authorization"), null);
    assert.equal(assetRequest.headers.get("Range"), "bytes=0-10");
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("Content-Range"), "bytes 0-10/100");
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    assert.match(response.headers.get("Vary"), /Accept-Encoding/);
    assert.match(response.headers.get("Vary"), /Authorization/);
    assert.equal(await response.text(), "audio bytes");
});

test("authenticated redirects, HEAD requests and missing pages preserve their behavior", async () => {
    for (const status of [200, 307, 404]) {
        const response = await worker.fetch(new Request("https://demo.example/kontakt", { method: "HEAD", headers: { Authorization: allowed } }), environment(request => {
            assert.equal(request.method, "HEAD");
            return new Response(null, { status, headers: status === 307 ? { Location: "/kontakt/" } : {} });
        }));
        assert.equal(response.status, status);
        if (status === 307) assert.equal(response.headers.get("Location"), "/kontakt/");
        assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    }
});

test("authentication supports UTF-8 credentials and case-insensitive Basic scheme", async () => {
    const env = { ...environment(() => new Response("ok")), DEMO_USERNAME: "test-ü", DEMO_PASSWORD: "test:päss" };
    const header = authorization(env.DEMO_USERNAME, env.DEMO_PASSWORD).replace("Basic", "basic");
    const response = await worker.fetch(new Request("https://demo.example/", { headers: { Authorization: header } }), env);
    assert.equal(response.status, 200);
});

test("deployed asset routing cannot bypass the authentication worker", async () => {
    const config = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
    assert.equal(config.main, "worker/index.mjs");
    assert.equal(config.assets.binding, "ASSETS");
    assert.equal(config.assets.run_worker_first, true);
    assert.equal(config.workers_dev, false);
    assert.equal(config.preview_urls, false);
    assert.deepEqual(config.secrets.required, ["DEMO_USERNAME", "DEMO_PASSWORD"]);
});
