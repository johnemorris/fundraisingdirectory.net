import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { topicPublication } from "../src/data/topicPublication.js";

export function seoReleaseBlockers(evidence, decisions = topicPublication) {
  const blockers = [];
  for (const [path, decision] of Object.entries(decisions)) {
    if (decision.publication !== "placeholder") continue;
    const url = `https://fundraisingdirectory.net/${path}.html`;
    const record = evidence.urls.find((entry) => entry.url === url);
    if (!record) blockers.push(`${url}: URL-level evidence review is missing`);
    if (decision.approval !== "owner-approved" || !decision.approvedBy || !decision.approvedAt) {
      blockers.push(`${url}: owner approval is pending`);
    }
    if (record) {
      const reviewed = record.searchConsoleIndexing === "absent-from-indexed-export"
        && record.searchConsoleTraffic === "absent-from-performance-export"
        && record.backlinks === "not-reported-in-gsc-links"
        && record.backlinkReviewSource === "gsc-links-2026-10-28"
        && record.backlinkReviewSource === evidence.availableEvidence?.linksReport?.id
        && evidence.availableEvidence?.linksReport?.externalLinksTotalDisplayed === 0
        && record.materialException === false;
      if (!reviewed) blockers.push(`${url}: evidence is unresolved or a material exception requires review`);
    }
  }
  return blockers;
}
export function assertSeoReleaseApproved(evidence) {
  const blockers = seoReleaseBlockers(evidence);
  if (blockers.length) throw new Error(`SEO production release blocked:\n${blockers.join("\n")}`);
}
export function readIndexingEvidence() {
  return JSON.parse(readFileSync(new URL("../docs/seo-phase1-indexing-evidence.json", import.meta.url), "utf8"));
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const blockers = seoReleaseBlockers(readIndexingEvidence());
  if (blockers.length) { console.error(`NO-GO: ${blockers.length} unresolved SEO release conditions.\n${blockers.join("\n")}`); process.exitCode = 1; }
  else console.log("SEO indexing dispositions approved for production review.");
}
