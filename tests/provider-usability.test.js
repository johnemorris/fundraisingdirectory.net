import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import { providerSchema } from "../src/data/providerSchema.ts";
import {
  buildProviderSearchText,
  providerSearchMatches,
} from "../src/lib/providerSearch.ts";

const loadProviders = async () => Promise.all(
  (await readdir("src/content/providers"))
    .filter((file) => file.endsWith(".yaml"))
    .map(async (file) => providerSchema.parse(load(await readFile(`src/content/providers/${file}`, "utf8")))),
);

test("provider search covers all 47 active records, aliases, and descriptive content", async () => {
  const providers = (await loadProviders()).filter((provider) => !provider.meta.deleted && provider.status.lifecycle === "active");
  assert.equal(providers.length, 47);

  const searchable = providers.map((provider) => ({
    provider,
    searchText: buildProviderSearchText(provider),
  }));
  const matches = (query) => searchable.filter(({ searchText }) => providerSearchMatches(searchText, query));

  assert.deepEqual(matches("  BOX    tops  ").map(({ provider }) => provider.identity.slug), ["box-tops-for-education"]);
  assert.deepEqual(matches("Charitable Adult Rides").map(({ provider }) => provider.identity.slug), ["cars-vehicle-donation"]);
  assert.ok(matches("meal scheduling").some(({ provider }) => provider.identity.slug === "supportnow"));
  assert.equal(matches("words-that-do-not-exist-together").length, 0);
});

test("bottom provider CTA uses canonical official destinations for every active provider", async () => {
  const providers = (await loadProviders()).filter((provider) => !provider.meta.deleted && provider.status.lifecycle === "active");
  const destinations = providers.map((provider) => ({
    slug: provider.identity.slug,
    expected: provider.identity.fundraising_url ?? provider.identity.website,
  }));

  destinations.forEach(({ expected }) => assert.doesNotThrow(() => new URL(expected)));
  assert.equal(new Set(destinations.map(({ slug }) => slug)).size, 47);

  const [profilePage, bottomCta] = await Promise.all([
    readFile("src/pages/providers/[slug].astro", "utf8"),
    readFile("src/components/ProviderBottomCta.astro", "utf8"),
  ]);
  assert.match(profilePage, /const outboundUrl = identity\.fundraising_url \?\? identity\.website/);
  assert.match(profilePage, /<ProviderBottomCta[\s\S]*href=\{outboundUrl\}/);
  assert.match(bottomCta, /data-placement="profile_bottom"/);
  assert.match(bottomCta, /\{href && \(/);
});

test("analytics source excludes raw provider queries, Finder answers, and commercial data", async () => {
  const [directory, finder, analytics] = await Promise.all([
    readFile("src/pages/providers/index.astro", "utf8"),
    readFile("src/components/finder/FinderExperience.astro", "utf8"),
    readFile("src/lib/analytics.ts", "utf8"),
  ]);

  assert.match(directory, /query_length: queryLength/);
  assert.doesNotMatch(directory, /parameters:\s*\{[^}]*query:/s);
  assert.match(finder, /answered_question_count:/);
  assert.doesNotMatch(finder, /parameters:\s*\{[^}]*answers:/s);
  assert.doesNotMatch(analytics, /affiliate|sponsor|commercial/i);
});

test("directory compact mode reuses the live search control and synchronized result count", async () => {
  const directory = await readFile("src/pages/providers/index.astro", "utf8");

  assert.equal(directory.match(/<ProviderSearch \/>/g)?.length, 1);
  assert.match(directory, /data-directory-results-panel/);
  assert.match(directory, /data-directory-search-sentinel/);
  assert.match(directory, /data-directory-compact-toolbar hidden aria-hidden="true"/);
  assert.match(directory, /data-compact-filter-summary/);
  assert.match(directory, /target\.append\(searchControl\)/);
  assert.match(directory, /searchHome\.style\.height = `\$\{searchHome\.getBoundingClientRect\(\)\.height\}px`/);
  assert.match(directory, /searchHome\?\.style\.removeProperty\("height"\)/);
  assert.match(directory, /compactSummary\.textContent = `Showing \$\{visibleCount\} of \$\{cards\.length\} providers`/);
  assert.match(directory, /searchSentinel\.getBoundingClientRect\(\)\.top <= navigationRect\.bottom/);
  assert.match(directory, /--directory-toolbar-width/);
  assert.match(directory, /has-directory-compact-toolbar/);
  assert.doesNotMatch(directory, /data-directory-compact-toolbar-spacer/);
  assert.match(directory, /toolbarRect\.bottom \+ 14/);
  assert.match(directory, /--directory-facet-sticky-top/);
  assert.ok(directory.indexOf('compactToolbar.style.setProperty("--directory-toolbar-top"') < directory.indexOf("const shouldBeCompact"));
  assert.doesNotMatch(directory, /transform:\s*translateY\(-0\.25rem\)/);
  assert.doesNotMatch(directory, /animation:\s*compact-toolbar-in/);
  assert.doesNotMatch(directory, /addEventListener\("animationend"/);
  assert.doesNotMatch(directory, /requestCompactToolbarUpdate|compactToolbarFrame|requestAnimationFrame\(updateCompactToolbar\)/);
  assert.match(directory, /window\.addEventListener\("scroll", updateCompactToolbar/);
  assert.match(directory, /returnToFilteredResults\(\)/);
});
