import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import { providerSchema } from "../src/data/providerSchema.ts";
import { isFeaturedEligible, selectFeaturedProvider } from "../src/data/featuredProviders.ts";
import { comparisonRecord, normalizeComparisonSelection } from "../src/data/providerComparison.ts";
import { dateWindowState, dateWindowStatus } from "../src/lib/dateWindow.ts";
import { inventoryFundraiserResult } from "../src/lib/fundraisingMath.ts";
import { searchSite } from "../src/lib/siteSearch.ts";
import { rankProviderMatches } from "../src/lib/finderScoring.js";
import { serializeFinderProvider } from "../src/data/finderProviders.ts";
import { DIRECTORY_METHOD_OPTIONS } from "../src/data/semanticTaxonomy.ts";
import { formatProviderLabel } from "../src/data/providerLabels.ts";
import { breadcrumbData, providerItemList } from "../src/data/structuredData.ts";

const readProvider = async (slug) => providerSchema.parse(load(await readFile(`src/content/providers/${slug}.yaml`, "utf8")));
const allProviders = async () => Promise.all((await readdir("src/content/providers")).filter((file) => file.endsWith(".yaml")).map((file) => readProvider(file.slice(0, -5))));

test("featured eligibility rejects incomplete, stale, future and unsupported records without fallback", async () => {
  const good = await readProvider("givebutter");
  const weak = await readProvider("fundraising-com");
  assert.equal(isFeaturedEligible(good, "2026-11-20"), true);
  assert.equal(isFeaturedEligible(weak, "2026-11-20"), false);
  assert.equal(isFeaturedEligible(good, "2027-02-17"), false);
  assert.equal(isFeaturedEligible(good, "2026-11-17"), false);
  for (const mutate of [p => p.verification.review_status = "needs-recheck", p => p.verification.sources[0].status = "stale", p => p.programs[0].logistics.status = "not-researched", p => p.verification.completeness = "minimal"]) {
    const candidate = structuredClone(good); mutate(candidate);
    assert.equal(isFeaturedEligible(candidate, "2026-11-20"), false);
  }
  assert.equal(selectFeaturedProvider([{ data: weak }], "2026-11-20"), undefined);
});

test("two real answers yield product-sale school matches with specific, noncommercial reasons", async () => {
  const providers = await allProviders();
  const matches = rankProviderMatches(providers.map(serializeFinderProvider), { group: "schools", methods: ["product-sales"] }).filter((match) => match.score > 0).slice(0, 5);
  assert.equal(matches.length, 5);
  for (const match of matches) {
    assert.equal(match.method, "product-sales");
    assert.ok(providers.find(p => p.identity.slug === match.providerSlug).classification.organizations.includes("schools"));
    assert.match(match.reasons.join(" "), /Schools/);
    assert.ok(match.reasons.some((reason) => reason.includes(match.programName)));
    assert.doesNotMatch(match.reasons.join(" "), /flexible place|sponsor|affiliate/i);
  }
});

test("every directory method chip has a matching filter without changing stable slugs", async () => {
  const options = new Set(DIRECTORY_METHOD_OPTIONS.map(({ value }) => value));
  for (const provider of await allProviders()) for (const method of provider.classification.methods) assert.ok(options.has(method), method);
  assert.equal(formatProviderLabel("us-nationwide"), "US nationwide");
  assert.equal(formatProviderLabel("candy-chocolate"), "Candy & chocolate");
  assert.equal(formatProviderLabel("gifts-seasonal"), "Gifts & seasonal products");
});

test("comparison preserves conditional program economics, missing terms and source dates", async () => {
  const good = comparisonRecord(await readProvider("givebutter"));
  assert.match(good.fields[2].join(" "), /0%/);
  assert.match(good.fields[2].join(" "), /3%/);
  assert.match(good.fields[3].join(" "), /2\.9%/);
  assert.match(good.fields[3].join(" "), /\$0\.30/);
  assert.doesNotMatch(good.fields[2].join(" "), /2\.9%/);
  assert.match(good.fields[9].join(" "), /checked 2026-/);
  const weak = comparisonRecord(await readProvider("fundraising-com"));
  assert.match(weak.fields[2].join(" "), /Not yet researched/);
  assert.doesNotMatch(weak.fields[2].join(" "), /0%|\$0/);
});

test("comparison selection deduplicates, validates and caps shared URL state at four", () => {
  assert.deepEqual(normalizeComparisonSelection(["a", "a", "unknown", "b", "c", "d", "e"], ["a", "b", "c", "d", "e"]), ["a", "b", "c", "d"]);
});

