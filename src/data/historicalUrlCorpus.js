import { legacyRoutes } from "./legacyRoutes.js";

export const HISTORICAL_DISPOSITIONS = [
  "render",
  "redirect",
  "intentional-404-410",
  "unresolved",
];

// The recovered corpus consists of the original site root plus the canonical
// historical URLs recorded in legacyRoutes. Variant spellings are normalization
// inputs, not additional recovered documents.
export const historicalUrlCorpus = [
  { url: "/", disposition: "render", source: "site-root" },
  ...legacyRoutes.map((route) => ({
    url: `/${route.path}.html`,
    disposition: "render",
    source: "legacyRoutes",
  })),
];
