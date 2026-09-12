import { writeFile } from "node:fs/promises";
import path from "node:path";
import { dump } from "js-yaml";
import type { CanonicalProvider } from "../../data/providerSchema.ts";
import { normalizedName } from "./normalize.ts";
import { validateCanonicalCandidate } from "./validate.ts";
import type {
  DuplicateAssessment,
  ExistingProviderRecord,
  FieldDiff,
  PublicationPreview,
  ValidationIssue,
} from "./types.ts";

const SOURCE_TYPE_MAP = {
  "official-provider": "official-website",
  "official-charity": "official-website",
  "official-program": "official-program-page",
  government: "reputable-third-party",
  "platform-documentation": "official-document",
  "terms-or-fees": "official-document",
  "public-press-release": "reputable-third-party",
  "reputable-third-party": "reputable-third-party",
  "frd-editorial-note": "other",
} as const;

const ORIGIN_MAP = {
  "internal-research": "editorial-research",
  "bulk-import": "web-research",
  "provider-submission": "provider-submission",
  "organization-submission": "provider-submission",
  "claim-update": "editorial-research",
  "automated-research-assist": "web-research",
} as const;

function padId(prefix: "prov" | "prog", value: number): string {
  return `${prefix}_${String(value).padStart(6, "0")}`;
}

export interface PublicationIdAllocator {
  provider: () => string;
  program: () => string;
}

export function createPublicationIdAllocator(existingRecords: ExistingProviderRecord[]): PublicationIdAllocator {
  let provider = Math.max(0, ...existingRecords.map(({ data }) => Number(data.meta.id.slice(5))));
  let program = Math.max(0, ...existingRecords.flatMap(({ data }) => data.programs.map((entry) => Number(entry.id.slice(5)))));
  return {
    provider: () => padId("prov", ++provider),
    program: () => padId("prog", ++program),
  };
}

function compact<T extends Record<string, any>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>;
}

function mergeProvided(base: any, patch: any): any {
  if (patch === undefined) return structuredClone(base);
  if (Array.isArray(patch) || patch === null || typeof patch !== "object") return structuredClone(patch);
  const output = base && typeof base === "object" && !Array.isArray(base) ? structuredClone(base) : {};
  Object.entries(patch).forEach(([key, value]) => {
    if (value !== undefined) output[key] = mergeProvided(output[key], value);
  });
  return output;
}

function mapSources(sources: Record<string, any>[] | undefined) {
  return sources?.map((source) => ({
    type: SOURCE_TYPE_MAP[source.source_type as keyof typeof SOURCE_TYPE_MAP],
    url: source.url,
    checked_at: source.checked_at,
    notes: [source.title, source.notes].filter(Boolean).join(" — ") || null,
  }));
}

function mergeSources(existing: Record<string, any>[], incoming: Record<string, any>[]) {
  const output = structuredClone(existing);
  incoming.forEach((source) => {
    const index = output.findIndex((current) => current.url === source.url);
    if (index >= 0) output[index] = mergeProvided(output[index], source);
    else output.push(source);
  });
  return output;
}

function canonicalProgramPatch(program: Record<string, any>): Record<string, any> {
  return compact({
    id: program.id,
    name: program.name,
    slug: program.slug,
    url: program.url,
    method: program.method,
    products_services: program.products_services,
    channels: program.channels,
    online_ordering: program.online_ordering,
    fulfillment: program.fulfillment,
    inventory_model: program.inventory_model,
    upfront_cost: program.upfront_cost,
    ease_to_raise: program.ease_to_raise,
    summary: program.summary,
    beneficiary: program.beneficiary,
    outcomes: program.outcomes,
    capabilities: program.capabilities,
    beneficiary_types: program.beneficiary_types,
    cause_areas: program.cause_areas,
    activity_subtypes: program.activity_subtypes,
  });
}

function programMatches(existing: Record<string, any>, incoming: Record<string, any>): boolean {
  return Boolean(
    (incoming.id && existing.id === incoming.id)
      || (incoming.slug && existing.slug === incoming.slug)
      || (incoming.url && existing.url === incoming.url)
      || (incoming.name && normalizedName(existing.name) === normalizedName(incoming.name)),
  );
}

