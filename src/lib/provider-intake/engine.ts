import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { assessDuplicate, loadExistingProviders } from "./duplicates.ts";
import { effectiveProgramTaxonomy, normalizeIntakeRecord } from "./normalize.ts";
import { createPublicationIdAllocator, preparePublication } from "./publisher.ts";
import { validateDraft } from "./validate.ts";
import type {
  DuplicateAssessment,
  ExistingProviderRecord,
  IntakeRun,
  IntakeSummary,
  ReviewRecord,
  ValidationIssue,
} from "./types.ts";

const EMPTY_DUPLICATE: DuplicateAssessment = {
  classification: "new",
  candidates: [],
  signals: [],
  ambiguous: false,
};

export function createRunId(now = new Date()): string {
  const timestamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `intake_${timestamp}_${randomUUID().slice(0, 8)}`;
}

export function parseIntakeJson(input: string): { records?: unknown[]; issues: ValidationIssue[] } {
  try {
    const parsed = JSON.parse(input);
    return { records: Array.isArray(parsed) ? parsed : [parsed], issues: [] };
  } catch (error) {
    return {
      issues: [{
        code: "invalid-json",
        message: error instanceof Error ? error.message : "Invalid JSON",
        path: "$",
        severity: "error",
        stage: "parse",
      }],
    };
  }
}

function buildSummary(records: ReviewRecord[]): IntakeSummary {
  return {
    parsed: records.length,
    readyForReview: records.filter((record) => record.draftValid && record.duplicate.classification === "new").length,
    likelyDuplicates: records.filter((record) => record.duplicate.classification === "likely-duplicate").length,
    validationFailures: records.filter((record) => !record.draftValid).length,
    existingProviderNewPrograms: records.filter((record) => record.duplicate.classification === "existing-provider-new-program").length,
    updateCandidates: records.filter((record) => record.duplicate.classification === "update-candidate").length,
    publishReady: records.filter((record) => record.publishReady).length,
  };
}

export function processIntakeRecords(
  rawRecords: unknown[],
  existingRecords: ExistingProviderRecord[],
  options: { runId?: string; sourcePath?: string; actor?: string; date?: string; contentDirectory?: string } = {},
): IntakeRun {
  const runId = options.runId ?? createRunId();
  const idAllocator = createPublicationIdAllocator(existingRecords);
  const records = rawRecords.map((raw, index): ReviewRecord => {
    const draft = validateDraft(raw);
    if (!draft.success || !draft.data) {
      return {
        index,
        recordId: `${runId}:${index + 1}`,
        raw,
        draftValid: false,
        publishReady: false,
        issues: draft.issues,
        duplicate: EMPTY_DUPLICATE,
        effectiveTaxonomy: [],
        affiliateResearchNeeded: true,
      };
    }

    const { normalized, issues: normalizationIssues } = normalizeIntakeRecord(draft.data as any);
    const duplicate = assessDuplicate(normalized, existingRecords);
    const publication = preparePublication(normalized, duplicate, existingRecords, { ...options, idAllocator });
    const issues = [...draft.issues, ...normalizationIssues, ...publication.issues];
    return {
      index,
      recordId: `${runId}:${index + 1}`,
      raw,
      normalized,
      draftValid: !issues.some((entry) => entry.severity === "error" && entry.stage !== "publish"),
      publishReady: publication.publishReady,
      issues,
      duplicate,
      effectiveTaxonomy: effectiveProgramTaxonomy(normalized),
      affiliateResearchNeeded: normalized.commercial_research?.affiliate_status === "unknown",
      proposedSlug: normalized.identity?.slug,
      proposedPath: publication.destination,
      publication,
    };
  });

  return {
    runId,
    createdAt: new Date().toISOString(),
    sourcePath: options.sourcePath,
    summary: buildSummary(records),
    records,
  };
}

export async function processIntakeFile(
  inputPath: string,
  options: { runId?: string; actor?: string; date?: string; contentDirectory?: string } = {},
): Promise<IntakeRun> {
  const resolvedPath = path.resolve(inputPath);
  const parsed = parseIntakeJson(await readFile(resolvedPath, "utf8"));
  if (!parsed.records) {
    const runId = options.runId ?? createRunId();
    const record: ReviewRecord = {
      index: 0,
      recordId: `${runId}:1`,
      raw: null,
      draftValid: false,
      publishReady: false,
      issues: parsed.issues,
      duplicate: EMPTY_DUPLICATE,
      effectiveTaxonomy: [],
      affiliateResearchNeeded: true,
    };
    return {
      runId,
      createdAt: new Date().toISOString(),
      sourcePath: resolvedPath,
      summary: buildSummary([record]),
      records: [record],
    };
  }
  const contentDirectory = options.contentDirectory ?? path.resolve("src/content/providers");
  const existingRecords = await loadExistingProviders(contentDirectory);
  return processIntakeRecords(parsed.records, existingRecords, {
    ...options,
    sourcePath: resolvedPath,
    contentDirectory,
  });
}
