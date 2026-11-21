import { execFileSync } from "node:child_process";

const gitShaPattern = /^(?:[a-f\d]{40}|[a-f\d]{64})$/i;
const platformCommitKeys = ["CF_PAGES_COMMIT_SHA", "WORKERS_CI_COMMIT_SHA"];
const platformBranchKeys = ["CF_PAGES_BRANCH", "WORKERS_CI_BRANCH"];
const locations = ["production", "preview", "development"];

const readGitCommit = () => execFileSync(
  "git",
  ["rev-parse", "HEAD"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
).trim();

export function resolveCommit({ env = process.env, getGitCommit = readGitCommit, warn = console.warn } = {}) {
  const platformCommits = platformCommitKeys
    .filter((key) => env[key] !== undefined)
    .map((key) => ({ key, value: env[key].trim().toLowerCase() }));

  for (const { key, value } of platformCommits) {
    if (!gitShaPattern.test(value)) throw new Error(`${key} must contain a full Git SHA`);
  }
  if (new Set(platformCommits.map(({ value }) => value)).size > 1) {
    throw new Error("Deployment platform commit variables disagree");
  }
  if (platformCommits.length) {
    let checkedOutCommit;
    try {
      checkedOutCommit = getGitCommit().trim().toLowerCase();
    } catch {
      // Cloudflare metadata remains authoritative when the deployment has no .git directory.
    }
    if (gitShaPattern.test(checkedOutCommit ?? "") && checkedOutCommit !== platformCommits[0].value) {
      throw new Error("Deployment platform commit does not match checked-out Git HEAD");
    }
    return platformCommits[0].value;
  }

  try {
    const commit = getGitCommit().trim().toLowerCase();
    if (gitShaPattern.test(commit)) return commit;
  } catch {
    // Local source archives may not include Git metadata.
  }
  warn('Build metadata: no valid Cloudflare commit or Git HEAD; using "unknown".');
  return "unknown";
}

export function resolveLocation(env = process.env) {
  const branches = platformBranchKeys
    .filter((key) => env[key] !== undefined)
    .map((key) => env[key].trim());
  if (branches.some((branch) => !branch)) throw new Error("Deployment platform branch must not be empty");
  if (new Set(branches).size > 1) throw new Error("Deployment platform branch variables disagree");

  if (branches.length) {
    const location = branches[0] === (env.STATUS_PRODUCTION_BRANCH || "main")
      ? "production"
      : "preview";
    if (env.STATUS_LOCATION && env.STATUS_LOCATION !== location) {
      throw new Error("STATUS_LOCATION disagrees with the deployment platform branch");
    }
    return location;
  }

  if (env.STATUS_LOCATION) {
    if (!locations.includes(env.STATUS_LOCATION)) {
      throw new Error("STATUS_LOCATION must be production, preview, or development");
    }
    return env.STATUS_LOCATION;
  }

  if (
    env.CI === "true"
    || env.CI === "1"
    || env.CF_PAGES === "1"
    || env.WORKERS_CI === "1"
    || platformCommitKeys.some((key) => env[key] !== undefined)
  ) {
    throw new Error("Set STATUS_LOCATION for CI builds without a Cloudflare branch variable");
  }
  return "development";
}

export function createBuildMetadata(options = {}) {
  const env = options.env ?? process.env;
  const location = resolveLocation(env);
  const commit = resolveCommit(options);
  if (commit === "unknown" && location !== "development") {
    throw new Error("Deployment builds require a valid Git commit SHA");
  }
  if (typeof options.packageVersion !== "string" || !options.packageVersion.trim()) {
    throw new Error("Build metadata requires the package version");
  }

  return {
    service: "FundraisingDirectory.net",
    version: commit === "unknown" ? "unknown" : commit.slice(0, 8),
    buildTime: (options.now ?? new Date()).toISOString(),
    statusCode: 200,
    status: "OK",
    location,
    packageVersion: options.packageVersion,
  };
}
