import assert from "node:assert/strict";
import test from "node:test";
import { serializeFinderProvider } from "../src/data/finderProviders.ts";
import {
  evaluateGroupSizeFit,
  evaluateSetupTimingFit,
  normalizeFinderAnswers,
  rankProviderMatches,
} from "../src/lib/finderScoring.js";

function provider({
  name,
  slug,
  organizations = ["schools"],
  method = "direct-donations",
  channels = ["online"],
  products = ["donation-platform"],
  inventory = "not-applicable",
  upfront = "none",
  effort = "easy",
  affiliation = "none",
  outcomes,
  requirementsStatus = "known",
  minimumGroupSize = null,
  timingStatus = "known",
  setupLeadTime = null,
}) {
  return {
    identity: { name, slug, profilePath: `/providers/${slug}/` },
    classification: { organizations, methods: [method], products_services: products },
    programs: [{
      name: `${name} Program`,
      method,
      channels,
      products_services: products,
      inventory_model: inventory,
      upfront_cost: upfront,
      ease_to_raise: effort,
      requirements: { status: requirementsStatus, minimum_group_size: minimumGroupSize },
      timing: { status: timingStatus, setup_lead_time: setupLeadTime },
      ...(outcomes ? { outcomes } : {}),
    }],
    geography: { scope: ["us-nationwide"], countries: ["US"], states: [], regions: [] },
    affiliation: { type: affiliation },
  };
}

test("hard constraints exclude directly mismatched programs", () => {
  const productProvider = provider({ name: "Product Co", slug: "product-co", method: "product-sales", products: ["candy-chocolate"], inventory: "upfront-inventory" });
  assert.deepEqual(rankProviderMatches([productProvider], { products: "no", constraints: ["no-food", "no-inventory"] }), []);
});

test("group type materially affects provider ranking", () => {
  const school = provider({ name: "School Fit", slug: "school-fit", organizations: ["schools"] });
  const team = provider({ name: "Team Fit", slug: "team-fit", organizations: ["sports-athletics"] });
  const results = rankProviderMatches([school, team], { group: "sports-athletics" });
  assert.equal(results[0].providerSlug, "team-fit");
  assert.ok(results[0].score > results[1].score);
});

test("method and format preferences affect ranking", () => {
  const online = provider({ name: "Online Donations", slug: "online", method: "crowdfunding", channels: ["online"] });
  const event = provider({ name: "Community Event", slug: "event", method: "events-activities", channels: ["in-person"], effort: "hands-on" });
  const results = rankProviderMatches([event, online], { methods: ["crowdfunding"], format: "online" });
  assert.equal(results[0].providerSlug, "online");
});

test("missing provider data lowers confidence without creating a fake match", () => {
  const known = provider({ name: "Known", slug: "known", upfront: "none", effort: "easy" });
  const unknown = provider({ name: "Unknown", slug: "unknown", upfront: "unknown", effort: null });
  const results = rankProviderMatches([unknown, known], { budget: "none", effort: "easy" });
  assert.equal(results[0].providerSlug, "known");
  const unknownResult = results.find((result) => result.providerSlug === "unknown");
  assert.ok(unknownResult.confidence < results[0].confidence);
  assert.ok(!unknownResult.matchedConstraints.includes("No documented upfront cost"));
});

test("affiliate, sponsor, featured, and commercial metadata have zero ranking effect", () => {
  const organic = provider({ name: "Same Provider", slug: "same", affiliation: "none" });
  const commercial = structuredClone(organic);
  commercial.affiliation.type = "affiliate";
  commercial.editorial = { featured: true };
  commercial.commercial_research = { affiliate_status: "approved", commission_structure: "must never score" };
  assert.deepEqual(rankProviderMatches([organic], { group: "schools", format: "online" }), rankProviderMatches([commercial], { group: "schools", format: "online" }));
  commercial.affiliation.type = "sponsor";
  assert.deepEqual(rankProviderMatches([organic], { group: "schools", format: "online" }), rankProviderMatches([commercial], { group: "schools", format: "online" }));
});

