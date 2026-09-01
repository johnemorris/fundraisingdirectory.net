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

    if (canonicalPath) {
      if (pathname !== canonicalPath) {
        url.pathname = canonicalPath;

        return Response.redirect(url.toString(), 301);
      }

      // Astro's directory build emits legacy routes at
      // /Legacy-Route.html/index.html. Fetch the directory form internally so
      // Cloudflare Assets does not redirect the public canonical .html URL to
      // a trailing slash.
      url.pathname = `${canonicalPath}/`;

      return env.ASSETS.fetch(new Request(url, request));
    }

    return env.ASSETS.fetch(request);
  },
};
