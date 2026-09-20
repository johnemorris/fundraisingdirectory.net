import { z } from "astro/zod";
import { GEOGRAPHY_SCOPES } from "./taxonomies/geography.ts";
import { ORGANIZATION_TYPES } from "./taxonomies/organizations.ts";
import {
  CHANNELS,
  EASE_TO_RAISE,
  FULFILLMENT_TYPES,
  INVENTORY_MODELS,
  UPFRONT_COSTS,
} from "./taxonomies/operations.ts";
import { PRODUCTS_SERVICES } from "./taxonomies/products-services.ts";
import {
  beneficiaryTypeSchema,
  fundraisingMethodSchema,
  OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
} from "./taxonomies/validation.ts";

export const publicDateSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/,
  "Use YYYY-MM-DD or an ISO 8601 timestamp with a timezone",
);

const nullableDate = publicDateSchema.nullable();
const nullableText = z.string().min(1).nullable();
const absoluteUrlOrHistoricalPath = z.union([
  z.string().url(),
  z.string().regex(/^\/(?!\/)[^\s]*$/, "Use an absolute URL or a root-relative historical path"),
]);

export const RESEARCH_STATES = [
  "not-researched",
  "researched-unknown",
  "not-applicable",
  "known",
] as const;

export const SOURCE_REVIEW_STATES = ["current", "stale", "disputed", "needs-recheck"] as const;

export const researchStateSchema = z.enum(RESEARCH_STATES);

const percentageSchema = z.number().finite().min(0).max(100);
const currencySchema = z.string().regex(/^[A-Z]{3}$/, "Use an ISO 4217 currency code");
const positiveNumber = z.number().finite().nonnegative();

const exactAmountSchema = z.object({
  kind: z.literal("amount"),
  amount: positiveNumber,
  currency: currencySchema,
});

const amountRangeSchema = z.object({
  kind: z.literal("amount-range"),
  minimum: positiveNumber,
  maximum: positiveNumber,
  currency: currencySchema,
}).refine((value) => value.minimum <= value.maximum, {
  message: "Amount range minimum cannot exceed maximum",
});

const exactPercentageSchema = z.object({
  kind: z.literal("percentage"),
  percent: percentageSchema,
});

const percentageRangeSchema = z.object({
  kind: z.literal("percentage-range"),
  minimum: percentageSchema,
  maximum: percentageSchema,
}).refine((value) => value.minimum <= value.maximum, {
  message: "Percentage range minimum cannot exceed maximum",
});

const exactQuantitySchema = z.object({
  kind: z.literal("quantity"),
  amount: positiveNumber,
  unit: z.string().min(1),
});

const quantityRangeSchema = z.object({
  kind: z.literal("quantity-range"),
  minimum: positiveNumber,
  maximum: positiveNumber,
  unit: z.string().min(1),
}).refine((value) => value.minimum <= value.maximum, {
  message: "Quantity range minimum cannot exceed maximum",
});

const variableValueSchema = z.object({
  kind: z.literal("variable"),
  description: z.string().min(1),
});

const tierPayoutSchema = z.union([
  exactAmountSchema,
  exactPercentageSchema,
  exactQuantitySchema,
]);

const tieredValueSchema = z.object({
  kind: z.literal("tiered"),
  tiers: z.array(z.object({
    threshold: z.string().min(1),
    payout: tierPayoutSchema,
  })).min(1),
});

export const economicValueSchema = z.union([
  exactAmountSchema,
  amountRangeSchema,
  exactPercentageSchema,
  percentageRangeSchema,
  exactQuantitySchema,
  quantityRangeSchema,
  variableValueSchema,
  tieredValueSchema,
]);

export const programEconomicsSchema = z.object({
  status: researchStateSchema,
  arrangements: z.array(z.object({
    type: z.enum([
      "upfront-cost",
      "platform-fee",
      "processing-fee",
      "transaction-fee",
      "product-sale-profit",
      "product-sale-margin",
      "restaurant-give-back",
      "proceeds",
      "revenue-share",
      "fixed-payout",
      "minimum-payout",
      "minimum-order",
      "minimum-sales",
      "other",
    ]),
    value: economicValueSchema,
    basis: nullableText,
    conditions: z.array(z.string().min(1)),
    caveats: z.array(z.string().min(1)),
  })),
  notes: z.array(z.string().min(1)),
}).superRefine((value, context) => {
  if (value.status === "known" && value.arrangements.length === 0 && value.notes.length === 0) {
    context.addIssue({ code: "custom", message: "Known economics require an arrangement or note" });
  }
  if (value.status !== "known" && (value.arrangements.length > 0 || value.notes.length > 0)) {
    context.addIssue({ code: "custom", message: "Only known economics may contain arrangements or notes" });
  }
});

const requirementThresholdSchema = z.union([
  exactAmountSchema,
  amountRangeSchema,
  exactQuantitySchema,
  quantityRangeSchema,
  variableValueSchema,
]);

