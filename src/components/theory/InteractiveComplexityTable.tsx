import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, HardDrive, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveComplexityTable: React.FC = () => {
  const [selectedOp, setSelectedOp] = useState<string>('push');

  const operations = [
    {
      id: 'push',
      name: 'PUSH(x)',
      time: 'O(1)',
      space: 'O(1) aux',
      type: 'Constant Time',
      explanation: 'Adds directly at TOP. Requires only 1 pointer increment and 1 memory write.',
      whyFast: 'Direct memory index write or 1 pointer assignment. No loops.',
    },
    {
      id: 'pop',
      name: 'POP()',
      time: 'O(1)',
      space: 'O(1) aux',
      type: 'Constant Time',
      explanation: 'Removes directly from TOP. Requires only 1 pointer decrement and 1 memory read.',
      whyFast: 'Never shifts remaining elements. Zero iteration.',
    },
    {
      id: 'peek',
      name: 'PEEK()',
      time: 'O(1)',
      space: 'O(1) aux',
      type: 'Constant Time',
      explanation: 'Inspects element at TOP without modifying the container.',
      whyFast: 'Direct access to index `top` or `head->data`. 1 step.',
    },
    {
      id: 'isEmpty',
      name: 'isEmpty()',
      time: 'O(1)',
      space: 'O(1) aux',
      type: 'Constant Time',
      explanation: 'Checks boolean predicate `top == -1` or `head == NULL`.',
      whyFast: 'Single CPU conditional comparison.',
    },
    {
      id: 'isFull',
      name: 'isFull()',
      time: 'O(1)',
      space: 'O(1) aux',
      type: 'Constant Time',
      explanation: 'Checks boolean predicate `top == capacity - 1`.',
      whyFast: 'Single arithmetic subtraction and comparison.',
    },
    {
      id: 'display',
      name: 'DISPLAY()',
      time: 'O(n)',
      space: 'O(1) aux',
      type: 'Linear Time',
      explanation: 'Traverses through all n elements from TOP down to BOTTOM.',
      whyFast: 'Must visit every single element in sequence to print or inspect all items.',
    },
  ];

  const current = operations.find((op) => op.id === selectedOp) || operations[0];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Stack Time & Space Complexity Matrix
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any operation below to see exactly why it achieves deterministic O(1) or O(n) performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-mono font-bold">
            Total Space: O(n)
          </span>
        </div>
      </div>

      {/* Visual Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="py-2.5 px-3">Operation</th>
              <th className="py-2.5 px-3">Time Complexity</th>
              <th className="py-2.5 px-3">Space Complexity</th>
              <th className="py-2.5 px-3">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {operations.map((op) => {
              const isSelected = op.id === selectedOp;
              return (
                <tr
                  key={op.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedOp(op.id);
                  }}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {op.name}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        op.time === 'O(1)'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {op.time}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {op.space}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {op.type}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Operation Detail Box */}
      <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">
              {current.name} Breakdown
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Time: {current.time}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {current.explanation}
        </p>
        <div className="text-[11px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <strong>Why is it this fast?</strong> {current.whyFast}
        </div>
      </div>
    </div>
  );
};
