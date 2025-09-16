/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface VolumeTrackerProps {
  onVolumeUpdate: (additionalTimeMs: number) => void;
  onInitialVolumeLoad: (baseTimeMs: number) => void;
}

export default function VolumeTracker({ onVolumeUpdate, onInitialVolumeLoad }: VolumeTrackerProps) {
  const [volume24h, setVolume24h] = useState(0);
  const [price, setPrice] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [supply, setSupply] = useState(0);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [pairCount, setPairCount] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const hasInitialized = useRef(false);
  const lastTimeAdded = useRef(0);

  // Real Life Activities token on pump.fun
  const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || 'AiX3tmxrGxp4EBfULRZyzsXF4KPYGhwYSzYE5mHepump';
  const fetchVolumeData = useCallback(async () => {
      try {
        setError(null);
        console.log('Fetching volume data at:', new Date().toLocaleTimeString());

        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
        const data = await response.json();

        if (!data.pairs || data.pairs.length === 0) {
          throw new Error("No pairs found for token");
        }

        // Calculate combined volume from ALL pairs/bundles
        let totalVolume24h = 0;
        let totalLiquidity = 0;
        let bestPrice = 0;
        let bestMarketCap = 0;
        let bestSupply = 0;

        console.log(`📊 Processing ${data.pairs.length} pair(s)/bundle(s):`);

        data.pairs.forEach((pair: any, index: number) => {
          const volume24h = parseFloat(pair?.volume?.h24 || "0") || 0;
          const liquidity = parseFloat(pair?.liquidity?.usd || "0") || 0;
          const price = parseFloat(pair?.priceUsd || "0") || 0;
          const marketCap = parseFloat(pair?.marketCap || "0") || 0;
          const supply = parseFloat(pair?.totalSupply || "0") || 0;

          // Sum volumes and liquidity from all pairs
          totalVolume24h += volume24h;
          totalLiquidity += liquidity;

          // Use the highest values for price, market cap, and supply
          if (price > bestPrice) bestPrice = price;
          if (marketCap > bestMarketCap) bestMarketCap = marketCap;
          if (supply > bestSupply) bestSupply = supply;

          console.log(`Bundle ${index + 1}: DEX=${pair?.dexId || 'Unknown'}, Volume=$${volume24h.toLocaleString()}, Liquidity=$${liquidity.toLocaleString()}`);
        });

        console.log(`💰 Total Combined Volume: $${totalVolume24h.toLocaleString()} (from ${data.pairs.length} bundles)`);

        const volume24hUsd = totalVolume24h;
        const priceUsd = bestPrice;
        const marketCap = bestMarketCap;
        const supply = bestSupply;

        // Calculate time to add based on COMBINED volume (every $10 = 1 second)
        const timeToAddSeconds = Math.floor(volume24hUsd / 10);
        const timeToAddMs = timeToAddSeconds * 1000; // Convert to milliseconds

        console.log(`⏰ Time calculation: $${volume24hUsd.toLocaleString()} ÷ $10 = ${timeToAddSeconds} seconds (${Math.floor(timeToAddSeconds / 60)}m ${timeToAddSeconds % 60}s)`);

        // Only call onInitialVolumeLoad on first successful fetch
        if (!hasInitialized.current) {
          hasInitialized.current = true;
          console.log(`🎯 Initial volume load: Adding ${timeToAddSeconds} seconds to countdown`);
          onInitialVolumeLoad(timeToAddMs);
          lastTimeAdded.current = timeToAddSeconds;
        } else {
          // For subsequent updates, calculate incremental time
          const newTimeToAddSeconds = timeToAddSeconds - lastTimeAdded.current;
          if (newTimeToAddSeconds > 0) {
            const newTimeToAddMs = newTimeToAddSeconds * 1000;
            console.log(`📈 Volume increased: Adding ${newTimeToAddSeconds} additional seconds to countdown`);
            onVolumeUpdate(newTimeToAddMs);
            lastTimeAdded.current = timeToAddSeconds;
          } else {
            console.log(`📊 Volume unchanged or decreased: No additional time added`);
          }
        }

        // Update display values
        setVolume24h(volume24hUsd);
        setPrice(priceUsd);
        setMarketCap(marketCap);
        setSupply(supply);
        setTotalLiquidity(totalLiquidity);
        setPairCount(data.pairs.length);

      } catch (error) {
        console.error("Failed to fetch volume data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch data");
      }
    }, [TOKEN_ADDRESS, onInitialVolumeLoad, onVolumeUpdate]);

  useEffect(() => {
    // Initial fetch
    fetchVolumeData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchVolumeData, 30000);
    return () => clearInterval(interval);
  }, [fetchVolumeData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-500 p-6 text-center">
        <h3 className="text-xl font-bold text-red-700 mb-2">
          ⚠️ DATA UNAVAILABLE
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-gray-600">
          Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 border-2 border-black p-6">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
        📊 VOLUME TRACKER
      </h3>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">24H VOLUME (COMBINED)</div>
            <div className="text-lg font-bold text-green-600">{formatCurrency(volume24h)}</div>
            <div className="text-xs text-gray-500">From {pairCount} bundle{pairCount !== 1 ? 's' : ''}</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">TOTAL LIQUIDITY</div>
            <div className="text-lg font-bold text-blue-600">{formatCurrency(totalLiquidity)}</div>
            <div className="text-xs text-gray-500">All pairs combined</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">BEST PRICE</div>
            <div className="text-lg font-bold">{formatCurrency(price)}</div>
            <div className="text-xs text-gray-500">Highest across pairs</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">TIME BONUS</div>
            <div className="text-lg font-bold text-purple-600">
              +{lastTimeAdded.current} sec
            </div>
            <div className="text-xs text-gray-500">From combined volume</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">BEST MARKET CAP</div>
            <div className="text-lg font-bold text-orange-600">{formatCurrency(marketCap)}</div>
            <div className="text-xs text-gray-500">Highest across pairs</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">TOTAL SUPPLY</div>
            <div className="text-lg font-bold">{supply.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Token supply</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">STATUS</div>
            <div className="text-lg font-bold text-green-600">
              {hasInitialized.current ? "TRACKING" : "INITIALIZING"}
            </div>
            <div className="text-xs text-gray-500">Volume monitoring</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Updates every 30 seconds
      </div>
    </div>
  );
}
