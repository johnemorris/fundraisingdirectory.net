import type { CanonicalProvider } from "./providerSchema.ts";
import { resolveProgramEconomics } from "./providerSchema.ts";

/** Eligibility is a placement guard, not a promise to re-review on a schedule. */
export function isFeaturedEligible(data: CanonicalProvider, today = new Date().toISOString().slice(0, 10)) {
  const age = (Date.parse(today) - Date.parse(data.status.last_verified_at)) / 86400000;
  return !data.meta.deleted && data.status.lifecycle === "active"
    && data.verification.level === "verified" && data.verification.review_status === "current"
    && ["standard", "anchor-quality"].includes(data.verification.completeness)
    && age >= 0 && age <= 90 && data.programs.length > 0
    && data.verification.sources.length > 0
    && data.verification.sources.every((source) => source.status === "current" && source.supports.every((claim) => claim.status === "current"))
    && data.programs.every((program) => {
      const economics = resolveProgramEconomics(data, program, { referenceDate: today });
      return economics && ["known", "not-applicable"].includes(economics.status)
        && (economics.status !== "known" || economics.arrangements.length > 0)
        && [program.requirements, program.timing, program.logistics].every((section) =>
          ["known", "not-applicable"].includes(section.status));
    });
}

// Explicit editorial selection; never fall back to an arbitrary weak record.
export function selectFeaturedProvider<T extends { data: CanonicalProvider }>(providers: T[], today?: string) {
  return providers.find(({ data }) => data.identity.slug === "givebutter" && isFeaturedEligible(data, today));
}
