export type SubjectCode = "math" | "english" | "polish" | "physics";
export type StudyMode = "learn" | "practice" | "review" | "exam";
export type AnswerMode =
  | "mcq"
  | "multiple_choice"
  | "true_false"
  | "numeric"
  | "short_text"
  | "fill_in"
  | "essay"
  | "graph_or_drawing"
  | "derivation_or_proof"
  | "oral";
export type ConfidenceLevel = "low" | "medium" | "high";
export type CognitiveLoad = "low" | "medium" | "high";
export type TaskResult = "correct" | "incorrect" | "review";

export type Subject = {
  code: SubjectCode;
  name: string;
  shortName: string;
  accent: string;
  accentSoft: string;
  focusLabel: string;
  focusDescription: string;
  readiness: number;
  dueReviews: number;
  streak: number;
};

export type ConceptProgress = {
  id: string;
  subjectCode: SubjectCode;
  name: string;
  topic: string;
  requirement: string;
  masteryScore: number;
  stabilityScore: number;
  difficultyScore: number;
  consecutiveSuccesses: number;
  lastSeenAt: string;
  nextDueAt: string;
  lastResult: "correct" | "hard" | "incorrect";
  lifetimeAttempts: number;
  lifetimeSuccesses: number;
  avgResponseTimeSec: number;
  hintDependencyScore: number;
  confidenceCalibrationScore: number;
  errorTrend: string;
};

export type TaskOption = {
  key: string;
  label: string;
  isCorrect?: boolean;
};

export type TaskAsset = {
  id: string;
  role: "prompt" | "shared" | "diagram" | "graph" | "table" | "solution" | string;
  storagePath: string;
  pageNumber?: number | null;
  position: number;
  caption?: string | null;
  publicUrl?: string | null;
};

export type StudyTask = {
  id: string;
  subjectCode: SubjectCode;
  examComponent: string;
  topic: string;
  title: string;
  prompt: string;
  stimulus?: string;
  answerMode: AnswerMode;
  taskTypeLabel: string;
  conceptIds: string[];
  requirementCodes: string[];
  difficultyBase: number;
  cognitiveLoad: CognitiveLoad;
  estimatedTimeSec: number;
  official: boolean;
  year: number;
  options?: TaskOption[];
  correctAnswer?: string;
  acceptedAnswers?: string[];
  numericTolerance?: number;
  explanation: string;
  solution: string;
  hints: string[];
  commonMistake: string;
  assetItems?: TaskAsset[];
  sourceRef?: string;
  topicSecondary?: string | null;
  topicMixed?: string | null;
};

export type TaskHistory = {
  taskId: string;
  timesSeen: number;
  lastSeenAt?: string;
  lastResult?: "correct" | "incorrect" | "skipped";
  lastConfidence?: ConfidenceLevel;
  lastHintLevelUsed: number;
};

export type AttemptEvaluation = {
  result: TaskResult;
  score: number;
  verdict: string;
  coachingNote: string;
  explanation: string;
  nextReviewDays: number;
  nextReviewLabel: string;
  nextDueAt: string;
};

export type PlannedTask = StudyTask & {
  priorityScore: number;
  reasons: string[];
};

export type PlannedSession = {
  id: string;
  mode: StudyMode;
  subject: Subject;
  durationMinutes: number;
  taskCount: number;
  tasks: PlannedTask[];
  summary: {
    candidatePoolSize: number;
    dueConcepts: number;
    dominantGoal: string;
    pacingLabel: string;
  };
};

export type SessionInput = {
  subjectCode: SubjectCode;
  mode: StudyMode;
  durationMinutes?: number;
  taskCount?: number;
  examComponent?: string;
  topics?: string[];
};

export type AnalyticsPoint = {
  label: string;
  value: number;
};

export type ImportJob = {
  id: string;
  source: string;
  status: "queued" | "reviewing" | "ready";
  itemCount: number;
  createdAt: string;
};

export type TaskMixItem = {
  label: string;
  count: number;
  share: number;
};

export type SubjectInsight = {
  code: SubjectCode;
  name: string;
  shortName: string;
  accent: string;
  accentSoft: string;
  readiness: number;
  predictedScore: number;
  rangeLow: number;
  rangeHigh: number;
  confidenceLabel: string;
  confidenceValue: number;
  trend: number;
  consistency: number;
  dueReviews: number;
  streak: number;
  accuracy: number;
  avgResponseTimeSec: number;
  hintDependency: number;
  calibration: number;
  studyHours: number;
  reviewCompletionRate: number;
  urgentConceptCount: number;
  bestNextStep: string;
  weakestConcept: ConceptProgress;
  strongestConcept: ConceptProgress;
  taskMix: TaskMixItem[];
};

export type OverallInsight = {
  readiness: number;
  predictedScore: number;
  rangeLow: number;
  rangeHigh: number;
  confidenceLabel: string;
  confidenceValue: number;
  dueReviews: number;
  accuracy: number;
  studyHours: number;
  reviewCompletionRate: number;
  consistency: number;
  streak: number;
};

export type RecentMistake = {
  label: string;
  detail: string;
};

export type SourceRecord = {
  title: string;
  type: string;
  year: number;
  status: string;
};

export type StudyModeOption = {
  id: StudyMode;
  name: string;
  description: string;
};

export type DashboardSnapshot = {
  countdownDays: number;
  overall: OverallInsight;
  recommended: PlannedSession;
  subjectInsights: SubjectInsight[];
  nextAction: string;
  dueConcepts: ConceptProgress[];
  weakestConcepts: ConceptProgress[];
  recentMistakes: RecentMistake[];
};

export type AnalyticsSnapshot = {
  overall: OverallInsight;
  subjectInsights: SubjectInsight[];
  subjectSeries: Record<SubjectCode, AnalyticsPoint[]>;
  mostDelayed: ConceptProgress[];
  strongestSubjects: Subject[];
  taskMix: TaskMixItem[];
  scoreHistory: AnalyticsPoint[];
};

export type AdminSnapshot = {
  totalTasks: number;
  publishedTasks: number;
  reviewQueueCount: number;
  importJobs: ImportJob[];
};

export type StudyAttemptSubmission = {
  accessToken?: string | null;
  taskId: string;
  answer: string;
  confidence: ConfidenceLevel;
  hintLevel: number;
  responseTimeSec?: number;
  evaluation: AttemptEvaluation;
};
