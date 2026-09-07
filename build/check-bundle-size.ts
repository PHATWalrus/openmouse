import { execSync } from "child_process";
import { readFileSync } from "fs";

// Bundle size budget in bytes. Increase when adding substantial features
// like new locales, significant dependencies, or major functionality.
const BUDGET_BYTES = 1250000; // ~1.25 MB budget

// Find the built bundle
const output = execSync("ls -la dist/", { encoding: "utf-8" });
const jsFile = output
  .split("\n")
  .find((line) => line.includes(".js") && !line.includes(".map"));

if (!jsFile) {
  console.error("❌ No JS bundle found in dist/");
  process.exit(1);
}

const bundlePath = jsFile.split(/\s+/).pop();
if (!bundlePath) {
  console.error("❌ Could not parse bundle path");
  process.exit(1);
}

const stats = readFileSync(`dist/${bundlePath}`);
const sizeBytes = stats.length;
const percentage = Math.round((sizeBytes / BUDGET_BYTES) * 100);

if (sizeBytes > BUDGET_BYTES) {
  console.error(`over budget  JS  ${sizeBytes} / ${BUDGET_BYTES} bytes (${percentage}%)`);
  console.error("");
  console.error("A bundle grew past its budget. Justify the growth and raise BUDGET_BYTES,");
  console.error("or find what was added. Adding a CSS framework once cost 19 kB unnoticed.");
  process.exit(1);
}

console.log(`✓ Bundle size OK: ${sizeBytes} / ${BUDGET_BYTES} bytes (${percentage}%)`);
