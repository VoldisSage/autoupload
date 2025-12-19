import { fileURLToPath } from "url";

const APP_NAME = "StreamerTools AutoUploader";

export async function start(): Promise<void> {
  try {
    const { config } = await import("./config.js");
    console.log(`${APP_NAME} started (config loaded for broadcaster ${config.twitch.broadcasterId})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Configuration error: ${message}`);
    process.exit(1);
  }
}

const executedDirectly = process.argv[1] === fileURLToPath(import.meta.url);

if (executedDirectly) {
  void start();
}
