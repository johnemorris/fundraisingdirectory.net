import { legacyRoutes } from "../src/data/legacyRoutes.js";

const legacyRouteLookup = new Map(
  legacyRoutes.map((route) => [
    `/${route.path}.html`.toLowerCase(),
    `/${route.path}.html`,
  ]),
);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const canonicalPath = legacyRouteLookup.get(pathname.toLowerCase());

    if (canonicalPath && pathname !== canonicalPath) {
      url.pathname = canonicalPath;

      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
