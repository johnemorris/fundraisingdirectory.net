export const PRODUCTS_SERVICES_BY_CATEGORY = {
  "food-treats": [
    "candy-chocolate",
    "cookie-dough-cookies",
    "popcorn",
    "coffee-beverages",
    "baked-goods",
    "snacks",
    "frozen-prepared-foods",
  ],
  merchandise: [
    "apparel-spirit-wear",
    "candles",
    "flowers-plants",
    "gifts-seasonal",
    "home-household",
    "books-educational",
  ],
  savings: ["discount-cards-coupon-books"],
  "fundraising-services": [
    "donation-platform",
    "crowdfunding-platform",
    "peer-to-peer-platform",
    "auction-platform",
    "event-fundraising-platform",
    "text-mobile-giving",
    "merchandise-online-store",
    "fundraising-consulting",
  ],
} as const;

export const PRODUCTS_SERVICES = [
  ...PRODUCTS_SERVICES_BY_CATEGORY["food-treats"],
  ...PRODUCTS_SERVICES_BY_CATEGORY.merchandise,
  ...PRODUCTS_SERVICES_BY_CATEGORY.savings,
  ...PRODUCTS_SERVICES_BY_CATEGORY["fundraising-services"],
] as const;

export type ProductService = (typeof PRODUCTS_SERVICES)[number];
