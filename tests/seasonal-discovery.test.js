import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import { legacyRoutes } from "../src/data/legacyRoutes.js";
import {
  getLocalSeasonForDate,
  getOrderedSeasonalPlans,
  getPublishedSeasonalGuides,
  getSeasonForDate,
  SEASON_IDS,
  SEASONAL_PLANS,
} from "../src/data/seasonal.ts";
import { applyActiveSeason } from "../src/lib/seasonalRuntime.ts";
import { topicPublication } from "../src/data/topicPublication.js";

test("seasonal rotation maps every UTC month deterministically to spring, summer, fall, or winter", () => {
  const expectedByMonth = [
    "winter", // Jan
    "winter", // Feb
    "spring", // Mar
    "spring", // Apr
    "spring", // May
    "summer", // Jun
    "summer", // Jul
    "summer", // Aug
    "fall",   // Sep
    "fall",   // Oct
    "fall",   // Nov
    "winter", // Dec
  ];

  expectedByMonth.forEach((expected, monthIndex) => {
    const date = new Date(Date.UTC(2026, monthIndex, 15, 12, 0, 0));
    assert.equal(getSeasonForDate(date), expected, `Month ${monthIndex + 1} should map to ${expected}`);
    const ordered = getOrderedSeasonalPlans(date);
    assert.equal(ordered.currentSeasonId, expected);
    assert.equal(ordered.currentSeason.id, expected);
    assert.equal(ordered.seasons.length, 4);
  });
});

test("seasonal plans reference only published, indexable guides and never promote noindex placeholders", async () => {
  const routeSet = new Set(legacyRoutes.map((route) => route.path));
  const topicFiles = await readdir("src/content/topics");
  const topicPaths = new Set(
    await Promise.all(
      topicFiles
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => load((await readFile(`src/content/topics/${file}`, "utf8")).split("---")[1]).legacyPath),
    ),
  );

  assert.deepEqual(
    SEASONAL_PLANS.map((plan) => plan.id),
    [...SEASON_IDS],
  );

  for (const plan of SEASONAL_PLANS) {
    assert.ok(plan.timingGuidance.length > 30, `Missing timing guidance for ${plan.id}`);
    assert.ok(plan.guides.length >= 4, `Expected at least 4 guides for ${plan.id}`);
    const published = getPublishedSeasonalGuides(plan);
    assert.equal(
      published.length,
      plan.guides.length,
      `Every guide in ${plan.id} must be published and indexable`,
    );

    const seenGuides = new Set();
    for (const guide of plan.guides) {
      assert.ok(!seenGuides.has(guide.legacyPath), `Duplicate guide ${guide.legacyPath} in ${plan.id}`);
      seenGuides.add(guide.legacyPath);
      assert.ok(routeSet.has(guide.legacyPath), `Unknown route ${guide.legacyPath}`);
      assert.ok(topicPaths.has(guide.legacyPath), `Missing topic content for ${guide.legacyPath}`);
      assert.equal(topicPublication[guide.legacyPath]?.publication, "guide");
      assert.equal(topicPublication[guide.legacyPath]?.indexing, "index");
    }
  }

  const fakePlanWithPlaceholder = {
    ...SEASONAL_PLANS[0],
    guides: [
      ...SEASONAL_PLANS[0].guides,
      { legacyPath: "Fruit", note: "Placeholder should be excluded." },
    ],
  };
  assert.equal(
    getPublishedSeasonalGuides(fakePlanWithPlaceholder).some((entry) => entry.legacyPath === "Fruit"),
    false,
    "getPublishedSeasonalGuides must exclude noindex placeholders",
  );
});

