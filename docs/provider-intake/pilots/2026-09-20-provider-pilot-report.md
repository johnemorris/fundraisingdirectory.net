# Provider ingestion pilot report — 2026-09-20

> Historical first-pass report. Its schema blockers were corrected and the same five records were revalidated. See [Provider ingestion pilot revalidation](./2026-09-20-provider-pilot-revalidation.md) for the current result.

## Result

**PILOT FAILED — SCHEMA REVIEW REQUIRED**

All five records passed the intake and canonical publication workflow, but the pilot found provider facts that the frozen provider-level model cannot represent cleanly. In particular, GroupRaise's location-specific offers require a separate location/opportunity entity, RaiseRight exposes missing product/service categories, and provider-wide DonorsChoose economics had to be duplicated across two materially different programs. Do not begin the larger provider batch until these modeling decisions are reviewed.

No Finder ranking policy, UI, logo, affiliation, sponsorship, featured status, or commercial-research behavior was changed.

## Provider results

### DonorsChoose — existing record enriched

- Programs: existing `classroom-project-funding` enriched; new `classroom-essentials` program added.
- Added: organization/beneficiary/cause/outcome taxonomy, educator eligibility, $100 Classroom Project request minimum, all-or-nothing fulfillment, Classroom Essentials' no-minimum incremental fulfillment, project review and campaign timing, published project-cost components, claim-level sources, and verification metadata.
- Primary sources: [Teacher Sign-up](https://www.donorschoose.org/teachers), [Financials](https://www.donorschoose.org/about/finance.html), and [About DonorsChoose](https://www.donorschoose.org/about).
- Unknown/unavailable: no material provider claim was invented. Minute-level setup time and indefinite list duration are retained as exact timing notes because the duration value model cannot express minutes or an open-ended duration.
- Conflict: none. The provider-wide cost model is duplicated on both program records because canonical economics exists only at program level.

### World's Finest Chocolate — existing record enriched

- Programs: existing `chocolate-fundraiser` enriched.
- Added: 8-case minimum, profit tiers, ordering-path and credit-dependent upfront cost, eligible no-upfront-cost organization rules, one-to-two-week ordering lead time, typical campaign duration, shipping/storage/return details, 48-state delivery notes, and verification metadata.
- Primary sources: [How Fundraising Works](https://worldsfinestchocolate.com/fundraising/how-it-works), [Fundraising overview](https://worldsfinestchocolate.com/fundraising), [Fundraising FAQs](https://worldsfinestchocolate.com/faq), and [No-upfront-cost guide](https://worldsfinestchocolate.com/blog/fundraiser-with-no-upfront-cost).
- Unknown/unavailable: exact shipping charges, credit qualification, and return eligibility vary by order and approval.
- Conflict requiring review: official pages establish 40% below 200 cases and 50% above 200 cases but do not state the tier for exactly 200 cases. The economics claim and provider review status are `needs-recheck`; the canonical record does not guess.

### GroupRaise — new record

- Programs: new `restaurant-fundraising-meal`.
- Added: restaurant-night method/activity, zero organizer platform cost, restaurant-set give-back, 20-RSVP rule and override, two-week request lead time, seven-day restaurant response window, four-to-six-week donation timing, prohibited organization/event categories, restaurant financial responsibility, and explicit location variability.
- Primary sources: [GroupRaise](https://www.groupraise.com/), [What is a GroupRaise meal?](https://groupraise.zendesk.com/hc/en-us/articles/230917367-What-is-a-GroupRaise-meal), and [General Guidelines](https://groupraise.zendesk.com/hc/en-us/articles/360001798208-General-Guidelines-to-Organizing-an-Event-Through-GroupRaise).
- Unknown/unavailable: an exact nationwide give-back rate, location inventory, event dates, accepted order channels, W-9 rules, attendance rules, and eligible group types are not provider-level constants.
- Conflict: none at provider level; location-specific facts must not be flattened into global claims.

### Givebutter — existing record enriched

- Programs: existing `online-fundraising-platform` enriched.
- Added: Forms/Pages/Events, peer-to-peer, auctions, payments and CRM capabilities, current Standard pricing and processing conditions, ACH differences, instant-payout fee, US/Puerto Rico payout requirements, personal-account restriction, withdrawal timing, and verification metadata.
- Primary sources: [What is Givebutter?](https://help.givebutter.com/en/articles/1726586-what-is-givebutter-and-how-does-it-work), [Standard pricing](https://help.givebutter.com/en/articles/1512762-givebutter-standard-pricing-explained), [Campaign creation](https://help.givebutter.com/en/articles/125627-how-to-create-a-campaign-to-start-raising-funds), [Withdrawals](https://help.givebutter.com/en/articles/1761146-how-to-withdraw-funds), [Stripe Connect payout setup](https://help.givebutter.com/en/articles/10401823-how-to-add-your-bank-account-and-payout-information-with-stripe-connect), [Countries and currencies](https://help.givebutter.com/en/articles/1726542-supported-countries-and-currencies-on-givebutter), and [Who can use Givebutter](https://help.givebutter.com/en/articles/1726576-who-can-use-givebutter-and-what-can-i-raise-money-for).
- Unknown/unavailable: instant-payout eligibility is dynamic and not published as a fixed rule; exceptions to the tips-enabled guarantee remain conditional.
- Conflict: none. An initially overbroad personal-fundraising classification was caught during source review and removed before final validation.

### RaiseRight — new record

- Programs: new `gift-card-fundraising`, `shop-online-earnings`, `local-dining-earnings`, and `travel-booking-earnings` programs.
- Added: program approval and enrollment-code workflow, gift-card formats and fulfillment, brand-variable earnings, gift-card transaction fees, online-shopping zero fee, local-dining and travel earnings, payout schedules/minimums, year-round timing, and verification metadata.
- Primary sources: [Starting a New Program](https://www.raiseright.com/resources/organization/starting-a-new-program/), [Gift Card Fundraising](https://www.raiseright.com/how-it-works/gift-card-fundraising), [Shop Online and Earn](https://www.raiseright.com/how-it-works/shop-online), [2026 program overview](https://www.raiseright.com/hubfs/Flyer_RaiseRightOverview_2026.pdf), and [Organization payout timelines](https://support.raiseright.com/hc/en-us/articles/44381442013075-Organization-earnings-payout-timelines).
- Unknown/unavailable: current merchant-level rates/exclusions and local-dining availability vary; equivalent Canadian program terms were not established and are not represented.
- Conflict: none.

## Schema stress test

The pilot did not invent or silently coerce values, but four modeling limitations require review:

1. **Shared provider economics:** DonorsChoose's processing-cost and optional-allocation facts apply to both programs. Because economics exists only at program level, the same facts and source associations had to be duplicated.
2. **Location-specific opportunities:** GroupRaise restaurant offers cannot be represented as provider-level geography/economics/requirements without creating false nationwide claims. The canonical record stores only the invariant workflow and explicitly variable terms.
3. **Product/service taxonomy gaps:** RaiseRight gift-card fundraising, shopping rewards, card-linked dining, and travel-booking earnings have no accurate `products_services` values. Those arrays remain empty instead of forcing an incorrect fundraising-platform or merchandise category.
4. **Timing precision and semantics:** the duration model lacks minutes and business-day units and has no dedicated payout/settlement timing concept. Exact values are preserved in `timing.notes` or `logistics.notes`, but are not independently queryable.

The intake workflow also exposed a non-schema defect: distinct programs sharing one official URL were collapsed during updates. The matcher now prioritizes program ID, slug, and name before URL, with a regression test.

## Local discovery findings

GroupRaise demonstrates that a future ZIP/location system needs an entity below provider/program, not extra provider-level fields. A location opportunity should be able to hold:

- stable provider, brand, and location identifiers;
- street address, coordinates, ZIP/postal code, service radius, and active status;
- location-specific give-back value and basis;
- eligible order channels and qualification rules;
- location-specific W-9, group-type, RSVP, attendance, and solicitation requirements;
- available dates and event time windows;
- payout method and expected payout timing;
- source URL, checked date, claim status, and validity/effective period.

The current pilot intentionally did not ingest homepage example locations or build this system. Those examples are dynamic and location-contextual, not canonical provider facts.

## Data quality

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Providers | 9 | 11 | +2 |
| Programs | 12 | 18 | +6 |
| Sources | 15 | 34 | +19 |

- Duplicate provider slugs, normalized names, domains, or provider IDs: 0.
- Duplicate program IDs: 0.
- Duplicate source IDs: 0.
- Pilot program research sections left `not-researched`, `researched-unknown`, or `not-applicable`: 0.
- Unresolved research: World's Finest Chocolate's exact 200-case tier; GroupRaise location-level availability/terms; Givebutter dynamic instant-payout eligibility; RaiseRight merchant/location rates and Canadian equivalency.
- Final validation failures: 0.

## Validation

- Bulk intake validation: 5/5 publish-ready, 0 likely duplicates, 0 validation failures.
- Approved publication and canonical round-trip coverage: passed.
- Provider schema/content validation: passed through the full test suite and production build.
- Finder tests, including commercial-firewall invariance: passed.
- Full test suite: 60/60 passed.
- Production build: passed; 61 pages built.
- `git diff --check`: passed.

The larger provider batch was not started.
