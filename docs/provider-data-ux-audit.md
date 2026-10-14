# FRD — V1 Provider Data → User Experience Audit

**Reviewer:** Independent UX & Architecture Audit  
**Corpus Analyzed:** 45 canonical providers, 63 programs, 159 authoritative sources  
**Scope:** Read-only audit across Provider Profiles, Directory/Results, Finder, Navigation/Taxonomy, and Comparison-Oriented User Journeys.  
**Date:** September 2026

---

## 1. Inventory of Canonical Provider Data

Inspection of `src/data/providerSchema.ts`, `src/data/taxonomies/*`, and representative YAML records in `src/content/providers/` reveals a hardened, expressive data model containing rich structured intelligence across 25 distinct dimensions. 

However, as shown below, the application's user-facing surfaces currently utilize only a small fraction of this inventory:

| Canonical Domain | Specific Structured Fields Available | Granularity | Presence Across Corpus |
|---|---|---|---|
| **Identity** | `name`, `slug`, `legal_name`, `aliases`, `website`, `fundraising_url`, `logo` | Provider | 100% have name/slug/website; ~40% have legal_name/aliases; **100% have logo: null** |
| **Descriptions** | `content.summary`, `content.how_it_works`, `content.best_for[]`, `content.considerations[]`, `program.summary` | Provider & Program | 100% populated |
| **Programs** | `id`, `name`, `slug`, `url`, `method`, `products_services[]`, `channels[]`, `online_ordering`, `fulfillment[]`, `inventory_model`, `upfront_cost`, `ease_to_raise`, `summary`, `beneficiary`, `economics_mode` | Program | 63 programs across 45 providers (14 providers have 2–4 distinct programs) |
| **Applicability & Organizations** | `classification.organizations[]` (11 controlled types: schools, pto-pta, sports-athletics, booster-clubs, churches-faith, nonprofits-charities, youth-organizations, clubs-community, college-university, animal-rescue, military-veterans) | Provider | 100% populated |
| **Beneficiary Types** | `beneficiary_types[]` (own-organization, own-project-or-program, individual-or-family, local-nonprofit-or-charity, national-nonprofit-or-charity, community-cause, open-or-unspecified-cause), plus `program.beneficiary` relationship object (`type`, `name`, `slug`, `official`) | Provider & Program | Extensively populated across Batch 1–4 records |
| **Causes & Activities** | `cause_areas[]` (11 areas), `activity_subtypes[]` (17 subtypes like restaurant-night, shoe-drive, readathon, fun-run, gala-event, etc.) | Provider & Program | Populated across Batch 1–4 records |
| **Methods & Capabilities** | `classification.methods[]` (11 controlled methods), `capabilities[]` (17 capabilities like donation-forms, recurring-giving, peer-to-peer-pages, auctions-mobile-bidding, online-store, etc.) | Provider & Program | Methods: 100%; Capabilities: extensively populated |
| **Outcomes** | `outcomes[]` (cash, supplies, equipment, technology, grants, sponsorship) | Provider & Program | Populated across Batch 1–4 records |
| **Geography** | `scope[]` (local, regional, us-nationwide, canada, international), `countries[]`, `states[]`, `regions[]`, `notes` | Provider | 100% populated |
| **Economics** | `status` (research state), `arrangements[]` with `type` (upfront-cost, platform-fee, processing-fee, transaction-fee, product-sale-profit, product-sale-margin, restaurant-give-back, proceeds, revenue-share, fixed-payout, minimum-payout, minimum-order, minimum-sales, other), `value` (exact amount, amount-range, exact percentage, percentage-range, quantity, quantity-range, variable description, tiered thresholds), `basis`, `conditions[]`, `caveats[]`, `notes[]` | Provider or Program (`economics_mode`) | Known across 40 newly ingested providers; detailed exact % and $ values documented |
| **Eligibility & Requirements** | `status`, `legal_status[]` (nonprofit, registered-nonprofit, tax-exempt, 501c3, school-or-education, other), `age_range`, `grade_range` (pre-k to postsecondary), `participation_requirements[]`, `minimum_group_size`, `minimum_order`, `minimum_sales`, `other_restrictions[]`, `editorial_summary` | Program | Known across 40 newly ingested providers |
| **Setup & Lead Timing** | `setup_lead_time` (exact, min, typical, max, unit in minutes/hours/days/weeks/months), `lead_time` | Program | Documented across Batch 1–4 providers |
| **Campaign & Duration** | `campaign_duration` (exact, min, typical, max, unit, open_ended) | Program | Documented across Batch 1–4 providers |
| **Fulfillment Timing** | `fulfillment_time` (min, typical, max, unit) | Program | Documented where applicable |
| **Funds Availability & Payout Timing** | `funds_available_time`, `payout_time` (duration ranges/exact values) | Program | Documented across Batch 1–4 providers |
| **Payout Schedules** | `payout_schedules[]` (`frequency`: monthly/quarterly, `delivery_method`: direct-deposit/check, `anchor`, `conditions[]`, `caveats[]`), `timing.notes[]` | Program | Documented across Batch 1–4 providers |
| **Logistics & Shipping** | `logistics.status`, `logistics.notes[]`, `program.fulfillment[]`, `inventory_model` | Program | Populated across Batch 1–4 providers |
| **Verification & Provenance** | `status` (lifecycle, verified dates), `verification` (level, review_status, completeness, sources[] with `url`, `title`, `checked_at`, `status`, `supports[]` claims mapping data paths), `provenance` (discovered_via, intake_origins, legacy) | Provider | 159 sources; claim paths mapped in Batch 1–4 |
| **Commercial Research** | `affiliate_status`, `affiliate_program_url`, `affiliate_network`, `commission_structure`, `cookie_duration_days`, `eligibility_requirements`, `internal_notes`, `affiliation` (type, disclosure_required), `editorial.featured` | Provider | Intentionally internal / regulatory compliance |

---

## 2. Audit of Provider Profile Pages

Evaluating the provider profile implementation (`src/pages/providers/[slug].astro`):

### Canonical Data Area Classifications

