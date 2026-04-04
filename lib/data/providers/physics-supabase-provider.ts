import "server-only";

import { buildTaskMix } from "@/lib/domain/study-logic";
import type {
  AnalyticsPoint,
  AnalyticsSnapshot,
  ConceptProgress,
  ImportJob,
  OverallInsight,
  SubjectInsight,
  StudyTask,
  SubjectCode,
} from "@/lib/domain/study-types";
import {
  createConceptProgressFromPhysicsBundle,
  mapPhysicsTaskBundleToStudyTask,
  mergePhysicsSubject,
} from "@/lib/data/mappers/physics-task-mapper";
import {
  getPhysicsImportJobs,
  getPhysicsSubject,
  getPhysicsTaskBundle,
  getPhysicsTaskBundleByExternalRef,
  getPublishedPhysicsTasks,
  type PhysicsRequirementRow,
} from "@/lib/data/queries/physics-queries";
import type { StudyProvider } from "@/lib/data/providers/study-provider";

function createFallbackConceptProgress(): ConceptProgress {
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: "physics-concept-fallback",
    subjectCode: "physics",
    name: "Physics task bank",
    topic: "Physics",
    requirement: "Published physics content",
    masteryScore: 0.4,
    stabilityScore: 0.35,
    difficultyScore: 0.55,
    consecutiveSuccesses: 0,
    lastSeenAt: today,
    nextDueAt: today,
    lastResult: "incorrect",
    lifetimeAttempts: 0,
    lifetimeSuccesses: 0,
    avgResponseTimeSec: 0,
    hintDependencyScore: 0.3,
    confidenceCalibrationScore: 0.4,
    errorTrend: "Waiting for first attempts",
  };
}

function createFallbackOverallInsight(): OverallInsight {
  return {
    readiness: 61,
    predictedScore: 64,
    rangeLow: 56,
    rangeHigh: 72,
    confidenceLabel: "Building",
    confidenceValue: 48,
    dueReviews: 0,
    accuracy: 0,
    studyHours: 0,
    reviewCompletionRate: 0,
    consistency: 0,
    streak: 0,
  };
}

function createEmptySeries(): Record<SubjectCode, AnalyticsPoint[]> {
  return {
    math: [],
    english: [],
    polish: [],
    physics: [],
  };
}

function mapPhysicsImportJobRows(rows: Awaited<ReturnType<typeof getPhysicsImportJobs>>): ImportJob[] {
  return rows.map((row) => ({
    id: row.id,
    source: row.source_id ?? "Physics import",
    status:
      row.status === "queued" || row.status === "reviewing" || row.status === "ready"
        ? row.status
        : "reviewing",
    itemCount: 0,
    createdAt: row.created_at.slice(0, 10),
  }));
}

function getRequirementForConcept(
  task: StudyTask,
  requirementLabels: Map<string, PhysicsRequirementRow>,
) {
  const requirementCode = task.requirementCodes[0];
  return requirementCode ? requirementLabels.get(requirementCode) ?? null : null;
}

async function getPhysicsConceptProgress() {
  const bundles = await getPublishedPhysicsTasks();
  const mappedTasks = bundles.map(mapPhysicsTaskBundleToStudyTask);
  const requirementMap = new Map(
    bundles.flatMap((bundle) =>
      bundle.requirements
        .map((item) => item.requirement)
        .filter((requirement): requirement is PhysicsRequirementRow => Boolean(requirement))
        .map((requirement) => [requirement.code, requirement] as const),
    ),
  );
  const concepts = new Map<string, ConceptProgress>();

  for (const [index, bundle] of bundles.entries()) {
    const task = mappedTasks[index];
    const requirement = getRequirementForConcept(task, requirementMap);

    for (const conceptJoin of bundle.concepts) {
      if (!conceptJoin.concept || concepts.has(conceptJoin.concept.id)) {
        continue;
      }

      concepts.set(
        conceptJoin.concept.id,
        createConceptProgressFromPhysicsBundle(conceptJoin.concept, requirement),
      );
    }
  }

  if (concepts.size === 0) {
    return [createFallbackConceptProgress()];
  }

  return [...concepts.values()];
}

