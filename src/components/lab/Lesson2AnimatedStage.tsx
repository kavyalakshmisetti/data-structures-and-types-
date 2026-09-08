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
                <span className="font-bold text-indigo-400 uppercase">
                  Singly Linked List Nodes (Heap Addresses)
                </span>
                <span className="text-slate-400 text-[10px]">Head: 0x4000</span>
              </div>

              {/* Animated Pointer Chain */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-1">
                {[
                  { val: 15, next: '0x4040', addr: '0x4000' },
                  { val: 30, next: '0x4080', addr: '0x4040' },
                  { val: 45, next: 'NULL', addr: '0x4080' },
                ].map((node, nIdx) => {
                  const isPulse = (pulseTick % 3) === nIdx;
                  return (
                    <React.Fragment key={nIdx}>
                      <div
                        className={`p-2 sm:p-3 rounded-xl border min-w-[90px] sm:min-w-[110px] text-center font-mono transition-all duration-300 ${
                          isPulse
                            ? 'bg-indigo-950/80 border-indigo-400 shadow-md ring-2 ring-indigo-500/40 scale-105'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400">{node.addr}</div>
                        <div className="text-base sm:text-lg font-bold text-white my-0.5">
                          {node.val}
                        </div>
                        <div className="text-[10px] text-indigo-400">➔ {node.next}</div>
                      </div>
                      {nIdx < 2 && (
                        <ArrowRight
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isPulse ? 'text-indigo-400' : 'text-slate-600'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                <span>Head Insertion: <span className="text-emerald-400 font-bold">O(1)</span></span>
                <span>Random Traversal: <span className="text-rose-400 font-bold">O(N)</span></span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 4: Linear: Stacks (LIFO) */}
        {currentScene.id === 4 && (
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Stack Cylinder */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                <span>STACK (LIFO) CONTAINER</span>
                <span className="text-slate-400 text-[10px]">Top Index: 2</span>
              </div>

              <div className="flex flex-col-reverse gap-1.5 p-2 rounded-lg bg-slate-950 border-2 border-rose-500/40 font-mono text-center">
                {['10 (Base)', '20 (Mid)', '30 (TOP)'].map((elem, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border font-bold text-xs transition-all ${
                      idx === 2
                        ? 'bg-rose-950/80 border-rose-400 text-rose-300 ring-1 ring-rose-500/40 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {elem}
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Ops Summary */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-rose-400 font-bold">PUSH(item) ➔ O(1)</div>
                <div className="text-slate-400 text-[11px]">Adds element directly to the top of the stack.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold">POP() ➔ O(1)</div>
                <div className="text-slate-400 text-[11px]">Removes the most recent element from the top.</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Used in: Function Call Stack, Undo / Redo history, Syntax parsing.
              </div>
            </div>
          </div>
        )}

        {/* SCENE 5: Linear: Queues (FIFO) */}
        {currentScene.id === 5 && (
          <div className="w-full max-w-2xl space-y-3">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-sky-500/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400">
                <span>QUEUE (FIFO) CONVEYOR</span>
                <span className="text-slate-400 text-[10px]">Front ➔ Exit | Rear ➔ Entry</span>
              </div>

              {/* Horizontal Conveyor */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-sky-900/60 font-mono text-center text-xs">
                <div className="text-emerald-400 font-bold shrink-0">FRONT ➔</div>
                {['Job A', 'Job B', 'Job C', 'Job D'].map((job, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 p-2 rounded border font-bold transition-all ${
                      idx === 0
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {job}
                  </div>
                ))}
                <div className="text-sky-400 font-bold shrink-0">➔ REAR</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-sky-400 font-bold">ENQUEUE:</span> Insert at Rear O(1)
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold">DEQUEUE:</span> Remove from Front O(1)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 6: Non-Linear: Binary Search Tree (BST) */}
        {currentScene.id === 6 && (
          <div className="w-full max-w-3xl space-y-3">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-emerald-500/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-emerald-400 uppercase">
                  Binary Search Tree Hierarchy (O(log N) Search)
                </span>
                <span className="text-slate-400 text-[10px]">Rule: Left &lt; Root &lt; Right</span>
              </div>

              {/* Tree Diagram Mock */}
              <div className="flex flex-col items-center gap-2 py-1 font-mono">
                {/* Level 1: Root */}
                <div className="p-2 px-3.5 rounded-xl bg-indigo-950 border border-indigo-400 text-white font-bold text-xs shadow-md">
                  Root: 50
                </div>

                {/* Level 2 */}
                <div className="flex items-center gap-12 sm:gap-20 text-xs">
                  <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-200">
                    30 (Left)
                  </div>
                  <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-200">
                    70 (Right)
                  </div>
                </div>

                {/* Level 3 */}
                <div className="flex items-center gap-3 sm:gap-6 text-[11px]">
                  <div className="p-1 px-2 rounded bg-slate-950 border border-slate-800 text-slate-400">20</div>
                  <div className="p-1 px-2 rounded bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold">
                    40 (Target)
                  </div>
                  <div className="p-1 px-2 rounded bg-slate-950 border border-slate-800 text-slate-400">60</div>
                  <div className="p-1 px-2 rounded bg-slate-950 border border-slate-800 text-slate-400">80</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-center text-emerald-400">
                Target 40: 40 &lt; 50 (Go Left) ➔ 40 &gt; 30 (Go Right) ➔ Target Found in 2 Comparisons!
              </div>
            </div>
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
