import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import { formatProviderLabel } from "../src/data/providerLabels.ts";
import { resolveProgramPresentation } from "../src/data/providerPresentation.ts";
import { isDateWindowActive, providerSchema, resolveProgramEconomics } from "../src/data/providerSchema.ts";
import {
  loadExistingProviders,
  parseIntakeJson,
  processIntakeRecords,
} from "../src/lib/provider-intake/index.ts";

const loadProvider = async (slug) => providerSchema.parse(load(await readFile(`src/content/providers/${slug}.yaml`, "utf8")));

test("Every.org captures IRA, peer matching, and employer matching without new taxonomy values", async () => {
  const provider = await loadProvider("every-org");
  const giving = provider.programs.find(({ slug }) => slug === "nonprofit-giving-platform");
  const peer = provider.programs.find(({ slug }) => slug === "peer-to-peer-and-matching-campaigns");
  const workplace = provider.programs.find(({ slug }) => slug === "employee-giving-and-employer-matching");

  assert.ok(giving?.summary.includes("IRA"));
  assert.ok(giving?.logistics.notes.some((note) => note.includes("IRA")));
  assert.deepEqual(peer?.capabilities, ["peer-to-peer-pages", "matching-gifts", "digital-wallets"]);
  assert.ok(workplace?.capabilities.includes("workplace-giving"));
  assert.equal(workplace?.economics?.status, "researched-unknown");
  assert.ok(workplace?.requirements.other_restrictions.some((restriction) => restriction.includes("participating employers")));
});

test("SupportNow uses existing personal, medical, cash, and practical-support dimensions", async () => {
  const provider = await loadProvider("supportnow");
  const program = provider.programs[0];

  assert.ok(provider.classification.organizations.includes("individuals-personal-causes"));
  assert.ok(program.beneficiary_types.includes("individual-or-family"));
  assert.ok(program.cause_areas.includes("health-medical"));
  assert.deepEqual(program.outcomes, ["cash", "food", "services", "volunteer-support"]);
  assert.equal(provider.geography.countries[0], "US");
  assert.ok(program.requirements.participation_requirements.some((requirement) => requirement.includes("parent or guardian approval")));
  const processingFee = program.economics?.arrangements.find(({ type }) => type === "processing-fee");
  assert.equal(processingFee?.value.kind, "percentage");
  assert.equal(processingFee?.value.percent, 2.7);
  assert.ok(processingFee?.conditions.some((condition) => condition.includes("removes the optional RoundUp")));
  assert.ok(provider.verification.sources.some(({ url }) => url === "https://www.supportnow.org/pricing"));
});

test("GoFundMe carries the CaringBridge medical integration without a duplicate provider", async () => {
  const provider = await loadProvider("gofundme");

  assert.ok(provider.classification.cause_areas.includes("health-medical"));
  assert.ok(provider.programs[0].beneficiary_types.includes("individual-or-family"));
  assert.ok(provider.programs[0].logistics.notes.some((note) => note.includes("CaringBridge")));
  assert.ok(provider.verification.sources.some(({ url }) => url === "https://www.gofundme.com/c/partnerships"));
  await assert.rejects(access("src/content/providers/caringbridge.yaml"));
  await assert.rejects(access("src/content/providers/blackbaud.yaml"));
});

