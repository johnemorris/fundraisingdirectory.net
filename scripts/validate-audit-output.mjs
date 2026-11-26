import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
const files = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true })).map((entry) => entry.isDirectory() ? files(`${dir}/${entry.name}`) : `${dir}/${entry.name}`))).flat();
const read = (path) => readFile(`dist/${path}`, "utf8");
const directory = await read("providers/index.html");
const category = await read("providers/schools/index.html");
const cards = (html) => [...html.matchAll(/<article\b[^>]*\bdata-organizations="([^"]+)"/g)];
assert.equal(cards(directory).length, 49);
assert.equal(cards(category).length, 44);
cards(category).forEach((match) => assert.ok(match[1].split(",").includes("schools")));
assert.ok(category.includes('rel="canonical" href="https://fundraisingdirectory.net/providers/schools/"'));
assert.ok(category.includes('content="index, follow"'));
assert.ok((await read("sitemap.xml")).includes("https://fundraisingdirectory.net/providers/schools/"));
assert.ok((await read("index.html")).match(/id="featured-title"[^>]*>Givebutter<\/h2>/));
assert.doesNotMatch(directory, /Best suited for|✓\s*Research in progress/);
const privacy = await read("privacy/index.html");
assert.doesNotMatch(privacy, /24 months|within 30 days|never published|do not sell or rent/);
assert.match(privacy, /not established a fixed retention period/);
const panera = await read("providers/panera-bread-fundraising/index.html");
assert.match(panera, /data-start-date="2026-12-01" data-end-date="2026-12-21"/);
assert.match(panera, /Dated offer.*stated dates/);
assert.match(panera, /Feature availability/);
const fundraiseUp = await read("providers/fundraise-up/index.html");
assert.match(fundraiseUp, /Ramadan Giving scheduled multi-night donation calendar element/);
assert.match(fundraiseUp, /AI Coach for individual P2P fundraisers/);
const givebutter = await read("providers/givebutter/index.html");
assert.match(givebutter, /data-start-date="2026-12-01" data-end-date="2026-12-02"/);
const ideas = await read("ideas/index.html");
assert.match(ideas, /data-start-date="2026-12-01" data-end-date="2026-12-21"/);
const search = await read("search/index.html");
const searchRecords = JSON.parse(search.match(/<script type="application\/json" data-site-search-records[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(searchRecords.filter(({ type }) => type === "Provider").length, 49);
assert.equal(searchRecords.filter(({ type }) => type === "Guide").length, 15);
assert.ok(search.includes('content="noindex, follow"'));
let graphs = 0, articles = 0, lists = 0, breadcrumbs = 0, assets = 0;
for (const path of (await files("dist")).filter((path) => path.endsWith(".html"))) {
  const html = await readFile(path, "utf8");
  for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(match[1]); graphs++;
    assert.equal(data["@context"], "https://schema.org", path);
    assert.ok(!["Review", "AggregateRating", "Organization", "FAQPage"].includes(data["@type"]), `Unsupported claims in ${path}`);
    if (data["@type"] === "Article") { articles++; assert.ok(html.includes(`datetime="${data.dateModified}"`), `Visible article date in ${path}`); }
    if (data["@type"] === "ItemList") { lists++; assert.equal(data.numberOfItems, cards(html).length); }
    if (data["@type"] === "BreadcrumbList") { breadcrumbs++; data.itemListElement.forEach((item, index) => { assert.equal(item.position, index + 1); assert.ok(item.name && item.item.startsWith("https://fundraisingdirectory.net/")); }); }
  }
  for (const match of html.matchAll(/\bsrc="(\/[^"?#]+)(?:[^"\s]*)?"/g)) { await access(`dist${match[1]}`); assets++; }
}
assert.equal(articles, 15);
assert.equal(lists, 2);
console.log(`Audit output passed: 49 providers / 44 school matches; 49+15 search records; ${graphs} JSON-LD graphs (${breadcrumbs} breadcrumbs, 15 articles, 2 lists); ${assets} asset references; Privacy and dated-offer fallback.`);