#### A — Clearly Exposed
1. **Provider Identity Name & Website Link:** Rendered prominently in the hero with an outbound CTA button (`Visit Provider ↗`).
2. **Lifecycle Status Badge:** `Active`, `Inactive`, etc., rendered cleanly in the hero.
3. **High-Level Descriptions:** `content.summary`, `content.how_it_works`, `content.best_for[]`, and `content.considerations[]` are rendered in designated sections.
4. **Target Organizations:** Rendered as clickable pill tags linking to filtered directory views (`/providers/?group=...`).
5. **Primary Methods:** Rendered as semantic tags linking to `/providers/?method=...`.
6. **Program Format & High-Level Operations:** Program channels (Format), basic upfront cost classification (`none`/`varies`/`required`), inventory model category (`no-inventory`/`preorder`/`upfront-inventory`), and whether online ordering is available (`Yes`/`No`).
7. **Geographic Scope Summary:** Rendered in quick facts and the "Where it operates" section.
8. **Affiliation / Advertising Disclosure:** Rendered in hero when required by FTC guidelines.
9. **Basic Verification Date:** "Last verified [Date]" rendered in the hero CTA and disclosure summary.

#### B — Partially Exposed
1. **Programs:** Rendered as cards in `programs-section`, but stripped down to 5 basic taxonomy attributes. Multiple programs appear as parallel cards, but their structural differences (e.g. all-or-nothing project vs incremental supply cart; physical bulk vs digital coupons) are reduced to tiny summary sentences.
2. **Sources & Provenance:** Rendered inside a collapsed `<details class="sources-disclosure">` element. Shows source count, checked date, source type, and general source notes, but hides `source.title` and hides which specific claims were verified by which source.
3. **Ease to Raise:** Rendered as an colored dot badge if populated, but missing contextual criteria.
4. **Products/Services:** Rendered as tag links on the program card, but provider-level `classification.products_services` is completely ignored.

#### C — Available but Effectively Hidden
1. **Provider Visuals:** Only 2 providers out of 45 (`booster` and `fundraising-com`) have a visual, and it is a generic photo. The layout collapses awkwardly when absent.
2. **Geographic Detail:** Detailed notes (`geography.notes`), states, and country distinctions are placed at the very bottom of the page in muted text underneath the broad scope label.
3. **Source Detail:** Buried in a closed accordion at the page footer; users must click and expand to see that research was conducted.

#### D — Not Exposed (Major Gap Area)
1. **Economics:** **100% UNEXPOSED.** Neither provider-level nor program-level economics are rendered anywhere on the page. Profit percentages (e.g., 25% for Chipotle, up to 50% for Krispy Kreme, 75–80% for Read-A-Thon), platform fees (0% for Zeffy), processing fees, minimum order amounts, minimum sales thresholds ($150 for Chipotle), and fee conditions/caveats do not exist in the HTML template.
2. **Eligibility & Requirements:** **100% UNEXPOSED.** Structured legal status (501(c)(3), public school teacher, registered nonprofit), minimum group size, participant age ranges, grade ranges (Pre-K to 12), and explicit restriction lists do not appear anywhere.
3. **Setup & Campaign Timing:** **100% UNEXPOSED.** Setup lead time (e.g., 3 weeks for Chipotle, 5 minutes for Read-A-Thon, 3 days for Krispy Kreme), campaign duration (4 hours for Chipotle, 2 weeks for Read-A-Thon, 4 months for DonorsChoose), and fulfillment timing are absent.
4. **Payout Timing & Cadence:** **100% UNEXPOSED.** How and when organizers receive funds (e.g., check in 30–45 days, 2 business days after warehouse receipt, two-stage 80/20 payout, monthly direct deposit with $20 minimum) is entirely missing.
5. **Logistics Details:** **100% UNEXPOSED.** Detailed operational logistics notes (supplies provided by company, return shipping labels, order forms, direct-to-supporter shipping, digital code distribution) are omitted.
6. **Program Direct URLs:** `program.url` is never rendered. Users only get one generic outbound button to the provider's top-level website.
7. **Beneficiary Relationships:** `program.beneficiary` (official vs unofficial beneficiary relationships) is unrendered.
8. **Capabilities, Outcomes, Cause Areas, & Activity Subtypes:** Detailed tags in `classification` and `program` (e.g., `shoe-drive`, `readathon`, `restaurant-night`, `tap-to-pay`, `recurring-giving`, `supplies`, `technology`) are never rendered.
9. **Provider Logos:** 100% missing (`logo: null` across all 45 YAML files; component exists but receives null).
10. **Legal Name & Aliases:** Never displayed.

#### E — Intentionally Internal
1. **Commercial Research:** (`commercial_research.*`): Affiliate status, affiliate network, commission rates, cookie duration, application notes.
2. **Intake Provenance:** (`provenance.intake_origins`, `meta.*`, `verification.reviewed_by`).

---

### Can Users Readily Answer Critical Decision-Making Questions Today?

| Decision Question | Answerable on Current Profile? | Visitor Reality |
|---|---|---|
| **What kind of fundraiser is this?** | **Yes** | Method badges, channels, summary, and "How it works" provide a clear high-level understanding. |
| **Who can use it?** | **Partially** | Organization pills show group types (schools, sports, etc.), but legal requirements (501c3 only vs open to anyone) and participant age/grade rules are completely absent. |
| **How much can we earn?** | **NO** | Canonical profit % (e.g., 25%, 40%, 80%) and giveback rates are not rendered unless coincidentally mentioned in free prose. |
| **What does it cost?** | **Partially / Misleading** | Only shows high-level tags ("None", "Required", "Varies"). Does not show exact platform fees, processing fee percentages, or payment deduction structures. |
| **Are there minimums?** | **NO** | Canonical minimum order sizes, minimum sales ($150), and group minimums exist in YAML but are absent from the profile page. |
| **How long does it take?** | **NO** | Neither setup lead time nor campaign duration is surfaced. |
| **How and when do we get paid?** | **NO** | Payout timing (e.g., 2 days, 10 days, 30–45 days) and payout schedules/methods (direct deposit vs mailed check) are absent. |
| **What work does the organizer need to do?** | **Partially** | General prose in "How it works" gives an overview, but logistics, fulfillment responsibilities, and coordinator requirements are omitted. |
| **Is shipping or inventory involved?** | **Yes** | Inventory model and fulfillment pills are displayed in the program card. |
| **Where is it available?** | **Yes** | Scope and country list are shown; geographic notes give caveats. |
| **What restrictions matter?** | **Partially** | High-level `considerations` prose gives 2 bullets, but structured legal exclusions, prohibited uses, and frequency limits (e.g., once every 6 months) are not rendered. |
| **When was this information verified?** | **Yes** | "Last verified [Date]" is displayed in the hero and disclosure. |
| **What evidence supports important factual claims?** | **NO** | Source links are listed at the bottom, but source titles and specific factual claim paths (`supports[].path`) are hidden. |

