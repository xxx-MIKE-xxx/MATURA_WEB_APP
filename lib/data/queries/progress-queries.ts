import "server-only";

import type { AttemptEvaluation, ConfidenceLevel } from "@/lib/domain/study-types";
import { getPhysicsTaskBundle } from "@/lib/data/queries/physics-queries";
import { getServerSupabase } from "@/lib/supabase/server";

type PersistPhysicsAttemptInput = {
  userId: string;
  taskId: string;
  answer: string;
  confidence: ConfidenceLevel;
  hintLevel: number;
  responseTimeSec?: number;
  evaluation: AttemptEvaluation;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function confidenceToScore(confidence: ConfidenceLevel) {
  switch (confidence) {
    case "low":
      return 0.33;
    case "medium":
      return 0.66;
    case "high":
      return 1;
  }
}

function toTimestamp(value: string) {
  return `${value}T09:00:00.000Z`;
}

export async function insertTaskAttempt(input: PersistPhysicsAttemptInput) {
  const supabase = await getServerSupabase({ serviceRole: true });
  const { data, error } = await supabase
    .from("task_attempts")
    .insert({
      user_id: input.userId,
      task_id: input.taskId,
      submitted_answer_json: {
        answer: input.answer,
      },
      result: input.evaluation.result,
      auto_score: input.evaluation.result === "review" ? null : input.evaluation.score,
      response_time_sec: input.responseTimeSec ?? null,
      confidence: input.confidence,
      hint_level_used: input.hintLevel,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function upsertUserTaskProgress(input: PersistPhysicsAttemptInput) {
  const supabase = await getServerSupabase({ serviceRole: true });
  const { data: existingRows, error: existingError } = await supabase
    .from("user_task_progress")
    .select(
      "id, user_id, task_id, last_seen_at, times_seen, last_result, last_response_time_sec, last_confidence, last_hint_level_used, suspended_until",
    )
    .eq("user_id", input.userId)
    .eq("task_id", input.taskId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  const timesSeen = (existingRows?.times_seen ?? 0) + 1;
  const { error } = await supabase.from("user_task_progress").upsert(
    {
      user_id: input.userId,
      task_id: input.taskId,
      last_seen_at: new Date().toISOString(),
      times_seen: timesSeen,
      last_result: input.evaluation.result,
      last_response_time_sec: input.responseTimeSec ?? null,
      last_confidence: input.confidence,
      last_hint_level_used: input.hintLevel,
    },
    {
      onConflict: "user_id,task_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function upsertUserConceptProgress(input: PersistPhysicsAttemptInput) {
  const bundle = await getPhysicsTaskBundle(input.taskId);

  if (!bundle) {
    return;
  }

  const conceptIds = bundle.concepts
    .map((item) => item.concept?.id ?? item.concept_id)
    .filter(Boolean);

  if (conceptIds.length === 0) {
    return;
  }

  const supabase = await getServerSupabase({ serviceRole: true });
  const { data: existingRows, error: existingError } = await supabase
    .from("user_concept_progress")
    .select(
      "id, user_id, concept_id, mastery_score, stability_score, difficulty_score, consecutive_successes, last_seen_at, next_due_at, last_result, lifetime_attempts, lifetime_successes, avg_response_time_sec, hint_dependency_score, confidence_calibration_score",
    )
    .eq("user_id", input.userId)
    .in("concept_id", conceptIds);

  if (existingError) {
    throw existingError;
  }

  const existingMap = new Map((existingRows ?? []).map((row) => [row.concept_id, row]));
  const confidenceCalibration = 1 - Math.abs(input.evaluation.score - confidenceToScore(input.confidence));

  const rows = conceptIds.map((conceptId) => {
    const previous = existingMap.get(conceptId);
    const lifetimeAttempts = (previous?.lifetime_attempts ?? 0) + 1;
    const lifetimeSuccesses =
      (previous?.lifetime_successes ?? 0) + (input.evaluation.result === "correct" ? 1 : 0);
    const previousAvg = Number(previous?.avg_response_time_sec ?? 0);
    const nextAvg =
      input.responseTimeSec && input.responseTimeSec > 0
        ? previousAvg > 0
          ? (previousAvg * Math.max(lifetimeAttempts - 1, 1) + input.responseTimeSec) /
            lifetimeAttempts
          : input.responseTimeSec
        : previousAvg || null;
    const masteryBase = Number(previous?.mastery_score ?? 0.35);
    const stabilityBase = Number(previous?.stability_score ?? 0.3);
    const difficultyBase = Number(previous?.difficulty_score ?? 0.55);
    const hintDependencyBase = Number(previous?.hint_dependency_score ?? 0.25);
    const calibrationBase = Number(previous?.confidence_calibration_score ?? 0.4);

    return {
      user_id: input.userId,
      concept_id: conceptId,
      mastery_score: clamp(
        masteryBase +
          (input.evaluation.result === "correct"
            ? 0.12
            : input.evaluation.result === "review"
              ? 0.02
              : -0.08),
        0,
        1,
      ),
      stability_score: clamp(
        stabilityBase +
          (input.evaluation.result === "correct"
            ? 0.08
            : input.evaluation.result === "review"
              ? 0.01
              : -0.05),
        0,
        1,
      ),
      difficulty_score: clamp(
        difficultyBase + (input.evaluation.result === "correct" ? -0.02 : 0.04),
        0,
        1,
      ),
      consecutive_successes:
        input.evaluation.result === "correct"
          ? (previous?.consecutive_successes ?? 0) + 1
          : 0,
      last_seen_at: new Date().toISOString(),
      next_due_at: toTimestamp(input.evaluation.nextDueAt),
      last_result:
        input.evaluation.result === "correct"
          ? "correct"
          : input.evaluation.result === "incorrect"
            ? "incorrect"
            : "hard",
      lifetime_attempts: lifetimeAttempts,
      lifetime_successes: lifetimeSuccesses,
      avg_response_time_sec: nextAvg,
      hint_dependency_score: clamp(
        hintDependencyBase * 0.72 + (input.hintLevel > 0 ? 0.28 : 0),
        0,
        1,
      ),
      confidence_calibration_score: clamp(
        calibrationBase * 0.6 + confidenceCalibration * 0.4,
        0,
        1,
      ),
    };
  });

  const { error } = await supabase.from("user_concept_progress").upsert(rows, {
    onConflict: "user_id,concept_id",
  });

  if (error) {
    throw error;
  }
}

export async function upsertUserRequirementProgress(input: PersistPhysicsAttemptInput) {
  const bundle = await getPhysicsTaskBundle(input.taskId);

  if (!bundle) {
    return;
  }

  const requirementIds = bundle.requirements
    .map((item) => item.requirement?.id ?? item.requirement_id)
    .filter(Boolean);

  if (requirementIds.length === 0) {
    return;
  }

  const supabase = await getServerSupabase({ serviceRole: true });
  const { data: existingRows, error: existingError } = await supabase
    .from("user_requirement_progress")
    .select("id, user_id, requirement_id, readiness_score, last_seen_at")
    .eq("user_id", input.userId)
    .in("requirement_id", requirementIds);

  if (existingError) {
    throw existingError;
  }

  const existingMap = new Map((existingRows ?? []).map((row) => [row.requirement_id, row]));

  const rows = requirementIds.map((requirementId) => {
    const previous = existingMap.get(requirementId);
    const readinessBase = Number(previous?.readiness_score ?? 0.35);

    return {
      user_id: input.userId,
      requirement_id: requirementId,
      readiness_score: clamp(
        readinessBase +
          (input.evaluation.result === "correct"
            ? 0.08
            : input.evaluation.result === "review"
              ? 0.02
              : -0.05),
        0,
        1,
      ),
      last_seen_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase.from("user_requirement_progress").upsert(rows, {
    onConflict: "user_id,requirement_id",
  });

  if (error) {
    throw error;
  }
}

export async function persistPhysicsAttempt(input: PersistPhysicsAttemptInput) {
  await insertTaskAttempt(input);
  await upsertUserTaskProgress(input);
  await upsertUserConceptProgress(input);
  await upsertUserRequirementProgress(input);
}
