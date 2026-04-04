import "server-only";

import { planAdaptiveSession } from "@/lib/domain/study-logic";
import type {
  PlannedSession,
  SessionInput,
  Subject,
  TaskHistory,
} from "@/lib/domain/study-types";
import type { StudyProvider } from "@/lib/data/providers/study-provider";

export async function buildPlannedSession(
  provider: StudyProvider,
  input: SessionInput,
  options: {
    taskHistory?: TaskHistory[];
    requirementWeights?: Record<string, number>;
    fallbackSubject?: Subject;
  } = {},
): Promise<PlannedSession> {
  const [subjects, tasks, conceptProgress] = await Promise.all([
    provider.getSubjects(),
    provider.getTasks(input.subjectCode),
    provider.getSubjectConcepts(input.subjectCode),
  ]);
  const subject =
    subjects.find((candidate) => candidate.code === input.subjectCode) ?? options.fallbackSubject;

  if (!subject) {
    throw new Error(`Unable to plan a session for subject "${input.subjectCode}".`);
  }

  return planAdaptiveSession({
    input,
    subject,
    tasks,
    conceptProgress,
    taskHistory: options.taskHistory,
    requirementWeights: options.requirementWeights,
  });
}
