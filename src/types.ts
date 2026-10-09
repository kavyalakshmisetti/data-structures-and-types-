export type TabType = 'home' | 'theory' | 'lab' | 'quiz' | 'progress';

export interface StackItem {
  id: string;
  value: number | string;
  color?: string;
  isTop?: boolean;
  addedAt: number;
}

export type OperationType =
  | 'PUSH'
  | 'POP'
  | 'PEEK'
  | 'ISEMPTY'
  | 'ISFULL'
  | 'CLEAR'
  | 'SWAP'
  | 'DUP'
  | 'REVERSE'
  | 'SORT'
  | 'SEARCH'
  | 'ROTATE'
  | 'RESIZE'
  | 'BATCH_PUSH';

export interface OperationLog {
  id: string;
  operation: OperationType;
  value?: number | string;
  success: boolean;
  message: string;
  timestamp: Date;
  stackSnapshot: (number | string)[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'beginner' | 'mastery' | 'speed' | 'quiz';
}

export interface QuizQuestionOutcome {
  questionId: number;
  status: 'correct' | 'incorrect' | 'unanswered';
  selectedOption: string | null;
  draggedOrder?: string[];
  pointsAwarded: number; // +5 for correct, -2 for incorrect, 0 for timeout
  submittedAt: number;
}

export interface TopicVideoProgress {
  videoId: number;
  completed: boolean;
  pointsEarned: number; // 0 or 25
  completedAt?: number;
}

export interface TopicScoringData {
  videos: Record<number, TopicVideoProgress>; // 1 and 2
  quizQuestions: Record<number, QuizQuestionOutcome>; // 1 to 10
  visualizationPoints: number; // 0 to 50
  quizScore: number; // raw sum including deductions (-20 to 50)
  overallTopicScore: number; // visualizationPoints + max(0, quizScore), 0 to 100
  completionPercentage: number; // 0 to 100 based on 12 activities
  completedVideosCount: number; // 0, 1, or 2
  answeredOrTimedOutQuizCount: number; // 0 to 10
  quizCorrectCount: number;
  quizWrongCount: number;
  quizUnansweredCount: number;
  quizCompleted: boolean;
  isTopicCompleted: boolean;
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedGameLevels: number[];
  completedTheoryChapters: number[];
  completedLabs?: number[];
  completedOverviewSections?: number[];
  quizCompleted: boolean;
  quizHighScore: number;
  quizTotalQuestionsAnswered: number;
  quizAnsweredCount?: number;
  totalPushes: number;
  totalPops: number;
  achievements: string[]; // achievement ids
  awardedEventKeys: string[]; // prevents duplicate XP rewards
  topicData?: TopicScoringData; // authoritative scoring for Data Structures and Types
  history: {
    title: string;
    description: string;
    xpEarned: number;
    timestamp: string;
  }[];
}

export type TheoryCategoryKey = '01' | '02' | '03' | '04' | '05';

export interface TheoryLesson {
  id: number;
  chapterNumber?: string;
  categoryLabel?: string;
  categoryId?: string;
  categoryTitle?: string;
  lessonNumber?: number;
  title: string;
  shortDesc: string;
  readTime: string;
  executiveDefinition?: string;
  content: string;
  analogy?: {
    title: string;
    description: string;
    diagram?: string;
  };
  example?: {
    title: string;
    description: string;
    steps?: string[];
  };
  criticalSpecifications?: string[];
  visualDiagram?: {
    type: 'stack-ascii' | 'lifo-sequence' | 'before-after' | 'array-table' | 'linked-list' | 'brackets' | 'callstack' | 'maze' | 'browser' | 'comparison' | 'tree' | 'graph' | 'taxonomy';
    beforeState?: (string | number)[];
    afterState?: (string | number)[];
    operationLabel?: string;
    notes?: string;
    diagramText?: string;
  };
  algorithmSteps?: string[];
  pseudocode?: string;
  codeSnippet?: {
    c?: string;
    cpp?: string;
    java?: string;
    python?: string;
  };
  timeComplexity?: string;
  spaceComplexity?: string;
  keyTakeaway: string;
  interactiveDemoType?:
    | 'what-is-ds'
    | 'classification-taxonomy'
    | 'primitive-types'
    | 'non-primitive-types'
    | 'linear-comparison'
    | 'non-linear-tree-graph'
    | 'common-operations'
    | 'tradeoff-engine'
    | 'lifo'
    | 'push-pop-sandbox'
    | 'top-pointer'
    | 'mini-operations'
    | 'algorithm-flowchart'
    | 'overflow-underflow'
    | 'array-stack'
    | 'linkedlist-stack'
    | 'complexity-table'
    | 'problem-solving'
    | 'real-world'
    | 'quick-summary'
    | 'array-vs-list';
  practiceQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Backwards compatibility alias
export type TheoryChapter = TheoryLesson;

export interface TheoryCategoryMeta {
  id: TheoryCategoryKey;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge: string;
  lessons: TheoryLesson[];
}

export interface GameChallenge {
  id: string;
  challengeNumber: number;
  totalChallengesInLevel: number;
  mode: 'pop' | 'push' | 'build' | 'predict' | 'debug' | 'speed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  instruction: string;
  initialStack: number[];
  availableElements?: number[];
  targetStack?: number[];
  targetValue?: number;
  capacity?: number;
  operationsTrace?: string[];
  debugSteps?: { id: string; text: string; isFaulty: boolean; errorType?: string; explanation: string }[];
  hint: {
    title: string;
    thoughtPrompt: string;
    clue: string;
  };
  guide: {
    ruleTitle: string;
    ruleDescription: string;
    example: string;
  };
  guidedSolve: {
    stepExplanation: string;
    sourceValue?: number;
    sourceType?: 'top' | 'available' | 'debug-step';
    targetZone: 'pop-zone' | 'push-zone' | 'debug-zone';
    visualPathText: string;
  };
  feedback: {
    correctTitle: string;
    correctActionText: string;
    lifoReason: string;
    incorrectTip: string;
  };
  xpReward: number;
}

export interface GameLevelConfig {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  type: 'lifo' | 'push' | 'build' | 'predict' | 'debug' | 'speed';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  stars: number;
  hints: [string, string, string]; // 1: Concept, 2: Direction, 3: Strong
  challenges: GameChallenge[];
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'predict-output' | 'true-false' | 'scenario' | 'drag-order';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[]; // string for MCQ/TF, array for drag-order
  explanation: string;
  hints: [string, string, string];
}
