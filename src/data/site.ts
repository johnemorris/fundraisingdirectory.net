export const SITE_ROUTES = {
  origin: "https://fundraisingdirectory.net",
  home: "/",
  directory: "/providers/",
  about: "/about/",
  contact: "/contact/",
  privacy: "/privacy/",
  disclaimer: "/disclaimer/",
  ideas: "/Fundraising-Resources.html",
  guides: "/Fundraising-Articles.html",
  cookieDough: "/Cookie-Dough.html",
  candy: "/Candy.html",
  discountCards: "/Discount-Card.html",
  elementarySchool: "/Elementary-School-Fundraising.html",
  schools: "/providers/?group=schools",
  sports: "/providers/?group=sports-athletics",
  churches: "/Church-Fundraising.html",
  nonprofits: "/providers/?group=nonprofits-charities",
  community: "/providers/?group=clubs-community",
  productSales: "/providers/?method=product-sales",
  onlineFundraising: "/providers/?method=crowdfunding",
  providerInformation: "/providers/",
} as const;

export const PRIMARY_NAVIGATION = [
  { label: "Find Fundraisers", href: `${SITE_ROUTES.home}#finder` },
  { label: "Fundraising Ideas", href: SITE_ROUTES.ideas },
  { label: "Browse by Group", href: `${SITE_ROUTES.home}#groups` },
  { label: "How It Works", href: `${SITE_ROUTES.home}#how-it-works` },
] as const;

export const DISCOVERY_NAVIGATION = [
  { label: "Schools", href: SITE_ROUTES.schools },
  { label: "Sports Teams", href: SITE_ROUTES.sports },
  { label: "Churches", href: SITE_ROUTES.churches },
  { label: "Nonprofits", href: SITE_ROUTES.nonprofits },
  { label: "Product Sales", href: SITE_ROUTES.productSales },
  { label: "Online Fundraising", href: SITE_ROUTES.onlineFundraising },
  { label: "More", href: `${SITE_ROUTES.home}#popular-methods` },
] as const;

export const PROVIDER_NAVIGATION = [
  { label: "For Providers", href: SITE_ROUTES.providerInformation },
  { label: "List Your Company", href: `${SITE_ROUTES.home}#provider-cta` },
] as const;
