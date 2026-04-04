import "server-only";

import { getServerSupabase } from "@/lib/supabase/server";

export type PhysicsSubjectRow = {
  id: string;
  code: string;
  name: string;
  active: boolean;
};

export type PhysicsExamComponentRow = {
  id: string;
  subject_id: string;
  code: string;
  name: string;
  level: string | null;
  active: boolean;
};

export type PhysicsTopicRow = {
  id: string;
  subject_id: string;
  parent_topic_id: string | null;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
};

export type PhysicsConceptRow = {
  id: string;
  subject_id: string;
  topic_id: string;
  code: string;
  name: string;
  concept_type: string;
  description: string | null;
  prerequisite_concept_ids: string[] | null;
  active: boolean;
};

export type PhysicsRequirementRow = {
  id: string;
  subject_id: string;
  exam_component_id: string | null;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
};

export type PhysicsTaskTypeRow = {
  id: string;
  code: string;
  name: string;
  answer_mode: string;
};

export type PhysicsSourceRow = {
  id: string;
  provider: string;
  source_type: string;
  title: string;
  url: string | null;
  license_notes: string | null;
  year: number | null;
  imported_at: string;
  hash: string | null;
};

export type PhysicsTaskRow = {
  id: string;
  subject_id: string;
  exam_component_id: string | null;
  primary_topic_id: string;
  task_type_id: string;
  source_id: string | null;
  external_source_ref: string | null;
  title: string;
  prompt_md: string;
  stimulus_md: string | null;
  asset_group_id: string | null;
  difficulty_base: number;
  cognitive_load: "low" | "medium" | "high";
  estimated_time_sec: number;
  year: number | null;
  official: boolean;
  published: boolean;
  active: boolean;
};

export type PhysicsSolutionRow = {
  id: string;
  task_id: string;
  final_answer_text: string | null;
  solution_md: string;
  official_scoring_md: string | null;
  answer_key_json: Record<string, unknown> | null;
};

export type PhysicsHintRow = {
  id: string;
  task_id: string;
  hint_level: number;
  hint_md: string;
};

export type PhysicsTaskOptionRow = {
  id: string;
  task_id: string;
  option_key: string;
  option_text: string;
  is_correct: boolean;
  position: number;
};

export type PhysicsTaskConceptJoinRow = {
  task_id: string;
  concept_id: string;
  weight: number;
  is_primary: boolean;
};

export type PhysicsTaskRequirementJoinRow = {
  task_id: string;
  requirement_id: string;
  weight: number;
};

export type PhysicsAssetRow = {
  id: string;
  asset_group_id: string;
  storage_path: string;
  mime_type: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  role: string;
  position: number;
  page_number: number | null;
  caption: string | null;
  bucket: string | null;
};

export type PhysicsImportJobRow = {
  id: string;
  source_id: string | null;
  status: string;
  input_type: string;
  payload_json: Record<string, unknown> | null;
  created_at: string;
  completed_at: string | null;
};

export type PhysicsTaskBundleRow = {
  task: PhysicsTaskRow;
  subject: PhysicsSubjectRow;
  examComponent: PhysicsExamComponentRow | null;
  topic: PhysicsTopicRow | null;
  taskType: PhysicsTaskTypeRow | null;
  source: PhysicsSourceRow | null;
  solution: PhysicsSolutionRow | null;
  hints: PhysicsHintRow[];
  options: PhysicsTaskOptionRow[];
  concepts: Array<PhysicsTaskConceptJoinRow & { concept: PhysicsConceptRow | null }>;
  requirements: Array<
    PhysicsTaskRequirementJoinRow & { requirement: PhysicsRequirementRow | null }
  >;
  assets: PhysicsAssetRow[];
};

function createMap<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

function createGroupedMap<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T,
) {
  const grouped = new Map<string, T[]>();

  for (const row of rows) {
    const groupKey = row[key];

    if (typeof groupKey !== "string") {
      continue;
    }

    const current = grouped.get(groupKey) ?? [];
    current.push(row);
    grouped.set(groupKey, current);
  }

  return grouped;
}

