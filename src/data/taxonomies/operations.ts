export const CHANNELS = ["online", "in-person", "hybrid"] as const;

export const FULFILLMENT_TYPES = [
  "direct-to-supporter",
  "group-distribution",
  "provider-delivery",
  "local-pickup",
  "digital",
  "on-site",
  "not-applicable",
  "varies",
  "unknown",
] as const;

export const INVENTORY_MODELS = [
  "no-inventory",
  "preorder",
  "upfront-inventory",
  "varies",
  "not-applicable",
  "unknown",
] as const;

export const UPFRONT_COSTS = [
  "none",
  "required",
  "varies",
  "unknown",
  "not-applicable",
] as const;

export const EASE_TO_RAISE = ["easy", "moderate", "hands-on"] as const;

export type Channel = (typeof CHANNELS)[number];
export type FulfillmentType = (typeof FULFILLMENT_TYPES)[number];
export type InventoryModel = (typeof INVENTORY_MODELS)[number];
export type UpfrontCost = (typeof UPFRONT_COSTS)[number];
export type EaseToRaise = (typeof EASE_TO_RAISE)[number];