function mergePrograms(
  existingPrograms: Record<string, any>[],
  incomingPrograms: Record<string, any>[],
  nextProgramId: () => string,
): Record<string, any>[] {
  const output = structuredClone(existingPrograms);
  incomingPrograms.forEach((incoming) => {
    const patch = canonicalProgramPatch(incoming);
    const index = output.findIndex((existing) => programMatches(existing, incoming));
    if (index >= 0) output[index] = mergeProvided(output[index], patch);
    else output.push(mergeProvided({
      id: nextProgramId(),
      products_services: [],
      online_ordering: null,
      fulfillment: ["unknown"],
      inventory_model: "unknown",
      upfront_cost: "unknown",
      ease_to_raise: null,
    }, patch));
  });
  return output;
}

function buildNewCandidate(record: Record<string, any>, ids: PublicationIdAllocator, actor: string, date: string) {
  const verificationLevel = ["verified", "partially-verified", "unverified"].includes(record.verification?.status)
    ? record.verification.status
    : "unverified";
  return {
    meta: {
      id: ids.provider(),
      schema_version: 1,
      created_at: date,
      created_by: actor,
      modified_at: date,
      modified_by: actor,
      deleted: false,
      deleted_at: null,
      deleted_by: null,
      deletion_reason: null,
    },
    identity: mergeProvided({ legal_name: null, fundraising_url: null, logo: null }, compact(record.identity ?? {})),
    classification: mergeProvided({ products_services: [] }, record.classification ?? {}),
    programs: mergePrograms([], record.programs ?? [], ids.program),
    geography: mergeProvided({ countries: [], states: [], regions: [], notes: null }, record.geography ?? {}),
    content: mergeProvided({ best_for: [], considerations: [] }, record.content ?? {}),
    status: {
      lifecycle: record.publication?.lifecycle ?? "active",
      first_verified_at: record.verification?.first_verified_at,
      last_verified_at: record.verification?.last_verified_at,
      next_review_at: record.publication?.next_review_at ?? null,
      inactive_since: record.publication?.inactive_since ?? null,
      inactive_reason: record.publication?.inactive_reason ?? null,
    },
    verification: {
      level: verificationLevel,
      sources: mapSources(record.sources) ?? [],
    },
    provenance: {
      discovered_via: [ORIGIN_MAP[record.origin as keyof typeof ORIGIN_MAP]],
      legacy: { listed: false, name: null, url: null },
    },
    affiliation: { type: "none", disclosure_required: false },
    editorial: { featured: false },
  };
}

function buildUpdateCandidate(
  record: Record<string, any>,
  existing: ExistingProviderRecord,
  ids: PublicationIdAllocator,
  actor: string,
  date: string,
) {
  const mappedSources = mapSources(record.sources);
  const sourcePatch = mappedSources
    ? { sources: mergeSources(existing.data.verification.sources, mappedSources) }
    : undefined;
  const verificationStatus = record.verification?.status;
  const recordLevelRecheck = record.verification?.record_level_recheck === true;
  const verificationPatch = compact({
    level: recordLevelRecheck && verificationStatus && ["verified", "partially-verified", "unverified"].includes(verificationStatus)
      ? verificationStatus
      : undefined,
    ...sourcePatch,
  });
  const statusPatch = compact({
    lifecycle: record.publication?.lifecycle,
    first_verified_at: recordLevelRecheck ? record.verification?.first_verified_at : undefined,
    last_verified_at: recordLevelRecheck ? record.verification?.last_verified_at : undefined,
    next_review_at: record.publication?.next_review_at,
    inactive_since: record.publication?.inactive_since,
    inactive_reason: record.publication?.inactive_reason,
  });
  const patch = compact({
    meta: { modified_at: date, modified_by: actor },
    identity: compact(record.identity ?? {}),
    classification: record.classification,
    geography: record.geography,
    content: record.content,
    status: Object.keys(statusPatch).length ? statusPatch : undefined,
    verification: Object.keys(verificationPatch).length ? verificationPatch : undefined,
    provenance: {
      discovered_via: [...new Set([
        ...existing.data.provenance.discovered_via,
        ORIGIN_MAP[record.origin as keyof typeof ORIGIN_MAP],
      ])],
    },
  });
  const candidate = mergeProvided(existing.data, patch);
  if (record.programs) candidate.programs = mergePrograms(existing.data.programs, record.programs, ids.program);
  return candidate;
}

