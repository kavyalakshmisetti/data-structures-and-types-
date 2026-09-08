import { UserProgress, Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_chapter',
    title: 'First Step',
    description: 'Complete your first interactive chapter on Data Structures.',
    iconName: 'BookOpen',
    xpReward: 50,
    unlocked: false,
    category: 'beginner',
  },
  {
    id: 'taxonomy_master',
    title: 'Taxonomy Master',
    description: 'Master the classification of Primitive, Non-Primitive, Linear, and Non-Linear structures.',
    iconName: 'Layers',
    xpReward: 75,
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'linear_pro',
    title: 'Linear Architect',
    description: 'Complete the Linear Data Structures chapter covering Arrays, Lists, Stacks, and Queues.',
    iconName: 'ArrowDownToLine',
    xpReward: 80,
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'hierarchy_explorer',
    title: 'Hierarchy Explorer',
    description: 'Master Trees, Binary Search Trees, and Graph network structures.',
    iconName: 'Zap',
    xpReward: 100,
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'ops_analyst',
    title: 'Operations Analyst',
    description: 'Master Traversal, Insertion, Deletion, Searching, and Sorting complexities.',
    iconName: 'ShieldAlert',
    xpReward: 100,
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'lab_explorer',
    title: 'Visualizer Explorer',
    description: 'Watch or interact with visualizer labs covering data structures and operations.',
    iconName: 'FlaskConical',
    xpReward: 100,
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'quiz_ace',
    title: 'DSA Grandmaster',
    description: 'Score 80% or higher on the comprehensive assessment quiz.',
    iconName: 'Award',
    xpReward: 200,
    unlocked: false,
    category: 'quiz',
  },
  {
    id: 'streak_3',
    title: 'Daily Dedication',
    description: 'Maintain a 3-day learning streak.',
    iconName: 'Flame',
    xpReward: 80,
    unlocked: false,
    category: 'beginner',
  },
];

export const getUnlockedAchievementsCount = (progress: UserProgress): number => {
  if (!progress) return 0;
  return INITIAL_ACHIEVEMENTS.filter((badge) => {
    return (
      progress.achievements?.includes(badge.id) ||
      progress.awardedEventKeys?.some((k) =>
        (badge.id === 'first_chapter' && (k.includes('chapter_') || (progress.completedTheoryChapters?.length || 0) >= 1)) ||
        (badge.id === 'taxonomy_master' && (k.includes('chapter_2') || progress.completedTheoryChapters?.includes(2) || k.includes('chapter_classification-taxonomy'))) ||
        (badge.id === 'linear_pro' && (k.includes('chapter_3') || progress.completedTheoryChapters?.includes(3) || k.includes('chapter_linear-data-structures'))) ||
        (badge.id === 'hierarchy_explorer' && (k.includes('chapter_4') || progress.completedTheoryChapters?.includes(4) || k.includes('chapter_non-linear-data-structures'))) ||
        (badge.id === 'ops_analyst' && (k.includes('chapter_7') || progress.completedTheoryChapters?.includes(7) || k.includes('chapter_common-operations'))) ||
        (badge.id === 'lab_explorer' && ((progress.completedLabs?.length || 0) >= 1)) ||
        (badge.id === 'quiz_ace' && (progress.quizHighScore >= 80 || progress.quizCompleted)) ||
        (badge.id === 'streak_3' && progress.streakDays >= 3)
      )
    );
  }).length;
};

const STORAGE_KEY = 'algo_ds_types_progress_v1';

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getInitialProgress = (): UserProgress => {
  const today = getTodayString();
  return {
    xp: 250,
    level: 2,
    streakDays: 6,
    lastActiveDate: today,
    completedGameLevels: [],
    completedTheoryChapters: [],
    completedLabs: [],
    completedOverviewSections: [],
    quizCompleted: false,
    quizHighScore: 0,
    quizTotalQuestionsAnswered: 0,
    quizAnsweredCount: 0,
    totalPushes: 0,
    totalPops: 0,
    achievements: [],
    awardedEventKeys: [],
    history: [
      {
        title: 'Joined Data Structures & Types',
        description: 'Initialized AlgoLearn Interactive Learning Environment',
        xpEarned: 250,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  };
};

export const loadProgress = (): UserProgress => {
  if (typeof window === 'undefined') return getInitialProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
      const initial = getInitialProgress();
      saveProgress(initial);
      return initial;
    }
    
    let data: UserProgress;
    try {
      data = JSON.parse(raw);
    } catch {
      console.warn('Corrupted progress JSON found in storage, resetting to initial progress.');
      const initial = getInitialProgress();
      saveProgress(initial);
      return initial;
    }

    if (!data || typeof data !== 'object') {
      const initial = getInitialProgress();
      saveProgress(initial);
      return initial;
    }

    // Default baseline if uninitiated
    if (data.level === 1 && data.xp === 0 && (!data.completedTheoryChapters || data.completedTheoryChapters.length === 0)) {
      data.xp = 250;
      data.level = 2;
      data.streakDays = 6;
      saveProgress(data);
    }

    // Validate streak
    const today = getTodayString();
    const lastDate = data.lastActiveDate || today;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        data.streakDays = (data.streakDays || 1) + 1;
      } else {
        data.streakDays = 1;
      }
      data.lastActiveDate = today;
      saveProgress(data);
    }

    // Ensure fields exist
    data.xp = Math.max(0, typeof data.xp === 'number' && !isNaN(data.xp) ? data.xp : 0);
    data.level = Math.floor(data.xp / 250) + 1;
    data.completedGameLevels = Array.isArray(data.completedGameLevels) ? data.completedGameLevels : [];
    data.completedTheoryChapters = Array.isArray(data.completedTheoryChapters) ? data.completedTheoryChapters : [];
    data.completedLabs = Array.isArray(data.completedLabs) ? data.completedLabs : [];
    data.completedOverviewSections = Array.isArray(data.completedOverviewSections) ? data.completedOverviewSections : [];
    data.quizAnsweredCount = typeof data.quizAnsweredCount === 'number' ? data.quizAnsweredCount : (data.quizCompleted ? 10 : 0);
    data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
    data.awardedEventKeys = Array.isArray(data.awardedEventKeys) ? data.awardedEventKeys : [];
    data.history = Array.isArray(data.history) ? data.history : [];

    return data;
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return getInitialProgress();
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    if (!progress || typeof progress !== 'object') {
      return;
    }
    const serialized = JSON.stringify(progress);
    if (!serialized || serialized === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
};

export const awardXP = (
  current: UserProgress,
  amount: number,
  eventKey: string,
  reasonTitle: string,
  reasonDesc: string
): { updated: UserProgress; awarded: boolean } => {
  if (!eventKey || current.awardedEventKeys.includes(eventKey)) {
    return { updated: current, awarded: false };
  }

  const newXP = current.xp + amount;
  const newLevel = Math.floor(newXP / 250) + 1;
  const newAwardedKeys = [...current.awardedEventKeys, eventKey];
  const newHistory = [
    {
      title: reasonTitle,
      description: reasonDesc,
      xpEarned: amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    ...current.history.slice(0, 19),
  ];

  const updated: UserProgress = {
    ...current,
    xp: newXP,
    level: newLevel,
    awardedEventKeys: newAwardedKeys,
    history: newHistory,
  };

  saveProgress(updated);
  return { updated, awarded: true };
};

export const resetAllProgress = (): UserProgress => {
  const fresh = getInitialProgress();
  saveProgress(fresh);
  return fresh;
};
