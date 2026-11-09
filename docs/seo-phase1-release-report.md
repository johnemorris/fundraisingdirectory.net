# SEO Phase 1 release report — October 28, 2026

**CONDITIONAL GO: isolated SEO candidate validated and ready for final owner
production approval. No known material backlink exception was found in the
available evidence. No production release is authorized or performed.**

## Candidate and preservation

- Branch: `codex/seo-phase1`.
- Baseline: `e5e619fdb34a00e38e4372b327bf9ecfe5031a13`, the audited HEAD, local
  `main`, and original `codex/ga4-event-delivery` HEAD.
- Worktree: `/Users/mojo/.codex/worktrees/seo-phase1/fundraisingdirectory.net`.
- Candidate: one isolated SEO commit containing this report. Its SHA is supplied
  in the handoff and resolves with `git log -1 --format=%H -- docs/seo-phase1-release-report.md`.
- Original checkout `/Users/mojo/repos/projects/fundraisingdirectory.net` stays
  on `codex/ga4-event-delivery`: all 217 pre-existing tracked/untracked file
  hashes and all 33 dirty entries match the preservation manifest exactly.
- Backup: `/private/tmp/fundraisingdirectory-seo-phase1-backup-20261028`, including
  dirty files, manifest, and separate SEO/GA4 patches. Nothing reset or discarded.
- `src/lib/analytics.ts` and `tests/analytics.test.js` are byte-identical to the
  baseline in this candidate. Their unrelated GA4 changes remain in the original
  checkout. All 47 provider fact/source records, Worker source, and
  `wrangler.jsonc` also remain unchanged from baseline.
- Source fingerprint (42 changed files, excluding report and manifest):
  `a6280e7fd27a5e0d898287188cc4dbf77e1c719b8d13162538c0fd3f80efa9c7`.

## Backlink review and indexing decision

