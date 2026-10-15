# Analytics configuration

FundraisingDirectory.net has an optional, dependency-free Google Analytics 4
integration. It is inactive by default.

## Configure GA4

1. Set `PUBLIC_GA_MEASUREMENT_ID` to the real GA4 web-stream Measurement ID in
   the deployment environment. The accepted format is `G-` followed by uppercase
   letters or digits. Do not put a Google Tag Manager container ID here.
2. Connect the site's consent-management UI or platform to the browser API:
   `window.fdnAnalytics?.setConsent(true)` after analytics consent is granted and
   `window.fdnAnalytics?.setConsent(false)` when it is denied or withdrawn.
3. Build and verify the site in the review environment before production release.
   Confirm that no request to `googletagmanager.com` occurs before consent and
   that GA4 DebugView receives the events listed below after consent.

The consent choice is stored in `localStorage` under
`fdn_analytics_consent`. The Google tag is injected only when both a valid
Measurement ID and stored `granted` consent are present. Advertising storage,
signals, and personalization are disabled. If the ID is missing or malformed,
the integration remains a no-op.

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
