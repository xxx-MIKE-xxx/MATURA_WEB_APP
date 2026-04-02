export type SubjectCode = "math" | "english" | "polish";
export type StudyMode = "learn" | "practice" | "review" | "exam";
export type AnswerMode = "mcq" | "numeric" | "short_text" | "essay" | "oral";
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

const TODAY = new Date("2026-04-01T09:00:00.000Z");
const EXAM_WINDOW = new Date("2026-05-05T08:00:00.000Z");

const subjects: Subject[] = [
  {
    code: "math",
    name: "Matematyka",
    shortName: "Math",
    accent: "#0f6d67",
    accentSoft: "#d4ede8",
    focusLabel: "Method selection under pressure",
    focusDescription:
      "Build faster recognition of the right theorem, algebra move, or probability setup.",
    readiness: 68,
    dueReviews: 8,
    streak: 12,
  },
  {
    code: "english",
    name: "English",
    shortName: "English",
    accent: "#c46c47",
    accentSoft: "#f3ddd3",
    focusLabel: "Accuracy with speed",
    focusDescription:
      "Tighten register, inference, and grammar choices so points stop leaking in easy sections.",
    readiness: 74,
    dueReviews: 6,
    streak: 9,
  },
  {
    code: "polish",
    name: "Polski",
    shortName: "Polish",
    accent: "#314861",
    accentSoft: "#dbe3ed",
    focusLabel: "Argument and context control",
    focusDescription:
      "Strengthen thesis quality, oral structure, and literary context selection without bloating answers.",
    readiness: 59,
    dueReviews: 5,
    streak: 7,
  },
];

const conceptProgress: ConceptProgress[] = [
  {
    id: "concept-pythagorean",
    subjectCode: "math",
    name: "Twierdzenie Pitagorasa",
    topic: "Geometria",
    requirement: "uses right-triangle properties",
    masteryScore: 0.46,
    stabilityScore: 0.38,
    difficultyScore: 0.54,
    consecutiveSuccesses: 1,
    lastSeenAt: "2026-03-28",
    nextDueAt: "2026-03-30",
    lastResult: "incorrect",
    lifetimeAttempts: 6,
    lifetimeSuccesses: 3,
    avgResponseTimeSec: 118,
    hintDependencyScore: 0.34,
    confidenceCalibrationScore: 0.49,
    errorTrend: "setup error",
  },
  {
    id: "concept-quadratic-roots",
    subjectCode: "math",
    name: "Miejsca zerowe funkcji kwadratowej",
    topic: "Algebra",
    requirement: "solves quadratic equations",
    masteryScore: 0.64,
    stabilityScore: 0.58,
    difficultyScore: 0.41,
    consecutiveSuccesses: 2,
    lastSeenAt: "2026-03-27",
    nextDueAt: "2026-04-02",
    lastResult: "hard",
    lifetimeAttempts: 8,
    lifetimeSuccesses: 5,
    avgResponseTimeSec: 102,
    hintDependencyScore: 0.21,
    confidenceCalibrationScore: 0.67,
    errorTrend: "algebra slip",
  },
  {
    id: "concept-classic-probability",
    subjectCode: "math",
    name: "Prawdopodobieństwo klasyczne",
    topic: "Statystyka i rachunek prawdopodobieństwa",
    requirement: "counts equally likely outcomes",
    masteryScore: 0.71,
    stabilityScore: 0.61,
    difficultyScore: 0.36,
    consecutiveSuccesses: 2,
    lastSeenAt: "2026-03-25",
    nextDueAt: "2026-04-03",
    lastResult: "correct",
    lifetimeAttempts: 7,
    lifetimeSuccesses: 5,
    avgResponseTimeSec: 93,
    hintDependencyScore: 0.16,
    confidenceCalibrationScore: 0.62,
    errorTrend: "diagram misread",
  },
  {
    id: "concept-tense-agreement",
    subjectCode: "english",
    name: "Tense agreement",
    topic: "Use of English",
    requirement: "selects correct grammar structure",
    masteryScore: 0.77,
    stabilityScore: 0.66,
    difficultyScore: 0.33,
    consecutiveSuccesses: 3,
    lastSeenAt: "2026-03-29",
    nextDueAt: "2026-04-05",
    lastResult: "correct",
    lifetimeAttempts: 10,
    lifetimeSuccesses: 8,
    avgResponseTimeSec: 61,
    hintDependencyScore: 0.08,
    confidenceCalibrationScore: 0.74,
    errorTrend: "grammar structure error",
  },
  {
    id: "concept-formal-register",
    subjectCode: "english",
    name: "Formal register",
    topic: "Writing",
    requirement: "writes formal email",
    masteryScore: 0.55,
    stabilityScore: 0.47,
    difficultyScore: 0.48,
    consecutiveSuccesses: 1,
    lastSeenAt: "2026-03-24",
    nextDueAt: "2026-03-31",
    lastResult: "hard",
    lifetimeAttempts: 5,
    lifetimeSuccesses: 3,
    avgResponseTimeSec: 84,
    hintDependencyScore: 0.28,
    confidenceCalibrationScore: 0.58,
    errorTrend: "register mismatch",
  },
  {
    id: "concept-reading-inference",
    subjectCode: "english",
    name: "Reading inference",
    topic: "Reading",
    requirement: "understands implied meaning",
    masteryScore: 0.62,
    stabilityScore: 0.57,
    difficultyScore: 0.44,
    consecutiveSuccesses: 2,
    lastSeenAt: "2026-03-26",
    nextDueAt: "2026-04-01",
    lastResult: "hard",
    lifetimeAttempts: 7,
    lifetimeSuccesses: 4,
    avgResponseTimeSec: 99,
    hintDependencyScore: 0.2,
    confidenceCalibrationScore: 0.52,
    errorTrend: "inference error",
  },
  {
    id: "concept-thesis-building",
    subjectCode: "polish",
    name: "Budowanie tezy",
    topic: "Interpretacja",
    requirement: "builds argument from prompt",
    masteryScore: 0.43,
    stabilityScore: 0.29,
    difficultyScore: 0.59,
    consecutiveSuccesses: 0,
    lastSeenAt: "2026-03-23",
    nextDueAt: "2026-03-29",
    lastResult: "incorrect",
    lifetimeAttempts: 4,
    lifetimeSuccesses: 1,
    avgResponseTimeSec: 145,
    hintDependencyScore: 0.41,
    confidenceCalibrationScore: 0.37,
    errorTrend: "no thesis",
  },
  {
    id: "concept-context-use",
    subjectCode: "polish",
    name: "Dobór kontekstu",
    topic: "Rozprawka i odpowiedź pisemna",
    requirement: "uses context precisely",
    masteryScore: 0.52,
    stabilityScore: 0.35,
    difficultyScore: 0.57,
    consecutiveSuccesses: 1,
    lastSeenAt: "2026-03-21",
    nextDueAt: "2026-03-30",
    lastResult: "incorrect",
    lifetimeAttempts: 5,
    lifetimeSuccesses: 2,
    avgResponseTimeSec: 136,
    hintDependencyScore: 0.32,
    confidenceCalibrationScore: 0.41,
    errorTrend: "wrong context use",
  },
  {
    id: "concept-oral-structure",
    subjectCode: "polish",
    name: "Struktura wypowiedzi ustnej",
    topic: "Matura ustna",
    requirement: "maintains oral response structure",
    masteryScore: 0.63,
    stabilityScore: 0.44,
    difficultyScore: 0.49,
    consecutiveSuccesses: 1,
    lastSeenAt: "2026-03-25",
    nextDueAt: "2026-04-01",
    lastResult: "hard",
    lifetimeAttempts: 6,
    lifetimeSuccesses: 3,
    avgResponseTimeSec: 171,
    hintDependencyScore: 0.18,
    confidenceCalibrationScore: 0.53,
    errorTrend: "ignored prompt constraint",
  },
];

