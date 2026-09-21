import type { CanonicalProgram, CanonicalProvider } from "./providerSchema.ts";
import { resolveProgramEconomics } from "./providerSchema.ts";
import { formatProviderLabel } from "./providerLabels.ts";

type Economics = NonNullable<CanonicalProvider["economics"]>;
type EconomicArrangement = Economics["arrangements"][number];
type EconomicValue = EconomicArrangement["value"];
type DurationRange = CanonicalProgram["timing"]["setup_lead_time"];
type ResearchState = Economics["status"];

export const RESEARCH_STATE_COPY: Record<Exclude<ResearchState, "known">, string> = {
  "researched-unknown": "Not published by provider",
  "not-researched": "Not yet researched",
  "not-applicable": "Not applicable",
};

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const formatNumber = (value: number) => numberFormatter.format(value);

const pluralizeUnit = (amount: number, unit: string) => {
  const normalized = unit.replaceAll("-", " ");
  return amount === 1 ? normalized.replace(/s$/, "") : normalized;
};

export const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

export function formatEconomicValue(value: EconomicValue): string {
  switch (value.kind) {
    case "amount":
      return formatCurrency(value.amount, value.currency);
    case "amount-range":
      return `${formatCurrency(value.minimum, value.currency)}–${formatCurrency(value.maximum, value.currency)}`;
    case "percentage":
      return `${formatNumber(value.percent)}%`;
    case "percentage-range":
      return `${formatNumber(value.minimum)}–${formatNumber(value.maximum)}%`;
    case "quantity":
      return `${formatNumber(value.amount)} ${pluralizeUnit(value.amount, value.unit)}`;
    case "quantity-range":
      return `${formatNumber(value.minimum)}–${formatNumber(value.maximum)} ${pluralizeUnit(value.maximum, value.unit)}`;
    case "variable":
      return value.description;
    case "tiered":
      return value.tiers
        .map((tier) => `${tier.threshold}: ${formatEconomicValue(tier.payout)}`)
        .join("; ");
  }
}

const ECONOMIC_LABELS: Record<EconomicArrangement["type"], string> = {
  "upfront-cost": "Upfront cost",
  "platform-fee": "Platform fee",
  "processing-fee": "Processing fee",
  "transaction-fee": "Transaction fee",
  "product-sale-profit": "Product-sale profit",
  "product-sale-margin": "Product-sale margin",
  "restaurant-give-back": "Restaurant give-back",
  proceeds: "Proceeds retained",
  "revenue-share": "Revenue share",
  "fixed-payout": "Payout",
  "minimum-payout": "Minimum payout",
  "minimum-order": "Minimum order",
  "minimum-sales": "Minimum sales",
  other: "Other financial term",
};

const decorateEconomicValue = (arrangement: EconomicArrangement) => {
  const value = formatEconomicValue(arrangement.value);
  if (arrangement.value.kind === "variable" || arrangement.value.kind === "tiered") return value;

  switch (arrangement.type) {
    case "upfront-cost": return `${value} upfront cost`;
    case "platform-fee": return `${value} platform fee`;
    case "processing-fee": return `${value} processing fee`;
    case "transaction-fee": return `${value} transaction fee`;
    case "product-sale-profit": return `${value} profit`;
    case "product-sale-margin": return `${value} margin`;
    case "restaurant-give-back": return `${value} of qualifying sales`;
    case "proceeds": return `${value} of proceeds`;
    case "revenue-share": return `${value} revenue share`;
    case "fixed-payout": return `${value} payout`;
    case "minimum-payout": return `${value} minimum payout`;
    case "minimum-order": return `${value} minimum order`;
    case "minimum-sales": return `${value} minimum sales`;
    case "other": return value;
  }
};

export const formatEconomicArrangement = (arrangement: EconomicArrangement) => ({
  label: ECONOMIC_LABELS[arrangement.type],
  value: decorateEconomicValue(arrangement),
  basis: arrangement.basis,
  conditions: arrangement.conditions,
  caveats: arrangement.caveats,
});

