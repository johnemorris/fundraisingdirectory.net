import { z } from "astro/zod";
import { publicDateSchema } from "../../data/providerSchema.ts";
import { GEOGRAPHY_SCOPES } from "../../data/taxonomies/geography.ts";
import { ORGANIZATION_TYPES } from "../../data/taxonomies/organizations.ts";
import {
  CHANNELS,
  EASE_TO_RAISE,
  FULFILLMENT_TYPES,
  INVENTORY_MODELS,
  UPFRONT_COSTS,
} from "../../data/taxonomies/operations.ts";
import { PRODUCTS_SERVICES } from "../../data/taxonomies/products-services.ts";
import {
  beneficiaryTypeSchema,
  fundraisingMethodSchema,
  OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
} from "../../data/taxonomies/validation.ts";
import {
  AFFILIATE_NETWORKS,
  AFFILIATE_STATUSES,
  COMPLETENESS_STATES,
  DRAFT_ORIGINS,
  RECORD_TYPES,
  SOURCE_TYPES,
  VERIFICATION_STATES,
} from "./types.ts";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nullableUrl = z.string().url().nullable();
const percentage = z.number().finite();

export const intakeBeneficiarySchema = z.object({
  type: beneficiaryTypeSchema,
  name: z.string().min(1),
  slug: slugSchema,
  official: z.boolean(),
});

export const intakeProgramSchema = z.object({
  id: z.string().regex(/^prog_\d{6}$/).optional(),
  name: z.string().min(1).optional(),
  slug: slugSchema.optional(),
  url: z.string().url().optional(),
  method: fundraisingMethodSchema.optional(),
  products_services: z.array(z.enum(PRODUCTS_SERVICES)).optional(),
  channels: z.array(z.enum(CHANNELS)).min(1).optional(),
  online_ordering: z.boolean().nullable().optional(),
  fulfillment: z.array(z.enum(FULFILLMENT_TYPES)).min(1).optional(),
  inventory_model: z.enum(INVENTORY_MODELS).optional(),
  upfront_cost: z.enum(UPFRONT_COSTS).optional(),
  ease_to_raise: z.enum(EASE_TO_RAISE).nullable().optional(),
  summary: z.string().min(1).optional(),
  beneficiary: intakeBeneficiarySchema.optional(),
  ...OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
});

export const intakeSourceSchema = z.object({
  url: z.string().url(),
  source_type: z.enum(SOURCE_TYPES),
  title: z.string().min(1),
  supports: z.array(z.string().regex(/^[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)*$/)).default([]),
  checked_at: publicDateSchema,
  notes: z.string().min(1).optional(),
});

export const intakeRecordSchema = z.object({
  record_type: z.enum(RECORD_TYPES),
  origin: z.enum(DRAFT_ORIGINS),
  identity: z.object({
    name: z.string().min(1).optional(),
    slug: slugSchema.optional(),
    aliases: z.array(z.string().min(1)).optional(),
    legal_name: z.string().min(1).nullable().optional(),
    website: z.string().url().optional(),
    fundraising_url: nullableUrl.optional(),
    logo: nullableUrl.optional(),
  }),
  classification: z.object({
    methods: z.array(fundraisingMethodSchema).min(1).optional(),
    products_services: z.array(z.enum(PRODUCTS_SERVICES)).optional(),
    organizations: z.array(z.enum(ORGANIZATION_TYPES)).min(1).optional(),
    ...OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
  }).optional(),
  programs: z.array(intakeProgramSchema).optional(),
  beneficiary: intakeBeneficiarySchema.optional(),
  geography: z.object({
    scope: z.array(z.enum(GEOGRAPHY_SCOPES)).min(1).optional(),
    countries: z.array(z.string().length(2)).optional(),
    states: z.array(z.string().min(1)).optional(),
    regions: z.array(z.string().min(1)).optional(),
    notes: z.string().min(1).nullable().optional(),
  }).optional(),
  economics: z.object({
    platform_fee_percent: percentage.optional(),
    transaction_fee_percent: percentage.optional(),
    proceeds_percent: percentage.optional(),
    notes: z.string().min(1).optional(),
  }).optional(),
  requirements: z.array(z.string().min(1)).optional(),
  logistics: z.array(z.string().min(1)).optional(),
  content: z.object({
    summary: z.string().min(1).optional(),
    how_it_works: z.string().min(1).optional(),
    best_for: z.array(z.string().min(1)).optional(),
    considerations: z.array(z.string().min(1)).optional(),
  }).optional(),
  publication: z.object({
    lifecycle: z.enum(["active", "inactive", "uncertain", "historical"]).optional(),
    next_review_at: publicDateSchema.nullable().optional(),
    inactive_since: publicDateSchema.nullable().optional(),
    inactive_reason: z.string().min(1).nullable().optional(),
  }).optional(),
  sources: z.array(intakeSourceSchema).optional(),
  verification: z.object({
    status: z.enum(VERIFICATION_STATES),
    first_researched_at: publicDateSchema.optional(),
    first_verified_at: publicDateSchema.optional(),
    last_verified_at: publicDateSchema.optional(),
    reviewer: z.string().min(1).optional(),
    verifier: z.string().min(1).optional(),
    record_level_recheck: z.boolean().optional(),
  }).optional(),
  completeness: z.enum(COMPLETENESS_STATES).optional(),
  commercial_research: z.object({
    affiliate_status: z.enum(AFFILIATE_STATUSES),
    affiliate_program_url: z.string().url().optional(),
    affiliate_network: z.enum(AFFILIATE_NETWORKS).optional(),
    commission_structure: z.string().min(1).optional(),
    cookie_duration_days: z.number().int().nonnegative().optional(),
    eligibility_requirements: z.string().min(1).optional(),
    checked_at: publicDateSchema.optional(),
    approved_destination_url: z.string().url().optional(),
    internal_notes: z.string().min(1).optional(),
  }).optional(),
  workflow: z.object({
    approved: z.boolean().optional(),
    approved_by: z.string().min(1).optional(),
    approved_at: publicDateSchema.optional(),
  }).optional(),
});

export type IntakeRecord = z.infer<typeof intakeRecordSchema>;
