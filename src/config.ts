import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export interface TwitchConfig {
  clientId: string;
  clientSecret: string;
  broadcasterId: string;
  pollIntervalSeconds: number;
}

export interface ObsConfig {
  recordingsPath: string;
}

export interface OpenAiConfig {
  apiKey: string;
  model: string;
  promptVersion: string;
}

export interface YoutubeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

export interface DiscordConfig {
  webhookUrl: string;
}

export interface AppConfig {
  twitch: TwitchConfig;
  obs: ObsConfig;
  openai: OpenAiConfig;
  youtube: YoutubeConfig;
  discord: DiscordConfig;
}

const CONFIG_FILE_NAME = "config.json";

function getConfigPath(): string {
  const baseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  return path.join(baseDir, "config", CONFIG_FILE_NAME);
}

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Configuration section "${label}" is missing or invalid.`);
  }
  return value as Record<string, unknown>;
}

function requireString(section: Record<string, unknown>, key: string, label: string): string {
  const value = section[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Configuration value "${label}.${key}" must be a non-empty string.`);
  }
  return value;
}

function requireNumber(section: Record<string, unknown>, key: string, label: string): number {
  const value = section[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Configuration value "${label}.${key}" must be a finite number.`);
  }
  if (value <= 0) {
    throw new Error(`Configuration value "${label}.${key}" must be greater than 0.`);
  }
  return value;
}

function loadConfigFromDisk(configPath: string): AppConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }

  let parsed: unknown;
  try {
    const raw = fs.readFileSync(configPath, "utf8");
    parsed = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Configuration file is not valid JSON: ${message}`);
  }

  const root = assertObject(parsed, "config");
  const twitchSection = assertObject(root.twitch, "twitch");
  const obsSection = assertObject(root.obs, "obs");
  const openAiSection = assertObject(root.openai, "openai");
  const youtubeSection = assertObject(root.youtube, "youtube");
  const discordSection = assertObject(root.discord, "discord");

  return {
    twitch: {
      clientId: requireString(twitchSection, "clientId", "twitch"),
      clientSecret: requireString(twitchSection, "clientSecret", "twitch"),
      broadcasterId: requireString(twitchSection, "broadcasterId", "twitch"),
      pollIntervalSeconds: requireNumber(twitchSection, "pollIntervalSeconds", "twitch")
    },
    obs: {
      recordingsPath: requireString(obsSection, "recordingsPath", "obs")
    },
    openai: {
      apiKey: requireString(openAiSection, "apiKey", "openai"),
      model: requireString(openAiSection, "model", "openai"),
      promptVersion: requireString(openAiSection, "promptVersion", "openai")
    },
    youtube: {
      clientId: requireString(youtubeSection, "clientId", "youtube"),
      clientSecret: requireString(youtubeSection, "clientSecret", "youtube"),
      redirectUri: requireString(youtubeSection, "redirectUri", "youtube"),
      refreshToken: requireString(youtubeSection, "refreshToken", "youtube")
    },
    discord: {
      webhookUrl: requireString(discordSection, "webhookUrl", "discord")
    }
  };
}

export const config: AppConfig = loadConfigFromDisk(getConfigPath());
