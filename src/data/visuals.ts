export interface FundraisingVisual {
  key: string;
  type: "representative-method";
  src: string;
  alt: string;
  caption: string;
  source: string;
  attribution: string | null;
  usageStatus: "existing-project-asset";
  relatedMethod: string;
}

export const FUNDRAISING_VISUALS: Record<string, FundraisingVisual> = {
  "community-fun-run": {
    key: "community-fun-run",
    type: "representative-method",
    src: "/images/home/community-fun-run.jpg",
    alt: "An organizer greeting a participant at a community fun run",
    caption: "Representative image of an activity-based fundraiser; it does not depict this provider.",
    source: "Existing FundraisingDirectory.net project asset",
    attribution: null,
    usageStatus: "existing-project-asset",
    relatedMethod: "events-activities",
  },
  "spirit-wear-sale": {
    key: "spirit-wear-sale",
    type: "representative-method",
    src: "/images/home/spirit-wear-fundraiser.jpg",
    alt: "A coordinated selection of fundraising spirit wear",
    caption: "Representative image of a product-sale fundraiser; it does not depict this provider.",
    source: "Existing FundraisingDirectory.net project asset",
    attribution: null,
    usageStatus: "existing-project-asset",
    relatedMethod: "product-sales",
  },
};

const PROVIDER_VISUAL_KEYS: Record<string, keyof typeof FUNDRAISING_VISUALS> = {
  booster: "community-fun-run",
  "fundraising-com": "spirit-wear-sale",
};

export function getProviderVisual(slug: string) {
  const key = PROVIDER_VISUAL_KEYS[slug];
  return key ? FUNDRAISING_VISUALS[key] : null;
}
