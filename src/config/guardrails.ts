import { readFileSync } from "node:fs";
import { join } from "node:path";

export type GuardrailsManifest = {
  version: string;
  contentHash: string;
  builtAt: string;
  zipFileName: string;
  cardCount: number;
  starterRuleCount: number;
  downloadPath: string;
};

const manifestPath = join(process.cwd(), "public/downloads/manifest.json");

export function getGuardrailsManifest(): GuardrailsManifest {
  return JSON.parse(readFileSync(manifestPath, "utf8")) as GuardrailsManifest;
}