test("Panera and Givebutter date status is inclusive and distinguishes upcoming, current and expired without rebuilds", () => {
  const window = { start_date: "2026-12-01", end_date: "2026-12-21" };
  for (const date of ["2026-11-20", "2026-11-30"]) {
    assert.match(dateWindowState(window, date), /Upcoming/);
    assert.equal(dateWindowStatus(window, date), "upcoming");
  }
  for (const date of ["2026-12-01", "2026-12-15", "2026-12-21"]) {
    assert.match(dateWindowState(window, date), /Within stated dates/);
    assert.equal(dateWindowStatus(window, date), "active");
  }
  for (const date of ["2026-12-22", "2027-01-01"]) {
    assert.match(dateWindowState(window, date), /Offer ended/);
    assert.equal(dateWindowStatus(window, date), "expired");
  }
  const givingTuesdayWindow = { start_date: "2026-12-01", end_date: "2026-12-02" };
  assert.equal(dateWindowStatus(givingTuesdayWindow, "2026-11-30"), "upcoming");
  assert.equal(dateWindowStatus(givingTuesdayWindow, "2026-12-01"), "active");
  assert.equal(dateWindowStatus(givingTuesdayWindow, "2026-12-02"), "active");
  assert.equal(dateWindowStatus(givingTuesdayWindow, "2026-12-03"), "expired");
  assert.equal(dateWindowState(null, "2026-12-01"), null);
  assert.equal(dateWindowStatus(null, "2026-12-01"), null);
});

test("inventory calculator charges for unsold inventory and handles loss, zero and invalid scenarios", () => {
  assert.deepEqual(inventoryFundraiserResult(200, 150, 1, 2, 0), { revenue: 300, costs: 200, net: 100, unsold: 50 });
  assert.equal(inventoryFundraiserResult(200, 200, 1, 2, 30).net, 170);
  assert.equal(inventoryFundraiserResult(100, 10, 2, 3, 20).net, -190);
  assert.equal(inventoryFundraiserResult(0, 0, 0, 0, 0).net, 0);
  for (const args of [[2, 3, 1, 2, 0], [2.5, 1, 1, 2, 0], [2, 1, -1, 2, 0], [Infinity, 1, 1, 2, 0]]) assert.equal(inventoryFundraiserResult(...args), null);
});

test("global search matches cross-site terms and prioritizes exact provider names", () => {
  const records = [{ title: "Candy Fundraising", href: "/Candy.html", type: "Guide", text: "Chocolate sales" }, { title: "Givebutter", href: "/providers/givebutter/", type: "Provider", text: "Online donations" }, { title: "Chocolate supplier", href: "/providers/example/", type: "Provider", text: "Candy and chocolate" }];
  assert.equal(searchSite(records, "candy").length, 2);
  assert.equal(searchSite(records, "GIVEBUTTER")[0].title, "Givebutter");
  assert.deepEqual(searchSite(records, ""), []);
  assert.deepEqual(searchSite(records, "words not found"), []);
});

test("structured data follows visible breadcrumb order and exact provider inventory", async () => {
  const crumbs = breadcrumbData([{ label: "Home", href: "/" }, { label: "Providers", dynamic: "group-parent" }, { label: "Category", dynamic: "group" }], "/providers/");
  assert.equal(crumbs.itemListElement.length, 2);
  assert.equal(crumbs.itemListElement[1].item, "https://fundraisingdirectory.net/providers/");
  const data = providerItemList([await readProvider("givebutter")], "/providers/");
  assert.equal(data.numberOfItems, 1);
  assert.equal(data.itemListElement[0].name, "Givebutter");
  assert.doesNotMatch(JSON.stringify(data), /AggregateRating|Review|ratingValue/);
});

test("Privacy matches mailto form and excludes owner-rejected fixed promises", async () => {
  const privacy = await readFile("src/pages/privacy.astro", "utf8");
  const wizard = await readFile("src/components/ProviderListingWizard.astro", "utf8");
  assert.match(privacy, /opens your own email app/);
  assert.match(privacy, /optional[\s\S]*phone/);
  assert.match(privacy, /not established a fixed retention period/);
  assert.doesNotMatch(privacy, /24 months|within 30|never published|do not sell or rent|does not include.*contact form/s);
  assert.match(wizard, /mailto:/);
  assert.match(wizard, /data-contact-email=\{SITE_CONTACT_EMAIL\} novalidate hidden/);
  assert.match(wizard, /form\.hidden = false/);
  assert.doesNotMatch(wizard, /fetch\(|localStorage/);
});
