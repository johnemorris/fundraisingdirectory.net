# Provider intake and publishing foundation

The provider intake engine is an internal, Git/file-backed review workflow. Published YAML files in `src/content/providers/` remain the source of truth. Intake JSON and generated review artifacts are working material, not live content.

The pipeline is:

`JSON input → normalize → draft validation → taxonomy validation → duplicate check → review draft → canonical preview/diff → explicit write`

No command commits, pushes, deploys, or changes Finder ordering. There is no public form, CMS, database, authentication layer, or automatic publication.

## Commands

```sh
npm run intake:validate -- path/to/intake.json
npm run intake:review -- path/to/intake.json
npm run intake:review -- path/to/intake.json --output-dir .intake-runs
npm run intake:publish -- path/to/intake.json
npm run intake:publish -- path/to/intake.json --write
```

`intake:publish` is a dry run by default. It prints the proposed destination, generated canonical YAML, field-level diff, validation errors, and destructive-change warnings. `--write` is required to change `src/content/providers/`, and the individual input record must also contain:

```json
{
  "workflow": {
    "approved": true,
    "approved_by": "Editor Name",
    "approved_at": "2026-09-12"
  }
}
```

A destructive update additionally requires `--allow-destructive`. A create uses exclusive file creation and refuses to overwrite an existing path. An update merges only supplied canonical fields, preserves omitted fields and unrelated programs, and merges supplied sources by URL. Record-level verification status/dates change on an update only when `verification.record_level_recheck` is explicitly `true`; narrower claim/program checks remain visible through source `supports` without overstating whole-record verification. A write grants no permission to commit, push, merge, or deploy.

## Input and bulk behavior

Input is JSON containing either one record or an array. In a bulk array, each record is parsed and validated independently. One invalid record does not prevent valid records from receiving review and publication previews. Every run receives an `intake_...` identifier, and each record receives a traceable `<run-id>:<index>` identifier.

Representative samples live in `docs/provider-intake/examples/`. They are workflow fixtures and are never loaded as public provider content.

Top-level shape:

```json
{
  "record_type": "provider",
  "origin": "internal-research",
  "identity": {
    "name": "Example Provider",
    "slug": "example-provider",
    "aliases": ["Example Fundraising"],
    "website": "https://example.com/",
    "fundraising_url": "https://example.com/fundraising"
  },
  "classification": {
    "methods": ["direct-donations"],
    "products_services": ["donation-platform"],
    "organizations": ["nonprofits-charities"],
    "beneficiary_types": ["own-organization"],
    "cause_areas": ["community-neighborhood"],
    "capabilities": ["donation-forms"],
    "outcomes": ["cash"]
  },
  "programs": [],
  "geography": {},
  "economics": {},
  "requirements": [],
  "logistics": [],
  "content": {},
  "sources": [],
  "verification": {},
  "completeness": "minimal",
  "commercial_research": { "affiliate_status": "unknown" }
}
```

Incomplete drafts are valid working records when they contain a record type, origin, and at least one useful identity signal. Publish readiness is separate: the generated candidate must pass the unchanged canonical Astro provider requirements from `src/data/providerSchema.ts`. Canonical operational defaults are applied where the live schema already permits them, but required identity, classification, program, geography, content, source, and date fields are not invented.

Supported record types are `provider` and `official-beneficiary-program`. The type list is isolated so `local-opportunity` can be added later without restructuring the engine; local/location ingestion is intentionally absent.

## Taxonomy and programs

Intake imports the canonical definitions and validators from `src/data/taxonomies/`. It does not maintain duplicate arrays. Supported dimensions are organizer types (`classification.organizations`), beneficiary types, cause areas, methods, activity subtypes, channels, products/services, capabilities, and outcomes.

Program taxonomy is additive. Effective review values are provider values plus program values with duplicates removed. No override or subtraction semantics exist. Effective values are review output and are not written as a second taxonomy model.

An official beneficiary program can represent supporters fundraising on behalf of a named charity:

```json
{
  "record_type": "official-beneficiary-program",
  "beneficiary": {
    "type": "national-nonprofit-or-charity",
    "name": "Example Charity",
    "slug": "example-charity",
    "official": true
  }
}
```

A record-level beneficiary is normalized onto its programs. Canonical programs support the optional structured relationship directly; it is not a parallel provider model.

## Validation and review

Validation is layered:

- JSON parsing and basic draft shape
- identity, URL, nested program, provenance, and operational metadata checks
- canonical shared taxonomy validation
- semantic flags for ambiguous or suspicious data
- generated-candidate validation against the live Astro provider schema

The engine flags nationwide/local contradictions, invalid or implausible percentages, missing beneficiary identity, and verified status without a verifier, verification date, and source. It does not silently make semantic corrections. Known category mistakes receive targeted guidance where available, such as treating `shoe-drive` as an activity subtype rather than a method.

Review output includes identity, record type, normalized/effective taxonomy, programs, beneficiary and cause data, geography, economics, requirements/logistics, sources and their `supports` paths, verification/completeness, all issues, duplicate classification, affiliate status, proposed path, canonical preview, and diff. `intake:review --output-dir ...` writes both `review.json` and `review.md`; without that option it only prints Markdown.

## Provenance and verification

Sources use:

```json
{
  "url": "https://example.com/fundraising",
  "source_type": "official-provider",
  "title": "Fundraising Program",
  "supports": ["economics.platform_fee_percent", "geography.countries"],
  "checked_at": "2026-09-12",
  "notes": "Optional editor note"
}
```

Supported source types are `official-provider`, `official-charity`, `official-program`, `government`, `platform-documentation`, `terms-or-fees`, `public-press-release`, `reputable-third-party`, and `frd-editorial-note`. Review artifacts preserve `supports`. Canonical publication maps these richer intake types to the live source categories; it does not claim field-level evidence in V1.

Verification states are `unverified`, `partially-verified`, `verified`, `stale`, and `disputed`. Completeness states are `minimal`, `standard`, and `anchor-quality`; they are independent. The engine never marks a record verified automatically. `stale` and `disputed` drafts are blocked from publication. Research chronology can retain both `first_researched_at` and the canonical `first_verified_at`; they are not inferred from each other. Because the current live schema requires `first_verified_at`, its absence remains a publish error even when a working draft is otherwise valid.

Origins are `internal-research`, `bulk-import`, `provider-submission`, `organization-submission`, `claim-update`, and `automated-research-assist`. Origin and completeness remain operational review metadata.

## Duplicate and update handling

Existing YAML records are compared using normalized provider name, canonical domain, slug, intake aliases, program name, program slug, and program URL when present. Results are classified as:

- `new`
- `likely-duplicate`
- `existing-provider-new-program`
- `update-candidate`

Ambiguous or weak matches are never merged. Likely duplicates are blocked from publication pending editorial resolution. Update previews preserve omitted canonical fields and other programs, show a field-level diff, and warn when arrays shrink or populated values are removed.

## Commercial research firewall

Commercial research is internal operational metadata, not provider taxonomy. It supports affiliate status (`unknown`, `none-found`, `available`, `applied`, `approved`, `rejected`), program and approved destination URLs, network, commission notes, cookie duration, eligibility notes, checked date, and internal notes.

`unknown` produces a visible **Affiliate research needed** flag. Provider and organization submissions cannot set these fields: supplied commercial metadata is discarded to `unknown` with a review warning. Commercial research is excluded from canonical YAML, Finder serialization, scoring inputs, editorial quality, verification, and recommendations. It does not modify canonical affiliate, sponsor, partner, featured, disclosure, or outbound-link behavior; those remain separately administered.
