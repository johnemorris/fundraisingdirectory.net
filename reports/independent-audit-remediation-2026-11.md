# Independent audit reconciliation — November 2026

## Baseline and authority

Run date: November 20, 2026. Clean existing checkout; fetched `origin/main` and verified full SHA `81c490b45efd7b8c1588da54d019957aaf9ea0a2`. Feature branch: `codex/independent-audit-remediation-2026-11`. No worktree, merge, push, or deployment authorized. Report source: Downloads/fundraisingdirectory-review-report (3).pdf, 27 pages, metadata title Revised v2 (November 18). Audit assertions are hypotheses, not fresh ranking or Search Console evidence.

## Phase A — Privacy review performed first

Main source and baseline built `/privacy/index.html` still contain the October 15 notice. Hark's actual rewrite is on `origin/privacy-rewrite` at `cbb5dcf` (preceded by `d920a3d`); only Privacy and its multi-paragraph spacing styles differ. It is not yet part of main. Preserve this work.

**Verified:** public Get Listed collects organization name/website/introduction, methods/audiences/free text, contact name/work email, optional role/phone. `ProviderListingWizard.astro` and `providerSubmission.ts` build an encoded mailto message; no submission fetch, server endpoint, database, or automatic publication exists. Sending requires the visitor's mail client. Contact is also mailto. Worker has only static assets and legacy normalization, no personal-data storage binding. Internal intake workbench uses localStorage for research drafts and exports JSON; it is noindexed and is distinct from the public form. Finder answers are URL state in the visitor's browser, not a saved account/profile. The site host necessarily receives requested URLs; with analytics consent, Google may receive page URLs (which can contain shared Finder state), as the notice already qualifies.

**Analytics:** `analytics.ts`, consent components, and docs/analytics.md agree on opt-in GA4, localStorage preference, no Google script before grant, whitelisted interaction payloads, withdrawal stopping future events and clearing accessible first-party GA cookies. No accounts, on-site payments, or newsletter flow found. Cloudflare hosts the site; Google processes consented analytics. Mailbox provider and its retention/backups cannot be established from this repository.

**Before/after assessment:** Hark fixes the old notice's misleading omission of Get Listed and explains fields, purpose, email handling, contact options and analytics. Code alone cannot establish the rewrite's 24-month/active-listing retention rule, 30-day response commitment, never-publish-contact guarantee, no-sale assurance, or child-data operational policy. No legal entity or compliance guarantee is invented. At this initial checkpoint, owner clarification had been requested and policy-dependent changes were held pending the response recorded below. P0-1 is **partially fixed by Hark, not verified as resolved**. This assessment was recorded before Phase B implementation. Final disposition and validation follow below.


### Final Privacy disposition

Owner response during this run: **“Not established; remove fixed promises.”** Both Hark commits were cherry-picked intact with original authorship before applying a separate correction. Removed the 24-month retention rule and 30-day response promise. The notice now states that no fixed retention period is established and offers the contact email for retention/deletion questions. Removed unsupported blanket no-sale, never-publish-contact and child-data assurances; retained the actual adult/provider audience and automatic-publication limitations. Named Cloudflare from verified deployment configuration and Google from the consent integration, without naming an unverified mailbox processor or legal entity.

Also corrected a subtle factual issue in Hark's rewrite: “answers … not … sent to us” is too absolute for shareable query URLs. Finder computation stays browser-side, but requested URLs reach hosting and consented GA can process page URLs. The notice distinguishes custom event parameters from URLs, describes comparison session storage, and expressly qualifies shared search/Finder values. Effective date is November 20. Final source and generated HTML were reviewed; owner-rejected promises are absent from both. **P0-1 is resolved in this branch by Hark's rewrite plus these targeted corrections, not by Hark alone.** A final no-JavaScript check also identified the native form fallback risk: the form had no action/method and relied on its JavaScript handler to prevent a default GET. It now stays hidden until that handler is ready, and no-JavaScript visitors get an ordinary email link. Browser and unit checks cover this fail-closed behavior. Mailbox provider, backup/deletion operations and any future formal retention policy remain owner facts to establish; no compliance certification is claimed.