function fieldDiff(before: unknown, after: unknown, prefix = ""): FieldDiff[] {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (
    before && after && typeof before === "object" && typeof after === "object"
    && !Array.isArray(before) && !Array.isArray(after)
  ) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((key) => fieldDiff(
      (before as Record<string, unknown>)[key],
      (after as Record<string, unknown>)[key],
      prefix ? `${prefix}.${key}` : key,
    ));
  }
  const removedArrayValue = Array.isArray(before) && Array.isArray(after)
    && before.some((value) => !after.some((candidate) => JSON.stringify(candidate) === JSON.stringify(value)));
  const destructive = after === null && before !== null && before !== undefined
    || after === undefined && before !== undefined
    || removedArrayValue;
  return [{ path: prefix, before, after, destructive }];
}

function serialize(candidate: unknown): string {
  return dump(candidate, {
    noRefs: true,
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: true,
    noCompatMode: true,
  });
}

export function preparePublication(
  record: Record<string, any>,
  duplicate: DuplicateAssessment,
  existingRecords: ExistingProviderRecord[],
  options: { actor?: string; date?: string; contentDirectory?: string; idAllocator?: PublicationIdAllocator } = {},
): PublicationPreview {
  const actor = options.actor ?? "user_000001";
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const contentDirectory = options.contentDirectory ?? path.resolve("src/content/providers");
  const ids = options.idAllocator ?? createPublicationIdAllocator(existingRecords);
  const destination = duplicate.existing?.path ?? path.join(contentDirectory, `${record.identity?.slug ?? "unresolved"}.yaml`);
  const issues: ValidationIssue[] = [];

  if (duplicate.classification === "likely-duplicate") {
    issues.push({
      code: "ambiguous-duplicate",
      message: "Resolve the likely duplicate before publishing; intake never merges ambiguous matches.",
      path: "identity",
      severity: "error",
      stage: "publish",
    });
    return { destination, action: "blocked", publishReady: false, diff: [], warnings: [], issues };
  }

  if (["stale", "disputed"].includes(record.verification?.status)) {
    issues.push({
      code: "non-publishable-verification-state",
      message: `${record.verification.status} records require editorial resolution before publication.`,
      path: "verification.status",
      severity: "error",
      stage: "publish",
    });
  }

  const existing = duplicate.existing;
  const candidate = existing
    ? buildUpdateCandidate(record, existing, ids, actor, date)
    : buildNewCandidate(record, ids, actor, date);
  issues.push(...validateCanonicalCandidate(candidate));
  const diff = fieldDiff(existing?.data, candidate);
  const warnings = diff.filter((entry) => entry.destructive).map((entry) => `Destructive change proposed at ${entry.path}`);

  return {
    destination,
    action: existing ? "update" : "create",
    publishReady: !issues.some((entry) => entry.severity === "error"),
    candidate: candidate as CanonicalProvider,
    generatedContent: serialize(candidate),
    diff,
    warnings,
    issues,
  };
}

export async function writePublication(
  preview: PublicationPreview,
  record: Record<string, any>,
  options: { allowDestructive?: boolean } = {},
): Promise<void> {
  if (!record.workflow?.approved || !record.workflow?.approved_by || !record.workflow?.approved_at) {
    throw new Error("Write refused: workflow approval requires approved=true, approved_by, and approved_at.");
  }
  if (!preview.publishReady || !preview.generatedContent || preview.action === "blocked") {
    throw new Error("Write refused: the proposed record is not publish-ready.");
  }
  if (preview.warnings.length && !options.allowDestructive) {
    throw new Error("Write refused: destructive changes require --allow-destructive after review.");
  }
  await writeFile(preview.destination, preview.generatedContent, {
    encoding: "utf8",
    flag: preview.action === "create" ? "wx" : "w",
  });
}
