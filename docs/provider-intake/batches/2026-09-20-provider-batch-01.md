# Bulk Provider Ingestion — Batch 1

Date: 2026-09-20

## Outcome

Batch 1 added 10 new providers through the approved intake and publication workflow without changing the frozen provider schema, Finder ranking policy, UI, or any of the 11 pre-batch provider records. All 10 records validate and reproduce their canonical YAML with zero round-trip diffs.

One editorial review item remains: current official Little Caesars pages conflict between $6 and $7 profit per standard item. The canonical record preserves the conflict as a variable value, marks each conflicting economics claim `needs-recheck`, and is `partially-verified` with review status `needs-recheck`.

## Starting Inventory and Selection

The starting corpus contained 11 providers: Booster, Charleston Wrap, DonorsChoose, Double Good, Fundraising.com, Givebutter, GoFundMe, GroupRaise, RaiseRight, Snap! Raise, and World's Finest Chocolate.

The selected providers and their coverage rationale were:

- Zeffy — fee-free nonprofit giving, events, auctions, peer-to-peer, in-person payments, and donor management.
- Donorbox — international donation forms, crowdfunding, peer-to-peer, events, and recurring giving.
- OneCause — nonprofit auctions, events, mobile bidding, sponsorships, and peer-to-peer campaigns.
- 99Pledges — school/team pledge-a-thons and participant fundraising pages.
- Bonfire — print-on-demand merchandise fundraising with provider fulfillment.
- Funds2Orgs — shoe collection and reuse fundraising, adding a non-sale collection model.
- ShopRaise — purchase-linked passive fundraising through online shopping and digital gift cards.
- Chipotle Community Fundraising — a local restaurant give-back model.
- Little Caesars Fundraising — prepared-food product fundraising with three materially different fulfillment paths.
- BetterWorld — integrated auctions, events, donations, peer-to-peer, crowdfunding, and a-thons.

All are directly relevant to fundraising groups or organizations. No generic payment processor or unrelated ecommerce product was included.

## Providers Added

### Zeffy

- Programs: All-in-One Fundraising Platform.
- Model and taxonomy: direct donations, crowdfunding, peer-to-peer, events, auctions, donation forms, ticketing, mobile giving, online store, CRM, and analytics.
- Economics: $0 setup, platform, and payment-processing fees; donor contributions to Zeffy are optional.
- Eligibility: qualifying registered nonprofit or charitable organization with an organization-owned bank account; individuals are ineligible.
- Geography: organizations in the United States, Canada, United Kingdom, Ireland, Australia, and Germany.
- Sources: 3 official provider/support sources.
- Unresolved/recheck: no verification conflict. Weekly default payouts and account-specific next-day eligibility are retained accurately in timing notes because the frozen recurring-schedule enum does not include weekly cadence.

### Donorbox

- Programs: Donorbox Fundraising Platform.
- Model and taxonomy: donation forms, hosted pages, crowdfunding, peer-to-peer, event ticketing, text/QR giving, tap-to-pay, recurring giving, and donor management.
- Economics: Standard plan platform fees of 2.95% for core giving and 3.95% for tickets, memberships, and supporter peer-to-peer; processor fees are separately structured, including qualifying United States nonprofit Stripe terms.
- Eligibility: nonprofits, other organizations, and individuals may fundraise; 501(c)(3) status is not universally required, but payment-processor and local-law requirements apply.
- Geography: international where connected Stripe or PayPal services are available; country-specific processor availability and payout terms vary.
- Sources: 3 official provider/program sources.
- Unresolved/recheck: exact supported-country list is intentionally not inferred.

### OneCause

- Programs: OneCause Fundraising Platform.
- Model and taxonomy: nonprofit events, auctions/mobile bidding, online giving, text giving, peer-to-peer, ticketing, sponsorship management, and analytics.
- Economics: published pay-as-you-go and annual package terms are structured; quote-dependent and unpublished caps remain caveated rather than inferred.
- Eligibility: registered nonprofit, charitable organization, or other qualified donee in the United States or Canada; account/user requirements apply.
- Geography: United States and Canada.
- Sources: 3 official platform, pricing, and terms sources.
- Unresolved/recheck: standardized setup, funds-availability, and payout timing was not established and is explicitly `researched-unknown`.

### 99Pledges

- Programs: Pledge and A-Thon Fundraising.
- Model and taxonomy: pledge-a-thons, peer-to-peer, crowdfunding, participant pages, leaderboards, and school/team activities including runs, walks, and read-a-thons.
- Economics: no setup/platform fee; 3.49% plus $0.49 for online donations.
- Eligibility: schools, teams, nonprofits, and other groups; activity-based campaigns require results before payment is requested.
- Geography: United States payout paths were established.
- Sources: 3 official provider/help sources.
- Unresolved/recheck: none material.