## Reconciled inventory and decisions

| Item | Verified repository/build state |
|---|---|
| Active providers / programs | **49 / 71**. Provider YAML, verification dates, fees and source records are unchanged by this run. |
| Published planning guides | **15**, not the audit's approximately 36. |
| Incomplete topic routes | **22**, already explicitly `noindex, follow`, self-canonical and excluded from the sitemap under the October 28 reviewed dispositions. Preserved. |
| Historical routes | **39**: 37 topics plus Resources and Articles. Root plus these routes is the recovered historical corpus; variants are not extra documents. |
| Existing redirect normalization | **78 tested variants**, one hop to the 39 canonical HTML routes, retaining query strings. Arbitrary unknown paths still produce genuine 404s. |
| Sitemap | Baseline **75**; final **77** = 49 provider profiles + 15 guides + 13 other/hub/category URLs. Added schools and research standards. Search stays noindex and outside the sitemap. |
| HTML pages | Baseline 99; final **102**. Added schools, search and research standards. Internal intake and 404 remain outside the sitemap. |
| Category routes | Previously no dedicated indexable provider categories. Added **one**: `/providers/schools/`, with 44 matching records in server-generated HTML. |
| Cookie dough category | Only Fundraising.com has the cookie-dough product tag, and its operational/economic research is incomplete. A second thin category URL is not justified. Existing `/Cookie-Dough.html` remains published. |
| Search index | 49 active providers + 15 published guides; no placeholder topic promoted as finished. Provider/product/group terms use shared labels. |
| Provider review age | On Nov 20, Fundraising.com is **88 days** after Aug 24, not already over 90 days as the audit says. No provider is over 90 days at this date. Completeness, not age alone, disqualifies it from Featured. |
| Existing recheck flags | Little Caesars, Panera and World's Finest Chocolate retain `needs-recheck`; no date is artificially refreshed. |

These are source and built-output counts, not Google's index counts. The general `/providers/?…` HTML remains the directory inventory and its client script applies filters. Dedicated schools HTML is genuinely prefiltered without JavaScript. Existing arbitrary-query canonicals remain `/providers/`; this is a deliberate duplicate/filter control, not itself a defect. No bulk taxonomy pages, query permutations or seasonal pages were indexed.

### Featured research and disclosures

`index.astro` previously hard-coded Fundraising.com; no rotating pool or post-load provider replacement was found. The report's Givebutter-versus-Fundraising.com rendering observation was unverified. The branch uses one explicit Givebutter selection, with no arbitrary fallback. Eligibility checks active/undeleted status, verified/current research, current source and claim flags, standard/anchor completeness, a real verification date no more than 90 days old and researched/not-applicable economics, eligibility, timing and logistics for every program. Givebutter passes on Nov 20; Fundraising.com fails. No new affiliate relationship is asserted: both records retain `affiliation.type: none` and internal affiliate research `unknown`. Existing compensated-link disclosure behavior is preserved.

The policy is a build-time placement guard, **not a 90-day review SLA**. Long-lived deployments still need build/research monitoring; dates are never rewritten to retain eligibility. The research standards page says exactly that. No scheduled job was invented or deployed.

Fundraising.com's official [direct-sale](https://fundraising.com/direct-sale), [order-taker](https://fundraising.com/order-taker-program), [online-store](https://fundraising.com/online-fundraiser-store) and [online-platform](https://fundraising.com/online-fundraising-platform) pages were available to the web reader. They establish workflows and some advertised product margins, but not one coherent, independently corroborated, program-wide fee/minimum/shipping schedule. In particular, product examples and “up to” headlines must not be generalized into guaranteed program profits. No incomplete research was promoted to verified terms or given a new whole-record verification date. **Unfeaturing is the completed safety action; full program research is backlog.** The repeated “Not yet researched” fields remain honest. Removing them without research would hide missing facts.

## Finding matrix