---

## 3. Audit of Information Hierarchy

The current provider profile page suffers from an inverted information hierarchy:

```
[ Current Hierarchy ]
Hero: Name, Status, Long Prose Summary, Outbound CTA, Quick Facts (Scope, Channel count, Source count)
  ↓
Audience Band: 8–10 Organization Pills (takes up substantial vertical space)
  ↓
Process: "How it works" prose paragraph + High-level channels/upfront tags
  ↓
Programs Section: Repetitive cards displaying basic taxonomy pills (Method, Format, Inventory, Upfront Cost)
  ↓
Bottom Research Columns: Best for / Considerations / Where it operates (prose lists)
  ↓
Collapsed Sources Accordion
```

### Key Hierarchical Problems

1. **High-Value Decision Facts Are Missing While Low-Value Counts Consume Prime Space:**
   - In the hero's "Quick facts" sidebar, the page displays: "Programs listed: 1", "Channels: Online", "Source review: 3 official sources". These are descriptive metadata counts, not decision-making criteria.
   - Meanwhile, high-urgency organizer questions (**"What % do we keep?"**, **"How fast can we launch?"**, **"Do we need $0 or a minimum order?"**, **"When is the check mailed?"**) are completely absent.

2. **Over-Reliance on Prose When Structured Data Exists:**
   - `content.how_it_works` and `content.summary` frequently repeat facts that are formally captured in `program.economics`, `program.timing`, and `program.requirements`.
   - Organizers must read 3 paragraphs of narrative prose to deduce facts that should be presented in a scannable spec sheet or structured data grid.

3. **Repetitive & Floating Metadata Between Sections:**
   - Channels ("Format: Online, In-Person") appear in Quick Facts, then again in the "How it works" decision grid, and then *again* inside every program card.
   - Upfront cost appears in the decision grid and then in every program card.
   - Organization pills ("Best suited for") occupy an entire full-width section with 8 to 11 tags, pushing actionable program details well below the fold.

4. **Multi-Program Flattening:**
   - For providers with multiple programs (e.g., Krispy Kreme's Pre-Sell vs One-Day Sale vs Digital Dozens; DonorsChoose's Project Funding vs Essentials), the program cards look virtually identical because their differentiating factors (inventory burden, lead time, digital redemption, funding minimums) are not rendered in the card's `<dl>` list.

### Recommended Target Information Hierarchy

```
[ Target Editorial & Decision Hierarchy ]
1. Provider Hero:
   - Identity: Name, Badge (Verified / Lifecycle), Short Value Proposition
   - Primary Outbound Action + Independence Note + Verified Date
   - Key Economics Strip (Callout Stats): Profit % / Margin / Give-back rate, Platform Fee, Upfront Cost, Minimums

2. Program Comparison / Details:
   - For 1 program: Detailed Program Specification Card
   - For 2+ programs: Side-by-Side Comparative Cards highlighting:
     * How it works & products sold
     * Financial Model (Earnings, Fees, Minimum order/sales)
     * Organizer Commitment (Lead time, Campaign duration, Effort)
     * Operations (Inventory model, Fulfillment, Shipping)
     * Payout Terms (How & when funds are received)
     * Direct link to program application

3. Eligibility & Requirements:
   - Clear checklist: Permitted legal statuses (501c3 vs any group), age/grade rules, participant minimums, operational restrictions

4. Contextual Fit & Advice:
   - "Best For" target scenarios
   - Practical Considerations & Red Flags

5. Geographic Availability:
   - Scope, supported states/regions, location limitations

6. Trust & Evidence (Verification Card):
   - Named authoritative sources (titles & links)
   - Scope of verification & last-reviewed timestamp
```

---

## 4. Audit of Directory / Provider Discovery

Evaluating `src/pages/providers/index.astro` and `src/components/ProviderFilterFields.astro`:

### Current Discovery Mechanics

- **Cards:** Name, verification badge ("Sources checked"), ease badge (if present), 1-sentence summary, method buttons, organization buttons (first 5 + "+N more"), geographic scope footer.
- **Badges:** `✓ Sources checked` (or `Research in progress`), `Ease: Easy/Moderate/Hands-On`.
- **Filters/Facets in UI:**
  - `Group type` (single-select radio button: All, Schools, Teams, Nonprofits, etc.)
  - `Fundraising methods` (multi-select checkboxes: Direct Donations, Product Sales, Events, etc.)
- **Hidden / URL-Only Parameter:** The client script parses `?product=` from URL parameters and can filter cards by product, but **there is no filter control or facet for products/services in `ProviderFilterFields.astro`!**
- **Sorting:** Static alphabetical sort by provider name. No option to sort by earnings, ease, or newly verified.
- **Summaries:** Reactive counter ("Showing X of 45 providers").

### Differentiation Breakdown

With 45 providers, the directory cards have become visually homogeneous:
- Almost every card displays 5–10 identical organization tags (schools, sports, booster clubs, nonprofits).
- Cards display zero financial signals: a user cannot tell from the directory whether a product fundraiser yields 10% or 50% profit, or whether a donation platform charges 5% or 0%.
- Cards display zero operational signals: no indication whether product sales require upfront inventory purchasing vs zero-inventory pre-orders.

