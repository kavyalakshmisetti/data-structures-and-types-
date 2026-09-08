import React from 'react';
import { Gamepad2, Sparkles, RotateCcw, RefreshCw, LayoutGrid, ArrowLeft } from 'lucide-react';
import { GameLevelConfig, UserProgress } from '../../types';

interface GameHeaderProps {
  currentLevel: GameLevelConfig;
  allLevels: GameLevelConfig[];
  currentChallengeIndex: number;
  totalChallenges: number;
  progress: UserProgress;
  mistakes: number;
  maxMistakes?: number;
  isLabActive?: boolean;
  onOpenLab?: () => void;
  onSelectLevel: (levelId: number) => void;
  onResetChallenge: () => void;
  onResetGame?: () => void;
  onBackToHub?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentLevel,
  allLevels,
  currentChallengeIndex,
  totalChallenges,
  progress,
  mistakes,
  maxMistakes = 3,
  isLabActive = false,
  onOpenLab,
  onSelectLevel,
  onResetChallenge,
  onResetGame,
  onBackToHub,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Sleek Top Game Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back to Hub & Level Switcher */}
        <div className="flex items-center gap-2">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              title="Return to Game Hub"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Game Hub</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Gamepad2 className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={isLabActive ? 'lab' : currentLevel.id}
              onChange={(e) => {
                if (e.target.value === 'lab') {
                  onOpenLab?.();
                } else {
                  onSelectLevel(Number(e.target.value));
                }
              }}
              className="font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-hidden cursor-pointer"
            >
              <optgroup label="Challenge Arenas">
                {allLevels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    Level {lvl.levelNumber || lvl.id}: {lvl.title.split(':')[1]?.trim() || lvl.title} {progress.completedGameLevels.includes(lvl.id) ? '✓' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Freeform Sandbox">
                <option value="lab">🧪 In-Game Experiment Lab</option>
              </optgroup>
            </select>
          </div>

          {/* In-Game Lab Fast Toggle Button */}
          {onOpenLab && (
            <button
              onClick={onOpenLab}
              title="Open In-Game Experiment Lab"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isLabActive
                  ? 'bg-violet-600 text-white border-violet-500 shadow-violet-500/20'
                  : 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
              }`}
            >
              <span>🧪 Lab Mode</span>
            </button>
          )}
        </div>

        {/* Center: Challenge Progress Segment */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Round
          </span>
          <div className="flex items-center gap-1 font-mono font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
            {currentChallengeIndex + 1} / {totalChallenges}
          </div>
        </div>

        {/* Right: Mistakes, XP & Reset Controls */}
        <div className="flex items-center gap-2">
          {/* Mistakes Heart/Dot Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lives:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxMistakes }).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    idx < mistakes
                      ? 'bg-red-500 ring-2 ring-red-200 dark:ring-red-950'
                      : 'bg-emerald-500'
                  }`}
                  title={idx < mistakes ? 'Mistake' : 'Remaining life'}
                />
              ))}
            </div>
          </div>

          {/* XP Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{progress.xp} XP</span>
          </div>

          {/* Reset Current Round Button (Icon Only) */}
          <button
            onClick={onResetChallenge}
            title="Reset Round"
            aria-label="Reset Round"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-90 shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Reset Level / Game Button (Icon Only) */}
          <button
            onClick={onResetGame || onResetChallenge}
            title="Reset Level (Restart from Round 1)"
            aria-label="Reset Level"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-90 shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>
      </div>

      {/* Subtle Segmented Progress Line */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
        {Array.from({ length: totalChallenges }).map((_, idx) => {
          const isCompleted = idx < currentChallengeIndex;
          const isCurrent = idx === currentChallengeIndex;
          return (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                isCompleted
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : isCurrent
                  ? 'bg-blue-400 dark:bg-blue-400'
                  : 'bg-transparent'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