“Confirmed” means the hypothesis was verified and the implementation below addresses it. “Partially fixed” identifies a completed safety/improvement action with an explicitly remaining research or business decision. Overlapping IDs refer to the same implementation, not additional deliverables.

| ID | Disposition | Current evidence and implementation / decision | Validation |
|---|---|---|---|
| P0-1 Privacy | confirmed | Hark branch omitted from main; restored with authorship, removed owner-rejected fixed promises and unsupported assurances, corrected URL/analytics qualifications. | Privacy unit check, built-output check, source/live-form comparison, mobile screenshot. |
| P0-2 Finder | confirmed | Second answer opens real provider shortlist; providers precede method suggestions. Homepage/shared two-answer entry focuses results. Q3–10 are optional/skippable with a persistent See shortlist exit. Dropdown remains in flow; Other and Submit stay reachable. | Real Schools + Product Sales top-five unit test; browser direct and homepage journeys, shared URL, all eight skips, answer editing, visible return to refinements, pointer/keyboard/mobile. |
| P0-3 Fundraising.com depth | partially fixed | Incomplete research confirmed; removed from Featured and removed misleading reused representative profile photo. No fees, minimums, shipping or review date fabricated. Primary-source access alone did not establish all program terms. | Eligibility test rejects weak record; all 49 YAML records unchanged; profile remains reachable with honest unknowns. Full research backlog. |
| P0-4 Featured | confirmed | Replaced hard-coded weak selection with explicit eligible Givebutter selection and fail-closed completeness/source/date guard. No rotation or commercial relationship invented. | HTML and browser show Givebutter; unit tests cover weak/stale/future/incomplete/recheck states and no fallback. |
| P0-5 Thin guides | already fixed | All 22 existing temporary noindex/sitemap decisions retained; 15 guides stay indexable. Audit's guide count retired. | Full SEO release gate, build crawl and Worker route checks. |
| P0-6 Category SEO | confirmed | Schools has substantial data and an established discovery entry point; added useful unique comparison/planning copy, 44 SSR cards, self-canonical, links and sitemap date. Cookie dough expansion rejected for insufficient depth; no demand/ranking data invented. | No-JS 44-card browser assertion; output validator, ItemList/card equality, homepage reachability, Worker 200/canonical. |
| P1-1 Taxonomy | confirmed | Shared labels cover Finder, header actions, products and coverage. Directory now filters every method on cards; Finder keeps its intentional narrower guided list. Stable slugs/URLs retained. Marketing prose remains contextual. | All provider method IDs checked against directory options; label assertions; new collection/reuse mobile filter journey. |
| P1-2 Comparison | confirmed | Card selection, persistent tab/URL state, max-four tray and horizontally scrollable side-by-side table from normalized canonical economics, program conditions, eligibility, timing and dated sources. No absent fee becomes zero. Sorting unlike/conditional fee models is deliberately omitted. | Fee-type separation/conditional 0% and 3%/2.9% + $0.30 tests; unknown tests; four selections, fifth disabled, reload/clear, mobile overflow and keyboard region. |
| P1-3 Global search | confirmed | Global header entry opens lightweight `/search/`, with labeled provider/guide results, query state and noindex; section searches preserved. Native link/search form work on keyboard/mobile. | Candy returns guide + providers; Givebutter first; 49+15 records in built index; no placeholders. |
| P1-4 Finder data | partially fixed | Correctly renders existing canonical effort data with an explicitly editorial workflow basis; omits unknown effort/upfront fields. Specific group/program/method reasons replace generic explanations. No new measured hours or unsupported costs inferred. | Real-corpus unit test, browser result copy, source serialization firewall tests. Further factual backfill requires research. |
| P1-5a Legacy redirects | partially fixed | Existing 39 canonicals and 78 normalizations already work. No source inventory establishes 372 PHP URLs or their IDs/destinations. Repository search found no PHP mapping; Wayback CDX was unavailable through the research tool. No speculative redirects added. | Worker tests and full HTTP one-hop/query checks. Owner log/export or recovered old sitemap needed for PHP mappings. |
| P1-5b Structured data | confirmed | WebSite with working SearchAction, visible BreadcrumbList, provider/category ItemList, 15 dated Articles. No Organization legal identity, Review, ratings or FAQ fabricated. | Parsed 118 generated graphs; 100 breadcrumbs, 15 Article dates equal visible dates, 2 ItemLists equal SSR cards; search target exercised. External rich-result eligibility/certification not claimed. |
| P1-5c Hub overlap | deferred | Current Resources offers research/planning destinations; Articles offers guide pathways; Ideas supports category/method/seasonal discovery. Preserve both valuable canonical legacy hubs and links. Current search equity was unavailable; no evidence justifies irreversible consolidation. Fixed Articles' resource-nav ancestry. | All 39 legacy URLs remain 200; Articles active-state browser assertion; link crawl. Future equity-led IA review. |
| P1-6 Target pages | partially fixed | Enhanced existing Candy with inventory-aware calculator and sourced program overview; Elementary with program comparison/responsibility overview; actual update stamps changed. Givebutter already has researched fee/condition sections and 11 sources; added comparison and research links. No unsupported profit table, typical return ranking or fee rewrite. | Calculator tests include unsold stock, loss, costs, zero and invalid input; rendered target tables and browser calculation; existing profile tests. |
| P1-7 Trust | partially fixed | Added `/how-we-research/` describing sources, dates, research states, editorial effort, Featured and paid disclosures; links from About/footer/profiles/guides. Existing guide dates preserved, not relabeled as fresh reviews. Operating entity remains unverified; no review SLA or personal contacts added. | Reachability, breadcrumbs, mobile layout, source review. Owner entity/mailbox/policy facts remain. |
| P2-1a Footer | confirmed | Explicit space and subtle `<package version>.<short SHA>` identity retained. `/status` unchanged and unadvertised. Audit's SHA removal rejected under owner direction. | Updated metadata guard + unit check, build validates footer against /status. |
| P2-1b Navigation/breadcrumbs | confirmed | Breadcrumb separators appear before later visible crumbs, avoiding hidden-final-item separator. Removed duplicate desktop View all link; fixed Articles ancestry, added Get Listed breadcrumb and renamed misleading crowdfunding label in nav/footer/home. Disclaimer not given a fabricated review date. | Browser keyboard menu/facets, Articles active state, generated breadcrumb graphs, route crawl. |
| P2-1c Homepage dropdown | confirmed | Same issue and implementation as P0-2, not counted twice. | Open disclosure geometry, Other selection, Escape and Submit checks at 390px. |
| P2-2 Coverage/promotions | confirmed | Shared US nationwide label. All dated Panera terms remain in HTML and get runtime Upcoming / Within stated dates / Offer ended labels, inclusive Dec 1–21; refresh on resume/visibility and each minute. No-JS text is conditional on explicit dates. Economics unchanged. | Unit dates before/during/after; browser mocks Nov 30, Dec 1, Dec 21 and Dec 22 against the same build; no-JS assertion. Runtime labels use UTC dates; organizer must verify eligible local event terms. |
| P2-3 Mobile | confirmed | 390×844 pass across home, Finder, providers, ideas, provider/legacy pages, Get Listed, contact, schools, privacy and search. Fixed new header overflow, card-link interception of Compare controls, and dynamic-table scoped styles found during QA. | Screenshots + results JSON; zero document overflow/page errors; form submit intercepted locally, no email sent. Desktop 1440px sampled too. |
| P2-4 Research badge | confirmed | Success icon only for verified records; in-progress/pending badge uses neutral treatment. No data status upgrade. | Source + rendered output checks. |
| P2-5 Best suited for | confirmed | Removed unsupported best-fit superlative. Broad audience lists omitted from cards; lists of at most three shown only as Supported organizers. Full classification remains in profile/filtering. No preferred groups guessed. | Output asserts no Best suited for; classification data unchanged. |
| P2-6 Visual treatment / facets | partially fixed | Compact text-only profile header grid removes reserved vertical gap; weak Fundraising.com photo reuse removed; new Featured layout has no empty image column. Card heights use row stretch with flex content, no brittle subgrid row count. Existing collapsible facets retained; removed duplicate keyboard toggling and exposed selected groups. No new logos/images or permission claims. | Desktop/mobile screenshots, native Enter/Space facet assertions; no new assets. Broader rights-cleared imagery is backlog. |

