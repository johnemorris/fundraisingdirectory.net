export interface SearchRecord { title: string; href: string; type: "Provider" | "Guide"; text: string }
export const normalizeSearchText = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export function searchSite(records: SearchRecord[], query: string) {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return records.filter((record) => terms.every((term) => normalizeSearchText(`${record.title} ${record.text}`).includes(term)))
    .sort((a, b) => Number(normalizeSearchText(b.title).includes(normalizeSearchText(query))) - Number(normalizeSearchText(a.title).includes(normalizeSearchText(query))) || a.title.localeCompare(b.title));
}
