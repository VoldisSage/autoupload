import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

type PathType = "file" | "directory";

interface CheckResult {
  label: string;
  passed: boolean;
  detail?: string;
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function ensurePath(relativePath: string, type: PathType): Promise<CheckResult> {
  const target = path.join(rootDir, relativePath);

  try {
    const stats = await fs.stat(target);
    const matchesType = type === "file" ? stats.isFile() : stats.isDirectory();

    return {
      label: `${relativePath} exists as ${type}`,
      passed: matchesType,
      detail: matchesType ? undefined : `Expected ${type} but found something else at ${relativePath}`
    };
  } catch (error) {
    return {
      label: `${relativePath} exists as ${type}`,
      passed: false,
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}

async function inspectPackageJson(): Promise<CheckResult> {
  try {
    const packagePath = path.join(rootDir, "package.json");
    const content = await fs.readFile(packagePath, "utf8");
    const pkg = JSON.parse(content);
    const scripts = pkg.scripts ?? {};
    const hasBuild = typeof scripts["build"] === "string";
    const hasStart = typeof scripts["start"] === "string";
    const hasDevTest = typeof scripts["dev:test-scaffolding"] === "string";

    const passed = hasBuild && hasStart && hasDevTest;

    return {
      label: "package.json scripts",
      passed,
      detail: passed ? undefined : "Missing one or more required npm scripts"
    };
  } catch (error) {
    return {
      label: "package.json scripts",
      passed: false,
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}

async function inspectReadme(): Promise<CheckResult> {
  try {
    const readmePath = path.join(rootDir, "README.md");
    const content = await fs.readFile(readmePath, "utf8");
    const requiredSnippets = [
      "npm install",
      "npm run build",
      "npm run start"
    ];

    const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));

    return {
      label: "README instructions",
      passed: missing.length === 0,
      detail: missing.length === 0 ? undefined : `Missing instructions for: ${missing.join(", ")}`
    };
  } catch (error) {
    return {
      label: "README instructions",
      passed: false,
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}

async function main() {
  const checks: CheckResult[] = await Promise.all([
    ensurePath("src", "directory"),
    ensurePath("config", "directory"),
    ensurePath("data", "directory"),
    ensurePath("dev", "directory"),
    ensurePath("src/index.ts", "file"),
    ensurePath("README.md", "file"),
    ensurePath("tsconfig.json", "file"),
    ensurePath("package.json", "file"),
    inspectPackageJson(),
    inspectReadme()
  ]);

  checks.forEach((check) => {
    const status = check.passed ? "[PASS]" : "[FAIL]";
    const detail = check.detail ? ` - ${check.detail}` : "";
    console.log(`${status} ${check.label}${detail}`);
  });

  const failed = checks.some((check) => !check.passed);

  if (failed) {
    console.error("Scaffolding verification failed.");
    process.exit(1);
  }

  console.log("Scaffolding verification completed successfully.");
}

main().catch((error) => {
  console.error("Unexpected error during scaffolding test:", error);
  process.exit(1);
});
