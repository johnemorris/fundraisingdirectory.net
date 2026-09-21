# Bulk Provider Ingestion — Batch 3

Date: 2026-09-20

## Coverage Before Selection

The Batch 3 baseline contains 31 providers, 48 programs, and 104 authoritative sources. All canonical records and the Batch 1 and Batch 2 reports were reviewed before selection.

The corpus is already sufficiently broad for generic donation forms, crowdfunding, peer-to-peer fundraising, events, auctions, school/team audiences, online and hybrid channels, and ordinary cash outcomes. Product sales cover every frozen product category except `fundraising-consulting`, although many physical-product categories have only one direct example.

The most meaningful remaining gaps were:

- only one collection/reuse provider and no electronics or recycling-drive activity;
- no `donated-goods`, `food`, `services`, or `volunteer-support` outcomes;
- one grant-research provider and no lower-cost search-focused alternative;
- medical and transplant personal fundraising represented only indirectly by general-purpose platforms;
- read-a-thons present as features of broad platforms, but no dedicated literacy-first provider;
- no fundraising-consulting service despite an approved product/service taxonomy value;
- community crowdfunding and matching-grant programs represented weakly;
- international platforms existed, but none centered a vetted worldwide nonprofit network with country-sensitive fees and disbursement rules.

Geography was heavily weighted toward U.S.-nationwide providers (23 of 31), with five international, three Canada, two U.S.-regional, and one local provider. Organization/group types were already broadly represented. Cause tagging was sparse: most cause-specific coverage came from Tiltify, while health/medical, organ transplant, environment, and community development each had at most two providers.

## Providers Selected

| Provider | Programs planned | Primary model | Specific coverage reason | Expected taxonomy contribution |
| --- | --- | --- | --- | --- |
| FundingFactory | Cartridge Recycling Fundraiser | Collection/reuse recycling | Adds a second collection/reuse model and the first electronics/recycling-drive activity. | `collection-reuse-fundraising`; `electronics-drive`; `recycling-drive`; `collection-logistics`; environment cause. |
| CARS (Charitable Adult Rides & Services) | Nonprofit Vehicle Donation Program | Donated-vehicle conversion for nonprofits | Adds donated vehicles, managed pickup/auction, net-proceeds economics, and a distinct in-kind fundraising flow. | `in-kind-resource-fundraising`; `donated-goods`; fulfillment and reporting. |
| Help Hope Live | Medical Fundraising Campaign | Medically verified fiscal-style personal fundraising | Adds a materially different individual/family model where a nonprofit holds funds and pays verified medical expenses. | medical, transplant, disability, and family causes; individual beneficiary; crowdfunding and events. |
| GrantStation | GrantStation Membership | Subscription grant research | Adds a lower-cost search-focused alternative to Instrumentl and improves the single-provider grant category without duplicating full lifecycle management. | `grant-seeking`; `grant-search`; grants outcome. |
| Read-A-Thon | School Read-A-Thon | Dedicated literacy pledge event | Adds a purpose-built literacy fundraiser with two reward/economics models and split post-event payouts. | `pledge-athon`; `readathon`; participant pages, leaderboards, fulfillment; education cause. |
| Give InKind | InKind Support Page | Coordinated in-kind/community support | Adds care calendars, wishlists, meals, rides, childcare, gift cards, and connected fundraising without pretending the provider handles outside donations. | `in-kind-resource-fundraising`; food, services, volunteer support, donated goods; individual/family beneficiaries. |
| Graham-Pelton | Fundraising Consulting Services | Bespoke nonprofit consulting | Closes the only absent product/service taxonomy value and adds a service-led, quote-based model rather than another software platform. | `fundraising-consulting`; direct-donation/campaign support; international nonprofit service. |
| Patronicity | Civic Crowdfunding and Crowdgranting | Community crowdfunding with conditional matching grants | Adds place-based civic projects, all-or-nothing/partial funding, coaching, and public/private matching-grant programs. | crowdfunding, grant seeking, giving matching, grants, community cause, volunteer support. |
| GlobalGiving | GlobalGiving Nonprofit Partnership | Vetted international nonprofit project fundraising | Adds worldwide nonprofit vetting, differentiated international fees and delivery, corporate/matching access, and monthly/quarterly country-specific disbursement. | international crowdfunding, matching, workplace giving, disaster/community causes, nonprofit beneficiaries. |

All nine identities and primary domains are distinct from the canonical corpus. The selection was based only on coverage value and available primary documentation.

## Candidates Considered But Skipped