### Prioritized Discovery Dimensions

#### High-Value Discovery Dimensions (Should Be Filterable or Distinctive Badges)
1. **Upfront Cost / Budget Requirement:** (`no-upfront-cost` vs `upfront-inventory` / `required`). A primary filter criterion for volunteer organizers with zero bank balance.
2. **Fundraising Format / Channel:** (`Online Only`, `In-Person`, `Hybrid`). Crucial for remote vs local school fundraisers.
3. **Product / Category Facet:** Surfacing the existing `products_services` taxonomy (Popcorn, Coffee, Apparel, Discount Cards, Restaurant Nights, Software).
4. **Zero-Inventory / Direct-to-Supporter:** High demand from modern schools wanting to avoid sorting boxes in gymnasiums.

#### Useful Secondary Dimensions (Filterable or Faceted)
1. **Legal Status / Eligibility:** (e.g., "501(c)(3) Required" vs "No Nonprofit Status Needed").
2. **Ease to Raise:** (Easy / Moderate / Hands-On).
3. **Turnaround / Timing:** (Fast start < 1 week vs Planned campaign).

#### Information Better Left to Profiles
- Exact payout delivery dates and banking requirements.
- Detailed restriction lists and prohibited use clauses.
- Full provenance claim trees and citation paths.

---

## 5. Audit of Finder Integration

Evaluating `src/pages/finder.astro`, `src/data/finderProviders.ts`, `src/components/finder/FinderExperience.astro`, and `src/lib/finderScoring.js`:

### 1. Canonical Fields Reaching Finder

`serializeFinderProvider()` in `src/data/finderProviders.ts` creates the payload passed to the browser. Currently, it passes:
- `identity.name`, `slug`, `profilePath`
- `classification.methods`, `products_services`, `organizations`, `outcomes`, `capabilities`, `beneficiary_types`, `cause_areas`, `activity_subtypes`
- `programs[].name`, `method`, `products_services`, `channels`, `inventory_model`, `upfront_cost`, `ease_to_raise`, `outcomes`
- `geography.scope`, `countries`, `states`, `regions`, `notes`

### 2. Fields That Actually Affect Scoring vs Informational Only

- **Affects Scoring:** `classification.organizations`, `program.method`, `program.outcomes`, `program.channels`, `program.upfront_cost`, `program.inventory_model`, `program.ease_to_raise`, `program.products_services`, `geography.countries`/`scope`.
- **Informational Only in Output:** Matched constraint tags, fit labels ("Strong fit", "Good fit"), reasons bullets, facts dl list.
- **Passed but Completely Ignored by Scoring:** `capabilities`, `beneficiary_types`, `cause_areas`, `activity_subtypes`, `geography.notes`.

### 3. Critical Data Gap: Fields Excluded from Finder Payload

The serialization whitelist **completely excludes**:
- `economics` (fees, giveback %, margins, minimum sales, minimum orders)
- `requirements` (minimum group size, legal status requirements, age/grade ranges)
- `timing` (setup lead time, campaign duration, fulfillment time, payout time)
- `logistics`

### 4. Questionnaire & Scoring Mismatch

The Finder questionnaire has 10 guided steps. A glaring disconnect exists between what the questionnaire asks and what the scoring engine does:

```javascript
// src/lib/finderScoring.js lines 262-269
if (answers.groupSize) {
  confidence -= confidencePenalty.groupSize; // docks 8%
  gaps.push("Participant-size fit is not documented in Finder data");
}
if (answers.time || constraints.has("fast")) {
  confidence -= confidencePenalty.timing;    // docks 10%
  gaps.push("Provider timing is not documented in Finder data");
}
```

- **Question 7 ("About how many people could participate?")**: Asks users if their group is Under 25, 25–100, or >100. Because `requirements.minimum_group_size` is not serialized to Finder, the scoring engine **penalizes the recommendation confidence of every single provider** and displays the message *"Participant-size fit is not documented in Finder data"*, even though the canonical database actually records group size requirements!
- **Question 8 ("Time available: Start quickly / A few weeks / A month or more")**: The scoring engine cannot check `setup_lead_time` or `campaign_duration`. It docks confidence by 10 points and tells the user *"Provider timing is not documented in Finder data"*, even though canonical records document lead times down to the minute or day!
- **Question 10 ("Must-have: Passive / ongoing")**: Docks confidence by 12 points and says *"Passive-fundraising requirements are not documented"*, despite `everyday-passive-fundraising` being a canonical method for providers like RaiseRight, Box Tops, and ShopRaise!

### 5. Weaknesses Created by the Expanded 45-Provider Corpus

- In the original 9-provider corpus, high-level taxonomy matching (e.g. `schools` + `product-sales`) produced 1–2 candidates.
- In the 45-provider corpus, 15+ providers match those same generic inputs.
- Because Finder cannot evaluate economics, timing, or group size, multiple providers tie with identical scores (e.g., 52 points).
- **Finder breaks ties alphabetically (`a.providerName.localeCompare(b.providerName)`)**, arbitrarily favoring providers whose names start with numerals or early letters (e.g., 99Pledges, BetterWorld, Bonfire) over better-fitting providers later in the alphabet.
- Recommendations are capped at 5 results (`slice(0, 5)`), meaning equally qualified providers are truncated invisibly.

---

## 6. Audit of Comparison Readiness

The 45-provider canonical corpus contains rich, structured data uniquely suited for comparing fundraising options. However, the application currently possesses **no comparison UI** and varying readiness across data domains:

### 1. Fields Immediately Ready for Comparison
- **Upfront Cost:** Controlled taxonomy (`none`, `varies`, `required`, `not-applicable`).
- **Inventory Requirement:** Controlled taxonomy (`no-inventory`, `preorder`, `upfront-inventory`, `not-applicable`).
- **Channels & Ordering:** Controlled arrays (`online`, `in-person`, `hybrid`) and boolean `online_ordering`.
- **Fulfillment Types:** Controlled arrays (`direct-to-supporter`, `group-distribution`, `local-pickup`, `digital`, `on-site`).
- **Geographic Scope:** Controlled taxonomy (`local`, `regional`, `us-nationwide`, `canada`, `international`).

