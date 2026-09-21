import { formatProviderLabel } from "../data/providerLabels.ts";
import { FUNDRAISING_METHODS, type FundraisingMethod } from "../data/taxonomies/methods.ts";
import { ORGANIZATION_TYPES, type OrganizationType } from "../data/taxonomies/organizations.ts";

const METHOD_LABELS: Partial<Record<FundraisingMethod, string>> = {
  "direct-donations": "Online donations",
  "peer-to-peer": "Peer-to-peer fundraising",
  "events-activities": "Events & activities",
  "pledge-athon": "Pledge / a-thon",
  "restaurant-business-partnerships": "Restaurant / business fundraisers",
  "giving-matching": "Matching gifts",
  "grant-seeking": "Grants",
  "everyday-passive-fundraising": "Passive / everyday fundraising",
  "collection-reuse-fundraising": "Collection / reuse drives",
  "in-kind-resource-fundraising": "In-kind donations & resources",
};

const ORGANIZATION_LABELS: Partial<Record<OrganizationType, string>> = {
  "sports-athletics": "Sports teams",
  "churches-faith": "Churches & faith groups",
  "nonprofits-charities": "Nonprofits & charities",
  "clubs-community": "Clubs & community groups",
  "arts-music-performance": "Arts, music & performance",
  "animal-rescue": "Animal rescues",
  "individuals-personal-causes": "Individuals & families",
};

export const PROVIDER_METHOD_OPTIONS = FUNDRAISING_METHODS.map((id) => ({
  id,
  label: METHOD_LABELS[id] ?? formatProviderLabel(id),
}));

export const PROVIDER_AUDIENCE_OPTIONS = ORGANIZATION_TYPES.map((id) => ({
  id,
  label: ORGANIZATION_LABELS[id] ?? formatProviderLabel(id),
}));

export interface ProviderInquiry {
  organization: {
    name: string;
    website: string;
    introduction: string;
  };
  fundraising: {
    methods: FundraisingMethod[];
    otherSelected: boolean;
    other: string;
  };
  bestFit: {
    organizations: OrganizationType[];
    otherSelected: boolean;
    other: string;
  };
  additionalNotes: string;
  contact: {
    name: string;
    email: string;
    role: string;
    phone: string;
  };
}

const value = (data: FormData, name: string) => String(data.get(name) ?? "").trim();

export function buildProviderInquiry(data: FormData): ProviderInquiry {
  const methodIds = new Set<FundraisingMethod>(FUNDRAISING_METHODS);
  const organizationIds = new Set<OrganizationType>(ORGANIZATION_TYPES);

  return {
    organization: {
      name: value(data, "organization_name"),
      website: value(data, "website"),
      introduction: value(data, "introduction"),
    },
    fundraising: {
      methods: data.getAll("fundraising_methods").map(String).filter((id): id is FundraisingMethod => methodIds.has(id as FundraisingMethod)),
      otherSelected: data.has("fundraising_other_selected"),
      other: value(data, "fundraising_other"),
    },
    bestFit: {
      organizations: data.getAll("best_fit").map(String).filter((id): id is OrganizationType => organizationIds.has(id as OrganizationType)),
      otherSelected: data.has("best_fit_other_selected"),
      other: value(data, "best_fit_other"),
    },
    additionalNotes: value(data, "additional_notes"),
    contact: {
      name: value(data, "contact_name"),
      email: value(data, "contact_email"),
      role: value(data, "contact_role"),
      phone: value(data, "contact_phone"),
    },
  };
}

const methodLabels = new Map(PROVIDER_METHOD_OPTIONS.map(({ id, label }) => [id, label]));
const audienceLabels = new Map(PROVIDER_AUDIENCE_OPTIONS.map(({ id, label }) => [id, label]));
const selectedLabels = (values: string[], labels: Map<string, string>, otherSelected: boolean) => {
  const selections = values.map((id) => labels.get(id) ?? id);
  if (otherSelected) selections.push("Other");
  return selections.length ? selections.join(", ") : "None selected";
};
const answered = (value: string) => value || "Not provided";

export function providerInquiryReview(inquiry: ProviderInquiry) {
  return [
    { label: "Organization", value: inquiry.organization.name },
    { label: "Website", value: inquiry.organization.website },
    { label: "Introduction", value: inquiry.organization.introduction },
    { label: "Fundraising opportunities", value: selectedLabels(inquiry.fundraising.methods, methodLabels, inquiry.fundraising.otherSelected) },
    { label: "Other fundraising opportunity", value: answered(inquiry.fundraising.other) },
    { label: "Best suited for", value: selectedLabels(inquiry.bestFit.organizations, audienceLabels, inquiry.bestFit.otherSelected) },
    { label: "Other audiences", value: answered(inquiry.bestFit.other) },
    { label: "Anything else", value: answered(inquiry.additionalNotes) },
    { label: "Contact", value: inquiry.contact.name },
    { label: "Work email", value: inquiry.contact.email },
    { label: "Role / title", value: answered(inquiry.contact.role) },
    { label: "Phone", value: answered(inquiry.contact.phone) },
  ];
}

export function providerInquiryEmail(inquiry: ProviderInquiry) {
  const lines = providerInquiryReview(inquiry).map(({ label, value }) => `${label}: ${value}`);
  return {
    subject: `Provider listing review — ${inquiry.organization.name}`,
    body: [
      "Hello FundraisingDirectory.net,",
      "",
      "Please review the following information for a possible provider listing:",
      "",
      ...lines,
      "",
      "I understand that submitting this information does not automatically create or publish a listing.",
    ].join("\n"),
  };
}
