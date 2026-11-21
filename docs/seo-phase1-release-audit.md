# FundraisingDirectory.net SEO Phase 1 release audit

Audit date: October 27, 2026 (America/New_York). Scope: current uncommitted implementation on `codex/ga4-event-delivery` at `e5e619fdb34a00e38e4372b327bf9ecfe5031a13`.

## Release assessment: CONDITIONAL GO

The content and linking changes are suitable to progress to an isolated preview review. They are **not an unconditional production release approval**. The sitemap and rendered indexability signals agree, all known indexable pages are reachable through HTML links, and the expanded guides improve on the old discovery placeholders. No critical rendering or routing defect was found in the audited output.

Release conditions:

1. **Approve URL-level indexing dispositions.** Review the 22 proposed noindex URLs against the original Hark URL list, Search Console page/query exports, existing indexed URLs, and any available backlink/landing-page evidence. Alternatively, explicitly accept the documented uncertainty for each affected URL. Absence of these exports does not establish zero impressions or zero historical value. Do not release a blanket noindex decision merely because a Markdown file is absent.
2. **Isolate the SEO change set from the unrelated GA4 patch** using the preservation-first procedure below. The current working tree contains both projects. Do not deploy it wholesale as an SEO-only release.
3. **Validate the isolated release candidate in a fresh build and deployment preview.** This audit deliberately did not rebuild or generate files. The existing build was inspected and its read-only checks rerun; it is not a substitute for a cold build of the eventual isolated candidate. Verify the deployed Worker and asset routing there as well.

The content improvements do not demonstrate that Google will index these pages, that 500 words is a quality threshold, or that domain age/backlinks are the proven cause of the reported exclusions. No Search Console requests, submissions, commits, pushes, merges, deployments, branch separation, or implementation edits were performed in this audit. This report is the only new file authorized and created.

## Evidence and validation boundaries

Evidence inspected:

- All 39 historical route definitions, both historical versions of that route file in local Git history, the generated historical corpus, the Worker, shared navigation/layout, the 15 complete Markdown guides, 47 provider records, sitemap code, validators, and every existing uncommitted path.
- Existing `dist/`: 97 HTML documents, its XML sitemap, metadata, anchor links, and generated provider links. Its status artifact identifies commit `e5e619fd`, build time `2026-10-27T04:38:25.224Z`, and location `development`. Its prior build log reports success; the prior full test log reports 95/95 passing. Those logs are prior-run evidence, not a fresh release build performed by this audit.
- A fresh read-only GET of the public production sitemap and robots.txt. Production currently has 94 sitemap URLs and `Allow: /`. Browser search retrieval could not fetch the site; direct public HTTP retrieval succeeded. No credentials or Search Console access were used.
- Browser checks against the existing local server at `http://localhost:4340`: hub, Coffee guide, Giving Bean profile, and Band guide; responsive widths 390, 820, 1280, and 1440; mobile keyboard focus/current state and category navigation; no warnings/errors in the sampled browser console. No screenshots or other audit artifacts were saved.
- Fresh read-only checks: `node scripts/validate-topic-seo.mjs` passed; `node --test worker/index.test.js tests/topics.test.js` passed 12/12; `node --test tests/analytics.test.js` passed 4/4; `git diff --check` passed. These inspected tests do not write project files.

There was no fresh Google indexing/performance export, external backlink export, independent Wayback inventory, or original Hark URL list. Local remote-tracking refs were inspected without fetching; the production sitemap was checked independently. The existing dev server was reused; no server was started or stopped for this audit.

## Findings and priorities

| ID | Priority | Finding and evidence | Recommendation / release effect |
|---|---|---|---|
| F1 | P1 — release condition | `src/data/discovery.ts:84` and `src/pages/[legacy].html.astro:13` equate the existence of a guide entry with indexing eligibility. All 22 remaining topics change from the default indexable shell to noindex, without URL-level performance evidence. Twenty-one disappear from the production sitemap; Capital Campaigns was already absent. | Human approval of the per-URL dispositions is required before release. Prefer an explicit, reviewed publication/indexing decision rather than file presence alone. An accidentally removed guide would currently become noindex and still satisfy the dynamically derived validator. |
| F2 | P1 — release condition | Two unrelated dirty GA4 files sit beside the SEO changes on a branch named for GA4. Nothing is staged, and no SEO commits exist. | Isolate the 30 SEO implementation/documentation files, plus this report if desired, without moving or discarding the GA4 work. See branch procedure. |
| F3 | P2 — relevance | The newly comprehensive hub promotes inherited discovery shells whose main CTA can be broader than the named topic. Cookbooks has zero exact product-sale/book matches and the directory deliberately falls back to all 47 providers. Fruit, bottled water, and eco-friendly routes use only generic product-sales filtering. | Correct or explicitly qualify these discovery promises; preserve noindex pending useful content. Do not substitute a technically valid 200 destination for a relevant match. See all 22 rows below. |
| F4 | P2 — editorial gate | `scripts/validate-topic-seo.mjs:45` declares a guide incomplete below 500 words. `src/content.config.ts:19` requires at least three providers, even when only one direct supplier is researched. | Replace length/quota proxies with substantive editorial review and honest direct-option/alternative distinctions. A shorter useful guide or one strong supplier should not fail purely on quantity. Do not lengthen text to satisfy this test. |
| F5 | P2 — similarity and intent | All 15 guides use the same five-section/two-paragraph cadence: budget, format, proceeds example, inclusion/workload, providers/record keeping. Wording is distinct, but several sport guides repeat the same decision framework. | Keep the topic-specific operational details; trim general cautions and repeated closing instructions. Add concrete, verified topic-specific comparisons where useful. This is editorial improvement, not evidence of a measured Google duplicate-content penalty. |
| F6 | P2 — consolidation candidates | Candy links to the noindexed Chocolate Bars shell; Discount Card links to the noindexed Coupon Book shell. Each shell currently repeats discovery navigation rather than adding useful detail. | Assess merges into the substantive parent guides after checking historical intent and URL-level evidence. The existing links work, but the destination experience is weak. Do not redirect automatically. |
| F7 | P2 — future date accuracy | Current dates are credible and deterministic. However, the max-of-related-guide dates cannot record a guide-link removal, title/category change, or other shared-template edit automatically. Removing the newest linked guide could make a derived date go backward unless a content date is deliberately updated. | Maintain explicit meaningful-update dates for such changes; document and test additions/removals separately. Do not replace the dates with build time. This is a future maintenance limitation, not false dates in this release. |
| F8 | P3 — semantics | On a guide such as Band, the ancestor `/ideas/` link receives `aria-current="page"`, although the actual page is the guide (`SiteHeader.astro:20–25`). Only the appropriate desktop/mobile copy is visible. | Prefer an ancestor/current-section indication such as `aria-current="location"`, reserving `page` for the exact destination. Visible highlighting otherwise works. |
| F9 | P3 — inherited redirect | Public HEAD checks show `http://www.fundraisingdirectory.net/` → `https://www.fundraisingdirectory.net/` → `https://fundraisingdirectory.net/` (two 301 hops). | Consider a direct apex-HTTPS redirect in the hosting configuration separately. No redirect setting was changed by Phase 1 or this audit. This does not block the content/linking release. |

