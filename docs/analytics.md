# Analytics configuration

FundraisingDirectory.net has an optional, dependency-free Google Analytics 4
integration. It is inactive by default.

## Configure GA4

1. In Cloudflare, open **Workers & Pages → fundraisingdirectory-net → Settings →
   Build → Build variables and secrets**. Add `PUBLIC_GA_MEASUREMENT_ID` as a
   production build variable with the real GA4 web-stream Measurement ID. This
   must be a build variable, not only a runtime variable under **Variables &
   Secrets** or `wrangler.jsonc`, because Astro embeds it into static HTML during
   `npm run build`. The accepted format is `G-` followed by uppercase letters or
   digits. Do not put a Google Tag Manager container ID here.
2. Confirm the Worker build command is `npm run build`, the deploy command is
   `npx wrangler deploy`, and the production branch is `main`. Workers Builds
   supplies `WORKERS_CI_BRANCH`; production builds fail when the Measurement ID
   is missing or malformed. `ANALYTICS_REQUIRED=1` can enforce the same check in
   another CI or local release workflow.
3. Build and verify the site in the review environment before production release.
   Confirm that no request to `googletagmanager.com` occurs before consent and
   that GA4 DebugView receives the events listed below after consent.

The consent choice is stored in `localStorage` under
`fdn_analytics_consent`. The Google tag is injected only when both a valid
Measurement ID and stored `granted` consent are present. The first-party consent
banner and footer preference control call the existing analytics consent API.
Advertising storage, signals, and personalization are disabled. Withdrawing
consent disables future tracking and removes accessible first-party GA cookies.
Development and preview builds may omit the ID and remain inactive; production
builds fail instead of silently deploying without analytics configuration.

## Event contract

| Event | Parameters | Privacy guardrail |
| --- | --- | --- |
| `provider_search` | query length, result count, active filter count | Never sends the search text. |
| `directory_filter` | interaction source and selected facet counts | Never sends free text. |
| `provider_outbound_click` | provider ID, slug, and placement | Commercial or affiliation status is excluded. |
| `finder_completion` | answered-question count, selected-priority count, result count | Never sends Finder answers, ZIP codes, or scoring details. |

Analytics must remain separate from provider ordering, Finder scoring, and all
commercial relationships. Adding a second analytics product requires a separate
privacy and architecture review.
