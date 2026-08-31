import { formatProviderLabel } from "./providerLabels";

export type DiscoveryTone = "teal" | "blue" | "purple" | "navy" | "warm";

export const DISCOVERY_GROUP_CONTEXTS = {
  schools: { label: "Schools", eyebrow: "School fundraising", title: "Fundraising providers for schools & PTOs", description: "Explore approaches for classrooms, campuses, parent groups, student activities, and school communities.", tone: "teal", visualKey: "schools" },
  "pto-pta": { label: "PTO/PTA", eyebrow: "Parent group fundraising", title: "Fundraising providers for PTOs & PTAs", description: "Compare programs that can support parent groups, school events, classroom needs, and community goals.", tone: "teal", visualKey: "schools" },
  "sports-athletics": { label: "Sports Teams", eyebrow: "Sports team fundraising", title: "Fundraising providers for sports teams", description: "Find approaches for football, baseball, soccer, volleyball, cheer, gymnastics, and other athletic groups.", tone: "blue", visualKey: "sports" },
  "booster-clubs": { label: "Booster Clubs", eyebrow: "Booster club fundraising", title: "Fundraising providers for booster clubs", description: "Explore options for teams, activities, travel, equipment, events, and school-community support.", tone: "blue", visualKey: "sports" },
  "churches-faith": { label: "Churches", eyebrow: "Church fundraising", title: "Fundraising providers for churches & faith groups", description: "Explore options for congregations, ministries, missions, faith schools, and community programs.", tone: "purple", visualKey: "faith" },
  "nonprofits-charities": { label: "Nonprofits", eyebrow: "Nonprofit fundraising", title: "Fundraising providers for nonprofits", description: "Compare donation, campaign, event, and product approaches for charitable and community missions.", tone: "navy", visualKey: "nonprofit" },
  "youth-organizations": { label: "Youth Organizations", eyebrow: "Youth group fundraising", title: "Fundraising providers for youth organizations", description: "Explore fundraising approaches for clubs, trips, activities, programs, and community projects.", tone: "teal", visualKey: "youth" },
  "clubs-community": { label: "Community Groups", eyebrow: "Community fundraising", title: "Fundraising providers for clubs & community groups", description: "Find approachable options for local organizations, shared projects, events, and causes.", tone: "warm", visualKey: "community" },
  "arts-music-performance": { label: "Arts & Music", eyebrow: "Arts fundraising", title: "Fundraising providers for arts & performance groups", description: "Explore options for bands, ensembles, productions, travel, equipment, and creative programs.", tone: "purple", visualKey: "arts" },
  "animal-rescue": { label: "Animal Rescue", eyebrow: "Animal-welfare fundraising", title: "Fundraising providers for animal rescue groups", description: "Compare fundraising approaches for shelters, rescues, veterinary needs, and community programs.", tone: "warm", visualKey: "animal" },
  "individuals-personal-causes": { label: "Personal Causes", eyebrow: "Personal fundraising", title: "Fundraising providers for personal causes", description: "Explore public fundraising platforms that may support individual, family, and community needs.", tone: "blue", visualKey: "personal" },
  other: { label: "Any Group Type", eyebrow: "Fundraising discovery", title: "Fundraising providers for many kinds of groups", description: "Browse broad fundraising options when your organization does not fit a single category.", tone: "navy", visualKey: "all" },
} as const;

const LEGACY_GROUPS: Record<string, keyof typeof DISCOVERY_GROUP_CONTEXTS> = {
  "Elementary-School-Fundraising": "schools",
  "High-School-Fundraising": "schools",
  "Catholic-School-Fundraising": "schools",
  "Educational-Resources": "schools",
  "Church-Fundraising": "churches-faith",
  "Christian-Fundraising": "churches-faith",
  "Baseball-Fundraising": "sports-athletics",
  "Basketball-Fundraising": "sports-athletics",
  "Football-Fundraising": "sports-athletics",
  "Cheerleading-Fundraising": "sports-athletics",
  "Hockey-Fundraising": "sports-athletics",
  "Lacrosse-Fundraising": "sports-athletics",
  "Field-Hockey-Fundraising": "sports-athletics",
  "Gymnastics-Fundraising": "sports-athletics",
  "Band-Fundraising": "arts-music-performance",
  "4-H-Fundraising": "youth-organizations",
  "Boy-Scout-Fundraising": "youth-organizations",
  "Girl-Scout-Fundraising": "youth-organizations",
  "FFA-Fundraising": "youth-organizations",
  "FBLA-Fundraising": "youth-organizations",
  "FCCLA-Fundraising": "youth-organizations",
  "Fire-Department-Fundraising": "clubs-community",
};

const LEGACY_PRODUCTS: Record<string, string> = {
  Candles: "candles",
  "Cookie-Dough": "cookie-dough-cookies",
  Candy: "candy-chocolate",
  Coffee: "coffee-beverages",
  "Gift-Wrap": "gifts-seasonal",
  "Coupon-Book": "discount-cards-coupon-books",
  "Discount-Card": "discount-cards-coupon-books",
  Cookbooks: "books-educational",
  "Chocolate-Bars": "candy-chocolate",
  "Fundraising-Consultants": "fundraising-consulting",
  "Fundraising-Software": "crowdfunding-platform",
};

export function getLegacyDiscoveryContext(route: { path: string; title: string; description: string; type: string }) {
  const group = LEGACY_GROUPS[route.path] ?? null;
  const product = LEGACY_PRODUCTS[route.path] ?? null;
  const method = route.type === "product" ? "product-sales" : null;
  const groupContext = group ? DISCOVERY_GROUP_CONTEXTS[group] : null;
  const parentLabel = groupContext?.label ?? (route.type === "product" ? "Product Fundraising" : route.type === "resource" ? "Fundraising Resources" : "Fundraising Discovery");

  const query = new URLSearchParams({
    ...(group ? { group } : {}),
    ...(method ? { method } : {}),
    ...(product ? { product } : {}),
  }).toString();

  return {
    group,
    product,
    method,
    parentLabel,
    tone: groupContext?.tone ?? (route.type === "product" ? "warm" : route.type === "service" ? "purple" : "navy"),
    visualKey: groupContext?.visualKey ?? route.type,
    providerHref: query ? `/providers/?${query}` : "/providers/",
    methodLabel: method ? formatProviderLabel(method) : null,
  };
}

export function isLegacySitemapEligible(route: { path: string; title: string; description: string; type: string }) {
  const context = getLegacyDiscoveryContext(route);
  return Boolean(context.group || context.method || context.product);
}
