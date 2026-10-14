import type { CanonicalProvider } from "./providerSchema.ts";
import { providerProfilePath } from "./providerLinks.ts";

/**
 * Explicitly whitelist the editorial fields Finder is allowed to score.
 * Commercial placement, affiliation, and featured state must never enter this payload.
 */
export function serializeFinderProvider(data: CanonicalProvider) {
  return {
    identity: {
      name: data.identity.name,
      slug: data.identity.slug,
      profilePath: providerProfilePath(data.identity.slug),
    },
    classification: data.classification,
    programs: data.programs.map((program) => ({
      name: program.name,
      method: program.method,
      products_services: program.products_services,
      channels: program.channels,
      inventory_model: program.inventory_model,
      upfront_cost: program.upfront_cost,
      ease_to_raise: program.ease_to_raise,
      outcomes: program.outcomes,
      requirements: {
        status: program.requirements.status,
        minimum_group_size: program.requirements.minimum_group_size,
      },
      timing: {
        status: program.timing.status,
        setup_lead_time: program.timing.setup_lead_time,
      },
    })),
    geography: data.geography,
  };
}
