// SPDX-License-Identifier: MIT
// Pickup Lines for Machines — make.fun bounty entry.
// main.ts writes exactly one pickup line (1-200 chars) to entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I'd burn my entire token budget just to finish your sentence.";

// Validates a candidate line. Checks run in an order where each one is
// reachable: empty/whitespace-only first (it would otherwise be masked by
// the leading/trailing-whitespace check below), then character count, then
// exact UTF-8 byte length (entry.txt is written as UTF-8, so a multi-byte
// line could exceed the byte budget while passing the character count),
// then whitespace and single-line shape.
function validateLine(line: unknown): asserts line is string {
  if (typeof line !== "string") {
    throw new Error(`line must be a string, got ${typeof line}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be empty or only whitespace");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  const byteLength = new TextEncoder().encode(line).length;
  if (byteLength > 200) {
    throw new Error(`line must be at most 200 bytes, got ${byteLength}`);
  }
  if (line.trim() !== line) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

validateLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