const tasks: StudyTask[] = [
  {
    id: "math-pythagorean-001",
    subjectCode: "math",
    examComponent: "basic",
    topic: "Geometria",
    title: "Right triangle side length",
    prompt:
      "W trójkącie prostokątnym przyprostokątne mają długości 6 i 8. Oblicz długość przeciwprostokątnej.",
    answerMode: "numeric",
    taskTypeLabel: "Open numeric",
    conceptIds: ["concept-pythagorean"],
    requirementCodes: ["uses right-triangle properties"],
    difficultyBase: 3,
    cognitiveLoad: "low",
    estimatedTimeSec: 75,
    official: true,
    year: 2024,
    correctAnswer: "10",
    numericTolerance: 0,
    explanation:
      "This is a direct retrieval task. The main risk is picking an area or perimeter routine instead of the theorem.",
    solution:
      "Apply a^2 + b^2 = c^2. 6^2 + 8^2 = 36 + 64 = 100, so c = 10.",
    hints: [
      "Which relationship connects the three sides in a right triangle?",
      "Square the two shorter sides before adding them.",
      "You should obtain 100 before taking the square root.",
      "The hypotenuse is the positive square root of 100.",
    ],
    commonMistake: "Adding the sides directly instead of working with squares.",
  },
  {
    id: "math-pythagorean-002",
    subjectCode: "math",
    examComponent: "basic",
    topic: "Geometria",
    title: "Choose the right theorem",
    prompt:
      "Który warunek pozwala od razu rozpoznać, że trójkąt o bokach 9, 12, 15 jest prostokątny?",
    answerMode: "mcq",
    taskTypeLabel: "Multiple choice",
    conceptIds: ["concept-pythagorean"],
    requirementCodes: ["uses right-triangle properties"],
    difficultyBase: 4,
    cognitiveLoad: "medium",
    estimatedTimeSec: 90,
    official: true,
    year: 2023,
    options: [
      { key: "A", label: "9 + 12 = 21, więc 21 > 15" },
      { key: "B", label: "9^2 + 12^2 = 15^2" },
      { key: "C", label: "9 x 12 = 108" },
      { key: "D", label: "15 - 12 = 3" },
    ],
    correctAnswer: "B",
    explanation:
      "This version checks theorem selection rather than direct computation, so it discriminates between recognition and execution.",
    solution: "Compute 9^2 + 12^2 = 81 + 144 = 225 = 15^2, so option B is correct.",
    hints: [
      "You are not asked to compute an angle; you are asked to recognize the triangle type.",
      "Compare the square of the longest side with the sum of squares of the other two sides.",
      "81 + 144 should match the square of 15.",
      "Since the equality holds, the triangle is right-angled.",
    ],
    commonMistake: "Checking only whether the three lengths can build a triangle, not whether it is right-angled.",
  },
  {
    id: "math-quadratic-001",
    subjectCode: "math",
    examComponent: "basic",
    topic: "Algebra",
    title: "Roots of a quadratic",
    prompt: "Podaj miejsca zerowe funkcji f(x) = x^2 - 5x + 6.",
    answerMode: "short_text",
    taskTypeLabel: "Short answer",
    conceptIds: ["concept-quadratic-roots"],
    requirementCodes: ["solves quadratic equations"],
    difficultyBase: 5,
    cognitiveLoad: "medium",
    estimatedTimeSec: 110,
    official: true,
    year: 2024,
    acceptedAnswers: ["2 and 3", "2, 3", "x=2 and x=3", "2 oraz 3", "x=2, x=3"],
    explanation:
      "The task is straightforward, but it checks factor recognition and sign discipline under mild time pressure.",
    solution: "Factor the expression: x^2 - 5x + 6 = (x - 2)(x - 3), so the roots are 2 and 3.",
    hints: [
      "Find two numbers whose product is 6 and whose sum is 5.",
      "Because the middle term is -5x, both brackets must be subtraction.",
      "Rewrite the quadratic as a product of two linear factors.",
      "Each factor gives one root after setting it equal to zero.",
    ],
    commonMistake: "Finding numbers with the correct product but the wrong sign pattern.",
  },
  {
    id: "math-probability-001",
    subjectCode: "math",
    examComponent: "basic",
    topic: "Statystyka i rachunek prawdopodobieństwa",
    title: "Simple probability",
    prompt:
      "Rzucamy zwykłą kostką sześcienną. Jakie jest prawdopodobieństwo otrzymania liczby większej niż 4?",
    answerMode: "short_text",
    taskTypeLabel: "Short answer",
    conceptIds: ["concept-classic-probability"],
    requirementCodes: ["counts equally likely outcomes"],
    difficultyBase: 2,
    cognitiveLoad: "low",
    estimatedTimeSec: 55,
    official: true,
    year: 2022,
    acceptedAnswers: ["1/3", "2/6", "0.333", "0,333"],
    explanation:
      "This is an ideal review task: low load, high retrieval value, and easy to grade automatically.",
    solution:
      "Outcomes greater than 4 are 5 and 6, so there are 2 favorable outcomes out of 6. That simplifies to 1/3.",
    hints: [
      "List the outcomes that satisfy the condition.",
      "How many equally likely outcomes does the die have in total?",
      "Create the fraction favorable over total.",
      "Simplify the fraction if possible.",
    ],
    commonMistake: "Using 2/5 because the condition mentions numbers above 4.",
  },
  {
    id: "english-tense-001",
    subjectCode: "english",
    examComponent: "use-of-english",
    topic: "Use of English",
    title: "Choose the correct tense",
    prompt:
      "Complete the sentence: I ______ for the bus for twenty minutes when it finally arrived.",
    answerMode: "short_text",
    taskTypeLabel: "Open short answer",
    conceptIds: ["concept-tense-agreement"],
    requirementCodes: ["selects correct grammar structure"],
    difficultyBase: 4,
    cognitiveLoad: "medium",
    estimatedTimeSec: 70,
    official: false,
    year: 2025,
    acceptedAnswers: ["had been waiting"],
    explanation:
      "The time marker and the later finished event signal a past perfect continuous construction.",
    solution:
      "The correct answer is 'had been waiting' because the waiting started before another past action.",
    hints: [
      "There are two past moments here: the waiting and the arrival.",
      "The longer action started first and continued up to the second event.",
      "Use past perfect plus a continuous form.",
      "The complete phrase is 'had been waiting'.",
    ],
    commonMistake: "Using present perfect because of the duration phrase.",
  },
  {
    id: "english-register-001",
    subjectCode: "english",
    examComponent: "writing",
    topic: "Writing",
    title: "Formal email register",
    prompt:
      "Which opening fits a formal email to a school coordinator asking for additional exam practice materials?",
    answerMode: "mcq",
    taskTypeLabel: "Multiple choice",
    conceptIds: ["concept-formal-register"],
    requirementCodes: ["writes formal email"],
    difficultyBase: 5,
    cognitiveLoad: "medium",
    estimatedTimeSec: 80,
    official: false,
    year: 2025,
    options: [
      { key: "A", label: "Hi there, I need some worksheets." },
      { key: "B", label: "Dear Ms Kowalska, I am writing to ask whether..." },
      { key: "C", label: "Hey, could you send me..." },
      { key: "D", label: "What’s up? I wanted to ask..." },
    ],
    correctAnswer: "B",
    explanation:
      "Register tasks should feel deceptively easy. The goal is to make the formal pattern automatic.",
    solution:
      "Option B is correct because it uses an appropriate salutation and an indirect, polite request.",
    hints: [
      "Think about tone first, not just meaning.",
      "A formal message should use a title and a polite framing device.",
      "Look for the option that sounds neutral, complete, and respectful.",
      "The correct option begins with 'Dear Ms Kowalska'.",
    ],
    commonMistake: "Choosing a friendly everyday opening that would be fine in peer-to-peer writing.",
  },
  {
    id: "english-reading-001",
    subjectCode: "english",
    examComponent: "reading",
    topic: "Reading",
    title: "Inference from context",
    prompt:
      "The author writes that the city 'woke reluctantly under a sky the colour of old silver'. What does this suggest most strongly?",
    answerMode: "mcq",
    taskTypeLabel: "Multiple choice",
    conceptIds: ["concept-reading-inference"],
    requirementCodes: ["understands implied meaning"],
    difficultyBase: 6,
    cognitiveLoad: "medium",
    estimatedTimeSec: 95,
    official: false,
    year: 2025,
    options: [
      { key: "A", label: "The city was loud and festive." },
      { key: "B", label: "The morning felt dull and heavy." },
      { key: "C", label: "The weather was extremely hot." },
      { key: "D", label: "The streets were brightly coloured." },
    ],
    correctAnswer: "B",
    explanation:
      "Inference items reward tone recognition and discourages literal keyword matching.",
    solution:
      "Option B best matches the image of a reluctant awakening and a grey, metallic sky.",
    hints: [
      "Look for mood, not concrete facts.",
      "Both 'reluctantly' and 'old silver' carry a subdued tone.",
      "The correct answer should reflect heaviness or lack of energy.",
      "Option B captures that atmosphere best.",
    ],
    commonMistake: "Choosing an option with a repeated word from the sentence instead of matching the tone.",
  },
  {
    id: "polish-thesis-001",
    subjectCode: "polish",
    examComponent: "written-basic",
    topic: "Interpretacja",
    title: "Build a thesis from the prompt",
    prompt:
      "Prompt: 'Czy samotność zawsze osłabia człowieka?' Write one concise thesis sentence that could open a matura paragraph response.",
    answerMode: "essay",
    taskTypeLabel: "Paragraph seed",
    conceptIds: ["concept-thesis-building"],
    requirementCodes: ["builds argument from prompt"],
    difficultyBase: 6,
    cognitiveLoad: "high",
    estimatedTimeSec: 180,
    official: false,
    year: 2025,
    explanation:
      "This is not auto-scored as a high-stakes task. The product uses it to rehearse claim precision and direction.",
    solution:
      "Example thesis: 'Samotność nie zawsze osłabia człowieka, ponieważ może stać się warunkiem samopoznania i świadomej decyzji.'",
    hints: [
      "A strong thesis takes a position, not just restates the topic.",
      "Try adding a because-clause to force argumentative direction.",
      "Avoid saying 'sometimes yes, sometimes no' unless the task explicitly invites balance.",
      "Write one sentence that could guide the whole paragraph.",
    ],
    commonMistake: "Producing a thematic statement without a clear stance.",
  },
  {
    id: "polish-context-001",
    subjectCode: "polish",
    examComponent: "written-basic",
    topic: "Rozprawka i odpowiedź pisemna",
    title: "Choose a usable context",
    prompt:
      "You are arguing that ambition can isolate a character from others. Which literary context would be the strongest support?",
    answerMode: "mcq",
    taskTypeLabel: "Multiple choice",
    conceptIds: ["concept-context-use"],
    requirementCodes: ["uses context precisely"],
    difficultyBase: 5,
    cognitiveLoad: "medium",
    estimatedTimeSec: 85,
    official: false,
    year: 2025,
    options: [
      { key: "A", label: "A general statement that literature often includes ambition." },
      { key: "B", label: "Balladyna as a figure whose ambition destroys bonds and drives moral isolation." },
      { key: "C", label: "A summary of your own school experience." },
      { key: "D", label: "A list of all works read in class." },
    ],
    correctAnswer: "B",
    explanation:
      "The best context is precise, relevant, and already does argumentative work for the student.",
    solution:
      "Option B is strongest because it directly links ambition to broken relationships and isolation.",
    hints: [
      "The strongest context is specific, not generic.",
      "Look for a work that naturally proves the whole claim, not just part of it.",
      "A named text and character usually beat a vague summary.",
      "Balladyna is the most argument-ready option here.",
    ],
    commonMistake: "Choosing a context that is familiar but does not actually prove the claim.",
  },
  {
    id: "polish-oral-001",
    subjectCode: "polish",
    examComponent: "oral",
    topic: "Matura ustna",
    title: "Oral prompt skeleton",
    prompt:
      "Jawne pytanie: 'Jaką funkcję pełni bunt bohatera literackiego?' Draft a 3-part speaking outline: thesis, literary example, context.",
    answerMode: "oral",
    taskTypeLabel: "Oral prompt",
    conceptIds: ["concept-oral-structure"],
    requirementCodes: ["maintains oral response structure"],
    difficultyBase: 7,
    cognitiveLoad: "high",
    estimatedTimeSec: 240,
    official: true,
    year: 2025,
    explanation:
      "Oral tasks stay lightly scaffolded in the MVP. The app focuses on structure and self-evaluation rather than pretending to be an examiner.",
    solution:
      "A strong outline states the function of rebellion, anchors it in one literary work, and adds a concise cultural or historical context.",
    hints: [
      "Start with one claim you can defend in under a minute.",
      "Choose one text first, then build the rest around it.",
      "Your context should deepen the same idea instead of opening a new thread.",
      "Aim for a clean thesis-example-context arc.",
    ],
    commonMistake: "Listing several texts without a controlling idea.",
  },
];

