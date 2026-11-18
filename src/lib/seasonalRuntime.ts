import { getLocalSeasonForDate, type SeasonId } from "../data/seasonal.ts";

export interface SeasonalElementLike {
  hidden: boolean;
  dataset: Record<string, string | undefined>;
  classList?: {
    toggle: (token: string, force?: boolean) => boolean;
  };
  querySelector?: (selector: string) => SeasonalElementLike | null;
}

export interface SeasonalRootLike {
  dataset?: Record<string, string | undefined>;
  querySelectorAll: (selector: string) => Iterable<SeasonalElementLike>;
}

export function applyActiveSeason(
  root: SeasonalRootLike,
  referenceDate: Date = new Date(),
): SeasonId {
  const activeSeason = getLocalSeasonForDate(referenceDate);
  if (root.dataset) root.dataset.activeSeason = activeSeason;

  for (const feature of root.querySelectorAll("[data-season-feature]")) {
    feature.hidden = feature.dataset.seasonFeature !== activeSeason;
  }

  for (const link of root.querySelectorAll("[data-season-link]")) {
    const isCurrent = link.dataset.seasonLink === activeSeason;
    link.classList?.toggle("is-current", isCurrent);
    const pill = link.querySelector?.("[data-season-pill]");
    if (pill) pill.hidden = !isCurrent;
  }

  return activeSeason;
}
