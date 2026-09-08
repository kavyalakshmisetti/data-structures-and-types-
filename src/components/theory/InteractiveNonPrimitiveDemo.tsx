import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Boxes,
  Layers,
  FileCode,
  Table,
  CheckCircle2,
  Sparkles,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveNonPrimitiveDemo: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<'homogeneous' | 'heterogeneous'>('homogeneous');
  const [arrayElements, setArrayElements] = useState<number[]>([15, 28, 42, 89, 99]);
  const [structData, setStructData] = useState({
    id: 101,
    grade: 'A',
    gpa: 3.85,
    isEnrolled: true,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Memory Architecture: Homogeneous vs. Heterogeneous
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Compare contiguous uniform array indexing with structured multi-field records in memory.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedStructure('homogeneous');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedStructure === 'homogeneous'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
            }`}
          >
            Homogeneous (Array)
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedStructure('heterogeneous');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedStructure === 'heterogeneous'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
            }`}
          >
            Heterogeneous (Struct/Record)
          </button>
        </div>
      </div>

      {/* Homogeneous Mode */}
      {selectedStructure === 'homogeneous' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-white border border-indigo-200 dark:border-slate-700">
                int scores[5] (4 bytes each)
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-white/70">Contiguous Allocation</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-white leading-relaxed font-medium">
              Every element has the <strong>exact same data type</strong> and memory size. The CPU calculates any element's physical address instantly using the formula:
            </p>

            <div className="p-3 bg-slate-950 text-indigo-300 font-mono text-xs rounded-lg border border-slate-800 shadow-inner">
              <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold">Addressing Math:</span>
              <span className="text-emerald-400 font-bold block mt-0.5">Address(A[i]) = Base_Address + (i × sizeof(int))</span>
              <span className="text-slate-300 text-[11px] block mt-1">Address(A[3]) = 0x1000 + (3 × 4) = 0x100C ➔ Constant O(1) Time</span>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {arrayElements.map((val, idx) => (
                <button
                  key={idx}
                  onClick={() => soundEffects.playClick()}
                  className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-center hover:border-indigo-400 cursor-pointer"
                >
                  <span className="text-[10px] text-slate-400 dark:text-white/70 block">Index [{idx}]</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-white">{val}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-white block">
              Physical RAM Layout (Contiguous Memory Cells)
            </span>

            <div className="space-y-1.5">
              {arrayElements.map((val, idx) => {
                const hexAddr = (0x1000 + idx * 4).toString(16).toUpperCase();
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-500 dark:text-white/70">0x{hexAddr}</span>
                    <span className="font-bold text-slate-800 dark:text-white">A[{idx}] = {val}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-white border border-indigo-200 dark:border-slate-700">
                      4 Bytes
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Heterogeneous Mode */}
      {selectedStructure === 'heterogeneous' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-slate-950 text-purple-700 dark:text-white border border-purple-200 dark:border-slate-700">
                struct Student Record
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-white/70">Mixed Types + Memory Alignment</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-white leading-relaxed font-medium">
              Stores <strong>mixed data types</strong> under a unified composite name. Compilers automatically insert padding bytes for CPU memory alignment.
            </p>

            <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg border border-slate-800 shadow-inner">
              <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold">C / C++ Declaration:</span>
              <pre className="text-[11px] text-purple-300 leading-tight">
{`struct Student {
  int id;          // 4 bytes (offset 0x0)
  char grade;      // 1 byte  (offset 0x4)
  // [3 bytes compiler alignment padding]
  float gpa;       // 4 bytes (offset 0x8)
  bool isEnrolled; // 1 byte  (offset 0xC)
};`}
              </pre>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-white block">
              Memory Offset & Field Mapping (16 Bytes Total)
            </span>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800 flex justify-between items-center text-slate-900 dark:text-white">
                <span>Offset 0x0: <strong>int id</strong></span>
                <span className="font-bold text-indigo-600 dark:text-white">{structData.id} (4 bytes)</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 flex justify-between items-center text-slate-900 dark:text-white">
                <span>Offset 0x4: <strong>char grade</strong></span>
                <span className="font-bold text-amber-600 dark:text-white">'{structData.grade}' (1 byte)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-white/70 flex justify-between items-center text-[10px]">
                <span>[Memory Alignment Padding]</span>
                <span>3 bytes padding</span>
              </div>
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-slate-950 border border-cyan-200 dark:border-slate-800 flex justify-between items-center text-slate-900 dark:text-white">
                <span>Offset 0x8: <strong>float gpa</strong></span>
                <span className="font-bold text-cyan-600 dark:text-white">{structData.gpa} (4 bytes)</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 flex justify-between items-center text-slate-900 dark:text-white">
                <span>Offset 0xC: <strong>bool isEnrolled</strong></span>
                <span className="font-bold text-emerald-600 dark:text-white">{structData.isEnrolled ? 'true' : 'false'} (1 byte)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
