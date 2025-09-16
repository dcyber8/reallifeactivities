// COMMENTED OUT - Backend implementation for later
// Will implement proper Redis-based volume tracking later
// For now, using frontend-only approach with DEXScreener API

/*
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Static Redis configuration (temporary - will move to env later)
const redis = new Redis({
  url: "https://giving-minnow-63833.upstash.io",
  token: "ARjrASQ_ZGIxNThkMWUtZmU4Yi00YzM3LTg3NmYtYTdhYWUwMjY2OGQwQWZsWkFBSW5jREUyWmpVM01UQm1PVEpqWXpnME9EaGhZakptWmpOaE5tTXpNekUzWVdGak0zQXhOak40TXpN",
});

/*
// Choose a pair: prioritize highest liquidity USD if available
function pickBestPair(pairs: any[]): any | null {
  if (!pairs || !Array.isArray(pairs) || pairs.length === 0) return null;
  const withLiq = pairs.filter((p) => p?.liquidity?.usd != null);
  if (withLiq.length === 0) return pairs[0];
  withLiq.sort((a, b) => (parseFloat(b.liquidity.usd ?? 0) || 0) - (parseFloat(a.liquidity.usd ?? 0) || 0));
  return withLiq[0];
}

async function fetchDexScreener(token: string): Promise<{
  volume24hUsd: number;
  priceUsd: number;
  marketCap: number;
  supply: number;
}> {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token}`, {
    // 2s polling; allow short cache to reduce rate
    headers: { "cache-control": "no-cache" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`DEXScreener error: ${res.status}`);
  const data = await res.json();
  const pair = pickBestPair(data?.pairs || []);
  if (!pair) throw new Error("No pairs found for token");

  const volume24hUsd = parseFloat(pair?.volume?.h24 || "0") || 0;
  const priceUsd = parseFloat(pair?.priceUsd || "0") || 0;
  const marketCap = parseFloat(pair?.marketCap || "0") || 0;
  const supply = parseFloat(pair?.totalSupply || "0") || 0;
  return { volume24hUsd, priceUsd, marketCap, supply };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || process.env.TOKEN_ADDRESS || "2AmxjuPBs7kwKFeQk143xhqAprSBc36f26guZx81pump";
    const doUpdate = searchParams.get("update") === "1";

    const keyBase = `rla:${token}`;
    const kLastObserved = `${keyBase}:lastObserved24hUsd`;
    const kTracked = `${keyBase}:trackedVolumeUsd`;
    const kInitialized = `${keyBase}:initialized`;
    const kLastUpdated = `${keyBase}:lastUpdatedAt`;

    if (doUpdate) {
      // Fetch latest 24h volume from DEXScreener
      let observed: number | null = null;
      let priceUsd = 0, marketCap = 0, supply = 0;
      try {
        const dex = await fetchDexScreener(token);
        observed = dex.volume24hUsd;
        priceUsd = dex.priceUsd;
        marketCap = dex.marketCap;
        supply = dex.supply;

      } catch (e) {
        // If DEX call fails, just return current state (no increment)
        const tracked = await redis.get(kTracked);
        const lastObserved = await redis.get(kLastObserved);
        const initialized = await redis.get(kInitialized);
        const lastUpdatedAt = await redis.get(kLastUpdated);

        return NextResponse.json({
          trackedVolumeUsd: Number(tracked) || 0,
          lastObserved24hUsd: Number(lastObserved) || 0,
          initialized: initialized === "1",
          lastUpdatedAt: lastUpdatedAt || null,
          priceUsd, marketCap, supply,
        });
      }

      // Simple Redis operations (non-atomic for now)
      const nowIso = new Date().toISOString();

      // Get current values
      const lastObserved = await redis.get(kLastObserved);
      const currentTracked = await redis.get(kTracked);
      const isInitialized = await redis.get(kInitialized);

      let trackedVolumeUsd: number;
      let lastObserved24hUsd: number;

      if (!isInitialized || lastObserved === null) {
        // First time initialization
        trackedVolumeUsd = 0;
        lastObserved24hUsd = observed;

        await redis.set(kLastObserved, observed);
        await redis.set(kTracked, 0);
        await redis.set(kInitialized, "1");
        await redis.set(kLastUpdated, nowIso);
      } else {
        // Calculate delta and update
        const lastObservedNum = Number(lastObserved) || 0;
        const currentTrackedNum = Number(currentTracked) || 0;
        const delta = observed - lastObservedNum;

        if (delta > 0) {
          trackedVolumeUsd = currentTrackedNum + delta;
        } else {
          trackedVolumeUsd = currentTrackedNum;
        }

        lastObserved24hUsd = observed;

        await redis.set(kLastObserved, observed);
        await redis.set(kTracked, trackedVolumeUsd);
        await redis.set(kLastUpdated, nowIso);
      }
      return NextResponse.json({
        trackedVolumeUsd,
        lastObserved24hUsd,
        initialized: true,
        lastUpdatedAt: nowIso,
        priceUsd, marketCap, supply,
      });
    } else {
      const tracked = await redis.get(kTracked);
      const lastObserved = await redis.get(kLastObserved);
      const initialized = await redis.get(kInitialized);
      const lastUpdatedAt = await redis.get(kLastUpdated);

      return NextResponse.json({
        trackedVolumeUsd: Number(tracked) || 0,
        lastObserved24hUsd: Number(lastObserved) || 0,
        initialized: initialized === "1",
        lastUpdatedAt: lastUpdatedAt || null,
      });
    }
  } catch (err) {
    console.error("/api/volume/status error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
*/

// Simple fallback endpoint for now
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Backend implementation commented out - using frontend-only approach for now"
  });
}