const gradeSchema = z.enum([
  "pre-k", "kindergarten", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "postsecondary",
]);

const ageRangeSchema = z.object({
  minimum: positiveNumber.optional(),
  maximum: positiveNumber.optional(),
}).refine((value) => value.minimum !== undefined || value.maximum !== undefined, {
  message: "Provide a minimum or maximum age",
}).refine((value) => value.minimum === undefined || value.maximum === undefined || value.minimum <= value.maximum, {
  message: "Minimum age cannot exceed maximum age",
});

const gradeRangeSchema = z.object({
  minimum: gradeSchema.optional(),
  maximum: gradeSchema.optional(),
}).refine((value) => value.minimum !== undefined || value.maximum !== undefined, {
  message: "Provide a minimum or maximum grade",
});

export const programRequirementsSchema = z.object({
  status: researchStateSchema,
  legal_status: z.array(z.enum([
    "nonprofit",
    "registered-nonprofit",
    "tax-exempt",
    "501c3",
    "school-or-education",
    "other",
  ])),
  age_range: ageRangeSchema.nullable(),
  grade_range: gradeRangeSchema.nullable(),
  participation_requirements: z.array(z.string().min(1)),
  minimum_group_size: z.number().int().positive().nullable(),
  minimum_order: requirementThresholdSchema.nullable(),
  minimum_sales: requirementThresholdSchema.nullable(),
  other_restrictions: z.array(z.string().min(1)),
  editorial_summary: nullableText,
}).superRefine((value, context) => {
  const hasDetails = value.legal_status.length > 0
    || value.age_range !== null
    || value.grade_range !== null
    || value.participation_requirements.length > 0
    || value.minimum_group_size !== null
    || value.minimum_order !== null
    || value.minimum_sales !== null
    || value.other_restrictions.length > 0
    || value.editorial_summary !== null;
  if (value.status === "known" && !hasDetails) {
    context.addIssue({ code: "custom", message: "Known requirements require at least one structured fact or editorial summary" });
  }
  if (value.status !== "known" && hasDetails) {
    context.addIssue({ code: "custom", message: "Only known requirements may contain requirement details" });
  }
});

const durationSchema = z.object({
  value: positiveNumber,
  unit: z.enum(["hours", "days", "weeks", "months"]),
});

const durationRangeSchema = z.object({
  minimum: durationSchema.optional(),
  typical: durationSchema.optional(),
  maximum: durationSchema.optional(),
}).refine((value) => value.minimum || value.typical || value.maximum, {
  message: "Provide at least one duration value",
});

export const programTimingSchema = z.object({
  status: researchStateSchema,
  lead_time: durationRangeSchema.nullable(),
  campaign_duration: durationRangeSchema.nullable(),
  notes: z.array(z.string().min(1)),
}).superRefine((value, context) => {
  const hasDetails = value.lead_time !== null || value.campaign_duration !== null || value.notes.length > 0;
  if (value.status === "known" && !hasDetails) {
    context.addIssue({ code: "custom", message: "Known timing requires a duration or note" });
  }
  if (value.status !== "known" && hasDetails) {
    context.addIssue({ code: "custom", message: "Only known timing may contain timing details" });
  }
});

export const programLogisticsSchema = z.object({
  status: researchStateSchema,
  notes: z.array(z.string().min(1)),
}).superRefine((value, context) => {
  if (value.status === "known" && value.notes.length === 0) {
    context.addIssue({ code: "custom", message: "Known logistics require at least one note" });
  }
  if (value.status !== "known" && value.notes.length > 0) {
    context.addIssue({ code: "custom", message: "Only known logistics may contain notes" });
  }
});

export const sourceClaimSchema = z.object({
  path: z.string().regex(/^[a-z][a-z0-9_-]*(?:\.[a-z0-9_-]+)*$/),
  status: z.enum(SOURCE_REVIEW_STATES),
  notes: nullableText,
});

export const providerSourceSchema = z.object({
  id: z.string().regex(/^src_\d{6}$/),
  type: z.enum([
    "official-website",
    "official-program-page",
    "official-document",
    "official-social",
    "direct-provider-contact",
    "reputable-third-party",
    "legacy-directory",
    "other",
    "official-provider",
    "official-charity",
    "official-program",
    "government",
    "platform-documentation",
    "terms-or-fees",
    "public-press-release",
    "frd-editorial-note",
  ]),
  url: z.string().url(),
  title: nullableText,
  checked_at: publicDateSchema,
  status: z.enum(SOURCE_REVIEW_STATES),
  supports: z.array(sourceClaimSchema),
  notes: nullableText,
});

export const beneficiaryRelationshipSchema = z.object({
  type: beneficiaryTypeSchema,
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  official: z.boolean(),
});

