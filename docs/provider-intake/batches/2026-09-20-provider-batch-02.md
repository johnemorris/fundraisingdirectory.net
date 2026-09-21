# Bulk Provider Ingestion — Batch 2

Date: 2026-09-20

## Starting Inventory and Gap-Driven Selection

The pre-ingestion corpus contains 21 providers, 31 programs, and 69 authoritative sources. The Batch 1 report and all 21 canonical records were reviewed before selection. The most material gaps were zero representation for giving matching, grant seeking, sponsorship-focused platforms, workplace giving, grant search/management, gaming integrations, coffee/beverages, baked goods, flowers/plants, and discount-card/coupon-book products. Pledge/challenge, passive purchase-linked school fundraising, and direct-sale product variety were also thin.

The selected providers and their pre-ingestion coverage rationale are:

| Provider | Primary fundraising model | Specific gap addressed | Meaningful coverage beyond the current corpus |
| --- | --- | --- | --- |
| Double the Donation | Matching-gift and workplace-giving software | Giving matching; matching-gifts and workplace-giving capabilities | Adds employer-match discovery, submission, volunteer-grant, and payroll-giving support rather than another donation processor. |
| Instrumentl | Grant discovery and grant-management software | Grant seeking; grant-search and grant-management capabilities; grants outcome | Adds a structured pre-award and full-lifecycle grant workflow not represented by any current provider. |
| Tiltify | Livestream, gaming, digital, and personal fundraising | Gaming/creator livestream activities and gaming/livestream integrations | Adds cause fundraising built around streaming, interactive challenges, and a materially distinct personal-fundraising path. |
| Giving Bean | Coffee and tea product fundraising | Coffee/beverages product sales | Adds both local order-form/group-distribution and direct-ship online-store models for a product category with no current provider. |
| Dutch Mill Bulbs | Flower-bulb product fundraising | Flowers/plants product sales | Adds a seasonal garden-product fundraiser with brochure and direct-ship online fulfillment. |
| SaveAround | Physical coupon books and digital savings passes | Discount-card/coupon-book product sales | Adds physical consignment/returns and a distinct digital-pass model with different economics and fulfillment. |
| Krispy Kreme Fundraising | Doughnut, coffee, certificate, and digital-dozen fundraising | Baked-goods product sales | Adds established food fundraising with local order/pickup and digital redemption paths. |
| Pledge It | Peer-to-peer pledge and activity-challenge fundraising | Thin pledge/challenge and sponsorship coverage | Adds per-unit pledges, activity result finalization, participant challenges, sponsor matching, and daily settlement. |
| eTeamSponsor | School/team crowdfunding and institutional fundraising | Sports/team depth; sponsorship and institutional fundraising | Adds separate revenue-share and licensed campus crowdfunding products, monthly versus daily remittance, and explicit institutional sponsorship support. |
| Box Tops for Education | Purchase-linked receipt and connected-account school earnings | Passive grocery/purchase-linked fundraising | Adds app receipt scanning and connected-retailer earnings for eligible Pre-K–8 schools, with formal school enrollment and twice-yearly payments. |

All ten are new identities and domains relative to the canonical corpus. Selection was based only on editorial coverage and authoritative research availability; commercial metadata and monetization potential were not considered.

## Providers Added

All ten selections were new. No existing provider record, website domain, slug, provider ID, program ID, or source ID was duplicated.

### Double the Donation

