import { effectiveProgramTaxonomy, normalizeIntakeRecord, slugify } from "./normalize.ts";
import { validateDraft } from "./validate.ts";

export const INTAKE_DRAFT_STORAGE_KEY = "frd:provider-intake:draft:v1";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const text = (value: unknown): string | undefined => {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
};

const list = (value: unknown): string[] | undefined => {
  const values = Array.isArray(value)
    ? value.map(text).filter((entry): entry is string => Boolean(entry))
    : typeof value === "string"
      ? value.split(/[\n,]/).map(text).filter((entry): entry is string => Boolean(entry))
      : [];
  return values.length ? [...new Set(values)] : undefined;
};

const number = (value: unknown): number | undefined => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const booleanOrNull = (value: unknown): boolean | null | undefined => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  if (value === null || value === "null") return null;
  return undefined;
};

function definedObject(value: Record<string, unknown>): Record<string, unknown> | undefined {
  const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function programHasContent(program: Record<string, unknown>): boolean {
  return Object.values(program).some((value) => value !== undefined && (!Array.isArray(value) || value.length > 0));
}

export function createEmptyIntakeDraft(today = new Date().toISOString().slice(0, 10)): Record<string, any> {
  return {
    record_type: "provider",
    origin: "internal-research",
    identity: {},
    publication: { lifecycle: "active" },
    classification: {},
    programs: [{}],
    geography: {},
    economics: {},
    requirements: [],
    logistics: [],
    content: {},
    sources: [{}],
    verification: { status: "unverified", review_status: "current", first_researched_at: today },
    completeness: "minimal",
    commercial_research: { affiliate_status: "unknown" },
  };
}

export function addProgram(draft: Record<string, any>): Record<string, any> {
  return { ...draft, programs: [...(draft.programs ?? []), {}] };
}

export function removeProgram(draft: Record<string, any>, index: number): Record<string, any> {
  return { ...draft, programs: (draft.programs ?? []).filter((_: unknown, itemIndex: number) => itemIndex !== index) };
}

export function buildIntakeRecord(draft: Record<string, any>): Record<string, unknown> {
  const recordType = draft.record_type === "official-beneficiary-program" ? draft.record_type : "provider";
  const identityName = text(draft.identity?.name);
  const identity = definedObject({
    name: identityName,
    slug: text(draft.identity?.slug),
    aliases: list(draft.identity?.aliases),
    legal_name: text(draft.identity?.legal_name),
    website: text(draft.identity?.website),
    fundraising_url: text(draft.identity?.fundraising_url),
    logo: text(draft.identity?.logo),
  }) ?? {};

  const classification = definedObject({
    methods: list(draft.classification?.methods),
    products_services: list(draft.classification?.products_services),
    organizations: list(draft.classification?.organizations),
    outcomes: list(draft.classification?.outcomes),
    capabilities: list(draft.classification?.capabilities),
    beneficiary_types: list(draft.classification?.beneficiary_types),
    cause_areas: list(draft.classification?.cause_areas),
    activity_subtypes: list(draft.classification?.activity_subtypes),
  });

  const programs = (draft.programs ?? []).map((program: Record<string, any>) => definedObject({
    name: text(program.name),
    slug: text(program.slug),
    url: text(program.url),
    method: text(program.method),
    products_services: list(program.products_services),
    channels: list(program.channels),
    online_ordering: booleanOrNull(program.online_ordering),
    fulfillment: list(program.fulfillment),
    inventory_model: text(program.inventory_model),
    upfront_cost: text(program.upfront_cost),
    ease_to_raise: program.ease_to_raise === "null" ? null : text(program.ease_to_raise),
    summary: text(program.summary),
    outcomes: list(program.outcomes),
    capabilities: list(program.capabilities),
    beneficiary_types: list(program.beneficiary_types),
    cause_areas: list(program.cause_areas),
    activity_subtypes: list(program.activity_subtypes),
    economics_mode: text(program.economics_mode),
    economics: program.economics,
    requirements: program.requirements,
    timing: program.timing,
    logistics: program.logistics,
  }) ?? {}).filter(programHasContent);

  const beneficiary = recordType === "official-beneficiary-program" ? definedObject({
    type: text(draft.beneficiary?.type),
    name: text(draft.beneficiary?.name),
    slug: text(draft.beneficiary?.slug),
    official: draft.beneficiary?.official === true || undefined,
  }) : undefined;

  const geography = definedObject({
    scope: list(draft.geography?.scope),
    countries: list(draft.geography?.countries)?.map((country) => country.toUpperCase()),
    states: list(draft.geography?.states),
    regions: list(draft.geography?.regions),
    notes: text(draft.geography?.notes),
  });

  const economics = definedObject({
    platform_fee_percent: number(draft.economics?.platform_fee_percent),
    transaction_fee_percent: number(draft.economics?.transaction_fee_percent),
    proceeds_percent: number(draft.economics?.proceeds_percent),
    notes: text(draft.economics?.notes),
  });

  const content = definedObject({
    summary: text(draft.content?.summary),
    how_it_works: text(draft.content?.how_it_works),
    best_for: list(draft.content?.best_for),
    considerations: list(draft.content?.considerations),
  });

  const sources = (draft.sources ?? []).map((source: Record<string, any>) => definedObject({
    id: text(source.id),
    url: text(source.url),
    source_type: text(source.source_type),
    title: text(source.title),
    supports: list(source.supports),
    checked_at: text(source.checked_at),
    status: text(source.status),
    notes: text(source.notes),
  }) ?? {}).filter(programHasContent);

  const verification = definedObject({
    status: text(draft.verification?.status) ?? "unverified",
    review_status: text(draft.verification?.review_status),
    first_researched_at: text(draft.verification?.first_researched_at),
    first_verified_at: text(draft.verification?.first_verified_at),
    last_verified_at: text(draft.verification?.last_verified_at),
    reviewer: text(draft.verification?.reviewer),
    verifier: text(draft.verification?.verifier),
    record_level_recheck: draft.verification?.record_level_recheck === true || undefined,
  });

  const commercialResearch = definedObject({
    affiliate_status: text(draft.commercial_research?.affiliate_status) ?? "unknown",
    affiliate_program_url: text(draft.commercial_research?.affiliate_program_url),
    affiliate_network: text(draft.commercial_research?.affiliate_network),
    commission_structure: text(draft.commercial_research?.commission_structure),
    cookie_duration_days: number(draft.commercial_research?.cookie_duration_days),
    eligibility_requirements: text(draft.commercial_research?.eligibility_requirements),
    checked_at: text(draft.commercial_research?.checked_at),
    approved_destination_url: text(draft.commercial_research?.approved_destination_url),
    internal_notes: text(draft.commercial_research?.internal_notes),
  });

  return Object.fromEntries(Object.entries({
    record_type: recordType,
    origin: text(draft.origin) ?? "internal-research",
    identity,
    classification,
    programs: programs.length ? programs : undefined,
    beneficiary,
    geography,
    economics,
    requirements: list(draft.requirements),
    logistics: list(draft.logistics),
    content,
    publication: definedObject({
      lifecycle: text(draft.publication?.lifecycle),
      next_review_at: text(draft.publication?.next_review_at),
      inactive_since: text(draft.publication?.inactive_since),
      inactive_reason: text(draft.publication?.inactive_reason),
    }),
    sources: sources.length ? sources : undefined,
    verification,
    completeness: text(draft.completeness) ?? "minimal",
    commercial_research: commercialResearch,
  }).filter(([, value]) => value !== undefined));
}

export function reviewBrowserDraft(draft: Record<string, any>) {
  const intake = buildIntakeRecord(draft);
  const validation = validateDraft(intake);
  if (!validation.success || !validation.data) {
    return { intake, normalized: undefined, effectiveTaxonomy: [], issues: validation.issues, valid: false };
  }
  const normalized = normalizeIntakeRecord(validation.data as any);
  return {
    intake,
    normalized: normalized.normalized,
    effectiveTaxonomy: effectiveProgramTaxonomy(normalized.normalized),
    issues: [...validation.issues, ...normalized.issues],
    valid: true,
  };
}

export function saveDraft(storage: StorageAdapter, draft: Record<string, any>): void {
  const safeDraft = structuredClone(draft);
  delete safeDraft.workflow;
  storage.setItem(INTAKE_DRAFT_STORAGE_KEY, JSON.stringify({ version: 1, draft: safeDraft }));
}

export function loadDraft(storage: StorageAdapter): Record<string, any> | null {
  try {
    const value = storage.getItem(INTAKE_DRAFT_STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (parsed?.version !== 1 || !parsed.draft || typeof parsed.draft !== "object") return null;
    delete parsed.draft.workflow;
    return parsed.draft;
  } catch {
    return null;
  }
}

export function clearDraft(storage: StorageAdapter): void {
  storage.removeItem(INTAKE_DRAFT_STORAGE_KEY);
}

export function suggestedSlug(name: string): string {
  return slugify(name);
}
