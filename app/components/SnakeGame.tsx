'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Scoreboard from './Scoreboard';
import GameOver from './GameOver';
import MobileControls from './MobileControls';
import GameControls from './GameControls';
import ResponsiveGameArea from './ResizableGameArea';
import { soundManager } from '../utils/sounds';

export interface Position {
  x: number;
  y: number;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type PowerUpType = 'slowMotion' | 'doublePoints' | 'shrinkSnake';

export interface PowerUp {
  id: number;
  type: PowerUpType;
  position: Position;
  duration: number;
  active: boolean;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  gameOver: boolean;
  score: number;
  gameStarted: boolean;
  highScore: number;
  isPaused: boolean;
  difficulty: Difficulty;
  powerUps: PowerUp[];
  activePowerUps: { [key in PowerUpType]?: number };
  darkMode: boolean;
}

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const DIFFICULTY_SPEEDS = {
  Easy: 200,
  Medium: 150,
  Hard: 100
};

const POWER_UP_EMOJIS = {
  slowMotion: '⏰',
  doublePoints: '💎',
  shrinkSnake: '🔮'
};

const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    gameStarted: false,
    highScore: 0,
    isPaused: false,
    difficulty: 'Medium',
    powerUps: [],
    activePowerUps: {},
    darkMode: false
  });

  const [gameSpeed, setGameSpeed] = useState(150);
  const [foodEaten, setFoodEaten] = useState(false);

  // Initialize game and load background music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
      const savedDarkMode = localStorage.getItem('snakeDarkMode') === 'true';
      
      setGameState(prevState => ({
        ...prevState,
        highScore: savedHighScore,
        darkMode: savedDarkMode
      }));
      
      // Preload background music
      soundManager.loadBGM().catch(console.error);
    }
    
    // Cleanup function to stop music when component unmounts
    return () => {
      soundManager.stopBGM();
    };
  }, []);
  
  // Handle game state changes for music
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver && !gameState.isPaused) {
      soundManager.playBGM().catch(console.error);
    } else if (gameState.isPaused) {
      soundManager.pauseBGM();
    } else if (gameState.gameOver) {
      soundManager.stopBGM();
    }
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused]);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (
      gameState.snake.some(segment => 
        segment.x === newFood.x && segment.y === newFood.y
      ) ||
      gameState.powerUps.some(powerUp => 
        powerUp.position.x === newFood.x && powerUp.position.y === newFood.y
      )
    );
    return newFood;
  }, [gameState.snake, gameState.powerUps]);

  // Generate random power-up position
  const generatePowerUpPosition = useCallback((): Position => {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (
      gameState.snake.some(segment => 
        segment.x === position.x && segment.y === position.y
      ) ||
      (gameState.food.x === position.x && gameState.food.y === position.y) ||
      gameState.powerUps.some(powerUp => 
        powerUp.position.x === position.x && powerUp.position.y === position.y
      )
    );
    return position;
  }, [gameState.snake, gameState.food, gameState.powerUps]);

  // Generate random power-up
  const generatePowerUp = useCallback((): PowerUp => {
    const types: PowerUpType[] = ['slowMotion', 'doublePoints', 'shrinkSnake'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Date.now() + Math.random(),
      type: randomType,
      position: generatePowerUpPosition(),
      duration: 10000, // 10 seconds
      active: false
    };
  }, [generatePowerUpPosition]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameState.gameOver || !gameState.gameStarted || gameState.isPaused) return;

    setGameState(prevState => {
      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (prevState.direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (
        head.x < 0 || 
        head.x >= BOARD_SIZE || 
        head.y < 0 || 
        head.y >= BOARD_SIZE
      ) {
        soundManager.playGameOverSound();
        return { ...prevState, gameOver: true };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        soundManager.playGameOverSound();
        return { ...prevState, gameOver: true };
      }

      newSnake.unshift(head);

      // Check power-up collision
      const powerUpIndex = newSnake.findIndex(segment => 
        prevState.powerUps.some(powerUp => 
          powerUp.position.x === segment.x && powerUp.position.y === segment.y
        )
      );
      
      if (powerUpIndex !== -1) {
        const powerUp = prevState.powerUps.find(powerUp => 
          powerUp.position.x === newSnake[powerUpIndex].x && powerUp.position.y === newSnake[powerUpIndex].y
        );
        
        if (powerUp) {
          soundManager.playEatSound();
          const newActivePowerUps = { ...prevState.activePowerUps };
          newActivePowerUps[powerUp.type] = Date.now() + powerUp.duration;
          
          return {
            ...prevState,
            snake: newSnake,
            powerUps: prevState.powerUps.filter(p => p.id !== powerUp.id),
            activePowerUps: newActivePowerUps
          };
        }
      }

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        soundManager.playEatSound();
        setFoodEaten(true);
        
        // Calculate score with double points power-up
        const baseScore = 10;
        const scoreMultiplier = prevState.activePowerUps.doublePoints ? 2 : 1;
        const newScore = prevState.score + (baseScore * scoreMultiplier);
        const newHighScore = Math.max(newScore, prevState.highScore);
        
        // Save high score to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('snakeHighScore', newHighScore.toString());
        }
        
        // Increase speed slightly based on difficulty
        const speedReduction = prevState.difficulty === 'Hard' ? 3 : 2;
        setGameSpeed(prev => Math.max(80, prev - speedReduction));
        
        // Chance to spawn power-up (20%)
        const shouldSpawnPowerUp = Math.random() < 0.2;
        const newPowerUps = shouldSpawnPowerUp ? [...prevState.powerUps, generatePowerUp()] : prevState.powerUps;
        
        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(),
          score: newScore,
          highScore: newHighScore,
          powerUps: newPowerUps
        };
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }

      return { ...prevState, snake: newSnake };
    });
  }, [gameState.gameOver, gameState.gameStarted, gameState.direction, gameState.snake, gameState.food, gameState.score, generateFood]);

  // Handle keyboard input with debouncing
  const [lastKeyPress, setLastKeyPress] = useState<number>(0);
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.gameOver) return;

    // Debounce rapid key presses to prevent issues
    const now = Date.now();
    if (now - lastKeyPress < 50) return; // 50ms debounce
    setLastKeyPress(now);

    const key = event.key;
    setGameState(prevState => {
      if (!prevState.gameStarted && (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight')) {
        return { ...prevState, gameStarted: true };
      }

      // Only process direction changes if game is started and not paused
      if (!prevState.gameStarted || prevState.isPaused) {
        if (key === ' ' || key === 'p' || key === 'P') {
          event.preventDefault();
          return { ...prevState, gameStarted: true, isPaused: false };
        }
        return prevState;
      }

      switch (key) {
        case 'ArrowUp':
          if (prevState.direction !== 'DOWN') {
            return { ...prevState, direction: 'UP' };
          }
          break;
        case 'ArrowDown':
          if (prevState.direction !== 'UP') {
            return { ...prevState, direction: 'DOWN' };
          }
          break;
        case 'ArrowLeft':
          if (prevState.direction !== 'RIGHT') {
            return { ...prevState, direction: 'LEFT' };
          }
          break;
        case 'ArrowRight':
          if (prevState.direction !== 'LEFT') {
            return { ...prevState, direction: 'RIGHT' };
          }
          break;
        case ' ':
        case 'p':
        case 'P':
          event.preventDefault();
          return { ...prevState, isPaused: !prevState.isPaused };
          break;
      }
      return prevState;
    });
  }, [gameState.gameOver, gameState.gameStarted, lastKeyPress]);

  // Power-up management
  useEffect(() => {
    const powerUpInterval = setInterval(() => {
      setGameState(prevState => {
        const now = Date.now();
        const newActivePowerUps = { ...prevState.activePowerUps };
        let newSnake = [...prevState.snake];
        let snakeModified = false;
        
        // Remove expired power-ups
        Object.keys(newActivePowerUps).forEach(key => {
          const powerUpType = key as PowerUpType;
          if (newActivePowerUps[powerUpType] && newActivePowerUps[powerUpType]! < now) {
            // Handle power-up expiration effects
            if (powerUpType === 'shrinkSnake' && prevState.snake.length > 3) {
              // Remove all but the first 3 segments when shrink expires
              newSnake = newSnake.slice(0, 3);
              snakeModified = true;
            }
            delete newActivePowerUps[powerUpType];
          }
        });
        
        return {
          ...prevState,
          activePowerUps: newActivePowerUps,
          ...(snakeModified ? { snake: newSnake } : {})
        };
      });
    }, 100);

    return () => clearInterval(powerUpInterval);
  }, []);

  // Apply power-up effects
  useEffect(() => {
    if (gameState.activePowerUps.shrinkSnake && gameState.snake.length > 1) {
      // Shrink snake to 3 segments when power-up is active
      if (gameState.snake.length > 3) {
        setGameState(prev => ({
          ...prev,
          snake: prev.snake.slice(0, 3)
        }));
      }
    }
  }, [gameState.activePowerUps.shrinkSnake, gameState.snake.length]);

  // Game loop with power-up effects
  useEffect(() => {
    const currentSpeed = gameState.activePowerUps.slowMotion 
      ? gameSpeed * 2 
      : DIFFICULTY_SPEEDS[gameState.difficulty];
    
    const gameLoop = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameSpeed, gameState.activePowerUps.slowMotion, gameState.difficulty]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Handle direction change (for mobile controls)
  const handleDirectionChange = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameState.gameOver) return;

    setGameState(prevState => {
      if (!prevState.gameStarted) {
        return { ...prevState, gameStarted: true, direction };
      }

      // Prevent reversing into itself
      if (
        (direction === 'UP' && prevState.direction === 'DOWN') ||
        (direction === 'DOWN' && prevState.direction === 'UP') ||
        (direction === 'LEFT' && prevState.direction === 'RIGHT') ||
        (direction === 'RIGHT' && prevState.direction === 'LEFT')
      ) {
        return prevState;
      }

      return { ...prevState, direction };
    });
  }, [gameState.gameOver, gameState.gameStarted]);

  // Handle pause toggle
  const handlePause = useCallback(() => {
    if (gameState.gameOver) return;
    
    setGameState(prevState => {
      if (!prevState.gameStarted) {
        return { ...prevState, gameStarted: true };
      }
      return { ...prevState, isPaused: !prevState.isPaused };
    });
  }, [gameState.gameOver, gameState.gameStarted]);

  // Change difficulty
  const changeDifficulty = (difficulty: Difficulty) => {
    setGameState(prevState => ({
      ...prevState,
      difficulty
    }));
    setGameSpeed(DIFFICULTY_SPEEDS[difficulty]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !gameState.darkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('snakeDarkMode', newDarkMode.toString());
    }
    setGameState(prevState => ({
      ...prevState,
      darkMode: newDarkMode
    }));
  };

  // Restart game
  const restartGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(),
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      gameStarted: false,
      highScore: gameState.highScore,
      isPaused: false,
      difficulty: gameState.difficulty,
      powerUps: [],
      activePowerUps: {},
      darkMode: gameState.darkMode
    });
    setGameSpeed(DIFFICULTY_SPEEDS[gameState.difficulty]);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${
      gameState.darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900' 
        : 'bg-gradient-to-br from-blue-50 via-green-100 to-emerald-100'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          gameState.darkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/20'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          gameState.darkMode ? 'bg-green-500/10' : 'bg-green-500/20'
        }`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          gameState.darkMode ? 'bg-emerald-400/5' : 'bg-emerald-400/15'
        }`} style={{ animationDelay: '2s' }} />
      </div>
      
      <div className={`backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border relative z-10 max-w-4xl w-full transition-all duration-500 ${
        gameState.darkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/20 border-white/30'
      }`}>
        <div className="text-center mb-8">
          <h1 className={`text-5xl md:text-6xl font-bold mb-2 tracking-wider bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-600 bg-clip-text text-transparent ${
            gameState.darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            🐍 Snake Game
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto rounded-full" />
        </div>
        
        <GameControls
          difficulty={gameState.difficulty}
          onDifficultyChange={changeDifficulty}
          darkMode={gameState.darkMode}
          onToggleDarkMode={toggleDarkMode}
          gameStarted={gameState.gameStarted}
          gameOver={gameState.gameOver}
          activePowerUps={gameState.activePowerUps}
        />
        
        <Scoreboard 
          score={gameState.score} 
          highScore={gameState.highScore}
          gameStarted={gameState.gameStarted}
          gameOver={gameState.gameOver}
          isPaused={gameState.isPaused}
          darkMode={gameState.darkMode}
        />
        
        <ResponsiveGameArea
          snake={gameState.snake}
          food={gameState.food}
          boardSize={BOARD_SIZE}
          gameOver={gameState.gameOver}
          foodEaten={foodEaten}
          powerUps={gameState.powerUps}
          darkMode={gameState.darkMode}
          activePowerUps={gameState.activePowerUps}
          onDirectionChange={handleDirectionChange}
          gameStarted={gameState.gameStarted}
          isPaused={gameState.isPaused}
        />
        
        {gameState.gameOver && (
          <GameOver 
            score={gameState.score}
            highScore={gameState.highScore}
            onRestart={restartGame}
          />
        )}
        
        <MobileControls
          onDirectionChange={handleDirectionChange}
          onPause={handlePause}
          isPaused={gameState.isPaused}
          gameStarted={gameState.gameStarted}
          gameOver={gameState.gameOver}
          darkMode={gameState.darkMode}
        />
        
        <div className={`text-center text-sm space-y-2 ${
          gameState.darkMode ? 'text-white/70' : 'text-gray-600'
        }`}>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              gameState.darkMode ? 'bg-white/5' : 'bg-gray-200/50'
            }`}>
              <span className="text-emerald-400">↑↓←→</span>
              <span className={gameState.darkMode ? 'text-white' : 'text-gray-700'}>Move</span>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              gameState.darkMode ? 'bg-white/5' : 'bg-gray-200/50'
            }`}>
              <span className="text-orange-400">P/Space</span>
              <span className={gameState.darkMode ? 'text-white' : 'text-gray-700'}>Pause</span>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
              gameState.darkMode ? 'bg-white/5' : 'bg-gray-200/50'
            }`}>
              <span className="text-red-400">🍎</span>
              <span className={gameState.darkMode ? 'text-white' : 'text-gray-700'}>Eat to grow</span>
            </div>
          </div>
          <p className={`text-xs ${
            gameState.darkMode ? 'opacity-60' : 'opacity-70'
          }`}>Collect food to grow and score points • Avoid walls and yourself!</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
