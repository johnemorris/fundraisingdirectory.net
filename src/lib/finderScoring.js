import { FUNDRAISING_OUTCOMES } from "../data/taxonomies/fundraising-dimensions.ts";

const FOOD_PRODUCTS = new Set([
  "candy-chocolate",
  "cookie-dough-cookies",
  "popcorn",
  "coffee-beverages",
  "baked-goods",
  "snacks",
  "frozen-prepared-foods",
]);

const EVENT_METHODS = new Set(["events-activities", "auctions", "pledge-athon", "restaurant-business-partnerships"]);
const APPROVED_OUTCOMES = new Set(FUNDRAISING_OUTCOMES);
const CASH_METHODS = new Set([
  "direct-donations",
  "crowdfunding",
  "peer-to-peer",
  "product-sales",
  "events-activities",
  "pledge-athon",
  "auctions",
  "restaurant-business-partnerships",
  "sponsorships",
  "giving-matching",
]);

// These named weights make the deterministic ranking policy inspectable. Provider
// sponsorship and affiliate fields are intentionally absent from both the policy
// and the serialized Finder data.
export const SCORING_WEIGHTS = Object.freeze({
  provider: Object.freeze({
    groupMatch: 28,
    groupMismatch: -18,
    methodMatch: 24,
    methodMismatch: -4,
    outcomeMatch: 18,
    formatMatch: 16,
    formatMismatch: -9,
    acceptableProductOrEvent: 6,
    budgetMatch: 12,
    effortMatch: 12,
    effortMismatch: -6,
    constraintMatch: 10,
    geographyMatch: 10,
  }),
  method: Object.freeze({
    outcomeMatch: 24,
    selectedMethod: 28,
    formatMatch: 14,
    acceptableProductOrEvent: 6,
    effortMatch: 10,
    preferenceMatch: 8,
  }),
  confidencePenalty: Object.freeze({
    undocumentedOutcome: 12,
    upfrontCost: 16,
    effort: 14,
    inventory: 14,
    volunteerEffort: 14,
    country: 12,
    zip: 8,
    groupSize: 8,
    timing: 10,
    passive: 12,
  }),
});

export const METHOD_PROFILES = [
  { id: "direct-donations", label: "Direct Donations", outcomes: ["cash", "supplies", "technology"], channels: ["online", "in-person", "hybrid"], product: false, event: false, upfront: "none", inventory: "none", effort: "moderate", timing: ["fast", "few-weeks"], description: "Ask supporters to contribute directly without requiring a purchase." },
  { id: "crowdfunding", label: "Crowdfunding", outcomes: ["cash", "supplies", "technology"], channels: ["online"], product: false, event: false, upfront: "none", inventory: "none", effort: "moderate", timing: ["fast", "few-weeks"], description: "Share an online campaign around a clear need, story, and goal." },
  { id: "peer-to-peer", label: "Peer-to-peer", outcomes: ["cash"], channels: ["online", "hybrid"], product: false, event: false, upfront: "none", inventory: "none", effort: "moderate", timing: ["few-weeks"], description: "Invite participants to fundraise through their own networks." },
  { id: "product-sales", label: "Product Sales", outcomes: ["cash"], channels: ["online", "in-person", "hybrid"], product: true, event: false, upfront: "varies", inventory: "varies", effort: "hands-on", timing: ["few-weeks"], description: "Earn proceeds by selling products through direct sales, preorders, or online stores." },
  { id: "events-activities", label: "Events & Activities", outcomes: ["cash"], channels: ["in-person", "hybrid"], product: false, event: true, upfront: "varies", inventory: "none", effort: "hands-on", timing: ["few-weeks"], description: "Bring supporters together around an activity, challenge, or community event." },
  { id: "pledge-athon", label: "Pledge-a-thon", outcomes: ["cash"], channels: ["in-person", "hybrid"], product: false, event: true, upfront: "varies", inventory: "none", effort: "hands-on", timing: ["few-weeks"], description: "Collect pledges tied to participation, distance, reading, fitness, or another challenge." },
  { id: "auctions", label: "Auctions", outcomes: ["cash"], channels: ["online", "in-person", "hybrid"], product: false, event: true, upfront: "varies", inventory: "varies", effort: "hands-on", timing: ["few-weeks"], description: "Raise funds through donated items, experiences, and competitive bidding." },
  { id: "restaurant-business-partnerships", label: "Restaurant & Business Partnerships", outcomes: ["cash", "sponsorship"], channels: ["in-person", "hybrid"], product: false, event: true, upfront: "none", inventory: "none", effort: "easy", timing: ["fast", "few-weeks"], description: "Partner with a local business for a give-back night or shared promotion." },
  { id: "sponsorships", label: "Sponsorships", outcomes: ["cash", "supplies", "technology", "sponsorship"], channels: ["in-person", "hybrid"], product: false, event: false, upfront: "none", inventory: "none", effort: "moderate", timing: ["few-weeks"], description: "Ask businesses or community partners to support a program, event, team, or need." },
  { id: "giving-matching", label: "Giving & Matching", outcomes: ["cash"], channels: ["online", "hybrid"], product: false, event: false, upfront: "none", inventory: "none", effort: "easy", timing: ["fast", "few-weeks"], description: "Increase donations through employer matching or a committed matching supporter." },
  { id: "grant-seeking", label: "Grant Seeking", outcomes: ["cash", "supplies", "technology", "grants"], channels: ["online", "in-person", "hybrid"], product: false, event: false, upfront: "none", inventory: "none", effort: "hands-on", timing: ["longer"], description: "Pursue structured funding opportunities with eligibility rules and application requirements." },
];

