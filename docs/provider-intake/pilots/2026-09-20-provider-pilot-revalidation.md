# Provider ingestion pilot revalidation — 2026-09-20

## Result

**READY FOR BULK INGESTION**

The approved pilot corrections resolve every national/provider-level blocker found by the original five-provider run. The exact pilot intake now validates and round-trips with zero diffs. GroupRaise location inventory remains intentionally outside the provider corpus and is documented as a separate future subsystem boundary.

No Finder ranking policy, public UI, logo, affiliation, sponsorship, featured status, or commercial-research behavior changed. The larger provider batch was not started.

## Provider results

### DonorsChoose — existing record enriched

- Programs: existing `classroom-project-funding` plus new `classroom-essentials`.
- Preserved/enriched data: educator and school applicability, project requirements, all-or-nothing versus incremental fulfillment, setup/campaign/fulfillment timing, geography, outcomes, capabilities, verification, and claim sources.
- Economics correction: the shared cost model now exists once at provider level. Both programs explicitly use `inherit-provider`; neither duplicates an economics object. The finance source supports the provider `economics` claim.
- Sources: [Teacher Sign-up](https://www.donorschoose.org/teachers), [Financials](https://www.donorschoose.org/about/finance.html), and [About DonorsChoose](https://www.donorschoose.org/about).
- Unknown/unavailable: none invented. The published weighted-average processing figure remains identified as an average, and the optional donor allocation remains optional.
- Conflicts requiring review: none.

### World's Finest Chocolate — existing record enriched

- Programs: existing `chocolate-fundraiser`.
- Preserved/enriched data: minimum order, profit tiers, approval-dependent payment terms, organization requirements, setup/campaign/fulfillment timing, shipping/storage/return logistics, geography, and verification.
- Sources: [How Fundraising Works](https://worldsfinestchocolate.com/fundraising/how-it-works), [Fundraising Programs](https://worldsfinestchocolate.com/fundraising), [Fundraising FAQs](https://worldsfinestchocolate.com/faq), and [No-upfront-cost guide](https://worldsfinestchocolate.com/blog/fundraiser-with-no-upfront-cost).
- Unknown/unavailable: shipping charges, credit qualification, and return eligibility vary by order and approval.
- Conflict requiring review: official materials do not establish the profit tier for exactly 200 cases. The claim and canonical review status remain `needs-recheck`; no tier was invented.

### GroupRaise — new record preserved

- Programs: `restaurant-fundraising-meal`.
- Preserved data: method/activity, zero organizer platform cost, restaurant-variable give-back, RSVP rule, request and restaurant-response timing, donation timing, restrictions, restaurant financial responsibility, and location variability.
- Sources: [GroupRaise](https://www.groupraise.com/), [What is a GroupRaise meal?](https://groupraise.zendesk.com/hc/en-us/articles/230917367-What-is-a-GroupRaise-meal), and [General Guidelines](https://groupraise.zendesk.com/hc/en-us/articles/360001798208-General-Guidelines-to-Organizing-an-Event-Through-GroupRaise).
- Unknown/unavailable: location inventory, dates, locally accepted order channels, and location-specific economics or requirements are not provider constants.
- Conflicts requiring review: none at provider/program level. Location-level facts remain outside this corpus by design.

### Givebutter — existing record enriched

- Programs: existing `online-fundraising-platform`.
- Preserved/enriched data: campaign formats, peer-to-peer, auctions, payment and CRM capabilities, Standard pricing and processing conditions, payout requirements, funds-available and payout timing, geography, and verification.
- Sources: [What is Givebutter?](https://help.givebutter.com/en/articles/1726586-what-is-givebutter-and-how-does-it-work), [Standard pricing](https://help.givebutter.com/en/articles/1512762-givebutter-standard-pricing-explained), [Campaign creation](https://help.givebutter.com/en/articles/125627-how-to-create-a-campaign-to-start-raising-funds), [Withdrawals](https://help.givebutter.com/en/articles/1761146-how-to-withdraw-funds), [Stripe Connect payout setup](https://help.givebutter.com/en/articles/10401823-how-to-add-your-bank-account-and-payout-information-with-stripe-connect), [Countries and currencies](https://help.givebutter.com/en/articles/1726542-supported-countries-and-currencies-on-givebutter), and [Who can use Givebutter](https://help.givebutter.com/en/articles/1726576-who-can-use-givebutter-and-what-can-i-raise-money-for).
- Unknown/unavailable: instant-payout eligibility remains dynamic and is not represented as a fixed rule.
- Conflicts requiring review: none.

### RaiseRight — new record preserved

- Programs: `gift-card-fundraising`, `shop-online-earnings`, `local-dining-earnings`, and `travel-booking-earnings`.
- Preserved data: enrollment workflow, formats/fulfillment, variable earnings and transaction fees, year-round duration, merchant conditions, and verification.
- Schema corrections: the four programs now use distinct `gift-cards`, `shopping-rewards`, `card-linked-dining-rewards`, and `travel-booking-rewards` taxonomy values. Recurring monthly direct-deposit and monthly/quarterly check disbursements are stored in the narrow `payout_schedules` structure rather than misrepresented as elapsed payout duration.
- Sources: [Starting a New Program](https://www.raiseright.com/resources/organization/starting-a-new-program/), [Gift Card Fundraising](https://www.raiseright.com/how-it-works/gift-card-fundraising), [Shop Online and Earn](https://www.raiseright.com/how-it-works/shop-online), [2026 program overview](https://www.raiseright.com/hubfs/Flyer_RaiseRightOverview_2026.pdf), and [Organization payout timelines](https://support.raiseright.com/hc/en-us/articles/44381442013075-Organization-earnings-payout-timelines).
- Unknown/unavailable: merchant rates/exclusions and local-dining availability vary; equivalent Canadian program terms were not established.
- Conflicts requiring review: none.

## Schema stress test

The corrected model represents every retained pilot fact without forcing it into an inappropriate field, duplicating it unnecessarily, or reducing a queryable timing/taxonomy fact to misleading prose:

1. Provider economics is explicit and inherited only through `economics_mode: inherit-provider`. A program-specific object is a complete override; cross-level arrangements are never implicitly merged.
2. Timing has separate setup/lead, campaign, fulfillment, funds-available, and elapsed payout fields. Exact, minimum, typical, maximum, open-ended, and ranged values support minutes, hours, days, calendar days, business days, weeks, and months.
3. Recurring `payout_schedules` stores only disbursement frequency, delivery method, anchor, conditions, and caveats when elapsed duration would be inaccurate. It is not a general scheduling framework.
4. RaiseRight's materially different purchase-linked models have distinct controlled product/service taxonomy values.
5. The program matcher continues to prioritize stable ID, slug, and name before URL, so distinct programs may share one official landing page without being collapsed.

No additional national/provider-level schema blocker remains. The location-level boundary below is deliberate and does not block provider ingestion.

## Local discovery findings

GroupRaise confirms that location results need a future local-opportunity entity linked to provider and program. It should support stable location identity, address/postal code, coordinates or search/service radius, locally available formats and order channels, local economics and qualification rules, booking/availability windows, active/effective state, and location-level sources with checked dates.

The current model may state that a program is location-dependent, but must not flatten restaurant inventory or ZIP results into provider geography, duplicate a program per location, or imply nationwide local availability. Location/ZIP ingestion must wait for that subsystem; national/provider ingestion does not need to wait.

## Data quality

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Providers | 9 | 11 | +2 |
| Programs | 12 | 18 | +6 |
| Sources | 15 | 34 | +19 |

- Duplicate provider IDs, slugs, normalized names, or canonical domains: 0.
- Duplicate program IDs: 0.
- Duplicate source IDs: 0.
- Exact pilot intake failures: 0; all five records are update candidates and publish-ready.
- Exact pilot post-publication diff count: 0 for all five records.
- Unresolved research fields: World's Finest Chocolate exact 200-case tier; GroupRaise location-level inventory/terms; Givebutter dynamic instant-payout eligibility; RaiseRight merchant/location variability and Canadian equivalency.
- Canonical schema validation failures: 0.

## Validation

- Provider schema and canonical corpus validation: passed for all 11 providers.
- Intake validation: 5/5 pilot records publish-ready; 0 likely duplicates; 0 failures.
- Pilot publication/serialization round-trip: 5/5 passed; 0 issues; 0 post-publication diffs.
- Finder-focused tests: 33/33 passed, including commercial-firewall invariance and shared intake coverage.
- Full test suite: 63/63 passed.
- Production build: passed; 61 pages built.
- `git diff --check`: passed.

## Recommendation

**READY FOR BULK INGESTION**

Freeze the corrected schema for national/provider-level ingestion. Continue treating location/ZIP opportunity ingestion as a separate future subsystem and do not start it through the provider corpus.
