import React, { useEffect } from 'react';
import {
  ArrowRight,
  Lightbulb,
  BookOpen,
  Star,
  Rocket,
  Target,
  Sigma,
  Puzzle,
  Plus,
  Minus,
  Eye,
  List,
  Layers,
  Network,
  Cpu,
  Binary,
  GitBranch,
  Database,
  Clock,
  Zap,
  FolderGit2,
  Globe,
  Check,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';

interface HomeDashboardProps {
  progress: UserProgress;
  onSelectTab: (tab: TabType) => void;
  onSelectGameLevel?: (levelId: number) => void;
  onUpdateProgress?: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  onSelectTab,
  onUpdateProgress,
}) => {
  const completedSections = progress.completedOverviewSections || [];

  const toggleSection = (secId: number) => {
    soundEffects.playClick();
    if (!onUpdateProgress) return;
    onUpdateProgress((prev) => {
      const current = prev.completedOverviewSections || [];
      const updated = current.includes(secId)
        ? current.filter((id) => id !== secId)
        : [...current, secId];
      return {
        ...prev,
        completedOverviewSections: updated,
      };
    });
  };

  useEffect(() => {
    if (!onUpdateProgress) return;
    const sectionIds = [1, 2, 3, 4];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const secNum = parseInt(entry.target.getAttribute('data-section-id') || '0', 10);
            if (secNum && !completedSections.includes(secNum)) {
              onUpdateProgress((prev) => {
                const current = prev.completedOverviewSections || [];
                if (current.includes(secNum)) return prev;
                return {
                  ...prev,
                  completedOverviewSections: [...current, secNum],
                };
              });
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(`overview-sec-${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [completedSections, onUpdateProgress]);

  const handleStartLearning = () => {
    soundEffects.playClick();
    if (onUpdateProgress) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedOverviewSections: [1, 2, 3, 4],
      }));
    }
    onSelectTab('theory');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* ─── HERO CARD: DATA STRUCTURES & TYPES ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 uppercase border border-indigo-100 dark:border-indigo-900/50">
                <BookOpen className="w-3.5 h-3.5" />
                THEORY CURRICULUM • FOUNDATIONS • 8 CHAPTERS
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              Data Structures &amp; <br className="hidden sm:inline" />
              Types
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              Master how computer memory is organized: explore primitive types, contiguous linear structures, hierarchical trees, and the algorithmic trade-offs that power modern software.
            </p>
          </div>

          {/* Right Column: Graphic Animation of Data Organization */}
          <div className="lg:col-span-5 flex items-center justify-center gap-4 sm:gap-6 py-2">
            {/* Center Data Hierarchy Icon */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <Network className="w-10 h-10 stroke-[2.2]" />
            </div>

            {/* Connecting Pointer Curves (SVG) */}
            <div className="hidden sm:flex flex-col justify-center text-indigo-400 dark:text-indigo-500 shrink-0">
              <svg width="42" height="110" viewBox="0 0 42 110" fill="none" className="stroke-indigo-400 dark:stroke-indigo-500">
                <path d="M 0 55 C 20 55, 20 15, 38 15" strokeDasharray="3 3" strokeWidth="2" fill="none" />
                <path d="M 38 15 L 34 11 M 38 15 L 34 19" strokeWidth="2" />
                
                <path d="M 0 55 L 38 55" strokeDasharray="3 3" strokeWidth="2" fill="none" />
                <path d="M 38 55 L 34 51 M 38 55 L 34 59" strokeWidth="2" />

                <path d="M 0 55 C 20 55, 20 95, 38 95" strokeDasharray="3 3" strokeWidth="2" fill="none" />
                <path d="M 38 95 L 34 91 M 38 95 L 34 99" strokeWidth="2" />
              </svg>
            </div>

            {/* Memory Cell Representation Box */}
            <div className="flex flex-col items-center shrink-0">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-wider flex flex-col items-center mb-1">
                <span>RAM</span>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black -mt-1">↓</span>
              </div>

              <div className="w-24 sm:w-28 rounded-xl border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                <div className="py-2 text-center text-xs font-mono font-bold text-slate-900 dark:text-slate-100 border-b-2 border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30">
                  Primitive
                </div>
                <div className="py-2 text-center text-xs font-mono font-bold text-slate-900 dark:text-slate-100 border-b-2 border-indigo-100 dark:border-indigo-900/60">
                  Linear
                </div>
                <div className="py-2 text-center text-xs font-mono font-bold text-slate-900 dark:text-slate-100 border-b-2 border-indigo-100 dark:border-indigo-900/60">
                  Tree
                </div>
                <div className="py-2 text-center text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                  Graph
                </div>
              </div>

              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-wider mt-1.5">
                ORGANIZATION
              </div>
            </div>
          </div>
        </div>

        {/* 3 Quick Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80">
          {/* Card 1: Core Idea */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Target className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Core Idea</h4>
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <span className="font-bold">Structure</span> = Layout + Operations.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Optimizes RAM utilization</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Enables fast <strong className="text-slate-800 dark:text-slate-200 font-semibold">Search</strong> &amp; <strong className="text-slate-800 dark:text-slate-200 font-semibold">Insert</strong></span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Provides mathematical abstraction</span>
              </div>
            </div>
          </div>

          {/* Card 2: Key Formula */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sigma className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Key Formula</h4>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="font-bold">Address</span> = Base + (Index * Size)
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Array Index</strong> → O(1) random access</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Pointer Link</strong> → O(1) dynamic insert</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong className="text-slate-800 dark:text-slate-200 font-semibold">Tree BST</strong> → O(log N) sorted lookup</span>
              </div>
            </div>
          </div>

          {/* Card 3: Main Challenge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Puzzle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Main Challenge</h4>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Selecting the right structure for the job.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>Speed vs Memory overhead trade-offs</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Static arrays vs Dynamic lists</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Linear sequences vs Non-linear graphs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 1. THE MAIN IDEA ─── */}
      <div id="overview-sec-1" data-section-id="1" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Lightbulb className="w-4 h-4 stroke-[2.4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              1. The Main Idea
            </h2>
          </div>

          <button
            onClick={() => toggleSection(1)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
              completedSections.includes(1)
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={completedSections.includes(1) ? 'Click to mark unread' : 'Click to mark read'}
          >
            {completedSections.includes(1) ? (
              <>
                <Check className="w-3 h-3" />
                <span>Read</span>
              </>
            ) : (
              <span>Mark read</span>
            )}
          </button>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 leading-snug">
              Why do we need Data Structures?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              A computer stores raw bits. Data structures give those bits mathematical meaning and govern how data flows through algorithms efficiently.
            </p>
          </div>

          {/* Right Pipeline Visual Container */}
          <div className="lg:col-span-8 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto custom-scrollbar py-1">
              {/* Step 1: Bits */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs mb-2">
                  <Binary className="w-5 h-5 stroke-[2.5]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Raw Bits</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">0s and 1s in hardware</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500 shrink-0 -mt-6" />

              {/* Step 2: Primitives */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs mb-2">
                  <Cpu className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Primitives</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">int, float, char, pointer</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500 shrink-0 -mt-6" />

              {/* Step 3: Linear */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs mb-2">
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Linear</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Arrays, Lists, Stacks</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500 shrink-0 -mt-6" />

              {/* Step 4: Non-Linear */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs mb-2">
                  <GitBranch className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Non-Linear</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Trees, Graphs, Heaps</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500 shrink-0 -mt-6" />

              {/* Step 5: Trade-offs */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs mb-2">
                  <List className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Trade-offs</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Optimal Time &amp; Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. CONCEPT ROADMAP ─── */}
      <div id="overview-sec-2" data-section-id="2" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center justify-between gap-3 mb-8 sm:mb-10 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <BookOpen className="w-4 h-4 stroke-[2.4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              2. Concept Roadmap
            </h2>
          </div>

          <button
            onClick={() => toggleSection(2)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
              completedSections.includes(2)
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={completedSections.includes(2) ? 'Click to mark unread' : 'Click to mark read'}
          >
            {completedSections.includes(2) ? (
              <>
                <Check className="w-3 h-3" />
                <span>Read</span>
              </>
            ) : (
              <span>Mark read</span>
            )}
          </button>
        </div>

        {/* 5-Node Timeline with Dotted Connecting Line */}
        <div className="relative px-2 sm:px-4">
          {/* Dotted Line */}
          <div className="hidden sm:block absolute top-[13px] left-[9%] right-[9%] h-[2px] border-t-2 border-dashed border-indigo-200 dark:border-indigo-800/80 z-0" />

          {/* 5 Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-3 relative z-10">
            {/* Step 01: What is a Data Structure? */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                01
              </span>
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100 dark:border-slate-800 mb-2">
                <Network className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                What is <br /> a Data Structure?
              </strong>
            </div>

            {/* Step 02: Classification */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                02
              </span>
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100 dark:border-slate-800 mb-2">
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Taxonomy &amp; <br /> Classification
              </strong>
            </div>

            {/* Step 03: Primitives vs Composites */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                03
              </span>
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100 dark:border-slate-800 mb-2">
                <Cpu className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Primitive vs <br /> Non-Primitive
              </strong>
            </div>

            {/* Step 04: Linear & Non-Linear */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                04
              </span>
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100 dark:border-slate-800 mb-2">
                <GitBranch className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Linear vs <br /> Non-Linear
              </strong>
            </div>

            {/* Step 05: Complexity & Trade-offs */}
            <div className="flex flex-col items-center text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 mb-3 border border-indigo-200/60 dark:border-indigo-800">
                05
              </span>
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100 dark:border-slate-800 mb-2">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Operations &amp; <br /> Trade-offs
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. WHY THIS TOPIC MATTERS ─── */}
      <div id="overview-sec-3" data-section-id="3" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Star className="w-4 h-4 stroke-[2.4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              3. Why This Topic Matters
            </h2>
          </div>

          <button
            onClick={() => toggleSection(3)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
              completedSections.includes(3)
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={completedSections.includes(3) ? 'Click to mark unread' : 'Click to mark read'}
          >
            {completedSections.includes(3) ? (
              <>
                <Check className="w-3 h-3" />
                <span>Read</span>
              </>
            ) : (
              <span>Mark read</span>
            )}
          </button>
        </div>

        {/* 3 Color-Coded Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Algorithmic Efficiency (Purple/Indigo) */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Algorithmic Efficiency
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Choosing the right data structure reduces time complexity from O(N) to O(1) or O(log N).
            </p>
          </div>

          {/* Card 2: System Architecture (Green/Emerald) */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-xs">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              System Architecture
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Structures power databases (B+ Trees), compilers (ASTs), network routing (Graphs), and caches (Hash/LRU).
            </p>
          </div>

          {/* Card 3: Memory Optimization (Blue/Sky) */}
          <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center mb-4 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Memory Optimization
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Understand contiguous cache locality versus dynamic heap pointer allocations.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. READY TO START? ─── */}
      <div id="overview-sec-4" data-section-id="4" className="rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100/90 dark:border-indigo-900/50 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Graphic & Text */}
        <div className="flex items-center gap-5 sm:gap-6 text-center sm:text-left">
          {/* Rocket Icon Container */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Rocket className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                4. Ready to Start?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md">
              Begin your journey by exploring the foundational classifications, primitive vs non-primitive types, and core operations.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartLearning}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 shrink-0"
        >
          <span>Start Learning</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