## Overlapping SEO recommendations

The report explicitly avoids separate SEO prompts for categories/thin content/schema/legacy routes. For requested S1–S4 coverage, the following are aliases, not invented extra scope.

| SEO ID | Disposition | Evidence / implementation / remaining action |
|---|---|---|
| S1 categories | confirmed | P0-6 schools; thin cookie-dough expansion rejected. |
| S2 thin guides | already fixed | P0-5 existing 22 noindex decisions. |
| S3 schema | confirmed | P1-5b supported rendered JSON-LD only. |
| S4 old URLs | partially fixed | P1-5a existing normalizations; PHP inventory unresolved. |
| S5 sitemap | confirmed | 75 → 77, exact additions explained; genuine dates only. No fabricated lastmod on unchanged informational pages. |
| S6 provider titles | confirmed | Descriptive Programs & Requirements titles preserve URLs. No automatic annual “Review” or Profit promise on unresearched records. |
| S7 group guide expansion | deferred | 15 existing published guides already contain planning/examples/provider links. Extensive new researched ideas and 15–30-item quotas are a content workstream. Target guide improvement under P1-6. |
| S8 seasons | already fixed | Four-season `/ideas/` discovery and visitor-local-date rotation already deployed and preserved; no thin standalone seasonal pages. Existing seasonal tests pass. |
| S9 comparison articles | deferred | Reusable sourced comparison now works; permanent versus articles need additional editorial/source work. |
| S10 tools | partially fixed | Inventory-aware Candy calculator implemented and tested; timeline planner and printables deferred. |
| S11 best-of lists | deferred | Requires defensible comparative research and selection criteria; no invented ranking. |
| S12 badges/claims | deferred | Current mailto intake preserved. New claim identity/approval infrastructure and badge rights expand product/privacy scope. |
| S13 outreach | deferred | Research/outreach kit is a later editorial workstream. No messages sent. |
| S14 Pinterest | deferred | Account ownership and imagery permissions unverified. No profiles, pins or generated image campaign created. |
| S15 AI/reference policy | partially fixed | `public/robots.txt` is byte-identical. The source file is wildcard Allow + sitemap. A final direct read of live robots confirmed Cloudflare Managed Content adds `search=yes,ai-train=no,use=reference` and training-bot disallows. Neither source nor edge configuration changed. Source-backed intros preserved; no mandatory money example fabricated. |
| S16 consoles/measurement | deferred | Prior GSC evidence exists in October release docs, contrary to “no console verification documented.” Current GSC/Bing access and data were not available. No new rankings, traffic, indexing requests, account changes or scheduled automation claimed. |

