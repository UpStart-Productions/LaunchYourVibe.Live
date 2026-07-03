#!/usr/bin/env node
/**
 * Build LaunchYourVibe Guardrails Kit:
 * 1. Hash card metadata — skip if unchanged (unless --force)
 * 2. Regenerate kit files
 * 3. Zip with semver version
 * 4. Write to downloads/ and copy to public/downloads/ for static serving
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { generateKitFilesWithReadme } from "./guardrails/generate-kit.mjs";
import { cardsContentHash, loadCards } from "./guardrails/load-cards.mjs";
import { KIT_ROOT_DIR, STARTER_CARD_IDS } from "./guardrails/config.mjs";

const ROOT = process.cwd();
const DOWNLOADS_DIR = join(ROOT, "downloads");
const PUBLIC_DOWNLOADS_DIR = join(ROOT, "public/downloads");
const MANIFEST_PATH = join(DOWNLOADS_DIR, "manifest.json");
const WORKING_KIT_DIR = join(DOWNLOADS_DIR, KIT_ROOT_DIR);

const force = process.argv.includes("--force");

/**
 * @param {string} version
 */
function bumpPatch(version) {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid semver: ${version}`);
  }
  parts[2] += 1;
  return parts.join(".");
}

/**
 * @param {string} input
 */
function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * @param {string} version
 */
function zipFileName(version) {
  return `launchyourvibe-guardrails-v${version}.zip`;
}

/**
 * @param {string} sourceDir
 * @param {string} zipPath
 */
function createZip(sourceDir, zipPath) {
  const parent = join(sourceDir, "..");
  const folder = KIT_ROOT_DIR;

  rmSync(zipPath, { force: true });

  try {
    execSync(`zip -rq "${zipPath}" "${folder}"`, {
      cwd: parent,
      stdio: "inherit",
    });
  } catch (error) {
    throw new Error(
      `Failed to create zip. Ensure the 'zip' CLI is installed.\n${error instanceof Error ? error.message : error}`,
    );
  }
}

/**
 * @param {Map<string, string>} files
 */
function writeKitFiles(files) {
  rmSync(WORKING_KIT_DIR, { recursive: true, force: true });

  for (const [relativePath, content] of files) {
    const absolutePath = join(DOWNLOADS_DIR, relativePath);
    mkdirSync(join(absolutePath, ".."), { recursive: true });
    writeFileSync(absolutePath, content, "utf8");
  }
}

function readManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return null;
  }

  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function main() {
  const cards = loadCards();
  const configSource = readFileSync(
    join(ROOT, "scripts/guardrails/config.mjs"),
    "utf8",
  );
  const contentInput = `${cardsContentHash(cards)}\n${configSource}`;
  const contentHash = sha256(contentInput);
  const previous = readManifest();

  if (
    !force &&
    previous?.contentHash === contentHash &&
    existsSync(join(DOWNLOADS_DIR, previous.zipFileName ?? ""))
  ) {
    console.log(
      `[guardrails] No card changes detected (hash ${contentHash.slice(0, 12)}…). Skipping rebuild.`,
    );
    console.log(`[guardrails] Current kit: ${previous.zipFileName} (v${previous.version})`);
    console.log("[guardrails] Use --force to rebuild anyway.");
    return;
  }

  const version =
    previous?.contentHash === contentHash
      ? previous.version
      : previous?.version
        ? bumpPatch(previous.version)
        : "1.0.0";

  if (force && previous?.contentHash === contentHash) {
    console.log("[guardrails] --force rebuild with unchanged card content.");
  } else {
    console.log("[guardrails] Card content changed — rebuilding kit.");
  }

  const files = generateKitFilesWithReadme(version, cards);
  writeKitFiles(files);

  mkdirSync(DOWNLOADS_DIR, { recursive: true });
  mkdirSync(PUBLIC_DOWNLOADS_DIR, { recursive: true });

  const zipName = zipFileName(version);
  const zipPath = join(DOWNLOADS_DIR, zipName);
  createZip(WORKING_KIT_DIR, zipPath);

  const publicZipPath = join(PUBLIC_DOWNLOADS_DIR, zipName);
  cpSync(zipPath, publicZipPath);

  if (previous?.zipFileName && previous.zipFileName !== zipName) {
    rmSync(join(DOWNLOADS_DIR, previous.zipFileName), { force: true });
    rmSync(join(PUBLIC_DOWNLOADS_DIR, previous.zipFileName), { force: true });
  }

  const manifest = {
    version,
    contentHash,
    builtAt: new Date().toISOString(),
    zipFileName: zipName,
    cardCount: cards.length,
    starterRuleCount: STARTER_CARD_IDS.length,
    downloadPath: `/downloads/${zipName}`,
  };

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const publicManifestPath = join(PUBLIC_DOWNLOADS_DIR, "manifest.json");
  writeFileSync(publicManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`[guardrails] Built v${version} → downloads/${zipName}`);
  console.log(`[guardrails] Copied to public/downloads/${zipName}`);
  console.log(`[guardrails] ${cards.length} cards · hash ${contentHash.slice(0, 12)}…`);
}

main();
