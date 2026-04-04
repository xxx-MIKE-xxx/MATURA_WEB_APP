import type { AnswerMode, ConceptProgress, StudyTask, Subject } from "@/lib/domain/study-types";
import { getAssetUrl } from "@/lib/data/mappers/asset-url";
import type {
  PhysicsAssetRow,
  PhysicsConceptRow,
  PhysicsRequirementRow,
  PhysicsTaskBundleRow,
} from "@/lib/data/queries/physics-queries";

export const PHYSICS_SUBJECT_FALLBACK: Subject = {
  code: "physics",
  name: "Fizyka",
  shortName: "Physics",
  accent: "#9a5b2b",
  accentSoft: "#f1dfd2",
  focusLabel: "Model building under time pressure",
  focusDescription:
    "Tighten graph reading, formula selection, and the written logic behind short quantitative problems.",
  readiness: 61,
  dueReviews: 4,
  streak: 5,
};

function normalizeAnswerMode(answerMode?: string | null): AnswerMode {
  switch (answerMode) {
    case "mcq":
      return "mcq";
    case "multiple_choice":
      return "multiple_choice";
    case "true_false":
      return "true_false";
    case "numeric":
      return "numeric";
    case "short_text":
      return "short_text";
    case "fill_in":
      return "fill_in";
    case "essay":
      return "essay";
    case "graph_or_drawing":
      return "graph_or_drawing";
    case "derivation_or_proof":
      return "derivation_or_proof";
    case "oral":
      return "oral";
    default:
      return "essay";
  }
}

function readAnswerKeyValue<T>(answerKey: Record<string, unknown> | null | undefined, key: string) {
  const value = answerKey?.[key];
  return value as T | undefined;
}

function mapAssets(assets: PhysicsAssetRow[]) {
  return assets
    .slice()
    .sort((left, right) => {
      const positionDelta = left.position - right.position;

      if (positionDelta !== 0) {
        return positionDelta;
      }

      const pageLeft = left.page_number ?? Number.MAX_SAFE_INTEGER;
      const pageRight = right.page_number ?? Number.MAX_SAFE_INTEGER;
      const pageDelta = pageLeft - pageRight;

      if (pageDelta !== 0) {
        return pageDelta;
      }

      return left.storage_path.localeCompare(right.storage_path);
    })
    .map((asset) => ({
      id: asset.id,
      role: asset.role,
      storagePath: asset.storage_path,
      pageNumber: asset.page_number,
      position: asset.position,
      caption: asset.caption ?? asset.alt_text,
      publicUrl: getAssetUrl(asset.storage_path, asset.bucket ?? "assets"),
    }));
}

function getTopicMetadata(task: PhysicsTaskBundleRow["task"]) {
  const payload = task.payload_json;

  if (!payload || typeof payload !== "object") {
    return {
      topicSecondary: null,
      topicMixed: null,
    };
  }

  const topicSecondary =
    typeof payload.topic_secondary === "string" ? payload.topic_secondary : null;
  const topicMixed = typeof payload.topic_mixed === "string" ? payload.topic_mixed : null;

  return {
    topicSecondary,
    topicMixed,
  };
}

export function mapPhysicsTaskBundleToStudyTask(bundle: PhysicsTaskBundleRow): StudyTask {
  const answerKey = bundle.solution?.answer_key_json;
  const options = bundle.options.map((option) => ({
    key: option.option_key,
    label: option.option_text,
    isCorrect: option.is_correct,
  }));
  const correctOption = bundle.options.find((option) => option.is_correct);
  const acceptedAnswers = readAnswerKeyValue<string[]>(answerKey, "accepted");
  const numericTolerance = readAnswerKeyValue<number>(answerKey, "tolerance");
  const { topicSecondary, topicMixed } = getTopicMetadata(bundle.task);

  return {
    id: bundle.task.id,
    subjectCode: "physics",
    examComponent: bundle.examComponent?.code ?? bundle.examComponent?.name ?? "physics",
    topic: bundle.topic?.name ?? "Physics",
    title: bundle.task.title,
    prompt: bundle.task.prompt_md,
    stimulus: bundle.task.stimulus_md ?? undefined,
    answerMode: normalizeAnswerMode(bundle.taskType?.answer_mode),
    taskTypeLabel: bundle.taskType?.name ?? "Physics task",
    conceptIds: bundle.concepts
      .map((item) => item.concept?.id ?? item.concept_id)
      .filter(Boolean),
    requirementCodes: bundle.requirements
      .map((item) => item.requirement?.code ?? item.requirement_id)
      .filter(Boolean),
    difficultyBase: bundle.task.difficulty_base,
    cognitiveLoad: bundle.task.cognitive_load,
    estimatedTimeSec: bundle.task.estimated_time_sec,
    official: bundle.task.official,
    year: bundle.task.year ?? new Date().getUTCFullYear(),
    options: options.length > 0 ? options : undefined,
    correctAnswer: correctOption?.option_key ?? bundle.solution?.final_answer_text ?? undefined,
    acceptedAnswers,
    numericTolerance,
    explanation: bundle.solution?.official_scoring_md ?? bundle.solution?.solution_md ?? "",
    solution: bundle.solution?.solution_md ?? "",
    hints: bundle.hints.map((hint) => hint.hint_md),
    commonMistake: "Review the official solution and compare each step against your own setup.",
    assetItems: mapAssets(bundle.assets),
    sourceRef:
      bundle.task.external_source_ref ??
      [bundle.source?.provider, bundle.source?.title, bundle.source?.year]
        .filter(Boolean)
        .join(" • "),
    topicSecondary,
    topicMixed,
  };
}

export function createConceptProgressFromPhysicsBundle(
  concept: PhysicsConceptRow,
  requirement?: PhysicsRequirementRow | null,
): ConceptProgress {
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: concept.id,
    subjectCode: "physics",
    name: concept.name,
    topic: concept.code,
    requirement: requirement?.code ?? requirement?.name ?? "Physics requirement",
    masteryScore: 0.42,
    stabilityScore: 0.36,
    difficultyScore: 0.58,
    consecutiveSuccesses: 0,
    lastSeenAt: today,
    nextDueAt: today,
    lastResult: "incorrect",
    lifetimeAttempts: 0,
    lifetimeSuccesses: 0,
    avgResponseTimeSec: 0,
    hintDependencyScore: 0.34,
    confidenceCalibrationScore: 0.41,
    errorTrend: "No learner history yet",
  };
}

export function mergePhysicsSubject(
  subjectRow: Pick<Subject, "name"> | { name?: string | null } | null,
): Subject {
  return {
    ...PHYSICS_SUBJECT_FALLBACK,
    name: subjectRow?.name ?? PHYSICS_SUBJECT_FALLBACK.name,
  };
}