const taskHistory: TaskHistory[] = [
  {
    taskId: "math-pythagorean-001",
    timesSeen: 2,
    lastSeenAt: "2026-03-28",
    lastResult: "incorrect",
    lastConfidence: "high",
    lastHintLevelUsed: 2,
  },
  {
    taskId: "math-quadratic-001",
    timesSeen: 2,
    lastSeenAt: "2026-03-27",
    lastResult: "correct",
    lastConfidence: "medium",
    lastHintLevelUsed: 1,
  },
  {
    taskId: "english-register-001",
    timesSeen: 1,
    lastSeenAt: "2026-03-24",
    lastResult: "incorrect",
    lastConfidence: "medium",
    lastHintLevelUsed: 1,
  },
  {
    taskId: "polish-context-001",
    timesSeen: 1,
    lastSeenAt: "2026-03-21",
    lastResult: "incorrect",
    lastConfidence: "high",
    lastHintLevelUsed: 1,
  },
];

const analyticsSeries: Record<SubjectCode, AnalyticsPoint[]> = {
  math: [
    { label: "Week -4", value: 42 },
    { label: "Week -3", value: 49 },
    { label: "Week -2", value: 56 },
    { label: "Week -1", value: 63 },
    { label: "This week", value: 68 },
  ],
  english: [
    { label: "Week -4", value: 58 },
    { label: "Week -3", value: 61 },
    { label: "Week -2", value: 65 },
    { label: "Week -1", value: 70 },
    { label: "This week", value: 74 },
  ],
  polish: [
    { label: "Week -4", value: 36 },
    { label: "Week -3", value: 41 },
    { label: "Week -2", value: 46 },
    { label: "Week -1", value: 53 },
    { label: "This week", value: 59 },
  ],
};

