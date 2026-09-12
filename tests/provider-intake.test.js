import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
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
