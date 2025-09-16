'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import SocialButtons from './SocialButtons';
import VolumeTracker from './VolumeTracker';
import ActivitiesBingo from './ActivitiesBingo';

export default function RealLifeActivitiesLanding() {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [baseEndTime, setBaseEndTime] = useState<Date | null>(null);
  const [volumeDataLoaded, setVolumeDataLoaded] = useState(false);

  // Calculate time remaining from specific start date: 4:17 PM Tuesday, 16 September 2025 Eastern Time
  const calculateTimeFromStartDate = (volumeBonus: number = 0): { endTime: Date; timeRemaining: number } => {
    const now = new Date();

    // Create the specific start date: 4:17 PM Tuesday, 16 September 2025 Eastern Time
    // Note: September 16, 2025 is actually a Tuesday, so this is correct
    const startDate = new Date('2025-09-16T16:17:00-04:00'); // 4:17 PM EDT (Eastern Daylight Time)

    // Calculate base countdown duration (24 hours from start date)
    const baseDurationMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Calculate end time: start date + 24 hours + volume bonus
    const endTime = new Date(startDate.getTime() + baseDurationMs + volumeBonus);

    // Calculate time remaining
    const timeRemaining = Math.max(0, endTime.getTime() - now.getTime());

    console.log('Countdown calculation from specific start date:', {
      now: now.toISOString(),
      startDate: startDate.toISOString(),
      baseDurationMs: baseDurationMs,
      volumeBonus: volumeBonus,
      endTime: endTime.toISOString(),
      timeRemaining: timeRemaining,
      hours: Math.floor(timeRemaining / (1000 * 60 * 60)),
      isActive: timeRemaining > 0
    });

    return { endTime, timeRemaining };
  };

  // Handle initial volume load to set base countdown
  const handleInitialVolumeLoad = (baseTimeFromVolume: number) => {
    console.log('Received initial volume base time:', baseTimeFromVolume);

    // Calculate countdown with volume bonus
    const { endTime, timeRemaining: initialTime } = calculateTimeFromStartDate(baseTimeFromVolume);
    setBaseEndTime(endTime);
    setTimeRemaining(initialTime);
    setVolumeDataLoaded(true);
    setIsLoading(false);

    console.log('Initialized countdown with volume bonus:', {
      baseTimeFromVolume: baseTimeFromVolume,
      endTime: endTime.toISOString(),
      initialTime: initialTime,
      hours: Math.floor(initialTime / (1000 * 60 * 60))
    });
  };

  useEffect(() => {
    // Initialize with basic countdown if volume data takes too long
    const timeout = setTimeout(() => {
      if (!volumeDataLoaded) {
        console.log('Volume data taking too long, initializing basic countdown...');
        const { endTime, timeRemaining: initialTime } = calculateTimeFromStartDate(0);
        setBaseEndTime(endTime);
        setTimeRemaining(initialTime);
        setIsLoading(false);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [volumeDataLoaded]);

  // Update countdown every second based on base end time
  useEffect(() => {
    if (!baseEndTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const newTimeRemaining = Math.max(0, baseEndTime.getTime() - now.getTime());
      setTimeRemaining(newTimeRemaining);

      // Reset countdown if it reaches 0 (though this shouldn't happen with the specific date)
      if (newTimeRemaining <= 0) {
        const { endTime: newEndTime, timeRemaining: newTime } = calculateTimeFromStartDate();
        setBaseEndTime(newEndTime);
        setTimeRemaining(newTime);
        console.log('Countdown reset from start date');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [baseEndTime]);

  const handleVolumeUpdate = (additionalTime: number) => {
    console.log('Main component: Adding time:', additionalTime, 'ms');

    if (baseEndTime) {
      // Extend the base end time by the additional time
      const newEndTime = new Date(baseEndTime.getTime() + additionalTime);
      setBaseEndTime(newEndTime);

      // Recalculate time remaining based on new end time
      const now = new Date();
      const newTimeRemaining = Math.max(0, newEndTime.getTime() - now.getTime());

      console.log('Main component: Extended end time:', {
        oldEndTime: baseEndTime.toISOString(),
        newEndTime: newEndTime.toISOString(),
        additionalTime: additionalTime,
        newTimeRemaining: newTimeRemaining
      });

      setTimeRemaining(newTimeRemaining);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header with Banner */}
      <header className="w-full bg-white border-b-2 border-black">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex justify-center">
            <Image
              src="/banner.png"
              alt="Real Life Activities Banner"
              width={800}
              height={200}
              className="max-w-full h-auto rounded-lg sm:rounded-none"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          
          {/* Title Section */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-wider px-2">
              REAL LIFE ACTIVITIES
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
              Join the live stream and watch real activities unfold!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-black text-white p-8 rounded-lg border-4 border-black">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              TIME REMAINING UNTIL THE END OF STREAM
            </h2>
            <p className="text-sm md:text-base text-yellow-300 mb-2">
              Started: Tuesday, September 16, 2025 at 4:17 PM ET
            </p>
            {baseEndTime && (
              <p className="text-sm md:text-base text-gray-300 mb-6">
                Countdown ends at: {baseEndTime.toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} ET
              </p>
            )}
            <CountdownTimer
              timeRemaining={timeRemaining}
            />
          </div>

          {/* Social Media Buttons */}
          <SocialButtons />

          {/* Volume Tracker */}
          <VolumeTracker
            onVolumeUpdate={handleVolumeUpdate}
            onInitialVolumeLoad={handleInitialVolumeLoad}
          />

          {/* Activities Bingo Card */}
          <ActivitiesBingo />

          {/* Call to Action */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">
              WATCH THE STREAM NOW!
            </h3>
            <button
              className="bg-black text-white px-8 py-4 text-xl font-bold border-4 border-black hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
              onClick={() => {
                const pumpfunUrl = process.env.NEXT_PUBLIC_PUMPFUN_URL || `https://pump.fun/coin/${process.env.NEXT_PUBLIC_TOKEN_ADDRESS}`;
                window.open(pumpfunUrl, '_blank');
              }}
            >
              JOIN PUMP.FUN LIVE →
            </button>
          </div>



          {/* Info Section */}
          <div className="bg-gray-100 p-6 border-2 border-black">
            <h4 className="text-xl font-bold mb-4">HOW IT WORKS</h4>
            <div className="text-left space-y-2 max-w-2xl mx-auto">
              <p>• Every $10 in trading volume adds +1 second to the countdown</p>
              <p>• Every $600 in trading volume adds +1 minute to the countdown</p>
              <p>• Every $36,000 in trading volume adds +1 hour to the countdown</p>
              <p>• Watch real-time activities based on community engagement</p>
              <p>• Join the live stream to participate in the fun!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 Real Life Activities. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
