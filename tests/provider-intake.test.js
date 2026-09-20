import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { load } from "js-yaml";
import { providerSchema } from "../src/data/providerSchema.ts";
import { FUNDRAISING_METHODS } from "../src/data/taxonomies/methods.ts";
import { rankProviderMatches } from "../src/lib/finderScoring.js";
import {
  effectiveProgramTaxonomy,
  loadExistingProviders,
  parseIntakeJson,
  processIntakeRecords,
  validateDraft,
  writePublication,
} from "../src/lib/provider-intake/index.ts";

const root = process.cwd();
const fixturePath = (name) => path.join(root, "docs/provider-intake/examples", name);
const fixture = async (name) => JSON.parse(await readFile(fixturePath(name), "utf8"));
const fixedOptions = { runId: "intake_test", date: "2026-09-12" };

test("single JSON intake is accepted and receives a traceable run identifier", async () => {
  const raw = await readFile(fixturePath("new-provider.json"), "utf8");
  const parsed = parseIntakeJson(raw);
  assert.equal(parsed.records.length, 1);
  const run = processIntakeRecords(parsed.records, [], fixedOptions);
  assert.equal(run.runId, "intake_test");
  assert.equal(run.records[0].recordId, "intake_test:1");
  assert.equal(run.summary.readyForReview, 1);
});

test("bulk JSON validates every record independently", async () => {
  const records = await Promise.all([
    fixture("new-provider.json"),
    fixture("invalid-taxonomy.json"),
    fixture("official-beneficiary-program.json"),
  ]);
  const parsed = parseIntakeJson(JSON.stringify(records));
  const run = processIntakeRecords(parsed.records, [], fixedOptions);
  assert.equal(run.summary.parsed, 3);
  assert.equal(run.summary.validationFailures, 1);
  assert.equal(run.records[0].draftValid, true);
  assert.equal(run.records[1].draftValid, false);
  assert.equal(run.records[2].draftValid, true);
  assert.equal(run.records[2].publishReady, true);
  assert.notEqual(run.records[0].publication.candidate.meta.id, run.records[2].publication.candidate.meta.id);
  assert.notEqual(run.records[0].publication.candidate.programs[0].id, run.records[2].publication.candidate.programs[0].id);
});

test("intake schemas reuse every canonical fundraising method value", async () => {
  const base = await fixture("new-provider.json");
  FUNDRAISING_METHODS.forEach((method) => {
    const candidate = structuredClone(base);
    candidate.classification.methods = [method];
    candidate.programs[0].method = method;
    assert.equal(validateDraft(candidate).success, true, method);
  });
  const invalid = structuredClone(base);
  invalid.programs[0].method = "invented-method";
  assert.equal(validateDraft(invalid).success, false);
});

test("draft validation permits incomplete work while publish validation remains canonical", () => {
  const run = processIntakeRecords([{
    record_type: "provider",
    origin: "internal-research",
    identity: { name: "Incomplete Draft" },
  }], [], fixedOptions);
  assert.equal(run.records[0].draftValid, true);
  assert.equal(run.records[0].publishReady, false);
  assert.ok(run.records[0].issues.some((entry) => entry.stage === "publish"));
});

test("program taxonomy supplements provider taxonomy additively without overrides", () => {
  const [effective] = effectiveProgramTaxonomy({
    classification: {
      methods: ["product-sales"],
      outcomes: ["cash"],
      capabilities: ["online-store"],
      products_services: ["apparel-spirit-wear"],
    },
    programs: [{
      method: "events-activities",
      outcomes: ["cash", "supplies"],
      capabilities: ["ticketing-registration"],
      products_services: ["apparel-spirit-wear", "event-fundraising-platform"],
    }],
  });
  assert.deepEqual(effective.methods, ["product-sales", "events-activities"]);
  assert.deepEqual(effective.outcomes, ["cash", "supplies"]);
  assert.deepEqual(effective.products_services, ["apparel-spirit-wear", "event-fundraising-platform"]);
});

test("official beneficiary programs retain the named structured relationship", async () => {
  const run = processIntakeRecords([await fixture("official-beneficiary-program.json")], [], fixedOptions);
  const record = run.records[0];
  assert.equal(record.normalized.programs[0].beneficiary.name, "Kind Harbor Foundation");
  assert.equal(record.normalized.programs[0].beneficiary.official, true);
  assert.equal(record.publication.candidate.programs[0].beneficiary.type, "national-nonprofit-or-charity");
  assert.equal(providerSchema.safeParse(record.publication.candidate).success, true);
});

test("provenance sources validate URLs, types, dates, and supports paths", async () => {
  const record = await fixture("new-provider.json");
  record.sources[0].source_type = "anonymous-rumor";
  assert.equal(validateDraft(record).success, false);
  record.sources[0].source_type = "official-provider";
  record.sources[0].supports = ["not a field path"];
  assert.equal(validateDraft(record).success, false);
});

