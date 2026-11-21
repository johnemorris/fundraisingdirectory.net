# Fundraising Landscape Findings — 14 October 2026

## Coverage audit

- **Already canonical:** GoFundMe.
- **Not previously canonical:** Every.org, CaringBridge, SupportNow, and Blackbaud.
- **Individuals and families:** already represented by the `individuals-personal-causes` organization type and `individual-or-family` beneficiary type. Fourteen active providers used the organization type before this update.
- **Medical fundraising:** already represented through `health-medical`, including Give InKind, GlobalGiving, Graham-Pelton, Help Hope Live, and Tiltify. GoFundMe's medical use was described in prose but not structured before this update.
- **Employee matching:** already represented through `giving-matching`, `matching-gifts`, and `workplace-giving`, with Double the Donation providing the strongest dedicated record.
- **Mobile giving:** already represented through `text-mobile-giving`, `text-to-give`, `digital-wallets`, and mobile channels. No new mobile taxonomy is needed.
- **Passive fundraising:** already represented by `everyday-passive-fundraising`, used by Box Tops for Education, RaiseRight, SaveAround, and ShopRaise. No taxonomy gap was found.
- **IRA giving:** the schema can preserve it in program summaries, requirements, logistics, and sourced limitations, but it does not have a reusable IRA/QCD capability. One newly verified provider is not enough evidence to freeze a new taxonomy value.

## Editorial decisions

### Every.org — add as a canonical provider

Official material establishes a nonprofit giving platform supporting card, bank, mobile wallet, stock, cryptocurrency, donor-advised-fund, and IRA gifts; peer-to-peer and matching campaigns; and employer matching through both ordinary receipt submission and a newly announced Teleskope integration.

Limitations recorded in the provider data:

- recipient eligibility centers on eligible U.S. public charities and qualifying fiscally sponsored or international arrangements;
- donations are legally made to Every.org and distributions remain subject to its discretion;
- processing and disbursement fees vary by method despite a zero platform fee;
- the Teleskope integration is not universal and public pricing was not found;
- 2026 IRA age and contribution-limit details are explicitly dated and require re-verification.

Primary sources:

- [Nonprofit Fundraising Platform Overview](https://www.every.org/nonprofits)
- [Every.org Pricing](https://www.every.org/pricing)
- [Every.org Simplifies IRA Giving for Nonprofits and Donors](https://blog.every.org/every-org-launches-ira-giving-for-nonprofits-and-donors/)
- [How Do I Add a Matching Campaign?](https://support.every.org/hc/en-us/articles/39785326747283-How-do-I-add-a-matching-campaign)
- [Every.org Partners with Teleskope](https://blog.every.org/every-org-partners-with-teleskope-to-enable-employee-giving-and-matching-programs/)
- [How Do I Get My Donation Matched by My Company?](https://support.every.org/hc/en-us/articles/1500005442421-How-do-I-get-my-donation-matched-by-my-company)
- [Every.org Terms of Service](https://www.every.org/terms)

### GoFundMe and CaringBridge — enrich GoFundMe; do not add CaringBridge

GoFundMe's official partnerships page confirms that CaringBridge embeds GoFundMe fundraising through APIs and widgets so families can seek financial support within a health-journal experience. CaringBridge's own materials describe it primarily as a no-cost health communication and care-support platform and attribute family fundraising to partners.

The canonical GoFundMe record now carries structured individual/family and medical applicability, current U.S. pricing with country/type caveats, and the CaringBridge integration. A separate CaringBridge provider record would imply that CaringBridge itself processes or disburses the fundraiser and would duplicate the same GoFundMe program.

Primary sources:

- [GoFundMe Partnerships](https://www.gofundme.com/c/partnerships)
- [GoFundMe Pricing and Fees](https://www.gofundme.com/c/pricing)
- [GoFundMe Crowdfunding Overview](https://www.gofundme.com/c/crowdfunding)
- [CaringBridge About Us](https://www.caringbridge.org/about-us)
- [CaringBridge Support Overview](https://support.caringbridge.org/)

### SupportNow — add as a canonical provider

Official pages establish a U.S. support registry for individuals and families that combines donations, meal schedules, gift cards, volunteer and errand coordination, and updates. This fits the existing `in-kind-resource-fundraising`, personal/family, medical, food, services, and volunteer-support concepts without schema expansion.

Limitations recorded in the provider data:

- reviewed terms restrict service use to the United States and impose organizer/account eligibility requirements;
- the organizer must accurately describe and use contributions for the stated purpose;
- the family receives the full intended donation when the donor keeps the optional RoundUp; if the donor removes it, the published credit-card processing cost is 2.7%;
- no universal bank-settlement duration was found;
- an embedded GoFundMe remains a separate third-party fundraiser.

Primary sources:

- [SupportNow Family Support Platform](https://www.supportnow.org/)
- [SupportNow Pricing](https://www.supportnow.org/pricing)
- [SupportNow Medical Fundraising](https://www.supportnow.org/medical-fundraising)
- [SupportNow Meals](https://www.supportnow.org/meals)
- [SupportNow Terms of Service](https://www.supportnow.org/terms_of_service)

### Blackbaud — watchlist only

Blackbaud announced Platform for Good and Lantern on 29 September 2026. The official Lantern announcement says it will begin powering select Raiser’s Edge NXT and Agents for Good capabilities in 2027, with broader availability planned later. This is forward-looking product-platform information, not evidence for a current standalone fundraising program or a reusable “AI fundraising” category.

No canonical provider or taxonomy entry was added. The editorial backlog should revisit the products after live availability, stable public capability documentation, eligibility, and commercial terms exist.

Primary sources:

- [Blackbaud Announces Platform for Good](https://investor.blackbaud.com/news-releases/news-release-details/blackbaud-announces-platform-goodtm-social-impacts-first-ever)
- [Blackbaud Introduces Lantern](https://www.blackbaud.com/newsroom/article/bbcon2026-lantern-announcement)

## Unresolved research

- Every.org does not publish universal Teleskope employer availability or pricing.
- IRA/QCD legal limits are year-specific and should not be treated as timeless eligibility.
- SupportNow does not publish one universal elapsed bank-settlement time on the reviewed pages.
- SupportNow publishes a 2.7% credit-card processing cost when a supporter removes the optional RoundUp; the reviewed sources do not establish a broader rate for other payment methods.
- CaringBridge's embedded fundraising inherits GoFundMe eligibility, fee, and transfer rules rather than defining a separate fundraising product.
- Blackbaud's announced 2027 capabilities are not yet sufficiently stable or comparable for canonical ingestion.

## Taxonomy conclusion

No taxonomy values were added. Existing organization, beneficiary, cause, method, outcome, capability, channel, and product/service dimensions fit the verified provider programs. IRA/QCD giving remains a possible future structured capability, but adding it for one researched provider would be premature.
