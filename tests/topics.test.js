import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";
import { legacyRoutes } from "../src/data/legacyRoutes.js";
import { topicPublication, validateTopicPublication, isTopicIndexable, providerTopicLinkUpdates } from "../src/data/topicPublication.js";
import { topicModificationDates } from "../src/data/topicDates.js";
import { seoReleaseBlockers, readIndexingEvidence } from "../scripts/seo-release-gate.mjs";
const loadTopics = async () => Promise.all((await readdir("src/content/topics")).filter((file) => file.endsWith(".md")).map(async (file) => ({ file, ...load((await readFile(`src/content/topics/${file}`, "utf8")).split("---")[1]) })));

test("explicit decisions cover 37 routes and retain 15 indexable guides and 22 temporarily noindexed placeholders", async () => {
  const topics = await loadTopics();
  validateTopicPublication(topics, legacyRoutes);
  assert.equal(Object.keys(topicPublication).length, 37);
  assert.equal(Object.values(topicPublication).filter((entry) => entry.indexing === "index").length, 15);
  assert.equal(Object.values(topicPublication).filter((entry) => entry.approval === "owner-approved" && entry.temporary === true).length, 22);
  for (const topic of topics) assert.equal(isTopicIndexable(topic.legacyPath), true);
  assert.throws(() => isTopicIndexable("unknown"), /Missing explicit/);
});
test("removing guide content fails instead of silently changing its indexing", async () => {
  const topics = await loadTopics();
  assert.throws(() => validateTopicPublication(topics.slice(1), legacyRoutes), /guide content is missing/);
  assert.throws(() => validateTopicPublication([...topics, topics[0]], legacyRoutes), /Duplicate guide route/);
  assert.throws(() => validateTopicPublication([...topics, { legacyPath: "Cookbooks" }], legacyRoutes), /explicit guide publication/);
});
test("recommendations distinguish direct programs from alternatives and resolve to active source-backed records", async () => {
  for (const topic of await loadTopics()) {
    assert.equal(new Set(topic.providers.map((entry) => entry.provider)).size, topic.providers.length);
    for (const entry of topic.providers) {
      assert.ok(["direct", "alternative"].includes(entry.relationship));
      const provider = load(await readFile(`src/content/providers/${entry.provider}.yaml`, "utf8"));
      assert.equal(provider.identity.slug, entry.provider);
      assert.equal(provider.meta.deleted, false);
      assert.equal(provider.status.lifecycle, "active");
      assert.ok(provider.verification.sources.length > 0);
    }
    assert.equal(new Date(topic.updated).toISOString().slice(0, 10), topic.updated);
    assert.equal(new Set(topic.related).size, topic.related.length);
    assert.ok(!topic.related.includes(topic.legacyPath));
  }
  for (const path of ["Coffee", "Cookie-Dough", "Discount-Card"]) {
    const topic = (await loadTopics()).find((entry) => entry.legacyPath === path);
    assert.equal(topic.providers.filter((entry) => entry.relationship === "direct").length, 1);
  }
});
test("all 22 temporary decisions require reviewed evidence and reject material exceptions", () => {
  const evidence = readIndexingEvidence();
  assert.equal(evidence.urls.length, 22);
  assert.equal(new Set(evidence.urls.map((entry) => entry.url)).size, 22);
  assert.equal(evidence.unknownIsNotZero, true);
  for (const record of evidence.urls) {
    assert.equal(record.searchConsoleIndexing, "absent-from-indexed-export");
    assert.equal(record.searchConsoleTraffic, "absent-from-performance-export");
    assert.equal(record.backlinks, "not-reported-in-gsc-links");
    assert.equal(record.historicalAuthority, "unmeasured");
  }
  const decisions = structuredClone(topicPublication);
  for (const entry of Object.values(decisions)) if (entry.publication === "placeholder") {
    entry.approval = "owner-approved"; entry.approvedBy = "test owner"; entry.approvedAt = "2026-10-28";
  }
  assert.equal(seoReleaseBlockers(evidence, decisions).length, 0);
  const unknown = structuredClone(evidence); unknown.urls[0].backlinks = "unavailable";
  for (const entry of Object.values(decisions)) entry.acceptedEvidenceUncertainty = true;
  assert.match(seoReleaseBlockers(unknown, decisions).join("\n"), /evidence is unresolved/);
  const exception = structuredClone(evidence); exception.urls[0].materialException = true;
  assert.match(seoReleaseBlockers(exception, decisions).join("\n"), /material exception/);
  const missing = structuredClone(evidence); missing.urls.pop();
  assert.match(seoReleaseBlockers(missing, decisions).join("\n"), /evidence review is missing/);
  decisions["Cookbooks"].approval = "pending-owner";
  assert.match(seoReleaseBlockers(evidence, decisions).join("\n"), /owner approval is pending/);
});
test("lastmod is deterministic and survives removal of the last provider backlink", () => {
  const provider = { id: "giving-bean", data: { identity: { slug: "giving-bean" }, meta: { modified_at: "2026-09-20" } } };
  const topics = [{ data: { legacyPath: "Coffee", updated: "2026-10-28", providers: [{ provider: { id: "giving-bean" } }] } }];
  const dates = topicModificationDates(topics, [provider]);
  assert.deepEqual([...dates], [...topicModificationDates(topics, [provider])]);
  assert.equal(topicModificationDates([], [provider]).get("/providers/giving-bean/"), providerTopicLinkUpdates["giving-bean"]);
  const changedProvider = structuredClone(provider); changedProvider.data.meta.modified_at = "2026-10-29";
  assert.equal(topicModificationDates(topics, [changedProvider]).get("/Coffee.html"), "2026-10-29");
  const changedGuide = structuredClone(topics); changedGuide[0].data.updated = "2026-10-29";
  assert.equal(topicModificationDates(changedGuide, [provider]).get("/providers/giving-bean/"), "2026-10-28", "Guide body edits do not falsely refresh a profile's unchanged links");
});
