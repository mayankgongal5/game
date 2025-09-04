'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import { Position, PowerUp, PowerUpType } from './SnakeGame';

interface ResponsiveGameAreaProps {
  snake: Position[];
  food: Position;
  boardSize: number;
  gameOver: boolean;
  foodEaten?: boolean;
  powerUps: PowerUp[];
  darkMode: boolean;
  activePowerUps: { [key in PowerUpType]?: number };
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  gameStarted: boolean;
  isPaused: boolean;
}

const ResponsiveGameArea: React.FC<ResponsiveGameAreaProps> = ({
  snake,
  food,
  boardSize,
  gameOver,
  foodEaten,
  powerUps,
  darkMode,
  activePowerUps,
  onDirectionChange,
  gameStarted,
  isPaused
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle swipe gestures for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onDirectionChange('RIGHT');
          } else {
            onDirectionChange('LEFT');
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            onDirectionChange('DOWN');
          } else {
            onDirectionChange('UP');
          }
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  }, [onDirectionChange]);

  // Update container size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const container = containerRef.current.parentElement;
        if (container) {
          const size = Math.min(
            container.clientWidth - 40, // 20px padding on each side
            container.clientHeight - 40,
            800 // Max size
          );
          setContainerSize({ width: size, height: size });
        }
      }
    };

    // Initial size
    updateSize();

    // Update on window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="flex justify-center items-center p-4 w-full h-full min-h-[400px]">
      <div 
        ref={containerRef}
        className="relative touch-none select-none bg-transparent"
        style={{ 
          width: '100%',
          height: '100%',
          maxWidth: '800px',
          maxHeight: '550px',
          aspectRatio: '1/1', // Ensure square aspect ratio
        }}
        onTouchStart={handleTouchStart}
      >
        <div className="w-full h-full" style={{ position: 'relative' }}>
          <GameBoard 
            snake={snake}
            food={food}
            boardSize={boardSize}
            gameOver={gameOver}
            foodEaten={foodEaten}
            powerUps={powerUps}
            darkMode={darkMode}
            activePowerUps={activePowerUps}
          />
          
          {/* Game overlays */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
              <div className="text-center text-white bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-4xl mb-4 animate-bounce">🎮</div>
                <p className="text-2xl mb-3 font-semibold">Ready to Play?</p>
                <p className="text-lg mb-2">Press any arrow key to start!</p>
                <p className="text-sm opacity-75">Use arrow keys to control the snake</p>
              </div>
            </div>
          )}
          
          {isPaused && gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white bg-gray-900/95 p-6 rounded-lg border border-gray-700 shadow-xl w-full max-w-xs mx-4">
                  <div className="text-5xl mb-4 animate-pulse">⏸️</div>
                  <p className="text-2xl font-bold mb-3">PAUSED</p>
                  <p className="text-sm text-gray-300">
                    Press <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">P</span> or <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">Space</span> to resume
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveGameArea;
