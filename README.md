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

The canonical product sequence and current V1 status are tracked in
[`docs/v1-backlog.html`](docs/v1-backlog.html).

Provider records live in `src/content/providers/` and are validated by the
schema in `src/content.config.ts`. Records should use current public sources,
stable taxonomy identifiers, honest unknown/null values, and a current review
date. The static directory renders every active record and applies Finder query
filters in the browser.

Fundraising method and supporting taxonomy IDs live in `src/data/taxonomies/`.
See [`docs/taxonomy-schema.md`](docs/taxonomy-schema.md) for the additive,
Landscape-informed provider/program dimensions and enrichment conventions.

Every provider entry point uses the single canonical profile at
`/providers/{slug}/`. Organic, featured, sponsored, affiliate, search,
category, and editorial placements may change labeling or visibility, but must
not create parallel provider pages or duplicate factual records. Build internal
profile URLs with `providerProfilePath()` from `src/data/providerLinks.ts`;
external destinations remain centralized in each provider record.

Shared discovery presentation lives in `src/data/discovery.ts` and semantic
method/group treatments live in `src/data/semanticTaxonomy.ts`. Provider and
method imagery is registered centrally in `src/data/visuals.ts`; entries record
whether imagery is representative, along with its source and usage status. Do
not scatter visual paths through page templates.

Known historical routes are defined once in `src/data/legacyRoutes.js`. The
Worker accepts safe case, trailing-slash, and extensionless variants of those
known paths only; unrelated URLs continue to the normal 404 response.

## Topic guides and indexing

Guides live in `src/content/topics/*.md`. Each has a durable `legacyPath`, a
meaningful editorial `updated` date, provider references labeled `direct` or
`alternative` (with optional qualification notes), and related routes. There is
no minimum word count or provider quota. Add only useful, supported options.
Provider facts and sources remain in their existing content collection.

`src/data/topicPublication.js` explicitly records publication, indexing, reason,
review date, and approval state for every topic. The 15 guides stay indexable;
22 incomplete guides stay at their original URLs with `noindex, follow` and
clear research-in-progress notices. Adding/removing a Markdown file cannot
silently approve or change indexing: mismatched publication decisions fail the
build. No redirects or permanent consolidations have been authorized.

`docs/seo-phase1-indexing-evidence.json` records the October 28 exports and
read-only GSC Links review for all 22 placeholders. The owner approved temporary
noindex subject to that review; no material exception was reported. Export
absence and sampled Links data do not establish zero backlinks, traffic, or
historical authority. Routes remain accessible for later improvement/review.
The production gate rejects missing approval, unresolved evidence, and material
exceptions. It has no general uncertainty-acceptance override. Production
release still requires final owner approval; never manufacture review metadata.

```sh
npm run seo:release-check
STATUS_LOCATION=preview npm run build
WRANGLER_SEND_METRICS=false npm run preview:worker
# In another terminal, with that local preview running:
npm run validate:worker
```

`seo:release-check` exits nonzero while owner decisions are pending.
Production-targeted Astro builds also enforce this gate. Preview builds produce
optimized static output without deploying anything. The Worker preview uses
local assets, loopback port 8789, and disabled remote bindings. Wrangler is a
pinned development dependency for repeatable production-style routing checks.

Sitemap dates come from editorial/provider content dates. Update
`TOPIC_HUB_UPDATED` for hub changes and `providerTopicLinkUpdates` for additions,
removals, or renamed links on specific provider profiles. Retain a profile's
stamp after its last guide link is removed. Guide body changes do not refresh
unchanged provider backlinks. Never substitute build time or filesystem mtime.
The build verifies canonical/robots/sitemap agreement, provider references,
related links, incomplete-page notices, and homepage HTML reachability.
