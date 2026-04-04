import type {
  AnswerMode,
  AttemptEvaluation,
  ConceptProgress,
  ConfidenceLevel,
  PlannedSession,
  PlannedTask,
  SessionInput,
  StudyMode,
  StudyModeOption,
  StudyTask,
  Subject,
  TaskHistory,
  TaskMixItem,
  TaskResult,
} from "@/lib/domain/study-types";

const RETENTION_HORIZON_DAYS = 14;

const difficultyBands: Record<StudyMode, [number, number]> = {
  learn: [2, 5],
  practice: [3, 7],
  review: [2, 6],
  exam: [4, 8],
};

export const modePacing: Record<StudyMode, string> = {
  learn: "Primer + guided practice",
  practice: "Independent first, feedback fast",
  review: "Short, due-first retrieval",
  exam: "Timed, no-adaptive-hint block",
};

export const studyModes: StudyModeOption[] = [
  {
    id: "learn",
    name: "Learn",
    description: "Primer, worked example, guided turn, then independent retrieval.",
  },
  {
    id: "practice",
    name: "Practice",
    description: "Independent first, with targeted hints only after commitment.",
  },
  {
    id: "review",
    name: "Review",
    description: "Due-first spaced repetition with tight pacing and light scaffolds.",
  },
  {
    id: "exam",
    name: "Exam",
    description: "Official-style distribution, realistic timing, analysis after submission.",
  },
];

export const answerModeLabels: Record<AnswerMode, string> = {
  mcq: "MCQ",
  multiple_choice: "Multiple choice",
  true_false: "True / false",
  numeric: "Numeric",
  short_text: "Short text",
  fill_in: "Fill in",
  essay: "Essay",
  graph_or_drawing: "Graph / drawing",
  derivation_or_proof: "Derivation / proof",
  oral: "Oral",
};

export function getAnswerModeLabel(answerMode: AnswerMode) {
  return answerModeLabels[answerMode];
}

export function isOptionMode(answerMode: AnswerMode) {
  return (
    answerMode === "mcq" ||
    answerMode === "multiple_choice" ||
    answerMode === "true_false"
  );
}

export function isEssayStyleMode(answerMode: AnswerMode) {
  return (
    answerMode === "essay" ||
    answerMode === "oral" ||
    answerMode === "graph_or_drawing" ||
    answerMode === "derivation_or_proof"
  );
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:()]/g, "");
}

