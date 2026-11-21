import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { legacyRoutes } from "../src/data/legacyRoutes.js";
import { topicPublication, validateTopicPublication } from "../src/data/topicPublication.js";

const origin = "https://fundraisingdirectory.net";
const topics = readdirSync("src/content/topics").filter((file) => file.endsWith(".md")).map((file) => load(readFileSync(`src/content/topics/${file}`, "utf8").split("---")[1]));
validateTopicPublication(topics, legacyRoutes);
const published = new Set(Object.entries(topicPublication).filter(([, decision]) => decision.indexing === "index").map(([path]) => path));
const outputPath = (path) => join("dist", path, "index.html");
const page = (path) => readFileSync(outputPath(path), "utf8");
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const entries = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)];
const urls = entries.map((entry) => entry[1]);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");
assert.ok(urls.length > 0, "Empty sitemap");
for (const [, url, lastmod] of entries) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, origin);
  assert.equal(parsed.search, "");
  const html = page(parsed.pathname);
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Incorrect canonical: ${url}`);
  if (lastmod) {
    assert.equal(new Date(lastmod).toISOString().slice(0, 10), lastmod);
    assert.ok(lastmod <= new Date().toISOString().slice(0, 10), `Future lastmod: ${url}`);
  }
}
const hub = page("/ideas/");
for (const route of legacyRoutes) {
  const path = `/${route.path}.html`;
  const html = page(path);
  const eligible = published.has(route.path) || ["Fundraising-Resources", "Fundraising-Articles"].includes(route.path);
  assert.equal(urls.includes(`${origin}${path}`), eligible, `Sitemap eligibility: ${path}`);
  assert.ok(html.includes(`content="${eligible ? "index" : "noindex"}, follow"`), `Robots: ${path}`);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`), `Canonical: ${path}`);
  if (topicPublication[route.path]) assert.match(html, /<a[^>]*href="\/ideas\/"[^>]*aria-current="location"/, `Ideas ancestor state: ${path}`);
  if (topicPublication[route.path]?.publication === "placeholder") assert.ok(html.includes("data-topic-placeholder"), `Unmarked incomplete topic: ${path}`);
  if (!["Fundraising-Resources", "Fundraising-Articles"].includes(route.path)) assert.ok(hub.includes(`href="${path}"`), `Hub orphan: ${path}`);
}
for (const topic of topics) {
  const path = `/${topic.legacyPath}.html`;
  const html = page(path);
  const body = html.match(/<div\b[^>]*data-topic-copy[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(body, `Missing guide body: ${path}`);
  assert.match(body, /<h2\b/, `Missing substantive sections: ${path}`);
  assert.ok(sitemap.includes(`<loc>${origin}${path}</loc><lastmod>`), `Missing lastmod: ${path}`);
  for (const recommendation of topic.providers) {
    const slug = recommendation.provider;
    assert.ok(html.includes(`data-provider-relationship="${recommendation.relationship}"`), `Missing provider relationship: ${path}`);
    const providerPath = `/providers/${slug}/`;
    assert.ok(html.includes(`href="${providerPath}"`), `Missing provider link: ${path}`);
    assert.ok(page(providerPath).includes(`href="${path}"`), `Missing provider backlink: ${path}`);
  }
  for (const related of topic.related) assert.ok(html.includes(`href="/${related}.html"`), `Missing related topic: ${path}`);
}
// Validate local destinations in every changed page, including fragments.
const affected = ["/ideas/", ...legacyRoutes.map((route) => `/${route.path}.html`), ...new Set(topics.flatMap((topic) => topic.providers.map((entry) => `/providers/${entry.provider}/`)))];
for (const path of affected) {
  for (const [, href] of page(path).matchAll(/href="([^\"]+)"/g)) {
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const destination = new URL(href.replaceAll("&amp;", "&"), `${origin}${path}`);
    const target = outputPath(destination.pathname);
    const asset = join("dist", destination.pathname);
    assert.ok(existsSync(target) || existsSync(asset), `Broken link on ${path}: ${href}`);
    if (destination.hash && existsSync(target)) assert.ok(page(destination.pathname).includes(`id="${decodeURIComponent(destination.hash.slice(1))}"`), `Broken fragment on ${path}: ${href}`);
  }
}
console.log(`Validated ${topics.length} guides, ${legacyRoutes.length - topics.length - 2} noindexed discovery pages, ${urls.length} unique sitemap URLs, provider backlinks, canonicals, and local links.`);

// Follow ordinary anchors from the homepage; canonical/style links do not count.
const htmlFiles = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name.endsWith(".html")) htmlFiles.push(path);
  }
}
collect("dist");
const pages = new Map(htmlFiles.map((file) => {
  const html = readFileSync(file, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  return [canonical ? new URL(canonical).pathname : file, html];
}));
const reached = new Set(["/"]);
const queue = ["/"];
while (queue.length) {
  const source = queue.shift();
  for (const [, href] of (pages.get(source) ?? "").matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const target = new URL(href.replaceAll("&amp;", "&"), origin + source);
    if (target.origin === origin && pages.has(target.pathname) && !reached.has(target.pathname)) { reached.add(target.pathname); queue.push(target.pathname); }
  }
}
for (const url of urls) assert.ok(reached.has(new URL(url).pathname), `Homepage orphan: ${url}`);
console.log(`All ${urls.length} indexable URLs are reachable from homepage HTML links.`);