test("Finder serialization includes approved program outcomes and excludes commercial state", () => {
  const input = provider({ name: "Serialized", slug: "serialized", outcomes: ["equipment"], affiliation: "sponsor" });
  input.editorial = { featured: true };
  input.commercial_research = { affiliate_status: "approved" };
  const serialized = serializeFinderProvider(input);
  assert.deepEqual(serialized.programs[0].outcomes, ["equipment"]);
  assert.deepEqual(serialized.programs[0].requirements, { status: "known", minimum_group_size: null });
  assert.deepEqual(serialized.programs[0].timing, { status: "known", setup_lead_time: null });
  assert.equal("affiliation" in serialized, false);
  assert.equal("editorial" in serialized, false);
  assert.equal("commercial_research" in serialized, false);
});

test("identical inputs produce deterministic ordering", () => {
  const providers = [
    provider({ name: "Zulu", slug: "zulu" }),
    provider({ name: "Alpha", slug: "alpha" }),
  ];
  const answers = { group: "schools", outcome: "cash", constraints: ["no-upfront-cost"] };
  const first = rankProviderMatches(providers, answers);
  const second = rankProviderMatches([...providers].reverse(), answers);
  assert.deepEqual(first, second);
  assert.equal(first[0].providerSlug, "alpha");
});

test("normalizes multiple outcomes and excludes the neutral escape hatch", () => {
  const answers = normalizeFinderAnswers({ outcomes: ["cash", "supplies", "open-to-ideas", "cash"] });
  assert.deepEqual(answers.outcomes, ["cash", "supplies"]);
});

test("multiple outcomes match providers without multiplying the outcome weight", () => {
  const cash = provider({ name: "Cash", slug: "cash", method: "product-sales" });
  const supplies = provider({ name: "Supplies", slug: "supplies", method: "direct-donations", products: ["books-educational"] });
  const results = rankProviderMatches([cash, supplies], { outcomes: ["cash", "supplies"] });
  assert.equal(results.find((result) => result.providerSlug === "cash").score, 18);
  assert.equal(results.find((result) => result.providerSlug === "supplies").score, 18);
});

test("explicit structured outcomes extend existing Finder matching without changing its weight", () => {
  const equipment = provider({ name: "Equipment", slug: "equipment", outcomes: ["equipment"] });
  const [result] = rankProviderMatches([equipment], { outcomes: ["equipment"] });
  assert.equal(result.score, 18);
  assert.deepEqual(result.reasons, ["Supports your stated fundraising outcome"]);
});

test("group-size ranges distinguish compatible, overlapping, incompatible, and missing states", () => {
  assert.deepEqual(evaluateGroupSizeFit({ status: "known", minimum_group_size: 20 }, "medium"), {
    status: "compatible",
    message: "Works for groups of 25–100",
  });
  assert.deepEqual(evaluateGroupSizeFit({ status: "known", minimum_group_size: 20 }, "small"), {
    status: "overlap",
    message: "May fit groups under 25; requires at least 20 participants",
  });
  assert.equal(evaluateGroupSizeFit({ status: "known", minimum_group_size: 25 }, "small").status, "incompatible");
  assert.match(evaluateGroupSizeFit({ status: "researched-unknown", minimum_group_size: null }, "small").message, /research did not establish/i);
  assert.match(evaluateGroupSizeFit({ status: "not-researched", minimum_group_size: null }, "small").message, /has not been researched/i);
  assert.deepEqual(evaluateGroupSizeFit({ status: "not-applicable", minimum_group_size: null }, "small"), {
    status: "compatible",
    message: "No minimum group size applies",
  });
});

test("definitely incompatible group-size minimums exclude programs while overlapping ranges remain eligible", () => {
  const minimumTwenty = provider({ name: "Twenty Person Minimum", slug: "twenty", minimumGroupSize: 20 });
  const minimumTwentyFive = provider({ name: "Twenty Five Person Minimum", slug: "twenty-five", minimumGroupSize: 25 });
  const smallResults = rankProviderMatches([minimumTwentyFive, minimumTwenty], { group: "schools", groupSize: "small" });
  assert.equal(smallResults.length, 1);
  assert.equal(smallResults[0].providerSlug, "twenty");
  assert.match(smallResults[0].matchedConstraints[0], /may fit groups under 25/i);
});

