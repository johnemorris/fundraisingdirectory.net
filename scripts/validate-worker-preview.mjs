import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { legacyRoutes } from "../src/data/legacyRoutes.js";
import { topicPublication } from "../src/data/topicPublication.js";
const base = process.env.WORKER_PREVIEW_ORIGIN ?? "http://127.0.0.1:8789";
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname), "Worker checks must target a local preview");
const canonicalOrigin = "https://fundraisingdirectory.net";
const paths = [...readFileSync("dist/sitemap.xml", "utf8").matchAll(/<loc>https:\/\/fundraisingdirectory.net([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const path of new Set([...paths, ...legacyRoutes.map((route) => `/${route.path}.html`)])) {
  const response = await fetch(base + path, { redirect: "manual" });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}${path}"`), `Canonical: ${path}`);
  const decision = topicPublication[path.slice(1, -5)];
  assert.ok(html.includes(`content="${decision?.indexing === "noindex" ? "noindex" : "index"}, follow"`), `Robots: ${path}`);
}
let redirects = 0;
for (const route of legacyRoutes) {
  const canonical = `/${route.path}.html`;
  for (const variant of [`/${route.path.toLowerCase()}`, `${canonical}/`]) {
    const response = await fetch(`${base}${variant}?audit=1`, { redirect: "manual" });
    assert.equal(response.status, 301, variant);
    assert.equal(response.headers.get("location"), `${base}${canonical}?audit=1`, variant);
    redirects++;
  }
}
const missing = await fetch(base + "/missing-seo-phase1-page", { redirect: "manual" });
assert.equal(missing.status, 404);
assert.match(await missing.text(), /Page Not Found/);
const filtered = await fetch(base + "/providers/?product=snacks", { redirect: "manual" });
assert.equal(filtered.status, 200);
assert.ok((await filtered.text()).includes(`<link rel="canonical" href="${canonicalOrigin}/providers/"`));
for (const path of ["/sitemap.xml", "/robots.txt"]) assert.equal((await fetch(base + path)).status, 200);
console.log(`Local Cloudflare preview passed: ${paths.length} indexable pages, all ${legacyRoutes.length} legacy routes, ${redirects} direct 301 variants, query canonical, robots/sitemap, and genuine 404.`);