### 2. Fields Requiring Normalization / Presentation Transforms
- **Economics / Earnings:** While values are strictly typed in YAML (`percentage`, `amount`, `tiered`, `variable`), they encompass different economic models (profit split, revenue share, give-back %, flat per-pound payout, donor tips). 
  - *Requirement:* A presentation helper must map these into comparable units (e.g., "Keeps 80% of donations" vs "Earns 25% of sales" vs "0% platform fee, donors tip").
- **Timing & Durations:** Expressed as duration ranges (`setup_lead_time`, `campaign_duration`, `payout_time`) with varying units (minutes, days, weeks, months).
  - *Requirement:* A duration formatter to render clean badges (e.g., "Setup: 3 days", "Event: 4 hours", "Payout: 10 days").
- **Requirements & Eligibility:** Mix of structured enums (`legal_status`, `grade_range`) and string arrays (`participation_requirements`).
  - *Requirement:* A checklist component to render eligibility criteria.

### 3. Handling Missing-Data Semantics in Comparisons
- The schema uses a 4-state research lifecycle: `not-researched`, `researched-unknown`, `not-applicable`, `known`.
- In a comparison matrix, collapsing `researched-unknown` into "No" or "$0" would be catastrophically misleading (e.g. showing a provider with unconfirmed upfront fees as "Free").
- The UI must explicitly render:
  - `Not required` (when `none` or `not-applicable`)
  - `Unknown / Unverified` (when `researched-unknown` or `not-researched`, with a neutral dashed indicator)
  - `Varies` (when dependent on program options)

### 4. Facts That Must NOT Be Reduced to Simplistic Winner/Loser Judgments
- **Profit % vs Product Value:** A 25% restaurant give-back (zero physical inventory or cash handling) is not inherently "worse" than a 50% discount card fundraiser (which requires upfront purchasing and door-to-door selling).
- **All-or-Nothing vs Keep-What-You-Raise:** DonorsChoose's all-or-nothing model guarantees full project funding or refund; crowdfunding platforms that allow partial payouts have different tradeoffs.
- **Donor Tips vs Platform Deductions:** Zeffy charges 0% fees by asking donors for optional tips; Givebutter has tipping with optional platform fee coverage; standard processors charge 2.9% + $0.30. Neither is universally superior.

---

## 7. Audit of Source / Verification UX

The canonical model tracks 159 authoritative sources with granular path-level claim verification. 

### What Visitors Currently See
- A tiny link in the hero: `Last verified Sep 20, 2026`.
- A count in quick facts: `3 official sources`.
- A collapsed disclosure accordion at the very bottom of the page (`<details class="sources-disclosure">`):
  ```
  [▶] Research disclosure: 3 sources checked · Last reviewed Sep 20, 2026
      - Official Program Page (Checked Sep 20, 2026) [Link]
      - Official Document (Checked Sep 20, 2026) [Link]
  ```

### Gaps in Visitor-Facing Trust Signals
1. **Source Titles Are Missing:** `src/pages/providers/[slug].astro` line 183 renders `formatProviderLabel(source.type)` (e.g., "Official Program Page") rather than `source.title` (e.g., "Chipotle Fundraising FAQ & Guidelines"). Users see generic category names instead of recognizable document titles.
2. **Zero Factual Attribution / Citations:** The database records exact claims via `supports[].path` (e.g., verifying that source `src_000060` verifies `economics` and `timing`). The UI renders zero claim linkages. If a visitor wonders "Where does the 25% giveback or $150 minimum come from?", there is no footnote or citation connecting the claim to the source.
3. **No Completeness or Review Status Transparency:** All 44 verified providers display the exact same text ("✓ Sources checked"), regardless of whether their record is `anchor-quality` with exhaustive program economics or an unassessed legacy record.
4. **Needs-Recheck State Is Invisible:** If a source becomes `needs-recheck` or `stale`, the public page provides no visual indicator that information is undergoing re-verification.

---

## 8. Representative Provider Walkthrough

Evaluating 7 materially different providers across diverse fundraising models:

### 1. Chipotle Community Fundraising (`chipotle-community-fundraising.yaml`)
- **Model:** Restaurant Give-Back / Community Partnership
- **Canonical Intelligence Available:** 25% give-back on pre-tax sales; $150 minimum event sales to receive payout; 3 weeks setup lead time; 4-hour evening campaign window; 30–45 days payout timing by mailed check; restriction to 1 event per 6 months; prohibition of on-premises flyer solicitation.
- **What Visitor Receives Today:** A generic summary mentioning the event and a "Restaurant & Business Partnerships" tag. 
- **Most Critical Unreceived Information:** The **$150 minimum sales rule**, the **3-week lead time**, and the **30–45 day check payout timeline** are completely unrendered in the UI.

### 2. Zeffy (`zeffy.yaml`)
- **Model:** 100% Free Donation & Ticketing Platform (Donor-Tipped)
- **Canonical Intelligence Available:** 0% platform fee, 0% payment processing fee; funded entirely by voluntary donor contributions at checkout; strictly limited to registered 501(c)(3) / registered charities with verified organizational bank accounts; individuals ineligible.
- **What Visitor Receives Today:** Tagged with direct donations, crowdfunding, auctions; upfront cost says "None".
- **Most Critical Unreceived Information:** Zeffy's **defining market differentiator—0% platform AND 0% processing fees via donor tipping**—is not presented in any structured fee card, callout, or stat! Furthermore, the strict **registered nonprofit eligibility requirement** is completely omitted, leaving school clubs or individuals unaware they cannot use it.

### 3. Krispy Kreme Fundraising (`krispy-kreme-fundraising.yaml`)
- **Model:** Multi-Program Food / Product Sales (3 programs)
- **Canonical Intelligence Available:**
  1. *Classic Pre-Sell:* Pre-order model, order only what was sold, 3 days lead time (5 days for delivery), group distributes fresh boxes.
  2. *Classic One-Day Sale:* Upfront bulk inventory purchase, event-based table sale.
  3. *Digital Dozens:* Online campaign link, emailed digital redemption vouchers, zero doughnut handling, redeemable at participating shops nationwide.
  - Overall economics: Up to 50% profit.