const formatDurationPart = (duration: NonNullable<DurationRange>["exact"]) =>
  duration ? `${formatNumber(duration.value)} ${pluralizeUnit(duration.value, duration.unit)}` : "";

export function formatDuration(duration: DurationRange): string | null {
  if (!duration) return null;
  if (duration.exact) return formatDurationPart(duration.exact);

  const minimum = formatDurationPart(duration.minimum);
  const typical = formatDurationPart(duration.typical);
  const maximum = formatDurationPart(duration.maximum);

  if (minimum && maximum) {
    const bounds = duration.minimum?.unit === duration.maximum?.unit
      ? `${formatNumber(duration.minimum.value)}–${formatNumber(duration.maximum.value)} ${pluralizeUnit(duration.maximum.value, duration.maximum.unit)}`
      : `${minimum}–${maximum}`;
    return typical ? `${bounds} (typically ${typical})` : bounds;
  }
  if (minimum) return duration.open_ended ? `At least ${minimum}; no fixed end date` : `At least ${minimum}`;
  if (maximum) return `Up to ${maximum}`;
  if (typical) return duration.open_ended ? `Typically ${typical}; no fixed end date` : `Typically ${typical}`;
  return duration.open_ended ? "Ongoing / open-ended" : null;
}

const GRADE_LABELS: Record<string, string> = {
  "pre-k": "Pre-K",
  kindergarten: "Kindergarten",
  postsecondary: "Postsecondary",
};

const formatGrade = (grade: string) => GRADE_LABELS[grade] ?? `Grade ${grade}`;

export function formatAgeRange(range: CanonicalProgram["requirements"]["age_range"]): string | null {
  if (!range) return null;
  if (range.minimum !== undefined && range.maximum !== undefined) return `Ages ${range.minimum}–${range.maximum}`;
  if (range.minimum !== undefined) return `Age ${range.minimum}+`;
  return `Up to age ${range.maximum}`;
}

export function formatGradeRange(range: CanonicalProgram["requirements"]["grade_range"]): string | null {
  if (!range) return null;
  if (range.minimum !== undefined && range.maximum !== undefined) {
    return `${formatGrade(range.minimum)}–${formatGrade(range.maximum)}`;
  }
  if (range.minimum !== undefined) return `${formatGrade(range.minimum)} and above`;
  return `Through ${formatGrade(range.maximum!)}`;
}

const LEGAL_STATUS_LABELS: Record<string, string> = {
  nonprofit: "Nonprofit",
  "registered-nonprofit": "Registered nonprofit",
  "tax-exempt": "Tax-exempt organization",
  "501c3": "501(c)(3)",
  "school-or-education": "School or educational organization",
  other: "Other provider-approved organization",
};

export const formatLegalStatus = (value: string) => LEGAL_STATUS_LABELS[value] ?? formatProviderLabel(value);

export const formatPayoutSchedule = (schedule: CanonicalProgram["timing"]["payout_schedules"][number]) => {
  const delivery = schedule.delivery_method ? ` by ${formatProviderLabel(schedule.delivery_method).toLowerCase()}` : "";
  const anchor = schedule.anchor ? ` (${schedule.anchor})` : "";
  return `${formatProviderLabel(schedule.frequency)}${delivery}${anchor}`;
};

export const resolveProgramPresentation = (provider: CanonicalProvider, program: CanonicalProgram) => {
  const economics = resolveProgramEconomics(provider, program);
  return {
    economics,
    economicsInherited: program.economics_mode === "inherit-provider",
    economicsRows: economics?.status === "known" ? economics.arrangements.map(formatEconomicArrangement) : [],
    economicsMissing: economics && economics.status !== "known" ? RESEARCH_STATE_COPY[economics.status] : null,
    requirementsMissing: program.requirements.status === "known" ? null : RESEARCH_STATE_COPY[program.requirements.status],
    timingMissing: program.timing.status === "known" ? null : RESEARCH_STATE_COPY[program.timing.status],
    logisticsMissing: program.logistics.status === "known" ? null : RESEARCH_STATE_COPY[program.logistics.status],
    programUrl: program.url ?? null,
  };
};
