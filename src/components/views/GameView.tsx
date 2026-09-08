import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameLevelConfig, GameChallenge, StackItem, UserProgress } from '../../types';
import { GAME_LEVELS } from '../../data/gameData';
import { GAME_CATALOG, GameMetaData } from '../../data/gameMeta';
import { StackVisualizer } from '../common/StackVisualizer';
import { soundEffects } from '../../services/sound';
import { awardXP } from '../../services/storage';

// Modular Game Components
import { GameHub } from '../game/GameHub';
import { GamePreviewModal } from '../game/GamePreviewModal';
import { GameHeader } from '../game/GameHeader';
import { QuestionCard } from '../game/QuestionCard';
import { PopZone } from '../game/PopZone';
import { AvailableElementsPalette } from '../game/AvailableElementsPalette';
import { GameFeedbackCard } from '../game/GameFeedbackCard';
import { LevelCompleteModal } from '../game/LevelCompleteModal';
import { DebugAnalysisZone } from '../game/DebugAnalysisZone';
import { SpeedStackWorkspace } from '../game/SpeedStackWorkspace';
import { TargetStackDisplay } from '../game/TargetStackDisplay';
import { InGameLab } from '../game/InGameLab';

interface GameViewProps {
  progress: UserProgress;
  activeLevelId: number;
  onSelectLevel: (levelId: number) => void;
  onUpdateProgress: (updated: UserProgress) => void;
}

