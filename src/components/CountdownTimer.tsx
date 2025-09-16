'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  timeRemaining: number; // in milliseconds
}

interface TimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ timeRemaining }: CountdownTimerProps) {
  const [displayTime, setDisplayTime] = useState<TimeDisplay>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      // The parent component will handle the time calculation
      // We just need to update the display based on the current timeRemaining prop
      const totalSeconds = Math.floor(timeRemaining / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setDisplayTime({ hours, minutes, seconds });

      // Stop the timer when it reaches 0
      if (timeRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Initial display calculation
  useEffect(() => {
    const totalSeconds = Math.floor(timeRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    setDisplayTime({ hours, minutes, seconds });
  }, [timeRemaining]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Timer Display */}
      <div className="flex items-center justify-center space-x-4 md:space-x-8">
        {/* Hours */}
        <div className="text-center">
          <div className="text-4xl md:text-6xl lg:text-8xl font-bold font-mono bg-white text-black px-4 py-2 rounded border-2 border-white">
            {formatNumber(displayTime.hours)}
          </div>
          <div className="text-sm md:text-lg mt-2 text-gray-300">HOURS</div>
        </div>
        
        {/* Separator */}
        <div className="text-4xl md:text-6xl lg:text-8xl font-bold text-white">:</div>
        
        {/* Minutes */}
        <div className="text-center">
          <div className="text-4xl md:text-6xl lg:text-8xl font-bold font-mono bg-white text-black px-4 py-2 rounded border-2 border-white">
            {formatNumber(displayTime.minutes)}
          </div>
          <div className="text-sm md:text-lg mt-2 text-gray-300">MINUTES</div>
        </div>
        
        {/* Separator */}
        <div className="text-4xl md:text-6xl lg:text-8xl font-bold text-white">:</div>
        
        {/* Seconds */}
        <div className="text-center">
          <div className="text-4xl md:text-6xl lg:text-8xl font-bold font-mono bg-white text-black px-4 py-2 rounded border-2 border-white">
            {formatNumber(displayTime.seconds)}
          </div>
          <div className="text-sm md:text-lg mt-2 text-gray-300">SECONDS</div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {timeRemaining > 0 ? (
          <p className="text-lg md:text-xl text-gray-300">
            Time extends with trading volume!
          </p>
        ) : (
          <p className="text-lg md:text-xl text-red-400 font-bold animate-pulse">
            TIME'S UP! 🎉
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.max(0, Math.min(100, (timeRemaining / (24 * 60 * 60 * 1000)) * 100))}%` 
            }}
          ></div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          {Math.max(0, Math.min(100, (timeRemaining / (24 * 60 * 60 * 1000)) * 100)).toFixed(1)}% remaining
        </div>
      </div>
    </div>
  );
}