No P0 issue was found. The two P1 items are release conditions; the P2/P3 items are not assertions of lost traffic. Review unknown SEO value rather than converting missing evidence into a negative ranking assumption.

## 1. Reconciled URL inventory

All root-relative URLs in this report are on `https://fundraisingdirectory.net` unless an explicit different origin is shown. “Indexable” describes local HTML/canonical eligibility, not confirmed inclusion in Google's index. “Legacy” describes the durable `.html` route family, not an HTTP redirect or a reason to remove a page.

### Why approximately 80 is not 37

The **live** production sitemap decomposes exactly as follows:

| Family | Live sitemap | Phase 1 sitemap | Explanation |
|---|---:|---:|---|
| Provider profiles | 47 | 47 | Independent `/providers/{slug}/` profiles, not topic guides. |
| Topic URLs | 36 | 15 | Twenty-one previously listed discovery shells are removed by the noindex policy. |
| General pages / hubs | 11 | 11 | Includes both historical resource/guide hubs. |
| Total | **94** | **73** | Phase 1 removes 21 sitemap entries; it does not remove 21 public routes. |

The live sitemap therefore has **83 provider-or-topic content URLs (47 + 36)**. A rough description of these as “about 80 topics” would explain most of the numerical discrepancy, **but that is an inference, not a verified statement about Hark's counting method**. The supplied 89 “discovered” URLs are an indexing-state count, not an independently enumerated set of 89 topic articles. The totals alone cannot assign each exclusion to a page family.

The hub's **37 topics = 15 expanded guides + 22 placeholders**. Its extra topic relative to the live sitemap is `/Capital-Campaigns.html`: a registered, rendered legacy route that production's sitemap predicate excludes. Both `/Fundraising-Resources.html` and `/Fundraising-Articles.html` are separate hubs and intentionally not counted among the 37 topics.

Local HTML output is **97 = 37 topics + 2 historical hubs + 47 profiles + 9 other indexable pages + 2 excluded HTML pages**. The 73 indexable documents all appear once in the new sitemap. The other 24 are the 22 noindexed topics, the noindexed internal workbench, and the 404 document.

Historical evidence has a specific limit: both committed versions of `legacyRoutes.js` (`c34d4ba`, August 24; `2d60021`, September 1) contain the same 39 route paths. The union is 39; no additional deleted topic paths were found in those versions or in historical `src/pages` filenames. `historicalUrlCorpus.js:13–19` generates its list from `legacyRoutes` plus `/`; it is **not an independent historical crawl**. Its coverage test is useful for declared-route handling but cannot prove the old site's full inventory was recovered. All provider provenance records have no independently populated legacy URL evidence. No evidence supports inventing approximately 43 missing topic names or declaring that they never existed. Obtain Hark's original URLs and join them to this inventory before closing that historical question.

### Homepage reachability

A crawl of actual generated `<a href>` elements, excluding canonical/CSS links and normalizing query parameters to their path, finds:

- `/` → `/ideas/` → every one of the 37 topic URLs, without executing JavaScript.
- All 73 indexable pages reachable: homepage at depth 0; 14 indexable destinations at depth 1; 58 at depth 2. No indexable orphan was found.
- The homepage directly links to four actual topics: `/Candy.html`, `/Cookie-Dough.html`, `/Discount-Card.html`, and `/Elementary-School-Fundraising.html`. Its other two `.html` links are the Resources and Guides hubs. Thus the older “six topic links” description mixed four topics with two hubs.
- The 15 guides also have 55 provider-profile links and 55 corresponding profile-to-guide links. Their 45 related-topic links resolve; two go to noindexed shells, as discussed in F6.

This confirms reachability for the known repository inventory. It cannot confirm coverage of unidentified URLs in an unavailable Hark/Google export.

### General pages, hubs, and exclusions

| URL | Classification / local behavior | Sitemap |
|---|---|---|
| `/` | Active homepage, indexable, self-canonical | Included |
| `/finder/` | Active finder, indexable, self-canonical | Included |
| `/providers/` | Active directory, indexable, self-canonical | Included |
| `/ideas/` | Active category hub, 37 topic links, indexable, self-canonical | Included |
| `/Fundraising-Resources.html` | Active legacy resource hub, indexable, self-canonical | Included |
| `/Fundraising-Articles.html` | Active legacy guide hub, indexable, self-canonical | Included |
| `/about/` | Active information page, indexable, self-canonical | Included |
| `/contact/` | Active information page, indexable, self-canonical | Included |
| `/for-providers/` | Active listing-request page, indexable, self-canonical | Included |
| `/privacy/` | Active information page, indexable, self-canonical | Included |
| `/disclaimer/` | Active information page, indexable, self-canonical | Included |
| `/internal/provider-intake/` | Existing internal workbench, noindex/follow, canonical intentionally disabled; noindex is not authentication | Excluded |
| `/404.html` / missing paths | Existing 404 document / genuine asset 404 handling. Document has noindex; its inherited canonical is `/404/`. Not a recovered topic or a recommended redirect destination. | Excluded |
| `/status` | Existing operational JSON endpoint; not an editorial page | Excluded |
| `/robots.txt` | Crawler instructions; allows crawling and advertises sitemap | Not an HTML entry |
| `/sitemap.xml` | Sitemap endpoint / generated XML | Not an HTML entry |

All 37 topic URLs are individually enumerated in the next two sections; all 47 profiles are enumerated in Appendix A. Together with the 13 HTML entries above, those lists account for all 97 generated HTML documents.

### Redirects and alternate URLs

| URL / family | Disposition and evidence |
|---|---|
| `http://fundraisingdirectory.net/` | Public HEAD: 301 to the canonical HTTPS apex homepage. |
| `http://www.fundraisingdirectory.net/` | Public HEAD: 301 to HTTPS www, which then 301s to the apex. Inherited two-hop chain. |
| `https://www.fundraisingdirectory.net/` | Public HEAD: 301 to HTTPS apex homepage. |
| Historical route variants | For **each of the 39 declared `.html` routes**, extensionless `/{route}`, extensionless `/{route}/`, `/{route}.html/`, and noncanonical letter-case variants map by 301 directly to the correctly cased `/{route}.html`, preserving query parameters. These are variants of the listed documents, not extra topics. Worker tests cover the full declared list. Arbitrary unknown paths are not redirected to the homepage. |
| Canonical historical `.html` URLs | Served through an internal asset-directory lookup. The internal `/Route.html/` asset lookup is not an additional public canonical URL or an external redirect of the correct `.html` address. |
| `/providers/?product=snacks` | Known Search Console alternate; canonicals collapse it to `/providers/`. It is an interactive filter state, not a separate topic page; omitted from sitemap. |
| Other observed `/providers/?…` URLs | 58 distinct internal filter URLs were found in generated anchors, enumerated in Appendix B. All share the directory's `/providers/` canonical and are excluded as separate sitemap entries. Arbitrary filter combinations form no finite editorial inventory. |
| Search Console's other redirect/404 rows | Snapshot says five redirect rows and one 404 row, but does not enumerate their exact URLs. Only the three homepage variants above can be identified precisely from the supplied information and public checks. The additional rows and the 404 require the export; validation started does not identify their paths or establish resolution. |

