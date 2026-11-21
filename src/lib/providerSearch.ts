interface SearchableProvider {
  identity: { name: string; aliases: string[] };
  content: {
    summary: string;
    how_it_works: string;
    best_for: string[];
    considerations: string[];
  };
  programs: Array<{ name: string; summary: string }>;
}

export const normalizeProviderSearch = (value: string) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase()
  .trim()
  .replace(/\s+/g, " ");

export const buildProviderSearchText = (provider: SearchableProvider) => [
  provider.identity.name,
  ...provider.identity.aliases,
  provider.content.summary,
  provider.content.how_it_works,
  ...provider.content.best_for,
  ...provider.content.considerations,
  ...provider.programs.flatMap((program) => [program.name, program.summary]),
].join(" ").replace(/\s+/g, " ").trim();

export const providerSearchMatches = (searchText: string, query: string) => {
  const normalizedQuery = normalizeProviderSearch(query);
  if (!normalizedQuery) return true;
  const normalizedText = normalizeProviderSearch(searchText);
  return normalizedQuery.split(" ").every((term) => normalizedText.includes(term));
};
