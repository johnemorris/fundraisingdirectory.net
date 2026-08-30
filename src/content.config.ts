import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { GEOGRAPHY_SCOPES } from "./data/taxonomies/geography";
import { FUNDRAISING_METHODS } from "./data/taxonomies/methods";
import { ORGANIZATION_TYPES } from "./data/taxonomies/organizations";
import {
  CHANNELS,
  EASE_TO_RAISE,
  FULFILLMENT_TYPES,
  INVENTORY_MODELS,
  UPFRONT_COSTS,
} from "./data/taxonomies/operations";
import { PRODUCTS_SERVICES } from "./data/taxonomies/products-services";

const publicDate = z.string().regex(
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/,
  "Use YYYY-MM-DD or an ISO 8601 timestamp with a timezone",
);

const nullableDate = publicDate.nullable();
const nullableText = z.string().min(1).nullable();
const absoluteUrlOrHistoricalPath = z.union([
  z.string().url(),
  z.string().regex(/^\/(?!\/)[^\s]*$/, "Use an absolute URL or a root-relative historical path"),
]);

const sourceSchema = z.object({
  type: z.enum([
    "official-website",
    "official-program-page",
    "official-document",
    "official-social",
    "direct-provider-contact",
    "reputable-third-party",
    "legacy-directory",
    "other",
  ]),
  url: z.string().url(),
  checked_at: publicDate,
  notes: nullableText,
});

const programSchema = z.object({
  id: z.string().regex(/^prog_\d{6}$/),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  method: z.enum(FUNDRAISING_METHODS),
  products_services: z.array(z.enum(PRODUCTS_SERVICES)),
  channels: z.array(z.enum(CHANNELS)).min(1),
  online_ordering: z.boolean().nullable(),
  fulfillment: z.array(z.enum(FULFILLMENT_TYPES)).min(1),
  inventory_model: z.enum(INVENTORY_MODELS),
  upfront_cost: z.enum(UPFRONT_COSTS),
  ease_to_raise: z.enum(EASE_TO_RAISE).nullable(),
  summary: z.string().min(1),
});

const providers = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/providers" }),
  schema: z.object({
    meta: z.object({
      id: z.string().regex(/^prov_\d{6}$/),
      schema_version: z.literal(1),
      created_at: publicDate,
      created_by: z.string().regex(/^user_\d{6}$/),
      modified_at: publicDate,
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
      website: z.string().url(),
      fundraising_url: z.string().url().nullable(),
      logo: z.string().url().nullable(),
    }),
    classification: z.object({
      methods: z.array(z.enum(FUNDRAISING_METHODS)).min(1),
      products_services: z.array(z.enum(PRODUCTS_SERVICES)),
      organizations: z.array(z.enum(ORGANIZATION_TYPES)).min(1),
    }),
    programs: z.array(programSchema).min(1),
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
      first_verified_at: publicDate,
      last_verified_at: publicDate,
      next_review_at: nullableDate,
      inactive_since: nullableDate,
      inactive_reason: nullableText,
    }),
    verification: z.object({
      level: z.enum(["verified", "partially-verified", "unverified"]),
      sources: z.array(sourceSchema).min(1),
    }),
    provenance: z.object({
      discovered_via: z.array(z.enum([
        "legacy-directory",
        "web-research",
        "provider-submission",
        "editorial-research",
      ])),
      legacy: z.object({
        listed: z.boolean(),
        name: nullableText,
        url: absoluteUrlOrHistoricalPath.nullable(),
      }),
    }),
    affiliation: z.object({
      type: z.enum(["none", "affiliate", "sponsor", "partner", "owned"]),
      disclosure_required: z.boolean(),
    }),
    editorial: z.object({
      featured: z.boolean(),
    }),
  }),
});

export const collections = { providers };