## 2. All 22 noindexed placeholders

**Current implementation:** each URL remains rendered at its durable legacy address, with a self-canonical, `noindex, follow`, and no sitemap entry. They are not redirects or deleted pages. All 22 are linked from `/ideas/`. Twenty-one were in the live production sitemap; Capital Campaigns was not. The source currently applies noindex because no corresponding `topics` collection entry exists, **not because URL-level historical value has been measured**.

**Common current content (C):** a topic title/description and visual, a generic “Useful ways to move forward” paragraph, navigation to a filtered directory or all providers, ideas, product fundraising, online fundraising, guides, and the directory disclaimer. There is no topic-specific planning body or individually selected provider list. Approximate main-content counts of 110–119 words describe what exists; they are not a quality cutoff.

**Evidence key:** `L` means a declared route in the committed historical route list since August 24, 2026. It does not establish old backlinks, traffic, rankings, or historical article content. For **every row**, URL-specific impressions, clicks, current Google indexing, backlinks, and archival content are unknown. All recommended indexing changes or redirects remain **provisional human decisions**. Keeping a temporary noindex is an editorial recommendation, not a claim of zero SEO value.

**Links key:** `I` = inbound from `/ideas/`; additional incoming article links are named explicitly. `D` = the `/providers/` destination shown in the row. `C-links` = `/ideas/`, `/providers/?method=product-sales`, `/providers/?method=crowdfunding`, `/Fundraising-Articles.html`, and `/disclaimer/`, deduplicated where already used as D. The hero and action list usually repeat D. There are no individual provider-profile recommendations on these shells.

| URL | Current content | Reason for noindex | Historical / SEO evidence | Internal links | Recommendation / human review |
|---|---|---|---|---|---|
| `/Christian-Fundraising.html` | C; 111 words; church, ministry, mission, and Christian-school description | No authored guide; broad overlap with Church and school guides | L; live-sitemap entry; distinct school/ministry intent possible, metrics unknown | I; D=`?group=churches-faith`; C-links | **Investigate.** Do not merge automatically into Church: the existing description also includes Christian schools. Review intent and evidence first. |
| `/Hockey-Fundraising.html` | C; 115 words; generic team guidance only | No authored guide or hockey-specific choices | L; live-sitemap entry; distinct sport intent, unmeasured | I; D=`?group=sports-athletics`; C-links | **Improve/index.** Useful hockey-specific season, equipment, and travel planning could justify a standalone guide; approve disposition and research before indexing. |
| `/Lacrosse-Fundraising.html` | C; 115 words; team/league description | No authored guide; same sports shell | L; live-sitemap entry; not evidence of low demand | I; D=`?group=sports-athletics`; C-links | **Retain noindex temporarily.** Preserve URL and review metrics; improve if useful distinct coverage can be maintained. Do not merge solely because it is another sport. |
| `/Boy-Scout-Fundraising.html` | C; 115 words; display title “Scouting Fundraising” | No authored guide; no unit-specific guidance | L; live-sitemap entry; historical spelling retained; actual legacy equity unknown | I; D=`?group=youth-organizations`; C-links | **Investigate.** Verify current organization terminology and official approval constraints before writing or redirecting. Preserve historical path pending review. |
| `/FFA-Fundraising.html` | C; 116 words; agriculture/chapter description | No authored guide or chapter-specific plan | L; live-sitemap entry; distinct educational intent possible | I; D=`?group=youth-organizations`; C-links | **Improve/index.** Research chapter/project and competition needs, without implying official endorsement of general vendors. Human review required. |
| `/Candles.html` | C; 113 words; product description, one exact supplier in current taxonomy | No authored guide or product logistics | L; live-sitemap entry; current match is Fundraising.com; history unknown | I; D=`?method=product-sales&product=candles`; C-links | **Improve/index.** Can be useful with verified ordering, delivery, and product facts; one good direct supplier is preferable to three weak matches. |
| `/Coupon-Book.html` | C; 114 words; same product taxonomy as Discount Card | No authored guide; obvious overlapping coverage | L; live-sitemap entry; SaveAround matches; historical value unknown | I and `/Discount-Card.html`; D=`?method=product-sales&product=discount-cards-coupon-books`; C-links | **Merge/redirect candidate** to `/Discount-Card.html`, only after ensuring book-specific intent is fully served and reviewing URL evidence. Otherwise improve separately. |
| `/Cookbooks.html` | C; 112 words; no cookbook production/publishing guidance | No authored guide; misleadingly broad educational-book taxonomy | L; live-sitemap entry; no exact product-sales/book provider; not proof of zero demand | I; D=`?method=product-sales&product=books-educational`; C-links. Zero exact matches triggers all-47 fallback. | **Investigate.** Research real cookbook publishing suppliers; fix/qualify the match promise. Do not redirect to unrelated food or school content. |
| `/Fundraising-Consultants.html` | C; 112 words; strategy/campaign support description | No authored service-selection guidance | L; live-sitemap entry; Graham-Pelton is a relevant existing record | I; D=`?product=fundraising-consulting`; C-links | **Improve/index.** A researched consultant-selection guide could serve a distinct need. Explain scope and limits, with quoted terms only when verified. |
| `/Fundraising-Software.html` | C; 112 words; broad software/CRM description | No authored comparison; CTA covers crowdfunding only | L; live-sitemap entry; software intent is broader than the selected taxonomy | I; D=`?product=crowdfunding-platform`; C-links | **Improve/index.** Compare actual software purposes; include relevant donation/event/grant tools where researched. Do not equate all fundraising software with crowdfunding. |
| `/Educational-Resources.html` | C; 115 words; school resource description | No authored resource collection; overlap with school and resource hubs | L; live-sitemap entry; intended historical scope unknown | I; D=`?group=schools`; C-links | **Investigate.** Determine whether a school resource hub or a consolidation is the right replacement; neither Elementary School nor general Resources is automatically equivalent. |
| `/Girl-Scout-Fundraising.html` | C; 118 words; troop/council/trip description | No authored guide or organization-specific constraints | L; live-sitemap entry; organization-specific intent warrants care | I; D=`?group=youth-organizations`; C-links | **Investigate.** Obtain official current program/approval guidance before recommending outside programs or a replacement route. No generic-provider endorsement is established. |
| `/FBLA-Fundraising.html` | C; 116 words; competition/travel description | No authored chapter-specific guidance | L; live-sitemap entry; competition intent exists, performance unknown | I; D=`?group=youth-organizations`; C-links | **Retain noindex temporarily.** Preserve path; review query/backlink evidence and develop distinct competition planning if justified by user needs. |
| `/FCCLA-Fundraising.html` | C; 116 words; student program/travel description | No authored chapter-specific guidance | L; live-sitemap entry; not demonstrated interchangeable with FBLA/FFA | I; D=`?group=youth-organizations`; C-links | **Retain noindex temporarily.** Review evidence individually; do not consolidate organizations merely because the present shells look alike. |
| `/Fire-Department-Fundraising.html` | C; 119 words; volunteer department/community description | No authored department-specific plan | L; live-sitemap entry; distinct audience but no measured equity | I; D=`?group=clubs-community`; C-links | **Improve/index.** Develop a useful audience-specific guide with verified provider eligibility and approved financial arrangements. |
| `/Field-Hockey-Fundraising.html` | C; 119 words; generic school/club sports text | No authored guide; no field-hockey-specific decisions | L; live-sitemap entry; different user intent from ice hockey may matter | I; D=`?group=sports-athletics`; C-links | **Retain noindex temporarily.** Human evidence review; do not redirect to Hockey based only on a shared word. |
| `/Gymnastics-Fundraising.html` | C; 116 words; generic gym/team description | No authored guide or team/club distinction | L; live-sitemap entry; audience differences unmeasured | I; D=`?group=sports-athletics`; C-links | **Retain noindex temporarily.** Preserve URL; evaluate a distinct club/meet/travel guide after evidence review. |
| `/Capital-Campaigns.html` | C; 118 words; facility/major-project description | No authored long-term campaign guidance | L; rendered route, but already omitted from production sitemap; no independent historical proof | I; D=`/providers/` without a meaningful campaign filter; C-links | **Improve/index.** A consultant-backed guide would serve distinct intent; generic product/online shortcuts are insufficient. Review before indexing; this is the one noindex URL not removed from the live sitemap. |
| `/Bottled-Water.html` | C; 112 words; event/product description | No authored guide or identified water-specific supplier | L; live-sitemap entry; no specific supplier established by CTA | I; D=`?method=product-sales`; C-links | **Retain noindex temporarily.** Clarify lack of a direct match; review URL evidence and product/event requirements before expansion. |
| `/Chocolate-Bars.html` | C; 116 words; same candy/chocolate filter as Candy | No authored guide; substantive overlap with Candy | L; live-sitemap entry; two matching candy providers; equity unknown | I and `/Candy.html`; D=`?method=product-sales&product=candy-chocolate`; C-links | **Merge/redirect candidate** to `/Candy.html`, after confirming chocolate-bar intent and historical signals are adequately served. No redirect executed. |
| `/Fruit.html` | C; 111 words; generic seasonal-product description | No authored guide or fruit-specific match | L; live-sitemap entry; seasonality does not prove demand or equity | I; D=`?method=product-sales`; C-links | **Investigate.** Find actual fruit-program evidence and assess the historical URL; do not imply generic vendors sell fruit or redirect to unrelated products. |
| `/Eco-Friendly.html` | C; 110 words; environmental theme placed under Products | No authored sustainability guidance; product-only CTA misses reuse methods | L; live-sitemap entry; potential distinct theme, no verified environmental claims | I; D=`?method=product-sales`; C-links | **Improve/index.** Research collection/reuse options such as existing shoe, clothing, and cartridge programs; substantiate environmental claims rather than equating products with sustainability. |