## Validation and preservation

- `npm ci` from the existing lockfile restored missing local Wrangler. **No package.json dependency changes or package-lock.json changes**, no broad upgrade or audit fix. Linux optional dependency entries remain unchanged. Actual Linux CI was not run locally.
- `npm test`: **117/117 passed** (107 existing + 10 targeted audit tests).
- `npm run seo:release-check`: passed all recorded indexing decisions.
- `npm run build`: passed. Production-mode build also passed using `STATUS_LOCATION=production PUBLIC_GA_MEASUREMENT_ID=G-AUDITLOCAL1`; the synthetic valid ID was only for local testing and all Google requests in browser QA were intercepted. This is not a production configuration or deployment.
- Built crawl: **102 HTML pages, 77 reachable indexable canonical sitemap URLs, 15 guides, 22 noindex placeholders**; no broken local destinations. `node scripts/validate-audit-output.mjs`: **118 parsed JSON-LD graphs**, exact 49/44 directory/category cards, 49+15 search records and **212 local asset references** verified, plus Privacy and neutral dated-offer fallback.
- `npm run validate:worker`: passed all 77 sitemap URLs, 39 canonical legacy routes, 78 one-hop 301 variants, preserved query strings, arbitrary-query canonical and true 404. Preview uses only local Assets; no remote bindings or deploy.
- `scripts/audit-browser-qa.mjs`: **23 viewport/date observations**; 390px and 1440px, native keyboard controls, both two-answer entry paths, immediate provider visibility, all eight optional skips, comparison four-provider cap/URL/reload/clear, mobile filters, Candy/Givebutter global search, calculator, five-step intake, fail-closed no-JS intake/email fallback, no-JS schools and Panera, before/during/after promotion dates, HTML/rendered Featured agreement, zero page/console errors.
- Consent browser checks: zero Google requests before consent and after decline; Accept requests one intercepted script; withdrawal disables future analytics and clears a test first-party GA cookie. Existing analytics unit tests also pass. No real analytics events or email were sent by QA.
- `git diff --check`: passed. Provider YAML/source provenance, intake engine/schema, Worker routing/configuration, GA implementation, seasonal data/runtime, reviewed topic publication dispositions and robots source are unchanged. JEM6/Ko-fi were not present in the current source; nothing was removed or invented.
- Maintainability review: reused canonical economics/presentation and provider search, extracted one shared directory component for general/schools rendering, separated browser selection normalization to avoid shipping the provider schema, removed dead audience-more handling and duplicate button-key handlers, used scoped SCSS/rem units for new UI, added no dependencies.

