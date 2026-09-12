import type { IntakeRun, ReviewRecord } from "./types.ts";

function json(value: unknown): string {
  return `\n\`\`\`json\n${JSON.stringify(value ?? null, null, 2)}\n\`\`\``;
}

function recordMarkdown(record: ReviewRecord): string {
  const data = record.normalized ?? {};
  const duplicate = {
    classification: record.duplicate.classification,
    signals: record.duplicate.signals,
    candidates: record.duplicate.candidates,
  };
  const issues = record.issues.map(({ severity, stage, path, message }) => ({ severity, stage, path, message }));
  const diff = record.publication?.diff ?? [];
  return [
    `## Record ${record.index + 1}: ${data.identity?.name ?? "Invalid record"}`,
    `- Record ID: \`${record.recordId}\``,
    `- Type: \`${data.record_type ?? "unknown"}\``,
    `- Draft validation: **${record.draftValid ? "valid" : "failed"}**`,
    `- Publish-ready: **${record.publishReady ? "yes" : "no"}**`,
    `- Duplicate/update classification: **${record.duplicate.classification}**`,
    `- Proposed destination: \`${record.proposedPath ?? "unresolved"}\``,
    `- Affiliate status: \`${data.commercial_research?.affiliate_status ?? "unknown"}\``,
    `- Affiliate research needed: **${record.affiliateResearchNeeded ? "yes — Affiliate research needed" : "no"}**`,
    "",
    "### Identity and record data",
    json({ identity: data.identity, record_type: data.record_type, origin: data.origin }),
    "",
    "### Taxonomy, programs, and beneficiary/cause data",
    json({ classification: data.classification, programs: data.programs, effective_program_taxonomy: record.effectiveTaxonomy }),
    "",
    "### Geography, economics, requirements, and logistics",
    json({ geography: data.geography, economics: data.economics, requirements: data.requirements, logistics: data.logistics }),
    "",
    "### Provenance, verification, and completeness",
    json({ sources: data.sources, verification: data.verification, completeness: data.completeness }),
    "",
    "### Commercial research (internal; excluded from canonical publication and Finder scoring)",
    json(data.commercial_research),
    "",
    "### Validation warnings and errors",
    json(issues),
    "",
    "### Duplicate/update assessment",
    json(duplicate),
    "",
    "### Proposed field diff",
    json(diff),
    record.publication?.generatedContent
      ? `\n### Generated canonical provider content\n\n\`\`\`yaml\n${record.publication.generatedContent}\`\`\``
      : "",
  ].join("\n");
}

export function renderReviewMarkdown(run: IntakeRun): string {
  const summary = run.summary;
  return [
    "# Provider intake review",
    "",
    `- Run ID: \`${run.runId}\``,
    `- Created: ${run.createdAt}`,
    `- Source: \`${run.sourcePath ?? "in-memory"}\``,
    "",
    "## Summary",
    "",
    `${summary.parsed} records parsed`,
    `${summary.readyForReview} ready for review`,
    `${summary.likelyDuplicates} likely duplicates`,
    `${summary.validationFailures} validation failures`,
    `${summary.existingProviderNewPrograms} existing-provider/new-program candidates`,
    `${summary.updateCandidates} existing-provider update candidates`,
    `${summary.publishReady} publish-ready`,
    "",
    ...run.records.map(recordMarkdown),
    "",
  ].join("\n");
}
