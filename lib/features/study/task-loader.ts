import "server-only";

import type { StudyTask, SubjectCode } from "@/lib/domain/study-types";
import type { StudyProvider } from "@/lib/data/providers/study-provider";

function uniqueById(tasks: StudyTask[]) {
  return [...new Map(tasks.map((task) => [task.id, task])).values()];
}

export async function loadTaskLibrary(
  providers: StudyProvider[],
  subjectCode?: SubjectCode,
) {
  if (subjectCode) {
    const taskGroups = await Promise.all(
      providers.map((provider) => provider.getTasks(subjectCode)),
    );
    return uniqueById(taskGroups.flat());
  }

  const taskGroups = await Promise.all(providers.map((provider) => provider.getTasks()));
  return uniqueById(taskGroups.flat());
}

export async function loadRenderableTask(provider: StudyProvider, taskId: string) {
  return provider.getTaskById(taskId);
}

export async function loadRenderableTaskAcrossProviders(
  providers: StudyProvider[],
  taskId: string,
) {
  for (const provider of providers) {
    const task = await provider.getTaskById(taskId);

    if (task) {
      return task;
    }
  }

  return null;
}

export async function loadRenderableTaskByExternalRef(
  provider: StudyProvider,
  externalRef: string,
) {
  if (!provider.getTaskByExternalRef) {
    return null;
  }

  return provider.getTaskByExternalRef(externalRef);
}
