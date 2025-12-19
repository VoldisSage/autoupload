import { config } from "../src/config.ts";

interface CheckResult {
  label: string;
  passed: boolean;
  detail?: string;
}

function checkNonEmpty(value: string, label: string): CheckResult {
  const passed = value.trim().length > 0;
  return {
    label,
    passed,
    detail: passed ? undefined : "Expected non-empty string"
  };
}

function checkPositiveNumber(value: number, label: string): CheckResult {
  const passed = Number.isFinite(value) && value > 0;
  return {
    label,
    passed,
    detail: passed ? undefined : "Expected number greater than 0"
  };
}

function main() {
  const checks: CheckResult[] = [
    checkNonEmpty(config.twitch.clientId, "twitch.clientId"),
    checkNonEmpty(config.twitch.clientSecret, "twitch.clientSecret"),
    checkNonEmpty(config.twitch.broadcasterId, "twitch.broadcasterId"),
    checkPositiveNumber(config.twitch.pollIntervalSeconds, "twitch.pollIntervalSeconds"),
    checkNonEmpty(config.obs.recordingsPath, "obs.recordingsPath"),
    checkNonEmpty(config.openai.apiKey, "openai.apiKey"),
    checkNonEmpty(config.openai.model, "openai.model"),
    checkNonEmpty(config.openai.promptVersion, "openai.promptVersion"),
    checkNonEmpty(config.youtube.clientId, "youtube.clientId"),
    checkNonEmpty(config.youtube.clientSecret, "youtube.clientSecret"),
    checkNonEmpty(config.youtube.redirectUri, "youtube.redirectUri"),
    checkNonEmpty(config.youtube.refreshToken, "youtube.refreshToken"),
    checkNonEmpty(config.discord.webhookUrl, "discord.webhookUrl")
  ];

  checks.forEach((check) => {
    const status = check.passed ? "[PASS]" : "[FAIL]";
    const detail = check.detail ? ` - ${check.detail}` : "";
    console.log(`${status} ${check.label}${detail}`);
  });

  const failed = checks.some((check) => !check.passed);

  if (failed) {
    console.error("Configuration validation failed.");
    process.exit(1);
  }

  console.log("Configuration validation completed successfully.");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Configuration test error: ${message}`);
  process.exit(1);
}
