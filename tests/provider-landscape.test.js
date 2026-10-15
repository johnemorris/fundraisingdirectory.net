import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import { formatProviderLabel } from "../src/data/providerLabels.ts";
import { providerSchema } from "../src/data/providerSchema.ts";

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
