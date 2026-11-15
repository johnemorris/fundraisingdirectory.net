> Historical implementation snapshot (October 27). The October 28 isolated
> candidate replaces file-presence indexing with explicit reviewed decisions,
> removes word/provider quotas, and labels incomplete guides. Temporary noindex
> was approved Oct 28 following the recorded GSC Links review; deployment still
> requires final owner approval. See `seo-phase1-release-report.md` and the evidence ledger.

# Indexing improvements — October 27, 2026

The owner supplied a Search Console snapshot through October 22: 5 indexed,
96 not indexed, including 89 discovered URLs. The local repository currently
builds 39 historical routes: 37 topic destinations and two editorial hubs. This
is a repository inventory, not a fresh measurement of Google's live index.

## Implemented locally

- Fifteen historical topics now have substantive Markdown planning guides,
  related topics, and three or four researched provider profiles. Some narrow
  product topics have fewer direct suppliers in the directory; their prose
  identifies the adjacent alternatives explicitly.
- `/ideas/`, already linked in the main navigation, lists all 37 topics by
  category. Guide pages link to providers, related topics, and the hub; featured
  provider profiles link back to the guides.
- The remaining 22 historical topic placeholders retain their URLs and return
  `noindex, follow`; they are excluded from the sitemap until a guide is added.
  This is an editorial readiness rule, not a blanket removal of historical URLs.
- The existing sitemap endpoint now emits unique URLs and recorded content
  dates. Guide and provider updates account for the linked content rendered on
  those pages. No integration or dependency was added.
- Production builds audit the sitemap against robots tags and canonicals,
  verify hub coverage and provider backlinks, and check local link destinations.

The initial guides cover elementary, high, and Catholic schools; churches;
baseball, basketball, football, cheerleading, and bands; 4-H; cookie dough,
candy, coffee, gift wrap, and discount cards. This selection reflects broad
coverage and available provider research. Search Console query demand was not
provided, so it is not represented as a measured list of highest-demand topics.

Guide amounts are explicitly hypothetical budgeting examples. They are not
claimed industry profit margins. Provider facts come from the existing sourced
records; current eligibility and commercial terms still need confirmation when
an organizer selects a program.

## Publication and external follow-up

These changes require preview review and approved production deployment. Once
published, inspect and request indexing for these initial ten URLs:

1. `/ideas/`
2. `/Elementary-School-Fundraising.html`
3. `/High-School-Fundraising.html`
4. `/Church-Fundraising.html`
5. `/Band-Fundraising.html`
6. `/Football-Fundraising.html`
7. `/Candy.html`
8. `/Cookie-Dough.html`
9. `/Coffee.html`
10. `/Discount-Card.html`

Then resubmit `https://fundraisingdirectory.net/sitemap.xml`. Track discovery,
last crawl, indexing status, and impressions against the supplied baseline.
Review trends over the following weeks rather than treating a fixed interval
as an indexing guarantee. Search Console submission and backlink outreach have
not been performed. Any outreach requires approved recipients and messages.

Google does not prescribe a preferred word count. The guides' 500+ words meet
the requested editorial scope; their usefulness, distinct purpose, and accurate
provider information remain the substantive criteria. An accurate sitemap date
is a hint, not a promise of crawling or indexing. The snapshot alone does not
prove a domain-age or backlink cause.

References: [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content),
[sitemap date guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
and [crawl demand and capacity](https://developers.google.com/crawling/docs/crawl-budget).
