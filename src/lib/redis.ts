import { Redis } from "@upstash/redis";

// Try different credential combinations
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

console.log("Redis config:", {
  url: url ? "SET" : "NOT SET",
  token: token ? "SET" : "NOT SET",
  urlValue: url,
  tokenLength: token ? token.length : 0
});

if (!url || !token) {
  console.warn("Upstash Redis env vars not set. Please configure KV_REST_API_URL and KV_REST_API_TOKEN.");
}

export const redis = new Redis({
  url: url || "",
  token: token || "",
});

