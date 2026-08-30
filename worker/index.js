import { legacyRoutes } from "../src/data/legacyRoutes.js";

const legacyRouteLookup = new Map(
  legacyRoutes.flatMap((route) => {
    const canonicalPath = `/${route.path}.html`;

    return [
      [canonicalPath.toLowerCase(), canonicalPath],
      [`/${route.path}`.toLowerCase(), canonicalPath],
    ];
  }),
);

export function resolveLegacyCanonicalPath(pathname) {
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return legacyRouteLookup.get(normalizedPath.toLowerCase()) ?? null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const canonicalPath = resolveLegacyCanonicalPath(pathname);

    if (canonicalPath && pathname !== canonicalPath) {
      url.pathname = canonicalPath;

      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
