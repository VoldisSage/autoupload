import http from "http";
import https from "https";
import { config } from "../config.js";

interface DiscordWebhookPayload {
  content: string;
}

type DiscordWebhookSender = (url: string, payload: DiscordWebhookPayload) => Promise<void>;

let webhookSender: DiscordWebhookSender = sendWebhookRequest;

export function setDiscordWebhookSender(sender: DiscordWebhookSender): void {
  webhookSender = sender;
}

export function resetDiscordWebhookSender(): void {
  webhookSender = sendWebhookRequest;
}

function sendWebhookRequest(url: string, payload: DiscordWebhookPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    let webhookUrl: URL;
    try {
      webhookUrl = new URL(url);
    } catch (error) {
      reject(new Error(`Discord webhook URL is invalid: ${String(error)}`));
      return;
    }

    const body = JSON.stringify(payload);
    const isHttps = webhookUrl.protocol === "https:";
    const transport = isHttps ? https : http;
    const port = webhookUrl.port ? Number.parseInt(webhookUrl.port, 10) : undefined;

    const request = transport.request(
      {
        method: "POST",
        hostname: webhookUrl.hostname,
        port,
        path: `${webhookUrl.pathname}${webhookUrl.search}`,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const chunks: Buffer[] = [];

        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on("end", () => {
          if (status >= 200 && status < 300) {
            resolve();
            return;
          }

          const responseBody = Buffer.concat(chunks).toString("utf8");
          reject(
            new Error(
              `Discord webhook responded with status ${status}: ${responseBody || "No response body"}`
            )
          );
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });

    request.write(body);
    request.end();
  });
}

function formatErrorDetails(error?: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  if (error === undefined) {
    return "Sin detalles.";
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

async function sendDiscordMessage(message: string): Promise<void> {
  try {
    await webhookSender(config.discord.webhookUrl, { content: message });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error(`Discord webhook failed: ${details}`);
  }
}

export async function logInfo(message: string): Promise<void> {
  await sendDiscordMessage(`ƒo. ${message}`);
}

export async function logError(message: string, error?: unknown): Promise<void> {
  const details = formatErrorDetails(error);
  await sendDiscordMessage(`ƒ?O Ha ocurrido un error: ${message}\n\`\`\`${details}\`\`\``);
}
