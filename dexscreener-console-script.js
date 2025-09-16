/**
 * DexScreens API Console Script
 * 
 * This script fetches data from DexScreens API, combines volumes from ALL pairs/bundles,
 * and calculates time tracking from a specific start date.
 * 
 * Usage:
 * 1. Copy and paste this entire script into browser console
 * 2. Modify TOKEN_ADDRESS and START_DATE as needed
 * 3. Call: await fetchDexScreenerData()
 */

// Configuration
const TOKEN_ADDRESS = "FfTMftfnF64keWwxiREcSBca2PsQtkorb2LWCEdZpump"; // From your .env
const START_DATE = "2024-01-01T00:00:00Z"; // Modify this to your desired start date
const DOLLARS_PER_SECOND = 10; // Every $10 USD = 1 second (from your config)

/**
 * Fetches and processes DexScreens data with combined volume from all pairs
 */
async function fetchDexScreenerData() {
    try {
        console.log("🚀 Fetching DexScreens data...");
        console.log("📅 Start Date:", START_DATE);
        console.log("🪙 Token Address:", TOKEN_ADDRESS);
        console.log("💰 Volume Rate: $" + DOLLARS_PER_SECOND + " = 1 second");
        console.log("─".repeat(60));

        // Fetch data from DexScreens API
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
        
        if (!response.ok) {
            throw new Error(`DexScreens API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.pairs || !Array.isArray(data.pairs) || data.pairs.length === 0) {
            throw new Error("No pairs found for this token");
        }

        console.log(`📊 Found ${data.pairs.length} pair(s)/bundle(s):`);
        console.log("─".repeat(60));

        // Process all pairs and calculate combined volume
        let totalVolume24h = 0;
        let totalLiquidity = 0;
        let bestPrice = 0;
        let bestMarketCap = 0;
        let totalSupply = 0;

        data.pairs.forEach((pair, index) => {
            const volume24h = parseFloat(pair?.volume?.h24 || "0") || 0;
            const liquidity = parseFloat(pair?.liquidity?.usd || "0") || 0;
            const price = parseFloat(pair?.priceUsd || "0") || 0;
            const marketCap = parseFloat(pair?.marketCap || "0") || 0;
            const supply = parseFloat(pair?.totalSupply || "0") || 0;

            // Sum volumes from all pairs
            totalVolume24h += volume24h;
            totalLiquidity += liquidity;

            // Use the highest values for price, market cap, and supply
            if (price > bestPrice) bestPrice = price;
            if (marketCap > bestMarketCap) bestMarketCap = marketCap;
            if (supply > totalSupply) totalSupply = supply;

            console.log(`Bundle ${index + 1}:`);
            console.log(`  📈 DEX: ${pair?.dexId || 'Unknown'}`);
            console.log(`  💧 Liquidity: $${liquidity.toLocaleString()}`);
            console.log(`  📊 24h Volume: $${volume24h.toLocaleString()}`);
            console.log(`  💲 Price: $${price}`);
            console.log(`  🏪 Pair: ${pair?.baseToken?.symbol || '?'}/${pair?.quoteToken?.symbol || '?'}`);
            console.log(`  🔗 URL: ${pair?.url || 'N/A'}`);
            console.log("");
        });

        // Calculate time tracking
        const startDate = new Date(START_DATE);
        const currentDate = new Date();
        const timeElapsedMs = currentDate.getTime() - startDate.getTime();
        const timeElapsedSeconds = Math.floor(timeElapsedMs / 1000);
        const timeElapsedMinutes = Math.floor(timeElapsedSeconds / 60);
        const timeElapsedHours = Math.floor(timeElapsedMinutes / 60);
        const timeElapsedDays = Math.floor(timeElapsedHours / 24);

        // Calculate time bonus from volume
        const timeBonusSeconds = Math.floor(totalVolume24h / DOLLARS_PER_SECOND);
        const timeBonusMinutes = Math.floor(timeBonusSeconds / 60);
        const timeBonusHours = Math.floor(timeBonusMinutes / 60);

        // Display results
        console.log("🎯 COMBINED RESULTS:");
        console.log("═".repeat(60));
        console.log(`💰 Total 24h Volume (All Bundles): $${totalVolume24h.toLocaleString()}`);
        console.log(`💧 Total Liquidity: $${totalLiquidity.toLocaleString()}`);
        console.log(`💲 Best Price: $${bestPrice}`);
        console.log(`📊 Best Market Cap: $${bestMarketCap.toLocaleString()}`);
        console.log(`🪙 Total Supply: ${totalSupply.toLocaleString()}`);
        console.log("");
        
        console.log("⏰ TIME TRACKING:");
        console.log("─".repeat(40));
        console.log(`📅 Start Date: ${startDate.toLocaleString()}`);
        console.log(`📅 Current Date: ${currentDate.toLocaleString()}`);
        console.log(`⏱️  Time Elapsed: ${timeElapsedDays}d ${timeElapsedHours % 24}h ${timeElapsedMinutes % 60}m ${timeElapsedSeconds % 60}s`);
        console.log("");
        
        console.log("🎁 VOLUME BONUS:");
        console.log("─".repeat(40));
        console.log(`⚡ Time Bonus: ${timeBonusSeconds} seconds (${timeBonusMinutes}m ${timeBonusSeconds % 60}s)`);
        console.log(`📈 Bonus Hours: ${timeBonusHours}h ${timeBonusMinutes % 60}m`);
        console.log(`💡 Rate: $${DOLLARS_PER_SECOND} = 1 second`);

        // Return structured data
        return {
            tokenAddress: TOKEN_ADDRESS,
            startDate: START_DATE,
            currentDate: currentDate.toISOString(),
            timeElapsed: {
                totalSeconds: timeElapsedSeconds,
                days: timeElapsedDays,
                hours: timeElapsedHours % 24,
                minutes: timeElapsedMinutes % 60,
                seconds: timeElapsedSeconds % 60
            },
            volume: {
                total24hUsd: totalVolume24h,
                totalLiquidityUsd: totalLiquidity,
                timeBonusSeconds: timeBonusSeconds,
                timeBonusMinutes: timeBonusMinutes,
                timeBonusHours: timeBonusHours
            },
            token: {
                priceUsd: bestPrice,
                marketCapUsd: bestMarketCap,
                totalSupply: totalSupply
            },
            pairs: data.pairs.map(pair => ({
                dexId: pair?.dexId,
                volume24hUsd: parseFloat(pair?.volume?.h24 || "0") || 0,
                liquidityUsd: parseFloat(pair?.liquidity?.usd || "0") || 0,
                priceUsd: parseFloat(pair?.priceUsd || "0") || 0,
                url: pair?.url,
                baseSymbol: pair?.baseToken?.symbol,
                quoteSymbol: pair?.quoteToken?.symbol
            }))
        };

    } catch (error) {
        console.error("❌ Error fetching DexScreens data:", error);
        throw error;
    }
}

/**
 * Helper function to update the start date and re-fetch data
 */
async function updateStartDate(newStartDate) {
    console.log(`🔄 Updating start date to: ${newStartDate}`);
    // Update the global variable
    window.START_DATE = newStartDate;
    
    // Re-run the fetch with new date
    return await fetchDexScreenerData();
}

/**
 * Helper function to change token address and re-fetch data
 */
async function updateTokenAddress(newTokenAddress) {
    console.log(`🔄 Updating token address to: ${newTokenAddress}`);
    // Update the global variable
    window.TOKEN_ADDRESS = newTokenAddress;
    
    // Re-run the fetch with new token
    return await fetchDexScreenerData();
}

// Make functions available globally for console use
window.fetchDexScreenerData = fetchDexScreenerData;
window.updateStartDate = updateStartDate;
window.updateTokenAddress = updateTokenAddress;
window.START_DATE = START_DATE;
window.TOKEN_ADDRESS = TOKEN_ADDRESS;

console.log("🎯 DexScreens Console Script Loaded!");
console.log("📋 Available commands:");
console.log("  • await fetchDexScreenerData() - Fetch current data");
console.log("  • await updateStartDate('2024-01-15T00:00:00Z') - Change start date");
console.log("  • await updateTokenAddress('NEW_TOKEN_ADDRESS') - Change token");
console.log("");
console.log("🚀 Run: await fetchDexScreenerData()");