test("setup timing compares minutes, hours, days, and weeks against deterministic planning windows", () => {
  const exact = (value, unit) => ({ status: "known", setup_lead_time: { exact: { value, unit } } });
  const minimum = (value, unit) => ({ status: "known", setup_lead_time: { minimum: { value, unit } } });
  assert.equal(evaluateSetupTimingFit(exact(5, "minutes"), "fast").status, "compatible");
  assert.equal(evaluateSetupTimingFit(exact(2, "hours"), "fast").status, "compatible");
  assert.equal(evaluateSetupTimingFit(exact(7, "days"), "fast").status, "compatible");
  assert.equal(evaluateSetupTimingFit(minimum(8, "days"), "fast").status, "incompatible");
  assert.equal(evaluateSetupTimingFit(minimum(3, "weeks"), "few-weeks").status, "overlap");
  assert.equal(evaluateSetupTimingFit(minimum(3, "weeks"), "longer").status, "compatible");
  assert.equal(evaluateSetupTimingFit({ status: "known", setup_lead_time: { minimum: { value: 2, unit: "weeks" }, open_ended: true } }, "fast").status, "incompatible");
});

test("setup timing supports business days and months without using campaign duration", () => {
  assert.equal(evaluateSetupTimingFit({
    status: "known",
    setup_lead_time: { exact: { value: 5, unit: "business-days" } },
  }, "fast").status, "compatible");
  assert.equal(evaluateSetupTimingFit({
    status: "known",
    setup_lead_time: { minimum: { value: 1, unit: "months" } },
  }, "few-weeks").status, "incompatible");
  assert.equal(evaluateSetupTimingFit({
    status: "known",
    setup_lead_time: null,
    campaign_duration: { exact: { value: 1, unit: "days" } },
  }, "fast").status, "unknown");
});

test("timing research states remain distinct and not-applicable is compatible", () => {
  assert.match(evaluateSetupTimingFit({ status: "researched-unknown", setup_lead_time: null }, "fast").message, /research did not establish/i);
  assert.match(evaluateSetupTimingFit({ status: "not-researched", setup_lead_time: null }, "fast").message, /has not been researched/i);
  assert.match(evaluateSetupTimingFit({ status: "known", setup_lead_time: null }, "fast").message, /not established in current research/i);
  assert.equal(evaluateSetupTimingFit({ status: "not-applicable", setup_lead_time: null }, "fast").status, "compatible");
});

test("known group-size and setup data avoid false missing-data confidence penalties", () => {
  const known = provider({
    name: "Known Fit",
    slug: "known-fit",
    minimumGroupSize: 1,
    setupLeadTime: { maximum: { value: 2, unit: "days" } },
  });
  const unknown = provider({
    name: "Unknown Fit",
    slug: "unknown-fit",
    requirementsStatus: "researched-unknown",
    timingStatus: "not-researched",
  });
  const results = rankProviderMatches([unknown, known], { group: "schools", groupSize: "small", time: "fast" });
  const knownResult = results.find((result) => result.providerSlug === "known-fit");
  const unknownResult = results.find((result) => result.providerSlug === "unknown-fit");
  assert.equal(knownResult.confidence, 100);
  assert.equal(knownResult.gaps.length, 0);
  assert.equal(unknownResult.confidence, 82);
  assert.ok(unknownResult.gaps.every((gap) => !gap.includes("Finder data")));
});

test("passive programs use the canonical method while other methods retain genuine uncertainty", () => {
  const passive = provider({ name: "Passive Program", slug: "passive", method: "everyday-passive-fundraising" });
  const conventional = provider({ name: "Conventional Program", slug: "conventional", method: "direct-donations" });
  const results = rankProviderMatches([conventional, passive], { group: "schools", constraints: ["passive"] });
  assert.equal(results[0].providerSlug, "passive");
  assert.ok(results[0].matchedConstraints.includes("Passive / ongoing fundraising model"));
  assert.equal(results[0].confidence, 100);
  assert.equal(results[1].confidence, 88);
  assert.match(results[1].gaps[0], /not established for this program/i);
});
