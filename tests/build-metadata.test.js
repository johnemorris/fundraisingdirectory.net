import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createBuildMetadata,
  resolveCommit,
  resolveLocation,
} from "../scripts/build-metadata.mjs";

const cloudflareCommit = "a".repeat(40);
const gitCommit = "b".repeat(40);

test("Cloudflare Pages metadata controls production build identity", () => {
  const metadata = createBuildMetadata({
    env: { CF_PAGES_COMMIT_SHA: cloudflareCommit, CF_PAGES_BRANCH: "main" },
    getGitCommit: () => cloudflareCommit,
    packageVersion: "1.2.3",
    now: new Date("2026-10-15T18:00:00Z"),
  });

  assert.deepEqual(metadata, {
    service: "FundraisingDirectory.net",
    version: "aaaaaaaa",
    buildTime: "2026-10-15T18:00:00.000Z",
    statusCode: 200,
    status: "OK",
    location: "production",
    packageVersion: "1.2.3",
  });
});

test("Cloudflare preview and local Git fallback resolve consistently", () => {
  assert.equal(resolveLocation({ CF_PAGES_BRANCH: "feature/status" }), "preview");
  assert.equal(resolveLocation({}), "development");
  assert.equal(resolveCommit({ env: {}, getGitCommit: () => gitCommit }), gitCommit);
});

test("invalid, conflicting, or incomplete deployment metadata fails", () => {
  assert.throws(() => resolveCommit({ env: { CF_PAGES_COMMIT_SHA: "bad" } }), /full Git SHA/);
  assert.throws(() => resolveCommit({
    env: { CF_PAGES_COMMIT_SHA: cloudflareCommit },
    getGitCommit: () => gitCommit,
  }), /does not match/);
  assert.throws(() => resolveLocation({ CF_PAGES_BRANCH: "" }), /must not be empty/);
  assert.throws(() => resolveLocation({ CI: "true" }), /Set STATUS_LOCATION/);
  assert.throws(() => createBuildMetadata({
    env: { STATUS_LOCATION: "preview" },
    getGitCommit: () => { throw new Error("Git unavailable"); },
    warn: () => {},
    packageVersion: "1.2.3",
  }), /require a valid Git commit/);
});

test("the footer exposes build identity as plain text without advertising /status", async () => {
  const footer = await readFile(new URL("../src/components/SiteFooter.astro", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../src/pages/sitemap.xml.ts", import.meta.url), "utf8");

  assert.match(footer, /<span class="footer-build">v\{__BUILD_METADATA__\.packageVersion\} · \{__BUILD_METADATA__\.version\}<\/span>/);
  assert.doesNotMatch(footer, /href=["']\/status(?:["'/?#])/);
  assert.doesNotMatch(sitemap, /\/status/);
});
