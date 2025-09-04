'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/sounds';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const isNewHighScore = score === highScore && score > 0;

  useEffect(() => {
    setIsVisible(true);
    if (isNewHighScore) {
      setShowConfetti(true);
    }
    
    // Ensure music is playing during game over
    soundManager.playBGM().catch(console.error);
    
    // Cleanup function to handle component unmount
    return () => {
      // Don't stop the music here, let SnakeGame handle it
    };
  }, [isNewHighScore]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md rounded-xl">
      {/* Confetti effect for new high score */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className={`bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center border border-white/20 shadow-2xl max-w-lg mx-4 transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="text-8xl mb-6 animate-bounce">💀</div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wider bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          GAME OVER
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/10">
            <span className="text-white/80 font-medium text-lg">Final Score:</span>
            <span className="text-3xl font-bold text-white tracking-wider">
              {score.toString().padStart(4, '0')}
            </span>
          </div>
          
          <div className="flex justify-between items-center bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/10">
            <span className="text-white/80 font-medium text-lg">High Score:</span>
            <span className="text-3xl font-bold text-yellow-400 tracking-wider">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
        
        {isNewHighScore && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-400/20 border border-yellow-400/50 rounded-xl animate-pulse">
            <div className="text-yellow-300 font-bold text-xl flex items-center justify-center gap-2">
              <span className="animate-spin">🏆</span>
              NEW HIGH SCORE!
              <span className="animate-spin" style={{ animationDirection: 'reverse' }}>🏆</span>
            </div>
          </div>
        )}
        
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-emerald-400/20"
        >
          <span className="text-xl flex items-center justify-center gap-2">
            <span className="animate-spin">🔄</span>
            Play Again
          </span>
        </button>
        
        <div className="mt-6 text-white/60 text-sm">
          Press any arrow key to start immediately
        </div>
        
        {/* Music credits */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs">
            MXZI, Dj Samir, DJ Javi26 - MONTAGEM XONADA
            <br />
            <span className="text-white/40">@DJJavi26 @MXZIOFC</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