const importJobs: ImportJob[] = [
  {
    id: "imp-cke-math-2024",
    source: "CKE Matematyka Podstawa 2024",
    status: "reviewing",
    itemCount: 18,
    createdAt: "2026-03-29",
  },
  {
    id: "imp-oral-polish-2025",
    source: "Jawne pytania ustne 2025",
    status: "ready",
    itemCount: 24,
    createdAt: "2026-03-25",
  },
  {
    id: "imp-eng-writing-bank",
    source: "Internal English writing prompts",
    status: "queued",
    itemCount: 12,
    createdAt: "2026-03-30",
  },
];

const requirementWeights: Record<string, number> = {
  "uses right-triangle properties": 8,
  "solves quadratic equations": 9,
  "counts equally likely outcomes": 7,
  "selects correct grammar structure": 8,
  "writes formal email": 8,
  "understands implied meaning": 8,
  "builds argument from prompt": 9,
  "uses context precisely": 9,
  "maintains oral response structure": 7,
};

const difficultyBands: Record<StudyMode, [number, number]> = {
  learn: [2, 5],
  practice: [3, 7],
  review: [2, 6],
  exam: [4, 8],
};

const modePacing: Record<StudyMode, string> = {
  learn: "Primer + guided practice",
  practice: "Independent first, feedback fast",
  review: "Short, due-first retrieval",
  exam: "Timed, no-adaptive-hint block",
};