Browser QA uses an existing Playwright installation (`PLAYWRIGHT_MODULE` can point to its entry module) and an optional `BROWSER_EXECUTABLE`; it adds no project dependency. It must target loopback.

Screenshots and machine-readable observations: [QA evidence](independent-audit-qa/results.json). Representative views: [mobile Finder shortlist](independent-audit-qa/mobile-finder-shortlist.png), [mobile comparison](independent-audit-qa/mobile-comparison.png), [desktop Givebutter](independent-audit-qa/desktop-providers-givebutter.png), [mobile Get Listed final step](independent-audit-qa/mobile-get-listed-final.png). Screenshots show the remediated state, not an invented before-state.

External validation limits: no production deployment, fresh GSC/Bing inspection, external rich-results certification, historical backlink census, full provider research refresh or Linux CI execution. The report does not certify legal compliance, future provider terms or rankings. Build-time Featured age eligibility needs ongoing build/research monitoring; this run did not create an operational review schedule.

## Commits and release plan

Base is fetched main `81c490b45efd7b8c1588da54d019957aaf9ea0a2`. All work stays on `codex/independent-audit-remediation-2026-11`.

| Commit | Workstream |
|---|---|
| `685ebb1` | Hark's original Privacy rewrite, authorship preserved (from `d920a3d`). |
| `e90b3d6` | Hark's Privacy layout/spacing fix, authorship preserved (from `cbb5dcf`). |
| `0ff2983` | Owner-confirmed Privacy corrections and URL data qualifications. |
| `4b3622c` | Two-answer Finder, shared labels, strict Featured selection, representative-photo removal. |
| `76231eb` | Runtime date-window labels with truthful static fallback. |
| `feaad4a` | Comparison, schools category, global search, structured data, research standards and UI fixes. |
| `5d1ca38` | Inventory calculator and target-guide program overviews. |
| `98c43f4` | Targeted tests and repeatable local browser/output validation tools. |
| `644c16a` | Show provider matches immediately on two-answer/shared URL entry. |
| `e63d6e3` | Fail-closed mailto form fallback and visible return to optional refinements. |

The final evidence/report commit can be identified with `git log --oneline origin/main..HEAD`; final exact SHAs are supplied in the handoff. No main/staging merge, push or deployment has occurred. Direct public reads at the end of this run returned 200 for Privacy, Get Listed and Contact; live Privacy still has the older title, and `/status` still reports production `81c490b4` (Nov 18 build).