test("seasonal provider links resolve to active source-backed profiles and distinguish seasonal vs year-round programs", async () => {
  for (const plan of SEASONAL_PLANS) {
    assert.ok(plan.programs.length >= 4, `Expected at least 4 programs for ${plan.id}`);
    const seenProviders = new Set();

    for (const entry of plan.programs) {
      assert.ok(!seenProviders.has(entry.providerSlug), `Duplicate provider ${entry.providerSlug} in ${plan.id}`);
      seenProviders.add(entry.providerSlug);
      assert.ok(["seasonal", "year-round"].includes(entry.seasonality));

      const provider = load(await readFile(`src/content/providers/${entry.providerSlug}.yaml`, "utf8"));
      assert.equal(provider.identity.slug, entry.providerSlug);
      assert.equal(provider.meta.deleted, false);
      assert.equal(provider.status.lifecycle, "active");
      assert.ok(provider.verification.sources.length > 0);

      if (entry.providerSlug === "dutch-mill-bulbs") {
        assert.equal(entry.seasonality, "seasonal");
      } else {
        assert.equal(entry.seasonality, "year-round");
      }
    }
  }

  const springPrograms = SEASONAL_PLANS.find((plan) => plan.id === "spring")?.programs ?? [];
  const fallPrograms = SEASONAL_PLANS.find((plan) => plan.id === "fall")?.programs ?? [];
  assert.ok(springPrograms.some((entry) => entry.providerSlug === "dutch-mill-bulbs"));
  assert.ok(fallPrograms.some((entry) => entry.providerSlug === "dutch-mill-bulbs"));

  for (const file of ["elementary-school.md", "4-h.md"]) {
    const frontmatter = load((await readFile(`src/content/topics/${file}`, "utf8")).split("---")[1]);
    assert.ok(
      frontmatter.providers.some((entry) => entry.provider === "dutch-mill-bulbs"),
      `${file} should include contextual discovery link to dutch-mill-bulbs`,
    );
  }
});

test("runtime local-date selection rotates across season boundaries without rebuild", () => {
  assert.equal(getLocalSeasonForDate(new Date(2026, 10, 30, 23, 59)), "fall");
  assert.equal(getLocalSeasonForDate(new Date(2026, 11, 1, 0, 0)), "winter");
  assert.equal(getLocalSeasonForDate(new Date(2026, 1, 28, 23, 59)), "winter");
  assert.equal(getLocalSeasonForDate(new Date(2026, 2, 1, 0, 0)), "spring");
  assert.equal(getLocalSeasonForDate(new Date(2026, 4, 31, 23, 59)), "spring");
  assert.equal(getLocalSeasonForDate(new Date(2026, 5, 1, 0, 0)), "summer");
  assert.equal(getLocalSeasonForDate(new Date(2026, 7, 31, 23, 59)), "summer");
  assert.equal(getLocalSeasonForDate(new Date(2026, 8, 1, 0, 0)), "fall");

  const makeLink = (id) => {
    const classes = new Set(id === "fall" ? ["is-current"] : []);
    const pill = { hidden: id !== "fall", dataset: {} };
    return {
      hidden: false,
      dataset: { seasonLink: id },
      classes,
      pill,
      classList: {
        toggle(token, force) {
          const next = force ?? !classes.has(token);
          if (next) classes.add(token);
          else classes.delete(token);
          return next;
        },
      },
      querySelector(selector) {
        return selector === "[data-season-pill]" ? pill : null;
      },
    };
  };

  const features = SEASON_IDS.map((id) => ({
    hidden: id !== "fall",
    dataset: { seasonFeature: id },
  }));
  const links = SEASON_IDS.map(makeLink);
  const root = {
    dataset: { activeSeason: "fall" },
    querySelectorAll(selector) {
      if (selector === "[data-season-feature]") return features;
      if (selector === "[data-season-link]") return links;
      return [];
    },
  };

  assert.equal(applyActiveSeason(root, new Date(2026, 10, 30, 12, 0)), "fall");
  assert.equal(features.find((el) => el.dataset.seasonFeature === "fall").hidden, false);
  assert.equal(features.find((el) => el.dataset.seasonFeature === "winter").hidden, true);

  assert.equal(applyActiveSeason(root, new Date(2026, 11, 1, 12, 0)), "winter");
  assert.equal(root.dataset.activeSeason, "winter");
  assert.equal(features.find((el) => el.dataset.seasonFeature === "fall").hidden, true);
  assert.equal(features.find((el) => el.dataset.seasonFeature === "winter").hidden, false);
  assert.equal(links.find((el) => el.dataset.seasonLink === "winter").classes.has("is-current"), true);
  assert.equal(links.find((el) => el.dataset.seasonLink === "winter").pill.hidden, false);
  assert.equal(links.find((el) => el.dataset.seasonLink === "fall").classes.has("is-current"), false);
  assert.equal(links.find((el) => el.dataset.seasonLink === "fall").pill.hidden, true);

  assert.equal(applyActiveSeason(root, new Date(2026, 1, 28, 12, 0)), "winter");
  assert.equal(applyActiveSeason(root, new Date(2026, 2, 1, 12, 0)), "spring");
  assert.equal(root.dataset.activeSeason, "spring");
  assert.equal(features.find((el) => el.dataset.seasonFeature === "spring").hidden, false);
  assert.equal(features.find((el) => el.dataset.seasonFeature === "winter").hidden, true);
});
