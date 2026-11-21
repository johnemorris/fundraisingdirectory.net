export function dateWindowState(window: { start_date?: string | null; end_date?: string | null } | null | undefined, today: string) {
  if (!window) return null;
  if (window.start_date && today < window.start_date) return "Upcoming dated offer — verify availability";
  if (window.end_date && today > window.end_date) return "Offer ended — verify current terms";
  return "Within stated dates — verify availability";
}

export function initializeDatedTerms(root: ParentNode = document, today = new Date().toISOString().slice(0, 10)) {
  root.querySelectorAll<HTMLElement>("[data-dated-terms]").forEach((row) => {
    const label = row.querySelector<HTMLElement>("[data-date-status]");
    if (label) label.textContent = dateWindowState({ start_date: row.dataset.startDate, end_date: row.dataset.endDate }, today);
  });
}