These are recommendations for the next authorized implementation/review, not changes made during this audit. None of the 22 should be treated as permanently rejected solely because no guide file currently exists.

## 3. Review of all 15 expanded guides

Each row below is an **active indexable legacy topic**, included in the local sitemap, self-canonical, linked from the hub, and linked back from each provider in its frontmatter. All original public paths are retained. No new topic URL or provider fact record was introduced.

Overall findings:

- Wording is natural and grammatically sound. No exact repeated sentence of ten or more words was found between authored guide bodies. That mechanical check is only evidence about literal duplication; it does not demonstrate original expertise, sufficient depth, or ranking quality.
- Several contextual details add useful differentiation: school-wide participation versus teacher resources, band rehearsal/volunteer succession, baseball inventory at games, basketball activity measurement, Catholic school/parish coordination, and food-order temperature/ingredient questions.
- The common five-section pattern and recurring “ask for written terms / estimate net proceeds / be inclusive / keep records” advice dominate many pages. Readers would benefit from shorter shared cautions and more topic-specific comparisons. The ten audience guides in particular are plausible planning introductions rather than deep researched operating manuals.
- The same provider summaries repeat across pages intentionally as factual cards. This is normal reuse; do not count those cards as unique editorial reporting. No byline, fresh field testing, or personal experience is claimed; do not add fabricated expertise.
- No industry-standard margin, guaranteed earning rate, affiliate commission, or guaranteed provider outcome is asserted in the new guides. All fifteen numerical examples are introduced as hypothetical/illustrative, and the arithmetic is correct. Several examples use a notional net amount per order; they must remain labeled assumptions, not be promoted into snippets or comparison rates.
- Direct suppliers and adjacent alternatives are distinguished in the product prose and the shared “Providers and alternatives” heading. This is honest, but a three-card minimum is not evidence of three matched suppliers. Category-level suggestions do not establish exact product availability or organizational eligibility.

