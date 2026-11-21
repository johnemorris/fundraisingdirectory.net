import type { CanonicalProvider } from "./providerSchema.ts";
import { resolveProgramEconomics } from "./providerSchema.ts";
import { formatEconomicArrangement, formatDuration, RESEARCH_STATE_COPY } from "./providerPresentation.ts";
import { formatProviderLabel } from "./providerLabels.ts";

export const COMPARISON_FIELDS = ["Approaches", "Availability", "Platform fees", "Processing / transaction fees", "Proceeds / profit model", "Upfront terms / minimums", "Eligibility", "Setup / payout", "Last verified", "Sources"] as const;

export function comparisonRecord(provider: CanonicalProvider) {
  const financial = (types: string[]) => provider.programs.map((program) => {
    const economics = resolveProgramEconomics(provider, program, { includeExpired: true });
    const terms = economics?.status === "known" ? economics.arrangements.filter((term) => types.includes(term.type)).map((term) => {
      const row = formatEconomicArrangement(term);
      return [row.label + ": " + row.value, row.basis, ...row.conditions, ...row.caveats].filter(Boolean).join(". ");
    }) : [];
    return `${program.name}: ${terms.length ? terms.join("; ") : economics && economics.status !== "known" ? RESEARCH_STATE_COPY[economics.status] : "No separate term established; see profile"}`;
  });
  return {
    slug: provider.identity.slug, name: provider.identity.name,
    href: `/providers/${provider.identity.slug}/`,
    fields: [
      [provider.classification.methods.map(formatProviderLabel).join(" · ")],
      [provider.geography.scope.map(formatProviderLabel).join(" · "), provider.geography.notes].filter(Boolean),
      financial(["platform-fee"]),
      financial(["processing-fee", "transaction-fee"]),
      financial(["product-sale-profit", "product-sale-margin", "restaurant-give-back", "proceeds", "revenue-share", "fixed-payout"]),
      financial(["upfront-cost", "minimum-order", "minimum-sales"]),
      provider.programs.map((program) => `${program.name}: ${program.requirements.editorial_summary ?? (program.requirements.status !== "known" ? RESEARCH_STATE_COPY[program.requirements.status] : "See program requirements in profile")}`),
      provider.programs.map((program) => `${program.name}: Setup ${formatDuration(program.timing.setup_lead_time) ?? "not established"}; payout ${formatDuration(program.timing.payout_time) ?? "see profile for schedule and conditions"}`),
      [provider.status.last_verified_at],
      provider.verification.sources.map((source) => `${source.title ?? "Provider source"} — checked ${source.checked_at}: ${source.url}`),
    ],
  };
}

export { normalizeComparisonSelection } from "../lib/comparisonSelection.ts";
