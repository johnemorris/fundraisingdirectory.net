import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import {
  formatDuration,
  formatEconomicArrangement,
  formatEconomicValue,
  formatAgeRange,
  formatGradeRange,
  formatLegalStatus,
  formatPayoutSchedule,
  RESEARCH_STATE_COPY,
  resolveProgramPresentation,
} from "../src/data/providerPresentation.ts";
import { providerSchema } from "../src/data/providerSchema.ts";

const loadProvider = async (slug) => providerSchema.parse(load(await readFile(`src/content/providers/${slug}.yaml`, "utf8")));

test("economics formatter preserves amounts, ranges, quantities, tiers, basis, and caveats", () => {
  assert.equal(formatEconomicValue({ kind: "amount", amount: 150, currency: "USD" }), "$150");
  assert.equal(formatEconomicValue({ kind: "amount-range", minimum: 10, maximum: 25, currency: "USD" }), "$10–$25");
  assert.equal(formatEconomicValue({ kind: "percentage", percent: 2.9 }), "2.9%");
  assert.equal(formatEconomicValue({ kind: "percentage-range", minimum: 25, maximum: 50 }), "25–50%");
  assert.equal(formatEconomicValue({ kind: "quantity", amount: 1, unit: "cases" }), "1 case");
  assert.equal(formatEconomicValue({ kind: "quantity-range", minimum: 8, maximum: 12, unit: "cases" }), "8–12 cases");
  assert.equal(formatEconomicValue({ kind: "variable", description: "Up to 50% profit" }), "Up to 50% profit");
  assert.equal(formatEconomicValue({
    kind: "tiered",
    tiers: [
      { threshold: "Fewer than 200 cases", payout: { kind: "percentage", percent: 40 } },
      { threshold: "More than 200 cases", payout: { kind: "percentage", percent: 50 } },
    ],
  }), "Fewer than 200 cases: 40%; More than 200 cases: 50%");

  const formatted = formatEconomicArrangement({
    type: "minimum-sales",
    value: { kind: "amount", amount: 150, currency: "USD" },
    basis: "Total qualifying event sales",
    conditions: ["Minimum must be met"],
    caveats: ["Qualifying sales only"],
  });
  assert.equal(formatted.value, "$150 minimum sales");
  assert.equal(formatted.basis, "Total qualifying event sales");
  assert.deepEqual(formatted.conditions, ["Minimum must be met"]);
  assert.deepEqual(formatted.caveats, ["Qualifying sales only"]);
});

test("duration formatter distinguishes exact, bounds, typical, business days, and open-ended timing", () => {
  assert.equal(formatDuration({ exact: { value: 3, unit: "minutes" } }), "3 minutes");
  assert.equal(formatDuration({ exact: { value: 4, unit: "hours" } }), "4 hours");
  assert.equal(formatDuration({ exact: { value: 1, unit: "days" } }), "1 day");
  assert.equal(formatDuration({ minimum: { value: 3, unit: "calendar-days" } }), "At least 3 calendar days");
  assert.equal(formatDuration({ maximum: { value: 2, unit: "business-days" } }), "Up to 2 business days");
  assert.equal(formatDuration({ typical: { value: 2, unit: "weeks" } }), "Typically 2 weeks");
  assert.equal(formatDuration({ maximum: { value: 4, unit: "months" } }), "Up to 4 months");
  assert.equal(formatDuration({ minimum: { value: 30, unit: "days" }, maximum: { value: 45, unit: "days" } }), "30–45 days");
  assert.equal(formatDuration({ open_ended: true }), "Ongoing / open-ended");
  assert.equal(formatDuration(null), null);
  assert.equal(formatPayoutSchedule({ frequency: "monthly", delivery_method: "direct-deposit", anchor: "First Monday", conditions: [], caveats: [] }), "Monthly by direct deposit (First Monday)");
});

test("requirement formatter presents legal status and age or grade bounds without inventing eligibility", () => {
  assert.equal(formatLegalStatus("501c3"), "501(c)(3)");
  assert.equal(formatLegalStatus("school-or-education"), "School or educational organization");
  assert.equal(formatAgeRange({ minimum: 13, maximum: 18 }), "Ages 13–18");
  assert.equal(formatAgeRange({ minimum: 18 }), "Age 18+");
  assert.equal(formatGradeRange({ minimum: "pre-k", maximum: "12" }), "Pre-K–Grade 12");
});

test("missing-data copy keeps every canonical research state distinct", () => {
  assert.deepEqual(RESEARCH_STATE_COPY, {
    "researched-unknown": "Not published by provider",
    "not-researched": "Not yet researched",
    "not-applicable": "Not applicable",
  });
  assert.doesNotMatch(Object.values(RESEARCH_STATE_COPY).join(" "), /\$0|free|no requirement/i);
});

test("provider-level economics are inherited without duplicating canonical data", async () => {
  const zeffy = await loadProvider("zeffy");
  const presentation = resolveProgramPresentation(zeffy, zeffy.programs[0]);
  assert.equal(presentation.economicsInherited, true);
  assert.equal(presentation.economics, zeffy.economics);
  assert.ok(presentation.economicsRows.some((row) => row.value === "0% platform fee"));
  assert.equal(zeffy.programs[0].economics, undefined);
});

test("multi-program presentation retains meaningful program differences", async () => {
  const [krispyKreme, donorsChoose, raiseRight] = await Promise.all([
    loadProvider("krispy-kreme-fundraising"),
    loadProvider("donorschoose"),
    loadProvider("raiseright"),
  ]);

  assert.deepEqual(krispyKreme.programs.map((program) => program.inventory_model), ["preorder", "upfront-inventory", "no-inventory"]);
  assert.deepEqual(donorsChoose.programs.map((program) => program.timing.campaign_duration?.open_ended ?? false), [false, true]);
  assert.deepEqual(raiseRight.programs.map((program) => resolveProgramPresentation(raiseRight, program).programUrl), raiseRight.programs.map((program) => program.url));
  assert.equal(raiseRight.programs[0].timing.payout_schedules.length, 3);
  assert.equal(raiseRight.programs[0].timing.payout_time, null);
});

test("profile templates render direct program URLs and prefer canonical source titles", async () => {
  const [page, card] = await Promise.all([
    readFile("src/pages/providers/[slug].astro", "utf8"),
    readFile("src/components/ProviderProgramCard.astro", "utf8"),
  ]);
  assert.match(card, /href=\{presentation\.programUrl\}/);
  assert.match(card, />View program/);
  assert.match(page, /source\.title \?\? formatProviderLabel\(source\.type\)/);
});