| Active URL / source | Useful distinct material | Provider relevance / limitations | Editorial recommendation |
|---|---|---|---|
| `/Elementary-School-Fundraising.html` — `elementary-school.md` | School calendar, inclusive activities, classroom project versus PTO funds | Booster, Read-A-Thon, Charleston Wrap fit different school formats. DonorsChoose's public-school teacher/resource restriction is correctly stated. | Retain indexable. Best differentiated audience guide; shorten general financial-control advice if adding concrete comparisons. |
| `/High-School-Fundraising.html` — `high-school.md` | Student leadership, adult account control, graduating organizer handover | Snap! Raise, Bonfire, 99Pledges, Fundraising.com are relevant general activity providers. | Retain indexable. Differentiate further from Band and sport guides using actual school activity decisions. |
| `/Catholic-School-Fundraising.html` — `catholic-school.md` | Parish/school calendars, recipient account, family-credit caution | RaiseRight, Charleston Wrap, Giving Bean, Booster have school/faith fits in records; no diocesan approval or guaranteed tuition credit is claimed. | Retain indexable. Human editorial review of institution-specific policy framing; do not invent legal/tax rules. |
| `/Church-Fundraising.html` — `church.md` | Ministry purpose, ordinary giving versus a project, hospitality/workload | Giving Bean, Bonfire, RaiseRight, Givebutter are plausible choices for the stated formats. | Retain indexable. Clarify distinctions from the Christian placeholder before any consolidation. |
| `/Baseball-Fundraising.html` — `baseball.md` | Tournament deposit timing, game-day distribution, shared league audience | 99Pledges, Snap! Raise, Double Good, Bonfire are general team options, not baseball endorsements. | Retain indexable. More baseball-specific format examples would reduce overlap with other team guides. |
| `/Basketball-Fundraising.html` — `basketball.md` | Shooting-challenge measurement, variable-pledge limits, gym staffing | Same four general options as Baseball; no false sport-specific program claim. | Retain indexable. Preserve the measurable-activity detail; trim interchangeable campaign setup text. |
| `/Football-Fundraising.html` — `football.md` | Program/booster scope, alumni outreach, unique households versus roster count | Snap! Raise, Fundraising.com, SaveAround, Bonfire fit different approaches. | Retain indexable. Add verified comparison details as research allows; avoid assuming roster size predicts revenue. |
| `/Cheerleading-Fundraising.html` — `cheerleading.md` | Competition deposits, practice capacity, event-date apparel delivery | Double Good, Bonfire, Custom Ink Fundraising, Snap! Raise have general team/apparel fits. | Retain indexable. Two apparel choices are relevant, but compare their differences instead of adding repetitive cautions. |
| `/Band-Fundraising.html` — `band.md` | Rehearsal/concert pickup conflict, instruments, student succession | Snap! Raise, Giving Bean, Bonfire, Fundraising.com match arts/groups and the chosen formats. | Retain indexable. Useful operational angle; reduce overlap with High School and Catholic School budget/credit discussion. |
| `/4-H-Fundraising.html` — `4-h.md` | Learning roles, local approval, explicit no-partnership/endorsement claim | Fundraising.com, Giving Bean, Bonfire, Double Good are general options. Their listing is not proof that a particular club may use them. | Retain indexable after human review of local-program framing. Link official guidance when researched; no official authorization was established by this guide. |
| `/Cookie-Dough.html` — `cookie-dough.md` | Handling instructions, temperature/pickup planning, allergy questions | Fundraising.com is the only researched direct cookie option in the list. Charleston Wrap and Double Good are explicitly catalog/popcorn alternatives. | Retain indexable. Research additional direct options only if useful; do not label alternatives as cookie suppliers. |
| `/Candy.html` — `candy.md` | Unsold-stock cash example, stock reconciliation, venue rules | World's Finest Chocolate and Fundraising.com are direct candy options. Double Good is explicitly a popcorn alternative. | Retain indexable. Candidate destination for Chocolate Bars after evidence review. |
| `/Coffee.html` — `coffee.md` | Local distribution versus shipping, product form, campaign attribution | Giving Bean is directly matched in current records. Charleston Wrap and Fundraising.com are labeled broader alternatives. A current official Fundraising.com page also links to coffee programs, but that capability is not yet in this record's product taxonomy. | Retain indexable. Refresh the canonical provider record before promoting newly observed coffee capabilities; investigate a more useful direct comparison. |
| `/Gift-Wrap.html` — `gift-wrap.md` | Fulfillment deadline versus sale-close date, product mix and seasonal expectations | Charleston Wrap is the stated direct starting point; existing record supports gifts/catalogs, but a specific current gift-wrap range could not be independently rechecked because the official page timed out. Fundraising.com is seasonal/catalog; Bonfire explicitly apparel alternative. | Retain indexable with product-availability qualification. Verify the specific gift-wrap offering during the next source refresh; do not infer it solely from a brand name. |
| `/Discount-Card.html` — `discount-card.md` | Geographic usefulness, redemption restrictions, buyer value versus group proceeds | SaveAround provides books/digital passes, not proof of a custom physical card program. RaiseRight and GroupRaise are correctly described as different spending-linked approaches. | Retain indexable. Clarify cards versus books/passes in headings and evaluate the Coupon Book merge. |

### Quantitative examples

Arithmetic checked: Elementary 120 × $15 = $1,800; High School 100 × $8 = $800 and a $400 gap to $1,200; Catholic School 160 × $15 = $2,400; Church 60 × $15 = $900; Baseball $1,500 ÷ 15 = $100; Basketball 80 × $20 = $1,600 gross; Football 200 × $15 = $3,000; Cheerleading 125 × $16 = $2,000; Band $1,800 ÷ $12 = 150; 4-H 60 × $10 = $600; Cookie Dough 100 × $9 = $900; Coffee 80 × $7 = $560; Gift Wrap 90 × $11 = $990; Discount Card 75 × $12 = $900. Candy correctly distinguishes full-sale proceeds from cash remaining when some purchased inventory is unsold.

These are modeling assumptions, not verified typical outcomes. There are no new numeric commission or profit-percentage claims in the guide bodies. Reusing an illustrative dollar amount as a “typical margin” would create an unsupported claim; the current text does not do that.

### Provider source traceability

The 55 guide placements resolve to 16 active, nondeleted provider records, all with `affiliation.type: none`. Each profile exposes its source list and last-research date. That supports traceability of reused claims; it is not a claim that all 16 providers were freshly reverified today. Existing source-check dates range from August 24 to September 20.

