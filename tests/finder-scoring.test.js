import assert from "node:assert/strict";
import test from "node:test";
import { normalizeFinderAnswers, rankProviderMatches } from "../src/lib/finderScoring.js";

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
}) {
  return {
    identity: { name, slug, profilePath: `/providers/${slug}/` },
    classification: { organizations, methods: [method], products_services: products },
    programs: [{ name: `${name} Program`, method, channels, products_services: products, inventory_model: inventory, upfront_cost: upfront, ease_to_raise: effort, ...(outcomes ? { outcomes } : {}) }],
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

test("affiliate and sponsor metadata have zero ranking effect", () => {
  const organic = provider({ name: "Same Provider", slug: "same", affiliation: "none" });
  const sponsored = structuredClone(organic);
  sponsored.affiliation.type = "sponsor";
  assert.deepEqual(rankProviderMatches([organic], { group: "schools", format: "online" }), rankProviderMatches([sponsored], { group: "schools", format: "online" }));
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