| Candidate | Reason skipped |
| --- | --- |
| FlipGive | As of 2025 FlipGive is part of RaiseRight, and current U.S. terms are contracted through RaiseRight. The canonical RaiseRight record already covers gift cards, online shopping, dining, travel, and the same monthly/quarterly payout structure; a separate provider record would risk duplicating one service family. |
| Kroger Community Rewards | Legitimate passive grocery rewards, but ShopRaise, RaiseRight, Box Tops, and the broader purchase-linked category already provide adequate V1 representation. Its local store/account availability would add more location detail than model diversity. |
| Panda Express Fundraiser | National/virtual restaurant events are useful, but the corpus already includes GroupRaise, Chipotle, and RaiseRight dining rewards. The incremental value did not exceed the remaining gaps selected above. |
| Give Lively | Strong nonprofit platform, but the fee-free donation/event/peer-to-peer model substantially overlaps Zeffy, Givebutter, BetterWorld, and Donorbox. |
| RallyUp | Raffles, auctions, sweepstakes, and event fundraising overlap the existing BetterWorld, OneCause, Givebutter, and Pledge It coverage. |
| Candid Foundation Directory | Authoritative grant research, but GrantStation offered clearer current public pricing and member-use documentation for a defensible profile. It may be reconsidered if the grant-research category needs a third alternative. |
| TerraCycle | Strong recycling operator, but reviewed public materials did not establish a comparably clear general-purpose fundraising payout program. FundingFactory directly documents fundraising economics and participant terms. |
| GotSneakers | Valid collection fundraiser, but it would largely duplicate Funds2Orgs' shoe-drive model rather than broaden collection/reuse coverage. |
| General product-sale vendors | Additional candy, popcorn, gift-wrap, flower, and cookie-dough vendors were not selected because those categories are already represented and no reviewed candidate added a materially different V1 operating model. |

## Providers Ingested

All nine selected providers were new canonical records. No existing provider record was rewritten. The Little Caesars `$6`/`$7` profit conflict remains `needs-recheck` and was not altered.

### FundingFactory

