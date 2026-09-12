#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  processIntakeFile,
  renderReviewMarkdown,
  writePublication,
} from "../src/lib/provider-intake/index.ts";

type Command = "validate" | "review" | "publish";

function usage(): never {
  console.error(`Usage:
  node scripts/provider-intake.ts validate <input.json>
  node scripts/provider-intake.ts review <input.json> [--output-dir <directory>]
  node scripts/provider-intake.ts publish <input.json> [--write] [--allow-destructive] [--actor user_000001]

Publishing is always a dry run unless --write is supplied. A write also requires
workflow.approved=true, workflow.approved_by, and workflow.approved_at in the record.`);
  process.exit(2);
}

function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const command = process.argv[2] as Command | undefined;
const inputPath = process.argv[3];
if (!command || !["validate", "review", "publish"].includes(command) || !inputPath) usage();

const run = await processIntakeFile(inputPath, { actor: option("--actor") });

if (command === "validate") {
  console.log(JSON.stringify({
    run_id: run.runId,
    summary: run.summary,
    records: run.records.map((record) => ({
      record_id: record.recordId,
      draft_valid: record.draftValid,
      publish_ready: record.publishReady,
      classification: record.duplicate.classification,
      issues: record.issues,
    })),
  }, null, 2));
  if (run.summary.validationFailures > 0) process.exitCode = 1;
}

if (command === "review") {
  const markdown = renderReviewMarkdown(run);
  const outputDirectory = option("--output-dir");
  if (!outputDirectory) {
    console.log(markdown);
  } else {
    const resolved = path.resolve(outputDirectory, run.runId);
    await mkdir(resolved, { recursive: true });
    await Promise.all([
      writeFile(path.join(resolved, "review.json"), `${JSON.stringify(run, null, 2)}\n`, "utf8"),
      writeFile(path.join(resolved, "review.md"), markdown, "utf8"),
    ]);
    console.log(`Review artifacts written to ${resolved}`);
  }
}

if (command === "publish") {
  const write = process.argv.includes("--write");
  const allowDestructive = process.argv.includes("--allow-destructive");
  console.log(`# Provider publication ${write ? "write" : "dry run"}\n`);
  console.log(`Run ID: ${run.runId}\n`);
  for (const record of run.records) {
    const preview = record.publication;
    console.log(`## ${record.normalized?.identity?.name ?? `Record ${record.index + 1}`}`);
    if (!preview) {
      console.log("No preview: draft validation failed.\n");
      continue;
    }
    console.log(`Action: ${preview.action}`);
    console.log(`Destination: ${preview.destination}`);
    console.log(`Publish-ready: ${preview.publishReady ? "yes" : "no"}`);
    if (preview.issues.length) console.log(`Issues:\n${JSON.stringify(preview.issues, null, 2)}`);
    if (preview.diff.length) console.log(`Diff:\n${JSON.stringify(preview.diff, null, 2)}`);
    if (preview.generatedContent) console.log(`Generated content:\n\`\`\`yaml\n${preview.generatedContent}\`\`\``);
    if (write) {
      try {
        await writePublication(preview, record.normalized ?? {}, { allowDestructive });
        console.log("Write: completed");
      } catch (error) {
        process.exitCode = 1;
        console.error(`Write: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      console.log("Write: skipped (dry-run default)");
    }
    console.log("");
  }
}
