import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// Test-only static server. HTTP/1.1 avoids connection reuse races in large browser runs.
const root = resolve(new URL("../public/", import.meta.url).pathname);
const port = Number(process.env.PORT || 4173);
const cache = new Map();
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".mp3": "audio/mpeg", ".pdf": "application/pdf", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8" };
const server = createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://127.0.0.1:${port}`);
        let path = resolve(root, "." + decodeURIComponent(url.pathname));
        if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
        if ((await stat(path)).isDirectory()) {
            if (!url.pathname.endsWith("/")) { response.writeHead(301, { Location: url.pathname + "/" + url.search }).end(); return; }
            path = resolve(path, "index.html");
        }
        if (!cache.has(path)) cache.set(path, await readFile(path));
        const content = cache.get(path);
        const headers = { "Content-Type": types[extname(path)] || "application/octet-stream", "Accept-Ranges": "bytes", "Cache-Control": "no-store" };
        let start = 0;
        let end = content.length - 1;
        let status = 200;
        const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || "");
        if (range) {
            start = Number(range[1]);
            end = range[2] ? Math.min(Number(range[2]), end) : end;
            if (start > end) { response.writeHead(416, { "Content-Range": `bytes */${content.length}` }).end(); return; }
            status = 206;
            headers["Content-Range"] = `bytes ${start}-${end}/${content.length}`;
        }
        headers["Content-Length"] = Math.max(0, end - start + 1);
        response.writeHead(status, headers);
        response.end(request.method === "HEAD" ? undefined : content.subarray(start, end + 1));
    } catch (error) {
        if (error.code === "ENOENT" && request.headers.accept?.includes("text/html")) {
            const fallback = await readFile(resolve(root, "404.html")).catch(() => null);
            if (fallback) {
                response.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": fallback.length });
                response.end(request.method === "HEAD" ? undefined : fallback);
                return;
            }
        }
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
});
server.keepAliveTimeout = 65000;
server.listen(port, "127.0.0.1", () => console.log(`Test server: http://127.0.0.1:${port}`));
