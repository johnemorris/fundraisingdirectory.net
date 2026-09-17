import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FUNDRAISING_METHODS } from "../src/data/taxonomies/methods.ts";
import {
  addProgram,
  buildIntakeRecord,
  clearDraft,
  createEmptyIntakeDraft,
  INTAKE_DRAFT_STORAGE_KEY,
  loadDraft,
  removeProgram,
  reviewBrowserDraft,
  saveDraft,
} from "../src/lib/provider-intake/browser.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    values,
  };
}

test("editorial form state maps to the exact intake JSON shape without UI-only blanks", () => {
  const record = buildIntakeRecord({
    record_type: "provider",
    origin: "internal-research",
    identity: { name: "Sample Provider", website: "https://sample.example/", aliases: "Sample Co\nSample Fundraising" },
    publication: { lifecycle: "active" },
    classification: { methods: ["direct-donations"], organizations: ["schools"], outcomes: ["cash"] },
    programs: [{ name: "Giving Pages", method: "direct-donations", channels: ["online"], summary: "Sample program." }, {}],
    geography: { countries: "us, ca", scope: ["us-nationwide"] },
    requirements: "Must be an eligible group.\nConfirm current terms.",
    verification: { status: "unverified", first_researched_at: "2026-09-12" },
    completeness: "minimal",
    commercial_research: { affiliate_status: "unknown", cookie_duration_days: "" },
  });

  assert.deepEqual(record.identity.aliases, ["Sample Co", "Sample Fundraising"]);
  assert.deepEqual(record.geography.countries, ["US", "CA"]);
  assert.equal(record.programs.length, 1);
  assert.equal(record.programs[0].method, "direct-donations");
  assert.equal(record.commercial_research.cookie_duration_days, undefined);
  assert.equal("workflow" in record, false);
});

test("official beneficiary form fields map to the structured relationship", () => {
  const record = buildIntakeRecord({
    record_type: "official-beneficiary-program",
    origin: "internal-research",
    identity: { name: "Example Charity" },
    beneficiary: { type: "national-nonprofit-or-charity", name: "Example Charity", slug: "example-charity", official: true },
    programs: [{ name: "Supporter Program" }],
  });
  assert.deepEqual(record.beneficiary, {
    type: "national-nonprofit-or-charity",
    name: "Example Charity",
    slug: "example-charity",
    official: true,
  });
});

test("incomplete official beneficiary drafts receive an actionable validation error", () => {
  const draft = createEmptyIntakeDraft("2026-09-12");
  draft.record_type = "official-beneficiary-program";
  draft.identity = { name: "Incomplete Charity Program" };
  draft.beneficiary = { type: "national-nonprofit-or-charity" };
  const result = reviewBrowserDraft(draft);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) =>
    issue.path === "beneficiary" && issue.message.includes("beneficiary type, name, slug")
  ));
});

test("repeatable program helpers add and remove without mutating the draft", () => {
  const original = { programs: [{ name: "One" }] };
  const added = addProgram(original);
  const removed = removeProgram(added, 0);
  assert.equal(original.programs.length, 1);
  assert.equal(added.programs.length, 2);
  assert.deepEqual(removed.programs, [{}]);
});

test("the UI renders taxonomy controls from canonical modules", async () => {
  const component = await readFile("src/components/internal/ProviderIntakeWorkbench.astro", "utf8");
  assert.match(component, /data\/taxonomies\/methods/);
  assert.match(component, /IntakeTaxonomyOptions values=\{FUNDRAISING_METHODS\}/);
  assert.ok(FUNDRAISING_METHODS.includes("collection-reuse-fundraising"));
  assert.doesNotMatch(component, /const\s+FUNDRAISING_METHODS\s*=/);
});

test("affiliate metadata maps internally and the engine firewall still isolates external submissions", () => {
  const draft = createEmptyIntakeDraft("2026-09-12");
  draft.origin = "provider-submission";
  draft.identity = { name: "External Sample" };
  draft.commercial_research = { affiliate_status: "approved", affiliate_program_url: "https://affiliate.example/" };
  const result = reviewBrowserDraft(draft);
  assert.equal(result.valid, true);
  assert.deepEqual(result.normalized.commercial_research, { affiliate_status: "unknown" });
  assert.ok(result.issues.some((issue) => issue.stage === "commercial-firewall"));
});

test("draft persistence restores editor state and never persists approval", () => {
  const storage = memoryStorage();
  const draft = { identity: { name: "Saved Draft" }, workflow: { approved: true } };
  saveDraft(storage, draft);
  assert.equal(storage.values.has(INTAKE_DRAFT_STORAGE_KEY), true);
  const restored = loadDraft(storage);
  assert.equal(restored.identity.name, "Saved Draft");
  assert.equal(restored.workflow, undefined);
  clearDraft(storage);
  assert.equal(loadDraft(storage), null);
});

test("browser review uses shared normalization and validation", () => {
  const draft = createEmptyIntakeDraft("2026-09-12");
  draft.identity = { name: "  Normalized Sample  " };
  draft.classification = { methods: ["direct-donations", "direct-donations"] };
  const result = reviewBrowserDraft(draft);
  assert.equal(result.valid, true);
  assert.equal(result.normalized.identity.slug, "normalized-sample");
  assert.deepEqual(result.normalized.classification.methods, ["direct-donations"]);
});

test("browser route is noindex and remains absent from public navigation and sitemap", async () => {
  const [route, layout, sitemap, header, footer] = await Promise.all([
    readFile("src/pages/internal/provider-intake.astro", "utf8"),
    readFile("src/layouts/SiteLayout.astro", "utf8"),
    readFile("src/pages/sitemap.xml.ts", "utf8"),
    readFile("src/components/SiteHeader.astro", "utf8"),
    readFile("src/components/SiteFooter.astro", "utf8"),
  ]);
  assert.match(route, /noindex/);
  assert.match(route, /canonical=\{false\}/);
  assert.match(layout, /\{canonical && <meta property="og:url"/);
  assert.doesNotMatch(`${sitemap}\n${header}\n${footer}`, /internal\/provider-intake/);
});
