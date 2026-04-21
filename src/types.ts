/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: number;
}

export type Point = {
  x: number;
  y: number;
};

export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';
