'use client';

import React, { useState, useEffect } from 'react';
import { Position, PowerUp, PowerUpType } from './SnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  boardSize: number;
  gameOver: boolean;
  foodEaten?: boolean;
  powerUps: PowerUp[];
  darkMode: boolean;
  activePowerUps: { [key in PowerUpType]?: number };
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  snake, 
  food, 
  boardSize, 
  gameOver, 
  foodEaten: externalFoodEaten, 
  powerUps, 
  darkMode, 
  activePowerUps 
}) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, life: number}>>([]);
  const [foodEaten, setFoodEaten] = useState(false);

  // Handle food collection animation
  useEffect(() => {
    if (externalFoodEaten) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: food.x * 24 + 12,
        y: food.y * 24 + 12,
        life: 1
      }));
      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [externalFoodEaten, food.x, food.y]);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          life: particle.life - 0.05
        })).filter(particle => particle.life > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.some((segment, index) => 
      index > 0 && segment.x === x && segment.y === y
    );
    const isFood = food.x === x && food.y === y;
    const powerUp = powerUps.find(p => p.position.x === x && p.position.y === y);

    let cellClass = 'w-6 h-6 border border-gray-300/10 transition-all duration-200 ';
    
    // Define power-up specific styles
    const powerUpStyles = {
      slowMotion: {
        bg: 'from-blue-400 via-blue-500 to-blue-600',
        shadow: 'shadow-blue-500/40',
        emoji: '⏰',
        label: 'Slow Motion',
        color: 'text-blue-500'
      },
      doublePoints: {
        bg: 'from-yellow-400 via-yellow-500 to-yellow-600',
        shadow: 'shadow-yellow-500/40',
        emoji: '💎',
        label: '2x Points',
        color: 'text-yellow-500'
      },
      shrinkSnake: {
        bg: 'from-purple-400 via-purple-500 to-purple-600',
        shadow: 'shadow-purple-500/40',
        emoji: '🔮',
        label: 'Shrink Snake',
        color: 'text-purple-500'
      }
    };

    if (isSnakeHead) {
      let glowStyle = 'from-emerald-400 via-emerald-500 to-emerald-600 shadow-emerald-500/30';
      if (activePowerUps.slowMotion) glowStyle = 'from-blue-400 via-blue-500 to-blue-600 shadow-blue-500/30';
      if (activePowerUps.doublePoints) glowStyle = 'from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-500/30';
      
      cellClass += `bg-gradient-to-br ${glowStyle} rounded-md shadow-lg transform scale-110 animate-pulse`;
    } else if (isSnakeBody) {
      const glowStyle = activePowerUps.shrinkSnake 
        ? 'from-purple-500 via-purple-600 to-purple-700 shadow-purple-500/20' 
        : 'from-green-500 via-green-600 to-green-700 shadow-green-500/20';
      cellClass += `bg-gradient-to-br ${glowStyle} rounded-md shadow-md`;
    } else if (isFood) {
      const glowStyle = activePowerUps.doublePoints 
        ? 'from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-500/40' 
        : 'from-red-400 via-red-500 to-red-600 shadow-red-500/40';
      cellClass += `bg-gradient-to-br ${glowStyle} rounded-full shadow-lg animate-bounce transform hover:scale-110 transition-transform duration-300`;
    } else if (powerUp) {
      const style = powerUpStyles[powerUp.type];
      cellClass += `bg-gradient-to-br ${style.bg} ${style.shadow} rounded-full shadow-lg animate-pulse transform hover:scale-110 transition-transform duration-300`;
    } else {
      const bgColor = darkMode ? 'from-gray-800/20 to-gray-900/30' : 'from-gray-200/20 to-gray-300/30';
      const hoverColor = darkMode ? 'hover:from-gray-700/30 hover:to-gray-800/40' : 'hover:from-gray-300/30 hover:to-gray-400/40';
      cellClass += `bg-gradient-to-br ${bgColor} ${hoverColor} transition-all duration-300`;
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
        style={{
          gridColumn: x + 1,
          gridRow: y + 1,
        }}
      >
        {isFood && (
          <div className="w-full h-full flex items-center justify-center text-sm animate-pulse">
            <div className="animate-spin" style={{ animationDuration: '2s' }}>
              🍎
            </div>
          </div>
        )}
        {powerUp && (
          <div className="w-full h-full flex flex-col items-center justify-center text-xs">
            <div className="animate-bounce">
              {powerUp.type === 'slowMotion' && '⏰'}
              {powerUp.type === 'doublePoints' && '💎'}
              {powerUp.type === 'shrinkSnake' && '🔮'}
            </div>
            {activePowerUps[powerUp.type] && (
              <div className="w-4/5 h-1 bg-white/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-white/50 transition-all duration-100"
                  style={{
                    width: `${((activePowerUps[powerUp.type]! - Date.now()) / 10000) * 100}%`
                  }}
                />
              </div>
            )}
          </div>
        )}
        {isSnakeHead && (
          <div className="w-full h-full flex items-center justify-center text-xs">
            <div className="animate-pulse">
              👁️
            </div>
          </div>
        )}
      </div>
    );
  };

  const cells = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      cells.push(renderCell(x, y));
    }
  }

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-600/10 rounded-xl blur-xl -z-10" />
      
      <div 
        className={`grid gap-0 rounded-xl p-6 border shadow-2xl backdrop-blur-sm relative overflow-hidden ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 border-gray-600/20'
            : 'bg-gradient-to-br from-gray-100/80 via-gray-200/60 to-gray-100/80 border-gray-300/20'
        }`}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {cells}
        
        {/* Particle effects */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none animate-ping"
            style={{
              left: particle.x - 4,
              top: particle.y - 4,
              opacity: particle.life,
              transform: `scale(${particle.life})`,
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}
      </div>
      
      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-red-600/20 to-red-700/30 rounded-xl border-2 border-red-500/50 animate-pulse backdrop-blur-sm" />
      )}
      
      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-lg" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-lg" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-lg" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-lg" />
    </div>
  );
};

export default GameBoard;
