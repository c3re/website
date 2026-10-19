import { createHash, timingSafeEqual } from "node:crypto";

function validCredentials(authorization, username, password) {
    const match = /^Basic[\t ]+([A-Za-z0-9+/]+={0,2})$/i.exec(authorization || "");
    if (!match) return false;

    let provided;
    try {
        const bytes = Uint8Array.from(atob(match[1]), character => character.charCodeAt(0));
        provided = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        return false;
    }

    // Fixed-size hashes avoid leaking either the value or length of the secret.
    const providedHash = createHash("sha256").update(provided).digest();
    const expectedHash = createHash("sha256").update(`${username}:${password}`).digest();
    return timingSafeEqual(providedHash, expectedHash);
}

function privateResponse(response) {
    const result = new Response(response.body, response);
    // Local text assets are UTF-8; declare it explicitly for standalone browser views.
    const mediaType = result.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
    if (mediaType === "text/plain") {
        result.headers.set("Content-Type", "text/plain; charset=utf-8");
    }
    result.headers.set("Cache-Control", "private, no-store");
    result.headers.append("Vary", "Authorization");
    return result;
}

export default {
    async fetch(request, env) {
        // Never expose the demo if the deployment is missing its secrets.
        if (typeof env.DEMO_USERNAME !== "string" || !env.DEMO_USERNAME ||
            typeof env.DEMO_PASSWORD !== "string" || !env.DEMO_PASSWORD) {
            return privateResponse(new Response("Demo-Zugang ist noch nicht eingerichtet.", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            }));
        }

        if (!validCredentials(request.headers.get("Authorization"), env.DEMO_USERNAME, env.DEMO_PASSWORD)) {
            return privateResponse(new Response("Bitte mit den Demo-Zugangsdaten anmelden.", {
                status: 401,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "WWW-Authenticate": 'Basic realm="c3RE Demo", charset="UTF-8"'
                }
            }));
        }

        const assetRequest = new Request(request);
        assetRequest.headers.delete("Authorization");
        return privateResponse(await env.ASSETS.fetch(assetRequest));
    }
};
