import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

// Protect the original page text, not whitespace at the end of a Markdown file.
const originals = ["_index.md", "codeweek.md", "datenschutz.md", "downloads.md", "impressum.md", "kontakt.md", "news/_index.md", "news/test_diday_feb.md", "test.md", "unsere-philosophie.md", "unvereinbarkeitserklaerung.md"];
const body = text => text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "").trimEnd();

for (const file of originals) {
    test(`Originaltext bleibt erhalten: ${file}`, async () => {
        const original = execFileSync("git", ["show", `dd22591:content/${file}`], { encoding: "utf8" });
        const current = await readFile(new URL(`../content/${file}`, import.meta.url), "utf8");
        assert.equal(body(current), body(original));
        assert.match(current, /\neasy:\n/);
    });
}
