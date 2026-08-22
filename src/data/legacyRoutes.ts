export type LegacyRoute = {
  path: string;
  title: string;
  description: string;
  type: "resource" | "audience" | "product" | "service";
};

export const legacyRoutes: LegacyRoute[] = [
  {
    path: "Fundraising-Resources",
    title: "Fundraising Resources",
    description:
      "Resources, ideas, and fundraising information for schools, organizations, teams, charities, and community groups.",
    type: "resource",
  },
  {
    path: "Fundraising-Articles",
    title: "Fundraising Articles",
    description:
      "Fundraising guides, ideas, planning tips, and educational resources for organizations running fundraising campaigns.",
    type: "resource",
  },
  {
    path: "Elementary-School-Fundraising",
    title: "Elementary School Fundraising",
    description:
      "Fundraising ideas and resources for elementary schools, PTOs, PTAs, classrooms, and school communities.",
    type: "audience",
  },
  {
    path: "High-School-Fundraising",
    title: "High School Fundraising",
    description:
      "Fundraising ideas and resources for high schools, student organizations, clubs, teams, and school programs.",
    type: "audience",
  },
  {
    path: "Church-Fundraising",
    title: "Church Fundraising",
    description:
      "Fundraising ideas and resources for churches, ministries, congregations, and faith-based organizations.",
    type: "audience",
  },
  {
    path: "Christian-Fundraising",
    title: "Christian Fundraising",
    description:
      "Fundraising resources for Christian schools, churches, ministries, missions, and community organizations.",
    type: "audience",
  },
  {
    path: "Baseball-Fundraising",
    title: "Baseball Fundraising",
    description:
      "Fundraising ideas and resources for baseball teams, leagues, travel programs, booster clubs, and youth organizations.",
    type: "audience",
  },
  {
    path: "Basketball-Fundraising",
    title: "Basketball Fundraising",
    description:
      "Fundraising ideas and resources for basketball teams, leagues, booster clubs, schools, and youth programs.",
    type: "audience",
  },
  {
    path: "Football-Fundraising",
    title: "Football Fundraising",
    description:
      "Fundraising ideas and resources for football teams, youth leagues, schools, booster clubs, and athletic programs.",
    type: "audience",
  },
  {
    path: "Cheerleading-Fundraising",
    title: "Cheerleading Fundraising",
    description:
      "Fundraising ideas and resources for cheerleading squads, competitive teams, schools, and booster organizations.",
    type: "audience",
  },
  {
    path: "Hockey-Fundraising",
    title: "Hockey Fundraising",
    description:
      "Fundraising ideas and resources for hockey teams, leagues, clubs, schools, and youth programs.",
    type: "audience",
  },
  {
    path: "Lacrosse-Fundraising",
    title: "Lacrosse Fundraising",
    description:
      "Fundraising ideas and resources for lacrosse teams, leagues, clubs, schools, and youth programs.",
    type: "audience",
  },
  {
    path: "4-H-Fundraising",
    title: "4-H Fundraising",
    description:
      "Fundraising ideas and resources for 4-H clubs, projects, events, and youth programs.",
    type: "audience",
  },
  {
    path: "Boy-Scout-Fundraising",
    title: "Scouting Fundraising",
    description:
      "Fundraising ideas and resources for scouting troops, packs, units, activities, and community programs.",
    type: "audience",
  },
  {
    path: "FFA-Fundraising",
    title: "FFA Fundraising",
    description:
      "Fundraising ideas and resources for FFA chapters, agricultural education programs, schools, and student organizations.",
    type: "audience",
  },

  // Fundraiser/product categories
  {
    path: "Candles",
    title: "Candle Fundraising",
    description:
      "Explore candle fundraising programs and ideas for schools, teams, churches, nonprofits, and community organizations.",
    type: "product",
  },
  {
    path: "Cookie-Dough",
    title: "Cookie Dough Fundraising",
    description:
      "Explore cookie dough fundraising programs and ideas for schools, teams, clubs, and community organizations.",
    type: "product",
  },
  {
    path: "Candy",
    title: "Candy Fundraising",
    description:
      "Explore candy fundraising programs and ideas for schools, clubs, teams, nonprofits, and community groups.",
    type: "product",
  },
  {
    path: "Coffee",
    title: "Coffee Fundraising",
    description:
      "Explore coffee fundraising programs and ideas for schools, churches, teams, nonprofits, and community organizations.",
    type: "product",
  },
  {
    path: "Gift-Wrap",
    title: "Gift Wrap Fundraising",
    description:
      "Explore gift wrap fundraising programs and seasonal fundraising ideas for schools and organizations.",
    type: "product",
  },
  {
    path: "Coupon-Book",
    title: "Coupon Book Fundraising",
    description:
      "Explore coupon book fundraising programs for schools, teams, clubs, nonprofits, and community organizations.",
    type: "product",
  },
  {
    path: "Discount-Card",
    title: "Discount Card Fundraising",
    description:
      "Explore discount card fundraising programs and community-based fundraising opportunities.",
    type: "product",
  },
  {
    path: "Cookbooks",
    title: "Cookbook Fundraising",
    description:
      "Explore cookbook fundraising ideas and programs for schools, churches, clubs, families, and organizations.",
    type: "product",
  },

  // Services
  {
    path: "Fundraising-Consultants",
    title: "Fundraising Consultants",
    description:
      "Resources for organizations looking for fundraising consulting, planning, strategy, and campaign support.",
    type: "service",
  },
  {
    path: "Fundraising-Software",
    title: "Fundraising Software",
    description:
      "Resources for fundraising software, online fundraising tools, donor management, and campaign technology.",
    type: "service",
  },
];
