# FundraisingDirectory.net

Astro static site with a Cloudflare Worker for canonicalizing known historical
routes before serving the generated assets.

## Local development

Install dependencies with `npm ci`, then start the project in background mode:

```sh
npm run astro -- dev --background
```

Use `npm run astro -- dev status`, `npm run astro -- dev logs`, and
`npm run astro -- dev stop` to manage the background server.

## Validation

```sh
npm test
npm run build
```

Provider records live in `src/content/providers/` and are validated by the
schema in `src/content.config.ts`. Records should use current public sources,
stable taxonomy identifiers, honest unknown/null values, and a current review
date. The static directory renders every active record and applies Finder query
filters in the browser.

Known historical routes are defined once in `src/data/legacyRoutes.js`. The
Worker accepts safe case, trailing-slash, and extensionless variants of those
known paths only; unrelated URLs continue to the normal 404 response.
