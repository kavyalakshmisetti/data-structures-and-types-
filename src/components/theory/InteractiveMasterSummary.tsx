import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Award, BookOpen, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveMasterSummary: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const quiz = [
    {
      q: 'Which principle governs the order of insertion and removal in a Stack?',
      options: ['FIFO (First In, First Out)', 'LIFO (Last In, First Out)', 'Random Access', 'Priority Ordering'],
      correct: 1,
      explanation: 'Stacks operate strictly on the LIFO principle: the most recent element added is always popped first.',
    },
    {
      q: 'What is the time complexity of PUSH, POP, and PEEK in a standard stack?',
      options: ['O(n)', 'O(log n)', 'O(1) Constant Time', 'O(n²)'],
      correct: 2,
      explanation: 'All primary operations work directly on the TOP pointer, executing in deterministic O(1) time.',
    },
    {
      q: 'What occurs when PUSH is called on a stack whose size equals its maximum capacity?',
      options: ['Stack Underflow', 'Segmentation Fault', 'Stack Overflow', 'Silent No-Op'],
      correct: 2,
      explanation: 'Pushing to an already full fixed-capacity stack triggers a Stack Overflow error.',
    },
    {
      q: 'In a 0-indexed array stack, if TOP = 3, what is the current Size of the stack?',
      options: ['3', '4', '2', '5'],
      correct: 1,
      explanation: 'Size = TOP + 1. If TOP is index 3, the stack contains exactly 4 elements (indices 0, 1, 2, 3).',
    },
  ];

  const handleSelect = (qIdx: number, oIdx: number) => {
    soundEffects.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleCheck = () => {
    soundEffects.playSuccess();
    setShowResults(true);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => quiz[Number(qIdx)].correct === optIdx
  ).length;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Master Quick Reference Cheat Sheet
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Consolidated formula reference and mastery checkpoint.
        </p>
      </div>

      {/* Cheat Sheet High-Contrast Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Rules Box */}
        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Core Mathematical Rules</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">LIFO Axiom:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Last In, First Out</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Size Formula:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Size = TOP + 1</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Empty State:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">TOP == -1 (or NULL)</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Full State:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">TOP == Capacity - 1</span>
            </div>
          </div>
        </div>

        {/* Array vs List Matrix */}
        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-600 dark:text-purple-400 uppercase">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>Implementation Trade-Offs</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Array Stack:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Contiguous RAM • Fixed Cap</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Linked List Stack:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Dynamic Heap • Pointer Over</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Primary Time:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">O(1) Constant Time</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex justify-between">
              <span className="text-slate-500">Display Traversal:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">O(n) Linear Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Knowledge Check */}
      <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase">
              Quick Concept Mastery Checkpoint
            </span>
          </div>
          {showResults && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Score: {score} / {quiz.length} Correct
            </span>
          )}
        </div>

        <div className="space-y-4">
          {quiz.map((item, qIdx) => (
            <div key={qIdx} className="space-y-2 text-xs font-mono">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {qIdx + 1}. {item.q}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[qIdx] === optIdx;
                  const isCorrect = item.correct === optIdx;
                  let btnClass = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300';

                  if (showResults) {
                    if (isCorrect) {
                      btnClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnClass = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    btnClass = 'bg-indigo-600 text-white border-indigo-700 shadow-xs font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={showResults}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showResults && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-1">
                  💡 <strong>Explanation:</strong> {item.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          {!showResults ? (
            <button
              onClick={handleCheck}
              disabled={Object.keys(selectedAnswers).length < quiz.length}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs cursor-pointer"
            >
              Verify Answers
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Checkpoint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