async function getPhysicsTaskRows(filters: {
  taskId?: string;
  externalRef?: string;
} = {}) {
  const physicsSubject = await getPhysicsSubject();

  if (!physicsSubject) {
    return [];
  }

  const supabase = await getServerSupabase({ serviceRole: true });
  let query = supabase
    .from("tasks")
    .select(
      "id, subject_id, exam_component_id, primary_topic_id, task_type_id, source_id, external_source_ref, title, prompt_md, stimulus_md, asset_group_id, difficulty_base, cognitive_load, estimated_time_sec, year, official, published, active",
    )
    .eq("subject_id", physicsSubject.id)
    .eq("published", true)
    .eq("active", true)
    .order("year", { ascending: false })
    .order("title", { ascending: true });

  if (filters.taskId) {
    query = query.eq("id", filters.taskId);
  }

  if (filters.externalRef) {
    query = query.eq("external_source_ref", filters.externalRef);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as PhysicsTaskRow[];
}

async function buildPhysicsTaskBundles(taskRows: PhysicsTaskRow[]) {
  if (taskRows.length === 0) {
    return [];
  }

  const supabase = await getServerSupabase({ serviceRole: true });
  const physicsSubject = await getPhysicsSubject();

  if (!physicsSubject) {
    return [];
  }

  const taskIds = taskRows.map((task) => task.id);
  const examComponentIds = [...new Set(taskRows.map((task) => task.exam_component_id).filter(Boolean))];
  const topicIds = [...new Set(taskRows.map((task) => task.primary_topic_id).filter(Boolean))];
  const taskTypeIds = [...new Set(taskRows.map((task) => task.task_type_id).filter(Boolean))];
  const sourceIds = [...new Set(taskRows.map((task) => task.source_id).filter(Boolean))];
  const assetGroupIds = [...new Set(taskRows.map((task) => task.asset_group_id).filter(Boolean))];

  const [
    examComponentsResult,
    topicsResult,
    taskTypesResult,
    sourcesResult,
    solutionsResult,
    hintsResult,
    optionsResult,
    taskConceptsResult,
    taskRequirementsResult,
    assetsResult,
  ] = await Promise.all([
    examComponentIds.length
      ? supabase
          .from("exam_components")
          .select("id, subject_id, code, name, level, active")
          .in("id", examComponentIds)
      : Promise.resolve({ data: [], error: null }),
    topicIds.length
      ? supabase
          .from("topics")
          .select("id, subject_id, parent_topic_id, code, name, description, active")
          .in("id", topicIds)
      : Promise.resolve({ data: [], error: null }),
    taskTypeIds.length
      ? supabase.from("task_types").select("id, code, name, answer_mode").in("id", taskTypeIds)
      : Promise.resolve({ data: [], error: null }),
    sourceIds.length
      ? supabase
          .from("sources")
          .select("id, provider, source_type, title, url, license_notes, year, imported_at, hash")
          .in("id", sourceIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("solutions")
      .select("id, task_id, final_answer_text, solution_md, official_scoring_md, answer_key_json")
      .in("task_id", taskIds),
    supabase
      .from("hints")
      .select("id, task_id, hint_level, hint_md")
      .in("task_id", taskIds)
      .order("task_id", { ascending: true })
      .order("hint_level", { ascending: true }),
    supabase
      .from("task_options")
      .select("id, task_id, option_key, option_text, is_correct, position")
      .in("task_id", taskIds)
      .order("task_id", { ascending: true })
      .order("position", { ascending: true }),
    supabase
      .from("task_concepts")
      .select("task_id, concept_id, weight, is_primary")
      .in("task_id", taskIds),
    supabase
      .from("task_requirements")
      .select("task_id, requirement_id, weight")
      .in("task_id", taskIds),
    assetGroupIds.length
      ? supabase
          .from("assets")
          .select(
            "id, asset_group_id, storage_path, mime_type, alt_text, width, height, role, position, page_number, caption, bucket",
          )
          .in("asset_group_id", assetGroupIds)
          .order("asset_group_id", { ascending: true })
          .order("position", { ascending: true })
          .order("page_number", { ascending: true, nullsFirst: true })
          .order("storage_path", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
  ]);

  for (const result of [
    examComponentsResult,
    topicsResult,
    taskTypesResult,
    sourcesResult,
    solutionsResult,
    hintsResult,
    optionsResult,
    taskConceptsResult,
    taskRequirementsResult,
    assetsResult,
  ]) {
    if (result.error) {
      throw result.error;
    }
  }

  const taskConceptRows = (taskConceptsResult.data ?? []) as PhysicsTaskConceptJoinRow[];
  const conceptIds = [...new Set(taskConceptRows.map((row) => row.concept_id))];
  const requirementJoinRows = (taskRequirementsResult.data ?? []) as PhysicsTaskRequirementJoinRow[];
  const requirementIds = [...new Set(requirementJoinRows.map((row) => row.requirement_id))];

  const [conceptsResult, requirementsResult] = await Promise.all([
    conceptIds.length
      ? supabase
          .from("concepts")
          .select(
            "id, subject_id, topic_id, code, name, concept_type, description, prerequisite_concept_ids, active",
          )
          .in("id", conceptIds)
      : Promise.resolve({ data: [], error: null }),
    requirementIds.length
      ? supabase
          .from("requirements")
          .select("id, subject_id, exam_component_id, code, name, description, active")
          .in("id", requirementIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (conceptsResult.error) {
    throw conceptsResult.error;
  }

  if (requirementsResult.error) {
    throw requirementsResult.error;
  }

  const examComponentMap = createMap(
    (examComponentsResult.data ?? []) as PhysicsExamComponentRow[],
  );
  const topicMap = createMap((topicsResult.data ?? []) as PhysicsTopicRow[]);
  const taskTypeMap = createMap((taskTypesResult.data ?? []) as PhysicsTaskTypeRow[]);
  const sourceMap = createMap((sourcesResult.data ?? []) as PhysicsSourceRow[]);
  const solutionMap = createGroupedMap(
    (solutionsResult.data ?? []) as PhysicsSolutionRow[],
    "task_id",
  );
  const hintMap = createGroupedMap((hintsResult.data ?? []) as PhysicsHintRow[], "task_id");
  const optionMap = createGroupedMap(
    (optionsResult.data ?? []) as PhysicsTaskOptionRow[],
    "task_id",
  );
  const conceptMap = createMap((conceptsResult.data ?? []) as PhysicsConceptRow[]);
  const requirementMap = createMap(
    (requirementsResult.data ?? []) as PhysicsRequirementRow[],
  );
  const taskConceptMap = createGroupedMap(taskConceptRows, "task_id");
  const taskRequirementMap = createGroupedMap(requirementJoinRows, "task_id");
  const assetMap = createGroupedMap((assetsResult.data ?? []) as PhysicsAssetRow[], "asset_group_id");

  return taskRows.map<PhysicsTaskBundleRow>((task) => ({
    task,
    subject: physicsSubject,
    examComponent: task.exam_component_id ? examComponentMap.get(task.exam_component_id) ?? null : null,
    topic: topicMap.get(task.primary_topic_id) ?? null,
    taskType: taskTypeMap.get(task.task_type_id) ?? null,
    source: task.source_id ? sourceMap.get(task.source_id) ?? null : null,
    solution: (solutionMap.get(task.id) ?? [])[0] ?? null,
    hints: ((hintMap.get(task.id) ?? []) as PhysicsHintRow[]).slice(),
    options: ((optionMap.get(task.id) ?? []) as PhysicsTaskOptionRow[]).slice(),
    concepts: ((taskConceptMap.get(task.id) ?? []) as PhysicsTaskConceptJoinRow[]).map((row) => ({
      ...row,
      concept: conceptMap.get(row.concept_id) ?? null,
    })),
    requirements: ((taskRequirementMap.get(task.id) ?? []) as PhysicsTaskRequirementJoinRow[]).map(
      (row) => ({
        ...row,
        requirement: requirementMap.get(row.requirement_id) ?? null,
      }),
    ),
    assets: task.asset_group_id ? ((assetMap.get(task.asset_group_id) ?? []) as PhysicsAssetRow[]) : [],
  }));
}

export async function getPhysicsSubject() {
  const supabase = await getServerSupabase({ serviceRole: true });
  const { data, error } = await supabase
    .from("subjects")
    .select("id, code, name, active")
    .eq("code", "physics")
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as PhysicsSubjectRow | null) ?? null;
}

export async function getPublishedPhysicsTasks() {
  const taskRows = await getPhysicsTaskRows();
  return buildPhysicsTaskBundles(taskRows);
}

export async function getPhysicsTaskById(taskId: string) {
  const taskRows = await getPhysicsTaskRows({ taskId });
  return taskRows[0] ?? null;
}

export async function getPhysicsTaskBundle(taskId: string) {
  const taskRows = await getPhysicsTaskRows({ taskId });
  const bundles = await buildPhysicsTaskBundles(taskRows);
  return bundles[0] ?? null;
}

export async function getPhysicsTaskBundleByExternalRef(externalRef: string) {
  const taskRows = await getPhysicsTaskRows({ externalRef });
  const bundles = await buildPhysicsTaskBundles(taskRows);
  return bundles[0] ?? null;
}

export async function getPhysicsImportJobs() {
  const taskRows = await getPhysicsTaskRows();

  if (taskRows.length === 0) {
    return [];
  }

  const taskIds = taskRows.map((task) => task.id);
  const supabase = await getServerSupabase({ serviceRole: true });
  const { data: itemRows, error: itemError } = await supabase
    .from("import_job_items")
    .select("import_job_id, created_task_id")
    .in("created_task_id", taskIds);

  if (itemError) {
    throw itemError;
  }

  const importJobIds = [...new Set((itemRows ?? []).map((item) => item.import_job_id).filter(Boolean))];

  if (importJobIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("import_jobs")
    .select("id, source_id, status, input_type, payload_json, created_at, completed_at")
    .in("id", importJobIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PhysicsImportJobRow[];
}
