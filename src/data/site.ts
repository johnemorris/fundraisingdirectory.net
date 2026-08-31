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
  churches: "/providers/?group=churches-faith",
  nonprofits: "/providers/?group=nonprofits-charities",
  community: "/providers/?group=clubs-community",
  productSales: "/providers/?method=product-sales",
  onlineFundraising: "/providers/?method=crowdfunding",
} as const;

export const PRIMARY_NAVIGATION = [
  { key: "providers", label: "Fundraising Providers", href: SITE_ROUTES.directory },
  { key: "ideas", label: "Fundraising Ideas", href: SITE_ROUTES.ideas },
  { key: "schools", label: "Schools", href: SITE_ROUTES.schools, group: "schools" },
  { key: "sports", label: "Sports Teams", href: SITE_ROUTES.sports, group: "sports-athletics" },
  { key: "churches", label: "Churches", href: SITE_ROUTES.churches, group: "churches-faith" },
  { key: "nonprofits", label: "Nonprofits", href: SITE_ROUTES.nonprofits, group: "nonprofits-charities" },
] as const;

export const MORE_NAVIGATION = [
  { key: "community", label: "Community Groups", href: SITE_ROUTES.community, group: "clubs-community" },
  { key: "product-sales", label: "Product Sales", href: SITE_ROUTES.productSales, method: "product-sales" },
  { key: "online-fundraising", label: "Online Fundraising", href: SITE_ROUTES.onlineFundraising, method: "crowdfunding" },
  { key: "about", label: "About", href: SITE_ROUTES.about },
  { key: "contact", label: "Contact", href: SITE_ROUTES.contact },
] as const;
