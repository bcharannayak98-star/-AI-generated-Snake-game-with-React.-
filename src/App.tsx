/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Gamepad2, Info, Share2, Zap } from 'lucide-react';

export default function App() {
  const [gameScore, setGameScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-400 font-sans relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-cyan-900/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-purple-900/10 blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Zap className="text-black" size={18} fill="currentColor" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">Neon<span className="text-cyan-500">Core</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-cyan-400 transition-colors">Arcade</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-cyan-400 transition-colors">Tunnels</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-cyan-400 transition-colors">Signals</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Share2 size={18} />
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500 leading-none">Session Status</p>
              <p className="text-[11px] font-bold text-white/80 leading-none mt-1">ONLINE_ENCRYPTED</p>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-cyan-500 overflow-hidden">
               <img src="https://picsum.photos/seed/user/100/100" alt="avatar" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto pt-32 pb-20 px-8 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 items-start relative z-10 h-full">
        
        {/* Left Column: Game Viewport */}
        <section className="flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Live Arcade Terminal</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase">Neon Snake <span className="text-white/20">v2.0</span></h1>
              </div>
              <div className="flex items-center gap-4 text-white/20">
                <Gamepad2 size={32} strokeWidth={1} />
              </div>
            </div>

            <div className="flex justify-center mb-12">
              <SnakeGame onScoreUpdate={setGameScore} />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: Zap, label: 'Turbo Phase', val: 'Active' },
                { icon: Info, label: 'Grid Latency', val: '0.4ms' },
                { icon: Music, label: 'Audio Engine', val: 'Synchronized' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/[0.08] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-cyan-500 border border-white/10 group-hover:border-cyan-500/50 transition-all">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{item.label}</p>
                    <p className="text-xs font-bold text-white">{item.val}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Right Column: Sidebar / Player */}
        <aside className="sticky top-32 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Music className="text-cyan-500" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Atmospheric Audio</span>
            </div>
            <MusicPlayer />
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 mb-4">Command Center</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Current Score</span>
                <span className="font-mono text-cyan-400 tabular-nums">{gameScore.toString().padStart(6, '0')}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((gameScore / 1000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-white/20 italic">Next evolution unlock at 1,000 points.</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Sidebar Navigation (Decorative) */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 opacity-40 hover:opacity-100 transition-opacity hidden lg:flex">
        {['01', '02', '03', '04'].map((num) => (
          <div key={num} className="group cursor-pointer">
            <div className="text-[10px] font-black group-hover:text-cyan-500 transition-colors">{num}</div>
            <div className="w-4 h-px bg-white/20 group-hover:bg-cyan-500 group-hover:w-8 transition-all" />
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 text-[10px] text-white/20 font-bold uppercase tracking-widest">
        <div>© 2026 NeonCore Orbital Systems</div>
        <div className="flex items-center gap-6">
          <span className="text-cyan-500/50">Status: Nominal</span>
          <span>Buffer: 100%</span>
          <span>Region: Orbit-09</span>
        </div>
      </footer>
    </div>
  );
}
