import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const version = packageJson.version || "0.1.0";
const distDir = join(root, "dist");
const zipName = `myfolio-portfolio-agent-v${version}.zip`;
const zipPath = join(distDir, zipName);
const includePaths = ["SKILL.md", "README.md", "examples", "docs"];

await mkdir(distDir, { recursive: true });
await rm(zipPath, { force: true });

await run("zip", ["-r", zipPath, ...includePaths], root);

const zipBytes = await readFile(zipPath);
const sha256 = createHash("sha256").update(zipBytes).digest("hex");
await writeFile(join(distDir, `${zipName}.sha256`), `${sha256}  ${zipName}\n`);

console.log(`Created ${zipPath}`);
console.log(`SHA256 ${sha256}`);

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}