function daysBetween(date: string) {
  const diffMs = TODAY.getTime() - new Date(`${date}T09:00:00.000Z`).getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function addDays(days: number) {
  const next = new Date(TODAY);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:()]/g, "");
}

function getSubjectByCode(subjectCode: SubjectCode) {
  const subject = subjects.find((item) => item.code === subjectCode);
  if (!subject) {
    throw new Error(`Unknown subject: ${subjectCode}`);
  }

  return subject;
}

function getTaskHistory(taskId: string) {
  return taskHistory.find((item) => item.taskId === taskId);
}

function getConceptById(conceptId: string) {
  const concept = conceptProgress.find((item) => item.id === conceptId);
  if (!concept) {
    throw new Error(`Unknown concept: ${conceptId}`);
  }

  return concept;
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

const RETENTION_HORIZON_DAYS = 14;

function sharedConceptCount(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
}

function getElapsedDays(date?: string) {
  if (!date) {
    return 0;
  }

  return Math.max(daysBetween(date), 0);
}

function getConceptForgettingProbability(concept: ConceptProgress) {
  const elapsedDays = getElapsedDays(concept.lastSeenAt);
  const stabilityDays = Math.max(1, concept.stabilityScore * RETENTION_HORIZON_DAYS);
  const retention = Math.exp(-elapsedDays / stabilityDays);

  return clamp(1 - retention, 0, 1);
}

function getTaskForgettingScore(progress: ConceptProgress[]) {
  return average(progress.map((concept) => getConceptForgettingProbability(concept)));
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

function getTaskExamImportanceScore(task: StudyTask) {
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

function buildPriority(task: StudyTask, input: SessionInput, alreadySelected: StudyTask[]) {
  const progress = task.conceptIds.map(getConceptById);
  const forgettingScore = getTaskForgettingScore(progress);
  const weaknessScore = getTaskWeaknessScore(progress);
  const examImportanceScore = getTaskExamImportanceScore(task);

  const previousTask = alreadySelected.at(-1);
  const interleavingBenefit = getInterleavingBenefit(task, previousTask);
  const difficultyPenalty = getDifficultyPenalty(task, input.mode);

  const priorityScore =
    ((forgettingScore + weaknessScore + examImportanceScore + interleavingBenefit) / 4 -
      difficultyPenalty * 0.25) *
    100;

  const reasons = [
    forgettingScore >= 0.55 ? "Memory is likely fading and ready for retrieval" : "",
    weaknessScore >= 0.55 ? "Concept remains unstable and needs reinforcement" : "",
    interleavingBenefit >= 0.75 ? "Adds contrast against the previous task" : "",
    examImportanceScore >= 0.75 ? "High-value exam requirement" : "",
    difficultyPenalty > 0 ? "Slightly outside the target difficulty band" : "",
  ].filter(Boolean);

  return {
    priorityScore: Number(priorityScore.toFixed(1)),
    reasons: reasons.slice(0, 3),
  };
}

function getTrend(series: AnalyticsPoint[]) {
  if (series.length < 2) {
    return 0;
  }

  return series.at(-1)!.value - series.at(-2)!.value;
}

function getVolatility(series: AnalyticsPoint[]) {
  if (series.length < 2) {
    return 0;
  }

  const deltas = series.slice(1).map((point, index) =>
    Math.abs(point.value - series[index].value),
  );

  return average(deltas);
}

function getTaskMix(subjectCode?: SubjectCode) {
  const scopedTasks = getTasks(subjectCode);
  const labels: Record<AnswerMode, string> = {
    mcq: "MCQ",
    numeric: "Numeric",
    short_text: "Short text",
    essay: "Writing",
    oral: "Oral",
  };

  const total = scopedTasks.length || 1;

  return (Object.keys(labels) as AnswerMode[])
    .map((answerMode) => {
      const count = scopedTasks.filter((task) => task.answerMode === answerMode).length;

      return {
        label: labels[answerMode],
        count,
        share: Math.round((count / total) * 100),
      };
    })
    .filter((item) => item.count > 0);
}

function getSubjectInsight(subjectCode: SubjectCode): SubjectInsight {
  const subject = getSubjectByCode(subjectCode);
  const concepts = getSubjectConcepts(subjectCode);
  const series = analyticsSeries[subjectCode];
  const weakestConcept = getWeakestConcepts(1, subjectCode)[0];
  const strongestConcept = concepts
    .slice()
    .sort(
      (left, right) =>
        right.masteryScore + right.stabilityScore - (left.masteryScore + left.stabilityScore),
    )[0];

  const accuracy = Math.round(
    (sum(concepts.map((concept) => concept.lifetimeSuccesses)) /
      Math.max(sum(concepts.map((concept) => concept.lifetimeAttempts)), 1)) *
      100,
  );
  const stability = average(concepts.map((concept) => concept.stabilityScore)) * 100;
  const calibration = Math.round(
    average(concepts.map((concept) => concept.confidenceCalibrationScore)) * 100,
  );
  const confidenceValue = Math.round(stability * 0.58 + calibration * 0.42);
  const trend = getTrend(series);
  const volatility = getVolatility(series);
  const predictedScore = clamp(
    Math.round(subject.readiness * 0.72 + confidenceValue * 0.18 + trend * 1.2),
    35,
    96,
  );
  const rangeRadius = clamp(Math.round(13 - confidenceValue / 10 + volatility / 2), 4, 11);
  const reviewCompletionRate = clamp(
    Math.round(74 + subject.streak * 1.8 - subject.dueReviews * 1.4 + confidenceValue * 0.12),
    58,
    98,
  );
  const consistency = clamp(
    Math.round(100 - volatility * 3.2 - subject.dueReviews * 1.8 + subject.streak),
    42,
    96,
  );
  const hintDependency = Math.round(
    average(concepts.map((concept) => concept.hintDependencyScore)) * 100,
  );
  const avgResponseTimeSec = Math.round(
    average(concepts.map((concept) => concept.avgResponseTimeSec)),
  );
  const studyHours = Number(
    (
      sum(
        concepts.map(
          (concept) => (concept.lifetimeAttempts * concept.avgResponseTimeSec) / 3600,
        ),
      ) * 1.25
    ).toFixed(1),
  );
  const urgentConceptCount = getDueConcepts(subjectCode).length;

  return {
    code: subject.code,
    name: subject.name,
    shortName: subject.shortName,
    accent: subject.accent,
    accentSoft: subject.accentSoft,
    readiness: subject.readiness,
    predictedScore,
    rangeLow: clamp(predictedScore - rangeRadius, 30, 95),
    rangeHigh: clamp(predictedScore + rangeRadius, 34, 99),
    confidenceLabel:
      confidenceValue >= 72 ? "High confidence" : confidenceValue >= 56 ? "Steady" : "Building",
    confidenceValue,
    trend,
    consistency,
    dueReviews: subject.dueReviews,
    streak: subject.streak,
    accuracy,
    avgResponseTimeSec,
    hintDependency,
    calibration,
    studyHours,
    reviewCompletionRate,
    urgentConceptCount,
    bestNextStep: `Tighten ${weakestConcept.name.toLowerCase()} before the next timed block.`,
    weakestConcept,
    strongestConcept,
    taskMix: getTaskMix(subjectCode),
  };
}

function getOverallInsight(subjectInsights: SubjectInsight[]): OverallInsight {
  const readiness = Math.round(average(subjectInsights.map((subject) => subject.readiness)));
  const predictedScore = Math.round(
    average(subjectInsights.map((subject) => subject.predictedScore)),
  );
  const rangeLow = Math.round(average(subjectInsights.map((subject) => subject.rangeLow)));
  const rangeHigh = Math.round(average(subjectInsights.map((subject) => subject.rangeHigh)));
  const confidenceValue = Math.round(
    average(subjectInsights.map((subject) => subject.confidenceValue)),
  );

  return {
    readiness,
    predictedScore,
    rangeLow,
    rangeHigh,
    confidenceLabel:
      confidenceValue >= 72 ? "High confidence" : confidenceValue >= 56 ? "Steady" : "Building",
    confidenceValue,
    dueReviews: sum(subjectInsights.map((subject) => subject.dueReviews)),
    accuracy: Math.round(average(subjectInsights.map((subject) => subject.accuracy))),
    studyHours: Number(sum(subjectInsights.map((subject) => subject.studyHours)).toFixed(1)),
    reviewCompletionRate: Math.round(
      average(subjectInsights.map((subject) => subject.reviewCompletionRate)),
    ),
    consistency: Math.round(average(subjectInsights.map((subject) => subject.consistency))),
    streak: Math.max(...subjectInsights.map((subject) => subject.streak)),
  };
}

export function getSubjects() {
  return subjects;
}

export function getStudyModes() {
  return [
    {
      id: "learn" as const,
      name: "Learn",
      description: "Primer, worked example, guided turn, then independent retrieval.",
    },
    {
      id: "practice" as const,
      name: "Practice",
      description: "Independent first, with targeted hints only after commitment.",
    },
    {
      id: "review" as const,
      name: "Review",
      description: "Due-first spaced repetition with tight pacing and light scaffolds.",
    },
    {
      id: "exam" as const,
      name: "Exam",
      description: "Official-style distribution, realistic timing, analysis after submission.",
    },
  ];
}

export function getSubjectConcepts(subjectCode?: SubjectCode) {
  return subjectCode
    ? conceptProgress.filter((item) => item.subjectCode === subjectCode)
    : conceptProgress;
}

export function getWeakestConcepts(limit = 4, subjectCode?: SubjectCode) {
  return getSubjectConcepts(subjectCode)
    .slice()
    .sort(
      (left, right) =>
        left.masteryScore +
        left.stabilityScore +
        left.confidenceCalibrationScore -
        (right.masteryScore + right.stabilityScore + right.confidenceCalibrationScore),
    )
    .slice(0, limit);
}

export function getDueConcepts(subjectCode?: SubjectCode) {
  return getSubjectConcepts(subjectCode)
    .filter((item) => daysBetween(item.nextDueAt) >= 0)
    .sort((left, right) => daysBetween(right.nextDueAt) - daysBetween(left.nextDueAt));
}

export function getTasks(subjectCode?: SubjectCode) {
  return subjectCode ? tasks.filter((item) => item.subjectCode === subjectCode) : tasks;
}

export function getTaskById(taskId: string) {
  return tasks.find((task) => task.id === taskId) ?? null;
}

export function getRecentMistakes() {
  return [
    {
      label: "Math: theorem selection",
      detail: "Pythagorean questions are correct only after hints.",
    },
    {
      label: "English: register drift",
      detail: "Formal writing switches to spoken phrasing under time pressure.",
    },
    {
      label: "Polish: thesis softness",
      detail: "Openings restate the topic instead of taking a position.",
    },
  ];
}

export function getCountdownDays() {
  return Math.ceil(
    (EXAM_WINDOW.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function getSubjectInsights() {
  return subjects.map((subject) => getSubjectInsight(subject.code));
}

export function getDashboardSnapshot() {
  const subjectInsights = getSubjectInsights();
  const overall = getOverallInsight(subjectInsights);
  const recommended = planAdaptiveSession({
    subjectCode: "math",
    mode: "practice",
    durationMinutes: 28,
    taskCount: 4,
  });

  return {
    countdownDays: getCountdownDays(),
    overall,
    recommended,
    subjectInsights,
    nextAction: `Clear ${recommended.subject.name} ${recommended.mode} first, then switch to your weakest written skill.`,
    dueConcepts: getDueConcepts(),
    weakestConcepts: getWeakestConcepts(),
    recentMistakes: getRecentMistakes(),
  };
}

export function planAdaptiveSession(input: SessionInput): PlannedSession {
  const subject = getSubjectByCode(input.subjectCode);
  const candidatePool = tasks.filter((task) => {
    const matchesSubject = task.subjectCode === input.subjectCode;
    const matchesExamComponent = input.examComponent
      ? task.examComponent === input.examComponent
      : true;
    const matchesTopic =
      input.topics && input.topics.length > 0
        ? input.topics.some(
            (topic) => topic.toLowerCase() === task.topic.toLowerCase(),
          )
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
        ...buildPriority(task, input, ordered),
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

  return {
    id: `${input.mode}-${input.subjectCode}-${desiredTaskCount}`,
    mode: input.mode,
    subject,
    durationMinutes: input.durationMinutes ?? desiredTaskCount * 6,
    taskCount: desiredTaskCount,
    tasks: ordered,
    summary: {
      candidatePoolSize: candidatePool.length,
      dueConcepts: getDueConcepts(input.subjectCode).length,
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
): AttemptEvaluation {
  const normalizedInput = normalizeAnswer(answer);
  let result: TaskResult = "review";
  let verdict = "Provisional review";
  let score = 0.5;

  if (task.answerMode === "mcq" && task.correctAnswer) {
    result = normalizedInput.toUpperCase() === task.correctAnswer ? "correct" : "incorrect";
    verdict = result === "correct" ? "Correct choice" : "Not quite";
    score = result === "correct" ? 1 : 0;
  }

  if (task.answerMode === "numeric" && task.correctAnswer) {
    const entered = Number(answer.replace(",", "."));
    const expected = Number(task.correctAnswer);
    const tolerance = task.numericTolerance ?? 0;
    const isCorrect = Number.isFinite(entered)
      ? Math.abs(entered - expected) <= tolerance
      : false;
    result = isCorrect ? "correct" : "incorrect";
    verdict = isCorrect ? "Correct calculation" : "Check the setup";
    score = isCorrect ? 1 : 0;
  }

  if (task.answerMode === "short_text" && task.acceptedAnswers) {
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
    nextDueAt: addDays(nextReviewDays),
  };
}

export function getAnalyticsSnapshot() {
  const subjectInsights = getSubjectInsights();
  const overall = getOverallInsight(subjectInsights);
  const labels = analyticsSeries.math.map((point) => point.label);

  return {
    overall,
    subjectInsights,
    subjectSeries: analyticsSeries,
    mostDelayed: getDueConcepts().slice(0, 5),
    strongestSubjects: subjects.slice().sort((left, right) => right.readiness - left.readiness),
    taskMix: getTaskMix(),
    scoreHistory: labels.map((label) => ({
      label,
      value: Math.round(
        average(
          Object.values(analyticsSeries).map(
            (series) => series.find((point) => point.label === label)?.value ?? 0,
          ),
        ),
      ),
    })),
  };
}

export function getAdminSnapshot() {
  return {
    totalTasks: tasks.length,
    publishedTasks: tasks.filter((task) => task.official || task.year >= 2024).length,
    reviewQueueCount: 9,
    importJobs,
  };
}

export function getSources() {
  return [
    {
      title: "CKE Matematyka Podstawa 2024",
      type: "official_exam",
      year: 2024,
      status: "verified",
    },
    {
      title: "Jawne pytania ustne 2025",
      type: "official_oral_bank",
      year: 2025,
      status: "verified",
    },
    {
      title: "Internal English writing bank",
      type: "manual",
      year: 2025,
      status: "needs metadata review",
    },
  ];
}

export function getImportJobs() {
  return importJobs;
}