- **What Visitor Receives Today:** Three program cards showing "Classic Pre-Sell", "Classic One-Day Sale", "Digital Dozens", each showing baked goods, in-person/online, and upfront cost "Varies" or "Required".
- **Most Critical Unreceived Information:** The visitor cannot see **how the 3 programs fundamentally differ in execution burden**—specifically that Digital Dozens requires **zero physical doughnut handling or pickup**, whereas One-Day Sale requires purchasing dozens upfront at risk. The **up to 50% profit** specification is completely absent from structured display.

### 4. DonorsChoose (`donorschoose.yaml`)
- **Model:** Public School Teacher Crowdfunding / Official Beneficiary Materials Fulfillment
- **Canonical Intelligence Available:** Public school teachers (75%+ student-facing); two distinct programs:
  1. *Classroom Project Funding:* All-or-nothing campaign, $100 minimum project goal, 4 months duration, provider purchases and ships physical supplies within 2 weeks.
  2. *Classroom Essentials:* Incremental supply cart, no funding minimum, items ship as funded.
  - Economics: 15% suggested optional donor tip to platform.
- **What Visitor Receives Today:** Two cards showing "Classroom Project Funding" and "Classroom Essentials", both tagged with Crowdfunding and Books & Educational supplies.
- **Most Critical Unreceived Information:** The crucial structural difference—**all-or-nothing funding with $100 minimum vs incremental supply fulfillment with no minimum**—is omitted from structured facts. The strict **public school teacher eligibility threshold** is not surfaced.

### 5. Funds2Orgs (`funds2orgs.yaml`)
- **Model:** Collection & Reuse / Shoe Drive Fundraiser
- **Canonical Intelligence Available:** Collection of gently worn, used, or new paired shoes; free collection bags, materials, and coaching provided ($0 upfront); paid by the pound upon warehouse receipt and weighing; typical 60-day campaign; payout issued within **2 business days** of warehouse processing; for-profit social enterprise (no tax receipts).
- **What Visitor Receives Today:** Method: Collection & Reuse; Upfront cost: None; Summary paragraph.
- **Most Critical Unreceived Information:** The entire financial mechanism—**getting paid by the pound**—and the rapid **2-business-day payout upon receipt** are completely invisible in structured fields.

### 6. Read-A-Thon (`read-a-thon.yaml`)
- **Model:** Pledge-a-thon / Minute-Tracking Reading Challenge
- **Canonical Intelligence Available:** Setup time under 5 minutes; 2-week typical event; Pre-K through 12th grade; Two economic models: School keeps **80% profit** (school provides prizes) or **75% profit** (Read-A-Thon provides student prize store + 15% prize credits); Payout terms: **80% of earnings paid in 10 days, remaining 20% paid in 30 days** as a chargeback reserve.
- **What Visitor Receives Today:** Method: Pledge-a-thon; Upfront cost: None; Summary.
- **Most Critical Unreceived Information:** The **75% vs 80% proceeds split**, the **5-minute setup turnaround**, the **Pre-K–12 grade range**, and the unique **two-stage payout schedule (10 days / 30 days)** are entirely withheld from the visitor.

### 7. RaiseRight (`raiseright.yaml`)
- **Model:** Everyday Passive / Scrip & Gift Card Fundraising (4 programs)
- **Canonical Intelligence Available:** Earnings average 6% back on face-value gift cards; transaction fees explicitly documented ($0.29 ACH with bank on file, $0.79 without, 1% debit, 3% credit); open-ended duration; monthly direct deposit or quarterly check with $20 minimum earnings threshold.
- **What Visitor Receives Today:** Hero reports "Known upfront cost: Required" (confusingly conflating the face value purchase of gift cards with program enrollment, which is free); program cards list channels and gift cards.
- **Most Critical Unreceived Information:** The visitor has no idea **what percentage is earned (~6%)**, that **enrollment is free**, what the **payment fees** are, or that payouts occur **monthly via direct deposit at a $20 threshold**.

---

## 9. Gap Matrix

The following matrix documents the chasm between FRD's canonical research investment and the current user-facing application:

