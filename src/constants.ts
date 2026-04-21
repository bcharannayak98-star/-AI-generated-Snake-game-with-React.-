/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types';

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'SynthAI',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3fe2c92e9.mp3', // Synthwave style
    cover: 'https://picsum.photos/seed/synth1/400/400',
    duration: 145,
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Neural Beat',
    url: 'https://cdn.pixabay.com/audio/2022/02/10/audio_fc9435b647.mp3', // Lo-fi/Cyber
    cover: 'https://picsum.photos/seed/cyber/400/400',
    duration: 180,
  },
  {
    id: '3',
    title: 'Digital Dreams',
    artist: 'Ether Wave',
    url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3', // Ambient/Electronic
    cover: 'https://picsum.photos/seed/digital/400/400',
    duration: 210,
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 100;
