/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRACKS } from '../constants';
import { Track } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex items-center gap-6 relative">
        {/* Album Art */}
        <div className="relative group/art">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 text-black p-1.5 rounded-full shadow-lg ring-4 ring-black/40">
              <MusicIcon size={12} className="animate-bounce" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-xl font-black text-white truncate tracking-tight">{currentTrack.title}</h3>
              <p className="text-sm font-bold text-cyan-400/80 uppercase tracking-widest leading-none mt-1">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex items-center gap-2 mt-4 text-[10px] text-white/30 font-bold uppercase tracking-tighter">
            <Volume2 size={10} />
            <span>Synth System Online</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 relative h-6 flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
        />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-500 rounded-full pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-6">
        <button 
          onClick={prevTrack}
          className="p-3 text-white/50 hover:text-white transition-colors"
        >
          <SkipBack size={24} />
        </button>

        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl"
        >
          {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="translate-x-0.5" />}
        </button>

        <button 
          onClick={nextTrack}
          className="p-3 text-white/50 hover:text-white transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Playlist Preview */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] text-white/20 font-black uppercase tracking-widest px-1">Upcoming</span>
          <span className="text-[10px] text-cyan-400 font-bold">3 TRACKS LOADED</span>
        </div>
        <div className="space-y-4">
          {DUMMY_TRACKS.map((track, i) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(i);
                setIsPlaying(true);
              }}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${i === currentTrackIndex ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5'}`}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                <img src={track.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${i === currentTrackIndex ? 'text-cyan-400' : 'text-white'}`}>{track.title}</p>
                <p className="text-[10px] text-white/30 truncate uppercase tracking-wider">{track.artist}</p>
              </div>
              {i === currentTrackIndex && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-0.5 h-full bg-cyan-400 animate-[bounce_0.6s_infinite]" />
                  <div className="w-0.5 h-2 bg-cyan-400 animate-[bounce_0.8s_infinite]" />
                  <div className="w-0.5 h-3.5 bg-cyan-400 animate-[bounce_0.7s_infinite]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
