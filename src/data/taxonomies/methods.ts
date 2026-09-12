// Keep the current discovery UI deliberately narrower than the full schema.
// Adding a legal provider-data method must not automatically publish an
// unfinished filter, navigation item, or Finder choice.
export const DISCOVERY_METHODS = [
  "product-sales",
  "direct-donations",
  "crowdfunding",
  "peer-to-peer",
  "events-activities",
  "auctions",
  "pledge-athon",
  "restaurant-business-partnerships",
  "sponsorships",
  "giving-matching",
] as const;

export const FUNDRAISING_METHODS = [
  ...DISCOVERY_METHODS,
  "grant-seeking",
  "everyday-passive-fundraising",
  "collection-reuse-fundraising",
  "in-kind-resource-fundraising",
] as const;

export type FundraisingMethod = (typeof FUNDRAISING_METHODS)[number];
export type DiscoveryMethod = (typeof DISCOVERY_METHODS)[number];
