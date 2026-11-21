# Stage 1 Provider Content Refresh — 18 November 2026

## Summary

Stage 1 adds canonical provider profiles for **Fundraise Up** and **Panera Bread Fundraising** and updates the canonical **Givebutter** record using verified official sources checked on `2026-11-18`.

All three records were validated, reviewed, and published through the existing provider intake pipeline (`docs/provider-intake/2026-11-18-stage1-provider-refresh.json`) without creating a parallel model or changing public directory/profile UI components.

## Records Added / Updated

### 1. Fundraise Up (`src/content/providers/fundraise-up.yaml` — `prov_000048`, new)

- **Programs added:**
  - `online-giving-and-gift-cart` (`prog_000068`, `availability_state: generally-available`)
  - `diy-peer-to-peer-fundraising` (`prog_000069`, `availability_state: early-access`)
  - `in-person-giving` (`prog_000070`, `availability_state: generally-available`)
- **Verified capabilities & availability distinctions:**
  - **AI Coach (`early-access`):** Integrated into DIY Peer-to-Peer at no additional platform charge for eligible nonprofits; defaults to off on new campaigns and must be enabled on the account by the organization's Customer Success Manager before campaign activation. Assists individual fundraisers with story/title drafting, outreach messages, and 48-hour check-ins; does not publish or send content without fundraiser approval.
  - **DIY Peer-to-Peer (`early-access`) vs. P2P Events (`announced`):** DIY Peer-to-Peer is live in Early Access (requiring at least one real campaign and structured feedback), whereas P2P walks, runs, and rides are documented as in discovery and announced for future early access.
  - **Gift Cart improvements (`generally-available`):** Embedded multi-program catalog supporting up to 50 items per checkout, enriched with November 2026 updates for per-gift custom field values (via Dashboard or CSV upload), embedded translatable FAQ blocks, and dedicated full-page Dashboard editing for gifts and sponsorship profiles.
  - **P2P tribute tracking & supporter updates (`generally-available`):** Donations on In Memory and In Honor P2P pages automatically prefill the dedication and honoree name at checkout (locked on In Memory pages unless the dedication is removed; editable on In Honor pages) and sync as tributes in exports and CRM integrations. Includes fundraising on behalf of companies, schools, or clubs and Dashboard team-admin handoff.
  - **UK in-person giving (`generally-available`, `countries: ["GB"]`):** Tap to Donate and Giving Station in the Fundraise Up mobile app are available to UK-registered organizations collecting GBP, with UK English localization, pre-payment supporter name/email capture for UK receipts, and on-screen Gift Aid declarations and address collection (while the charity submits claims to HMRC). In-Person Giving overall is restricted to domestic events for organizations based in the US, Canada, and the UK (`countries: ["US", "CA", "GB"]`).
  - **Privacy & security controls (`generally-available`):**
    - In-person specialist privacy: Administrators can mask saved supporter names, emails, and phone numbers from In-Person Giving Specialists, log changes in the Audit log, and grant Giving Station access; the app blocks screenshots and screen recording on personal-detail screens.
    - Cookie consent: Campaign Pages and Donor Portal include a built-in cookie banner in jurisdictions requiring consent (EU, UK, Switzerland, California, Quebec) that restricts Donor Portal to strictly necessary cookies until answered and remembers choices for 400 days. Organizations embedding the Checkout Modal for EU/EEA/UK donors must provide their own website cookie banner that loads before Fundraise Up's script.
    - Marketing consent: P2P sign-up supports optional fundraiser marketing-consent checkboxes (globally or only in explicit-consent regions), and checkout supports Explicit opt-in, Pre-checked opt-in, or location-detected Auto opt-in in the UK and France.

### 2. Givebutter (`src/content/providers/givebutter.yaml` — `prov_000002`, updated)

