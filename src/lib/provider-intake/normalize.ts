import type { IntakeRecord } from "./schema.ts";
import type { ValidationIssue } from "./types.ts";

const ADDITIVE_FIELDS = [
  "methods",
  "products_services",
  "outcomes",
  "capabilities",
  "beneficiary_types",
  "cause_areas",
  "activity_subtypes",
] as const;

const EXTERNAL_ORIGINS = new Set(["provider-submission", "organization-submission"]);

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-+/g, "-");
}

function unique<T>(values: T[] | undefined): T[] | undefined {
  return values ? [...new Set(values)] : undefined;
}

function normalizeUrl(value: string | null | undefined): string | null | undefined {
  if (!value) return value;
  const url = new URL(value.trim());
  url.hash = "";
  return url.toString();
}

function normalizeTaxonomyContainer(value: Record<string, any> | undefined) {
  if (!value) return value;
  const output = { ...value };
  ADDITIVE_FIELDS.forEach((field) => {
    if (Array.isArray(output[field])) output[field] = unique(output[field]);
  });
  return output;
}

function legacyResearchForSingleProgram(record: IntakeRecord): Record<string, any> {
  const research: Record<string, any> = {};
  if (record.economics && !("status" in record.economics)) {
    const arrangements = [
      record.economics.platform_fee_percent === undefined ? undefined : {
        type: "platform-fee",
        value: { kind: "percentage", percent: record.economics.platform_fee_percent },
        basis: null,
        conditions: [],
        caveats: [],
      },
      record.economics.transaction_fee_percent === undefined ? undefined : {
        type: "transaction-fee",
        value: { kind: "percentage", percent: record.economics.transaction_fee_percent },
        basis: null,
        conditions: [],
        caveats: [],
      },
      record.economics.proceeds_percent === undefined ? undefined : {
        type: "proceeds",
        value: { kind: "percentage", percent: record.economics.proceeds_percent },
        basis: null,
        conditions: [],
        caveats: [],
      },
    ].filter(Boolean);
    const notes = record.economics.notes ? [record.economics.notes] : [];
    if (arrangements.length || notes.length) research.economics = { status: "known", arrangements, notes };
  }
  if (record.requirements?.length) {
    research.requirements = {
      status: "known",
      legal_status: [],
      age_range: null,
      grade_range: null,
      participation_requirements: [],
      minimum_group_size: null,
      minimum_order: null,
      minimum_sales: null,
      other_restrictions: record.requirements,
      editorial_summary: null,
    };
  }
  if (record.logistics?.length) {
    research.logistics = { status: "known", notes: record.logistics };
  }
  return research;
}

export function normalizeIntakeRecord(record: IntakeRecord): {
  normalized: Record<string, any>;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];
  const identity = {
    ...record.identity,
    name: record.identity.name?.trim(),
    slug: record.identity.slug ?? (record.identity.name ? slugify(record.identity.name) : undefined),
    aliases: unique(record.identity.aliases?.map((alias) => alias.trim())),
    website: normalizeUrl(record.identity.website),
    fundraising_url: normalizeUrl(record.identity.fundraising_url),
    logo: normalizeUrl(record.identity.logo),
  };

  const legacyResearch = legacyResearchForSingleProgram(record);
  const programs = record.programs?.map((program) => ({
    ...legacyResearch,
    ...normalizeTaxonomyContainer(program),
    name: program.name?.trim(),
    slug: program.slug ?? (program.name ? slugify(program.name) : undefined),
    url: normalizeUrl(program.url),
    beneficiary: program.beneficiary ?? record.beneficiary,
    channels: unique(program.channels),
    fulfillment: unique(program.fulfillment),
  }));

  let commercialResearch = record.commercial_research;
  if (EXTERNAL_ORIGINS.has(record.origin) && record.commercial_research) {
    commercialResearch = { affiliate_status: "unknown" };
    issues.push({
      code: "external-commercial-metadata-ignored",
      message: "Commercial research supplied by an external/provider submission was ignored and must be researched internally.",
      path: "commercial_research",
      severity: "warning",
      stage: "commercial-firewall",
    });
  }

  const normalized = {
    ...record,
    identity,
    classification: normalizeTaxonomyContainer(record.classification),
    programs,
    geography: record.geography ? {
      ...record.geography,
      scope: unique(record.geography.scope),
      countries: unique(record.geography.countries?.map((country) => country.toUpperCase())),
      states: unique(record.geography.states),
      regions: unique(record.geography.regions),
    } : undefined,
    sources: record.sources?.map((source) => ({
      ...source,
      url: normalizeUrl(source.url),
      supports: source.supports === undefined ? undefined : [...new Map(source.supports.map((claim) => {
        const normalizedClaim = typeof claim === "string"
          ? { path: claim, status: "current", notes: null }
          : { ...claim, notes: claim.notes ?? null };
        return [normalizedClaim.path, normalizedClaim];
      })).values()],
      status: source.status,
    })),
    completeness: record.completeness,
    commercial_research: commercialResearch,
  };

  if (normalized.economics && !("status" in normalized.economics)) delete normalized.economics;
  delete normalized.requirements;
  delete normalized.logistics;

  return { normalized, issues };
}

export function effectiveProgramTaxonomy(record: Record<string, any>): Array<Record<string, string[]>> {
  const provider = record.classification ?? {};
  return (record.programs ?? []).map((program: Record<string, any>) => {
    const effective: Record<string, string[]> = {};
    ADDITIVE_FIELDS.forEach((field) => {
      const providerValues = field === "methods" ? provider.methods ?? [] : provider[field] ?? [];
      const programValues = field === "methods"
        ? program.method ? [program.method] : []
        : program[field] ?? [];
      effective[field] = [...new Set([...providerValues, ...programValues])];
    });
    return effective;
  });
}

export function canonicalDomain(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function normalizedName(value: string | undefined): string | undefined {
  return value?.toLowerCase().replace(/\b(inc|llc|ltd|corp|corporation|company|co)\b\.?/g, "").replace(/[^a-z0-9]/g, "").trim() || undefined;
}
