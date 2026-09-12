import type { CanonicalProvider } from "../../data/providerSchema.ts";

export const RECORD_TYPES = ["provider", "official-beneficiary-program"] as const;
export const DRAFT_ORIGINS = [
  "internal-research",
  "bulk-import",
  "provider-submission",
  "organization-submission",
  "claim-update",
  "automated-research-assist",
] as const;
export const SOURCE_TYPES = [
  "official-provider",
  "official-charity",
  "official-program",
  "government",
  "platform-documentation",
  "terms-or-fees",
  "public-press-release",
  "reputable-third-party",
  "frd-editorial-note",
] as const;
export const VERIFICATION_STATES = [
  "unverified",
  "partially-verified",
  "verified",
  "stale",
  "disputed",
] as const;
export const COMPLETENESS_STATES = ["minimal", "standard", "anchor-quality"] as const;
export const AFFILIATE_STATUSES = [
  "unknown",
  "none-found",
  "available",
  "applied",
  "approved",
  "rejected",
] as const;
export const AFFILIATE_NETWORKS = [
  "direct",
  "impact",
  "cj",
  "shareasale",
  "partnerstack",
  "other",
] as const;

export type IntakeRecordType = (typeof RECORD_TYPES)[number];
export type DraftOrigin = (typeof DRAFT_ORIGINS)[number];
export type VerificationState = (typeof VERIFICATION_STATES)[number];
export type CompletenessState = (typeof COMPLETENESS_STATES)[number];
export type AffiliateStatus = (typeof AFFILIATE_STATUSES)[number];

export type IssueSeverity = "error" | "warning";
export type ValidationStage = "parse" | "draft" | "taxonomy" | "publish" | "commercial-firewall";

export interface ValidationIssue {
  code: string;
  message: string;
  path: string;
  severity: IssueSeverity;
  stage: ValidationStage;
}

export interface ExistingProviderRecord {
  path: string;
  data: CanonicalProvider;
}

export interface DuplicateSignal {
  kind: "slug" | "name" | "domain" | "alias" | "program-name" | "program-slug" | "program-url";
  value: string;
}

export type MatchClassification =
  | "new"
  | "likely-duplicate"
  | "existing-provider-new-program"
  | "update-candidate";

export interface DuplicateAssessment {
  classification: MatchClassification;
  existing?: ExistingProviderRecord;
  candidates: Array<{
    path: string;
    slug: string;
    name: string;
    signals: DuplicateSignal[];
  }>;
  signals: DuplicateSignal[];
  ambiguous: boolean;
}

export interface FieldDiff {
  path: string;
  before?: unknown;
  after?: unknown;
  destructive: boolean;
}

export interface PublicationPreview {
  destination: string;
  action: "create" | "update" | "blocked";
  publishReady: boolean;
  candidate?: CanonicalProvider;
  generatedContent?: string;
  diff: FieldDiff[];
  warnings: string[];
  issues: ValidationIssue[];
}

export interface ReviewRecord {
  index: number;
  recordId: string;
  raw: unknown;
  normalized?: Record<string, any>;
  draftValid: boolean;
  publishReady: boolean;
  issues: ValidationIssue[];
  duplicate: DuplicateAssessment;
  effectiveTaxonomy: Array<Record<string, string[]>>;
  affiliateResearchNeeded: boolean;
  proposedSlug?: string;
  proposedPath?: string;
  publication?: PublicationPreview;
}

export interface IntakeSummary {
  parsed: number;
  readyForReview: number;
  likelyDuplicates: number;
  validationFailures: number;
  existingProviderNewPrograms: number;
  updateCandidates: number;
  publishReady: number;
}

export interface IntakeRun {
  runId: string;
  createdAt: string;
  sourcePath?: string;
  summary: IntakeSummary;
  records: ReviewRecord[];
}
