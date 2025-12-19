import { config } from "../src/config.ts";
import {
  logError,
  logInfo,
  resetDiscordWebhookSender,
  setDiscordWebhookSender
} from "../src/services/discordLogger.ts";

interface CapturedMessage {
  url: string;
  content: string;
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function run(): Promise<void> {
  const captured: CapturedMessage[] = [];

  setDiscordWebhookSender(async (url, payload) => {
    captured.push({ url, content: payload.content });
  });

  try {
    await logInfo("Prueba de info");
    await logError("Prueba de error", new Error("Error de prueba"));
  } finally {
    resetDiscordWebhookSender();
  }

  assert(captured.length === 2, `Expected 2 messages, got ${captured.length}.`);
  assert(
    captured.every((message) => message.url === config.discord.webhookUrl),
    "Expected all messages to use the configured webhook URL."
  );

  const [infoMessage, errorMessage] = captured.map((message) => message.content);
  assert(infoMessage === "ƒo. Prueba de info", `Unexpected info message: ${infoMessage}`);

  const errorPrefix = "ƒ?O Ha ocurrido un error: Prueba de error";
  assert(errorMessage.startsWith(errorPrefix), `Unexpected error prefix: ${errorMessage}`);
  assert(
    errorMessage.includes("```") && errorMessage.includes("Error de prueba"),
    "Expected error message to include a code block with error details."
  );

  console.log("Discord logger dev test passed.");
  console.log("Captured messages:", captured);
}

run().catch((error) => {
  const details = error instanceof Error ? error.message : String(error);
  console.error(`Discord logger dev test failed: ${details}`);
  process.exitCode = 1;
});