const normalizeList = (value) => Array.isArray(value) ? [...new Set(value.filter(Boolean))] : value ? [value] : [];

export function normalizeFinderAnswers(answers = {}) {
  const outcomes = normalizeList(answers.outcomes ?? answers.outcome).filter((outcome) => APPROVED_OUTCOMES.has(outcome));
  return {
    group: answers.group ?? "",
    outcomes,
    methods: normalizeList(answers.methods ?? answers.method),
    format: answers.format ?? "",
    products: answers.products ?? "any",
    events: answers.events ?? "any",
    budget: answers.budget ?? "any",
    groupSize: answers.groupSize ?? "",
    effort: answers.effort ?? "",
    time: answers.time ?? "",
    country: answers.country ?? "",
    zip: String(answers.zip ?? "").trim(),
    constraints: normalizeList(answers.constraints),
  };
}

function formatMatches(answerFormat, channels) {
  if (!answerFormat) return false;
  if (answerFormat === "offline") return channels.includes("in-person");
  return channels.includes(answerFormat);
}

function countryMatch(country, geography) {
  if (!country) return { known: false, matches: false, conflicts: false };
  if (country === "other") {
    return {
      known: geography.scope?.includes("international") ?? false,
      matches: geography.scope?.includes("international") ?? false,
      conflicts: false,
    };
  }
  const knownCountries = geography.countries ?? [];
  return {
    known: knownCountries.length > 0,
    matches: knownCountries.includes(country) || (country === "US" && geography.scope?.some((scope) => scope.startsWith("us-"))),
    conflicts: knownCountries.length > 0 && !knownCountries.includes(country) && !geography.scope?.includes("international"),
  };
}

function outcomeMatchesProgram(outcome, program, provider) {
  if (!outcome) return false;
  if (program.outcomes?.includes(outcome) || provider.classification.outcomes?.includes(outcome)) return true;
  if (outcome === "cash") return CASH_METHODS.has(program.method);
  if (outcome === "sponsorship") return program.method === "sponsorships";
  if (outcome === "supplies") return program.products_services?.includes("books-educational") ?? false;
  return false;
}

function hardConflict(program, answers, geography) {
  const constraints = new Set(answers.constraints);
  if ((answers.products === "no" || constraints.has("no-products")) && program.method === "product-sales") return "Requires product selling";
  if ((answers.events === "no" || constraints.has("no-events")) && EVENT_METHODS.has(program.method)) return "Requires an event or activity";
  if (constraints.has("no-food") && program.products_services?.some((product) => FOOD_PRODUCTS.has(product))) return "Includes food products";
  if (constraints.has("no-inventory") && program.inventory_model === "upfront-inventory") return "Requires upfront inventory";
  if (constraints.has("online-only") && !program.channels?.includes("online")) return "Does not support an online format";
  if (constraints.has("low-volunteer-effort") && program.ease_to_raise === "hands-on") return "Documented as hands-on";
  if ((answers.budget === "none" || constraints.has("no-upfront-cost")) && program.upfront_cost === "required") return "Requires an upfront cost";
  const location = countryMatch(answers.country, geography);
  if (location.conflicts) return "Not documented for the selected country";
  return null;
}

