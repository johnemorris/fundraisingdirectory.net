import { providerSchema } from "../../data/providerSchema.ts";
import { ACTIVITY_SUBTYPES } from "../../data/taxonomies/fundraising-dimensions.ts";
import { intakeRecordSchema } from "./schema.ts";
import type { ValidationIssue } from "./types.ts";

function issue(
  stage: ValidationIssue["stage"],
  severity: ValidationIssue["severity"],
  code: string,
  path: string,
  message: string,
): ValidationIssue {
  return { stage, severity, code, path, message };
}

function valueAtPath(value: unknown, path: PropertyKey[]): unknown {
  return path.reduce<unknown>((current, key) => current && typeof current === "object"
    ? (current as Record<PropertyKey, unknown>)[key]
    : undefined, value);
}

function formatZodIssues(error: { issues: Array<{ path: PropertyKey[]; code: string; message: string }> }, raw: unknown): ValidationIssue[] {
  return error.issues.map((entry) => {
    const path = entry.path.join(".") || "$";
    const taxonomyPath = /(?:methods|method|products_services|organizations|outcomes|capabilities|beneficiary_types|cause_areas|activity_subtypes|channels)/.test(path);
    let message = entry.message;
    if ((path.endsWith("method") || path.includes("methods")) && valueAtPath(raw, entry.path) === "shoe-drive") {
      message = "shoe-drive is an activity subtype, not a fundraising method; consider collection-reuse-fundraising.";
    }
    return issue(taxonomyPath ? "taxonomy" : "draft", "error", entry.code, path, message);
  });
}

export function validateDraft(raw: unknown): { success: boolean; data?: Record<string, any>; issues: ValidationIssue[] } {
  const result = intakeRecordSchema.safeParse(raw);
  if (!result.success) return { success: false, issues: formatZodIssues(result.error, raw) };
  const data = result.data as Record<string, any>;
  const issues: ValidationIssue[] = [];

  if (!data.identity.name && !data.identity.slug && !data.identity.website) {
    issues.push(issue("draft", "error", "missing-identity", "identity", "Provide at least one identity signal: name, slug, or website."));
  }

  if (data.record_type === "official-beneficiary-program") {
    const beneficiaries = [data.beneficiary, ...(data.programs ?? []).map((program: any) => program.beneficiary)].filter(Boolean);
    if (!beneficiaries.some((beneficiary) => beneficiary.type && beneficiary.name && beneficiary.slug && beneficiary.official === true)) {
      issues.push(issue("draft", "error", "missing-beneficiary", "beneficiary", "Official beneficiary programs require a beneficiary type, name, slug, and confirmed official relationship."));
    }
    if ((data.programs ?? []).length === 0) {
      issues.push(issue("draft", "error", "missing-program", "programs", "Official beneficiary program records require at least one program."));
    }
  }

  const scopes = new Set(data.geography?.scope ?? []);
  if (scopes.has("us-nationwide") && scopes.has("local")) {
    issues.push(issue("draft", "warning", "contradictory-geography", "geography.scope", "Both us-nationwide and local are present; confirm whether these describe different programs."));
  }
  if (scopes.has("us-nationwide") && (data.geography?.states?.length || data.geography?.regions?.length)) {
    issues.push(issue("draft", "warning", "suspicious-geography-detail", "geography", "Nationwide scope includes state/region restrictions; confirm the intended availability."));
  }

  for (const [key, value] of Object.entries(data.economics ?? {})) {
    if (!key.endsWith("_percent") || typeof value !== "number") continue;
    if (value < 0 || value > 100) {
      issues.push(issue("draft", "error", "invalid-percentage", `economics.${key}`, "Percentages must be between 0 and 100."));
    } else if (value > 50 && key !== "proceeds_percent") {
      issues.push(issue("draft", "warning", "implausible-percentage", `economics.${key}`, "This percentage is unusually high; verify the value and whether it is a percent or currency amount."));
    }
  }

  const hasLegacyProgramResearch = Boolean(
    data.economics
    || data.requirements?.length
    || data.logistics?.length,
  );
  if (hasLegacyProgramResearch && (data.programs?.length ?? 0) !== 1) {
    issues.push(issue(
      "draft",
      "error",
      "ambiguous-program-research",
      "programs",
      "Legacy record-level economics, requirements, and logistics can only be mapped when exactly one program exists; move them onto the applicable program.",
    ));
  }

  if (data.verification?.status === "verified") {
    if (!data.verification.first_verified_at || !data.verification.last_verified_at || !data.verification.verifier || !(data.sources?.length > 0)) {
      issues.push(issue("draft", "error", "incomplete-verification", "verification", "Verified status requires first_verified_at, last_verified_at, verifier, and at least one source. Intake never verifies automatically."));
    }
  }
  if (data.verification?.status === "partially-verified" && !(data.sources?.length > 0)) {
    issues.push(issue("draft", "warning", "missing-verification-source", "sources", "Partially verified records should include at least one checked source."));
  }

  (data.programs ?? []).forEach((program: Record<string, any>, index: number) => {
    if (program.method && (ACTIVITY_SUBTYPES as readonly string[]).includes(program.method)) {
      issues.push(issue("taxonomy", "error", "activity-used-as-method", `programs.${index}.method`, `${program.method} is an activity subtype, not a fundraising method; consider collection-reuse-fundraising where applicable.`));
    }
  });

  return { success: !issues.some((entry) => entry.severity === "error"), data, issues };
}

export function validateCanonicalCandidate(candidate: unknown): ValidationIssue[] {
  const result = providerSchema.safeParse(candidate);
  if (!result.success) {
    return result.error.issues.map((entry) => issue(
      "publish",
      "error",
      entry.code,
      entry.path.join(".") || "$",
      entry.message,
    ));
  }

  const issues: ValidationIssue[] = [];
  result.data.verification.sources.forEach((source, sourceIndex) => {
    const seenClaims = new Set<string>();
    source.supports.forEach((claim, claimIndex) => {
      const parts = claim.path.split(".");
      let current: unknown = result.data;
      if (parts[0] === "programs" && parts.length > 1) {
        current = result.data.programs.find((program) => program.slug === parts[1] || program.id === parts[1]);
        parts.splice(0, 2);
      }
      const exists = current !== undefined && parts.every((part) => {
        if (!current || typeof current !== "object" || !(part in current)) return false;
        current = (current as Record<string, unknown>)[part];
        return true;
      });
      if (!exists) {
        issues.push(issue(
          "publish",
          "error",
          "unknown-supported-claim",
          `verification.sources.${sourceIndex}.supports.${claimIndex}.path`,
          `Supported claim path ${claim.path} does not resolve to a canonical provider field or program slug/ID.`,
        ));
      }
      if (seenClaims.has(claim.path)) {
        issues.push(issue(
          "publish",
          "error",
          "duplicate-supported-claim",
          `verification.sources.${sourceIndex}.supports.${claimIndex}.path`,
          `Supported claim path ${claim.path} is duplicated for this source.`,
        ));
      }
      seenClaims.add(claim.path);
    });
  });
  return issues;
}
