export function normalizeComparisonSelection(values: string[], available: string[]) {
  return [...new Set(values)].filter((slug) => available.includes(slug)).slice(0, 4);
}