export const GameView: React.FC<GameViewProps> = ({
  progress,
  activeLevelId,
  onSelectLevel,
  onUpdateProgress,
}) => {
  // Navigation & View Mode: 'hub' (Game Hub), 'playing' (Active Gameplay), or 'lab' (In-Game Experiment Lab)
  const [viewMode, setViewMode] = useState<'hub' | 'playing' | 'lab'>('hub');
  const [selectedGameForPreview, setSelectedGameForPreview] = useState<GameMetaData | null>(null);

  // Current active level configuration
  const currentLevel: GameLevelConfig =
    GAME_LEVELS.find((l) => l.id === activeLevelId) || GAME_LEVELS[0];

  // Challenge Index within the active level
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const challenges = currentLevel.challenges || [];
  const currentChallenge: GameChallenge =
    challenges[currentChallengeIndex] || challenges[0];

  const [levelCompletedModalOpen, setLevelCompletedModalOpen] = useState<boolean>(false);

  // Active Interactive Stack State
  const [activeStack, setActiveStack] = useState<StackItem[]>([]);
  const [availableElements, setAvailableElements] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);

  // Immediate Action Feedback State
  const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackTitle, setFeedbackTitle] = useState<string>('');
  const [feedbackActionText, setFeedbackActionText] = useState<string>('');
  const [feedbackLifoReason, setFeedbackLifoReason] = useState<string>('');
  const [earnedXP, setEarnedXP] = useState<number>(0);

  // Debug State (Level 5)
  const [identifiedStep, setIdentifiedStep] = useState<any | null>(null);
  const [wrongStepAttempted, setWrongStepAttempted] = useState<any | null>(null);

  // Speed State (Level 6)
  const [speedRunning, setSpeedRunning] = useState<boolean>(false);
  const [speedTimer, setSpeedTimer] = useState<number>(45);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedCombo, setSpeedCombo] = useState<number>(1);
  const [speedStep, setSpeedStep] = useState<number>(0);

  // Initialize or Reset Challenge State
  const setupChallenge = useCallback((challenge: GameChallenge) => {
    if (!challenge) return;

    // Convert initial number array to StackItem objects with unique IDs
    const initialItems: StackItem[] = challenge.initialStack.map((val, idx) => ({
      id: `${challenge.id}-init-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      value: val,
      addedAt: Date.now() + idx,
    }));

    setActiveStack(initialItems);
    setAvailableElements(challenge.availableElements ? [...challenge.availableElements] : []);
    setFeedbackStatus(null);
    setFeedbackTitle('');
    setFeedbackActionText('');
    setFeedbackLifoReason('');
    setIdentifiedStep(null);
    setWrongStepAttempted(null);
  }, []);

  // When active level or challenge changes, re-initialize
  useEffect(() => {
    if (currentChallenge) {
      setupChallenge(currentChallenge);
    }
  }, [activeLevelId, currentChallengeIndex, currentChallenge, setupChallenge]);

  // When switching levels, reset challenge index to 0
  const handleSelectLevel = (levelId: number) => {
    soundEffects.playClick();
    setCurrentChallengeIndex(0);
    setMistakes(0);
    onSelectLevel(levelId);
  };

  // Reset current challenge
  const handleResetChallenge = () => {
    soundEffects.playClick();
    setMistakes(0);
    if (currentChallenge) {
      setupChallenge(currentChallenge);
    }
    if (currentLevel.type === 'speed') {
      setSpeedRunning(false);
      setSpeedTimer(45);
      setSpeedScore(0);
      setSpeedCombo(1);
      setSpeedStep(0);
    }
  };

  // Global Reset Game: Clears current challenge progress back to round 1 while maintaining overall user EXP
  const handleResetGame = () => {
    soundEffects.playClick();
    setCurrentChallengeIndex(0);
    setMistakes(0);
    if (challenges[0]) {
      setupChallenge(challenges[0]);
    }
    if (currentLevel.type === 'speed') {
      setSpeedRunning(false);
      setSpeedTimer(45);
      setSpeedScore(0);
      setSpeedCombo(1);
      setSpeedStep(0);
    }
  };

  // Speed Mode Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentLevel.type === 'speed' && speedRunning && speedTimer > 0) {
      interval = setInterval(() => {
        setSpeedTimer((t) => {
          if (t <= 1) {
            setSpeedRunning(false);
            if (speedStep >= 4 && !progress.completedGameLevels.includes(6)) {
              handleTriggerLevelComplete();
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentLevel.type, speedRunning, speedTimer, speedStep]);

  // Trigger Level Complete Reward & Modal
  const handleTriggerLevelComplete = () => {
    soundEffects.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    const { updated } = awardXP(
      progress,
      currentLevel.xpReward,
      `game_level_${currentLevel.id}_completed`,
      `Completed Level ${currentLevel.levelNumber || currentLevel.id}`,
      currentLevel.title
    );

    const completed = Array.from(new Set([...updated.completedGameLevels, currentLevel.id]));
    onUpdateProgress({
      ...updated,
      completedGameLevels: completed,
    });

    setLevelCompletedModalOpen(true);
  };

  // Advance to Next Challenge or Trigger Level Complete
  const handleNextChallenge = () => {
    soundEffects.playClick();
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      handleTriggerLevelComplete();
    }
  };

  // Top Element Value in activeStack
  const currentTopItem = activeStack.length > 0 ? activeStack[activeStack.length - 1] : null;
  const currentTopValue = currentTopItem ? currentTopItem.value : null;

  // =========================================================================
  // HANDLERS FOR POP MASTER (LEVEL 1)
  // =========================================================================
  const handlePopSuccess = (poppedVal: number | string) => {
    soundEffects.playPop();
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore
    }

    // Remove top item
    setActiveStack((prev) => prev.slice(0, -1));

    // Award XP
    const xpReward = currentChallenge.xpReward || 25;
    setEarnedXP(xpReward);
    const { updated } = awardXP(
      progress,
      xpReward,
      `challenge_${currentChallenge.id}_success`,
      `Completed ${currentChallenge.question}`,
      currentLevel.title
    );
    onUpdateProgress(updated);

    // Set feedback
    setFeedbackStatus('correct');
    setFeedbackTitle(currentChallenge.feedback.correctTitle);
    setFeedbackActionText(currentChallenge.feedback.correctActionText);
    setFeedbackLifoReason(currentChallenge.feedback.lifoReason);
  };

  const handlePopInvalid = (attemptedVal: number | string) => {
    soundEffects.playError();
    setMistakes((m) => m + 1);

    setFeedbackStatus('incorrect');
    setFeedbackTitle('Invalid Stack Removal!');
    setFeedbackActionText(`Cannot remove [${attemptedVal}]! Stacks do not support non-top access.`);
    setFeedbackLifoReason(currentChallenge.feedback.incorrectTip);
  };

  // =========================================================================
  // HANDLERS FOR PUSH MASTER (LEVEL 2)
  // =========================================================================
  const handlePushValue = (val: number, itemIndex?: number) => {
    const isTarget = currentChallenge.targetValue === undefined || currentChallenge.targetValue === val;

    if (isTarget) {
      soundEffects.playPush();
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.65 },
        });
      } catch {
        // Ignore
      }

      // Add to stack
      setActiveStack((prev) => [
        ...prev,
        { id: `push-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, value: val, addedAt: Date.now() },
      ]);
      
      // Safely remove only one occurrence
      setAvailableElements((prev) => {
        if (itemIndex !== undefined && itemIndex >= 0 && itemIndex < prev.length) {
          const copy = [...prev];
          copy.splice(itemIndex, 1);
          return copy;
        }
        const idx = prev.indexOf(val);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });

      // Award XP
      const xpReward = currentChallenge.xpReward || 30;
      setEarnedXP(xpReward);
      const { updated } = awardXP(
        progress,
        xpReward,
        `challenge_${currentChallenge.id}_success`,
        `Completed ${currentChallenge.question}`,
        currentLevel.title
      );
      onUpdateProgress(updated);

      setFeedbackStatus('correct');
      setFeedbackTitle(currentChallenge.feedback.correctTitle);
      setFeedbackActionText(currentChallenge.feedback.correctActionText);
      setFeedbackLifoReason(currentChallenge.feedback.lifoReason);
    } else {
      soundEffects.playError();
      setMistakes((m) => m + 1);

      setFeedbackStatus('incorrect');
      setFeedbackTitle('Incorrect Push Element');
      setFeedbackActionText(`The algorithm requested [${currentChallenge.targetValue}], but you selected [${val}].`);
      setFeedbackLifoReason(currentChallenge.feedback.incorrectTip);
    }
  };

  // =========================================================================
  // HANDLERS FOR BUILD THE STACK & PREDICT THE STACK (LEVEL 3 & 4)
  // =========================================================================
  const handleBuildPop = (poppedVal?: number | string) => {
    if (activeStack.length === 0) return;

    soundEffects.playPop();
    const topItem = activeStack[activeStack.length - 1];
    const valToRemove = poppedVal !== undefined ? poppedVal : topItem.value;
    const nextStack = activeStack.slice(0, -1);
    setActiveStack(nextStack);

    // Return value back to available elements
    setAvailableElements((prev) => [...prev, Number(valToRemove)]);

    // Check if resulting stack matches target stack
    if (currentChallenge?.targetStack) {
      const target = currentChallenge.targetStack;
      if (nextStack.length === target.length) {
        const isMatched = nextStack.every((item, idx) => Number(item.value) === Number(target[idx]));
        if (isMatched) {
          soundEffects.playSuccess();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {
            // Ignore
          }

          const xpReward = currentChallenge.xpReward || 35;
          setEarnedXP(xpReward);
          const { updated } = awardXP(
            progress,
            xpReward,
            `challenge_${currentChallenge.id}_success`,
            `Completed ${currentChallenge.question}`,
            currentLevel.title
          );
          onUpdateProgress(updated);

          setFeedbackStatus('correct');
          setFeedbackTitle(currentChallenge.feedback.correctTitle);
          setFeedbackActionText(currentChallenge.feedback.correctActionText);
          setFeedbackLifoReason(currentChallenge.feedback.lifoReason);
        }
      }
    }
  };

  const handleBuildPushValue = (val: number, itemIndex?: number) => {
    soundEffects.playPush();

    const nextStack = [
      ...activeStack,
      { id: `build-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, value: val, addedAt: Date.now() },
    ];
    setActiveStack(nextStack);
    
    // Safely remove only one occurrence
    setAvailableElements((prev) => {
      if (itemIndex !== undefined && itemIndex >= 0 && itemIndex < prev.length) {
        const copy = [...prev];
        copy.splice(itemIndex, 1);
        return copy;
      }
      const idx = prev.indexOf(val);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });

    // Check if target matches
    if (currentChallenge.targetStack) {
      const target = currentChallenge.targetStack;
      if (nextStack.length === target.length) {
        const isMatched = nextStack.every((item, idx) => Number(item.value) === Number(target[idx]));
        if (isMatched) {
          soundEffects.playSuccess();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {
            // Ignore
          }

          const xpReward = currentChallenge.xpReward || 35;
          setEarnedXP(xpReward);
          const { updated } = awardXP(
            progress,
            xpReward,
            `challenge_${currentChallenge.id}_success`,
            `Completed ${currentChallenge.question}`,
            currentLevel.title
          );
          onUpdateProgress(updated);

          setFeedbackStatus('correct');
          setFeedbackTitle(currentChallenge.feedback.correctTitle);
          setFeedbackActionText(currentChallenge.feedback.correctActionText);
          setFeedbackLifoReason(currentChallenge.feedback.lifoReason);
        } else {
          soundEffects.playError();
          setMistakes((m) => m + 1);

          setFeedbackStatus('incorrect');
          setFeedbackTitle('Target Stack Order Mismatch');
          setFeedbackActionText('The resulting stack order does not match the required target.');
          setFeedbackLifoReason(currentChallenge.feedback.incorrectTip);
        }
      }
    }
  };

  // =========================================================================
  // HANDLERS FOR DEBUG THE STACK (LEVEL 5)
  // =========================================================================
  const handleDebugSuccess = (step: any) => {
    soundEffects.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    setIdentifiedStep(step);
    setWrongStepAttempted(null);

    const xpReward = currentChallenge.xpReward || 45;
    setEarnedXP(xpReward);
    const { updated } = awardXP(
      progress,
      xpReward,
      `challenge_${currentChallenge.id}_debug_success`,
      `Identified ${step.errorType || 'Bug'}`,
      currentLevel.title
    );
    onUpdateProgress(updated);

    setFeedbackStatus('correct');
    setFeedbackTitle(currentChallenge.feedback.correctTitle);
    setFeedbackActionText(currentChallenge.feedback.correctActionText);
    setFeedbackLifoReason(currentChallenge.feedback.lifoReason);
  };

  const handleDebugWrongStep = (step: any) => {
    soundEffects.playError();
    setMistakes((m) => m + 1);
    setWrongStepAttempted(step);

    setFeedbackStatus('incorrect');
    setFeedbackTitle('Not a Runtime Violation');
    setFeedbackActionText(`Line "${step.text}" is valid and does not cause a crash.`);
    setFeedbackLifoReason(currentChallenge.feedback.incorrectTip);
  };

  // =========================================================================
  // HANDLERS FOR SPEED STACK (LEVEL 6)
  // =========================================================================
  const handleSpeedAction = (action: 'PUSH' | 'POP', value?: number) => {
    if (!speedRunning || currentChallengeIndex >= challenges.length) return;

    const activeSpeedChallenge = challenges[speedStep] || challenges[0];

    if (activeSpeedChallenge.mode === 'push' || activeSpeedChallenge.question.includes('PUSH')) {
      if (action === 'PUSH' && value === activeSpeedChallenge.targetValue) {
        soundEffects.playPush();
        setActiveStack((prev) => [
          ...prev,
          { id: `speed-${Date.now()}`, value: value, addedAt: Date.now() },
        ]);
        setSpeedScore((s) => s + 100 * speedCombo);
        setSpeedCombo((c) => Math.min(3, c + 1));

        if (speedStep < challenges.length - 1) {
          setSpeedStep((st) => st + 1);
          setCurrentChallengeIndex((st) => st + 1);
        } else {
          setSpeedRunning(false);
          handleTriggerLevelComplete();
        }
      } else {
        soundEffects.playError();
        setMistakes((m) => m + 1);
        setSpeedCombo(1);
      }
    } else {
      if (action === 'POP' && activeStack.length > 0) {
        soundEffects.playPop();
        setActiveStack((prev) => prev.slice(0, -1));
        setSpeedScore((s) => s + 100 * speedCombo);
        setSpeedCombo((c) => Math.min(3, c + 1));

        if (speedStep < challenges.length - 1) {
          setSpeedStep((st) => st + 1);
          setCurrentChallengeIndex((st) => st + 1);
        } else {
          setSpeedRunning(false);
          handleTriggerLevelComplete();
        }
      } else {
        soundEffects.playError();
        setMistakes((m) => m + 1);
        setSpeedCombo(1);
      }
    }
  };

  // If in Hub view mode, render the Game Hub and Game Preview modal
  if (viewMode === 'hub') {
    return (
      <div className="w-full">
        <GameHub
          progress={progress}
          activeLevelId={activeLevelId}
          currentChallengeIndex={currentChallengeIndex}
          onOpenPreview={(game) => {
            setSelectedGameForPreview(game);
          }}
          onDirectContinue={(levelId) => {
            handleSelectLevel(levelId);
            setViewMode('playing');
          }}
          onOpenInGameLab={() => {
            soundEffects.playClick();
            setViewMode('lab');
          }}
          onUpdateProgress={onUpdateProgress}
        />

        <GamePreviewModal
          game={selectedGameForPreview}
          isOpen={selectedGameForPreview !== null}
          isCompleted={progress.completedGameLevels.includes(selectedGameForPreview?.id || -1)}
          isInProgress={
            selectedGameForPreview?.id === activeLevelId && currentChallengeIndex > 0
          }
          currentChallengeProgress={{
            current: currentChallengeIndex + 1,
            total: challenges.length,
          }}
          onClose={() => setSelectedGameForPreview(null)}
          onStartGame={(gameId) => {
            setSelectedGameForPreview(null);
            handleSelectLevel(gameId);
            setViewMode('playing');
          }}
        />
      </div>
    );
  }

  if (viewMode === 'lab') {
    return (
      <div className="w-full animate-in fade-in duration-200">
        <InGameLab
          progress={progress}
          onUpdateProgress={onUpdateProgress}
          onBackToGame={() => {
            soundEffects.playClick();
            setViewMode('hub');
          }}
          onSelectLevel={(levelId) => {
            handleSelectLevel(levelId);
            setViewMode('playing');
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Level Completed Celebration Modal */}
      <LevelCompleteModal
        isOpen={levelCompletedModalOpen}
        level={currentLevel}
        xpEarned={currentLevel.xpReward}
        mistakes={mistakes}
        hasNextLevel={activeLevelId < GAME_LEVELS.length}
        onNextLevel={() => {
          setLevelCompletedModalOpen(false);
          const nextLvlId = activeLevelId + 1;
          const nextMeta = GAME_CATALOG.find((g) => g.id === nextLvlId);
          if (nextMeta) {
            setSelectedGameForPreview(nextMeta);
            setViewMode('hub');
          } else {
            handleSelectLevel(nextLvlId);
          }
        }}
        onReplayLevel={() => {
          setLevelCompletedModalOpen(false);
          setCurrentChallengeIndex(0);
          setMistakes(0);
          if (currentLevel.challenges[0]) {
            setupChallenge(currentLevel.challenges[0]);
          }
        }}
        onClose={() => {
          setLevelCompletedModalOpen(false);
          setViewMode('hub');
        }}
      />

      {/* 1. Minimal Top Game Bar with Game Hub Return */}
      <GameHeader
        currentLevel={currentLevel}
        allLevels={GAME_LEVELS}
        currentChallengeIndex={currentChallengeIndex}
        totalChallenges={challenges.length}
        progress={progress}
        mistakes={mistakes}
        maxMistakes={3}
        isLabActive={viewMode === 'lab'}
        onOpenLab={() => {
          soundEffects.playClick();
          setViewMode('lab');
        }}
        onSelectLevel={handleSelectLevel}
        onResetChallenge={handleResetChallenge}
        onResetGame={handleResetGame}
        onBackToHub={() => {
          soundEffects.playClick();
          setViewMode('hub');
        }}
      />

      {/* 2. Focused Question Card */}
      {currentChallenge && (
        <QuestionCard challenge={currentChallenge} />
      )}

      {/* 3. Game Feedback Card (Shows upon correct/incorrect move) */}
      <GameFeedbackCard
        status={feedbackStatus}
        title={feedbackTitle}
        actionText={feedbackActionText}
        lifoReason={feedbackLifoReason}
        xpEarned={earnedXP}
        onNextChallenge={handleNextChallenge}
        onRetry={() => {
          setFeedbackStatus(null);
          if (currentChallenge) setupChallenge(currentChallenge);
        }}
        isLastChallenge={currentChallengeIndex === challenges.length - 1}
      />

      {/* ========================================================================= */}
      {/* LEVEL 1: POP MASTER WORKSPACE */}
      {/* ========================================================================= */}
      {currentLevel.type === 'lifo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Pop Zone Target */}
          <PopZone
            topElementValue={currentTopValue}
            onPopSuccess={handlePopSuccess}
            onPopInvalid={handlePopInvalid}
            disabled={feedbackStatus === 'correct'}
          />

          {/* Current Stack Visualizer */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <StackVisualizer
              items={activeStack}
              capacity={currentChallenge?.capacity || 6}
              onInvalidPopAttempt={handlePopInvalid}
              allowDragPop={feedbackStatus !== 'correct'}
              customEmptyMessage="Stack is empty! All items popped."
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: PUSH MASTER WORKSPACE */}
      {/* ========================================================================= */}
      {currentLevel.type === 'push' && (
        <div className="space-y-4">
          <AvailableElementsPalette
            elements={availableElements}
            onSelectElement={handlePushValue}
            onPopTop={() => {
              if (activeStack.length > (currentChallenge?.initialStack?.length || 0)) {
                soundEffects.playPop();
                const top = activeStack[activeStack.length - 1];
                setActiveStack((prev) => prev.slice(0, -1));
                setAvailableElements((prev) => [...prev, Number(top.value)]);
              }
            }}
            currentTopValue={currentTopValue}
            showPopAction={activeStack.length > (currentChallenge?.initialStack?.length || 0)}
            guidedTargetValue={currentChallenge?.targetValue}
            disabled={feedbackStatus === 'correct'}
          />

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <StackVisualizer
              items={activeStack}
              capacity={currentChallenge?.capacity || 5}
              onDropItem={(val) => handlePushValue(Number(val))}
              allowDragPop={false}
              customEmptyMessage="Stack is empty. Click or drop an element above."
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 3: BUILD THE STACK WORKSPACE */}
      {/* ========================================================================= */}
      {currentLevel.type === 'build' && (
        <div className="space-y-4">
          <AvailableElementsPalette
            elements={availableElements}
            onSelectElement={handleBuildPushValue}
            onPopTop={() => handleBuildPop()}
            currentTopValue={currentTopValue}
            showPopAction={activeStack.length > 0}
            disabled={feedbackStatus === 'correct'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <TargetStackDisplay
                targetStack={currentChallenge?.targetStack}
                description="Target structure (Bottom to Top)"
              />

              {/* Dedicated Pop / Undo Zone */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    POP / UNDO ZONE
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Drag top item here or click button
                  </span>
                </div>
                <PopZone
                  topElementValue={currentTopValue}
                  onPopSuccess={(val) => handleBuildPop(val)}
                  onPopInvalid={handlePopInvalid}
                  disabled={feedbackStatus === 'correct' || activeStack.length === 0}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <StackVisualizer
                items={activeStack}
                capacity={currentChallenge?.capacity || 5}
                onDropItem={(val) => handleBuildPushValue(Number(val))}
                onInvalidPopAttempt={handlePopInvalid}
                allowDragPop={feedbackStatus !== 'correct'}
                customEmptyMessage="Drop available elements above or click chips to build target stack."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 4: PREDICT THE STACK WORKSPACE */}
      {/* ========================================================================= */}
      {currentLevel.type === 'predict' && (
        <div className="space-y-4">
          <AvailableElementsPalette
            elements={availableElements}
            onSelectElement={handleBuildPushValue}
            onPopTop={() => handleBuildPop()}
            currentTopValue={currentTopValue}
            showPopAction={activeStack.length > 0}
            disabled={feedbackStatus === 'correct'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <TargetStackDisplay
                operationsTrace={currentChallenge?.operationsTrace}
                title="Execution Code Trace"
                description="Follow the trace step-by-step or build the final state directly"
              />

              {/* Dedicated Pop Zone for Level 4 */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    POP OPERATION ZONE
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Execute Pop() in trace or remove top
                  </span>
                </div>
                <PopZone
                  topElementValue={currentTopValue}
                  onPopSuccess={(val) => handleBuildPop(val)}
                  onPopInvalid={handlePopInvalid}
                  disabled={feedbackStatus === 'correct' || activeStack.length === 0}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <StackVisualizer
                items={activeStack}
                capacity={currentChallenge?.capacity || 5}
                onDropItem={(val) => handleBuildPushValue(Number(val))}
                onInvalidPopAttempt={handlePopInvalid}
                allowDragPop={feedbackStatus !== 'correct'}
                customEmptyMessage="Push elements following trace or reconstruct the final stack state."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 5: DEBUG THE STACK WORKSPACE */}
      {/* ========================================================================= */}
      {currentLevel.type === 'debug' && (
        <DebugAnalysisZone
          debugSteps={currentChallenge?.debugSteps || []}
          onIdentifiedError={handleDebugSuccess}
          onWrongStepSelected={handleDebugWrongStep}
          identifiedStep={identifiedStep}
          wrongStepAttempted={wrongStepAttempted}
        />
      )}

      {/* ========================================================================= */}
      {/* LEVEL 6: SPEED STACK WORKSPACE */}
      {/* ========================================================================= */}
      {currentLevel.type === 'speed' && (
        <SpeedStackWorkspace
          isRunning={speedRunning}
          timeLeft={speedTimer}
          score={speedScore}
          combo={speedCombo}
          currentPromptIndex={speedStep}
          totalPrompts={challenges.length}
          activePromptText={currentChallenge?.instruction || 'Ready...'}
          activePromptAction={currentChallenge?.mode === 'pop' ? 'POP' : 'PUSH'}
          stack={activeStack}
          availableElements={currentChallenge?.availableElements || [10, 20, 30, 40, 50]}
          onStartSpeed={() => {
            soundEffects.playClick();
            setSpeedRunning(true);
            setSpeedTimer(45);
            setSpeedScore(0);
            setSpeedCombo(1);
            setSpeedStep(0);
            setCurrentChallengeIndex(0);
            setActiveStack([]);
          }}
          onPushValue={(val) => handleSpeedAction('PUSH', val)}
          onPopTop={() => handleSpeedAction('POP')}
        />
      )}
    </div>
  );
};
