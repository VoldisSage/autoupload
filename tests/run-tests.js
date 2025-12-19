import assert from "node:assert/strict";
import { config } from "../dist/config.js";

function run() {
  assert.ok(config.twitch.broadcasterId, "Missing twitch.broadcasterId");
  assert.ok(config.obs.recordingsPath, "Missing obs.recordingsPath");
  assert.ok(config.openai.model, "Missing openai.model");
  assert.ok(config.youtube.refreshToken, "Missing youtube.refreshToken");
  assert.ok(config.discord.webhookUrl, "Missing discord.webhookUrl");
  assert.ok(config.twitch.pollIntervalSeconds > 0, "pollIntervalSeconds must be > 0");
}

try {
  run();
  console.log("Tests passed.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Tests failed: ${message}`);
  process.exit(1);
}