export const providerProgramSchema = z.object({
  id: z.string().regex(/^prog_\d{6}$/),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  url: z.string().url().optional(),
  method: fundraisingMethodSchema,
  products_services: z.array(z.enum(PRODUCTS_SERVICES)),
  channels: z.array(z.enum(CHANNELS)).min(1),
  online_ordering: z.boolean().nullable(),
  fulfillment: z.array(z.enum(FULFILLMENT_TYPES)).min(1),
  inventory_model: z.enum(INVENTORY_MODELS),
  upfront_cost: z.enum(UPFRONT_COSTS),
  ease_to_raise: z.enum(EASE_TO_RAISE).nullable(),
  summary: z.string().min(1),
  beneficiary: beneficiaryRelationshipSchema.optional(),
  economics: programEconomicsSchema,
  requirements: programRequirementsSchema,
  timing: programTimingSchema,
  logistics: programLogisticsSchema,
  ...OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
});

export const providerSchema = z.object({
  meta: z.object({
    id: z.string().regex(/^prov_\d{6}$/),
    schema_version: z.literal(2),
    created_at: publicDateSchema,
    created_by: z.string().regex(/^user_\d{6}$/),
    modified_at: publicDateSchema,
    modified_by: z.string().regex(/^user_\d{6}$/),
    deleted: z.boolean(),
    deleted_at: nullableDate,
    deleted_by: z.string().regex(/^user_\d{6}$/).nullable(),
    deletion_reason: nullableText,
  }).superRefine((meta, context) => {
    const deletionFields = [meta.deleted_at, meta.deleted_by, meta.deletion_reason];
    if (meta.deleted && deletionFields.some((value) => value === null)) {
      context.addIssue({
        code: "custom",
        message: "Deleted records require deleted_at, deleted_by, and deletion_reason",
      });
    }
    if (!meta.deleted && deletionFields.some((value) => value !== null)) {
      context.addIssue({
        code: "custom",
        message: "Active records cannot contain deletion metadata",
      });
    }
  }),
  identity: z.object({
    name: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    legal_name: nullableText,
    aliases: z.array(z.string().min(1)),
    website: z.string().url(),
    fundraising_url: z.string().url().nullable(),
    logo: z.string().url().nullable(),
  }),
  classification: z.object({
    methods: z.array(fundraisingMethodSchema).min(1),
    products_services: z.array(z.enum(PRODUCTS_SERVICES)),
    organizations: z.array(z.enum(ORGANIZATION_TYPES)).min(1),
    ...OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
  }),
  programs: z.array(providerProgramSchema).min(1),
  geography: z.object({
    scope: z.array(z.enum(GEOGRAPHY_SCOPES)).min(1),
    countries: z.array(z.string().length(2)),
    states: z.array(z.string().min(1)),
    regions: z.array(z.string().min(1)),
    notes: nullableText,
  }),
  content: z.object({
    summary: z.string().min(1),
    how_it_works: z.string().min(1),
    best_for: z.array(z.string().min(1)),
    considerations: z.array(z.string().min(1)),
  }),
  status: z.object({
    lifecycle: z.enum(["active", "inactive", "uncertain", "historical"]),
    first_verified_at: publicDateSchema,
    last_verified_at: publicDateSchema,
    next_review_at: nullableDate,
    inactive_since: nullableDate,
    inactive_reason: nullableText,
  }),
  verification: z.object({
    level: z.enum(["verified", "partially-verified", "unverified"]),
    review_status: z.enum(SOURCE_REVIEW_STATES),
    completeness: z.enum(["unassessed", "minimal", "standard", "anchor-quality"]),
    first_researched_at: nullableDate,
    reviewed_by: nullableText,
    verified_by: nullableText,
    sources: z.array(providerSourceSchema).min(1),
  }),
  provenance: z.object({
    discovered_via: z.array(z.enum([
      "legacy-directory",
      "web-research",
      "provider-submission",
      "editorial-research",
    ])),
    intake_origins: z.array(z.enum([
      "internal-research",
      "bulk-import",
      "provider-submission",
      "organization-submission",
      "claim-update",
      "automated-research-assist",
    ])),
    legacy: z.object({
      listed: z.boolean(),
      name: nullableText,
      url: absoluteUrlOrHistoricalPath.nullable(),
    }),
  }),
  commercial_research: z.object({
    affiliate_status: z.enum(["unknown", "none-found", "available", "applied", "approved", "rejected"]),
    affiliate_program_url: z.string().url().nullable(),
    affiliate_network: z.enum(["direct", "impact", "cj", "shareasale", "partnerstack", "other"]).nullable(),
    commission_structure: nullableText,
    cookie_duration_days: z.number().int().nonnegative().nullable(),
    eligibility_requirements: nullableText,
    checked_at: nullableDate,
    approved_destination_url: z.string().url().nullable(),
    internal_notes: nullableText,
  }),
  affiliation: z.object({
    type: z.enum(["none", "affiliate", "sponsor", "partner", "owned"]),
    disclosure_required: z.boolean(),
  }),
  editorial: z.object({
    featured: z.boolean(),
  }),
});

export type CanonicalProvider = z.infer<typeof providerSchema>;
export type CanonicalProgram = z.infer<typeof providerProgramSchema>;
