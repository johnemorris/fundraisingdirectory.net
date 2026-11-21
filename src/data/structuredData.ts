import type { CanonicalProvider } from "./providerSchema.ts";
import { SITE_ROUTES } from "./site.ts";
export const absoluteUrl = (path: string) => new URL(path, SITE_ROUTES.origin).href;
export const breadcrumbData = (items: { label: string; href?: string; dynamic?: string }[], currentPath: string) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.filter((item) => !item.dynamic || item.dynamic === "group-parent").map((item, index) => ({
    "@type": "ListItem", position: index + 1, name: item.label, item: absoluteUrl(item.href ?? currentPath),
  })),
});
export const providerItemList = (providers: CanonicalProvider[], path: string) => ({
  "@context": "https://schema.org", "@type": "ItemList", url: absoluteUrl(path),
  numberOfItems: providers.length,
  itemListElement: providers.map((provider, index) => ({
    "@type": "ListItem", position: index + 1, name: provider.identity.name, url: absoluteUrl(`/providers/${provider.identity.slug}/`),
  })),
});
