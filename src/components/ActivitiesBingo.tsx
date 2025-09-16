'use client';

import { useState } from 'react';

interface BingoSquare {
  id: string;
  text: string;
  completed: boolean;
  isFree?: boolean;
}

export default function ActivitiesBingo() {
  const [bingoCard, setBingoCard] = useState<BingoSquare[]>([
    // 5x5 Bingo Card
    { id: '1', text: 'HOT CHIP', completed: false },
    { id: '2', text: 'DRINK EVERY 10K', completed: false },
    { id: '3', text: 'NEW HAIRCUT', completed: false },
    { id: '4', text: 'GO PARTYING', completed: false },
    { id: '5', text: '$50 CHALLENGE', completed: false },
    
    { id: '6', text: 'SPINNING WHEEL', completed: false },
    { id: '7', text: 'DRUNK LASERTAG', completed: false },
    { id: '8', text: 'TRADE UP', completed: false },
    { id: '9', text: 'FOOD TO HOMELESS', completed: false },
    { id: '10', text: 'CHANGE A LIFE', completed: false },
    
    { id: '11', text: 'PUMP.FUN LIVE', completed: false },
    { id: '12', text: 'VOLUME SPIKE', completed: false },
    { id: '13', text: 'FREE SPACE', completed: true, isFree: true }, // Center square
    { id: '14', text: 'COMMUNITY GOAL', completed: false },
    { id: '15', text: 'VIRAL MOMENT', completed: false },
    
    { id: '16', text: 'CRAZY STUNT', completed: false },
    { id: '17', text: 'RANDOM ACT', completed: false },
    { id: '18', text: 'EPIC FAIL', completed: false },
    { id: '19', text: 'SURPRISE GUEST', completed: false },
    { id: '20', text: 'MEME MOMENT', completed: false },
    
    { id: '21', text: 'DANCE BREAK', completed: false },
    { id: '22', text: 'FOOD CHALLENGE', completed: false },
    { id: '23', text: 'OUTDOOR ACTIVITY', completed: false },
    { id: '24', text: 'SOCIAL MEDIA', completed: false },
    { id: '25', text: 'GRAND FINALE', completed: false },
  ]);

  const toggleSquare = (id: string) => {
    setBingoCard(prev => 
      prev.map(square => 
        square.id === id && !square.isFree
          ? { ...square, completed: !square.completed }
          : square
      )
    );
  };

  const _completedCount = bingoCard.filter(s => s.completed).length;
  const _totalCount = bingoCard.length;
  const nonFreeCompleted = bingoCard.filter(s => s.completed && !s.isFree).length;
  const nonFreeTotal = bingoCard.filter(s => !s.isFree).length;

  // Check for bingo (any row, column, or diagonal)
  const checkBingo = (): boolean => {
    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(bingoCard.slice(i * 5, (i + 1) * 5));
    }

    // Check rows
    for (const row of grid) {
      if (row.every(square => square.completed)) return true;
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (grid.every(row => row[col].completed)) return true;
    }

    // Check diagonals
    if (grid.every((row, i) => row[i].completed)) return true;
    if (grid.every((row, i) => row[4 - i].completed)) return true;

    return false;
  };

  const hasBingo = checkBingo();

  return (
    <div className="bg-white border-4 border-black p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">
          🎯 REAL LIFE ACTIVITIES BINGO
        </h3>
        {hasBingo && (
          <div className="text-2xl font-bold text-green-600 animate-pulse mb-2">
            🎉 BINGO! 🎉
          </div>
        )}
        <div className="text-lg font-mono">
          Progress: {nonFreeCompleted}/{nonFreeTotal} activities completed
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-black h-3 rounded-full transition-all duration-300"
            style={{ width: `${(nonFreeCompleted / nonFreeTotal) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Bingo Card Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
        {bingoCard.map((square, _index) => (
          <div
            key={square.id}
            className={`
              aspect-square flex items-center justify-center p-2 border-2 cursor-pointer
              text-xs sm:text-sm font-bold text-center transition-all duration-200
              ${square.isFree 
                ? 'bg-yellow-200 border-yellow-500 text-yellow-800' 
                : square.completed
                  ? 'bg-green-200 border-green-500 text-green-800'
                  : 'bg-gray-50 border-gray-400 hover:bg-gray-100'
              }
              ${hasBingo ? 'animate-pulse' : ''}
            `}
            onClick={() => toggleSquare(square.id)}
          >
            <div className="flex flex-col items-center space-y-1">
              {square.completed && !square.isFree && (
                <div className="text-lg">✓</div>
              )}
              {square.isFree && (
                <div className="text-lg">⭐</div>
              )}
              <span className={`leading-tight ${square.completed && !square.isFree ? 'line-through' : ''}`}>
                {square.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bingo Rules */}
      <div className="bg-gray-100 border-2 border-gray-300 p-4 text-sm">
        <h4 className="font-bold mb-2">🎮 HOW TO PLAY:</h4>
        <ul className="space-y-1 text-gray-700">
          <li>• Click squares to mark activities as completed</li>
          <li>• Get 5 in a row (horizontal, vertical, or diagonal) for BINGO!</li>
          <li>• Watch the live stream to see these activities happen</li>
          <li>• The center &quot;FREE SPACE&quot; is automatically marked</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        <div className="bg-blue-100 border border-blue-300 p-3">
          <div className="font-bold text-blue-800">COMPLETED</div>
          <div className="text-xl font-mono text-blue-600">{nonFreeCompleted}</div>
        </div>
        <div className="bg-purple-100 border border-purple-300 p-3">
          <div className="font-bold text-purple-800">REMAINING</div>
          <div className="text-xl font-mono text-purple-600">{nonFreeTotal - nonFreeCompleted}</div>
        </div>
        <div className="bg-orange-100 border border-orange-300 p-3">
          <div className="font-bold text-orange-800">PROGRESS</div>
          <div className="text-xl font-mono text-orange-600">{Math.round((nonFreeCompleted / nonFreeTotal) * 100)}%</div>
        </div>
        <div className="bg-green-100 border border-green-300 p-3">
          <div className="font-bold text-green-800">BINGO</div>
          <div className="text-xl font-mono text-green-600">{hasBingo ? 'YES!' : 'NO'}</div>
        </div>
      </div>

      {/* Completion Message */}
      {nonFreeCompleted === nonFreeTotal && (
        <div className="text-center bg-green-100 border-2 border-green-500 p-4 animate-pulse">
          <h4 className="text-xl font-bold text-green-800">
            🏆 BLACKOUT BINGO! 🏆
          </h4>
          <p className="text-green-700 mt-2">
            Incredible! You&apos;ve completed ALL the Real Life Activities!
          </p>
        </div>
      )}
    </div>
  );
}
