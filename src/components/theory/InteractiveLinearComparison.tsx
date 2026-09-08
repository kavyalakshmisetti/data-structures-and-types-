import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Database,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

type StructureType = 'array' | 'linkedlist' | 'stack' | 'queue';

export const InteractiveLinearComparison: React.FC = () => {
  const [activeType, setActiveType] = useState<StructureType>('array');
  const [arrayData, setArrayData] = useState<number[]>([10, 20, 30, 40]);
  const [stackData, setStackData] = useState<number[]>([10, 20, 30, 40]);
  const [queueData, setQueueData] = useState<number[]>([10, 20, 30, 40]);
  const [inputValue, setInputValue] = useState<number>(50);
  const [actionLog, setActionLog] = useState<string>('Ready to test operations.');

  const handleArrayInsert = () => {
    if (arrayData.length >= 6) {
      setActionLog('Array Full: Need re-allocation and copy for new capacity (O(N)).');
      soundEffects.playError();
      return;
    }
    soundEffects.playClick();
    setArrayData([...arrayData, inputValue]);
    setActionLog(`Array Append: O(1) amortized. Element ${inputValue} stored at index [${arrayData.length}].`);
  };

  const handleArrayDelete = () => {
    if (arrayData.length === 0) return;
    soundEffects.playClick();
    const removed = arrayData[0];
    setArrayData(arrayData.slice(1));
    setActionLog(`Array Delete at Index 0: Removed ${removed}. O(N) cost because all subsequent elements had to shift left.`);
  };

  const handleStackPush = () => {
    if (stackData.length >= 6) {
      setActionLog('Stack Overflow! Maximum capacity reached.');
      soundEffects.playError();
      return;
    }
    soundEffects.playClick();
    setStackData([...stackData, inputValue]);
    setActionLog(`Stack Push: O(1) constant time. ${inputValue} pushed to TOP.`);
  };

  const handleStackPop = () => {
    if (stackData.length === 0) {
      setActionLog('Stack Underflow! Cannot pop from empty stack.');
      soundEffects.playError();
      return;
    }
    soundEffects.playClick();
    const popped = stackData[stackData.length - 1];
    setStackData(stackData.slice(0, -1));
    setActionLog(`Stack Pop (LIFO): O(1) constant time. Removed ${popped} from TOP.`);
  };

  const handleQueueEnqueue = () => {
    if (queueData.length >= 6) {
      setActionLog('Queue is full!');
      soundEffects.playError();
      return;
    }
    soundEffects.playClick();
    setQueueData([...queueData, inputValue]);
    setActionLog(`Queue Enqueue: O(1) constant time. Inserted ${inputValue} at REAR.`);
  };

  const handleQueueDequeue = () => {
    if (queueData.length === 0) {
      setActionLog('Queue Underflow! Cannot dequeue from empty queue.');
      soundEffects.playError();
      return;
    }
    soundEffects.playClick();
    const dequeued = queueData[0];
    setQueueData(queueData.slice(1));
    setActionLog(`Queue Dequeue (FIFO): O(1) constant time. Served ${dequeued} from FRONT.`);
  };

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Linear Data Structures Workbench
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Test live insertion, deletion, and order disciplines across the 4 major linear data structures.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {[
            { id: 'array' as const, label: 'Array (Contiguous)' },
            { id: 'linkedlist' as const, label: 'Linked List (Nodes)' },
            { id: 'stack' as const, label: 'Stack (LIFO)' },
            { id: 'queue' as const, label: 'Queue (FIFO)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveType(item.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeType === item.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operation Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
              Live Visual Container
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              {activeType === 'array' && (
                <>
                  <button
                    onClick={handleArrayInsert}
                    className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Append
                  </button>
                  <button
                    onClick={handleArrayDelete}
                    className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Minus className="w-3.5 h-3.5" /> Shift Delete
                  </button>
                </>
              )}
              {activeType === 'stack' && (
                <>
                  <button
                    onClick={handleStackPush}
                    className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Push (TOP)
                  </button>
                  <button
                    onClick={handleStackPop}
                    className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Minus className="w-3.5 h-3.5" /> Pop (TOP)
                  </button>
                </>
              )}
              {activeType === 'queue' && (
                <>
                  <button
                    onClick={handleQueueEnqueue}
                    className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Enqueue (Rear)
                  </button>
                  <button
                    onClick={handleQueueDequeue}
                    className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Minus className="w-3.5 h-3.5" /> Dequeue (Front)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Visual representations */}
          <div className="min-h-[140px] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {activeType === 'array' && (
              <div className="flex gap-2">
                {arrayData.map((val, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-xl border-2 border-indigo-500 bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-xs"
                  >
                    <span className="text-[10px] font-mono text-slate-400 dark:text-white/70">[{idx}]</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{val}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {activeType === 'linkedlist' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-white/80">HEAD ➔</span>
                {[10, 20, 30, 40].map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-900 flex overflow-hidden shadow-xs">
                      <div className="px-3 py-2 text-xs font-bold text-slate-900 dark:text-white border-r border-emerald-300 dark:border-emerald-800">
                        {val}
                      </div>
                      <div className="px-2 py-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60">
                        •next
                      </div>
                    </div>
                    {idx < 3 ? <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" /> : <span className="text-xs font-mono font-bold text-rose-500">NULL</span>}
                  </div>
                ))}
              </div>
            )}

            {activeType === 'stack' && (
              <div className="flex flex-col-reverse items-center gap-1.5 border-b-4 border-indigo-600 px-6 py-2">
                {stackData.map((val, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`w-36 py-2 px-3 rounded-lg text-center font-mono font-bold text-xs shadow-xs border ${
                      idx === stackData.length - 1
                        ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {val} {idx === stackData.length - 1 ? '← [TOP]' : ''}
                  </motion.div>
                ))}
              </div>
            )}

            {activeType === 'queue' && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">FRONT (Out) ←</span>
                <div className="flex gap-1.5 border-y-2 border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 rounded-lg">
                  {queueData.map((val, idx) => (
                    <motion.div
                      key={idx}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        idx === 0
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                          : idx === queueData.length - 1
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {val}
                    </motion.div>
                  ))}
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">← REAR (In)</span>
              </div>
            )}
          </div>

          {/* Action Log Message */}
          <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg shadow-inner flex items-center gap-2 border border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionLog}</span>
          </div>
        </div>

        {/* Right: Complexity Matrix */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-white block">
            Time Complexity Comparison
          </span>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-white/80 uppercase block font-bold">Array (Contiguous):</span>
              <div className="flex justify-between mt-1 text-slate-900 dark:text-white">
                <span>Access: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong></span>
                <span>Insert/Delete: <strong className="text-rose-600 dark:text-rose-400">O(N)</strong></span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-white/80 uppercase block font-bold">Linked List (Pointers):</span>
              <div className="flex justify-between mt-1 text-slate-900 dark:text-white">
                <span>Access: <strong className="text-rose-600 dark:text-rose-400">O(N)</strong></span>
                <span>Insert/Delete: <strong className="text-emerald-600 dark:text-emerald-400">O(1)*</strong></span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-white/80 uppercase block font-bold">Stack (LIFO):</span>
              <div className="flex justify-between mt-1 text-slate-900 dark:text-white">
                <span>Push: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong></span>
                <span>Pop: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong></span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-white/80 uppercase block font-bold">Queue (FIFO):</span>
              <div className="flex justify-between mt-1 text-slate-900 dark:text-white">
                <span>Enqueue: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong></span>
                <span>Dequeue: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
