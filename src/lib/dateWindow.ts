export type DateWindowStatus = "upcoming" | "active" | "expired";

export function dateWindowStatus(
  window: { start_date?: string | null; end_date?: string | null } | null | undefined,
  today: string,
): DateWindowStatus | null {
  if (!window) return null;
  const ref = today.slice(0, 10);
  if (window.start_date && ref < window.start_date.slice(0, 10)) return "upcoming";
  if (window.end_date && ref > window.end_date.slice(0, 10)) return "expired";
  return "active";
}

export function dateWindowState(
  window: { start_date?: string | null; end_date?: string | null } | null | undefined,
  today: string,
) {
  const status = dateWindowStatus(window, today);
  if (!status) return null;
  if (status === "upcoming") return "Upcoming dated offer — verify availability";
  if (status === "expired") return "Offer ended — verify current terms";
  return "Within stated dates — verify availability";
}

export function initializeDatedTerms(
  root: ParentNode = document,
  today = new Date().toISOString().slice(0, 10),
) {
  root.querySelectorAll<HTMLElement>("[data-dated-terms]").forEach((row) => {
    const window = { start_date: row.dataset.startDate, end_date: row.dataset.endDate };
    const status = dateWindowStatus(window, today);
    const label = row.querySelector<HTMLElement>("[data-date-status]");
    if (status) row.dataset.datedStatus = status;
    else delete row.dataset.datedStatus;
    if (label) label.textContent = dateWindowState(window, today);
  });
}