Recommended release: review the report and code diff; approve a staging push/preview explicitly; run existing Linux clean-install/build CI against the unchanged lockfile; review preview behavior with the real consent-gated analytics build configuration; obtain explicit approval before production promotion. After release, use fresh GSC/Bing data to inspect the new schools URL, sitemap acceptance and existing indexing dispositions. Never infer Google indexing from local robots/canonical checks.

## Top three remaining actions by impact

1. **Primary-source research:** finish Fundraising.com's program-by-program fees/profit/minimums/shipping and resolve existing Little Caesars/World's Finest/Panera recheck flags. Do not restore Featured or publish cookie-dough category expansion until depth supports it.
2. **Owner policy/business facts:** establish the real operating entity and mailbox processor/retention/deletion practices, then update notices with confirmed facts. The unsupported fixed retention/response promises are already removed; no operational or legal guarantee was invented.
3. **Approved release and measurement:** approve staging/release separately, run Linux CI and inspect fresh Search Console/Bing coverage and queries. Use those data and recovered PHP logs/sitemaps to prioritize categories, legacy recovery and monitoring, rather than speculative SEO expansion.

## November 26, 2026 Production Readiness Verification & Updates (`codex/production-readiness-2026-11`)

1. **Panera December 1–21, 2026 Promotion & Runtime Lifecycle:** Re-verified against primary Panera Fundraising sources (`fundraising.panerabread.com`, `/faq`, `/terms-conditions`, `/locations` [1,922 participating locations across 48 states and D.C.], and `/locations/sacramento-cw-net-plaza`). Confirmed `501(c)(3)` / W-9 eligibility, `20%–25%` standard giveback (`$100–$150` minimum net sales), and the location-specific `30%` special offer (`12/1–12/21/26`, `$150` minimum net sales, 10-day booking cutoff). Extended `initializeDatedTerms()` (`src/lib/dateWindow.ts`) and `TopicLinkList.astro` / `ideas.astro` so seasonal promotion badges on `/ideas/` as well as provider profiles automatically transition across `upcoming`, `active`, and `expired` states at runtime (and refresh on `pageshow`, `visibilitychange`, and 60-second intervals) without redeployment.
2. **November 23 Provider Developments & Profile Rendering:**
   - **Fundraise Up:** Verified November 23 changelog entries and updated `fundraise-up.yaml` (`src_000202`, `src_000203`, `src_000204`) with the **Ramadan Giving** multi-night scheduled donation calendar Element, **daily gift end dates in Gift Cart**, and expanded **AI Coach** on-page P2P chat capabilities and approval controls.
   - **Givebutter:** Verified Givebutter's official help center documentation (`src_000205`, updated Nov 24) and added the dated **Givebutter Gives Back 1% Giving Tuesday Match** (`effective_window: 2026-12-01` to `2026-12-02`, Second Chance Match through `2026-12-10`, payouts starting `2026-12-11`).
   - **Bonterra & Network for Good:** Verified November 23–25 updates on `bonterratech.com/product/network-for-good` and `/product/nonprofit-hub` (*Bonterra Que* AI assistant, free Nonprofit Hub / GrantMatch tier, 30-day Network for Good trial with 3% platform fee on Free/Essentials tiers, quote-based core subscriptions, and a 24-hour Giving Tuesday data-import pause). Neither is an active canonical provider in the 49-provider V1 corpus; documented in `docs/provider-intake/2026-11-18-stage1-provider-refresh.md` without expanding the corpus.
   - **Profile Feature Availability UI:** Updated `ProviderProgramCard.astro` to render canonical `availability_state`, `geographic_restriction.notes`, and `feature_availability` items with status badges (`Generally available`, `Early access`, `Announced`) so researched capabilities are visible on provider profiles.
3. **Usability Enhancement (Finder → Comparison Bridge):** Added a one-click **Compare top N side by side →** action in `FinderExperience.astro` that links the user's top Finder matches directly to `/providers/?compare=...#comparison-title`, and updated `ProviderComparison.astro` to auto-open the comparison table when loaded with `?compare=` URL parameters.