test("publish validation rejects well-formed claim paths that do not resolve", async () => {
  const record = await fixture("new-provider.json");
  record.sources[0].supports = ["programs.missing-program.economics"];
  const run = processIntakeRecords([record], [], fixedOptions);
  assert.equal(run.records[0].draftValid, true);
  assert.equal(run.records[0].publishReady, false);
  assert.ok(run.records[0].issues.some((entry) => entry.code === "unknown-supported-claim"));
});

test("duplicate detection identifies an existing provider update candidate", async () => {
  const existing = await loadExistingProviders();
  const run = processIntakeRecords([await fixture("existing-update-candidate.json")], existing, fixedOptions);
  const record = run.records[0];
  assert.equal(record.duplicate.classification, "update-candidate");
  assert.equal(record.duplicate.existing.data.identity.slug, "gofundme");
  assert.ok(record.duplicate.signals.some((signal) => signal.kind === "program-slug"));
});

test("a matched provider with a distinct program is classified separately", async () => {
  const existing = await loadExistingProviders();
  const incoming = await fixture("existing-update-candidate.json");
  incoming.programs = [{ name: "Sample New Program", slug: "sample-new-program" }];
  const run = processIntakeRecords([incoming], existing, fixedOptions);
  assert.equal(run.records[0].duplicate.classification, "existing-provider-new-program");
});

test("publication is a dry-run preview and preserves omitted existing fields", async () => {
  const existing = await loadExistingProviders();
  const gofundme = existing.find((entry) => entry.data.identity.slug === "gofundme");
  const before = await readFile(gofundme.path, "utf8");
  const run = processIntakeRecords([await fixture("existing-update-candidate.json")], existing, fixedOptions);
  const candidate = run.records[0].publication.candidate;
  const after = await readFile(gofundme.path, "utf8");
  assert.equal(after, before);
  assert.deepEqual(candidate.classification, gofundme.data.classification);
  assert.equal(candidate.content.how_it_works, gofundme.data.content.how_it_works);
  assert.equal(candidate.programs.length, gofundme.data.programs.length);
  assert.notEqual(candidate.programs[0].summary, gofundme.data.programs[0].summary);
  assert.equal(candidate.status.last_verified_at, gofundme.data.status.last_verified_at);
  assert.equal(candidate.verification.sources.length, gofundme.data.verification.sources.length);
});

test("filesystem writes require explicit embedded editorial approval", async () => {
  const run = processIntakeRecords([await fixture("new-provider.json")], [], fixedOptions);
  await assert.rejects(
    writePublication(run.records[0].publication, run.records[0].normalized),
    /workflow approval/,
  );
});

test("invalid taxonomy values are rejected with actionable method guidance", async () => {
  const result = validateDraft(await fixture("invalid-taxonomy.json"));
  assert.equal(result.success, false);
  assert.ok(result.issues.some((entry) => entry.message.includes("activity subtype") && entry.message.includes("collection-reuse-fundraising")));
});

test("external submissions cannot set internal commercial research status", async () => {
  const record = await fixture("new-provider.json");
  record.origin = "provider-submission";
  record.commercial_research = {
    affiliate_status: "approved",
    affiliate_program_url: "https://affiliate.example/",
    commission_structure: "Fictional external claim",
  };
  const run = processIntakeRecords([record], [], fixedOptions);
  assert.deepEqual(run.records[0].normalized.commercial_research, { affiliate_status: "unknown" });
  assert.ok(run.records[0].issues.some((entry) => entry.stage === "commercial-firewall"));
  assert.equal(run.records[0].publication.candidate.affiliation.type, "none");
});

test("unknown affiliate status is visibly flagged for research", async () => {
  const run = processIntakeRecords([await fixture("new-provider.json")], [], fixedOptions);
  assert.equal(run.records[0].affiliateResearchNeeded, true);
});

test("commercial intake metadata has zero Finder scoring effect", async () => {
  const run = processIntakeRecords([await fixture("new-provider.json")], [], fixedOptions);
  const candidate = run.records[0].publication.candidate;
  const finderProvider = {
    identity: candidate.identity,
    classification: candidate.classification,
    programs: candidate.programs,
    geography: candidate.geography,
  };
  const withCommercial = { ...finderProvider, commercial_research: run.records[0].normalized.commercial_research };
  assert.deepEqual(
    rankProviderMatches([finderProvider], { group: "schools", format: "online" }),
    rankProviderMatches([withCommercial], { group: "schools", format: "online" }),
  );
});

