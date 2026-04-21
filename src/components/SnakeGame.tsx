/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const lastMoveTime = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't place food on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    const newFood = generateFood(INITIAL_SNAKE);
    setFood(newFood);
    setGameState('PLAYING');
    setScore(0);
    onScoreUpdate(0);
  };

  const gameOver = () => {
    setGameState('GAMEOVER');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  };

  const moveSnake = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const newHead = {
      x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    // Collision check
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      gameOver();
      return;
    }

    const newSnake = [newHead, ...snake];

    // Food check
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => {
        const next = s + 10;
        onScoreUpdate(next);
        return next;
      });
      setFood(generateFood(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameState, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    let animationFrameId: number;

    const loop = (time: number) => {
      if (time - lastMoveTime.current > GAME_SPEED) {
        moveSnake();
        lastMoveTime.current = time;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        const cellSize = canvas.width / GRID_SIZE;

        // Clear background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines (subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_SIZE; i++) {
          ctx.beginPath();
          ctx.moveTo(i * cellSize, 0);
          ctx.lineTo(i * cellSize, canvas.height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i * cellSize);
          ctx.lineTo(canvas.width, i * cellSize);
          ctx.stroke();
        }

        // Draw Food
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff2e63';
        ctx.fillStyle = '#ff2e63';
        ctx.beginPath();
        ctx.arc(
          food.x * cellSize + cellSize / 2,
          food.y * cellSize + cellSize / 2,
          cellSize / 2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw Snake
        snake.forEach((segment, index) => {
          const isHead = index === 0;
          ctx.shadowBlur = isHead ? 20 : 10;
          ctx.shadowColor = isHead ? '#00fff5' : '#00adb5';
          ctx.fillStyle = isHead ? '#00fff5' : '#00adb5';
          
          const padding = 2;
          ctx.fillRect(
            segment.x * cellSize + padding,
            segment.y * cellSize + padding,
            cellSize - padding * 2,
            cellSize - padding * 2
          );
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [moveSnake, food, snake]);

  return (
    <div className="relative group">
      {/* Game Board */}
      <div className="p-4 border-4 border-cyan-500/30 rounded-2xl bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg block max-w-full h-auto"
        />

        {/* Overlay for States */}
        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8 text-center"
            >
              {gameState === 'IDLE' && (
                <>
                  <h2 className="text-4xl font-black text-cyan-400 mb-6 tracking-tighter">NEON SNAKE</h2>
                  <button
                    onClick={() => setGameState('PLAYING')}
                    className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <Play fill="currentColor" size={20} /> START MISSION
                  </button>
                </>
              )}

              {gameState === 'GAMEOVER' && (
                <>
                  <h2 className="text-4xl font-black text-rose-500 mb-2 tracking-tighter">MISSION FAILED</h2>
                  <p className="text-rose-400/60 mb-8 uppercase text-xs tracking-widest font-bold">Signal Lost in Deep Space</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Final Score</p>
                      <p className="text-2xl font-black text-white">{score}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">High Score</p>
                      <p className="text-2xl font-black text-cyan-400">{highScore}</p>
                    </div>
                  </div>

                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCcw size={20} /> REBOOT SYSTEM
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score HUD */}
      <div className="absolute -top-12 left-0 right-0 flex justify-between items-end px-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-500 font-black tracking-[0.3em] uppercase">Score</span>
          <span className="text-2xl font-black text-white tabular-nums leading-none">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-cyan-500/50">
            <Trophy size={12} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Best</span>
          </div>
          <span className="text-lg font-bold text-white/40 tabular-nums leading-none">{highScore}</span>
        </div>
      </div>
    </div>
  );
};
