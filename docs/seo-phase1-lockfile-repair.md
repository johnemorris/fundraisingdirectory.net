# SEO Phase 1 lockfile repair — November 13, 2026

Status: replacement candidate prepared; production remains on rollback commit
58dfe7c5f56d63c2eec47550386ba5074d7a3682. No release was attempted during this repair.

Branch: codex/seo-phase1-lockfile-repair.
Base: approved candidate 119f0f6ab8f26451ddd02739b4411bc4057f9981.
The original candidate is unchanged. The October release report is historical;
this note supersedes its clean-install readiness assessment.

The November 9 pipeline failed before deployment because npm 10.9.2 required
@emnapi/core@1.11.3 and @emnapi/runtime@1.11.3 entries missing from the lockfile.
The failed merge was reverted successfully. Existing-dependency builds had
missed the clean-install failure.

Repair: regenerate package-lock.json with Node 24.22.1 and npm 10.9.2, matching
the pipeline. Two optional package entries are added and peer metadata is
normalized. No existing package versions, source/content, GA4 code, deployment
configuration, production guard, or indexing decisions changed. The candidate
manifest is refreshed; the original release report remains a historical record.

Validation (fresh, isolated worktree):
- Real npm ci with Node 24.22.1 / npm 10.9.2, install scripts enabled: PASS.
- npm ci --dry-run --ignore-scripts --os=linux --cpu=x64: PASS; dependency
  resolution only, not a Linux build. Docker daemon is unavailable locally.
- npm test: PASS, 98/98.
- Production-targeted build and SEO release guard: PASS, 97 pages,
  73 canonical sitemap URLs, 15 indexable guides, 22 accessible noindex topics.
- Worker simulation: PASS, all 39 historical routes, 73 indexable pages,
  78 existing redirects, query canonical, sitemap/robots and true 404.
- Sitemap SHA256 unchanged:
  6899a85c26c56590e8c505a1d6c246720637145e2fe4f4d0444b0d3f0027a012.
- Current npm audit: seven findings, five high and two moderate. No existing
  dependency versions were changed; separate dependency review remains relevant.

The original checkout and unrelated GA4 edits are preserved. No push, merge,
deploy, database/secret change, or Search Console action occurred in this repair.
A replacement release needs owner review because the prior production approval
named exactly 119f0f6. A genuine Linux CI install/build remains necessary before
production; do not claim the dry run proves Linux native compilation.
When integrating, preserve the existing Impact tag and account for the earlier
merge/revert history: simply merging the old candidate again will not restore
the reverted SEO tree. Review the resulting diff before any push.
