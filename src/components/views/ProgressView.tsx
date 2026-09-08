import React from 'react';
import {
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  RotateCcw,
  BookOpen,
  Layers,
  Zap,
  ShieldAlert,
  FlaskConical,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Binary,
  Network,
  Cpu,
  Check,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';

interface ProgressViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
  onNavigateToModules?: (tab?: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onResetProgress,
  onNavigateToModules,
}) => {
  // Curriculum topics for "Data Structures and Types"
  const theoryTopics = [
    { id: 1, number: '01', title: 'What Are Data Structures?', category: 'Foundations', xp: 35, desc: 'Core definition, Data vs Information, and memory organization.' },
    { id: 2, number: '02', title: 'Classification & Taxonomy', category: 'Taxonomy', xp: 35, desc: 'Primitive vs Non-Primitive, Linear vs Non-Linear taxonomy.' },
    { id: 3, number: '03', title: 'Primitive Data Types', category: 'Primitives', xp: 35, desc: 'Integers, Floats, Chars, Booleans and stack storage.' },
    { id: 4, number: '04', title: 'Non-Primitive Data Types', category: 'Non-Primitives', xp: 35, desc: 'Arrays, Objects, Structures and heap references.' },
    { id: 5, number: '05', title: 'Linear Data Structures', category: 'Linear', xp: 35, desc: 'Arrays, Linked Lists, Stacks, and Queues comparison.' },
    { id: 6, number: '06', title: 'Non-Linear Data Structures', category: 'Hierarchies', xp: 35, desc: 'Trees, Binary Search Trees, and Graph networks.' },
    { id: 7, number: '07', title: 'Common Operations', category: 'Operations', xp: 35, desc: 'Traversal, Insertion, Deletion, Searching, and Sorting.' },
    { id: 8, number: '08', title: 'Algorithmic Trade-Offs', category: 'Complexity', xp: 35, desc: 'Space vs Time complexity and Big-O efficiency trade-offs.' },
  ];

  const totalTheoryChapters = theoryTopics.length; // 8
  const completedTheoryCount = progress.completedTheoryChapters?.length || 0;
  const completedLabsCount = progress.completedLabs?.length || 0;
  const quizCompletedCount = progress.quizCompleted ? 1 : 0;

  // Total topics covered across Data Structures & Types
  const totalTopics = totalTheoryChapters + 2 + 1; // 8 theory + 2 labs + 1 quiz = 11
  const completedTopicsCount = completedTheoryCount + completedLabsCount + quizCompletedCount;
  const overallPercentage = Math.min(100, Math.round((completedTopicsCount / totalTopics) * 100));

  // Mastery Rank calculations based on level
  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return 'L1 Data Cadet';
    if (lvl === 2) return 'L2 Primitive Specialist';
    if (lvl === 3) return 'L3 Linear Architect';
    if (lvl === 4) return 'L4 Structures Scholar';
    return 'L5 DSA Grandmaster';
  };

  const xpInLevel = progress.xp % 250;
  const xpPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / 250) * 100)));
  const xpUntilNext = Math.max(0, 250 - xpInLevel);

  // Achievement Badges tailored specifically to Data Structures and Types
  const topicAchievements = [
    {
      id: 'first_chapter',
      title: 'First Step',
      category: 'Foundations',
      description: 'Complete your first interactive chapter on Data Structures.',
      icon: <BookOpen className="w-5 h-5" />,
      xpReward: 50,
      isUnlocked: completedTheoryCount >= 1 || progress.awardedEventKeys?.some(k => k.includes('chapter_')),
    },
    {
      id: 'taxonomy_master',
      title: 'Taxonomy Master',
      category: 'Taxonomy',
      description: 'Master the classification of Primitive, Non-Primitive, Linear, and Non-Linear structures.',
      icon: <Layers className="w-5 h-5" />,
      xpReward: 75,
      isUnlocked: progress.completedTheoryChapters?.includes(2) || completedTheoryCount >= 2,
    },
    {
      id: 'primitive_pro',
      title: 'Primitive Specialist',
      category: 'Primitives',
      description: 'Master fixed memory allocations, bytes, integers, floats, characters, and booleans.',
      icon: <Binary className="w-5 h-5" />,
      xpReward: 80,
      isUnlocked: progress.completedTheoryChapters?.includes(3) || completedTheoryCount >= 3,
    },
    {
      id: 'linear_architect',
      title: 'Linear Architect',
      category: 'Linear Structures',
      description: 'Master contiguous arrays, linked pointers, FIFO queues, and LIFO stacks.',
      icon: <Cpu className="w-5 h-5" />,
      xpReward: 80,
      isUnlocked: progress.completedTheoryChapters?.includes(5) || completedTheoryCount >= 5,
    },
    {
      id: 'hierarchy_explorer',
      title: 'Hierarchy Explorer',
      category: 'Non-Linear',
      description: 'Master Trees, Binary Search Trees, and Graph network relationships.',
      icon: <Network className="w-5 h-5" />,
      xpReward: 100,
      isUnlocked: progress.completedTheoryChapters?.includes(6) || completedTheoryCount >= 6,
    },
    {
      id: 'ops_analyst',
      title: 'Operations Analyst',
      category: 'Operations',
      description: 'Master Traversal, Insertion, Deletion, Searching, and Sorting complexities.',
      icon: <ShieldAlert className="w-5 h-5" />,
      xpReward: 100,
      isUnlocked: progress.completedTheoryChapters?.includes(7) || completedTheoryCount >= 7,
    },
    {
      id: 'lab_explorer',
      title: 'Visualizer Explorer',
      category: 'Interactive Labs',
      description: 'Experiment with interactive memory allocation and algorithm visualization labs.',
      icon: <FlaskConical className="w-5 h-5" />,
      xpReward: 100,
      isUnlocked: completedLabsCount >= 1,
    },
    {
      id: 'dsa_grandmaster',
      title: 'DSA Grandmaster',
      category: 'Assessment',
      description: 'Score 80% or higher on the Data Structures & Types comprehensive assessment quiz.',
      icon: <Award className="w-5 h-5" />,
      xpReward: 200,
      isUnlocked: progress.quizCompleted || progress.quizHighScore >= 80,
    },
  ];

  // Learning timeline events relevant to Data Structures and Types
  const defaultEvents = [
    {
      title: 'Chapter 01: What Are Data Structures?',
      description: 'Learned Data vs Information, memory layouts, and why structuring data matters for computing.',
      timestamp: 'Foundations Session',
      xpEarned: 35,
    },
    {
      title: 'Taxonomy & Classification System',
      description: 'Explored Primitive vs Non-Primitive, Linear vs Non-Linear, and Static vs Dynamic classifications.',
      timestamp: 'Curriculum Milestone',
      xpEarned: 35,
    },
    {
      title: 'Primitive Types & Memory Blueprint',
      description: 'Mastered fixed-size byte representation, stack allocation, and precision limits.',
      timestamp: 'Memory Lab Analysis',
      xpEarned: 35,
    },
    {
      title: 'Linear vs Hierarchical Trade-Offs',
      description: 'Compared cache locality in arrays versus pointer flexibility in linked structures.',
      timestamp: 'Architecture Briefing',
      xpEarned: 50,
    },
  ];

  const displayHistory = progress.history && progress.history.length > 0 ? progress.history : defaultEvents;

  return (
    <div className="space-y-6 pb-14 max-w-6xl mx-auto">
      {/* ─── 1. MAIN HEADER (First Box with Reset Symbol to the right) ─── */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 uppercase border border-blue-200/60 dark:border-blue-800/60">
              <BookOpen className="w-3.5 h-3.5" />
              CURRICULUM TELEMETRY • DATA STRUCTURES &amp; TYPES
            </span>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Learning Analytics &amp; EXP Telemetry
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-white mt-1 leading-relaxed">
            Track your curriculum progress across Data Structures &amp; Types: theory chapters, interactive visualizer labs, mastery tier, and milestone achievements.
          </p>
        </div>

        {/* Reset Progress Action: Just the symbol in the first box to the right */}
        <div className="flex items-center justify-end shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick();
              onResetProgress();
            }}
            title="Reset Progress"
            aria-label="Reset Progress"
            className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── 2. CORE METRICS GRID (4 CARDS) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1 — OVERALL COMPLETION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-white mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white flex items-center gap-1.5 font-mono">
                OVERALL COMPLETION
              </span>
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {overallPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-white font-mono">
                {completedTopicsCount}/{totalTopics} Covered
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-white mt-1.5">
              Data Structures &amp; Types Curriculum
            </p>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-200/60 dark:border-slate-700">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* CARD 2 — MASTERY LEVEL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-white mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white font-mono">
                MASTERY LEVEL
              </span>
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="space-y-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight block">
                {getRankTitle(progress.level)}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
                Level {progress.level} Active Tier
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-white mt-1.5">
              Primitive, Linear &amp; Hierarchical Mastery
            </p>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-200/60 dark:border-slate-700">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* CARD 3 — TOTAL EXP */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-white mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white font-mono">
                TOTAL EXP
              </span>
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {progress.xp}
              </span>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase font-mono">
                XP
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-white mt-1.5">
              {xpUntilNext} XP until Level {progress.level + 1}
            </p>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-200/60 dark:border-slate-700">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* CARD 4 — DAILY STREAK */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-white mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white font-mono">
                DAILY STREAK
              </span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {progress.streakDays || 1}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-white font-mono">
                days active
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-white mt-1.5">
              Consistent daily practice
            </p>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-200/60 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((progress.streakDays || 1) / 7) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── 3. ACHIEVEMENT BADGES & MILESTONES ─── */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Achievement Badges &amp; Milestones
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-white mt-1">
              Unlock milestone credentials by mastering Data Structures theory chapters, visualizer labs, and knowledge assessments.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shrink-0 self-start sm:self-auto">
            {topicAchievements.filter(a => a.isUnlocked).length} / {topicAchievements.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topicAchievements.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  badge.isUnlocked
                    ? 'bg-gradient-to-br from-white to-blue-50/40 dark:from-slate-800/90 dark:to-blue-950/40 border-blue-200 dark:border-blue-900/60 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 opacity-65'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        badge.isUnlocked
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-white'
                      }`}
                    >
                      {badge.isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">
                    {badge.category}
                  </span>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-white font-medium text-[11px]">XP Reward</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">+{badge.xpReward} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. LEARNING EVENT & TIMELINE ─── */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white font-mono">
              Learning Event Timeline // Data Structures &amp; Types
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-300">
            RECORDED MILESTONES
          </span>
        </div>

        <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {displayHistory.map((event, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  {event.title}
                </span>
                <span className="text-slate-500 dark:text-white block text-[11px] leading-relaxed">
                  {event.description}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-300 mt-1 block font-mono">
                  {event.timestamp}
                </span>
              </div>

              {event.xpEarned > 0 && (
                <span className="shrink-0 text-xs font-bold px-2 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 rounded-lg font-mono">
                  +{event.xpEarned} XP
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
