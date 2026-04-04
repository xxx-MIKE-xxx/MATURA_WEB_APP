import Link from "next/link";
import { getAnswerModeLabel } from "@/lib/domain/study-logic";
import type { SubjectCode } from "@/lib/domain/study-types";
import { getRenderableTask } from "@/lib/features/study/service";

type LibraryTaskPageProps = {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSubjectCode(
  subject: string | string[] | undefined,
): SubjectCode | undefined {
  if (typeof subject !== "string") {
    return undefined;
  }

  if (
    subject === "math" ||
    subject === "english" ||
    subject === "polish" ||
    subject === "physics"
  ) {
    return subject;
  }

  return undefined;
}

export default async function LibraryTaskPage({
  params,
  searchParams,
}: LibraryTaskPageProps) {
  const [{ taskId }, query] = await Promise.all([params, searchParams]);
  const subjectCode = readSubjectCode(query.subject);
  const task = await getRenderableTask(taskId, subjectCode);

  if (!task) {
    return (
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
        Task not found.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
              Task detail
            </p>
            <h1 className="mt-4 font-display text-5xl text-[var(--foreground)]">
              {task.title}
            </h1>
          </div>

          <Link
            href={`/app/study/session/${task.id}?subject=${task.subjectCode}&mode=practice&count=1`}
            className="app-button-primary"
          >
            Study this task
          </Link>
        </div>

        <p className="mt-4 max-w-4xl whitespace-pre-wrap text-sm leading-8 text-[var(--muted)]">
          {task.prompt}
        </p>
        {task.stimulus ? (
          <p className="mt-4 rounded-[24px] bg-[var(--surface)] px-4 py-4 text-sm leading-7 text-[var(--muted)]">
            {task.stimulus}
          </p>
        ) : null}
      </section>

      {task.assetItems && task.assetItems.length > 0 ? (
        <section className="grid gap-4">
          {task.assetItems.map((asset) => (
            <figure
              key={asset.id}
              className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)]"
            >
              {asset.publicUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.publicUrl}
                  alt={asset.caption ?? `${task.title} asset`}
                  className="w-full object-contain"
                />
              ) : null}
              {asset.caption ? (
                <figcaption className="border-t border-[var(--line)] px-5 py-4 text-sm leading-7 text-[var(--muted)]">
                  {asset.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </section>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Metadata</p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--foreground)]">
            <p>Subject: {task.subjectCode}</p>
            <p>Exam component: {task.examComponent}</p>
            <p>Topic: {task.topic}</p>
            <p>Answer mode: {getAnswerModeLabel(task.answerMode)}</p>
            {task.topicSecondary ? <p>Secondary topic: {task.topicSecondary}</p> : null}
            {task.topicMixed ? <p>Mixed topic label: {task.topicMixed}</p> : null}
            {task.sourceRef ? <p>Source: {task.sourceRef}</p> : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {task.conceptIds.map((conceptId) => (
              <span
                key={conceptId}
                className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--foreground)]"
              >
                {conceptId}
              </span>
            ))}
            {task.requirementCodes.map((requirementCode) => (
              <span
                key={requirementCode}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]"
              >
                {requirementCode}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Official solution
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[var(--foreground)]">
            {task.solution || "Official solution is not available yet."}
          </p>
        </section>
      </div>
    </div>
  );
}