- **Programs:** Matching and Workplace Giving.
- **Important data added:** giving-matching and sponsorship methods; matching-gift, workplace-giving, sponsorship-management, and reporting capabilities; Essentials usage tiers; published starting prices for Standard and Enterprise; Form 990-based Essentials qualification; U.S. scope; and the fact that employers or their foundations—not Double the Donation—approve and disburse funds.
- **Sources:** [pricing](https://doublethedonation.com/pricing/), [product overview](https://doublethedonation.com/product/), and [official tools FAQ](https://doublethedonation.com/our-tools-faq/).
- **Unknown/unavailable:** broader international organization availability and employer-specific approval/disbursement timing are not established as universal provider facts.
- **Conflicts:** none requiring review.

### Instrumentl

- **Programs:** Grant Discovery and Management Platform.
- **Important data added:** grant-seeking method; grant-search, grant-management, and reporting capabilities; current Discover, Pre-Award, Full Lifecycle, and Enterprise pricing structure; 14-day trial; U.S. grant and Form 990 coverage; and pre-award through post-award workflow details.
- **Sources:** [pricing](https://www.instrumentl.com/pricing), [nonprofit solution](https://www.instrumentl.com/solutions/nonprofits), and [funding-opportunity documentation](https://help.instrumentl.com/en/articles/3723776-which-kinds-of-funding-opportunities-does-instrumentl-have).
- **Unknown/unavailable:** Enterprise price is quote-based; universal eligibility and coverage outside the documented U.S. data set were not established.
- **Conflicts:** none requiring review.

### Tiltify

- **Programs:** Charity Digital and Livestream Fundraising; Tiltify Personal Fundraising.
- **Important data added:** gaming and creator livestream activity, livestream and gaming integrations, fitness challenges, match challenges, charity onboarding, a materially separate personal-fundraising path, 20-country personal-fundraising availability, charity review lead time, personal rolling hold, and currency-conversion economics.
- **Sources:** six official support articles covering the [platform](https://info.tiltify.com/support/solutions/articles/43000015876-what-is-tiltify-), [features](https://info.tiltify.com/support/solutions/articles/43000711613-what-features-does-tiltify-offer-that-can-impact-my-fundraising-campaign-), [fees](https://info.tiltify.com/support/solutions/articles/43000045885-what-are-the-fees-), [charity enrollment](https://info.tiltify.com/support/solutions/articles/43000008124-how-do-i-sign-my-organization-up-for-tiltify-), [personal fundraising](https://info.tiltify.com/support/solutions/articles/43000735715), and [supported countries](https://info.tiltify.com/support/solutions/articles/43000736446-supported-countries-on-tiltify-personal).
- **Unknown/unavailable:** there is no single universal charity fee because processor and plan terms vary; non-conversion personal-fundraising costs were not generalized beyond what the reviewed documentation supports.
- **Conflicts:** none requiring review.

### Giving Bean

- **Programs:** Order Form Fundraiser; Online Store Fundraiser.
- **Important data added:** coffee and tea products; distinct 40% local/order-form and 25% direct-ship online-store economics; no-upfront-cost and no-minimum claims; group distribution versus direct-to-supporter fulfillment; and published delivery ranges.
- **Sources:** [web-store fundraising](https://givingbean.com/webstore-fundraising/) and the [official FAQ](https://givingbean.com/faqs/).
- **Unknown/unavailable:** the FAQ expresses one delivery estimate in source-ambiguous “days,” so it is preserved without converting it to business or calendar days.
- **Conflicts:** none requiring review.

### Dutch Mill Bulbs

- **Programs:** Brochure Fundraiser; Online Fundraiser.
- **Important data added:** flowers and plants; provider-level 50% economics inherited by both programs; no upfront cost or minimum order; seasonal availability; brochure group distribution; online direct shipment; contiguous-48-state scope; free-shipping threshold; typical fulfillment; and online payout timing.
- **Sources:** [official provider page](https://dutchmillbulbs.com/), [how-to-fundraise page](https://dutchmillbulbs.com/how-to-fundraise/), and [terms](https://dutchmillbulbs.com/terms-of-use/).
- **Unknown/unavailable:** the exact seasonal assortment varies. The official biweekly online payout batch cannot use the frozen monthly/quarterly schedule enum and is retained in structured timing notes.
- **Conflicts:** none requiring review.

### SaveAround

- **Programs:** SaveAround Coupon Book Fundraiser; SaveAround Digital Pass Fundraiser.
- **Important data added:** discount-card/coupon-book products; materially different physical and digital programs; digital 50%–70% proceeds; no digital upfront cost or minimum; local-market offer variation; instant digital-pass delivery; two-to-four-week sales guidance; and check/ACH payout timing.
- **Sources:** the [fundraiser overview](https://savearound.com/pages/fundraiser-google), [support-our-groups page](https://savearound.com/pages/supportourgroups), and [digital-pass page](https://savearound.com/pages/digital-pass).
- **Unknown/unavailable:** current authoritative pages did not establish a reliable universal physical-book campaign/payout timeline, so physical-program timing is `researched-unknown`. An older page was not used as evidence for present terms.
- **Conflicts:** none requiring review.

### Krispy Kreme Fundraising

- **Programs:** Classic Pre-Sell; Classic One-Day Sale; Digital Dozens.
- **Important data added:** baked goods and coffee products; up-to-50% provider economics; separate pre-sell, upfront-inventory one-day-sale, and digital-certificate programs; three-day and 72-hour ordering lead times where applicable; pickup/distribution versus digital redemption; and participating-shop geography.
- **Sources:** [fundraising overview](https://www.krispykreme.com/fundraising/home), [pre-sell ordering](https://www.krispykreme.com/fundraising/pre-sell-order), [one-day sale ordering](https://www.krispykreme.com/fundraising/one-day-sale-order), and [Digital Dozens](https://www.krispykreme.com/fundraising/digital-dozens).
- **Unknown/unavailable:** no current universal order minimum was inferred; Digital Dozens timing is `researched-unknown`; assortment and availability depend on participating shops.
- **Conflicts:** none requiring review.

### Pledge It

- **Programs:** Pledge It Fundraising Suite.
- **Important data added:** pledge-athon, peer-to-peer, event, auction, sponsorship, and matching support; per-unit performance pledges; participant challenges and sponsor packages; published monthly/annual subscription pricing; charity and alternate-beneficiary requirements; and distinct flat-gift versus performance-pledge processing.
- **Sources:** [pricing](https://www.pledgeit.org/pricing), [peer-to-peer solution](https://www.pledgeit.org/solutions/peer-to-peer), [sponsorships](https://www.pledgeit.org/power-ups/sponsorships), [payments and security](https://www.pledgeit.org/platform/payments-security), and [terms](https://www.pledgeit.org/terms-of-service).
- **Unknown/unavailable:** Enterprise pricing is quote-based. Daily Stripe settlements cannot use the frozen payout frequency enum and are retained in structured timing notes alongside the conditional end-of-month pledge flow.
- **Conflicts:** none requiring review.

### eTeamSponsor

- **Programs:** TeamFunder; FundRaker.
- **Important data added:** separate revenue-share and annual-license models; participant-led sports/team fundraising; institutional giving days, events, ticketing, advertising, and sponsorships; TeamFunder’s starting organization share; FundRaker’s 100% proceeds after license terms; setup/campaign guidance; and materially different remittance models.
- **Sources:** the [official homepage](https://www.eteamsponsor.com/), [FAQ](https://www.eteamsponsor.com/faqs/), and [Why eTeamSponsor](https://www.eteamsponsor.com/why-eteamsponsor/).
- **Unknown/unavailable:** FundRaker license pricing and TeamFunder shares above the published starting point are not universal. TeamFunder’s monthly-by-the-10th schedule is structured; FundRaker’s daily gateway deposits remain explicit in timing notes because daily is outside the frozen enum.
- **Conflicts:** none requiring review.

### Box Tops for Education

- **Programs:** Box Tops for Education Program.
- **Important data added:** passive purchase-linked school fundraising; receipt scanning, emailed digital receipts, and connected retailer accounts; formal Pre-K–8 school and adult-user eligibility; 14-day receipt timing; up-to-30-day enrollment; variable product/bonus earnings; the annual school cap; and two anchored school-year payment dates.
- **Sources:** [official rules](https://boxtops4education.com/official-rules), [how to earn](https://boxtops4education.com/How-To-Earn), and [school enrollment](https://boxtops4education.com/enroll).
- **Unknown/unavailable:** the current rules do not publish one universal per-product amount. The December 31/April 30 semiannual schedule is retained in timing notes because `semiannual` is outside the frozen enum.
- **Conflicts:** none requiring review.

The pre-existing Little Caesars $6/$7 conflict was not touched or silently resolved.

## Coverage Analysis

The batch increased the corpus from 21 to 31 providers and from 31 to 48 programs. It closed every zero-coverage gap targeted by the selection except fundraising consulting, which remains a candidate for a later batch rather than a reason to exceed the ten-provider limit.

| Structured dimension | Providers before | Providers after |
| --- | ---: | ---: |
| `giving-matching` method | 0 | 3 |
| `grant-seeking` method | 0 | 1 |
| `sponsorships` method | 0 | 3 |
| `matching-gifts` capability | 0 | 3 |
| `workplace-giving` capability | 0 | 1 |
| `grant-search` / `grant-management` capabilities | 0 / 0 | 1 / 1 |
| `gaming-integrations` capability | 0 | 1 |
| `sponsorship-management` capability | 1 | 4 |
| `coffee-beverages` product/service | 0 | 1 |
| `baked-goods` product/service | 0 | 1 |
| `flowers-plants` product/service | 0 | 1 |
| `discount-cards-coupon-books` product/service | 0 | 1 |
| `gaming-livestream` / `creator-livestream` activity | 0 / 0 | 1 / 1 |
| `fitness-challenge` activity | 1 | 3 |
| `peer-fundraising-challenge` activity | 3 | 5 |
| `everyday-passive-fundraising` method | 2 | 4 |

This is a materially broader mix rather than ten variants of the dominant donation-platform model: two SaaS research/automation products, a gaming/livestream platform, three distinct physical-product categories, a physical/digital savings product, a pledge/challenge platform, a team/institutional platform, and a passive consumer-purchase school program.

## Data Quality

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Providers | 21 | 31 | +10 |
| Programs | 31 | 48 | +17 |
| Authoritative sources | 69 | 104 | +35 |

- **Duplicates:** zero duplicate provider IDs, slugs, normalized names, website domains, program IDs, or source IDs.
- **Intake status:** all 10 records parse, validate, resolve as expected update candidates after publication, and remain publish-ready in the post-publication round trip.
- **Explicit unresolved research fields:** 2 program timing blocks—SaveAround’s physical coupon-book program and Krispy Kreme Digital Dozens—are `researched-unknown`. Other unavailable facts are narrowly documented rather than inferred, including quoted enterprise/license prices, variable processor fees, variable per-product Box Tops earnings, and broader eligibility not established by the reviewed sources.
- **Source quality:** all 35 new sources are official provider pages, official program pages, official support/platform documentation, or official terms/pricing pages. Search snippets were not used as evidence.
- **Conflicts:** no new Batch 2 conflicts require review. The existing Little Caesars conflict remains preserved.
- **Commercial firewall:** all new records use neutral commercial metadata (`affiliate_status: unknown`, no approved destination, no featured status, no affiliation), and focused Finder tests confirm those fields have zero ranking effect.
- **Logos:** no logo was downloaded, scraped, generated, or recreated.

## Schema Stress

No fact had to be discarded, assigned to a false taxonomy value, duplicated across programs unnecessarily, or represented with a misleading duration. Provider-level economics inheritance worked naturally for Dutch Mill Bulbs, while materially different economics remained program-specific for Tiltify, Giving Bean, SaveAround, Krispy Kreme, eTeamSponsor, and Box Tops.

One bounded review item remains: the frozen recurring payout frequency enum supports monthly and quarterly schedules but not daily, biweekly, or semiannual/anchored-twice-yearly cadences. Four researched facts therefore remain explicit in timing notes:

- Dutch Mill Bulbs batches online payouts biweekly.
- Pledge It describes daily Stripe settlement for processed flat gifts.
- eTeamSponsor FundRaker uses daily payment-gateway deposit batches.
- Box Tops pays by two anchored dates, December 31 and April 30.

This does not create a current correctness blocker because the cadence, anchor, conditions, and delivery context are preserved accurately and are not forced into an incorrect enum. It is nevertheless repeated schema pressure and should be reviewed before the next batch. Expanding the enum is not part of this ingestion and the frozen schema was not changed.

Mixed conditional payment flows also require careful prose: Pledge It combines immediate flat-gift processing, end-of-month performance-pledge invoicing, and daily settlement. The existing timing fields plus notes preserve those distinctions without claiming one universal elapsed payout time.

Local variability appeared in SaveAround’s market-specific offers and Krispy Kreme’s participating-shop availability. Provider records can state the limitation, but cannot enumerate offer inventories or shop-level eligibility. No location/ZIP subsystem was built.

## Validation Results

- Provider schema and canonical corpus validation: passed through Astro content synchronization and production build for all 31 records.
- Intake validation: 10 parsed, 10 post-publication update candidates, 10 publish-ready, 0 validation failures, 0 likely duplicates.
- Publication/round-trip: passed; all ten records dry-run as publish-ready updates after canonical publication. The first post-publication pass exposed one invalid bare eTeamSponsor source-claim path; it was corrected to the two program-level economics paths and the full validation was rerun successfully.
- Focused intake/schema/taxonomy tests: 27/27 passed.
- Finder tests: 10/10 passed, including deterministic ordering and zero effect from affiliate, sponsor, featured, or commercial metadata.
- Full test suite: 63/63 passed.
- Production build: passed; 81 pages generated, including all 31 provider pages.
- Duplicate audit: passed across provider IDs, slugs, normalized names, domains, program IDs, and source IDs.
- `git diff --check`: passed.

## Final Recommendation

**BATCH 2 PASSED — REVIEW ITEMS BEFORE NEXT BATCH**

The batch is structurally valid, duplicate-free, source-backed, round-trip safe, Finder-neutral with respect to commercial metadata, and production-build clean. Review the repeated unsupported payout cadences before the next batch; they are accurately preserved today and do not justify a schema change during this frozen-schema ingestion, but four independent examples now show that the frequency enum is narrower than real provider practice.