function sharedConceptCount(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(referenceDate: Date, days: number) {
  const next = new Date(referenceDate);
  next.setUTCDate(next.getUTCDate() + days);
  return formatDateOnly(next);
}

function getElapsedDays(lastSeenAt?: string, referenceDate = new Date()) {
  if (!lastSeenAt) {
    return 0;
  }

  const diffMs = referenceDate.getTime() - new Date(`${lastSeenAt}T09:00:00.000Z`).getTime();
  return Math.max(Math.round(diffMs / (1000 * 60 * 60 * 24)), 0);
}

function createFallbackConceptProgress(conceptId: string, subjectCode: Subject["code"]): ConceptProgress {
  const today = formatDateOnly(new Date());

  return {
    id: conceptId,
    subjectCode,
    name: conceptId,
    topic: "Unmapped topic",
    requirement: "General exam requirement",
    masteryScore: 0.45,
    stabilityScore: 0.35,
    difficultyScore: 0.5,
    consecutiveSuccesses: 0,
    lastSeenAt: today,
    nextDueAt: today,
    lastResult: "incorrect",
    lifetimeAttempts: 0,
    lifetimeSuccesses: 0,
    avgResponseTimeSec: 0,
    hintDependencyScore: 0.3,
    confidenceCalibrationScore: 0.4,
    errorTrend: "Needs first attempt data",
  };
}

function getConceptForgettingProbability(concept: ConceptProgress, referenceDate = new Date()) {
  const elapsedDays = getElapsedDays(concept.lastSeenAt, referenceDate);
  const stabilityDays = Math.max(1, concept.stabilityScore * RETENTION_HORIZON_DAYS);
  const retention = Math.exp(-elapsedDays / stabilityDays);

  return clamp(1 - retention, 0, 1);
}

function getTaskForgettingScore(progress: ConceptProgress[], referenceDate = new Date()) {
  return average(
    progress.map((concept) => getConceptForgettingProbability(concept, referenceDate)),
  );
}

function getTaskWeaknessScore(progress: ConceptProgress[]) {
  return average(
    progress.map((concept) =>
      clamp(
        ((1 - concept.masteryScore) +
          (1 - concept.stabilityScore) +
          concept.hintDependencyScore) /
          3,
        0,
        1,
      ),
    ),
  );
}

function getTaskExamImportanceScore(
  task: StudyTask,
  requirementWeights: Record<string, number>,
) {
  const averageRequirementWeight =
    task.requirementCodes.reduce(
      (total, requirement) => total + (requirementWeights[requirement] ?? 6),
      0,
    ) / Math.max(task.requirementCodes.length, 1);

  return clamp(averageRequirementWeight / 10 + (task.official ? 0.1 : 0), 0, 1);
}

function getInterleavingBenefit(task: StudyTask, previousTask?: StudyTask) {
  if (!previousTask) {
    return 0.5;
  }

  const sharedConcepts = sharedConceptCount(previousTask.conceptIds, task.conceptIds);

  if (sharedConcepts > 0) {
    return 0;
  }

  if (previousTask.topic === task.topic) {
    return 0.5;
  }

  return 1;
}

function getDifficultyPenalty(task: StudyTask, mode: StudyMode) {
  const [bandMin, bandMax] = difficultyBands[mode];
  const distance =
    task.difficultyBase < bandMin
      ? bandMin - task.difficultyBase
      : task.difficultyBase > bandMax
        ? task.difficultyBase - bandMax
        : 0;

  return clamp(distance / 10, 0, 1);
}

function getHistoryPenalty(task: StudyTask, taskHistory: TaskHistory[]) {
  const history = taskHistory.find((item) => item.taskId === task.id);

  if (!history?.lastSeenAt) {
    return 0;
  }

  const elapsedDays = getElapsedDays(history.lastSeenAt);

  if (elapsedDays <= 1) {
    return 0.18;
  }

  if (elapsedDays <= 3) {
    return 0.08;
  }

  return 0;
}

function buildPriority(options: {
  task: StudyTask;
  input: SessionInput;
  subjectCode: Subject["code"];
  conceptProgressMap: Map<string, ConceptProgress>;
  alreadySelected: StudyTask[];
  taskHistory: TaskHistory[];
  requirementWeights: Record<string, number>;
  referenceDate?: Date;
}) {
  const {
    task,
    input,
    subjectCode,
    conceptProgressMap,
    alreadySelected,
    taskHistory,
    requirementWeights,
    referenceDate = new Date(),
  } = options;
  const progress = task.conceptIds.map(
    (conceptId) => conceptProgressMap.get(conceptId) ?? createFallbackConceptProgress(conceptId, subjectCode),
  );
  const forgettingScore = getTaskForgettingScore(progress, referenceDate);
  const weaknessScore = getTaskWeaknessScore(progress);
  const examImportanceScore = getTaskExamImportanceScore(task, requirementWeights);
  const previousTask = alreadySelected.at(-1);
  const interleavingBenefit = getInterleavingBenefit(task, previousTask);
  const difficultyPenalty = getDifficultyPenalty(task, input.mode);
  const historyPenalty = getHistoryPenalty(task, taskHistory);

  const priorityScore =
    ((forgettingScore + weaknessScore + examImportanceScore + interleavingBenefit) / 4 -
      difficultyPenalty * 0.25 -
      historyPenalty) *
    100;

  const reasons = [
    forgettingScore >= 0.55 ? "Memory is likely fading and ready for retrieval" : "",
    weaknessScore >= 0.55 ? "Concept remains unstable and needs reinforcement" : "",
    interleavingBenefit >= 0.75 ? "Adds contrast against the previous task" : "",
    examImportanceScore >= 0.75 ? "High-value exam requirement" : "",
    difficultyPenalty > 0 ? "Slightly outside the target difficulty band" : "",
    historyPenalty > 0.1 ? "Held back slightly because you saw it very recently" : "",
  ].filter(Boolean);

  return {
    priorityScore: Number(priorityScore.toFixed(1)),
    reasons: reasons.slice(0, 3),
  };
}

export function buildTaskMix(tasks: StudyTask[]) {
  const total = tasks.length || 1;

  return Object.entries(answerModeLabels)
    .map(([answerMode, label]) => {
      const count = tasks.filter((task) => task.answerMode === answerMode).length;

      return {
        label,
        count,
        share: Math.round((count / total) * 100),
      };
    })
    .filter((item): item is TaskMixItem => item.count > 0);
}

export function planAdaptiveSession(options: {
  input: SessionInput;
  subject: Subject;
  tasks: StudyTask[];
  conceptProgress: ConceptProgress[];
  taskHistory?: TaskHistory[];
  requirementWeights?: Record<string, number>;
  referenceDate?: Date;
}): PlannedSession {
  const {
    input,
    subject,
    tasks,
    conceptProgress,
    taskHistory = [],
    requirementWeights = {},
    referenceDate = new Date(),
  } = options;
  const conceptProgressMap = new Map(conceptProgress.map((concept) => [concept.id, concept]));
  const candidatePool = tasks.filter((task) => {
    const matchesSubject = task.subjectCode === input.subjectCode;
    const matchesExamComponent = input.examComponent
      ? task.examComponent === input.examComponent
      : true;
    const matchesTopic =
      input.topics && input.topics.length > 0
        ? input.topics.some((topic) => topic.toLowerCase() === task.topic.toLowerCase())
        : true;

    return matchesSubject && matchesExamComponent && matchesTopic;
  });

  const desiredTaskCount = input.taskCount ?? (input.mode === "exam" ? 5 : 4);
  const ordered: PlannedTask[] = [];
  const remaining = candidatePool.slice();

  while (ordered.length < desiredTaskCount && remaining.length > 0) {
    const ranked = remaining
      .map((task) => ({
        task,
        ...buildPriority({
          task,
          input,
          subjectCode: subject.code,
          conceptProgressMap,
          alreadySelected: ordered,
          taskHistory,
          requirementWeights,
          referenceDate,
        }),
      }))
      .sort((left, right) => right.priorityScore - left.priorityScore);

    const chosen = ranked[0];

    if (!chosen) {
      break;
    }

    ordered.push({
      ...chosen.task,
      priorityScore: chosen.priorityScore,
      reasons: chosen.reasons,
    });

    const index = remaining.findIndex((task) => task.id === chosen.task.id);
    remaining.splice(index, 1);
  }

  const dueConcepts = conceptProgress.filter(
    (concept) =>
      concept.subjectCode === input.subjectCode &&
      getElapsedDays(concept.nextDueAt, referenceDate) >= 0,
  ).length;

  return {
    id: `${input.mode}-${input.subjectCode}-${desiredTaskCount}`,
    mode: input.mode,
    subject,
    durationMinutes: input.durationMinutes ?? desiredTaskCount * 6,
    taskCount: desiredTaskCount,
    tasks: ordered,
    summary: {
      candidatePoolSize: candidatePool.length,
      dueConcepts,
      dominantGoal:
        input.mode === "learn"
          ? "Introduce fragile concepts with enough scaffolding to avoid random struggle."
          : input.mode === "review"
            ? "Clear overdue concepts before they drift into forgetting."
            : input.mode === "exam"
              ? "Rehearse official-style pacing without adaptive help."
              : "Strengthen unstable but familiar material under retrieval-first rules.",
      pacingLabel: modePacing[input.mode],
    },
  };
}

export function evaluateTaskAnswer(
  task: StudyTask,
  answer: string,
  confidence: ConfidenceLevel,
  hintLevel: number,
  referenceDate = new Date(),
): AttemptEvaluation {
  const normalizedInput = normalizeAnswer(answer);
  let result: TaskResult = "review";
  let verdict = "Provisional review";
  let score = 0.5;

  if (isOptionMode(task.answerMode) && task.correctAnswer) {
    result = normalizedInput.toUpperCase() === task.correctAnswer.toUpperCase() ? "correct" : "incorrect";
    verdict = result === "correct" ? "Correct choice" : "Not quite";
    score = result === "correct" ? 1 : 0;
  }

  if (task.answerMode === "numeric" && task.correctAnswer) {
    const entered = Number(answer.replace(",", "."));
    const expected = Number(task.correctAnswer.replace(",", "."));
    const tolerance = task.numericTolerance ?? 0;
    const isCorrect = Number.isFinite(entered)
      ? Math.abs(entered - expected) <= tolerance
      : false;
    result = isCorrect ? "correct" : "incorrect";
    verdict = isCorrect ? "Correct calculation" : "Check the setup";
    score = isCorrect ? 1 : 0;
  }

  if (
    (task.answerMode === "short_text" || task.answerMode === "fill_in") &&
    task.acceptedAnswers
  ) {
    const isCorrect = task.acceptedAnswers.some(
      (candidate) => normalizeAnswer(candidate) === normalizedInput,
    );
    result = isCorrect ? "correct" : "incorrect";
    verdict = isCorrect ? "Accepted answer" : "Answer not matched";
    score = isCorrect ? 1 : 0;
  }

  const confidencePenalty =
    result === "incorrect" && confidence === "high"
      ? 1
      : result === "incorrect" && confidence === "medium"
        ? 0.5
        : 0;
  const nextReviewDays =
    result === "incorrect"
      ? 1
      : hintLevel >= 2 || confidence === "low"
        ? 3
        : confidence === "high"
          ? 14
          : 7;

  const coachingNote =
    result === "review"
      ? "This answer mode stays lightly graded. Use the rubric and exemplar to self-check structure."
      : result === "correct"
        ? hintLevel === 0 && confidence === "high"
          ? "Strong retrieval. This concept can be scheduled farther out."
          : "Correct, but the system keeps the interval shorter because hints or uncertainty were involved."
        : confidencePenalty > 0
          ? "The miss was paired with high confidence, so the concept should return quickly with contrastive practice."
          : "Treat this as a productive miss. Review the concept cue first, then retry a similar item.";

  return {
    result,
    score,
    verdict,
    coachingNote,
    explanation: task.solution,
    nextReviewDays,
    nextReviewLabel:
      nextReviewDays === 1
        ? "Again tomorrow"
        : nextReviewDays === 3
          ? "Review in 3 days"
          : nextReviewDays === 7
            ? "Review in 1 week"
            : "Review in 2 weeks",
    nextDueAt: addDays(referenceDate, nextReviewDays),
  };
}