export function evaluateProviderProgram(provider, program, rawAnswers = {}) {
  const answers = normalizeFinderAnswers(rawAnswers);
  const conflict = hardConflict(program, answers, provider.geography ?? {});
  if (conflict) return { excluded: true, exclusionReason: conflict };

  let score = 0;
  let confidence = 100;
  const reasons = [];
  const matchedConstraints = [];
  const gaps = [];
  const constraints = new Set(answers.constraints);
  const weights = SCORING_WEIGHTS.provider;
  const confidencePenalty = SCORING_WEIGHTS.confidencePenalty;

  if (answers.group && answers.group !== "other") {
    if (provider.classification.organizations.includes(answers.group)) {
      score += weights.groupMatch;
      reasons.push("Serves your type of organization");
    } else score += weights.groupMismatch;
  }

  if (answers.methods.length) {
    if (answers.methods.includes(program.method)) {
      score += weights.methodMatch;
      reasons.push("Matches a fundraising method you selected");
    } else score += weights.methodMismatch;
  }

  if (answers.outcomes.length) {
    if (answers.outcomes.some((outcome) => outcomeMatchesProgram(outcome, program, provider))) {
      score += weights.outcomeMatch;
      reasons.push("Supports your stated fundraising outcome");
    } else if (answers.outcomes.some((outcome) => ["technology", "grants"].includes(outcome))) {
      confidence -= confidencePenalty.undocumentedOutcome;
      gaps.push("The provider data does not document this outcome");
    }
  }

  if (answers.format) {
    if (formatMatches(answers.format, program.channels ?? [])) {
      score += weights.formatMatch;
      reasons.push("Available in your preferred format");
    } else score += weights.formatMismatch;
  }

  if (answers.products === "yes" && program.method === "product-sales") {
    score += weights.acceptableProductOrEvent;
    reasons.push("Uses product selling, which you said is acceptable");
  }
  if (answers.events === "yes" && EVENT_METHODS.has(program.method)) {
    score += weights.acceptableProductOrEvent;
    reasons.push("Uses an event or activity, which you said is acceptable");
  }

  if (answers.budget === "none" || constraints.has("no-upfront-cost")) {
    if (["none", "not-applicable"].includes(program.upfront_cost)) {
      score += weights.budgetMatch;
      matchedConstraints.push("No documented upfront cost");
    } else if (["unknown", "varies"].includes(program.upfront_cost)) {
      confidence -= confidencePenalty.upfrontCost;
      gaps.push("Upfront cost is not confirmed");
    }
  }

  if (answers.effort) {
    if (program.ease_to_raise === answers.effort) {
      score += weights.effortMatch;
      reasons.push("Matches your preferred effort level");
    } else if (program.ease_to_raise === null) {
      confidence -= confidencePenalty.effort;
      gaps.push("Effort level is not documented");
    } else score += weights.effortMismatch;
  }

  if (constraints.has("no-inventory")) {
    if (["no-inventory", "not-applicable"].includes(program.inventory_model)) {
      score += weights.constraintMatch;
      matchedConstraints.push("No inventory handling documented");
    } else if (["unknown", "varies"].includes(program.inventory_model)) {
      confidence -= confidencePenalty.inventory;
      gaps.push("Inventory requirements are not confirmed");
    }
  }
  if (constraints.has("no-food") && !program.products_services?.some((product) => FOOD_PRODUCTS.has(product))) matchedConstraints.push("No food products documented");
  if (constraints.has("online-only") && program.channels?.includes("online")) {
    score += weights.constraintMatch;
    matchedConstraints.push("Online format available");
  }
  if (constraints.has("low-volunteer-effort")) {
    if (program.ease_to_raise === "easy") {
      score += weights.constraintMatch;
      matchedConstraints.push("Documented as easier to run");
    } else if (program.ease_to_raise === null) {
      confidence -= confidencePenalty.volunteerEffort;
      gaps.push("Volunteer effort is not documented");
    }
  }

  const location = countryMatch(answers.country, provider.geography ?? {});
  if (answers.country) {
    if (location.matches) {
      score += weights.geographyMatch;
      reasons.push("Availability includes your selected country");
    } else {
      confidence -= confidencePenalty.country;
      gaps.push("Country-level availability is not specific enough to confirm");
    }
  }
  if (answers.zip && !(provider.geography?.states?.length || provider.geography?.regions?.length)) {
    confidence -= confidencePenalty.zip;
    gaps.push("ZIP-level service is not documented");
  }
  if (answers.groupSize) {
    confidence -= confidencePenalty.groupSize;
    gaps.push("Participant-size fit is not structured yet");
  }
  if (answers.time || constraints.has("fast")) {
    confidence -= confidencePenalty.timing;
    gaps.push("Provider timing is not structured yet");
  }
  if (constraints.has("passive")) {
    confidence -= confidencePenalty.passive;
    gaps.push("Passive-fundraising requirements are not documented");
  }

  return {
    excluded: false,
    providerName: provider.identity.name,
    providerSlug: provider.identity.slug,
    profilePath: provider.identity.profilePath ?? `/providers/${provider.identity.slug}/`,
    programName: program.name,
    method: program.method,
    channels: program.channels,
    effort: program.ease_to_raise,
    upfrontCost: program.upfront_cost,
    geography: provider.geography,
    score,
    confidence: Math.max(30, confidence),
    reasons: [...new Set(reasons)].slice(0, 3),
    matchedConstraints: [...new Set(matchedConstraints)],
    gaps: [...new Set(gaps)],
  };
}

