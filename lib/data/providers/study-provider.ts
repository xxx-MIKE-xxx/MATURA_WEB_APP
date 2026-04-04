import type {
  AnalyticsSnapshot,
  ConceptProgress,
  DashboardSnapshot,
  ImportJob,
  StudyTask,
  Subject,
  SubjectCode,
} from "@/lib/domain/study-types";

export interface StudyProvider {
  getSubjects(): Promise<Subject[]>;
  getTasks(subjectCode?: SubjectCode): Promise<StudyTask[]>;
  getTaskById(taskId: string): Promise<StudyTask | null>;
  getTaskByExternalRef?(externalRef: string): Promise<StudyTask | null>;
  getSubjectConcepts(subjectCode?: SubjectCode): Promise<ConceptProgress[]>;
  getDueConcepts(subjectCode?: SubjectCode): Promise<ConceptProgress[]>;
  getWeakestConcepts(limit?: number, subjectCode?: SubjectCode): Promise<ConceptProgress[]>;
  getDashboardSnapshot(): Promise<DashboardSnapshot>;
  getAnalyticsSnapshot(): Promise<AnalyticsSnapshot>;
  getImportJobs(): Promise<ImportJob[]>;
}
