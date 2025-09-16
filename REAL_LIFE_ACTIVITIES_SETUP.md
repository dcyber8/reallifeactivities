# Real Life Activities - Promotional Landing Page

A dynamic promotional landing page for "Real Life Activities" featuring a countdown timer that extends based on crypto token trading volume.

## 🚀 Features

- **24-Hour Countdown Timer**: Dynamic timer that adjusts based on trading volume
- **Volume-Based Time Extension**: 
  - Every $10 in trading volume = +1 minute
  - Every $100 in trading volume = +10 minutes
- **Real-Time Crypto Data**: Fetches live token volume and price data
- **Black & White Theme**: Clean, minimal design with banner integration
- **Interactive Activities Todo List**: Track completion of all activities from the banner
- **Mobile Responsive**: Optimized for all device sizes
- **Social Media Integration**: Links to X (Twitter), Telegram, and Pump.fun

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. ✅ Token Tracking (CONFIGURED)

**ALREADY CONFIGURED**: The app is now set up to track the Real Life Activities token:
- **Token Address**: `FyB8VxxYAaVVchAgbB1kvjWdw26ovaD4ipwV1j8epump`
- **API**: DEXScreener (for real-time Solana token data)
- **Pump.fun Link**: Configured to redirect to the correct stream

#### Update API Endpoint
Choose one of these crypto APIs and update the fetch URL:

**Option A: CoinGecko API (Recommended for established tokens)**
```typescript
const response = await fetch(
  `https://api.coingecko.com/api/v3/coins/YOUR_TOKEN_ID?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
);
```

**Option B: DEXScreener API (Recommended for Solana/DEX tokens)**
```typescript
const response = await fetch(
  `https://api.dexscreener.com/latest/dex/tokens/YOUR_TOKEN_CONTRACT_ADDRESS`
);
```

**Option C: Jupiter API (For Solana tokens)**
```typescript
const response = await fetch(
  `https://price.jup.ag/v4/price?ids=YOUR_TOKEN_MINT_ADDRESS`
);
```

### 3. Update Social Media Links

Edit `src/components/SocialButtons.tsx`:

```typescript
const socialLinks = {
  twitter: 'https://twitter.com/YOUR_ACTUAL_HANDLE',
  telegram: 'https://t.me/YOUR_ACTUAL_CHANNEL',
  pumpfun: 'https://pump.fun/YOUR_ACTUAL_STREAM_URL',
};
```

### 4. Add Banner Image

Replace the placeholder banner image:
1. Save your actual banner image as `public/real-life-activities-banner.png`
2. Recommended dimensions: 800x200 pixels
3. Format: PNG or JPG

### 5. Update Pump.fun Redirect

Edit `src/components/RealLifeActivitiesLanding.tsx`:

```typescript
onClick={() => {
  window.open('https://pump.fun/YOUR_ACTUAL_STREAM_URL', '_blank');
}}
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📱 Mobile Optimization

The application is fully responsive with:
- Adaptive countdown timer sizing
- Mobile-friendly social buttons
- Optimized banner display
- Touch-friendly interactions

## 🔧 Configuration Options

### Countdown Timer Settings
- Default: 24 hours (86,400,000 milliseconds)
- Updates every second
- Automatically stops at zero

### Volume Tracking Settings
- Update interval: 30 seconds
- Time calculation: $10 = +1 minute, $100 = +10 minutes
- Automatic error handling and retry functionality

### API Rate Limits
- CoinGecko: 10-50 calls/minute (free tier)
- DEXScreener: No official limits
- Jupiter: High rate limits

## 🎨 Styling

The application uses:
- **Tailwind CSS**: For responsive design
- **Black & White Theme**: Clean, professional look
- **Custom Components**: Modular, reusable design
- **Font**: Monospace for technical feel

## 🔍 Troubleshooting

### Common Issues

1. **"DATA UNAVAILABLE" Error**
   - Check if the token contract address is correct
   - Verify the API endpoint is working
   - Ensure the token exists on the chosen API

2. **Banner Image Not Loading**
   - Verify the image file is in `public/` directory
   - Check the file name matches exactly
   - Ensure the image format is supported (PNG, JPG, WebP)

3. **Social Links Not Working**
   - Update the placeholder URLs with actual links
   - Test each link manually

### API Testing

Test your API configuration:
```bash
# Test CoinGecko
curl "https://api.coingecko.com/api/v3/coins/YOUR_TOKEN_ID"

# Test DEXScreener
curl "https://api.dexscreener.com/latest/dex/tokens/YOUR_TOKEN_ADDRESS"
```

## 📞 Support

For technical support or questions about implementation:
1. Check the browser console for error messages
2. Verify all placeholder values have been replaced
3. Test API endpoints independently
4. Ensure all dependencies are installed correctly

## 🚀 Deployment

The application can be deployed to:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any static hosting service**

Remember to update environment variables for production if using API keys.
