import {
  getAnalyticsSnapshot as getLegacyAnalyticsSnapshot,
  getDashboardSnapshot as getLegacyDashboardSnapshot,
  getDueConcepts as getLegacyDueConcepts,
  getImportJobs as getLegacyImportJobs,
  getSubjectConcepts as getLegacySubjectConcepts,
  getSubjects as getLegacySubjects,
  getTaskById as getLegacyTaskById,
  getTasks as getLegacyTasks,
  getWeakestConcepts as getLegacyWeakestConcepts,
} from "@/lib/matura-data";
import type {
  AdminSnapshot,
  AnalyticsPoint,
  AnalyticsSnapshot,
  ConceptProgress,
  DashboardSnapshot,
  ImportJob,
  OverallInsight,
  PlannedSession,
  RecentMistake,
  SourceRecord,
  StudyTask,
  Subject,
  SubjectCode,
  SubjectInsight,
  TaskMixItem,
} from "@/lib/domain/study-types";
import type { StudyProvider } from "@/lib/data/providers/study-provider";

type LegacySubject = ReturnType<typeof getLegacySubjects>[number];
type LegacyTask = ReturnType<typeof getLegacyTasks>[number];
type LegacyConcept = ReturnType<typeof getLegacySubjectConcepts>[number];
type LegacyImportJob = ReturnType<typeof getLegacyImportJobs>[number];
type LegacyDashboardSnapshot = ReturnType<typeof getLegacyDashboardSnapshot>;
type LegacyAnalyticsSnapshot = ReturnType<typeof getLegacyAnalyticsSnapshot>;

function mapSubject(subject: LegacySubject): Subject {
  return {
    ...subject,
    code: subject.code as SubjectCode,
  };
}

function mapConceptProgress(concept: LegacyConcept): ConceptProgress {
  return {
    ...concept,
    subjectCode: concept.subjectCode as SubjectCode,
  };
}

function mapTask(task: LegacyTask): StudyTask {
  return {
    ...task,
    subjectCode: task.subjectCode as SubjectCode,
    assetItems: undefined,
    sourceRef: undefined,
    topicSecondary: null,
    topicMixed: null,
  };
}

function mapImportJob(importJob: LegacyImportJob): ImportJob {
  return { ...importJob };
}

function mapTaskMix(items: LegacyDashboardSnapshot["subjectInsights"][number]["taskMix"]): TaskMixItem[] {
  return items.map((item) => ({ ...item }));
}

function mapOverallInsight(overall: LegacyDashboardSnapshot["overall"]): OverallInsight {
  return { ...overall };
}

function mapSubjectInsight(insight: LegacyDashboardSnapshot["subjectInsights"][number]): SubjectInsight {
  return {
    ...insight,
    code: insight.code as SubjectCode,
    weakestConcept: mapConceptProgress(insight.weakestConcept),
    strongestConcept: mapConceptProgress(insight.strongestConcept),
    taskMix: mapTaskMix(insight.taskMix),
  };
}

function mapPlannedSession(session: LegacyDashboardSnapshot["recommended"]): PlannedSession {
  return {
    ...session,
    subject: mapSubject(session.subject),
    tasks: session.tasks.map((task) => ({
      ...mapTask(task),
      priorityScore: task.priorityScore,
      reasons: [...task.reasons],
    })),
  };
}

function mapRecentMistakes(
  mistakes: LegacyDashboardSnapshot["recentMistakes"],
): RecentMistake[] {
  return mistakes.map((mistake) => ({ ...mistake }));
}

function mapDashboardSnapshot(snapshot: LegacyDashboardSnapshot): DashboardSnapshot {
  return {
    countdownDays: snapshot.countdownDays,
    overall: mapOverallInsight(snapshot.overall),
    recommended: mapPlannedSession(snapshot.recommended),
    subjectInsights: snapshot.subjectInsights.map(mapSubjectInsight),
    nextAction: snapshot.nextAction,
    dueConcepts: snapshot.dueConcepts.map(mapConceptProgress),
    weakestConcepts: snapshot.weakestConcepts.map(mapConceptProgress),
    recentMistakes: mapRecentMistakes(snapshot.recentMistakes),
  };
}

