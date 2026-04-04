"use server";

import type { StudyAttemptSubmission } from "@/lib/domain/study-types";
import { persistPhysicsAttempt } from "@/lib/data/queries/progress-queries";
import { verifySupabaseAccessToken } from "@/lib/supabase/server";

export async function persistStudyAttempt(submission: StudyAttemptSubmission) {
  if (!submission.accessToken) {
    return {
      persisted: false,
      message: "Sign in to save physics attempts to Supabase.",
    };
  }

  const user = await verifySupabaseAccessToken(submission.accessToken);

  if (!user) {
    return {
      persisted: false,
      message: "Your session expired. Sign in again to save progress.",
    };
  }

  await persistPhysicsAttempt({
    userId: user.id,
    taskId: submission.taskId,
    answer: submission.answer,
    confidence: submission.confidence,
    hintLevel: submission.hintLevel,
    responseTimeSec: submission.responseTimeSec,
    evaluation: submission.evaluation,
  });

  return {
    persisted: true,
    message: "Physics attempt saved.",
  };
}
