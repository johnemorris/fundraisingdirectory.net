/**
 * Canonical internal destination for every provider placement.
 * Organic, featured, sponsored, affiliate, and editorial entry points must all
 * resolve here; placement state changes labeling, never the factual profile URL.
 */
export function providerProfilePath(slug: string) {
  return `/providers/${slug}/`;
}

export type ProviderAffiliationType = "none" | "affiliate" | "sponsor" | "partner" | "owned";

export function providerOutboundRel(affiliationType: ProviderAffiliationType) {
  const paidRelationship = affiliationType === "affiliate" || affiliationType === "sponsor";
  return `noopener noreferrer${paidRelationship ? " sponsored" : ""}`;
}