function mapAnalyticsPoint(point: AnalyticsPoint) {
  return { ...point };
}

function mapAnalyticsSnapshot(snapshot: LegacyAnalyticsSnapshot): AnalyticsSnapshot {
  return {
    overall: mapOverallInsight(snapshot.overall),
    subjectInsights: snapshot.subjectInsights.map(mapSubjectInsight),
    subjectSeries: Object.fromEntries(
      Object.entries(snapshot.subjectSeries).map(([subjectCode, series]) => [
        subjectCode as SubjectCode,
        series.map(mapAnalyticsPoint),
      ]),
    ) as Record<SubjectCode, AnalyticsPoint[]>,
    mostDelayed: snapshot.mostDelayed.map(mapConceptProgress),
    strongestSubjects: snapshot.strongestSubjects.map(mapSubject),
    taskMix: snapshot.taskMix.map((item) => ({ ...item })),
    scoreHistory: snapshot.scoreHistory.map(mapAnalyticsPoint),
  };
}

export const demoStudyProvider: StudyProvider = {
  async getSubjects() {
    return getLegacySubjects().map(mapSubject);
  },
  async getTasks(subjectCode?: SubjectCode) {
    if (subjectCode === "physics") {
      return [];
    }

    return getLegacyTasks(subjectCode as "math" | "english" | "polish" | undefined).map(mapTask);
  },
  async getTaskById(taskId: string) {
    const task = getLegacyTaskById(taskId);
    return task ? mapTask(task) : null;
  },
  async getTaskByExternalRef() {
    return null;
  },
  async getSubjectConcepts(subjectCode?: SubjectCode) {
    if (subjectCode === "physics") {
      return [];
    }

    return getLegacySubjectConcepts(
      subjectCode as "math" | "english" | "polish" | undefined,
    ).map(mapConceptProgress);
  },
  async getDueConcepts(subjectCode?: SubjectCode) {
    if (subjectCode === "physics") {
      return [];
    }

    return getLegacyDueConcepts(subjectCode as "math" | "english" | "polish" | undefined).map(
      mapConceptProgress,
    );
  },
  async getWeakestConcepts(limit = 4, subjectCode?: SubjectCode) {
    if (subjectCode === "physics") {
      return [];
    }

    return getLegacyWeakestConcepts(
      limit,
      subjectCode as "math" | "english" | "polish" | undefined,
    ).map(mapConceptProgress);
  },
  async getDashboardSnapshot() {
    return mapDashboardSnapshot(getLegacyDashboardSnapshot());
  },
  async getAnalyticsSnapshot() {
    return mapAnalyticsSnapshot(getLegacyAnalyticsSnapshot());
  },
  async getImportJobs() {
    return getLegacyImportJobs().map(mapImportJob);
  },
};

export async function getDemoDashboardSnapshot() {
  return demoStudyProvider.getDashboardSnapshot();
}

export async function getDemoAnalyticsSnapshot() {
  return demoStudyProvider.getAnalyticsSnapshot();
}

export async function getDemoImportJobs() {
  return demoStudyProvider.getImportJobs();
}

export function getDemoAdminSnapshot(): AdminSnapshot {
  const snapshot = getLegacyDashboardSnapshot();

  return {
    totalTasks: getLegacyTasks().length,
    publishedTasks: getLegacyTasks().filter((task) => task.official || task.year >= 2024).length,
    reviewQueueCount: snapshot.dueConcepts.length,
    importJobs: getLegacyImportJobs().map(mapImportJob),
  };
}

export function getDemoSources(): SourceRecord[] {
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