export function rankProviderMatches(providers, rawAnswers = {}) {
  const answers = normalizeFinderAnswers(rawAnswers);
  const bestByProvider = new Map();

  providers.forEach((provider) => {
    provider.programs.forEach((program) => {
      const result = evaluateProviderProgram(provider, program, answers);
      if (result.excluded) return;
      const current = bestByProvider.get(result.providerSlug);
      if (!current || result.score > current.score || (result.score === current.score && result.programName.localeCompare(current.programName) < 0)) {
        bestByProvider.set(result.providerSlug, result);
      }
    });
  });

  return [...bestByProvider.values()].sort((a, b) => b.score - a.score || b.confidence - a.confidence || a.providerName.localeCompare(b.providerName) || a.programName.localeCompare(b.programName));
}

function methodConflict(profile, answers) {
  const constraints = new Set(answers.constraints);
  if ((answers.products === "no" || constraints.has("no-products")) && profile.product) return true;
  if ((answers.events === "no" || constraints.has("no-events")) && profile.event) return true;
  if (constraints.has("online-only") && !profile.channels.includes("online")) return true;
  if (constraints.has("no-inventory") && profile.inventory === "required") return true;
  if (constraints.has("low-volunteer-effort") && profile.effort === "hands-on") return true;
  if ((answers.budget === "none" || constraints.has("no-upfront-cost")) && profile.upfront === "required") return true;
  return false;
}

export function rankMethodMatches(rawAnswers = {}) {
  const answers = normalizeFinderAnswers(rawAnswers);
  const constraints = new Set(answers.constraints);
  const weights = SCORING_WEIGHTS.method;

  return METHOD_PROFILES.filter((profile) => !methodConflict(profile, answers)).map((profile) => {
    let score = 0;
    const reasons = [];
    if (answers.outcomes.some((outcome) => profile.outcomes.includes(outcome))) { score += weights.outcomeMatch; reasons.push("Supports your desired outcome"); }
    if (answers.methods.includes(profile.id)) { score += weights.selectedMethod; reasons.push("Matches a method you selected"); }
    if (answers.format && formatMatches(answers.format, profile.channels)) { score += weights.formatMatch; reasons.push("Works in your preferred format"); }
    if (answers.products === "yes" && profile.product) { score += weights.acceptableProductOrEvent; reasons.push("Includes product selling"); }
    if (answers.events === "yes" && profile.event) { score += weights.acceptableProductOrEvent; reasons.push("Includes an event or activity"); }
    if (answers.effort && answers.effort === profile.effort) { score += weights.effortMatch; reasons.push("Matches your preferred effort level"); }
    if ((answers.budget === "none" || constraints.has("no-upfront-cost")) && profile.upfront === "none") { score += weights.preferenceMatch; reasons.push("Typically does not require an upfront program cost"); }
    if (answers.time && profile.timing.includes(answers.time)) { score += weights.preferenceMatch; reasons.push("Fits your available timeline"); }
    if (constraints.has("fast") && profile.timing.includes("fast")) { score += weights.preferenceMatch; reasons.push("Can support a faster start"); }
    if (constraints.has("no-inventory") && profile.inventory === "none") { score += weights.preferenceMatch; reasons.push("Does not inherently require inventory"); }
    if (constraints.has("passive") && profile.id === "giving-matching") { score += weights.preferenceMatch; reasons.push("May add funds to donations already being made"); }
    return { ...profile, score, reasons: reasons.slice(0, 3) };
  }).sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}
