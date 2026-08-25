export const ORGANIZATION_TYPES = [
  "schools",
  "pto-pta",
  "sports-athletics",
  "booster-clubs",
  "churches-faith",
  "nonprofits-charities",
  "youth-organizations",
  "clubs-community",
  "arts-music-performance",
  "animal-rescue",
  "individuals-personal-causes",
] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
