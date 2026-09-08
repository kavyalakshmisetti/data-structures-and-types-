import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Binary,
  Hash,
  Type,
  ToggleLeft,
  KeyRound,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractivePrimitiveDemo: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'int' | 'float' | 'char' | 'bool' | 'pointer'>('int');
  const [numericValue, setNumericValue] = useState<number>(42);
  const [charValue, setCharValue] = useState<string>('A');
  const [boolValue, setBoolValue] = useState<boolean>(true);

  // Calculate binary representation
  const getBinaryString = (val: number, bits: number = 8): string => {
    const raw = (val >>> 0).toString(2);
    return raw.padStart(bits, '0').slice(-bits);
  };

  const primitives = {
    int: {
      name: 'Integer (int)',
      sizeBytes: 4,
      bits: 32,
      range: '-2,147,483,648 to 2,147,483,647 (Signed 32-bit)',
      encoding: "Two's Complement Binary Representation",
      aluOperations: ['ADD', 'SUB', 'MUL', 'DIV', 'BITWISE AND/OR/XOR', 'SHIFTS'],
      hardwareBenefit: 'Directly mapped to CPU 32-bit / 64-bit General Purpose Registers (EAX/RAX). Instant single-cycle execution.',
      icon: Hash,
      color: 'indigo',
    },
    float: {
      name: 'Floating Point (float / double)',
      sizeBytes: 4,
      bits: 32,
      range: '±1.18×10⁻³⁸ to ±3.4×10³⁸ (IEEE 754 Standard: Sign, Exponent, Mantissa)',
      encoding: '1 Sign Bit | 8 Exponent Bits | 23 Mantissa/Fraction Bits',
      aluOperations: ['FADD', 'FSUB', 'FMUL', 'FDIV', 'SQRT via FPU / SIMD SSE/AVX'],
      hardwareBenefit: 'Processed directly by Dedicated FPU (Floating Point Unit) and SIMD vector registers (XMM/YMM).',
      icon: Binary,
      color: 'cyan',
    },
    char: {
      name: 'Character (char)',
      sizeBytes: 1,
      bits: 8,
      range: '0 to 255 (ASCII / UTF-8 code point unit)',
      encoding: `ASCII Decimal Value: ${charValue.charCodeAt(0) || 65} = 0b${getBinaryString(charValue.charCodeAt(0) || 65, 8)}`,
      aluOperations: ['BYTE LOAD', 'BYTE STORE', 'CMP (Lexicographical Comparison)'],
      hardwareBenefit: 'Stored as 1-byte raw numerical ASCII index. Instant character translation in hardware.',
      icon: Type,
      color: 'amber',
    },
    bool: {
      name: 'Boolean (bool)',
      sizeBytes: 1,
      bits: 8,
      range: 'true (1) or false (0)',
      encoding: boolValue ? '0x01 (00000001)' : '0x00 (00000000)',
      aluOperations: ['TEST', 'CMP', 'CONDITIONAL JUMP (JZ/JNZ)', 'BITWISE LOGIC'],
      hardwareBenefit: 'Logically 1 bit; physically allocated as 1 byte for byte-addressable CPU memory bus alignment.',
      icon: ToggleLeft,
      color: 'emerald',
    },
    pointer: {
      name: 'Pointer / Memory Address (uintptr_t)',
      sizeBytes: 8,
      bits: 64,
      range: '0x0000000000000000 to 0xFFFFFFFFFFFFFFFF (64-bit Virtual Address Space)',
      encoding: 'Raw 64-bit physical/virtual memory cell address in RAM',
      aluOperations: ['POINTER DEREFERENCE (*p)', 'POINTER ARITHMETIC (p + i * sizeof(T))', 'LEA (Load Effective Address)'],
      hardwareBenefit: 'Feeds Memory Management Unit (MMU) address lines directly for hardware paging and instant dereference.',
      icon: KeyRound,
      color: 'rose',
    },
  };

  const current = primitives[selectedType];
  const Icon = current.icon;

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Title and selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Hardware & Memory Inspector: Primitive Types
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Explore how the CPU registers, ALUs, and memory buses handle primitive types.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {(['int', 'float', 'char', 'bool', 'pointer'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                soundEffects.playClick();
                setSelectedType(t);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Live Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Live Value Controller & Bit Inspector */}
        <div className="md:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-slate-700">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">{current.name}</h5>
                <span className="text-[10px] font-mono text-slate-500 dark:text-white/70">{current.sizeBytes} Bytes ({current.bits} bits)</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800">
              RAM Bus: 0x7FFE_4A90
            </span>
          </div>

          {/* Interactive controls based on type */}
          {selectedType === 'int' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-white block">
                Adjust Integer Value: <span className="font-mono text-indigo-600 dark:text-indigo-400">{numericValue}</span>
              </label>
              <input
                type="range"
                min="-128"
                max="127"
                value={numericValue}
                onChange={(e) => setNumericValue(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-xs shadow-inner border border-slate-800">
                <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold mb-1">Binary Memory Word (Byte):</span>
                <span className="text-sm font-bold tracking-widest">{getBinaryString(numericValue, 8)}</span>
                <span className="text-slate-400 dark:text-slate-300 block text-[10px] mt-1">Hexadecimal: 0x{((numericValue >>> 0) & 0xff).toString(16).toUpperCase().padStart(2, '0')}</span>
              </div>
            </div>
          )}

          {selectedType === 'char' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-white block">
                Enter Character: <span className="font-mono text-amber-600 dark:text-amber-400">'{charValue}'</span>
              </label>
              <input
                type="text"
                maxLength={1}
                value={charValue}
                onChange={(e) => setCharValue(e.target.value || 'A')}
                className="w-20 px-3 py-1.5 text-center font-mono font-bold text-lg rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <div className="p-3 bg-slate-950 text-amber-400 rounded-lg font-mono text-xs shadow-inner border border-slate-800">
                <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold mb-1">ASCII Character Encoding:</span>
                <span>ASCII Code: {charValue.charCodeAt(0) || 65} (0x{(charValue.charCodeAt(0) || 65).toString(16).toUpperCase()})</span>
                <span className="block mt-1 font-bold tracking-widest">Binary: {getBinaryString(charValue.charCodeAt(0) || 65, 8)}</span>
              </div>
            </div>
          )}

          {selectedType === 'bool' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-white block">
                Toggle Logical Boolean State:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setBoolValue(true);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    boolValue ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  true (1)
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setBoolValue(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    !boolValue ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  false (0)
                </button>
              </div>
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-xs shadow-inner border border-slate-800">
                <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold mb-1">Hardware Register Byte:</span>
                <span>Byte Value: {boolValue ? '0x01 (TRUE)' : '0x00 (FALSE)'}</span>
                <span className="block mt-1 font-bold tracking-widest">Memory: {boolValue ? '00000001' : '00000000'}</span>
              </div>
            </div>
          )}

          {selectedType === 'float' && (
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 text-cyan-400 rounded-lg font-mono text-xs shadow-inner space-y-1 border border-slate-800">
                <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold">IEEE 754 Single Precision Format:</span>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-center my-1">
                  <div className="bg-rose-950/80 text-rose-300 p-1 rounded border border-rose-800">Sign (1 bit)</div>
                  <div className="bg-amber-950/80 text-amber-300 p-1 rounded border border-amber-800">Exponent (8 bits)</div>
                  <div className="bg-cyan-950/80 text-cyan-300 p-1 rounded border border-cyan-800">Mantissa (23 bits)</div>
                </div>
                <span className="text-slate-300 text-[11px] block">Calculated Value = (-1)^S × (1 + Mantissa) × 2^(Exponent - 127)</span>
              </div>
            </div>
          )}

          {selectedType === 'pointer' && (
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 text-rose-400 rounded-lg font-mono text-xs shadow-inner space-y-1 border border-slate-800">
                <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold">64-bit Direct Memory Address:</span>
                <span className="text-sm font-bold tracking-wider text-rose-300 block">0x00007FFF5FBFF840</span>
                <span className="text-slate-300 text-[11px] block mt-1">Directly loaded into 64-bit Address Registers (RBX/RSI/RDI) for MMU lookup.</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: CPU ALU & Hardware Specification */}
        <div className="md:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
              Hardware Architecture Specs
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-slate-950 text-emerald-700 dark:text-white border border-emerald-200 dark:border-slate-700">
              Native Hardware Primitive
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-white/80 uppercase block mb-0.5">Value Range:</span>
              <span className="font-mono text-slate-800 dark:text-white font-medium">{current.range}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-white/80 uppercase block mb-1">Native CPU ALU Instructions:</span>
              <div className="flex flex-wrap gap-1">
                {current.aluOperations.map((op, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-white border border-indigo-200 dark:border-slate-700 font-bold"
                  >
                    {op}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800 text-indigo-900 dark:text-white text-[11px] leading-relaxed">
              <span className="font-bold block mb-0.5 text-indigo-600 dark:text-white">⚡ Execution Speed:</span>
              {current.hardwareBenefit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
