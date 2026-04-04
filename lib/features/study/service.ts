import "server-only";

import { evaluateTaskAnswer } from "@/lib/domain/study-logic";
import type {
  ConfidenceLevel,
  SessionInput,
  StudyTask,
  Subject,
  SubjectCode,
} from "@/lib/domain/study-types";
import { demoStudyProvider } from "@/lib/data/providers/demo-study-provider";
import { physicsSupabaseProvider } from "@/lib/data/providers/physics-supabase-provider";
import type { StudyProvider } from "@/lib/data/providers/study-provider";
import {
  loadRenderableTask,
  loadRenderableTaskAcrossProviders,
  loadRenderableTaskByExternalRef,
} from "@/lib/features/study/task-loader";
import { buildPlannedSession } from "@/lib/features/study/session-planner";

const studyProviders: StudyProvider[] = [demoStudyProvider, physicsSupabaseProvider];

function uniqueSubjects(subjects: Subject[]) {
  return [...new Map(subjects.map((subject) => [subject.code, subject])).values()];
}

export function getStudyProvider(subjectCode: SubjectCode) {
  return subjectCode === "physics" ? physicsSupabaseProvider : demoStudyProvider;
}

export async function getAvailableSubjects() {
  const subjectGroups = await Promise.all(studyProviders.map((provider) => provider.getSubjects()));
  return uniqueSubjects(subjectGroups.flat());
}

export async function getTaskLibrary(subjectCode?: SubjectCode) {
  if (subjectCode) {
    return getStudyProvider(subjectCode).getTasks(subjectCode);
  }

  const taskGroups = await Promise.all(studyProviders.map((provider) => provider.getTasks()));
  return [...new Map(taskGroups.flat().map((task) => [task.id, task])).values()];
}

export async function getRenderableTask(taskId: string, subjectCode?: SubjectCode) {
  if (subjectCode) {
    return loadRenderableTask(getStudyProvider(subjectCode), taskId);
  }

  return loadRenderableTaskAcrossProviders(studyProviders, taskId);
}

export async function getRenderableTaskByExternalRef(
  externalRef: string,
  subjectCode: SubjectCode,
) {
  return loadRenderableTaskByExternalRef(getStudyProvider(subjectCode), externalRef);
}

export async function planStudySession(input: SessionInput) {
  const provider = getStudyProvider(input.subjectCode);
  const subjects = await getAvailableSubjects();
  const fallbackSubject = subjects.find((subject) => subject.code === input.subjectCode);

  return buildPlannedSession(provider, input, { fallbackSubject });
}

export function evaluateAnswer(
  task: StudyTask,
  answer: string,
  confidence: ConfidenceLevel,
  hintLevel: number,
) {
  return evaluateTaskAnswer(task, answer, confidence, hintLevel);
}
