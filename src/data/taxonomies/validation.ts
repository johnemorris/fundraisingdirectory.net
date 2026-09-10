import { z } from "astro/zod";
import {
  ACTIVITY_SUBTYPES,
  BENEFICIARY_TYPES,
  CAUSE_AREAS,
  FUNDRAISING_CAPABILITIES,
  FUNDRAISING_OUTCOMES,
} from "./fundraising-dimensions.ts";
import { FUNDRAISING_METHODS } from "./methods.ts";

export const fundraisingMethodSchema = z.enum(FUNDRAISING_METHODS);
export const fundraisingOutcomeSchema = z.enum(FUNDRAISING_OUTCOMES);
export const fundraisingCapabilitySchema = z.enum(FUNDRAISING_CAPABILITIES);
export const beneficiaryTypeSchema = z.enum(BENEFICIARY_TYPES);
export const causeAreaSchema = z.enum(CAUSE_AREAS);
export const activitySubtypeSchema = z.enum(ACTIVITY_SUBTYPES);

export const OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS = {
  outcomes: z.array(fundraisingOutcomeSchema).min(1).optional(),
  capabilities: z.array(fundraisingCapabilitySchema).min(1).optional(),
  beneficiary_types: z.array(beneficiaryTypeSchema).min(1).optional(),
  cause_areas: z.array(causeAreaSchema).min(1).optional(),
  activity_subtypes: z.array(activitySubtypeSchema).min(1).optional(),
};
