import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVITY_SUBTYPES,
  BENEFICIARY_TYPES,
  CAUSE_AREAS,
  FUNDRAISING_CAPABILITIES,
  FUNDRAISING_OUTCOMES,
} from "../src/data/taxonomies/fundraising-dimensions.ts";
import { DISCOVERY_METHODS, FUNDRAISING_METHODS } from "../src/data/taxonomies/methods.ts";
import {
  activitySubtypeSchema,
  beneficiaryTypeSchema,
  causeAreaSchema,
  fundraisingCapabilitySchema,
  fundraisingMethodSchema,
  fundraisingOutcomeSchema,
  OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS,
} from "../src/data/taxonomies/validation.ts";
import { METHOD_PROFILES } from "../src/lib/finderScoring.js";

const approvedNewMethods = [
  "grant-seeking",
  "everyday-passive-fundraising",
  "collection-reuse-fundraising",
  "in-kind-resource-fundraising",
];

const assertUnique = (values) => assert.equal(new Set(values).size, values.length);

test("the provider schema recognizes every approved fundraising method ID", () => {
  const originalMethods = [
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
  ];

  assert.deepEqual(DISCOVERY_METHODS, originalMethods);
  assert.deepEqual(FUNDRAISING_METHODS, [...originalMethods, ...approvedNewMethods]);
  assert.ok(FUNDRAISING_METHODS.includes("grant-seeking"));
  assert.equal(fundraisingMethodSchema.safeParse("grant-seeking").success, true);
  assert.equal(fundraisingMethodSchema.safeParse("invented-method").success, false);
  assert.ok(METHOD_PROFILES.every(({ id }) => FUNDRAISING_METHODS.includes(id)));
  assertUnique(FUNDRAISING_METHODS);
});

test("new taxonomy dimensions contain unique approved values and schemas reject unknown IDs", () => {
  const dimensions = [
    [FUNDRAISING_OUTCOMES, fundraisingOutcomeSchema],
    [FUNDRAISING_CAPABILITIES, fundraisingCapabilitySchema],
    [BENEFICIARY_TYPES, beneficiaryTypeSchema],
    [CAUSE_AREAS, causeAreaSchema],
    [ACTIVITY_SUBTYPES, activitySubtypeSchema],
  ];

  dimensions.forEach(([values, schema]) => {
    assertUnique(values);
    assert.equal(schema.safeParse(values[0]).success, true);
    assert.equal(schema.safeParse("invented-taxonomy-value").success, false);
  });

  assert.ok(FUNDRAISING_OUTCOMES.includes("donated-goods"));
  assert.ok(FUNDRAISING_CAPABILITIES.includes("collection-logistics"));
  assert.ok(BENEFICIARY_TYPES.includes("local-chapter-or-affiliate"));
  assert.ok(CAUSE_AREAS.includes("road-safety-impaired-driving-prevention"));
  assert.ok(ACTIVITY_SUBTYPES.includes("peer-fundraising-challenge"));
});

test("provider and program taxonomy dimensions remain optional but validate populated arrays", () => {
  Object.values(OPTIONAL_FUNDRAISING_DIMENSION_SCHEMAS).forEach((schema) => {
    assert.equal(schema.safeParse(undefined).success, true);
    assert.equal(schema.safeParse([]).success, false);
    assert.equal(schema.safeParse(["invented-taxonomy-value"]).success, false);
  });
});