| Data / Capability Area | Exists Canonically | Provider Page | Directory | Finder | Comparison Ready | Priority |
|---|---|---|---|---|---|---|
| **Identity (Name, Site Link)** | Yes (100%) | Clearly exposed (A) | Clearly exposed | Clearly exposed | Yes | P0 (Done) |
| **Provider Logos** | Schema Ready (100% null) | Not exposed (D) | Not exposed | Not exposed | No (Assets missing) | P1 |
| **Descriptions & Summaries** | Yes (100%) | Clearly exposed (A) | Clearly exposed | Informational | Yes | P0 (Done) |
| **Target Organizations / Groups** | Yes (100%) | Clearly exposed (A) | Filter & Badges | Hard Scoring Factor | Yes | P0 (Done) |
| **Fundraising Methods** | Yes (100%) | Clearly exposed (A) | Filter & Badges | Hard Scoring Factor | Yes | P0 (Done) |
| **Products & Services Taxonomy** | Yes (100%) | Partially exposed (B) | URL only (No UI facet) | Hard Scoring Factor | Yes | P1 |
| **Program Economics: Profit / Earnings %** | Yes (90%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Needs formatter | **P0** |
| **Program Economics: Platform & Processing Fees** | Yes (90%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Needs formatter | **P0** |
| **Program Economics: Minimum Orders & Sales** | Yes (85%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Yes | **P0** |
| **Eligibility: Legal Status (501c3, School)** | Yes (90%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Yes | **P0** |
| **Eligibility: Age & Grade Ranges** | Yes (70%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Yes | P1 |
| **Eligibility: Group Size Minimums** | Yes (65%) | **Not exposed (D)** | **Not exposed** | **Penalizes confidence!** | Yes | **P0** |
| **Timing: Setup Lead Time** | Yes (80%) | **Not exposed (D)** | **Not exposed** | **Penalizes confidence!** | Needs formatter | **P0** |
| **Timing: Campaign / Event Duration** | Yes (85%) | **Not exposed (D)** | **Not exposed** | **Penalizes confidence!** | Needs formatter | **P0** |
| **Timing: Payout Time & Schedules** | Yes (85%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Needs formatter | **P0** |
| **Logistics & Distribution Details** | Yes (90%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Needs checklist UI | P1 |
| **Multi-Program Differentiation** | Yes (14 providers) | Partially exposed (B) | **Flattened to 1st** | **Selects best score** | Needs side-by-side | **P0** |
| **Program Direct URLs (`program.url`)** | Yes (95%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Yes | P1 |
| **Beneficiary Relationships** | Yes (75%) | **Not exposed (D)** | **Not exposed** | **Not exposed** | Yes | P2 |
| **Activity Subtypes & Capabilities** | Yes (85%) | **Not exposed (D)** | **Not exposed** | Ignored by scoring | Yes | P2 |
| **Verification: Sources Checked Count & Date** | Yes (100%) | Partially exposed (B) | Badge only | Not exposed | Yes | P1 |
| **Verification: Authoritative Source Titles & Links** | Yes (159 sources) | Available but hidden (C) | **Not exposed** | **Not exposed** | Yes | P1 |
| **Verification: Factual Claim Citations (`supports`)** | Yes (159 sources) | **Not exposed (D)** | **Not exposed** | **Not exposed** | UI design needed | P2 |
| **Missing-Data State Distinctions** | Yes (Controlled enum) | Inconsistent (drops rows) | Inconsistent | Docks confidence | Needs neutral indicator | P1 |

---

## 10. Prioritized Recommendations

### P0 — Before V1 Launch (Blockers to Value Delivery)

These 4 changes address the primary failure mode of the current build: **the researched financial, eligibility, and timing data exists in YAML but is completely invisible to visitors.**

1. **Expose Structured Program Economics & Eligibility on Provider Profiles (`[slug].astro`):**
   - Add a dedicated **Economics & Requirements Card** to the program display.
   - Surface: Profit % / Margin / Give-back rate, Platform Fee, Processing Fee, Minimum Sales / Orders, and Legal Eligibility requirements (e.g. "501(c)(3) Required" or "Public School Teachers").
   - Replace the generic upfront cost tag with exact financial terms.
2. **Expose Structured Timing & Payout Terms on Provider Profiles (`[slug].astro`):**
   - Render a scannable **Timing & Payout Spec Block** on every program card:
     * Setup Lead Time (e.g., "Ready in 5 minutes" or "3 weeks advance booking")
     * Campaign Duration (e.g., "4-hour evening event" or "2-week challenge")
     * Payout Timing & Method (e.g., "Check mailed 30–45 days after event" or "Direct deposit monthly with $20 min")
3. **Fix the Finder Questionnaire & Scoring Disconnect (`finderProviders.ts` & `finderScoring.js`):**
   - Serialize `requirements.minimum_group_size`, `timing.setup_lead_time`, and `timing.campaign_duration` into `serializeFinderProvider()`.
   - Update `evaluateProviderProgram()` to score user group size and timeline preferences against documented provider facts rather than immediately docking confidence and emitting false *"data is not documented"* warnings.
4. **Fix Multi-Program Flattening on Provider Profiles (`[slug].astro`):**
   - For providers with multiple programs, visually elevate the operational differences (e.g., Pre-Sell vs Upfront Bulk vs Digital Dozens) so users understand *which program fits their group*.

### P1 — High-Value V1 Improvements (Fast Follow)

1. **Upgrade Directory Discovery with Essential Facets (`ProviderFilterFields.astro`):**
   - Expose the existing `products_services` taxonomy as an interactive filter in the UI.
   - Add high-value discovery filters for **Upfront Cost** (`No Upfront Cost`) and **Inventory Model** (`No Inventory / Digital / Direct-Ship`).
2. **Elevate Source Transparency & Verification Signals (`[slug].astro`):**
   - Render `source.title` alongside the URL in the research disclosure so users see recognizable document names (e.g. "Chipotle Fundraising FAQ" instead of generic "Official Program Page").
   - Add an inline badge for `verification.completeness` (e.g., "Anchor-Quality Research").
3. **Harmonize Missing-Data Semantics Across Cards & Grids:**
   - When a field is `researched-unknown`, render an explicit neutral indicator (e.g., "Not published by provider") rather than silently omitting the row, which misleads users into assuming zero fees or no requirements.
4. **Direct Program Inbound / Outbound Links:**
   - Render `program.url` on individual program cards with a clear CTA (`Apply for [Program Name] ↗`), pointing directly to application forms rather than generic homepages.

### P2 — Post-Launch / V2 Enhancements

1. **Dedicated Provider Comparison Engine (Side-by-Side UI):**
   - Implement a 2-up or 3-up comparison table (`/compare/?p1=...&p2=...`) leveraging normalized economics and timing fields.
2. **Granular Source-to-Claim Footnoting:**
   - Expose `source.supports[].path` as interactive citation tooltips on specific economic claims.
3. **Expanded Capabilities & Activity Subtypes Faceting:**
   - Enable deep-dive discovery around micro-activities (e.g., "Shoe Drives", "Readathons", "Text-to-Give").

---

## 11. Explicit Review of Known Areas

### 1. Provider Logos
- **Current State:** The component `src/components/ProviderLogo.astro` is fully implemented and styled, and `[slug].astro` conditionally renders it via `{identity.logo && <ProviderLogo ... />}`.
- **Data Reality:** **0 out of 45 providers have a logo.** Every single provider YAML file specifies `logo: null`.
- **Visitor Impact:** The logo slot is never rendered. 43 out of 45 providers have no visual asset at all (only Booster and Fundraising.com have representative stock photos). The hero section feels text-heavy and unbranded, but functionally does not break layout.

### 2. Program-Level Data
- **Current State:** The schema stores deep program intelligence: `economics`, `requirements`, `timing`, `logistics`, `url`, `beneficiary`, `outcomes`, `capabilities`.
- **Data Reality:** 14 providers have 2 to 4 distinct programs (63 total programs across 45 providers).
- **Visitor Impact:** `[slug].astro` renders only a basic program overview: name, ease badge, summary, products, method, channels, inventory model, upfront cost, fulfillment, and online ordering. **None of the program-level economics, requirements, timing, payout, or logistics notes reach the screen.** Multiple programs look almost identical, hiding the core operational distinctions researched during ingestion.

### 3. Missing-Data Semantics
- **Current State:** Canonical records rigorously distinguish `not-researched`, `researched-unknown`, `not-applicable`, and `known`.
- **Visitor Impact:**
  - On provider profiles: Missing data is handled by omitting lines (e.g., if `upfront_cost === "unknown"`, the Upfront Cost row is dropped). This creates ambiguity: visitors cannot tell whether a provider has no upfront cost, or whether it simply was not disclosed.
  - In Finder: Missing data causes automatic confidence penalties. When an answer is provided for group size or timing, Finder penalizes confidence even when the provider record actually has known data!

### 4. Local / Location Data
- **Current State:** The location/ZIP model is deferred for V1.
- **Visitor Impact:** Providers tied to physical venues (e.g. Chipotle, Little Caesars) include clear caveats in `geography.notes` ("Each approved fundraiser is tied to one participating restaurant..."). In Finder, entering a ZIP code lowers confidence by 8% with the warning *"ZIP-level service is not documented"*. This is acceptable for V1 and should not be treated as a provider-page defect.

### 5. Unsupported Payout Cadence
- **Current State:** The controlled enum `PAYOUT_FREQUENCIES` only includes `["monthly", "quarterly"]`.
- **Data Reality:** Many real-world providers operate on event-triggered payouts (e.g. Read-A-Thon: 80% at 10 days, 20% at 30 days; Funds2Orgs: 2 business days after warehouse weighing; Chipotle: mailed check in 30–45 days; Bonfire: on-demand PayPal/ACH). In all these cases, `payout_schedules: []` and the exact cadence is accurately preserved in `timing.notes[]` or `timing.payout_time`.
- **Visitor Impact:** Because `timing` is currently unexposed on the provider profile, this enum limitation has **zero visitor-facing impact today**. When timing is exposed, rendering `timing.notes[]` alongside any recurring schedule will completely solve the user need without requiring an enum change.

---

## 12. Final Assessment

### What FRD Has
FundraisingDirectory.net has assembled an exceptional canonical dataset: 45 verified providers, 63 programs, and 159 authoritative sources. The schema successfully captures the real, messy nuances of fundraising operations—tiered profit margins, processing fees, lead times, minimum sales thresholds, student grade ranges, and payout holdbacks.

### What Visitors Actually Get
Visitors currently receive what looks like an early taxonomy wireframe. The rich economics, timing, and requirements data is trapped in YAML files. Profile pages display broad prose and high-level categorization pills. Directory cards look identical, and Finder tells users that data is "not documented" when it actually is.

### Biggest Value Gap
**The Single Largest Disconnect:**  
The total absence of **Program Economics (profit %, fees, minimums)** and **Timing (lead times, campaign duration, payout schedules)** from the provider profile pages and Finder scoring. Users visit a fundraising directory to answer two fundamental questions: *"How much money will we keep?"* and *"How much time and effort will this take?"* Both answers exist in the database, but neither is visible on the site.

---

## Recommended Next Implementation Task

To turn this audit directly into execution, the following prompt is ready for Codex:

```markdown
### Task: Expose Program Economics, Eligibility, and Timing on Provider Profiles

#### Objective
Update `src/pages/providers/[slug].astro` and associated styles/helpers to render the researched program-level economics, requirements, timing, and logistics data that currently exists in the canonical provider YAML records.

#### Requirements
1. **Helper Functions (`src/data/providerFormatters.ts`):**
   - Create formatting utilities for `economicValueSchema` (formatting percentages, dollar amounts, ranges, and tiered values).
   - Create a duration formatter for `durationRangeSchema` (formatting minutes, days, weeks, months, and open-ended ranges).
   - Create a legal status label formatter for `programRequirementsSchema.legal_status`.

2. **Program Card Upgrade (`src/pages/providers/[slug].astro`):**
   - In each `program-card`, resolve economics using `resolveProgramEconomics(provider.data, program)`.
   - Render a structured **Financial Terms** block:
     * Profit / Return / Give-back percentage (e.g., "25% of qualifying sales" or "Up to 50% profit")
     * Platform & Processing fees (e.g., "0% platform fee" or "2.9% + $0.30")
     * Minimum sales or order thresholds (e.g., "$150 minimum event sales")
     * Fee caveats and notes.
   - Render a structured **Timing & Payout** block:
     * Setup / Lead Time (e.g., "3 weeks advance booking" or "5 minutes")
     * Campaign Duration (e.g., "4 hours" or "2 weeks typical")
     * Payout Timing & Schedule (e.g., "Check mailed 30–45 days after event", "2 business days after receipt", or monthly/quarterly schedules)
     * Timing notes.
   - Render an **Eligibility & Rules** block:
     * Permitted organizations / legal statuses (e.g., "501(c)(3) required" or "Open to all groups")
     * Minimum group size or participant age/grade rules
     * Key restrictions from `other_restrictions`.
   - Render `program.url` on the card as a direct CTA button (`Apply for [Program Name] ↗`).

3. **Missing-Data Handling:**
   - If economics or timing status is `known`, render the structured facts.
   - If status is `researched-unknown` or `not-researched`, display a clean, neutral "Not published by provider" note rather than omitting the block or showing $0/None.
   - If status is `not-applicable`, display "Not applicable".

4. **Preserve Standards:**
   - Zero client-side JavaScript additions; keep profile rendering 100% static Astro HTML/CSS.
   - Follow existing CSS variables and typography tokens in `src/styles/providers.css`.
   - Run automated validation and build checks to ensure zero regressions.
```
