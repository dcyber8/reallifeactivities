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

        // Find the best pair (highest liquidity USD)
        const bestPair = data.pairs.reduce((best: any, current: any) => {
          const bestLiq = parseFloat(best?.liquidity?.usd || "0");
          const currentLiq = parseFloat(current?.liquidity?.usd || "0");
          return currentLiq > bestLiq ? current : best;
        });

        const volume24hUsd = parseFloat(bestPair?.volume?.h24 || "0");
        const priceUsd = parseFloat(bestPair?.priceUsd || "0");
        const marketCap = parseFloat(bestPair?.marketCap || "0");
        const supply = parseFloat(bestPair?.totalSupply || "0");

        // Calculate time to add based on volume (every $10 = 1 second)
        const timeToAddSeconds = Math.floor(volume24hUsd / 10);
        const timeToAddMs = timeToAddSeconds * 1000; // Convert to milliseconds

        // Only call onInitialVolumeLoad on first successful fetch
        if (!hasInitialized.current) {
          hasInitialized.current = true;
          onInitialVolumeLoad(timeToAddMs);
          lastTimeAdded.current = timeToAddSeconds;
        } else {
          // For subsequent updates, calculate incremental time
          const newTimeToAddSeconds = timeToAddSeconds - lastTimeAdded.current;
          if (newTimeToAddSeconds > 0) {
            const newTimeToAddMs = newTimeToAddSeconds * 1000;
            onVolumeUpdate(newTimeToAddMs);
            lastTimeAdded.current = timeToAddSeconds;
          }
        }

        // Update display values
        setVolume24h(volume24hUsd);
        setPrice(priceUsd);
        setMarketCap(marketCap);
        setSupply(supply);

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
      maximumFractionDigits: 0,
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
            <div className="text-sm text-gray-600">24H VOLUME</div>
            <div className="text-lg font-bold">{formatCurrency(volume24h)}</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">CURRENT PRICE</div>
            <div className="text-lg font-bold">{formatCurrency(price)}</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">MARKET CAP</div>
            <div className="text-lg font-bold">{formatCurrency(marketCap)}</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">TIME BONUS</div>
            <div className="text-lg font-bold text-blue-600">
              +{lastTimeAdded.current} sec
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mt-4">
          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">SUPPLY</div>
            <div className="text-lg font-bold">{formatCurrency(supply)}</div>
          </div>

          <div className="bg-white p-4 border border-black">
            <div className="text-sm text-gray-600">STATUS</div>
            <div className="text-lg font-bold text-green-600">
              {hasInitialized.current ? "TRACKING" : "INITIALIZING"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Updates every 30 seconds
      </div>
    </div>
  );
}
