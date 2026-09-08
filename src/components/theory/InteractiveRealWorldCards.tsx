import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Undo2, Redo2, Globe, Cpu, Compass, Calculator, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveRealWorldCards: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string>('browser');

  // Mini browser demo
  const [backHistory, setBackHistory] = useState<string[]>(['google.com', 'github.com']);
  const [currentPage, setCurrentPage] = useState<string>('stackoverflow.com');
  const [forwardHistory, setForwardHistory] = useState<string[]>([]);

  // Mini undo/redo demo
  const [text, setText] = useState<string>('Hello Stack Master');
  const [undoStack, setUndoStack] = useState<string[]>(['H', 'Hello', 'Hello Stack']);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const handleBrowserBack = () => {
    if (backHistory.length === 0) return;
    soundEffects.playPop();
    const prev = backHistory[backHistory.length - 1];
    setForwardHistory((f) => [currentPage, ...f]);
    setCurrentPage(prev);
    setBackHistory((b) => b.slice(0, -1));
  };

  const handleBrowserForward = () => {
    if (forwardHistory.length === 0) return;
    soundEffects.playPush();
    const next = forwardHistory[0];
    setBackHistory((b) => [...b, currentPage]);
    setCurrentPage(next);
    setForwardHistory((f) => f.slice(1));
  };

  const apps = [
    {
      id: 'browser',
      icon: Globe,
      title: 'Browser History',
      subtitle: 'Dual-Stack Navigation Pipeline',
      desc: 'Chrome & Firefox use two stacks: a Back Stack and a Forward Stack.',
    },
    {
      id: 'undoredo',
      icon: Undo2,
      title: 'Undo / Redo Buffer',
      subtitle: 'State Mutation Stacks',
      desc: 'VS Code and Photoshop push every document edit to an Undo stack.',
    },
    {
      id: 'callstack',
      icon: Cpu,
      title: 'Function Call Stack',
      subtitle: 'OS Execution Frame Memory',
      desc: 'CPUs allocate stack activation frames to store local variables and return addresses.',
    },
    {
      id: 'backtrack',
      icon: Compass,
      title: 'Maze & Backtracking',
      subtitle: 'Decision Tree Exploration',
      desc: 'Algorithms push paths when exploring and pop when encountering dead ends.',
    },
    {
      id: 'compiler',
      icon: Calculator,
      title: 'Compiler Parsing',
      subtitle: 'Syntax & Expression Trees',
      desc: 'Linters validate matching tags and compilers evaluate math expressions in RPN.',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Industrial Real-World Systems
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Where Stack architecture directly powers modern operating systems and web platforms.
        </p>
      </div>

      {/* Grid of Real-World Systems Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {apps.map((item) => {
          const Icon = item.icon;
          const isSelected = activeApp === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveApp(item.id);
              }}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <div>
                <span className="text-xs font-bold font-mono block leading-tight">{item.title}</span>
                <span className="text-[10px] opacity-75 font-mono">{item.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active System Interactive Sandbox */}
      {activeApp === 'browser' && (
        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBrowserBack}
                disabled={backHistory.length === 0}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                ← Back ({backHistory.length})
              </button>
              <button
                onClick={handleBrowserForward}
                disabled={forwardHistory.length === 0}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Forward ({forwardHistory.length}) →
              </button>
            </div>
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              🌐 Current URL: {currentPage}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">BACK STACK (LIFO)</span>
              {backHistory.length === 0 ? (
                <span className="text-[10px] text-slate-400">[ Empty ]</span>
              ) : (
                backHistory.map((url, i) => (
                  <div key={i} className="text-indigo-600 dark:text-indigo-400 font-bold">
                    [{i}] {url}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">FORWARD STACK (LIFO)</span>
              {forwardHistory.length === 0 ? (
                <span className="text-[10px] text-slate-400">[ Empty ]</span>
              ) : (
                forwardHistory.map((url, i) => (
                  <div key={i} className="text-purple-600 dark:text-purple-400 font-bold">
                    [{i}] {url}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeApp !== 'browser' && (
        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase">
            {apps.find((a) => a.id === activeApp)?.title} Architecture
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {apps.find((a) => a.id === activeApp)?.desc}
          </p>
        </div>
      )}

      {/* Advantages & Limitations Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>CORE ADVANTAGES</span>
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-medium list-disc list-inside">
            <li>Guaranteed O(1) constant time insertion and deletion.</li>
            <li>Zero memory overhead in array representations.</li>
            <li>Clean, minimal API reduces implementation defects.</li>
            <li>Deterministic memory management for activation frames.</li>
          </ul>
        </div>

        <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>LIMITATIONS & TRADE-OFFS</span>
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-medium list-disc list-inside">
            <li>No random access: Cannot read stack[i] without popping above.</li>
            <li>Fixed capacity in array stacks risk Stack Overflow.</li>
            <li>Searching takes O(n) time and destructively alters order.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
