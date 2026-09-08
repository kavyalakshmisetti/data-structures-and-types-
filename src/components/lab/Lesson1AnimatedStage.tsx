import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  Binary,
  Layers,
  ArrowRight,
  Zap,
  Clock,
  Sparkles,
  GitBranch,
  Gauge,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  Activity,
  Maximize2,
} from 'lucide-react';
import { EducationalScene } from '../../data/labVideoData';

interface Lesson1AnimatedStageProps {
  currentScene: EducationalScene;
  currentTime: number;
  isPlaying: boolean;
}

export const Lesson1AnimatedStage: React.FC<Lesson1AnimatedStageProps> = ({
  currentScene,
  currentTime,
  isPlaying,
}) => {
  // Local animation tick for smooth fluid pulses (runs 10 times a second)
  const [pulseTick, setPulseTick] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Current scene progress (0 to 1)
  const sceneDuration = Math.max(0.1, currentScene.timeEnd - currentScene.timeStart);
  const sceneProgress = Math.min(
    1,
    Math.max(0, (currentTime - currentScene.timeStart) / sceneDuration)
  );

  return (
    <div className="w-full h-full min-h-[360px] sm:min-h-[420px] flex flex-col justify-between p-3 sm:p-5 select-none bg-slate-950 text-slate-100 rounded-2xl overflow-hidden relative font-sans">
      {/* Background High-Tech Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* ─── STAGE TOP HUD BAR ─── */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-950/90 border border-indigo-500/60 text-indigo-400 flex items-center justify-center shadow-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
              <span>LESSON 01 ANIMATED STUDIO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            </div>
            <div className="text-xs sm:text-base font-black text-white tracking-tight">
              {currentScene.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/70 font-bold flex items-center gap-1.5 shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {currentScene.badge}
          </span>
        </div>
      </div>

      {/* ─── DYNAMIC ANIMATED SCENE RENDERER ─── */}
      <div className="flex-1 flex items-center justify-center my-2 relative z-10 w-full">
        {/* SCENE 1: What is Data? (Raw Facts & Symbols in RAM) */}
        {currentScene.id === 1 && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
            {/* Left Card: Unorganized Data Symbols */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-indigo-900/60 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
                  <Binary className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Raw Facts, Values & Symbols</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Unstructured
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Data represents individual raw facts, symbols, and unorganized measurements. Inside hardware, all data is stored as electrical charges in memory cells.
              </p>

              {/* Animated Floating Data Chips */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { type: 'INTEGER', val: 42, bits: '32-bit (00101010)', col: 'indigo', active: pulseTick % 4 === 0 },
                  { type: 'FLOAT', val: 3.1415, bits: 'IEEE 754 (4 Bytes)', col: 'emerald', active: pulseTick % 4 === 1 },
                  { type: 'CHARACTER', val: "'A'", bits: 'ASCII 65 (01000001)', col: 'amber', active: pulseTick % 4 === 2 },
                  { type: 'BOOLEAN', val: 'TRUE', bits: '1-bit (Flag 0b1)', col: 'rose', active: pulseTick % 4 === 3 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border transition-all duration-300 ${
                      item.active
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400">{item.type}</span>
                      {item.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    <div className="font-mono font-black text-sm text-white">{item.val}</div>
                    <div className="text-[9px] font-mono text-slate-500 truncate">{item.bits}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Physical RAM Grid with Active Address Bus */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                  PHYSICAL RAM REGISTERS
                </span>
                <span className="text-slate-500 text-[10px]">Bus: 32-bit Hex</span>
              </div>

              <div className="space-y-1.5">
                {[
                  { addr: '0x1000', bin: '00000000 00101010', type: 'Int: 42', col: 'text-indigo-400 border-indigo-500/60' },
                  { addr: '0x1004', bin: '01000000 01001001', type: 'Float: 3.14', col: 'text-emerald-400 border-emerald-500/60' },
                  { addr: '0x1008', bin: '00000000 01000001', type: "Char: 'A'", col: 'text-amber-400 border-amber-500/60' },
                  { addr: '0x100C', bin: '00000000 00000001', type: 'Bool: TRUE', col: 'text-rose-400 border-rose-500/60' },
                ].map((slot, sIdx) => {
                  const isCurrent = Math.floor(sceneProgress * 4) === sIdx;
                  return (
                    <div
                      key={sIdx}
                      className={`flex items-center justify-between p-2 rounded-lg border font-mono text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-indigo-950/80 border-indigo-400 shadow-md shadow-indigo-500/30 scale-[1.02]'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-300">{slot.addr}</span>
                      <span className="text-[10px] tracking-wider text-slate-400 hidden sm:inline">{slot.bin}</span>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border ${slot.col}`}>
                        {slot.type}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>Memory Bus: READY</span>
                <span className="text-emerald-400 font-bold">L1/L2 Spatial Align</span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 2: Why Organize Data? (Visual Showdown: Unorganized vs Organized) */}
        {currentScene.id === 2 && (
          <div className="w-full max-w-4xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Left: Unorganized O(N) Linear Search */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-rose-900/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Unorganized Data (Scatter)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    O(N) Scanning
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  Searching for a record requires scanning every single byte from beginning to end. Latency increases linearly with data size.
                </p>

                {/* Animated Scanner Laser */}
                <div className="relative p-2.5 rounded-lg bg-slate-950 border border-rose-900/40 overflow-hidden">
                  <div className="grid grid-cols-6 gap-1.5 text-center font-mono text-xs">
                    {['18', '72', '35', '91', '40', '63'].map((num, nIdx) => {
                      const isScanned = (pulseTick % 6) === nIdx;
                      return (
                        <div
                          key={nIdx}
                          className={`p-1.5 rounded border transition-all ${
                            isScanned
                              ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold ring-2 ring-rose-500/40 scale-105'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                  {/* Laser line overlay */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_10px_#f43f5e] transition-all duration-100"
                    style={{ left: `${((pulseTick % 6) + 0.5) * (100 / 6)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-rose-400">
                  <span>Search Cycles: 1,024 Ops</span>
                  <span className="font-bold">HIGH LATENCY</span>
                </div>
              </div>

              {/* Right: Organized O(1) Index / Hash Access */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-emerald-900/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Organized Structure (Indexed)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    O(1) Instant
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  Direct address calculation instantly jumps directly to the exact target cell in 1 clock cycle, zero search penalty.
                </p>

                {/* Animated Target Beam */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-900/40">
                  <div className="grid grid-cols-6 gap-1.5 text-center font-mono text-xs">
                    {['18', '35', '40', '63', '72', '91'].map((num, nIdx) => {
                      const isTarget = num === '40';
                      return (
                        <div
                          key={nIdx}
                          className={`p-1.5 rounded border transition-all ${
                            isTarget
                              ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold ring-2 ring-emerald-500/50 scale-105 shadow-md shadow-emerald-500/30'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>Target: arr[2] = 40</span>
                  <span className="font-bold">1 CYCLE (0.5ns)</span>
                </div>
              </div>
            </div>

            {/* 4 Pillars Mini Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { title: 'Fast Retrieval', stat: 'O(1) Access', col: 'text-indigo-400' },
                { title: 'Cache Locality', stat: 'L1/L2 Hits', col: 'text-emerald-400' },
                { title: 'Search Halving', stat: 'O(log N)', col: 'text-amber-400' },
                { title: 'Safe Scaling', stat: 'Predictable', col: 'text-cyan-400' },
              ].map((p, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-center font-mono">
                  <div className="text-[10px] text-slate-400">{p.title}</div>
                  <div className={`text-xs font-bold ${p.col}`}>{p.stat}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 3: Definition of a Data Structure (The Formula) */}
        {currentScene.id === 3 && (
          <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
            {/* The Master Formula */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-indigo-950/60 border-2 border-indigo-500 shadow-xl shadow-indigo-950/60 text-center space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-300 uppercase">
                THE COMPUTATIONAL DEFINITION
              </div>
              <div className="text-sm sm:text-xl font-black text-white font-mono flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-900/80 border border-indigo-400 text-indigo-200 shadow-xs">
                  Memory Layout
                </span>
                <span className="text-indigo-400 text-xl font-black">+</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-900/80 border border-emerald-400 text-emerald-200 shadow-xs">
                  Permitted Operations
                </span>
                <span className="text-indigo-400 text-xl font-black">=</span>
                <span className="px-3 py-1 rounded-xl bg-amber-900/80 border border-amber-400 text-amber-200 shadow-xs">
                  Data Structure
                </span>
              </div>
            </div>

            {/* Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-900/60 space-y-2">
                <div className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>1. Memory Layout (Storage)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-normal">
                  <li>Contiguous block indexing (Arrays)</li>
                  <li>Dynamic pointer chains (Linked Lists)</li>
                  <li>Hierarchical parent-child nodes (Trees)</li>
                  <li>Arbitrary vertex-edge topologies (Graphs)</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-900/60 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>2. Permitted Operations</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-normal">
                  <li>Insertion: Push, Enqueue, Prepend</li>
                  <li>Deletion: Pop, Dequeue, Remove</li>
                  <li>Traversal: Linear Scan, In-order, BFS</li>
                  <li>Lookup: Binary Search, Direct Key Lookup</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 4: Master Classification (Primitive vs Non-Primitive) */}
        {currentScene.id === 4 && (
          <div className="w-full max-w-4xl space-y-3">
            <div className="flex justify-center">
              <div className="px-4 py-1.5 rounded-xl bg-indigo-950 border border-indigo-400 font-mono font-bold text-xs sm:text-sm text-indigo-200 shadow-md">
                MASTER TAXONOMY HIERARCHY
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Primitive */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-indigo-500/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                    1. Primitive Types
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Stack Memory
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  Basic atomic data types natively understood by CPU instructions. They store direct values with fixed memory size.
                </p>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Integer (4B)
                  </span>
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Float (4B)
                  </span>
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Character (1B)
                  </span>
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Boolean (1B)
                  </span>
                </div>
              </div>

              {/* Non-Primitive */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-emerald-500/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    2. Non-Primitive
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Heap Storage
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  Composite user-defined data structures referencing dynamic heap allocations via 64-bit pointers.
                </p>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Arrays
                  </span>
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Linked Lists
                  </span>
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Stacks & Queues
                  </span>
                  <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200">
                    • Trees & Graphs
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 5: Primitive Data Types (Hardware Registers Simulator) */}
        {currentScene.id === 5 && (
          <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {[
              {
                name: 'INTEGER (int)',
                size: '32-bit (4 Bytes)',
                bits: '00000000 00000000 00000000 00101010',
                val: '= 42',
                col: 'indigo',
                desc: "Two's complement signed integer",
              },
              {
                name: 'FLOAT (float)',
                size: '32-bit (IEEE 754)',
                bits: '01000000 01001001 00001111 11011011',
                val: '≈ 3.1415',
                col: 'emerald',
                desc: 'Sign bit + 8-bit exp + 23-bit mantissa',
              },
              {
                name: 'CHARACTER (char)',
                size: '8-bit (1 Byte)',
                bits: '01000001',
                val: "= 'A' (ASCII 65)",
                col: 'amber',
                desc: 'ASCII byte mapping directly to glyph',
              },
              {
                name: 'BOOLEAN (bool)',
                size: '1-bit Logic Flag',
                bits: '00000001',
                val: '= TRUE (1)',
                col: 'rose',
                desc: 'Logical conditional branching gate',
              },
            ].map((reg, rIdx) => (
              <div
                key={rIdx}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{reg.name}</span>
                  <span className="text-[10px] font-mono text-indigo-400">{reg.size}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-indigo-300 overflow-x-auto">
                  {reg.bits}
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">{reg.desc}</span>
                  <span className="font-bold text-emerald-400">{reg.val}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SCENE 6: Non-Primitive Types (Stack-to-Heap Pointer Architecture) */}
        {currentScene.id === 6 && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            {/* Stack Frame */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">STACK FRAME</span>
                <span className="text-[10px] font-mono text-slate-400">Pointers</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-950 border border-indigo-900/60">
                  <div className="text-slate-400 text-[10px]">arrPtr</div>
                  <div className="text-indigo-300 font-bold">0x7FFE2000 ➔</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-blue-900/60">
                  <div className="text-slate-400 text-[10px]">headPtr</div>
                  <div className="text-blue-300 font-bold">0x7FFE4000 ➔</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-emerald-900/60">
                  <div className="text-slate-400 text-[10px]">rootPtr</div>
                  <div className="text-emerald-300 font-bold">0x7FFE6000 ➔</div>
                </div>
              </div>
            </div>

            {/* Dynamic Heap Storage */}
            <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/70 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">DYNAMIC HEAP STORAGE</span>
                <span className="text-[10px] font-mono text-slate-400">Objects in RAM</span>
              </div>

              {/* Contiguous Array */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Array Chunk (0x7FFE2000):</div>
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                  {['10', '25', '40', '65', '90'].map((itm, i) => (
                    <div key={i} className="p-1.5 rounded bg-slate-950 border border-slate-800 text-xs">
                      <div className="text-[9px] text-slate-500">[{i}]</div>
                      <div className="font-bold text-indigo-400">{itm}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Nodes */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Linked Node Chain (0x7FFE4000):</div>
                <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
                  <div className="p-1.5 px-2 rounded bg-slate-950 border border-blue-900/60 flex items-center gap-2">
                    <span className="font-bold text-blue-400">15</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-[10px] text-slate-400">0x4040 ➔</span>
                  </div>
                  <div className="p-1.5 px-2 rounded bg-slate-950 border border-blue-900/60 flex items-center gap-2">
                    <span className="font-bold text-blue-400">30</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-[10px] text-slate-400">NULL</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                Non-primitives store lightweight 64-bit addresses on stack pointing to dynamically allocated memory buffers in heap.
              </div>
            </div>
          </div>
        )}

        {/* SCENE 7: Operations & Big-O Complexity */}
        {currentScene.id === 7 && (
          <div className="w-full max-w-4xl space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { name: 'Index Access', time: 'O(1)', badge: 'CONSTANT', col: 'text-emerald-400' },
                { name: 'Binary Search', time: 'O(log N)', badge: 'LOGARITHMIC', col: 'text-indigo-400' },
                { name: 'Linear Scan', time: 'O(N)', badge: 'LINEAR', col: 'text-amber-400' },
                { name: 'Quick / Merge', time: 'O(N log N)', badge: 'DIVIDE & CONQUER', col: 'text-sky-400' },
              ].map((comp, cIdx) => (
                <div key={cIdx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
                  <div className="text-[9px] font-mono font-bold text-slate-500">{comp.badge}</div>
                  <div className={`text-base sm:text-xl font-black font-mono ${comp.col}`}>{comp.time}</div>
                  <div className="text-xs text-slate-200 font-medium">{comp.name}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-900/60 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-indigo-400">Architectural Principle: </span>
              Every data structure is a deliberate trade-off. Choosing the right structure eliminates CPU bottlenecks and memory overhead.
            </div>
          </div>
        )}
      </div>

      {/* ─── STAGE BOTTOM NARRATION HUD ─── */}
      <div className="border-t border-slate-800/80 pt-2.5 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-xs sm:text-sm text-slate-200 font-normal leading-snug">
          <span className="text-indigo-400 font-bold mr-2">VOICEOVER:</span>
          "{currentScene.narration}"
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            Scene {currentScene.id} of 7 ({Math.round(sceneProgress * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
};
