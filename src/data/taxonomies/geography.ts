export const GEOGRAPHY_SCOPES = [
  "us-nationwide",
  "us-regional",
  "us-state-specific",
  "local",
  "canada",
  "international",
] as const;

export type GeographyScope = (typeof GEOGRAPHY_SCOPES)[number];
