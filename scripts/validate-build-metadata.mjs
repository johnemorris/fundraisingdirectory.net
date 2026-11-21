import { readFile, readdir } from "node:fs/promises";
import { loadEnv } from "vite";
import { createAnalyticsBuildConfig } from "./analytics-config.mjs";
import { resolveCommit, resolveLocation } from "./build-metadata.mjs";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const packageMetadata = JSON.parse(await readFile("package.json", "utf8"));
const status = JSON.parse(await readFile("dist/status", "utf8"));
const expectedKeys = ["service", "version", "buildTime", "statusCode", "status", "location"];
const commit = resolveCommit({ env });
const expectedVersion = commit === "unknown" ? "unknown" : commit.slice(0, 8);

if (JSON.stringify(Object.keys(status)) !== JSON.stringify(expectedKeys)) {
  throw new Error("Status endpoint has unexpected fields");
}
if (status.service !== "FundraisingDirectory.net" || status.statusCode !== 200 || status.status !== "OK") {
  throw new Error("Status endpoint has incorrect fixed values");
}
if (status.version !== expectedVersion) throw new Error("Status version does not match the build commit");
if (status.location !== resolveLocation(env)) throw new Error("Status location does not match the build environment");
if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(status.buildTime) || Number.isNaN(Date.parse(status.buildTime))) {
  throw new Error("Status build time is not a UTC ISO 8601 timestamp");
}

const home = await readFile("dist/index.html", "utf8");
const analyticsConfig = createAnalyticsBuildConfig({ env, location: status.location });
const renderedMeasurementId = home.match(/<meta name="fdn-ga-measurement-id" content="([^"]+)">/)?.[1] ?? null;
if (renderedMeasurementId !== analyticsConfig.measurementId) {
  throw new Error("Generated analytics metadata does not match PUBLIC_GA_MEASUREMENT_ID");
}
if (!home.includes(`v${packageMetadata.version} · ${status.version}`)) {
  throw new Error("Footer build identifier does not match the status endpoint");
}
if (!home.includes('<span class="footer-build">')) {
  throw new Error("Footer build identifier is not plain text");
}

const findPublicStatusReferences = async (directory) => {
  const matches = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      matches.push(...await findPublicStatusReferences(path));
    } else if (/\.(?:html|xml)$/i.test(entry.name)) {
      const contents = await readFile(path, "utf8");
      if (contents.includes("/status")) matches.push(path);
    }
  }
  return matches;
};

const advertisedBy = await findPublicStatusReferences("dist");
if (advertisedBy.length) {
  throw new Error(`/status is advertised by public output: ${advertisedBy.join(", ")}`);
}

const sitemap = await readFile("dist/sitemap.xml", "utf8");
if (sitemap.includes("/status")) throw new Error("Status endpoint appeared in the sitemap");

const headers = await readFile("dist/_headers", "utf8");
if (!headers.includes("/status\n  Content-Type: application/json; charset=utf-8")) {
  throw new Error("Status endpoint JSON headers are not configured");
}

console.log(
  `Validated /status, footer, and analytics metadata for ${status.version} (${status.location}; analytics ${analyticsConfig.measurementId ? "configured" : "inactive"}).`,
);
