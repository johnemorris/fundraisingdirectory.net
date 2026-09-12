import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { load } from "js-yaml";
import { providerSchema } from "../../data/providerSchema.ts";
import { canonicalDomain, normalizedName } from "./normalize.ts";
import type {
  DuplicateAssessment,
  DuplicateSignal,
  ExistingProviderRecord,
} from "./types.ts";

export async function loadExistingProviders(
  contentDirectory = path.resolve("src/content/providers"),
): Promise<ExistingProviderRecord[]> {
  const names = (await readdir(contentDirectory)).filter((name) => /\.ya?ml$/i.test(name));
  const records = await Promise.all(names.map(async (name) => {
    const filePath = path.join(contentDirectory, name);
    const parsed = providerSchema.parse(load(await readFile(filePath, "utf8")));
    return { path: filePath, data: parsed };
  }));
  return records.sort((a, b) => a.data.identity.slug.localeCompare(b.data.identity.slug));
}

function signalsFor(record: Record<string, any>, existing: ExistingProviderRecord): DuplicateSignal[] {
  const signals: DuplicateSignal[] = [];
  const incomingName = normalizedName(record.identity?.name);
  const existingName = normalizedName(existing.data.identity.name);
  const aliases = (record.identity?.aliases ?? []).map(normalizedName).filter(Boolean);
  const incomingDomain = canonicalDomain(record.identity?.website ?? record.identity?.fundraising_url);
  const existingDomains = new Set([
    canonicalDomain(existing.data.identity.website),
    canonicalDomain(existing.data.identity.fundraising_url),
  ].filter(Boolean));

  if (record.identity?.slug && record.identity.slug === existing.data.identity.slug) {
    signals.push({ kind: "slug", value: record.identity.slug });
  }
  if (incomingName && incomingName === existingName) {
    signals.push({ kind: "name", value: record.identity.name });
  }
  if (incomingDomain && existingDomains.has(incomingDomain)) {
    signals.push({ kind: "domain", value: incomingDomain });
  }
  if (existingName && aliases.includes(existingName)) {
    signals.push({ kind: "alias", value: existing.data.identity.name });
  }

  const existingPrograms = existing.data.programs;
  (record.programs ?? []).forEach((program: Record<string, any>) => {
    if (program.slug && existingPrograms.some((item) => item.slug === program.slug)) {
      signals.push({ kind: "program-slug", value: program.slug });
    } else if (program.url && existingPrograms.some((item) => item.url === program.url)) {
      signals.push({ kind: "program-url", value: program.url });
    } else {
      const name = normalizedName(program.name);
      if (name && existingPrograms.some((item) => normalizedName(item.name) === name)) {
        signals.push({ kind: "program-name", value: program.name });
      }
    }
  });
  return signals;
}

export function assessDuplicate(
  record: Record<string, any>,
  existingRecords: ExistingProviderRecord[],
): DuplicateAssessment {
  const candidates = existingRecords
    .map((existing) => ({ existing, signals: signalsFor(record, existing) }))
    .filter(({ signals }) => signals.length > 0)
    .sort((a, b) => b.signals.length - a.signals.length || a.existing.data.identity.slug.localeCompare(b.existing.data.identity.slug));

  if (!candidates.length) {
    return { classification: "new", candidates: [], signals: [], ambiguous: false };
  }

  const topScore = candidates[0].signals.length;
  const topCandidates = candidates.filter((candidate) => candidate.signals.length === topScore);
  const candidateSummaries = candidates.map(({ existing, signals }) => ({
    path: existing.path,
    slug: existing.data.identity.slug,
    name: existing.data.identity.name,
    signals,
  }));

  if (topCandidates.length > 1) {
    return {
      classification: "likely-duplicate",
      candidates: candidateSummaries,
      signals: topCandidates.flatMap(({ signals }) => signals),
      ambiguous: true,
    };
  }

  const top = topCandidates[0];
  const providerSignals = top.signals.filter((signal) => ["slug", "name", "domain", "alias"].includes(signal.kind));
  const programSignals = top.signals.filter((signal) => signal.kind.startsWith("program-"));
  const strongProviderMatch = providerSignals.some((signal) => signal.kind === "slug") || providerSignals.length >= 2;

  let classification: DuplicateAssessment["classification"] = "likely-duplicate";
  if (strongProviderMatch && programSignals.length > 0) classification = "update-candidate";
  else if (strongProviderMatch && (record.programs?.length ?? 0) > 0) classification = "existing-provider-new-program";
  else if (strongProviderMatch) classification = "update-candidate";

  return {
    classification,
    existing: top.existing,
    candidates: candidateSummaries,
    signals: top.signals,
    ambiguous: false,
  };
}