- **Preserved data:** All existing Standard pricing arrangements (0% platform fee with optional tips and Givebutter Guarantee caveats, 3% platform fee without tips, 2.9% + $0.30 card/wallet processing, 1.9% + $0.30 verified-nonprofit ACH, 1.75% instant payout), US/Puerto Rico Stripe Connect eligibility, withdrawal timing, and existing 7 official sources remain intact.
- **Verified updates (`online-fundraising-platform`, `prog_000005`):**
  - **Multi-page fundraiser management (`generally-available`):** Supporters can oversee every fundraising page they own or manage under one login in the Givebutter Portal (`Fundraising > Manage pages`), including registering multiple participants in a single checkout on campaigns using ticketed registration fundraising (with optional email and phone for additional registrants such as children). Standard P2P and minimum-donation registration campaigns remain limited to one fundraising page per email address per campaign.
  - **Ticket-linked fundraiser transfers (`generally-available`):** Assigning a ticketed registration-fundraising page or reassigning its event ticket in the Givebutter Portal moves both the event ticket and its linked fundraising page together while keeping the original purchaser able to reassign it; assignees who did not purchase the ticket can release the page and ticket back to the buyer.
  - **Administrator AI Connector controls (`generally-available`):** Users can connect external AI assistants (such as Claude or ChatGPT) via OAuth/MCP for live read-only queries, while account administrators can globally turn off AI Connectors under `Settings > AI` (disconnecting all active connectors immediately and blocking new connections), inspect active user connections and last-active timestamps, disconnect individual or per-user connectors, and toggle AI contact summaries.

### 3. Panera Bread Fundraising (`src/content/providers/panera-bread-fundraising.yaml` — `prov_000049`, new)

- **Program added:** `bakery-cafe-fundraiser-night` (`prog_000071`, `availability_state: generally-available`)
- **Verified structure & promotional expiration:**
  - **Standard rate vs. dated December 1–21, 2026 promotion:** Standard bakery-cafe fundraiser nights return `20%–25%` of qualifying net food and beverage sales depending on the location. The `30%` promotional give-back rate (`DECEMBER 30% Fundraiser Night (12/1-12/21/26) Special Offer`) is modeled as a separate `restaurant-give-back` arrangement with `effective_window: { start_date: "2026-12-01", end_date: "2026-12-21" }` so `resolveProgramEconomics` and `resolveProgramPresentation` automatically exclude the promotion after `2026-12-21`.
  - **Location-specific participation verification:** Provider geography is `local` (`countries: ["US"]`) and `geographic_restriction.location_participation_required` is `true` at both program and arrangement levels. Organizers must verify café participation, available dates, standard 20% or 25% give-back rate, minimum sales threshold, and December 30% promotion availability for the chosen bakery-cafe.
  - **Eligibility & minimum sales:** Restricted to tax-exempt `501(c)(3)` organizations submitting a valid W-9/tax-exempt form, limited to one event every 30 days. Requires `$100–$150` in qualifying net sales per event depending on the bakery-cafe (`$150` minimum net sales for the December 1–21, 2026 30% special offer). Gift cards, catering, retail merchandise, third-party delivery orders, and events where flyers are distributed on or near cafe premises are excluded.
  - **Qualified payout timing (`needs-recheck`):** Official Panera pages publish differing check-delivery estimates (within 45 business days in the FAQ step-by-step overview, 45–60 business days in the check-delivery FAQ, and approximately 45 days in the Terms & Conditions). Rather than presenting a single guaranteed `payout_time` deadline, `payout_time` is left `null`, the differing official estimates are explained in `timing.notes` and `content.considerations`, and the timing claims on the FAQ and Terms sources are flagged `needs-recheck` (`verification.review_status: needs-recheck`).

## Minimal Schema Additions

To represent these capabilities without parallel models or UI changes, `src/data/providerSchema.ts` and the intake pipeline (`src/lib/provider-intake/{schema,normalize,publisher,browser}.ts`, `src/data/providerPresentation.ts`) were minimally extended with optional fields:

- `AVAILABILITY_STATES` (`generally-available`, `early-access`, `announced`), `program.availability_state`, and `program.feature_availability[]` (`feature`, `status`, optional `countries`, optional `notes`).
- `geographicRestrictionSchema` (`countries`, `location_participation_required`, `notes`) on programs and economic arrangements.
- `dateWindowSchema` (`start_date`, `end_date`) on economic arrangements (`effective_window`) plus `isDateWindowActive()`, used by `resolveProgramEconomics()` to filter out expired dated promotions automatically while preserving object identity when no arrangements are filtered.