| Provider | Record research date | Primary source example / audit note |
|---|---|---|
| 99Pledges | 2026-09-20 | [School fundraising](https://schools.99pledges.com/); record also cites help articles for activity campaigns and payout. |
| Bonfire | 2026-09-20 | [Nonprofit fundraising](https://www.bonfire.com/fundraising/nonprofits/); record contains pricing, fulfillment, and payout sources. |
| Booster | 2026-08-29 | [Recorded school source](https://www.choosebooster.com/elementary-school-fundraising) now redirects to [Boosterthon](https://boosterthon.com/), whose school support/activity description corroborates the broad guide claim. Refresh external identity/link data separately if appropriate. |
| Charleston Wrap | 2026-08-29 | [Recorded school/group source](https://charlestonwrap.com/groups/school-student-groups/); fresh retrieval timed out. Record supports catalog/online/group fulfillment; exact current product availability remains a check, not a verified new fact. |
| Custom Ink Fundraising | 2026-09-20 | [How it works](https://www.customink.com/fundraising/how-it-works); fresh source supports apparel, optional donations, no upfront inventory, and fulfillment. No new fee/minimum amount was asserted. |
| DonorsChoose | 2026-09-20 | [Teachers](https://www.donorschoose.org/teachers) and [About](https://www.donorschoose.org/about); fresh teacher page supports project requests and provider purchase/shipment of goods. |
| Double Good | 2026-08-29 | [Youth organizations](https://www.doublegood.com/youth-organizations); fresh source supports online popcorn and direct shipping. Its advertised commercial terms were not inserted into the guides as typical margins. |
| Fundraising.com | 2026-08-24 | [Order-taker program](https://fundraising.com/order-taker-program); fresh source corroborates cookie dough/catalog choices and links coffee programs. Program-specific marketing rates still require context before reuse. |
| Givebutter | 2026-09-20 | [How it works](https://help.givebutter.com/en/articles/1726586-what-is-givebutter-and-how-does-it-work); existing record contains pricing/setup/payout sources. |
| Giving Bean | 2026-09-20 | [Webstore](https://givingbean.com/webstore-fundraising/) and [FAQ](https://givingbean.com/faqs/); fresh webstore retrieval returned 403. Do not interpret blocked retrieval as an inactive provider. |
| GroupRaise | 2026-09-20 | [Official site](https://www.groupraise.com/); record links location/event workflow and responsibility guidance. |
| RaiseRight | 2026-09-20 | [Organization setup](https://www.raiseright.com/resources/organization/starting-a-new-program/); record separately supports several purchase-linked methods. |
| Read-A-Thon | 2026-09-20 | [Program page](https://www.read-a-thon.com/info/landing_page/); record includes FAQ/terms. Guide uses the reading-activity concept without inventing an earnings rate. |
| SaveAround | 2026-09-20 | [Digital pass](https://savearound.com/pages/digital-pass); fresh source corroborates savings-pass format and onboarding-dependent terms. It does not establish that all merchant locations participate. |
| Snap! Raise | 2026-08-29 | [Team/club source](https://www.snapraise.com/engage/team-club-fundraising/); recorded research supports online school/team/activity campaigns. |
| World's Finest Chocolate | 2026-09-20 | [How it works](https://worldsfinestchocolate.com/fundraising/how-it-works); source-backed record describes specialist-led ordering, stock, and volunteer responsibilities. |

No evidence of fabricated affiliate relationships, fixed provider commissions, guaranteed school credits, official 4-H endorsements, dietary safety promises, or guaranteed delivery deadlines was found in the new guide copy. Provider confirmation language appropriately preserves uncertainty. General planning recommendations are editorial judgments, not sourced measurements of typical behavior.

## 4. Hub, accessibility, and destination audit

The six groups contain exactly 37 unique topic links: Schools and education 4; Sports and activities 9; Youth and community 7; Faith communities 2; Products 12; Planning and services 3. All destination files exist, the six category fragment IDs exist, and there are no duplicate hub IDs. Hubs and provider filters are not incorrectly added to the 37-topic count.

The grouping is understandable. Band under Sports and activities is defensible but Arts/music could be named more visibly. Eco-Friendly under Products is too narrow if the intended guidance includes reuse methods; this is a taxonomy/promise issue rather than a broken URL. The category code uses route-name regular expressions; acceptable for a small inventory, but new route names need classification review rather than assuming a correct default.

Metadata is correct in the audited output: one H1; `index, follow`; canonical `https://fundraisingdirectory.net/ideas/` without query or fragment; distinct title and description; shared Open Graph URL follows the canonical. No Article/ItemList JSON-LD was added; its absence is not an indexing defect or a release blocker.

At 390px the topic list is one column and category links wrap; at 820, 1280, and 1440px it uses two columns. There is no horizontal overflow at those widths. Mobile category links measured at least 44px high. Native links, labeled navigation, H2 category headings, visible underlines, and focus outlines are present. Mobile Tab/Shift+Tab and Escape were exercised; menu links showed 3px visible outlines and the current Ideas destination when the menu was open. Activating Products reached `#category-4`; the heading settled below the sticky header (approximately 198px from the viewport top, header about 59px). Reduced-motion rules in the shared stylesheet disable smooth scrolling/animations.

The directory↔guide path was exercised in the browser: Coffee → Giving Bean → Band. The profile's related guide list was appropriate to its actual placements. All 55 placements and their 55 backlinks were verified in generated HTML, not just sampled visually. Related links are relevant in broad subject matter; the two placeholder targets (Chocolate Bars and Coupon Book) are the exceptions in destination usefulness. Cross-linking a noindexed URL is not itself an HTTP or canonical error.

The hub is discoverable from the existing main navigation and footer on the homepage. Its topic anchors and all guide/provider backlinks are server-rendered HTML. The new content introduces no client framework, hydration, dependency, form submission, or provider outreach.

Limits: these checks establish representative usability and basic semantics, not full WCAG certification, assistive-technology coverage, automated contrast certification, or a Lighthouse performance score. A brief desktop current-section semantic improvement is noted in F8; mechanics of the header were otherwise reused.

## 5. Sitemap and modification dates

The audited local XML has **73 unique canonical HTTPS URLs** and no query/fragment entries. It contains exactly all 73 indexable HTML canonicals. All 22 noindexed historical topics, the internal workbench, the 404 document, and `/status` are excluded. The two historical hubs are listed once even though both the static base list and legacy eligibility predicate reference them; deduplication removes the repeated entries.

There are **63 lastmod values** and **10 intentionally undated entries**:

- All 15 newly authored guides use October 27, 2026; their significant new bodies justify that date.
- Each guide's date is the later of its editorial date and the recorded modification dates of provider summaries actually rendered on it.
- The 16 provider profiles receiving new guide backlinks use October 27, 2026, reflecting a real new link section, while their visible research dates remain the older source-check dates. This does not pretend the providers were re-researched on October 27.
- The other 31 provider entries retain their recorded provider modification dates (28 on September 20; three on October 14). The hub has October 27. Thus 32 entries are dated October 27 and 31 retain earlier dates.
- The undated URLs are `/`, `/finder/`, `/providers/`, both historical resource/guide hubs, `/about/`, `/contact/`, `/for-providers/`, `/privacy/`, and `/disclaimer/`. Omitting an unknown date is appropriate; not every sitemap URL needs a fabricated date.

A read-only recomputation matched all 63 emitted dates to the explicit source inputs. Audited sitemap SHA-256: `17af5f2a0bfd910274f48cdd339cdbe5508c63a9f93ad70dd11b5124a576fd71`.

The emitter does not call a current-time function, inspect filesystem mtime, or write dates to Markdown/provider records. Rebuilding the same content regenerates XML with the same dates by construction. The validator's `new Date()` only rejects future values; the separate `/status` buildTime is operational build identity and is not reused as sitemap lastmod. No source-date writer is present in the build command. **A repeat build was not executed**, because it would rewrite generated files contrary to this audit's scope; date stability was established from the emitter and recomputed data, not a claimed two-build experiment.

The max-date rule requires authoring discipline for future link removals, title changes, and shared layout/content changes (F7). The README already warns against build/mtime-based dates; extend that guidance to explicit dates for link removals and shared-content changes. The current validator checks well-formed dates and sitemap/robots consistency, but cannot prove that every manually entered date corresponds to a real edit.

Google's own guidance describes lastmod as meaningful when consistently accurate and tied to significant changes. A sitemap is a hint, not an indexing guarantee. See [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 6. Branch base, exact dirty paths, and safe isolation

### Git state

- Branch: `codex/ga4-event-delivery`, created from HEAD on October 16. It has no configured upstream and no new commits beyond the current local `main` / cached `origin/main`.
- HEAD, local `main`, cached `origin/main`, and `codex/ga4-consent` point to `e5e619fdb34a00e38e4372b327bf9ecfe5031a13` (“Complete consent-gated GA4 integration”). No remote fetch was performed.
- Local/cached `staging` points to `5550b776b1d437b503866d50e9461415d485debb`. It is an ancestor 11 commits behind HEAD, with no commits unique to staging. Its committed difference includes provider research/search/profile work, status metadata, analytics and consent infrastructure, and other already-integrated changes. Starting an SEO-only patch from this older staging baseline could omit needed work or create conflicts; do not silently reset to it.
- Before this report: **32 dirty files = 11 modified tracked files + 21 untracked files**. None are staged. **30 belong to SEO Phase 1; two are unrelated GA4 work.** After this report is added there are 33 dirty paths, with this report the sole audit-created file.

### Modified tracked SEO files (9)

| Exact path | Change |
|---|---|
| `README.md` | Topic authoring, indexing rule, lastmod workflow, external follow-up. |
| `package.json` | Adds topic SEO validator to the existing build command; no dependency change. |
| `src/components/SiteHeader.astro` | Treats historical topics as Ideas descendants; removes inherited provider-child selection for those pages. |
| `src/content.config.ts` | Adds validated Markdown topics with route, date, provider, and related-route references. |
| `src/data/discovery.ts` | Replaces taxonomy-based sitemap eligibility with guide-presence/hub eligibility. |
| `src/pages/[legacy].html.astro` | Loads guide entries, renders TopicGuide, and applies noindex to remaining placeholders. |
| `src/pages/ideas.astro` | Replaces short information page with full categorized topic hub. |
| `src/pages/providers/[slug].astro` | Derives related-guide backlinks and includes shared topic styles. |
| `src/pages/sitemap.xml.ts` | Uses topic publication set, unique URLs, and recorded/derived modification dates. |

### New SEO files already present before this audit (21)

| Exact path | Purpose |
|---|---|
| `docs/indexing-review.md` | Implementation account and external follow-up list. |
| `scripts/validate-topic-seo.mjs` | Generated-output sitemap/canonical/links checks, including the problematic length proxy. |
| `src/components/TopicGuide.astro` | Shared Markdown article, provider cards, and related topics. |
| `src/content/topics/4-h.md` | 4-H guide. |
| `src/content/topics/band.md` | Band guide. |
| `src/content/topics/baseball.md` | Baseball guide. |
| `src/content/topics/basketball.md` | Basketball guide. |
| `src/content/topics/candy.md` | Candy guide. |
| `src/content/topics/catholic-school.md` | Catholic School guide. |
| `src/content/topics/cheerleading.md` | Cheerleading guide. |
| `src/content/topics/church.md` | Church guide. |
| `src/content/topics/coffee.md` | Coffee guide. |
| `src/content/topics/cookie-dough.md` | Cookie Dough guide. |
| `src/content/topics/discount-card.md` | Discount Card guide. |
| `src/content/topics/elementary-school.md` | Elementary School guide. |
| `src/content/topics/football.md` | Football guide. |
| `src/content/topics/gift-wrap.md` | Gift Wrap guide. |
| `src/content/topics/high-school.md` | High School guide. |
| `src/data/topics.ts` | Topic categories, hub date, path helper, topic-route selection. |
| `src/styles/topics.css` | Shared article/hub/provider-link styles and mobile grid. |
| `tests/topics.test.js` | Read-only route/date/reference consistency tests. |

### Unrelated modified files (2): retain separately

| Exact path | Actual change | Isolation decision |
|---|---|---|
| `src/lib/analytics.ts` | Changes the gtag queue shim from rest-argument arrays to an `arguments` object in `dataLayer.push(arguments)`. | GA4 event-delivery fix, not required by topic SEO. Preserve on its own branch/change set. |
| `tests/analytics.test.js` | Adds two assertions that queued gtag entries are Arguments objects rather than arrays. | Regression coverage for that GA4 fix; keep with the analytics source. Four analytics tests passed in this audit. |

The committed analytics/consent infrastructure already in HEAD is the common baseline, not an uncommitted SEO addition to strip out. No provider YAML, Worker routing file, deployment configuration, lockfile, or existing global stylesheet is dirty. Shared-header edits are SEO/navigation work even though the file also contains unrelated existing behavior.

### Proposed separation — NOT EXECUTED

1. Record HEAD and a complete path/hash manifest. Save separate binary-safe tracked diffs for the nine SEO paths and two GA4 paths; separately back up all 21 untracked SEO files and this report. A tracked `git diff` alone does not preserve untracked files. Verify the backup before any cleanup.
2. Create a separate checkout/worktree on a new `codex/seo-phase1` branch at the agreed current release base, preferably the inspected `e5e619f` baseline after checking the current remote/staging policy. Leave this checkout and all its dirty files in place while preparing the isolated copy. Reconcile staging's older baseline deliberately with the owner; do not mix an unrelated staging update into SEO.
3. Apply only the SEO tracked patch and copy only the 21 SEO additions, plus this audit if part of review. Do not copy the two GA4 dirty files. Confirm those two paths equal the chosen baseline in the new checkout, and confirm every SEO file byte-for-byte against the backup.
4. Build, test, and review the isolated candidate and its preview, including production-style canonical/Worker handling. Confirm the final diff contains only the intended SEO paths and approved disposition changes. Preserve the GA4 pair together in the original checkout or a separately approved analytics checkout.
5. Only after a verified copy and explicit approval consider cleaning duplicate SEO edits out of the original checkout. Never use blanket reset/clean, switch a dirty tree to an older baseline, apply a whole mixed patch, or rely on a stash of tracked files to preserve these additions. No cleanup or branch operation is necessary to deliver this audit.

This procedure is a proposal, not an authorization to commit, branch, push, or deploy. Nothing in it was executed.

## 7. Release follow-up and unresolved evidence

Before production approval, the owner should resolve the original URL-count/export question and accept or revise the 22 URL decisions, then review a clean isolated candidate. In particular, check whether any of the proposed noindex/merge candidates are among the five currently indexed URLs or carry meaningful queries/backlinks. Do not infer that those five URLs are the homepage and four known guides; their identities were not supplied.

Recommended next implementation work after authorization: qualify misleading discovery destinations, replace the word-count and forced-card minimums as quality gates, review the two possible consolidations, refresh narrow product/provider matching, and document explicit date handling for deletions/shared changes. Improve additional topics based on reader usefulness and evidence, not merely a fixed number of pages or words.

After an approved deployment, external follow-up may include inspection and sitemap resubmission, but none was performed here. Earned-link outreach remains a separate activity requiring an approved message and recipient; it is not a code release task. There is no evidence for a guaranteed 2–6 week indexing outcome.

References: [people-first content and word-count guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [accurate sitemap dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and [effects and crawl requirements of noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing). These support the review criteria; they do not diagnose this site's specific historical Google decisions.

## Appendix A. All 47 provider-profile URLs

All entries below are active, nondeleted, locally indexable, self-canonical, and included in both production's retrieved sitemap and the Phase 1 sitemap. They are provider profiles, not missing topic guides. “Guide backlink” means the new related-guide section is rendered; its absence does not make the profile orphaned because the directory links to every active profile.

| URL | Provider | New guide backlinks |
|---|---|---|
| `/providers/99pledges/` | 99Pledges | `/Baseball-Fundraising.html`, `/Basketball-Fundraising.html`, `/High-School-Fundraising.html` |
| `/providers/betterworld/` | BetterWorld | None; active directory link retained |
| `/providers/bonfire/` | Bonfire | `/4-H-Fundraising.html`, `/Band-Fundraising.html`, `/Baseball-Fundraising.html`, `/Basketball-Fundraising.html`, `/Cheerleading-Fundraising.html`, `/Church-Fundraising.html`, `/Football-Fundraising.html`, `/Gift-Wrap.html`, `/High-School-Fundraising.html` |
| `/providers/booster/` | Booster | `/Catholic-School-Fundraising.html`, `/Elementary-School-Fundraising.html` |
| `/providers/box-tops-for-education/` | Box Tops for Education | None; active directory link retained |
| `/providers/cars-vehicle-donation/` | CARS | None; active directory link retained |
| `/providers/charleston-wrap/` | Charleston Wrap | `/Catholic-School-Fundraising.html`, `/Coffee.html`, `/Cookie-Dough.html`, `/Elementary-School-Fundraising.html`, `/Gift-Wrap.html` |
| `/providers/chipotle-community-fundraising/` | Chipotle Community Fundraising | None; active directory link retained |
| `/providers/custom-ink-fundraising/` | Custom Ink Fundraising | `/Cheerleading-Fundraising.html` |
| `/providers/donorbox/` | Donorbox | None; active directory link retained |
| `/providers/donorschoose/` | DonorsChoose | `/Elementary-School-Fundraising.html` |
| `/providers/double-good/` | Double Good | `/4-H-Fundraising.html`, `/Baseball-Fundraising.html`, `/Basketball-Fundraising.html`, `/Candy.html`, `/Cheerleading-Fundraising.html`, `/Cookie-Dough.html` |
| `/providers/double-the-donation/` | Double the Donation | None; active directory link retained |
| `/providers/dutch-mill-bulbs/` | Dutch Mill Bulbs | None; active directory link retained |
| `/providers/eteamsponsor/` | eTeamSponsor | None; active directory link retained |
| `/providers/every-org/` | Every.org | None; active directory link retained |
| `/providers/fundingfactory/` | FundingFactory | None; active directory link retained |
| `/providers/fundraising-com/` | Fundraising.com | `/4-H-Fundraising.html`, `/Band-Fundraising.html`, `/Candy.html`, `/Coffee.html`, `/Cookie-Dough.html`, `/Football-Fundraising.html`, `/Gift-Wrap.html`, `/High-School-Fundraising.html` |
| `/providers/funds2orgs/` | Funds2Orgs | None; active directory link retained |
| `/providers/give-inkind/` | Give InKind | None; active directory link retained |
| `/providers/givebutter/` | Givebutter | `/Church-Fundraising.html` |
| `/providers/giving-bean/` | Giving Bean | `/4-H-Fundraising.html`, `/Band-Fundraising.html`, `/Catholic-School-Fundraising.html`, `/Church-Fundraising.html`, `/Coffee.html` |
| `/providers/globalgiving/` | GlobalGiving | None; active directory link retained |
| `/providers/gofundme/` | GoFundMe | None; active directory link retained |
| `/providers/graham-pelton/` | Graham-Pelton | None; active directory link retained |
| `/providers/grantstation/` | GrantStation | None; active directory link retained |
| `/providers/groupraise/` | GroupRaise | `/Discount-Card.html` |
| `/providers/help-hope-live/` | Help Hope Live | None; active directory link retained |
| `/providers/instrumentl/` | Instrumentl | None; active directory link retained |
| `/providers/krispy-kreme-fundraising/` | Krispy Kreme Fundraising | None; active directory link retained |
| `/providers/little-caesars-fundraising/` | Little Caesars Fundraising | None; active directory link retained |
| `/providers/onecause/` | OneCause | None; active directory link retained |
| `/providers/patronicity/` | Patronicity | None; active directory link retained |
| `/providers/pledge-it/` | Pledge It | None; active directory link retained |
| `/providers/raiseright/` | RaiseRight | `/Catholic-School-Fundraising.html`, `/Church-Fundraising.html`, `/Discount-Card.html` |
| `/providers/read-a-thon/` | Read-A-Thon | `/Elementary-School-Fundraising.html` |
| `/providers/savearound/` | SaveAround | `/Discount-Card.html`, `/Football-Fundraising.html` |
| `/providers/savers-fundrive/` | Savers FUNDrive | None; active directory link retained |
| `/providers/shopraise/` | ShopRaise | None; active directory link retained |
| `/providers/snap-raise/` | Snap! Raise | `/Band-Fundraising.html`, `/Baseball-Fundraising.html`, `/Basketball-Fundraising.html`, `/Cheerleading-Fundraising.html`, `/Football-Fundraising.html`, `/High-School-Fundraising.html` |
| `/providers/streamlabs-charity/` | Streamlabs Charity | None; active directory link retained |
| `/providers/supportnow/` | SupportNow | None; active directory link retained |
| `/providers/tiltify/` | Tiltify | None; active directory link retained |
| `/providers/waggle/` | Waggle | None; active directory link retained |
| `/providers/worlds-finest-chocolate/` | World's Finest Chocolate | `/Candy.html` |
| `/providers/yougivegoods/` | YouGiveGoods | None; active directory link retained |
| `/providers/zeffy/` | Zeffy | None; active directory link retained |

## Appendix B. Observed directory filter URLs

These are all 58 unique root-relative directory-filter URLs found in generated anchor elements. Each is an active query state whose canonical is `/providers/`; none is a separate sitemap/topic entry. The directory renders the full provider collection in static HTML and applies filtering in the browser. Product taxonomy availability is not proof that a specific supplier or product exists.

| URL | Classification |
|---|---|
| `/providers/?group=animal-rescue` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=arts-music-performance` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=booster-clubs` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=churches-faith` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=clubs-community` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=individuals-personal-causes` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=nonprofits-charities` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=pto-pta` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=schools` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=sports-athletics` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?group=youth-organizations` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=auctions` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=collection-reuse-fundraising` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=crowdfunding` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=direct-donations` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=events-activities` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=everyday-passive-fundraising` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=giving-matching` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=grant-seeking` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=in-kind-resource-fundraising` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=peer-to-peer` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=pledge-athon` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=books-educational` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=candles` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=candy-chocolate` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=coffee-beverages` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=cookie-dough-cookies` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=discount-cards-coupon-books` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=product-sales&product=gifts-seasonal` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=restaurant-business-partnerships` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?method=sponsorships` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=apparel-spirit-wear` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=auction-platform` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=baked-goods` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=books-educational` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=candles` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=candy-chocolate` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=card-linked-dining-rewards` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=coffee-beverages` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=cookie-dough-cookies` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=crowdfunding-platform` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=discount-cards-coupon-books` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=donation-platform` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=event-fundraising-platform` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=flowers-plants` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=frozen-prepared-foods` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=fundraising-consulting` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=gift-cards` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=gifts-seasonal` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=home-household` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=merchandise-online-store` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=peer-to-peer-platform` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=popcorn` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=shopping-rewards` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=snacks` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=text-mobile-giving` | Active filter / alternate canonical; excluded as separate sitemap URL |
| `/providers/?product=travel-booking-rewards` | Active filter / alternate canonical; excluded as separate sitemap URL |

The snapshot identifies `?product=snacks` specifically. The 58 observed variants are not 58 additional topic pages, and no attempt was made to enumerate all possible multi-filter combinations.

## Audit preservation check

The audit took an in-memory SHA-256 snapshot of all 216 existing tracked/untracked project files before writing the report. The final comparison verified **216 files unchanged, no deletions, and no unexpected additions**, excluding this permitted report. `docs/seo-phase1-release-audit.md` is the only added file. HEAD remains `e5e619fdb34a00e38e4372b327bf9ecfe5031a13`, the branch remains `codex/ga4-event-delivery`, and the index remains empty. No implementation file was patched, and no automatic fixes were applied.