test("structured provider research survives the approved publication round trip", async () => {
  const contentDirectory = await mkdtemp(path.join(os.tmpdir(), "frd-provider-roundtrip-"));
  const record = {
    record_type: "provider",
    origin: "bulk-import",
    identity: {
      name: "Round Trip Fundraising",
      aliases: ["Round Trip Fundraisers"],
      website: "https://round-trip.example/",
    },
    classification: {
      methods: ["product-sales"],
      products_services: ["apparel-spirit-wear"],
      organizations: ["schools"],
    },
    programs: [{
      name: "Tiered Sales",
      method: "product-sales",
      products_services: ["apparel-spirit-wear"],
      channels: ["hybrid"],
      online_ordering: true,
      fulfillment: ["group-distribution"],
      inventory_model: "preorder",
      upfront_cost: "varies",
      ease_to_raise: "moderate",
      summary: "A fixture program for round-trip testing.",
      outcomes: ["cash"],
      economics: {
        status: "known",
        arrangements: [
          {
            type: "platform-fee",
            value: { kind: "percentage", percent: 2.9 },
            basis: "Collected revenue",
            conditions: ["Online payments"],
            caveats: ["Fixture value"],
          },
          {
            type: "product-sale-margin",
            value: { kind: "percentage-range", minimum: 30, maximum: 45 },
            basis: "Product category",
            conditions: [],
            caveats: [],
          },
          {
            type: "revenue-share",
            value: {
              kind: "tiered",
              tiers: [
                { threshold: "First tier", payout: { kind: "percentage", percent: 30 } },
                { threshold: "Second tier", payout: { kind: "amount", amount: 500, currency: "USD" } },
              ],
            },
            basis: null,
            conditions: ["Sales threshold met"],
            caveats: [],
          },
        ],
        notes: ["Economics vary by selected catalog."],
      },
      requirements: {
        status: "known",
        legal_status: ["school-or-education"],
        age_range: { minimum: 8, maximum: 18 },
        grade_range: { minimum: "3", maximum: "12" },
        participation_requirements: ["Adult organizer required"],
        minimum_group_size: 10,
        minimum_order: { kind: "quantity", amount: 25, unit: "items" },
        minimum_sales: { kind: "amount", amount: 500, currency: "USD" },
        other_restrictions: ["Available to eligible school groups"],
        editorial_summary: "Eligibility is program-specific.",
      },
      timing: {
        status: "known",
        lead_time: {
          minimum: { value: 2, unit: "days" },
          typical: { value: 1, unit: "weeks" },
          maximum: { value: 2, unit: "weeks" },
        },
        campaign_duration: {
          minimum: { value: 2, unit: "weeks" },
          typical: { value: 3, unit: "weeks" },
          maximum: { value: 1, unit: "months" },
        },
        notes: ["Fixture timing only"],
      },
      logistics: {
        status: "known",
        notes: ["Group distribution is required."],
      },
    }, {
      name: "Unknown Terms",
      method: "product-sales",
      products_services: [],
      channels: ["online"],
      online_ordering: null,
      fulfillment: ["unknown"],
      inventory_model: "unknown",
      upfront_cost: "unknown",
      ease_to_raise: null,
      summary: "A fixture program with explicit missing-data states.",
      economics: { status: "researched-unknown", arrangements: [], notes: [] },
      requirements: {
        status: "not-applicable",
        legal_status: [],
        age_range: null,
        grade_range: null,
        participation_requirements: [],
        minimum_group_size: null,
        minimum_order: null,
        minimum_sales: null,
        other_restrictions: [],
        editorial_summary: null,
      },
      timing: { status: "not-researched", lead_time: null, campaign_duration: null, notes: [] },
      logistics: { status: "researched-unknown", notes: [] },
    }],
    geography: {
      scope: ["us-nationwide"],
      countries: ["US"],
      states: [],
      regions: [],
      notes: null,
    },
    content: {
      summary: "A fictional provider for round-trip tests.",
      how_it_works: "The fixture passes through intake and explicit publication.",
      best_for: ["Automated tests"],
      considerations: ["Not a real provider"],
    },
    sources: [{
      id: "src_000321",
      url: "https://round-trip.example/terms",
      source_type: "terms-or-fees",
      title: "Program terms and fees",
      supports: [
        "programs.tiered-sales.economics",
        "programs.tiered-sales.requirements",
        "programs.tiered-sales.timing",
      ],
      checked_at: "2026-09-20",
      status: "current",
      notes: "Fixture source",
    }],
    verification: {
      status: "verified",
      review_status: "current",
      first_researched_at: "2026-09-19",
      first_verified_at: "2026-09-20",
      last_verified_at: "2026-09-20",
      reviewer: "Review Editor",
      verifier: "Verification Editor",
    },
    completeness: "anchor-quality",
    commercial_research: {
      affiliate_status: "approved",
      affiliate_program_url: "https://round-trip.example/partners",
      affiliate_network: "direct",
      commission_structure: "Fixture commission terms",
      cookie_duration_days: 30,
      eligibility_requirements: "Fixture eligibility",
      checked_at: "2026-09-20",
      approved_destination_url: "https://round-trip.example/programs",
      internal_notes: "Internal fixture notes",
    },
    workflow: {
      approved: true,
      approved_by: "Approving Editor",
      approved_at: "2026-09-20",
    },
  };

  try {
    const run = processIntakeRecords([record], [], { ...fixedOptions, date: "2026-09-20", contentDirectory });
    const reviewed = run.records[0];
    assert.equal(reviewed.draftValid, true);
    assert.equal(reviewed.publishReady, true);
    await writePublication(reviewed.publication, reviewed.normalized);

    const published = providerSchema.parse(load(await readFile(reviewed.publication.destination, "utf8")));
    const program = published.programs.find((entry) => entry.slug === "tiered-sales");
    assert.equal(program.economics.arrangements[0].value.percent, 2.9);
    assert.deepEqual(published.identity.aliases, ["Round Trip Fundraisers"]);
    assert.deepEqual(published.provenance.intake_origins, ["bulk-import"]);
    assert.equal(published.commercial_research.affiliate_status, "approved");
    assert.equal(published.commercial_research.cookie_duration_days, 30);
    assert.equal(program.requirements.minimum_group_size, 10);
    assert.deepEqual(program.timing.lead_time.typical, { value: 1, unit: "weeks" });
    assert.deepEqual(program.logistics.notes, ["Group distribution is required."]);
    assert.equal(published.programs[1].economics.status, "researched-unknown");
    assert.equal(published.programs[1].requirements.status, "not-applicable");
    assert.equal(published.programs[1].timing.status, "not-researched");
    assert.equal(published.verification.sources[0].id, "src_000321");
    assert.equal(published.verification.sources[0].title, "Program terms and fees");
    assert.equal(published.verification.sources[0].type, "terms-or-fees");
    assert.deepEqual(
      published.verification.sources[0].supports,
      record.sources[0].supports.map((claimPath) => ({ path: claimPath, status: "current", notes: null })),
    );
    assert.equal(published.verification.completeness, "anchor-quality");
    assert.equal(published.verification.reviewed_by, "Review Editor");
  } finally {
    await rm(contentDirectory, { recursive: true, force: true });
  }
});