async function getPhysicsSubjectInsight(): Promise<SubjectInsight> {
  const [subjectRow, tasks, concepts] = await Promise.all([
    getPhysicsSubject(),
    getPublishedPhysicsTasks(),
    getPhysicsConceptProgress(),
  ]);
  const subject = mergePhysicsSubject(subjectRow);
  const mappedTasks = tasks.map(mapPhysicsTaskBundleToStudyTask);
  const weakestConcept = concepts[0] ?? createFallbackConceptProgress();
  const strongestConcept = concepts.at(-1) ?? weakestConcept;

  return {
    code: subject.code,
    name: subject.name,
    shortName: subject.shortName,
    accent: subject.accent,
    accentSoft: subject.accentSoft,
    readiness: subject.readiness,
    predictedScore: 64,
    rangeLow: 56,
    rangeHigh: 72,
    confidenceLabel: "Building",
    confidenceValue: 48,
    trend: 0,
    consistency: 0,
    dueReviews: 0,
    streak: subject.streak,
    accuracy: 0,
    avgResponseTimeSec: 0,
    hintDependency: 34,
    calibration: 41,
    studyHours: 0,
    reviewCompletionRate: 0,
    urgentConceptCount: concepts.length,
    bestNextStep:
      mappedTasks.length > 0
        ? `Start with ${mappedTasks[0].topic.toLowerCase()} and compare your setup to the official solution.`
        : "Seed the first physics tasks, then open a short practice block.",
    weakestConcept,
    strongestConcept,
    taskMix: buildTaskMix(mappedTasks),
  };
}

async function getPhysicsTasksSafe() {
  try {
    return await getPublishedPhysicsTasks();
  } catch {
    return [];
  }
}

export const physicsSupabaseProvider: StudyProvider = {
  async getSubjects() {
    try {
      return [mergePhysicsSubject(await getPhysicsSubject())];
    } catch {
      return [mergePhysicsSubject(null)];
    }
  },
  async getTasks(subjectCode?: SubjectCode) {
    if (subjectCode && subjectCode !== "physics") {
      return [];
    }

    return (await getPhysicsTasksSafe()).map(mapPhysicsTaskBundleToStudyTask);
  },
  async getTaskById(taskId: string) {
    try {
      const bundle = await getPhysicsTaskBundle(taskId);
      return bundle ? mapPhysicsTaskBundleToStudyTask(bundle) : null;
    } catch {
      return null;
    }
  },
  async getTaskByExternalRef(externalRef: string) {
    try {
      const bundle = await getPhysicsTaskBundleByExternalRef(externalRef);
      return bundle ? mapPhysicsTaskBundleToStudyTask(bundle) : null;
    } catch {
      return null;
    }
  },
  async getSubjectConcepts(subjectCode?: SubjectCode) {
    if (subjectCode && subjectCode !== "physics") {
      return [];
    }

    try {
      return await getPhysicsConceptProgress();
    } catch {
      return [createFallbackConceptProgress()];
    }
  },
  async getDueConcepts(subjectCode?: SubjectCode) {
    return this.getSubjectConcepts(subjectCode);
  },
  async getWeakestConcepts(limit = 4, subjectCode?: SubjectCode) {
    const concepts = await this.getSubjectConcepts(subjectCode);
    return concepts.slice(0, limit);
  },
  async getDashboardSnapshot() {
    const [subjectInsight, tasks] = await Promise.all([
      getPhysicsSubjectInsight(),
      this.getTasks("physics"),
    ]);
    const recommendedTasks = tasks.slice(0, 4);
    const subject = mergePhysicsSubject({ name: subjectInsight.name });

    return {
      countdownDays: 32,
      overall: createFallbackOverallInsight(),
      recommended: {
        id: "physics-practice-4",
        mode: "practice",
        subject,
        durationMinutes: 28,
        taskCount: recommendedTasks.length,
        tasks: recommendedTasks.map((task, index) => ({
          ...task,
          priorityScore: 74 - index * 6,
          reasons: [
            "Server-backed physics task",
            "Good fit for the current MVP scheduler",
          ],
        })),
        summary: {
          candidatePoolSize: tasks.length,
          dueConcepts: subjectInsight.urgentConceptCount,
          dominantGoal:
            "Verify that DB-backed physics content renders cleanly before expanding analytics.",
          pacingLabel: "Independent first, feedback fast",
        },
      },
      subjectInsights: [subjectInsight],
      nextAction: "Open one physics task, answer it, and compare your setup to the official solution.",
      dueConcepts: await this.getDueConcepts("physics"),
      weakestConcepts: await this.getWeakestConcepts(4, "physics"),
      recentMistakes: [
        {
          label: "Physics MVP",
          detail: "Use real attempt rows first, then tighten the concept analytics once writes are reliable.",
        },
      ],
    };
  },
  async getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
    return {
      overall: createFallbackOverallInsight(),
      subjectInsights: [await getPhysicsSubjectInsight()],
      subjectSeries: createEmptySeries(),
      mostDelayed: await this.getWeakestConcepts(5, "physics"),
      strongestSubjects: await this.getSubjects(),
      taskMix: buildTaskMix(await this.getTasks("physics")),
      scoreHistory: [],
    };
  },
  async getImportJobs() {
    try {
      return mapPhysicsImportJobRows(await getPhysicsImportJobs());
    } catch {
      return [];
    }
  },
};
