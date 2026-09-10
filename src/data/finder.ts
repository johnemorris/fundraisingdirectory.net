import { GROUP_OPTIONS, METHOD_OPTIONS } from "./semanticTaxonomy";
import type { FundraisingOutcome } from "./taxonomies/fundraising-dimensions";

export const FINDER_GROUP_OPTIONS = [
  { value: "", label: "Any group" },
  ...GROUP_OPTIONS,
  { value: "other", label: "Other / not listed" },
];

export const FINDER_OUTCOME_OPTIONS = [
  { value: "open-to-ideas", label: "Open to ideas" },
  { value: "cash", label: "Raise cash" },
  { value: "supplies", label: "Get supplies" },
  { value: "technology", label: "Fund technology" },
  { value: "grants", label: "Find grants" },
  { value: "sponsorship", label: "Find sponsors" },
] satisfies ReadonlyArray<{ value: "open-to-ideas" | FundraisingOutcome; label: string }>;

export const FINDER_METHOD_OPTIONS = METHOD_OPTIONS;

export const FINDER_FORMAT_OPTIONS = [
  { value: "", label: "No preference" },
  { value: "online", label: "Online" },
  { value: "offline", label: "In person" },
  { value: "hybrid", label: "Hybrid" },
];

export const FINDER_EFFORT_OPTIONS = [
  { value: "", label: "Flexible" },
  { value: "easy", label: "Lower effort" },
  { value: "moderate", label: "Moderate" },
  { value: "hands-on", label: "Hands-on is fine" },
];

export const FINDER_TIME_OPTIONS = [
  { value: "", label: "Flexible" },
  { value: "fast", label: "Start quickly" },
  { value: "few-weeks", label: "A few weeks" },
  { value: "longer", label: "A month or more" },
];

export const FINDER_SIZE_OPTIONS = [
  { value: "", label: "Not sure" },
  { value: "small", label: "Under 25" },
  { value: "medium", label: "25–100" },
  { value: "large", label: "More than 100" },
];

export const FINDER_CONSTRAINT_OPTIONS = [
  { value: "no-upfront-cost", label: "No upfront cost" },
  { value: "no-inventory", label: "No inventory" },
  { value: "no-food", label: "No food" },
  { value: "low-volunteer-effort", label: "Low volunteer effort" },
  { value: "online-only", label: "Online only" },
  { value: "passive", label: "Passive / ongoing" },
  { value: "fast", label: "Need to move fast" },
];

export const FINDER_COUNTRY_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "other", label: "Another country" },
];