- **Program:** Cartridge Recycling Fundraiser.
- **Model and coverage:** U.S. cartridge collection/reuse with the corpus's first `electronics-drive` and `recycling-drive` activity tags.
- **Taxonomy:** Collection/reuse and in-kind fundraising; collection logistics and reporting; cash outcome; environment, community, and education causes.
- **Economics:** No registration cost; variable current buyback value per accepted cartridge; $25 check threshold; possible $12 deduction for an underfilled prepaid-label box.
- **Eligibility/geography:** U.S. schools, nonprofits, churches, troops, and community groups; qualifying-item, packing, and condition rules apply.
- **Sources (4):** [program](https://www.fundingfactory.com/), [terms](https://www.fundingfactory.com/terms.aspx), [qualifying list](https://www.fundingfactory.com/qualifying-list-detail.aspx), and [provider overview](https://www.fundingfactory.com/about.aspx).
- **Unresolved:** The reviewed official material does not publish a universal check-delivery time. Qualifying items and values are intentionally modeled as variable.

### CARS (Charitable Adult Rides & Services)

- **Program:** Nonprofit Vehicle Donation Program.
- **Model and coverage:** Turnkey vehicle-donation intake, pickup, title/tax handling, sale, reporting, and net-proceeds remittance for nonprofit partners.
- **Taxonomy:** In-kind and collection/reuse fundraising; donated-goods and cash outcomes; collection logistics, reporting, and email marketing.
- **Economics:** No monthly, annual, or setup charge; negotiated percentage of net sale proceeds after operating expenses; the partner does not absorb a negative-result vehicle.
- **Eligibility/geography:** Approved nonprofit partners in the contiguous United States and D.C., with documented service areas in Alaska and Hawaii.
- **Sources (2):** [partner services](https://careasy.org/services) and [partner FAQ](https://partner-faq.careasy.org/partners-faq).
- **Unresolved:** A universal revenue-share percentage is not published. CARS says disbursements occur once or twice weekly; both exact cadences are preserved in timing notes because the frozen enum cannot express them.

### Help Hope Live

- **Program:** Medical Fundraising Campaign.
- **Model and coverage:** A medically and financially verified nonprofit-administered personal campaign. Help Hope Live holds funds and pays or reimburses approved medical and related expenses rather than transferring unrestricted cash.
- **Taxonomy:** Donations, crowdfunding, events, and matching; medical, transplant, disability, and family causes; cash, equipment, and services outcomes.
- **Economics:** No setup fee; 3% administrative fee; 2.65% online processing; $10 minimum donation.
- **Eligibility/geography:** People in all 50 states and Puerto Rico with verified transplant, catastrophic injury, or illness expenses, documented need, medical verification, and community fundraising support.
- **Sources (4):** [FAQ](https://helphopelive.org/about/faqs/), [application overview](https://helphopelive.org/get-started/request-help/), [fee notice](https://helphopelive.org/we-reduced-our-admin-fee/), and [501(c)(3) explanation](https://helphopelive.org/what-is-a-501c3/).
- **Unresolved:** No universal application-review or approved-expense request-processing duration is published.

### GrantStation

- **Program:** GrantStation Membership.
- **Model and coverage:** Subscription grant research and planning for nonprofit and grant professionals; it is not represented as a grantmaker.
- **Taxonomy:** Grant seeking; grant search, grant management, and reporting capabilities; grants outcome.
- **Economics:** The reviewed one-year membership offer is $139; other memberships, organizational licenses, webinars, and courses may have different prices.
- **Eligibility/geography:** Individual-user licensing, with a narrow sharing exception for nonprofits under $100,000 in budget; U.S., Canadian, and international grantmaker databases.
- **Sources (3):** [membership offer](https://grantstation.com/product/grantstation-membership-just-write-grants), [member benefits](https://grantstation.com/why-join/member-benefits-old), and [terms](https://grantstation.com/eula).
- **Unresolved:** The reviewed pages do not publish a definitive list of countries from which a membership may be purchased.

### Read-A-Thon

- **Program:** School Read-A-Thon.
- **Model and coverage:** Dedicated school literacy pledge event with reader pages, minute tracking, leaderboards, and optional managed rewards.
- **Taxonomy:** Pledge-a-thon, peer-to-peer, and events; `readathon`; event and peer-to-peer platform; cash and supplies outcomes.
- **Economics:** No startup fee, contract, or fundraising minimum; schools receive 80% when they manage rewards or 75% with the Read-A-Thon reward store.
- **Eligibility/geography:** Authorized schools or organizations, all grade levels, with adult activation for readers under 18; official material describes global use.
- **Sources (3):** [program overview](https://www.read-a-thon.com/info/landing_page/), [FAQ](https://www.read-a-thon.com/info/faqs), and [terms](https://www.read-a-thon.com/terms.php).
- **Unresolved:** The official pages do not publish a definitive organizer-country list. The split payments—about 10 days after the event and the reserve 20 days later—are event-triggered elapsed timing, not recurring payout cadence.

### Give InKind

- **Program:** InKind Support Page.
- **Model and coverage:** Community support coordination through care calendars, meals, rides, childcare, wishlists, updates, and gift cards, with clearly separated links to outside cash-fundraising services.
- **Taxonomy:** In-kind fundraising; food, services, volunteer-support, and donated-goods outcomes; individual/family, organization, and community beneficiaries.
- **Economics:** Standard pages are free; connected third-party donations are not handled by Give InKind; gift-card recipients receive 100% of face value; supporters may leave an optional tip.
- **Eligibility/geography:** Pages may support the organizer, another person, or an organization, and the service is described as available to anyone anywhere, subject to merchant and third-party service availability.
- **Sources (3):** [how it works](https://www.giveinkind.com/how-inkind-works), [FAQ](https://www.giveinkind.com/faq), and [fee documentation](https://help.giveinkind.com/en/articles/4044399-is-there-a-fee-for-using-give-inkind).
- **Unresolved:** Current universal Premium Page pricing was not established from the reviewed pages.

### Graham-Pelton

- **Program:** Fundraising Consulting Services.
- **Model and coverage:** Bespoke campaign planning, feasibility, data, communications, and interim staffing for nonprofit institutions; this closes the previously unused `fundraising-consulting` product/service value.
- **Taxonomy:** Fundraising consulting supporting direct donations and campaigns; services outcome; nonprofit, education, health, arts, community, and international-impact audiences.
- **Economics:** Custom quote based on scope, staff, project size, and timeframe; no universal price is published.
- **Eligibility/geography:** Exclusively nonprofit clients, primarily large institutions; documented work across North America, Europe, and Australia.
- **Sources (3):** [services](https://grahampelton.com/), [company/service facts](https://grahampelton.com/llm-info/), and [contact/intake](https://grahampelton.com/contact/).
- **Unresolved:** Timing is explicitly `researched-unknown`; engagements are tailored and no universal duration is published.

### Patronicity

- **Programs:** Civic Crowdfunding; Crowdgranting Matching Grants.
- **Model and coverage:** Coached, place-based crowdfunding plus materially distinct public/private matching-grant programs whose eligibility and match conditions depend on the funding partner.
- **Taxonomy:** Crowdfunding, grant seeking, and giving matching; crowdfunding pages, reporting, grants, cash, and volunteer support; community and local-nonprofit beneficiaries.
- **Economics:** No upfront charge; 5% platform fee plus Stripe 2.6% + $0.30 for online contributions; match amounts and thresholds are program-specific.
- **Eligibility/geography:** Individuals, groups, nonprofits, municipalities, and businesses may propose eligible community projects in the U.S. or Canada. Personal bills, medical costs, political campaigns, and other excluded uses are not eligible.
- **Sources (4):** [provider overview](https://www.patronicity.com/about-us), [crowdfunding documentation](https://impact.patronicity.com/crowdfunding), [crowdgranting overview](https://www.patronicity.com/home), and [FAQ](https://www.patronicity.com/faq).
- **Unresolved:** No universal campaign, transfer, grant-award, or match threshold applies. Current local eligibility cannot be represented at ZIP/location level and is preserved as a future location-subsystem boundary.

### GlobalGiving

- **Program:** GlobalGiving Nonprofit Partnership.
- **Model and coverage:** Vetted worldwide nonprofit project fundraising with individual campaigns, recurring gifts, matching and corporate programs, workplace giving, training, reporting, and country-sensitive disbursement.
- **Taxonomy:** Donations, crowdfunding, peer-to-peer, and matching; donation/crowdfunding/peer-to-peer platform; cash and grants; nonprofit and community beneficiaries.
- **Economics:** No setup or subscription fee; 12% on the initial $5,000 and GlobalGiving-managed donations; thereafter 5% for U.S./U.K. organizations and 7% for other international organizations; 3% processing; documented $250 international payout threshold.
- **Eligibility/geography:** Registered nonprofits worldwide subject to legal, financial, operational, leadership, and compliance due diligence plus quarterly project reporting; GlobalGiving reports work in more than 175 countries.
- **Sources (6):** [how it works](https://www.globalgiving.org/aboutus/how-it-works/), [fees](https://www.globalgiving.org/aboutus/fee/), [nonprofit program](https://www.globalgiving.org/nonprofits/), [vetting](https://www.globalgiving.org/aboutus/how-it-works/vetting/), [partner handbook](https://www.globalgiving.org/nonprofit-partner-handbook/start-fundraising/), and [China disbursement timing](https://support.globalgiving.org/hc/en-us/articles/8407592519444-When-will-my-organization-receive-the-money-we-raised-for-organizations-registered-in-China).
- **Unresolved:** FXecute and wire are not available delivery-method enum values, so they are retained verbatim in timing/logistics notes. Country-specific law, banking, and compliance can affect actual delivery.

## Coverage After Batch 3

The batch closed or materially improved the targeted gaps:

- collection/reuse providers increased from 1 to 3, while `electronics-drive` and `recycling-drive` moved from 0 to 1;
- in-kind resource providers increased from 1 to 4;
- grant-seeking providers increased from 1 to 3, and the grants outcome increased from 1 to 4;
- the dedicated `readathon` subtype increased from 2 broad-platform examples to 3 total examples;
- `fundraising-consulting` moved from 0 to 1;
- individual/family beneficiary coverage increased from 5 to 7, community-cause coverage from 10 to 14, and local-nonprofit coverage from 5 to 8;
- health/medical cause coverage increased from 1 to 5, environment from 1 to 5, community/neighborhood from 2 to 7, and education/literacy from 2 to 6;
- previously absent outcomes are now represented: donated goods by 2 providers, food by 1, services by 3, and volunteer support by 2;
- collection logistics increased from 1 to 3, grant search and grant management from 1 to 2 each, matching gifts from 3 to 5, and workplace giving from 1 to 2.

Generic donation, crowdfunding, peer-to-peer, events, auctions, product sales, school/team audiences, online/hybrid channels, and cash outcomes are now sufficiently represented for V1 breadth. The batch also adds defensible examples of reverse logistics, nonprofit-administered medical fundraising, subscription research, consulting, crowdgranting, coordinated in-kind support, and internationally differentiated disbursement.

Remaining thin categories are mostly narrow rather than foundational. `creator-livestream`, `gaming-livestream`, `gala`, `prize-drawing`, `electronics-drive`, `recycling-drive`, and `shoe-drive` each have one provider. `fundraising-consulting`, print-on-demand, and gaming remain single-provider or otherwise thin product/capability areas. Hunger, veterans, animals, and organ transplant remain cause-level weak spots, and food and technology remain single-provider outcomes.

## Data Quality

| Measure | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Providers | 31 | 40 | +9 |
| Programs | 48 | 58 | +10 |
| Authoritative sources | 104 | 136 | +32 |

- **Successfully ingested:** 9 of 9 selected providers; every record is approved internal research and round-trips as a publish-ready update.
- **Candidates skipped/rejected:** 9 candidate groups recorded above; none were partially published.
- **Batch 3 unresolved/recheck claims:** One formal missing-data state—Graham-Pelton timing is `researched-unknown`. Other provider-specific unknowns are explicitly described in their entries rather than guessed, including variable prices, unpublished universal timing, country lists, and location-specific match rules.
- **Existing recheck preserved:** Little Caesars remains `needs-recheck` for conflicting official `$6` and `$7` profit claims.
- **Duplicates detected:** 0 provider IDs, 0 slugs, 0 normalized names, 0 normalized primary domains, 0 program IDs, and 0 source IDs.
- **Existing-provider modifications:** None. Batch 3 added only the nine selected canonical records.

## Schema Stress

No important fact was lost, forced into an incorrect concept, or attached to the wrong provider/program.

Awkward but accurate representations were:

- **Recurring cadence:** CARS is the one Batch 3 provider with unsupported cadence values. Its once-weekly or twice-weekly disbursement schedule is preserved verbatim in timing notes, separate from the structured five-business-day elapsed payout limit.
- **Accumulated cadence evidence:** Across the ingestion work, authoritative providers now expose daily, weekly, twice-weekly, biweekly, and semiannual schedules outside the frozen monthly/quarterly enum. This repeated evidence justifies a future controlled cadence-enum review, but no Batch 3 fact is lost and the issue is not a blocker.
- **International delivery methods:** GlobalGiving's FXecute and wire delivery paths do not fit the current delivery-method enum. They remain accurately associated with its monthly schedule in caveats and logistics notes; ACH/check are already structurally supported.
- **Reverse logistics:** FundingFactory and CARS receive items from participants rather than delivering products to them. `fulfillment: not-applicable` plus structured collection-logistics capability and detailed logistics notes avoids falsely asserting outbound provider delivery.
- **Third-party money movement:** Give InKind links to GoFundMe, PayPal, Venmo, and Cash App but does not process those funds. That boundary is preserved in economics and logistics rather than treating Give InKind as the payment processor.
- **Local program availability:** Patronicity crowdgrant eligibility and match terms vary by partner geography. Provider/program-level notes preserve this accurately; ZIP- and location-specific opportunities remain outside the frozen provider schema.

There is no true schema blocker. No frozen-schema or Finder-policy change was made.

## V1 Corpus Assessment

At 40 providers and 58 materially distinct programs, the corpus has adequate V1 breadth across the major fundraising models. Another broad ten-provider batch would be more likely to duplicate already-strong donation, event, auction, restaurant, and product-sale categories than to improve Finder coverage.

A smaller, explicitly targeted final batch of roughly four to six providers could still add useful depth if primary evidence supports it. The best remaining targets are a distinct textile/clothing or food/supply collection model; stronger hunger, veterans, animal, or transplant cause representation; and a second materially different print-on-demand, gaming, or workplace-giving option. Selection should remain coverage-driven, and the next effort should stop if candidates do not clear that threshold.

## Validation Results

- Provider schema/canonical corpus validation: **passed** for all 40 YAML records during the production content sync and the explicit corpus audit.
- Intake validation: **passed** — 9 parsed, 9 update candidates after publication, 9 publish-ready, 0 validation failures, 0 issues.
- Publication/round trip: **passed** — all 9 records dry-run as updates to their intended canonical files with `Publish-ready: yes`.
- Finder-focused tests: **passed** — 10 of 10, including deterministic ranking, hard constraints, and the commercial metadata firewall.
- Focused schema/intake/taxonomy tests: **passed** — 37 of 37.
- Full test suite: **passed** — 63 of 63.
- Production build: **passed** — 90 static pages generated, including all nine new provider profiles.
- Duplicate audit: **passed** across provider IDs, slugs, normalized names, normalized domains, program IDs, and source IDs.
- Commercial firewall: **passed**; affiliate, sponsorship, featured, and commercial-research state remain excluded from Finder scoring.
- `git diff --check`: **passed**; an explicit trailing-whitespace scan of the untracked Batch 3 artifacts also passed.

## Final Recommendation

**BATCH 3 PASSED — SMALL TARGETED BATCH RECOMMENDED**

Batch 3 added nine defensible, nonduplicate providers and ten programs that close meaningful taxonomy and operating-model gaps. The schema preserved every important fact without a blocker, all validation gates passed, and the corpus now has broad V1 coverage. Any additional ingestion should be a small gap-closing batch, not another quota-driven set of ten.