The owner's October 28 approval permits **temporary noindex for all 22
incomplete topics, subject to final backlink review**. This review read the
existing signed-in [GSC domain property's Links report](https://search.google.com/search-console/links?resource_id=sc-domain%3Afundraisingdirectory.net)
without changing Search Console. It displayed **External links: Total 0**, with
**No data** under Top linked pages, Top linking sites, and Top linking text.
There were no external target rows to drill into, including for any placeholder.
The internal-links total of 12 is separate and is not backlink authority evidence.
A local [screenshot](/private/tmp/seo-phase1-gsc-links-20261028.png), capture time,
source URL, and screenshot hash are recorded in the evidence ledger.

The two October 28 ZIP exports in Downloads were inspected directly and hashed:

| Export | Result |
|---|---|
| Coverage Valid, `Table.csv` | Five indexed URLs; none of the 22 placeholders |
| Performance on Search, `Pages.csv`; Web, last 3 months | Eleven page rows; none of the 22 placeholders |

`docs/seo-phase1-indexing-evidence.json` enumerates **each of the 22 full URLs**,
records its export absence, GSC backlink finding, historical-authority limitation,
review source, and temporary noindex disposition. **No URL-specific material
exception was identified.** The owner's condition is satisfied by the available
GSC review; all 22 explicit classifications now record owner approval, date,
temporary status, and evidence reference. All routes remain accessible with
self-canonicals and `noindex, follow`; none is deleted or redirected. All 15
expanded guides remain `index, follow`.

These findings do **not** establish zero impressions, zero backlinks, or zero
historical authority. [Google documents that Links is sampled and may omit
non-indexed or deduplicated URLs](https://support.google.com/webmasters/answer/9049606?hl=en).
No independent historical backlink index was available; historical authority
remains unmeasured. No evidence of a particular valuable lost link was found.
This residual coverage limit is recorded for final owner review, and is not
represented as a finding that every URL has zero equity. Reassess a URL if
credible authority evidence emerges; permanent consolidation is not approved.

## Release behavior

- Explicit reviewed publication/indexing decisions replace Markdown-presence
  eligibility. Missing declared guide content and unreviewed routes fail checks.
- No word-count threshold or provider-count minimum. One supported direct option
  is allowed; related alternatives and qualifications are clearly labeled.
- Corrected Cookbooks, Software, Capital Campaigns, Fruit, Bottled Water, and
  Eco-Friendly discovery; incomplete pages and hub entries are visibly marked.
- Preserved the six-category, 37-topic Ideas hub, 55 guide/provider placements
  and reciprocal links, related topics, and all 39 historical routes (37 topics
  plus two hubs). The homepage links to the hub through ordinary HTML navigation.
- Ancestor navigation uses `aria-current="location"`; exact destinations use
  `page`. Topic styles are component-scoped SCSS; unrelated styling is preserved.
- Sitemap dates use actual editorial/provider dates and persistent profile-link
  update stamps. Builds do not rewrite source dates; provider dates survive
  removal of the last backlink and are not refreshed for unrelated guide edits.
- Production guard remains active. It now passes the recorded approval/evidence
  decisions and rejects missing approval, unavailable backlink evidence, missing
  URL records, and material exceptions. A generic uncertainty override cannot
  clear it. Preview checks passed before approvals were finalized; production
  builds then passed. No guard was disabled or bypassed.

## Validation

| Check | Result |
|---|---|
| Clean production build | PASS, `STATUS_LOCATION=production npm run build`, 97 HTML pages; prior `dist`/`.astro` moved to a temporary preservation directory first |
| Production configuration | PASS, existing public GA ID from the live homepage supplied only as a build environment value; analytics consent retained; no analytics accepted/events sent during browser checks |
| `npm test` | PASS, 98/98, including rejection of missing approval/evidence and material backlink exceptions |
| `npm run seo:release-check` | PASS, all 22 temporary decisions recorded and reviewed |
| SEO / local HTML link / canonical / robots checks | PASS, 73 unique indexable canonical URLs, 15 guides indexed, 22 placeholders excluded from sitemap; all 73 reachable from homepage links; no broken local links or missing provider backlinks |
| Repeat production build / sitemap | PASS, byte-identical SHA-256 `6899a85c26c56590e8c505a1d6c246720637145e2fe4f4d0444b0d3f0027a012`; source dates unchanged |
| `npm run validate:worker`, real local Wrangler | PASS, 73 indexable pages, all 39 historical routes, 78 direct existing 301 variants preserving queries, filtered canonical, robots/sitemap, genuine unknown-path 404 |
| Responsive/browser | PASS, 390/820/1280/1440px hub: six categories, 37 topic links, 22 incomplete labels, no overflow; corrected five placeholders and Coffee sampled on mobile; proper ancestor/canonical/robots; no console errors/warnings or loaded Google tag |
| Prior interaction checks, unchanged UI | PASS, mobile keyboard focus, Shift+Tab/Escape, guide → provider → guide journey, direct/alternative groups |
| Preservation / GA4 exclusion / whitespace | PASS, original file hashes and dirty status preserved; GA4 files equal baseline; `git diff --check` |

Local preview: `http://127.0.0.1:8789/ideas/`, local assets only, remote bindings
disabled. The initial post-clean-build routing attempt hit Wrangler's stale
asset inventory after `dist` was moved; restarting the isolated preview against
the completed output restored all checks. No routing workaround was introduced.

URL counts: **97 HTML = 73 indexable + 22 noindex topics + internal intake +
404**. Sitemap: **73 = 47 providers + 15 topics + 11 other/hub pages**.

## Remaining limits and final approval

No unresolved critical SEO implementation issue was found. Historical backlink
coverage and export completeness remain bounded as described above. The Hark
original topic URL list is still unavailable; the audit explains the inventory
reconciliation. Editorial repetition and possible future merges remain follow-up
items, without a word-count guarantee.

Pinned local preview tooling adds Wrangler 4.154.0 and its required Sharp 0.35.5
family (previously 0.35.4). No other pre-existing package versions changed; this
also removes the baseline's high Sharp advisory. The dependency audit still
reports **eight inherited findings (six high, one moderate, one low)** versus
nine at baseline; no new advisory package was introduced. Their application
exposure/remediation needs a separate owner-reviewed security assessment before
production approval. No blanket dependency upgrade was attempted.

**Final production approval is still required**, including review of the isolated
diff, recorded evidence limitations, and inherited dependency findings. This
report recommends the candidate conditionally; it does not certify a
vulnerability-free dependency tree. No push, merge, deployment, URL submission,
or Search Console modification occurred.

## Exact changed files relative to baseline (44)

- `.gitignore`
- `README.md`
- `astro.config.mjs`
- `docs/indexing-review.md`
- `docs/seo-phase1-candidate-manifest.json`
- `docs/seo-phase1-indexing-evidence.json`
- `docs/seo-phase1-release-audit.md`
- `docs/seo-phase1-release-report.md`
- `package-lock.json`
- `package.json`
- `scripts/seo-release-gate.mjs`
- `scripts/validate-topic-seo.mjs`
- `scripts/validate-worker-preview.mjs`
- `src/components/RelatedTopics.astro`
- `src/components/SiteHeader.astro`
- `src/components/TopicGuide.astro`
- `src/components/TopicLinkList.astro`
- `src/components/TopicPlaceholder.astro`
- `src/content.config.ts`
- `src/content/topics/4-h.md`
- `src/content/topics/band.md`
- `src/content/topics/baseball.md`
- `src/content/topics/basketball.md`
- `src/content/topics/candy.md`
- `src/content/topics/catholic-school.md`
- `src/content/topics/cheerleading.md`
- `src/content/topics/church.md`
- `src/content/topics/coffee.md`
- `src/content/topics/cookie-dough.md`
- `src/content/topics/discount-card.md`
- `src/content/topics/elementary-school.md`
- `src/content/topics/football.md`
- `src/content/topics/gift-wrap.md`
- `src/content/topics/high-school.md`
- `src/data/discovery.ts`
- `src/data/topicDates.js`
- `src/data/topicPublication.js`
- `src/data/topics.ts`
- `src/pages/[legacy].html.astro`
- `src/pages/ideas.astro`
- `src/pages/providers/[slug].astro`
- `src/pages/sitemap.xml.ts`
- `src/styles/global.css`
- `tests/topics.test.js`