### Bonfire

- Programs: Merch Fundraising Campaigns.
- Model and taxonomy: apparel/spirit-wear product sales, crowdfunding, optional donations, online store, print-on-demand, and direct or group fulfillment.
- Economics: no campaign setup fee; profit is sale price minus variable product base cost; optional-contribution processing is 8%, reduced to 3.5% for verified nonprofits; payout minimums vary by delivery method.
- Eligibility: anyone may sell; verified nonprofit status and an authorized role are required for nonprofit-specific benefits.
- Geography: international shipping is available subject to destination restrictions; nonprofit verification is United States-specific.
- Sources: 5 official provider/help sources.
- Unresolved/recheck: exact product base costs and destination coverage vary and are not flattened into a universal figure.

### Funds2Orgs

- Programs: Shoe Drive Fundraiser.
- Model and taxonomy: shoe-drive collection, reuse, in-kind resource fundraising, collection logistics, and cash payout by accepted weight.
- Economics: standard collection materials, coaching, and pickup support have no upfront charge; payment is variable by accepted pounds and program, with no universal official per-pound rate published.
- Eligibility: participating groups collect paired gently worn, used, or new shoes and follow packing/pickup instructions; Funds2Orgs does not issue charitable tax receipts.
- Geography: United States collection support with processing through the Florida warehouse.
- Sources: 2 official provider/program sources.
- Unresolved/recheck: the universal per-pound payout is unavailable. Reverse collection is modeled through the collection method, capability, and logistics; product fulfillment is correctly `not-applicable`.

### ShopRaise

- Programs: Online Shopping Rewards; Digital Gift Card Rewards.
- Model and taxonomy: everyday passive fundraising, shopping rewards, and digital gift cards.
- Economics: no enrollment fee; merchant-funded contributions are variable and advertised up to 10%; both programs explicitly inherit the provider economics.
- Eligibility: organizations and individuals may create causes; 501(c)(3) status is not required.
- Geography: United States; participating merchants and offers vary.
- Sources: 5 official provider/help sources.
- Unresolved/recheck: merchant-specific rates and exclusions vary. The provider calls payout delivery an eCheck, which is preserved in schedule caveats because the frozen delivery-method enum has no eCheck value. “Within minutes” gift-card delivery is retained as source language without inventing an exact duration.

### Chipotle Community Fundraising

- Programs: Chipotle Restaurant Fundraiser.
- Model and taxonomy: restaurant/business partnership and a scheduled local fundraising event using in-person and coded pickup orders.
- Economics: 25% give-back when the event reaches the published $150 minimum sales threshold.
- Eligibility: qualifying organizations apply at least three weeks ahead, provide tax/payment information, and comply with organization and promotion restrictions; individuals are not eligible.
- Geography: local, tied to one approved participating United States restaurant.
- Sources: 3 official provider/program/FAQ sources.
- Unresolved/recheck: location participation and appointment availability remain location-dependent and are not represented as national inventory.

### Little Caesars Fundraising

- Programs: Brochure Pizza Kit Fundraiser; Online Pizza Kit Fundraiser; Meal Deal Fundraiser.
- Model and taxonomy: prepared-food product sales with group delivery, direct-to-supporter shipping, and emailed digital redemption codes.
- Economics: shared provider economics are inherited by all three programs. Official pages conflict between $6 and $7 profit per standard sale, so the amount is represented as variable with a recheck caveat rather than choosing one figure.
- Eligibility: schools, teams, nonprofits, and other groups; online and Meal Deal programs state no minimum order, while no reliable current brochure minimum was established.
- Geography: United States and Canada, with product and restaurant availability dependent on postal code.
- Sources: 3 official provider/program sources.
- Unresolved/recheck: the $6-versus-$7 official-source conflict requires editorial review. Exact digital-code delivery time and a current brochure minimum remain unavailable.

### BetterWorld

- Programs: BetterWorld Fundraising Platform.
- Model and taxonomy: donations, crowdfunding, peer-to-peer, events, auctions, a-thons, ticketing, recurring giving, and donor management.
- Economics: provider-level plan and payment terms are inherited by the program, including the free, Flex, and Partner terms; card fees; Express payout fees; and the eligible automatic-payout threshold.
- Eligibility: nonprofits, businesses, and individuals may use the platform; on-behalf-of fundraisers need authorization, and raffle/giveaway organizers retain legal-compliance responsibility.
- Geography: best supported for United States organizations with a U.S. bank account; organizations elsewhere are directed to contact BetterWorld.
- Sources: 5 official provider/help sources.
- Unresolved/recheck: no claim conflict. Daily and weekly automatic-payout options remain in structured timing notes while the supported monthly option is structured; this avoids expanding the frozen cadence enum.

