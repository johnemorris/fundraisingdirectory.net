import { SITE_ROUTES } from "./site";

export type PlacementType = "organic" | "featured" | "sponsored";

export const finderGroups = [
  { label: "School / PTO", value: "schools" },
  { label: "Sports Team", value: "sports-athletics" },
  { label: "Church", value: "churches-faith" },
  { label: "Nonprofit", value: "nonprofits-charities" },
  { label: "Club / Community", value: "clubs-community" },
  { label: "Other", value: "other" },
] as const;

export const finderInterests = [
  { label: "Sell Products", value: "product-sales", icon: "box" },
  { label: "Online", value: "crowdfunding", icon: "cursor" },
  { label: "Events", value: "events-activities", icon: "flag" },
  { label: "Donations", value: "direct-donations", icon: "heart" },
  { label: "Sponsorships", value: "sponsorships", icon: "star" },
] as const;

export const popularMethods = [
  {
    title: "Cookie Dough",
    href: SITE_ROUTES.cookieDough,
    image: "/images/home/cookie-dough-fundraiser.jpg",
    imageAlt: "Scoops of chocolate chip cookie dough ready for a fundraiser",
    size: "large",
  },
  {
    title: "Fun Runs",
    href: "/providers/?method=events-activities",
    image: "/images/home/community-fun-run.jpg",
    imageAlt: "Adult organizer greeting a runner at a community fun run",
    size: "medium",
  },
  {
    title: "Spirit Wear",
    href: "/providers/?product=apparel-spirit-wear",
    image: "/images/home/spirit-wear-fundraiser.jpg",
    imageAlt: "Unbranded navy, teal, purple, and cream spirit wear",
    size: "medium",
  },
  { title: "Candy & Chocolate", href: SITE_ROUTES.candy, size: "compact" },
  { title: "Restaurant Nights", href: "/providers/?method=restaurant-business-partnerships", size: "compact" },
  { title: "Online Fundraising", href: SITE_ROUTES.onlineFundraising, size: "compact" },
  { title: "Auctions", href: "/providers/?method=auctions", size: "compact" },
  { title: "Discount Cards", href: SITE_ROUTES.discountCards, size: "compact" },
  { title: "Sponsorships", href: "/providers/?method=sponsorships", size: "compact" },
] as const;

export const groupPaths = [
  {
    title: "Schools & PTOs",
    description: "Programs for classrooms, campuses, parent groups, and school communities.",
    href: SITE_ROUTES.schools,
  },
  {
    title: "Sports Teams",
    description: "Flexible options for uniforms, travel, equipment, and season expenses.",
    href: SITE_ROUTES.sports,
  },
  {
    title: "Churches",
    description: "Fundraisers suited to congregations, ministries, and faith communities.",
    href: SITE_ROUTES.churches,
  },
  {
    title: "Nonprofits",
    description: "Ways to support campaigns, programs, events, and community impact.",
    href: SITE_ROUTES.nonprofits,
  },
  {
    title: "Clubs & Community Groups",
    description: "Approachable ideas for local groups, causes, and shared projects.",
    href: SITE_ROUTES.community,
  },
] as const;

export const fundraisingIdeas = [
  "No products to sell",
  "Low-cost fundraisers",
  "Online ideas",
  "Fast fundraisers",
  "Seasonal ideas",
  "Challenges & games",
] as const;

export const guides = [
  {
    title: "Fundraising resources for choosing your next campaign",
    description: "Start with practical routes for exploring programs, ideas, and planning considerations.",
    href: SITE_ROUTES.ideas,
    featured: true,
    label: "Start here",
  },
  {
    title: "Cookie Dough Fundraising",
    href: SITE_ROUTES.cookieDough,
    featured: false,
    label: "Product fundraiser",
  },
  {
    title: "Elementary School Fundraising",
    href: SITE_ROUTES.elementarySchool,
    featured: false,
    label: "For schools",
  },
  {
    title: "Fundraising Articles",
    href: SITE_ROUTES.guides,
    featured: false,
    label: "More guidance",
  },
] as const;