test("directory and Finder-facing labels clearly expose individuals and families", async () => {
  const discoverySource = await readFile("src/data/discovery.ts", "utf8");

  assert.equal(formatProviderLabel("individuals-personal-causes"), "Individuals & Families");
  assert.match(discoverySource, /"individuals-personal-causes": \{ label: "Individuals & Families"/);
  assert.match(discoverySource, /title: "Fundraising providers for individuals & families"/);
});

test("Fundraise Up distinguishes generally available, early-access, and announced capabilities and UK in-person giving", async () => {
  const provider = await loadProvider("fundraise-up");
  assert.deepEqual(provider.geography.countries, ["US", "CA", "GB"]);

  const online = provider.programs.find(({ slug }) => slug === "online-giving-and-gift-cart");
  const p2p = provider.programs.find(({ slug }) => slug === "diy-peer-to-peer-fundraising");
  const inPerson = provider.programs.find(({ slug }) => slug === "in-person-giving");

  assert.equal(online?.availability_state, "generally-available");
  assert.ok(online?.feature_availability?.some(({ feature, status, notes }) =>
    feature.includes("Gift Cart") && status === "generally-available" && notes?.includes("custom field values") && notes?.includes("daily-gift end dates") && notes?.includes("FAQ")
  ));
  assert.ok(online?.feature_availability?.some(({ feature, status, notes }) =>
    feature.includes("Ramadan Giving") && status === "generally-available" && notes?.includes("November 23, 2026")
  ));
  assert.ok(online?.feature_availability?.some(({ feature, status, notes }) =>
    feature.includes("cookie banner") && status === "generally-available" && notes?.includes("400 days")
  ));

  assert.equal(p2p?.availability_state, "early-access");
  const aiCoach = p2p?.feature_availability?.find(({ feature }) => feature.includes("AI Coach"));
  assert.equal(aiCoach?.status, "early-access");
  assert.match(aiCoach?.notes ?? "", /Customer Success Manager/);
  assert.match(aiCoach?.notes ?? "", /no additional charge/);

  const p2pTributes = p2p?.feature_availability?.find(({ feature }) => feature.includes("tribute tracking"));
  assert.equal(p2pTributes?.status, "generally-available");
  assert.ok(p2p?.logistics.notes.some((note) => note.includes("In Memory and In Honor P2P pages")));

  const p2pEvents = p2p?.feature_availability?.find(({ feature }) => feature.includes("walks, runs, and rides"));
  assert.equal(p2pEvents?.status, "announced");

  assert.equal(inPerson?.availability_state, "generally-available");
  assert.deepEqual(inPerson?.geographic_restriction?.countries, ["US", "CA", "GB"]);
  const ukFeature = inPerson?.feature_availability?.find(({ feature }) => feature.includes("United Kingdom"));
  assert.equal(ukFeature?.status, "generally-available");
  assert.deepEqual(ukFeature?.countries, ["GB"]);
  assert.match(ukFeature?.notes ?? "", /Gift Aid/);

  const privacyFeature = inPerson?.feature_availability?.find(({ feature }) => feature.includes("Hide supporter personal details"));
  assert.equal(privacyFeature?.status, "generally-available");
  assert.match(privacyFeature?.notes ?? "", /Audit log/);
});

test("Givebutter preserves existing pricing and eligibility while adding multi-page management, ticket-linked transfers, and AI connector controls", async () => {
  const provider = await loadProvider("givebutter");
  const program = provider.programs.find(({ slug }) => slug === "online-fundraising-platform");

  assert.equal(program?.economics?.arrangements.length, 7);
  assert.equal(program?.economics?.arrangements[0].value.percent, 0);
  assert.equal(program?.economics?.arrangements[1].value.percent, 3);
  assert.equal(program?.economics?.arrangements[2].value.percent, 2.9);
  assert.equal(program?.economics?.arrangements[3].value.amount, 0.3);
  assert.equal(program?.economics?.arrangements[4].value.percent, 1.9);
  assert.equal(program?.economics?.arrangements[5].value.percent, 1.75);
  assert.equal(program?.economics?.arrangements[6].value.percent, 1);
  assert.deepEqual(program?.economics?.arrangements[6].effective_window, { start_date: "2026-12-01", end_date: "2026-12-02" });

  assert.ok(program?.requirements.participation_requirements.some((req) => req.includes("Stripe Connect")));
  assert.ok(program?.requirements.other_restrictions.some((res) => res.includes("registration fundraising with event tickets")));
  assert.ok(program?.requirements.other_restrictions.some((res) => res.includes("AI Connectors are scoped to a single Givebutter account")));

  const statuses = new Map(program?.feature_availability?.map((item) => [item.feature, item.status]));
  assert.equal(statuses.get("Givebutter Portal multi-page fundraiser management"), "generally-available");
  assert.equal(statuses.get("Ticket-linked fundraiser page assignment and release transfers"), "generally-available");
  assert.equal(statuses.get("Administrator AI Connector controls (Settings > AI)"), "generally-available");
  assert.equal(statuses.get("Givebutter Gives Back 1% Giving Tuesday Match (December 1–2, 2026)"), "generally-available");
});

test("Panera Bread separates standard 20%–25% give-back from the December 1–21, 2026 30% promotion and expires the promotion after December 21", async () => {
  const provider = await loadProvider("panera-bread-fundraising");
  const program = provider.programs[0];

  assert.deepEqual(provider.geography.scope, ["local"]);
  assert.equal(program.geographic_restriction?.location_participation_required, true);
  assert.deepEqual(program.requirements.legal_status, ["501c3", "tax-exempt"]);
  assert.deepEqual(program.requirements.minimum_sales, {
    kind: "amount-range",
    minimum: 100,
    maximum: 150,
    currency: "USD",
  });

  const allArrangements = program.economics?.arrangements ?? [];
  const standardGiveBack = allArrangements.find((item) => item.type === "restaurant-give-back" && item.value.kind === "percentage-range");
  const promoGiveBack = allArrangements.find((item) => item.type === "restaurant-give-back" && item.value.kind === "percentage");
  assert.deepEqual(standardGiveBack?.value, { kind: "percentage-range", minimum: 20, maximum: 25 });
  assert.equal(standardGiveBack?.effective_window, undefined);
  assert.deepEqual(promoGiveBack?.value, { kind: "percentage", percent: 30 });
  assert.deepEqual(promoGiveBack?.effective_window, { start_date: "2026-12-01", end_date: "2026-12-21" });
  assert.equal(promoGiveBack?.geographic_restriction?.location_participation_required, true);

  // Before the promotional window (e.g., 2026-11-18), only standard non-expired arrangements resolve by default
  const beforePromo = resolveProgramEconomics(provider, program, { referenceDate: "2026-11-18" });
  assert.equal(beforePromo?.arrangements.some((item) => item.value.kind === "percentage" && item.value.percent === 30), false);
  assert.equal(beforePromo?.arrangements.some((item) => item.value.kind === "percentage-range"), true);

  // During the promotional window (December 1 through December 21, 2026), both standard and 30% promotional arrangements are active
  for (const activeDate of ["2026-12-01", "2026-12-15", "2026-12-21"]) {
    const duringPromo = resolveProgramPresentation(provider, program, { referenceDate: activeDate });
    assert.ok(duringPromo.economicsRows.some((row) => row.value === "20–25% of qualifying sales"), activeDate);
    assert.ok(
      duringPromo.economicsRows.some((row) =>
        row.label.includes("Effective Dec 1, 2026–Dec 21, 2026") && row.value === "30% of qualifying sales"
      ),
      activeDate,
    );
  }

  // After December 21, 2026, the 30% promotion expires automatically
  const afterPromo = resolveProgramPresentation(provider, program, { referenceDate: "2026-12-22" });
  assert.equal(afterPromo.economicsRows.some((row) => row.value === "30% of qualifying sales"), false);
  assert.ok(afterPromo.economicsRows.some((row) => row.value === "20–25% of qualifying sales"));

  // Conflicting check-delivery timelines across FAQ and Terms are qualified in notes rather than asserted as a single guaranteed payout_time deadline
  assert.equal(program.timing.payout_time, null);
  assert.ok(program.timing.notes.some((note) => note.includes("rather than a single guaranteed payout deadline")));
  assert.equal(provider.verification.review_status, "needs-recheck");
  const faqSource = provider.verification.sources.find(({ url }) => url === "https://fundraising.panerabread.com/faq");
  const termsSource = provider.verification.sources.find(({ url }) => url === "https://fundraising.panerabread.com/terms-conditions");
  assert.equal(faqSource?.supports.find(({ path }) => path === "programs.bakery-cafe-fundraiser-night.timing")?.status, "needs-recheck");
  assert.equal(termsSource?.supports.find(({ path }) => path === "programs.bakery-cafe-fundraiser-night.timing")?.status, "needs-recheck");
});

test("schema validates availability states, geographic restrictions, and dated promotion bounds", async () => {
  assert.equal(isDateWindowActive({ start_date: "2026-12-01", end_date: "2026-12-21" }, "2026-11-30"), false);
  assert.equal(isDateWindowActive({ start_date: "2026-12-01", end_date: "2026-12-21" }, "2026-12-01"), true);
  assert.equal(isDateWindowActive({ start_date: "2026-12-01", end_date: "2026-12-21" }, "2026-12-21"), true);
  assert.equal(isDateWindowActive({ start_date: "2026-12-01", end_date: "2026-12-21" }, "2026-12-22"), false);

  const panera = await loadProvider("panera-bread-fundraising");
  const invalidWindow = structuredClone(panera);
  invalidWindow.programs[0].economics.arrangements[2].effective_window = {
    start_date: "2026-12-22",
    end_date: "2026-12-01",
  };
  assert.equal(providerSchema.safeParse(invalidWindow).success, false);

  const invalidAvailability = structuredClone(panera);
  invalidAvailability.programs[0].availability_state = "rumored";
  assert.equal(providerSchema.safeParse(invalidAvailability).success, false);

  const emptyGeoRestriction = structuredClone(panera);
  emptyGeoRestriction.programs[0].geographic_restriction = {};
  assert.equal(providerSchema.safeParse(emptyGeoRestriction).success, false);
});

test("Stage 1 intake batch round-trips cleanly against the canonical provider corpus", async () => {
  const existing = await loadExistingProviders();
  const raw = await readFile("docs/provider-intake/2026-11-18-stage1-provider-refresh.json", "utf8");
  const parsed = parseIntakeJson(raw);
  const run = processIntakeRecords(parsed.records, existing, { date: "2026-11-18" });

  assert.equal(run.summary.parsed, 3);
  assert.equal(run.summary.validationFailures, 0);
  assert.equal(run.summary.publishReady, 3);
  for (const record of run.records) {
    assert.equal(record.duplicate.classification, "update-candidate");
    assert.equal(record.publication?.diff.length, 0, `Unexpected diff for ${record.normalized?.identity?.slug}`);
  }
});
