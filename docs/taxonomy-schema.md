# Fundraising taxonomy and provider schema

The provider schema treats fundraising discovery as a set of separate dimensions:

- **Organizer** identifies who operates the fundraiser, using the existing `classification.organizations` taxonomy.
- **Beneficiary** identifies who or what receives the benefit. It may differ from the organizer.
- **Cause area** describes the mission or need independently from organizer and beneficiary type.
- **Method** describes the fundraising mechanism, such as product sales, direct donations, events, grant seeking, or resource collection.
- **Activity subtype** adds detail for activity-driven programs, such as a fun run, readathon, giving day, or supply drive.
- **Channel** records whether a program operates online, in person, or in a hybrid format.
- **Product** remains represented by the existing `products_services` field.
- **Capability** describes supported tools or operational functions, such as recurring giving, ticketing, grant search, fulfillment, or collection logistics.
- **Outcome** records what the campaign can provide, including cash, supplies, equipment, services, volunteer support, or donated goods.

The approved values live in `src/data/taxonomies/`. Those constants are the canonical source for the Astro content schema and future intake tooling. Do not create page-local copies of the taxonomy.

## Backward compatibility

The new `outcomes`, `capabilities`, `beneficiary_types`, `cause_areas`, and `activity_subtypes` fields are optional at both provider-classification and program level. Use provider-level values only when they describe the provider overall; use program-level values when programs differ. Existing records remain valid without these fields and should be enriched only through deliberate, sourced research.

`products_services` remains the current backward-compatible product/service field. It has not been removed or migrated, even where a capability taxonomy now offers a more precise future representation.

Programs may also carry an optional structured `beneficiary` relationship with a canonical beneficiary `type`, display `name`, stable `slug`, and an `official` boolean. This supports official programs where supporters fundraise on behalf of a named nonprofit or charity without creating a second provider model. The relationship supplements `beneficiary_types`; it does not replace or override provider/program taxonomy.

The complete method schema is broader than the methods currently exposed in navigation, filters, and Finder controls. Schema support alone is not approval to publish a new discovery path or SEO page.

## Product basis and intake

This taxonomy is based on the approved fundraising Landscape research. Future Provider Intake should capture these dimensions independently instead of forcing providers into one giant “Category” field. This separation supports cases where an organizer and beneficiary differ, a national nonprofit supplies an official program, a local nonprofit or cause benefits, and a campaign produces cash, goods/resources, or both.

The internal intake foundation now consumes these exact modules and validators. Program-level values supplement provider-level values additively, with duplicates removed for review. Intake does not implement override semantics or expose schema-only values as public navigation.
