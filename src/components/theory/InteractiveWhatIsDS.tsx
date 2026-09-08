import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Cpu,
  Sparkles,
  ArrowRight,
  BookOpen,
  FolderTree,
  Search,
  Zap,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveWhatIsDS: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'data' | 'information' | 'structure'>('data');
  const [activeAnalogy, setActiveAnalogy] = useState<number>(0);

  const stages = [
    {
      id: 'data' as const,
      label: '1. Raw Data',
      badge: 'Unorganized Facts',
      color: 'from-blue-500 to-cyan-600',
      description: 'Raw, unprocessed facts, numbers, or symbols without context.',
      example: '[102, 98.6, "John", true, 404, 3.14]',
      memoryView: ['0x100: 01100110', '0x104: 01000010', '0x108: 01001010'],
      takeaway: 'Without organization, searching requires inspecting every random byte sequentially (O(N)).',
    },
    {
      id: 'information' as const,
      label: '2. Information',
      badge: 'Contextualized Data',
      color: 'from-purple-500 to-indigo-600',
      description: 'Data processed and given meaning (e.g. Patient ID: 102, Temp: 98.6°F, Name: John).',
      example: '{ patientId: 102, temp: 98.6, name: "John", isAdmitted: true }',
      memoryView: ['Field: patientId = 102', 'Field: temp = 98.6°F', 'Field: name = "John"'],
      takeaway: 'Meaning is established, but we still need an efficient way to store thousands of patient records.',
    },
    {
      id: 'structure' as const,
      label: '3. Data Structure',
      badge: 'Optimized Architecture',
      color: 'from-emerald-500 to-teal-600',
      description: 'A mathematical and logical layout enabling O(1) or O(log N) operations (e.g., Hash Map, BST, Array).',
      example: 'HashTable<PatientID, Record> → Instant O(1) patient lookup by ID',
      memoryView: ['Bucket[102] ➔ Pointer to Patient Record in Heap', 'O(1) Direct Memory Indexing'],
      takeaway: 'Data structures turn disorganized data into lightning-fast, scalable software architectures.',
    },
  ];

  const analogies = [
    {
      title: 'The Library Index vs. Pile of Books',
      icon: BookOpen,
      withoutDS: 'Pile on the floor: To find "Data Structures", you must examine all 10,000 books one-by-one.',
      withDS: 'Dewey Decimal Catalog (Tree/B-Tree): Jump directly to Section 005 (Computer Science) in O(log N) time.',
    },
    {
      title: 'Dictionary Alphabetical Index',
      icon: Search,
      withoutDS: 'Random words scattered across pages: You have to read the entire dictionary from page 1.',
      withDS: 'Sorted alphabetically: Binary search by dividing the dictionary in half on every word comparison.',
    },
    {
      title: 'Warehouse Automated Storage',
      icon: FolderTree,
      withoutDS: 'Boxes tossed randomly in an empty hangar: Forklifts search everywhere.',
      withDS: 'Coordinate Aisle Grid (2D Matrix / Hash Index): Direct route to Row 14, Shelf B in constant time.',
    },
  ];

  const currentStageData = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Stage Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Evolution: Data ➔ Information ➔ Data Structure
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Click each stage to see how raw bytes transform into structured architectures.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveStage(stage.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeStage === stage.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Display Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {/* Left: Concept Explanation */}
          <div className="md:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-white border border-indigo-200 dark:border-slate-700">
                {currentStageData.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-white/70">Live Stage</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-white leading-relaxed font-medium">
              {currentStageData.description}
            </p>

            <div className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
              <span className="text-slate-400 dark:text-slate-300 block text-[10px] uppercase font-bold mb-1">Runtime Representation:</span>
              <code>{currentStageData.example}</code>
            </div>

            <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-white bg-indigo-50/70 dark:bg-slate-950 p-2.5 rounded-lg border border-indigo-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
              <span>{currentStageData.takeaway}</span>
            </div>
          </div>

          {/* Right: RAM / Memory Layout Simulator */}
          <div className="md:col-span-6 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-white/80">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-white">
                <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Physical Memory Architecture
              </span>
              <span className="text-slate-500 dark:text-white/70">RAM Bus 64-bit</span>
            </div>

            <div className="space-y-1.5">
              {currentStageData.memoryView.map((line, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs flex items-center justify-between text-slate-800 dark:text-white"
                >
                  <span>{line}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-white border border-slate-300 dark:border-slate-700">
                    Slot {idx}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-emerald-50 dark:bg-slate-950 rounded-lg border border-emerald-200 dark:border-slate-800 text-[11px] text-emerald-800 dark:text-white font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{activeStage === 'structure' ? 'High algorithmic efficiency: Predictable addressing enabled.' : 'Linear scan needed to find specific values.'}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Real-World Analogy Switcher */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-white">
            Real-World Architectural Analogies
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-white/90 font-semibold">
            Select to compare
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {analogies.map((an, idx) => {
            const Icon = an.icon;
            const isSelected = activeAnalogy === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveAnalogy(idx);
                }}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-slate-950 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-white ring-2 ring-indigo-200 dark:ring-indigo-900'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:border-indigo-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-xs font-bold truncate text-slate-900 dark:text-white">{an.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Analogy Comparison */}
        <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-rose-50 dark:bg-slate-950 rounded-lg border border-rose-200 dark:border-slate-800 text-rose-950 dark:text-white">
            <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">❌ Without Data Structure (O(N) Disarray)</span>
            <p className="leading-relaxed">{analogies[activeAnalogy].withoutDS}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-slate-950 rounded-lg border border-emerald-200 dark:border-slate-800 text-emerald-950 dark:text-white">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">✓ With Proper Data Structure (O(1) / O(log N))</span>
            <p className="leading-relaxed">{analogies[activeAnalogy].withDS}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
