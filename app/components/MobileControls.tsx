'use client';

import React, { useRef, useEffect } from 'react';

interface MobileControlsProps {
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onPause: () => void;
  isPaused: boolean;
  gameStarted: boolean;
  gameOver: boolean;
  darkMode: boolean;
}

const MobileControls: React.FC<MobileControlsProps> = ({ 
  onDirectionChange, 
  onPause, 
  isPaused, 
  gameStarted, 
  gameOver,
  darkMode
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouch = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!gameOver) {
      onDirectionChange(direction);
    }
  };

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    touchEndRef.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          handleTouch('RIGHT');
        } else {
          handleTouch('LEFT');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          handleTouch('DOWN');
        } else {
          handleTouch('UP');
        }
      }
    }
    
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  if (!gameStarted || gameOver) return null;

  return (
    <div className="mt-8 md:hidden">
      <div className={`backdrop-blur-md rounded-2xl p-6 shadow-xl ${
        darkMode 
          ? 'bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10'
          : 'bg-gradient-to-r from-white/30 via-white/20 to-white/30 border border-white/30'
      }`}>
        <div className={`text-center text-sm mb-4 font-semibold tracking-wider ${
          darkMode ? 'text-white/80' : 'text-gray-700'
        }`}>Touch Controls</div>
        
        {/* Direction Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-56 mx-auto">
          {/* Empty cell for spacing */}
          <div></div>
          
          {/* Up */}
          <button
            onClick={() => handleTouch('UP')}
            className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30 active:from-emerald-500/40 active:to-green-600/40 rounded-xl p-4 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-emerald-400/20"
            aria-label="Move Up"
          >
            <div className="text-white text-xl font-bold">↑</div>
          </button>
          
          {/* Empty cell for spacing */}
          <div></div>
          
          {/* Left */}
          <button
            onClick={() => handleTouch('LEFT')}
            className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30 active:from-emerald-500/40 active:to-green-600/40 rounded-xl p-4 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-emerald-400/20"
            aria-label="Move Left"
          >
            <div className="text-white text-xl font-bold">←</div>
          </button>
          
          {/* Center - Pause */}
          <button
            onClick={onPause}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 active:from-orange-500/40 active:to-red-500/40 rounded-xl p-4 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-orange-400/20"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            <div className="text-white text-xl">
              {isPaused ? '▶️' : '⏸️'}
            </div>
          </button>
          
          {/* Right */}
          <button
            onClick={() => handleTouch('RIGHT')}
            className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30 active:from-emerald-500/40 active:to-green-600/40 rounded-xl p-4 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-emerald-400/20"
            aria-label="Move Right"
          >
            <div className="text-white text-xl font-bold">→</div>
          </button>
          
          {/* Empty cell for spacing */}
          <div></div>
          
          {/* Down */}
          <button
            onClick={() => handleTouch('DOWN')}
            className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30 active:from-emerald-500/40 active:to-green-600/40 rounded-xl p-4 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-emerald-400/20"
            aria-label="Move Down"
          >
            <div className="text-white text-xl font-bold">↓</div>
          </button>
          
          {/* Empty cell for spacing */}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
