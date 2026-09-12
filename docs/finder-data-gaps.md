# Fundraiser Finder data gaps

The V1 Finder scores provider records only from structured fields already in the
repository. It can compare organization type, method, channel/format, product or
event acceptability, inventory model, upfront-cost category, effort category,
country-level availability, and documented product/service types.

The current provider schema does not yet express participant-size fit, program
timing, passive/ongoing operation, exact ZIP/postal-code service areas, or
provider-level support for every requested outcome (notably technology and
grants). The Finder accepts those organizer inputs, uses them for method-level
guidance where supportable, and lowers provider-match confidence rather than
manufacturing a match. Step 4D in the canonical V1 backlog tracks the structured
data work needed to close these gaps.

Commercial placement must remain independent of fit. Provider `affiliation` and
`editorial` fields are not serialized to the Finder page and are not inputs to
its scoring policy.
