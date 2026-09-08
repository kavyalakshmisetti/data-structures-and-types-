import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Search,
  ArrowUpDown,
  Plus,
  Minus,
  CheckCircle2,
  Play,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

type Operation = 'traversal' | 'linear_search' | 'binary_search' | 'bubble_sort' | 'insert' | 'delete';

export const InteractiveOperationsVisualizer: React.FC = () => {
  const [selectedOp, setSelectedOp] = useState<Operation>('binary_search');
  const [elements, setElements] = useState<number[]>([12, 24, 37, 45, 59, 68, 83, 91]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [activeStepMessage, setActiveStepMessage] = useState<string>('Select an operation to simulate step-by-step.');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const resetState = () => {
    setElements([12, 24, 37, 45, 59, 68, 83, 91]);
    setHighlightedIndices([]);
    setActiveStepMessage('State reset. Ready.');
    setIsSimulating(false);
  };

  const runTraversal = async () => {
    setIsSimulating(true);
    soundEffects.playClick();
    for (let i = 0; i < elements.length; i++) {
      setHighlightedIndices([i]);
      setActiveStepMessage(`Visiting element at index [${i}] ➔ Value: ${elements[i]} (Operation: Read/Print).`);
      soundEffects.playClick();
      await new Promise((r) => setTimeout(r, 450));
    }
    setHighlightedIndices([]);
    setActiveStepMessage('Traversal complete! Visited all N elements in O(N) linear time.');
    setIsSimulating(false);
    soundEffects.playSuccess();
  };

  const runLinearSearch = async (target: number = 59) => {
    setIsSimulating(true);
    soundEffects.playClick();
    for (let i = 0; i < elements.length; i++) {
      setHighlightedIndices([i]);
      setActiveStepMessage(`Comparing index [${i}] (value: ${elements[i]}) with target (${target})...`);
      soundEffects.playClick();
      await new Promise((r) => setTimeout(r, 500));
      if (elements[i] === target) {
        setActiveStepMessage(`Target ${target} FOUND at index [${i}] after ${i + 1} comparisons!`);
        soundEffects.playSuccess();
        setIsSimulating(false);
        return;
      }
    }
    setActiveStepMessage(`Target ${target} not found after N comparisons (O(N) worst case).`);
    setIsSimulating(false);
  };

  const runBinarySearch = async (target: number = 68) => {
    setIsSimulating(true);
    soundEffects.playClick();
    let low = 0;
    let high = elements.length - 1;
    let step = 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      setHighlightedIndices([mid]);
      setActiveStepMessage(`Step ${step}: Range [${low}..${high}], Mid index [${mid}] = ${elements[mid]}. Comparing with ${target}...`);
      soundEffects.playClick();
      await new Promise((r) => setTimeout(r, 700));

      if (elements[mid] === target) {
        setActiveStepMessage(`FOUND target ${target} at mid index [${mid}] in only ${step} steps! (O(log N) Efficiency)`);
        soundEffects.playSuccess();
        setIsSimulating(false);
        return;
      } else if (elements[mid] < target) {
        low = mid + 1;
        setActiveStepMessage(`${elements[mid]} < ${target}: Discarding left half. Search new range [${low}..${high}].`);
      } else {
        high = mid - 1;
        setActiveStepMessage(`${elements[mid]} > ${target}: Discarding right half. Search new range [${low}..${high}].`);
      }
      step++;
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsSimulating(false);
  };

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Core Operations Simulation Engine
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Visualize the 6 fundamental data structure operations in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {[
            { id: 'binary_search' as const, label: 'Binary Search O(log N)' },
            { id: 'linear_search' as const, label: 'Linear Search O(N)' },
            { id: 'traversal' as const, label: 'Traversal O(N)' },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedOp(op.id);
                resetState();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedOp === op.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Simulation Stage */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
            Array Buffer [N = 8]
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={isSimulating}
              onClick={() => {
                if (selectedOp === 'binary_search') runBinarySearch(68);
                if (selectedOp === 'linear_search') runLinearSearch(59);
                if (selectedOp === 'traversal') runTraversal();
              }}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Simulation
            </button>
            <button
              onClick={resetState}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Array Elements */}
        <div className="flex gap-2 overflow-x-auto p-2 justify-center">
          {elements.map((num, idx) => {
            const isHighlighted = highlightedIndices.includes(idx);
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: isHighlighted ? 1.15 : 1,
                  y: isHighlighted ? -6 : 0,
                }}
                className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-xs border-2 shadow-sm transition-colors ${
                  isHighlighted
                    ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 dark:text-white/70">[{idx}]</span>
                <span className="text-sm font-bold">{num}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Live Step Log */}
        <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg shadow-inner flex items-center gap-2 border border-slate-800">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{activeStepMessage}</span>
        </div>
      </div>

      {/* 6 Operations Complexity Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
        {[
          { name: '1. Traversal', time: 'O(N)', note: 'Visit every element' },
          { name: '2. Insertion', time: 'O(1) / O(N)', note: 'Head vs Middle shift' },
          { name: '3. Deletion', time: 'O(1) / O(N)', note: 'Pointer vs Array shift' },
          { name: '4. Search', time: 'O(log N) / O(N)', note: 'Binary vs Linear' },
          { name: '5. Sorting', time: 'O(N log N)', note: 'Merge / Quick / Heap' },
          { name: '6. Update/Access', time: 'O(1) / O(N)', note: 'Index vs Traversal' },
        ].map((item, idx) => (
          <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-white block truncate">{item.name}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold block my-0.5">{item.time}</span>
            <span className="text-[10px] text-slate-500 dark:text-white/80 block leading-tight">{item.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
