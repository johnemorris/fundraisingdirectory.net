export const FUNDRAISING_METHODS = [
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

export type FundraisingMethod = (typeof FUNDRAISING_METHODS)[number];
