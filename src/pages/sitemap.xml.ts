import { getCollection } from "astro:content";
import { legacyRoutes } from "../data/legacyRoutes";
import { isLegacySitemapEligible } from "../data/discovery";
import { SITE_ROUTES } from "../data/site";
import { providerProfilePath } from "../data/providerLinks";

export async function GET() {
  const providers = (await getCollection("providers")).filter(
    (provider) =>
      !provider.data.meta.deleted && provider.data.status.lifecycle === "active",
  );

  const paths = [
    "/",
    "/providers/",
    "/about/",
    "/contact/",
    "/for-providers/",
    "/privacy/",
    "/disclaimer/",
    ...providers.map((provider) => providerProfilePath(provider.data.identity.slug)),
    ...legacyRoutes
      .filter(isLegacySitemapEligible)
      .map((route) => `/${route.path}.html`),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, SITE_ROUTES.origin).href}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
