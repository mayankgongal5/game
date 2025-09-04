'use client';

import React from 'react';
import { Difficulty } from './SnakeGame';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  gameStarted: boolean;
  gameOver: boolean;
  activePowerUps: { [key: string]: number };
}

const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  darkMode,
  onToggleDarkMode,
  gameStarted,
  gameOver,
  activePowerUps
}) => {
  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  
  const getPowerUpStatus = (type: string) => {
    const endTime = activePowerUps[type];
    if (!endTime) return null;
    
    const remaining = Math.max(0, endTime - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    return seconds;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Difficulty Selector */}
      <div className="flex flex-col gap-2">
        <label className={`text-sm font-semibold tracking-wider uppercase ${
          darkMode ? 'text-white/70' : 'text-gray-600'
        }`}>
          Difficulty
        </label>
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              disabled={gameStarted && !gameOver}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                difficulty === diff
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                  : darkMode 
                    ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    : 'bg-gray-200/50 text-gray-700 hover:bg-gray-300/50 hover:text-gray-900'
              } ${gameStarted && !gameOver ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex flex-col gap-2">
        <label className={`text-sm font-semibold tracking-wider uppercase ${
          darkMode ? 'text-white/70' : 'text-gray-600'
        }`}>
          Theme
        </label>
        <button
          onClick={onToggleDarkMode}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 ${
            darkMode
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
          }`}
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Active Power-ups */}
      {Object.keys(activePowerUps).length > 0 && (
        <div className="flex flex-col gap-2">
          <label className={`text-sm font-semibold tracking-wider uppercase ${
            darkMode ? 'text-white/70' : 'text-gray-600'
          }`}>
            Power-ups
          </label>
          <div className="flex gap-2">
            {Object.keys(activePowerUps).map((type) => {
              const remaining = getPowerUpStatus(type);
              if (!remaining) return null;
              
              const emojis = {
                slowMotion: '⏰',
                doublePoints: '💎',
                shrinkSnake: '🔮'
              };
              
              return (
                <div
                  key={type}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${
                    darkMode 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30'
                      : 'bg-gradient-to-r from-purple-200/50 to-pink-200/50 border-purple-300/50'
                  }`}
                >
                  <span className="text-lg">{emojis[type as keyof typeof emojis]}</span>
                  <span className={`text-xs font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>{remaining}s</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;
