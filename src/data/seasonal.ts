import { topicPublication } from "./topicPublication.js";

export const SEASON_IDS = ["spring", "summer", "fall", "winter"] as const;
export type SeasonId = (typeof SEASON_IDS)[number];

export interface SeasonalGuideRef {
  legacyPath: string;
  note: string;
}

export interface SeasonalProgramRef {
  providerSlug: string;
  seasonality: "seasonal" | "year-round";
  note: string;
  promotionWindow?: {
    start_date: string;
    end_date: string;
  };
}

export interface SeasonalPlan {
  id: SeasonId;
  anchorId: `season-${SeasonId}`;
  label: string;
  windowLabel: string;
  eyebrow: string;
  title: string;
  timingGuidance: string;
  guides: SeasonalGuideRef[];
  programs: SeasonalProgramRef[];
}

export const SEASONAL_PLANS: readonly SeasonalPlan[] = [
  {
    id: "spring",
    anchorId: "season-spring",
    label: "Spring",
    windowLabel: "March – May",
    eyebrow: "Spring planning",
    title: "Spring fundraising (March – May)",
    timingGuidance:
      "Spring campaigns align with outdoor sports, end-of-year school events, and spring planting windows. Launch 3–4 weeks before graduation, field days, or spring-break schedules, and confirm shipping cutoffs early for seasonal live plants.",
    guides: [
      {
        legacyPath: "Baseball-Fundraising",
        note: "Budget early for spring league fees, uniforms, and tournament entry deadlines.",
      },
      {
        legacyPath: "Elementary-School-Fundraising",
        note: "Plan spring fun runs, walkathons, and readathons around school-year calendars.",
      },
      {
        legacyPath: "4-H-Fundraising",
        note: "Coordinate club project sales and online campaigns ahead of spring deadlines.",
      },
      {
        legacyPath: "High-School-Fundraising",
        note: "Close spring club and travel campaigns before final exams and graduation.",
      },
    ],
    programs: [
      {
        providerSlug: "dutch-mill-bulbs",
        seasonality: "seasonal",
        note: "Genuine spring selling window for flower bulbs and plants via brochure or direct-ship online orders (2–3 week campaigns).",
      },
      {
        providerSlug: "99pledges",
        seasonality: "year-round",
        note: "Year-round pledge-a-thon platform well suited to spring outdoor fun runs, walkathons, and readathons.",
      },
      {
        providerSlug: "funds2orgs",
        seasonality: "year-round",
        note: "Year-round shoe-drive fundraiser well suited to spring-cleaning collection drives.",
      },
      {
        providerSlug: "bonfire",
        seasonality: "year-round",
        note: "Year-round custom apparel with no upfront inventory for spring teams, field days, and graduating classes.",
      },
    ],
  },
  {
    id: "summer",
    anchorId: "season-summer",
    label: "Summer",
    windowLabel: "June – August",
    eyebrow: "Summer planning",
    title: "Summer fundraising (June – August)",
    timingGuidance:
      "No active provider in the directory is summer-only, and warm weather complicates chocolate and frozen-food shipping. Focus on heat-stable digital campaigns, restaurant nights, and everyday earning programs while school is out of session.",
    guides: [
      {
        legacyPath: "Baseball-Fundraising",
        note: "Support summer travel-ball and tournament costs with online or event-based formats.",
      },
      {
        legacyPath: "Church-Fundraising",
        note: "Pair summer mission trips and youth camps with online appeals or coffee sales.",
      },
      {
        legacyPath: "Cheerleading-Fundraising",
        note: "Cover summer camp and pre-season uniform deposits before fall schedules fill.",
      },
      {
        legacyPath: "4-H-Fundraising",
        note: "Use online stores and supervised events when summer schedules scatter members.",
      },
    ],
    programs: [
      {
        providerSlug: "krispy-kreme-fundraising",
        seasonality: "year-round",
        note: "Year-round doughnut programs; Digital Dozens avoids summer heat and group inventory.",
      },
      {
        providerSlug: "snap-raise",
        seasonality: "year-round",
        note: "Year-round online team campaign platform suited to summer camps and pre-season travel.",
      },
      {
        providerSlug: "raiseright",
        seasonality: "year-round",
        note: "Year-round gift-card, shopping, and travel-booking earnings that continue during summer break.",
      },
      {
        providerSlug: "chipotle-community-fundraising",
        seasonality: "year-round",
        note: "Year-round scheduled restaurant nights for summer leagues and community groups.",
      },
    ],
  },
  {
    id: "fall",
    anchorId: "season-fall",
    label: "Fall",
    windowLabel: "September – November",
    eyebrow: "Fall planning",
    title: "Fall fundraising (September – November)",
    timingGuidance:
      "Fall is the busiest school and autumn-sports window, and cooler weather lowers melting risks for chocolate and frozen items. Coordinate one shared calendar across classrooms and teams, and work backward from holiday delivery deadlines.",
    guides: [
      {
        legacyPath: "Elementary-School-Fundraising",
        note: "Coordinate back-to-school kickoffs on one shared calendar to avoid household fatigue.",
      },
      {
        legacyPath: "Football-Fundraising",
        note: "Launch early enough for equipment, travel, and game-day booster club expenses.",
      },
      {
        legacyPath: "Gift-Wrap",
        note: "Plan around when buyers need holiday wrap, leaving time for fulfillment and shipping.",
      },
      {
        legacyPath: "Cookie-Dough",
        note: "Cooler fall temperatures simplify frozen or refrigerated order-taker pickups.",
      },
      {
        legacyPath: "Candy",
        note: "Autumn events and cooler weather reduce warm-weather chocolate handling risks.",
      },
      {
        legacyPath: "Band-Fundraising",
        note: "Align marching-season and concert campaigns with uniform and trip deposit dates.",
      },
      {
        legacyPath: "Catholic-School-Fundraising",
        note: "Schedule fall school campaigns alongside parish giving calendars.",
      },
    ],
    programs: [
      {
        providerSlug: "dutch-mill-bulbs",
        seasonality: "seasonal",
        note: "Genuine fall selling window for autumn-planted flower bulbs via brochure or direct-ship online orders.",
      },
      {
        providerSlug: "charleston-wrap",
        seasonality: "year-round",
        note: "Year-round catalog and online store featuring seasonal gifts and wrap for fall holiday prep.",
      },
      {
        providerSlug: "booster",
        seasonality: "year-round",
        note: "Year-round school activity platform commonly used for fall back-to-school fun runs.",
      },
      {
        providerSlug: "worlds-finest-chocolate",
        seasonality: "year-round",
        note: "Year-round chocolate sales; cooler fall weather avoids summer dry-ice shipping delays.",
      },
    ],
  },
  {
    id: "winter",
    anchorId: "season-winter",
    label: "Winter",
    windowLabel: "December – February",
    eyebrow: "Winter planning",
    title: "Winter fundraising (December – February)",
    timingGuidance:
      "Winter seasons are often shorter and weather can disrupt in-person pickups. Favor digital passes, direct-shipped coffee or popcorn, indoor dining nights, and year-end giving tools with clear cutoff dates.",
    guides: [
      {
        legacyPath: "Basketball-Fundraising",
        note: "Short winter seasons favor a single online closing date over multi-stage deliveries.",
      },
      {
        legacyPath: "Gift-Wrap",
        note: "Early-December orders require confirmed shipping cutoffs before holiday gatherings.",
      },
      {
        legacyPath: "Coffee",
        note: "Cold-weather months suit coffee and tea preorders or direct-ship online stores.",
      },
      {
        legacyPath: "Discount-Card",
        note: "Digital savings passes and local coupon books run indoors without weather delays.",
      },
      {
        legacyPath: "Cheerleading-Fundraising",
        note: "Support winter competition travel with low-friction online merchandise or popcorn stores.",
      },
    ],
    programs: [
      {
        providerSlug: "panera-bread-fundraising",
        seasonality: "year-round",
        note: "Year-round 501(c)(3) bakery-cafe fundraiser nights (20%–25% standard), plus a dated 30% promotion for qualifying events held December 1–21, 2026 at participating U.S. cafes (requires booking at least 10 days in advance).",
        promotionWindow: {
          start_date: "2026-12-01",
          end_date: "2026-12-21",
        },
      },
      {
        providerSlug: "giving-bean",
        seasonality: "year-round",
        note: "Year-round coffee and tea fundraising via local order forms or direct-ship online stores.",
      },
      {
        providerSlug: "yougivegoods",
        seasonality: "year-round",
        note: "Year-round online new-goods drives well suited to winter food, coat, and supply drives.",
      },
      {
        providerSlug: "givebutter",
        seasonality: "year-round",
        note: "Year-round nonprofit platform for winter galas, year-end appeals, and online auctions.",
      },
    ],
  },
] as const;

export function getSeasonForMonth(month: number): SeasonId {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

export function getSeasonForDate(date: Date = new Date()): SeasonId {
  return getSeasonForMonth(date.getUTCMonth());
}

export function getLocalSeasonForDate(date: Date = new Date()): SeasonId {
  return getSeasonForMonth(date.getMonth());
}

export function getSeasonalPlan(seasonId: SeasonId): SeasonalPlan {
  const plan = SEASONAL_PLANS.find((entry) => entry.id === seasonId);
  if (!plan) throw new Error(`Unknown season: ${seasonId}`);
  return plan;
}

export function getOrderedSeasonalPlans(referenceDate: Date = new Date()) {
  const currentSeasonId = getSeasonForDate(referenceDate);
  const currentSeason = getSeasonalPlan(currentSeasonId);
  return {
    currentSeasonId,
    currentSeason,
    seasons: SEASONAL_PLANS,
  };
}

export function getPublishedSeasonalGuides(plan: SeasonalPlan) {
  return plan.guides.filter((guide) => {
    const decision = (topicPublication as Record<string, { publication?: string; indexing?: string }>)[guide.legacyPath];
    return decision?.publication === "guide" && decision?.indexing === "index";
  });
}
