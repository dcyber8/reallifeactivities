# Real Life Activities - How It Works

## 🎯 **Stream Time Extension System**

The countdown timer dynamically extends based on real-time trading volume of the token. The more the community trades, the longer the stream continues!

### ⏱️ **Time Calculation Formula**

**Every $10 USD of 24-hour trading volume = +1 second added to countdown**

#### Examples:
- **$600 volume** = 60 seconds = **+1 minute**
- **$6,000 volume** = 600 seconds = **+10 minutes** 
- **$36,000 volume** = 3,600 seconds = **+1 hour**
- **$360,000 volume** = 36,000 seconds = **+10 hours**

### 📊 **Volume Tracking**

- **Data Source**: DEXScreener API (real-time Solana DEX data)
- **Update Frequency**: Every 30 seconds
- **Volume Type**: 24-hour sliding window trading volume
- **Calculation**: `Math.floor(volume24hUsd / 10)` seconds

### 🔄 **How Updates Work**

1. **Initial Load**: Base time calculated from current 24h volume
2. **Incremental Updates**: Only volume increases add time (decreases ignored)
3. **Real-time Display**: Shows current volume, price, market cap, and time bonus
4. **Countdown Extension**: New time automatically added to the countdown

## 🛠️ **Configuration**

### Environment Variables

```env
# Token Configuration
NEXT_PUBLIC_TOKEN_ADDRESS="your-solana-token-address"

# Social Media Links (leave empty to hide)
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/yourhandle"
NEXT_PUBLIC_TELEGRAM_URL="https://t.me/yourchannel"
NEXT_PUBLIC_PUMPFUN_URL="https://pump.fun/coin/your-token-address"
```

### Social Media Buttons

- **Conditional Display**: Only shows buttons for provided URLs
- **Auto-hide**: If all social URLs are empty, entire section disappears
- **Position**: Located between countdown and volume tracker

### Banner

- **File**: `/public/banner.png`
- **Format**: PNG recommended
- **Size**: 800x200px optimal
- **Auto-responsive**: Scales for mobile devices

## 📱 **User Interface**

### Layout Order:
1. **Header Banner** - Main promotional image
2. **Countdown Timer** - Shows time remaining until stream end
3. **Social Media Buttons** - Follow/join community links
4. **Volume Tracker** - Real-time token data and time bonus
5. **Activities Bingo** - Interactive engagement card
6. **Call to Action** - Direct link to pump.fun
7. **How It Works** - Explanation section

### Volume Tracker Display:
- **24H Volume**: Current trading volume in USD
- **Current Price**: Token price in USD
- **Market Cap**: Total market capitalization
- **Time Bonus**: Seconds added from volume (+X sec)
- **Supply**: Total token supply
- **Status**: TRACKING or INITIALIZING

## 🔧 **Technical Details**

### Frontend-Only Approach:
- Direct API calls to DEXScreener
- No backend database required
- Client-side volume calculations
- Real-time updates every 30 seconds

### Time Management:
- Base countdown: Fixed end time
- Volume bonus: Added to base time
- Incremental updates: Only positive changes
- Persistent across page refreshes

### Error Handling:
- API failure fallback
- Network error recovery
- Invalid data protection
- Graceful degradation

## 🚀 **Getting Started**

1. **Set Token Address**: Update `NEXT_PUBLIC_TOKEN_ADDRESS` in `.env`
2. **Configure Socials**: Add your social media URLs to `.env`
3. **Add Banner**: Replace `/public/banner.png` with your image
4. **Deploy**: Application automatically adapts to your configuration

## 📈 **Volume Impact Examples**

| Trading Volume | Time Added | Real Impact |
|---------------|------------|-------------|
| $100 | 10 seconds | Minimal extension |
| $1,000 | 100 seconds | ~1.5 minutes |
| $10,000 | 1,000 seconds | ~16 minutes |
| $100,000 | 10,000 seconds | ~2.8 hours |
| $1,000,000 | 100,000 seconds | ~27.8 hours |

The system encourages community engagement - the more people trade, the longer everyone gets to enjoy the stream!
