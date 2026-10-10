import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  GitCommit,
  RotateCcw,
  Network,
  FolderTree,
  CheckCircle2,
  Clock,
  Compass,
  Zap,
  Activity,
  Box,
  ListTree,
} from 'lucide-react';
import { EducationalScene } from '../../data/labVideoData';

interface Lesson2AnimatedStageProps {
  currentScene: EducationalScene;
  currentTime: number;
  isPlaying: boolean;
}

export const Lesson2AnimatedStage: React.FC<Lesson2AnimatedStageProps> = ({
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
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
              <span>LESSON 02 ANIMATED STUDIO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
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
        {/* SCENE 1: Choosing the Right Data Structure */}
        {currentScene.id === 1 && (
          <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { query: 'Sequential Access?', pick: 'Linear (Array/List)', tag: 'O(1) Index / Head', col: 'indigo' },
              { query: 'Hierarchical Data?', pick: 'Trees (BST/Heap)', tag: 'O(log N) Search', col: 'emerald' },
              { query: 'Interconnected Net?', pick: 'Graphs (V + E)', tag: 'Network Paths', col: 'rose' },
              { query: 'Key-Value Direct?', pick: 'Hash Table', tag: 'Average O(1)', col: 'amber' },
            ].map((opt, oIdx) => {
              const isActive = (pulseTick % 4) === oIdx;
              return (
                <div
                  key={oIdx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20 scale-[1.03]'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold text-slate-400">
                      {opt.query}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {opt.pick}
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-800/80 mt-2">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {opt.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SCENE 2: Linear Structures: Arrays */}
        {currentScene.id === 2 && (
          <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-emerald-500/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  Contiguous RAM Array (Base: 0x2000, Size: 4B)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Target: arr[2] = 40</span>
              </div>

              {/* Animated Array Cells */}
              <div className="grid grid-cols-5 gap-2 text-center font-mono">
                {[
                  { idx: 0, val: 10, addr: '0x2000' },
                  { idx: 1, val: 25, addr: '0x2004' },
                  { idx: 2, val: 40, addr: '0x2008' },
                  { idx: 3, val: 65, addr: '0x200C' },
                  { idx: 4, val: 90, addr: '0x2010' },
                ].map((cell) => {
                  const isTarget = cell.idx === 2;
                  const isHovered = (pulseTick % 5) === cell.idx;
                  return (
                    <div
                      key={cell.idx}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-300 ${
                        isTarget
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/50 shadow-md scale-105'
                          : isHovered
                          ? 'bg-slate-800 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">[{cell.idx}]</div>
                      <div className="text-base sm:text-xl font-bold my-0.5">{cell.val}</div>
                      <div className="text-[9px] text-slate-500 truncate">{cell.addr}</div>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-slate-300">
                <span className="text-indigo-400 font-bold">Address Formula:</span>
                <span>Addr = 0x2000 + (2 × 4) = 0x2008</span>
                <span className="text-emerald-400 font-bold">O(1) Instant Lookup</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-900/60 space-y-1">
                <div className="font-bold text-emerald-400">✓ Pros: O(1) Access</div>
                <div className="text-slate-400 text-[11px]">Hardware cache-line friendly; predictable constant-time access.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-rose-900/60 space-y-1">
                <div className="font-bold text-rose-400">✕ Cons: O(N) Shift</div>
                <div className="text-slate-400 text-[11px]">Inserting or deleting in the middle forces shifting remaining elements.</div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 3: Linear Structures: Linked Lists */}
        {currentScene.id === 3 && (
          <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-indigo-500/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-indigo-400 uppercase flex items-center gap-1.5">
                  <GitCommit className="w-4 h-4 text-indigo-400" />
                  Singly Linked List Nodes & O(1) Prepend Flow
                </span>
                <span className="text-slate-400 text-[10px]">Head Ptr: {pulseTick % 20 < 10 ? '0x3E00' : '0x4000'}</span>
              </div>

              {/* Animated Pointer Chain with Prepending Node */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-2">
                {/* Dynamically Prepending New Node */}
                <div
                  className={`p-2 sm:p-2.5 rounded-xl border text-center font-mono transition-all duration-500 ${
                    pulseTick % 20 < 10
                      ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg scale-105'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="text-[9px] text-emerald-400 font-bold">New Head (O(1))</div>
                  <div className="text-sm sm:text-base font-bold text-white">5</div>
                  <div className="text-[9px] text-emerald-300">➔ 0x4000</div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />

                {[
                  { val: 15, next: '0x4040', addr: '0x4000' },
                  { val: 30, next: '0x4080', addr: '0x4040' },
                  { val: 45, next: 'NULL', addr: '0x4080' },
                ].map((node, nIdx) => {
                  const isPulse = (pulseTick % 3) === nIdx;
                  return (
                    <React.Fragment key={nIdx}>
                      <div
                        className={`p-2 sm:p-2.5 rounded-xl border min-w-[75px] sm:min-w-[95px] text-center font-mono transition-all duration-300 ${
                          isPulse
                            ? 'bg-indigo-950/80 border-indigo-400 shadow-md ring-2 ring-indigo-500/40 scale-105'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="text-[9px] text-slate-400">{node.addr}</div>
                        <div className="text-sm sm:text-base font-bold text-white my-0.5">
                          {node.val}
                        </div>
                        <div className="text-[9px] text-indigo-400">➔ {node.next}</div>
                      </div>
                      {nIdx < 2 && (
                        <ArrowRight
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isPulse ? 'text-indigo-400' : 'text-slate-600'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                <span>Operation: <span className="text-emerald-400 font-bold">Prepend(5)</span> ➔ 2 Ptr Updates, 0 Shifts</span>
                <span className="text-emerald-400 font-bold">O(1) Time</span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 4: Linear: Stacks (LIFO) - Animated Working Flow */}
        {currentScene.id === 4 && (
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Real Dynamic Stack Chamber with PUSH & POP */}
            {(() => {
              const isPushPhase = (pulseTick % 30) < 15;
              const stackItems = isPushPhase
                ? [
                    { val: '10', label: 'Base [0]' },
                    { val: '20', label: 'Mid [1]' },
                    { val: '30', label: 'Mid [2]' },
                    { val: '40 (PUSHED)', label: 'TOP [3]', highlight: true },
                  ]
                : [
                    { val: '10', label: 'Base [0]' },
                    { val: '20', label: 'Mid [1]' },
                    { val: '30 (TOP)', label: 'TOP [2]', highlight: true },
                  ];

              return (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                    <span className="flex items-center gap-1.5">
                      <Box className="w-4 h-4 text-rose-400" />
                      STACK LIFO CHAMBER
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      TOP: {isPushPhase ? 'Index 3' : 'Index 2'}
                    </span>
                  </div>

                  {/* Vertical stack elements */}
                  <div className="flex flex-col-reverse gap-1.5 p-2 rounded-lg bg-slate-950 border-2 border-rose-500/40 font-mono text-center min-h-[140px] justify-start">
                    {stackItems.map((elem, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border font-bold text-xs transition-all duration-300 flex items-center justify-between px-3 ${
                          elem.highlight
                            ? 'bg-rose-950/90 border-rose-400 text-rose-200 ring-2 ring-rose-500/50 shadow-md scale-[1.02]'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400">{elem.label}</span>
                        <span>{elem.val}</span>
                        {elem.highlight && <span className="text-[10px] text-rose-400 font-bold">▲ TOP PTR</span>}
                      </div>
                    ))}
                  </div>

                  {/* Operation Status Banner */}
                  <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono flex items-center justify-between text-rose-300">
                    <span>Flow: {isPushPhase ? 'PUSH(40) into Stack' : 'POP() removes Top'}</span>
                    <span className="font-bold text-emerald-400">O(1)</span>
                  </div>
                </div>
              );
            })()}

            {/* Stack Ops Summary */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-rose-400 font-bold flex items-center justify-between">
                  <span>PUSH(item) ➔ O(1)</span>
                  <span className="text-[10px] text-slate-500">Insert Top</span>
                </div>
                <div className="text-slate-400 text-[11px]">Direct top pointer increment; element slides into memory without shifts.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center justify-between">
                  <span>POP() ➔ O(1)</span>
                  <span className="text-[10px] text-slate-500">Remove Top</span>
                </div>
                <div className="text-slate-400 text-[11px]">Ejects most recent item; top pointer decrements in 1 clock cycle.</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                Core Use Cases: Browser Back button, Undo / Redo history, Function Call Stack.
              </div>
            </div>
          </div>
        )}

        {/* SCENE 5: Linear: Queues (FIFO) - Animated Working Flow */}
        {currentScene.id === 5 && (
          <div className="w-full max-w-2xl space-y-3">
            {(() => {
              const isEnqueuePhase = (pulseTick % 30) < 15;
              const queueItems = isEnqueuePhase
                ? ['Job A', 'Job B', 'Job C', 'Job D', 'Job E+']
                : ['Job B', 'Job C', 'Job D', 'Job E'];

              return (
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-sky-500/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400">
                    <span className="flex items-center gap-1.5">
                      <ListTree className="w-4 h-4 text-sky-400" />
                      QUEUE FIFO CONVEYOR (FRONT ➔ EXIT | REAR ➔ ENTRY)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      {isEnqueuePhase ? 'ENQUEUE Active' : 'DEQUEUE Active'}
                    </span>
                  </div>

                  {/* Horizontal Conveyor Pipeline */}
                  <div className="flex items-center justify-between gap-1.5 p-2.5 rounded-lg bg-slate-950 border border-sky-900/60 font-mono text-center text-xs overflow-x-auto">
                    <div className="text-emerald-400 font-bold shrink-0 text-[10px] px-1 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                      FRONT ▲ DEQUEUE
                    </div>
                    {queueItems.map((job, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 min-w-[55px] p-2 rounded border font-bold transition-all duration-300 ${
                          idx === 0
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-1 ring-emerald-500/40'
                            : idx === queueItems.length - 1
                            ? 'bg-sky-950/80 border-sky-400 text-sky-300 ring-1 ring-sky-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        {job}
                      </div>
                    ))}
                    <div className="text-sky-400 font-bold shrink-0 text-[10px] px-1 py-0.5 rounded bg-sky-950/80 border border-sky-800">
                      REAR ▲ ENQUEUE
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-sky-400 font-bold">ENQUEUE:</span>
                      <span className="text-slate-300">Insert at Rear O(1)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">DEQUEUE:</span>
                      <span className="text-slate-300">Exit from Front O(1)</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SCENE 6: Non-Linear: Binary Search Tree (BST) & Graph Working Flow */}
        {currentScene.id === 6 && (
          <div className="w-full max-w-3xl space-y-3">
            {(() => {
              // Active search step traversal: 0: Root(50) -> 1: Left(30) -> 2: Target(40)
              const searchStep = Math.floor((pulseTick % 30) / 10);

              return (
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-emerald-500/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <FolderTree className="w-4 h-4 text-emerald-400" />
                      BST Traversal Working Flow: Search(40) in O(log N)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Hop {searchStep + 1} of 3
                    </span>
                  </div>

                  {/* Animated Tree Diagram */}
                  <div className="flex flex-col items-center gap-1.5 py-1 font-mono">
                    {/* Level 1: Root */}
                    <div
                      className={`p-2 px-4 rounded-xl border font-bold text-xs shadow-md transition-all duration-300 ${
                        searchStep === 0
                          ? 'bg-emerald-900 border-emerald-400 text-white ring-2 ring-emerald-500/50 scale-110'
                          : 'bg-indigo-950 border-indigo-400 text-white'
                      }`}
                    >
                      Root: 50 {searchStep === 0 && '◄ 40 < 50 (Go Left)'}
                    </div>

                    {/* Level 2 */}
                    <div className="flex items-center gap-12 sm:gap-20 text-xs">
                      <div
                        className={`p-2 px-3 rounded-lg border transition-all duration-300 ${
                          searchStep === 1
                            ? 'bg-emerald-900 border-emerald-400 text-white ring-2 ring-emerald-500/50 scale-110'
                            : 'bg-slate-950 border-slate-700 text-slate-200'
                        }`}
                      >
                        30 (Left) {searchStep === 1 && '◄ 40 > 30 (Go Right)'}
                      </div>
                      <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 opacity-60">
                        70 (Right)
                      </div>
                    </div>

                    {/* Level 3 */}
                    <div className="flex items-center gap-2 sm:gap-5 text-[11px]">
                      <div className="p-1 px-2 rounded bg-slate-950 border border-slate-800 text-slate-500 opacity-50">20</div>
                      <div
                        className={`p-1.5 px-3 rounded-lg border font-bold transition-all duration-300 ${
                          searchStep === 2
                            ? 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-400/50 scale-125 shadow-lg'
                            : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        }`}
                      >
                        40 {searchStep === 2 ? '★ TARGET FOUND!' : '(Target)'}
                      </div>
                      <div className="p-1 px-2 rounded bg-slate-950 border border-slate-800 text-slate-500 opacity-50">60</div>
                      <div className="p-1 px-2 rounded bg-slate-950 border border-slate-800 text-slate-500 opacity-50">80</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-center text-emerald-300 flex items-center justify-between">
                    <span>Tree Height: h = 3 levels</span>
                    <span className="font-bold text-emerald-400">Search Time: O(log N) = 2 comparisons</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SCENE 7: Non-Linear: Graphs & Summary Decision Matrix */}
        {currentScene.id === 7 && (
          <div className="w-full max-w-4xl space-y-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500">ARRAY</div>
                <div className="font-bold text-emerald-400 text-sm">O(1) Access</div>
                <div className="text-[10px] text-slate-400">Contiguous Blocks</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500">LINKED LIST</div>
                <div className="font-bold text-indigo-400 text-sm">O(1) Prepend</div>
                <div className="text-[10px] text-slate-400">Pointer Nodes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500">BST TREE</div>
                <div className="font-bold text-emerald-400 text-sm">O(log N)</div>
                <div className="text-[10px] text-slate-400">Hierarchical</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500">GRAPH (V+E)</div>
                <div className="font-bold text-rose-400 text-sm">BFS / DFS</div>
                <div className="text-[10px] text-slate-400">Network Topology</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-900/60 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-indigo-400">Architectural Rule: </span>
              Pick linear structures when data flows sequentially; pick non-linear trees or graphs when data has hierarchical branching or arbitrary network relationships.
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
