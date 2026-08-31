import { formatProviderLabel } from "./providerLabels";
import { FUNDRAISING_METHODS, type FundraisingMethod } from "./taxonomies/methods";
import { ORGANIZATION_TYPES, type OrganizationType } from "./taxonomies/organizations";

export type SemanticKind = "method" | "group";
export type SemanticTone = "teal" | "blue" | "purple" | "navy" | "warm";

const METHOD_TONES: Record<FundraisingMethod, SemanticTone> = {
  "product-sales": "warm",
  "direct-donations": "teal",
  crowdfunding: "blue",
  "peer-to-peer": "purple",
  "events-activities": "navy",
  auctions: "purple",
  "pledge-athon": "teal",
  "restaurant-business-partnerships": "warm",
  sponsorships: "purple",
  "giving-matching": "blue",
};

const GROUP_TONES: Record<OrganizationType, SemanticTone> = {
  schools: "teal",
  "pto-pta": "teal",
  "sports-athletics": "blue",
  "booster-clubs": "blue",
  "churches-faith": "purple",
  "nonprofits-charities": "navy",
  "youth-organizations": "teal",
  "clubs-community": "warm",
  "arts-music-performance": "purple",
  "animal-rescue": "warm",
  "individuals-personal-causes": "blue",
};

export const METHOD_OPTIONS = FUNDRAISING_METHODS.map((value) => ({
  value,
  label: formatProviderLabel(value),
  tone: METHOD_TONES[value],
}));

export const GROUP_OPTIONS = ORGANIZATION_TYPES.map((value) => ({
  value,
  label: formatProviderLabel(value),
  tone: GROUP_TONES[value],
}));

export function semanticClass(kind: SemanticKind, value: string) {
  const tone = kind === "method"
    ? METHOD_TONES[value as FundraisingMethod] ?? "teal"
    : GROUP_TONES[value as OrganizationType] ?? "navy";

  return `semantic-pill semantic-${kind} semantic-${tone}`;
}

export function semanticToneClass(kind: SemanticKind, value: string) {
  const tone = kind === "method"
    ? METHOD_TONES[value as FundraisingMethod] ?? "teal"
    : GROUP_TONES[value as OrganizationType] ?? "navy";

  return `semantic-${tone}`;
}
