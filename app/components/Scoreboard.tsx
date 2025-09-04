'use client';

import React, { useState, useEffect } from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
  gameStarted: boolean;
  gameOver: boolean;
  isPaused: boolean;
  darkMode: boolean;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore, gameStarted, gameOver, isPaused, darkMode }) => {
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [highScoreAnimation, setHighScoreAnimation] = useState(false);

  // Animate score changes
  useEffect(() => {
    setScoreAnimation(true);
    const timer = setTimeout(() => setScoreAnimation(false), 300);
    return () => clearTimeout(timer);
  }, [score]);

  // Animate high score changes
  useEffect(() => {
    if (score === highScore && score > 0) {
      setHighScoreAnimation(true);
      const timer = setTimeout(() => setHighScoreAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [score, highScore]);

  return (
    <div className={`flex justify-between items-center mb-8 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10' 
        : 'bg-gradient-to-r from-white/20 via-white/30 to-white/20 border border-white/30'
    }`}>
      <div className="flex flex-col items-center group">
        <div className={`text-xs font-semibold mb-2 tracking-wider uppercase ${
          darkMode ? 'text-white/70' : 'text-gray-600'
        }`}>SCORE</div>
        <div className={`text-3xl font-bold tracking-wider transition-all duration-300 ${
          scoreAnimation ? 'scale-110 text-emerald-400' : darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {score.toString().padStart(4, '0')}
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex flex-col items-center group">
        <div className={`text-xs font-semibold mb-2 tracking-wider uppercase ${
          darkMode ? 'text-white/70' : 'text-gray-600'
        }`}>HIGH SCORE</div>
        <div className={`text-3xl font-bold tracking-wider transition-all duration-500 ${
          highScoreAnimation 
            ? 'scale-125 text-yellow-300 animate-pulse' 
            : 'text-yellow-400'
        }`}>
          {highScore.toString().padStart(4, '0')}
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex flex-col items-center group">
        <div className={`text-xs font-semibold mb-2 tracking-wider uppercase ${
          darkMode ? 'text-white/70' : 'text-gray-600'
        }`}>STATUS</div>
        <div className="text-lg font-bold tracking-wider transition-all duration-300">
          {gameOver ? (
            <span className="text-red-400 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
              GAME OVER
            </span>
          ) : isPaused ? (
            <span className="text-orange-400 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />
              PAUSED
            </span>
          ) : gameStarted ? (
            <span className="text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              PLAYING
            </span>
          ) : (
            <span className="text-yellow-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              READY
            </span>
          )}
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default Scoreboard;