## Coverage Improvement

The batch materially improves V1 coverage for nonprofit platform suites, donation forms, international fundraising platforms, mobile bidding and auctions, pledge-a-thons, print-on-demand merchandise, collection/reuse drives, passive shopping rewards, gift cards, local restaurant events, and prepared-food fundraising. It also adds stronger examples of provider-level economics inheritance, program-specific economics, payout settlement versus funds availability, and recurring payout schedules.

Obvious later-batch gaps include additional grocery/scrip programs, coupon/discount-card fundraising, direct-sale consumer products beyond food and apparel, large-scale endurance/event platforms, workplace giving, and more regional restaurant programs. Location-level restaurant inventory must wait for the separate local-opportunity subsystem.

## Data Quality

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Providers | 11 | 21 | +10 |
| Programs | 18 | 31 | +13 |
| Sources | 34 | 69 | +35 |

- Successfully ingested: 10 of 10 selected providers.
- Rejected or skipped: 0.
- Existing providers modified: 0.
- True duplicates introduced: 0.
- Duplicate audit: no duplicate provider IDs, provider slugs, normalized names, cross-provider domains, program IDs, applicable within-provider program slugs, or source IDs.
- Intake duplicate review: Donorbox was initially conservatively matched to Givebutter because both drafts used the generic program name/slug “Online Fundraising Platform.” Official identities and domains established that they are distinct providers; the Donorbox program identity was made provider-specific, after which intake reported no duplicate candidate.
- Unresolved research fields in this batch: 1 — OneCause timing is `researched-unknown`.
- Recheck claims: Little Caesars provider economics, due to the official $6/$7 conflict.

## Schema Stress

No frozen-schema blocker was found.

- Zeffy and BetterWorld publish daily or weekly recurring payout options that the intentionally narrow V1 `payout_schedules.frequency` enum does not encode. Supported monthly schedules are structured, while the additional official cadences are preserved accurately in timing notes. No elapsed-duration field is misused.
- ShopRaise describes payout delivery as eCheck, which is not a frozen delivery-method enum value. The schedule remains structured with a null delivery method and an explicit eCheck caveat.
- Funds2Orgs reverses the usual fulfillment direction: supporters supply shoes to the provider. The collection/reuse method, shoe-drive subtype, collection-logistics capability, and logistics notes represent the fact accurately; outward product fulfillment is `not-applicable`.
- BetterWorld combines fixed and percentage Express payout fees. Separate structured arrangements with shared conditions preserve the composite fee without misleading aggregation.
- Chipotle availability is tied to individual restaurants. The provider record states `local` scope and program-level rules but does not create restaurant entities, ZIP results, or implied nationwide location availability.
- Little Caesars' three programs share URLs but remain distinct because their ordering, fulfillment, and settlement flows materially differ; the approved shared-URL behavior is preserved.

None of these facts was discarded, forced into an incorrect concept, or duplicated unnecessarily. The cadence and delivery vocabulary limitations are transparent, nonblocking V1 caveats worth monitoring during later batches.

## Validation Results

- Provider schema validation: passed for all 21 canonical providers.
- Intake validation before publication: 10/10 new records valid and publish-ready; 0 likely duplicates; 0 validation failures.
- Approved publication and round-trip validation: 10/10 update candidates publish-ready after publication; 0 issues; 0 field diffs.
- Canonical corpus validation: passed; 21 providers, 31 programs, and 69 sources.
- Finder tests: 10/10 passed, including affiliate/sponsor/featured/commercial zero-effect and serialization firewall coverage.
- Full test suite: 63/63 passed.
- Production build: passed; Astro generated 71 pages, including all 21 provider routes.
- Commercial firewall: preserved; commercial metadata remains excluded from Finder serialization and scoring.
- `git diff --check`: recorded after report completion.

## Final Recommendation

**BATCH 1 PASSED — REVIEW ITEMS BEFORE NEXT BATCH**

The frozen schema supported all 10 providers without a blocking distortion, and every validation gate passed. Editorial review should resolve or periodically recheck the Little Caesars official profit conflict before Batch 2; the recurring-cadence and eCheck vocabulary caveats should also be watched for repetition before any future schema decision.
