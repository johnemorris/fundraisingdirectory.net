import { legacyRoutes } from "./legacyRoutes.js";

export const TOPIC_CATEGORIES = ["Schools and education", "Sports and activities", "Youth and community", "Faith communities", "Products", "Planning and services"] as const;
export const topicPath = (path: string) => `/${path}.html`;

export function getTopicCategory(route: (typeof legacyRoutes)[number]) {
  if (route.type === "product") return "Products";
  if (/School|Educational/.test(route.path)) return "Schools and education";
  if (/Church|Christian/.test(route.path)) return "Faith communities";
  if (/Baseball|Basketball|Football|Cheerleading|Hockey|Lacrosse|Gymnastics|Band/.test(route.path)) return "Sports and activities";
  if (route.type === "audience") return "Youth and community";
  return "Planning and services";
}

export const topicRoutes = legacyRoutes.filter((route) => !["Fundraising-Resources", "Fundraising-Articles"].includes(route.path));
