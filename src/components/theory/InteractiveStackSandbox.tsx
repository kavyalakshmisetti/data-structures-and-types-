import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Eye, RotateCcw, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface InteractiveStackSandboxProps {
  initialItems?: number[];
  capacity?: number;
}

export const InteractiveStackSandbox: React.FC<InteractiveStackSandboxProps> = ({
  initialItems = [10, 20, 30],
  capacity = 5,
}) => {
  const [items, setItems] = useState<number[]>(initialItems);
  const [inputValue, setInputValue] = useState<number>(40);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'success' | 'warning' | 'error' }>({
    text: `Initial stack ready with ${initialItems.length} elements. Try PUSH, POP, or PEEK.`,
    type: 'info',
  });
  const [highlightTop, setHighlightTop] = useState(false);

  const handlePush = () => {
    if (items.length >= capacity) {
      soundEffects.playError();
      setMessage({
        text: `❌ STACK OVERFLOW: Capacity limit (${capacity}) reached! Cannot push ${inputValue}.`,
        type: 'error',
      });
      return;
    }

    soundEffects.playPush();
    const newItems = [...items, inputValue];
    setItems(newItems);
    setMessage({
      text: `✅ PUSH(${inputValue}): Placed at TOP (Index ${newItems.length - 1}). Size is now ${newItems.length}.`,
      type: 'success',
    });
    setInputValue((prev) => prev + 10);
  };

  const handlePop = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setMessage({
        text: `❌ STACK UNDERFLOW: The stack is empty (Size 0)! Cannot pop an element.`,
        type: 'error',
      });
      return;
    }

    soundEffects.playPop();
    const poppedVal = items[items.length - 1];
    const newItems = items.slice(0, -1);
    setItems(newItems);
    setMessage({
      text: `✅ POP() returned ${poppedVal}: Removed from TOP. ${newItems.length > 0 ? `New TOP is ${newItems[newItems.length - 1]}.` : 'Stack is now empty.'}`,
      type: 'warning',
    });
  };

  const handlePeek = () => {
    if (items.length === 0) {
      soundEffects.playError();
      setMessage({
        text: `⚠️ PEEK(): Stack is empty. There is no TOP element to inspect.`,
        type: 'warning',
      });
      return;
    }

    soundEffects.playSuccess();
    setHighlightTop(true);
    setTimeout(() => setHighlightTop(false), 1200);
    const topVal = items[items.length - 1];
    setMessage({
      text: `🔍 PEEK() returned ${topVal}: Read value at TOP (Index ${items.length - 1}). Stack remains unchanged.`,
      type: 'info',
    });
  };

  const handleReset = () => {
    soundEffects.playClick();
    setItems(initialItems);
    setInputValue(40);
    setMessage({
      text: `🔄 Stack reset to initial state.`,
      type: 'info',
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Interactive Stack Sandbox
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Capacity: {capacity} | Size: {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Visual Stack Chamber (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
            TOP of Stack (Open End)
          </span>

          <div className="w-full max-w-[220px] min-h-[220px] rounded-b-2xl border-x-4 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 flex flex-col-reverse gap-2 shadow-inner relative">
            {items.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-3 text-slate-400 font-mono text-xs">
                <span>[ Empty Stack ]</span>
                <span className="text-[10px] text-slate-400 mt-1">TOP = -1</span>
              </div>
            ) : (
              items.map((val, idx) => {
                const isTop = idx === items.length - 1;
                return (
                  <motion.div
                    key={`${val}-${idx}`}
                    initial={{ y: -30, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -30, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    className={`h-10 rounded-xl flex items-center justify-between px-3 text-xs font-mono font-bold shadow-xs transition-all ${
                      isTop
                        ? highlightTop
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 animate-bounce'
                          : 'bg-indigo-600 text-white ring-2 ring-indigo-300 dark:ring-indigo-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] opacity-75">#{idx}</span>
                      <span>{val}</span>
                    </div>
                    {isTop && (
                      <span className="text-[9px] bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        TOP
                      </span>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">
            Stack Base (Closed Bottom)
          </span>
        </div>

        {/* Controls & Feedback (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handlePush}
              className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Push({inputValue})
            </button>
            <button
              onClick={handlePop}
              className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" /> POP()
            </button>
            <button
              onClick={handlePeek}
              className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> PEEK()
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Feedback Message Box */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${
              message.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                : message.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
                : message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {message.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            )}
            <span className="font-mono">{message.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