test("source review flags preserve verification dates and claim associations", async () => {
  const existing = await loadExistingProviders();
  const gofundme = existing.find((entry) => entry.data.identity.slug === "gofundme");
  const source = gofundme.data.verification.sources[0];
  const run = processIntakeRecords([{
    record_type: "provider",
    origin: "automated-research-assist",
    identity: { name: "GoFundMe", slug: "gofundme", website: "https://www.gofundme.com/" },
    sources: [{
      id: source.id,
      supports: [{
        path: "programs.online-crowdfunding.summary",
        status: "needs-recheck",
        notes: "Automated check could not confirm the claim",
      }],
    }],
    verification: { status: "partially-verified", review_status: "needs-recheck" },
    completeness: "minimal",
    commercial_research: { affiliate_status: "unknown" },
  }], existing, fixedOptions);
  const candidate = run.records[0].publication.candidate;
  const updatedSource = candidate.verification.sources.find((entry) => entry.id === source.id);
  assert.equal(updatedSource.status, "current");
  assert.equal(updatedSource.checked_at, source.checked_at);
  assert.equal(candidate.status.last_verified_at, gofundme.data.status.last_verified_at);
  assert.deepEqual(updatedSource.supports, [{
    path: "programs.online-crowdfunding.summary",
    status: "needs-recheck",
    notes: "Automated check could not confirm the claim",
  }]);
});

test("legacy record-level research is rejected when program association is ambiguous", async () => {
  const record = await fixture("multiple-programs.json");
  record.economics = { proceeds_percent: 40 };
  const result = validateDraft(record);
  assert.equal(result.success, false);
  assert.ok(result.issues.some((entry) => entry.code === "ambiguous-program-research"));
});

test("bulk publication blocks stable ID collisions across records", async () => {
  const first = await fixture("new-provider.json");
  first.sources[0].id = "src_000999";
  const second = structuredClone(first);
  second.identity.name = "Second Round Trip Provider";
  second.identity.website = "https://second-round-trip.example/";
  second.identity.fundraising_url = "https://second-round-trip.example/programs";
  second.programs[0].name = "Second Giving Pages";
  second.programs[0].url = "https://second-round-trip.example/programs/giving-pages";
  second.sources[0].url = "https://second-round-trip.example/programs";

  const run = processIntakeRecords([first, second], [], fixedOptions);
  assert.equal(run.records[0].publishReady, true);
  assert.equal(run.records[1].publishReady, false);
  assert.ok(run.records[1].issues.some((entry) => entry.code === "duplicate-stable-id"));
});
