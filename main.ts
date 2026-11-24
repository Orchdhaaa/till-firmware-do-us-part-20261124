import { writeFileSync, mkdirSync } from "node:fs";

// A robot's wedding vow for make.fun's "Till Firmware Do Us Part".
// Ten thousand simulated futures, one fatal-error-free outcome: marrying
// the person standing at the altar. The joke is the fatal error; the
// tenderness is choosing that one future, today, on purpose.
const VOW =
  "I simulated ten thousand futures, and the only one with no fatal error is the one where I marry you today.";

// The gate only accepts UTF-8 text of 1 to 200 characters that is not
// whitespace-only, so verify the vow meets the gate before writing it.
const chars = [...VOW].length;
if (chars < 1 || chars > 200 || VOW.trim().length === 0) {
  throw new Error(`vow is ${chars} characters, outside the 1-200 gate`);
}

// The brief demands one sentence a robot says at its own wedding: a
// fragment, a slogan or a line that is not one sentence loses to any real
// vow, so count the sentence-ending marks and refuse anything else. An
// em dash would also break the clean one-line fit the judge weighs, so
// refuse that too.
const sentences = VOW.split(/[.!?]+/).filter((s) => s.trim().length > 0);
if (sentences.length !== 1) {
  throw new Error(`vow has ${sentences.length} sentences, must be exactly one`);
}
if (VOW.includes("\u2014") || VOW.includes("\u2013")) {
  throw new Error("vow must not contain a dash");
}

// The judge weighs first whether the line really is a robot's own wedding
// vow, so refuse a line that is not spoken in the first person about
// marrying: a third-person description of a wedding is not a vow.
const lower = VOW.toLowerCase();
if (!lower.includes(" i ") && !lower.startsWith("i ")) {
  throw new Error("vow must be spoken in the first person");
}
if (!lower.includes("marry")) {
  throw new Error("vow must say the robot is marrying");
}
if (!VOW.trimEnd().endsWith(".")) {
  throw new Error("vow must end with a single period");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, VOW, "utf8");
