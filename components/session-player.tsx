"use client";

import { startTransition, useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  evaluateTaskAnswer,
  getAnswerModeLabel,
  isEssayStyleMode,
  isOptionMode,
} from "@/lib/domain/study-logic";
import type {
  AttemptEvaluation,
  ConfidenceLevel,
  PlannedSession,
  StudyTask,
} from "@/lib/domain/study-types";
import { persistStudyAttempt } from "@/lib/features/study/answer-evaluation";
import { getBrowserSupabaseClient } from "@/lib/supabase";

type SessionPlayerProps = {
  session: PlannedSession;
};

function TaskAnswerInput({
  task,
  answer,
  onChange,
}: {
  task: StudyTask;
  answer: string;
  onChange: (value: string) => void;
}) {
  if (isOptionMode(task.answerMode) && task.options && task.options.length > 0) {
    return (
      <div className="grid gap-3">
        {task.options.map((option) => (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className={`rounded-3xl border px-4 py-4 text-left transition ${
              answer === option.key
                ? "border-[var(--teal)] bg-[var(--teal-soft)]"
                : "border-[var(--line)] bg-white hover:border-[var(--teal)]"
            }`}
          >
            <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-current text-xs font-semibold">
              {option.key}
            </span>
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  const rows = isEssayStyleMode(task.answerMode) ? 7 : 3;

  return (
    <div className="grid gap-3">
      {isOptionMode(task.answerMode) ? (
        <p className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-7 text-[var(--muted)]">
          Official option data is not modeled for this task yet. Enter your conclusion, then
          compare it against the official solution after submission.
        </p>
      ) : null}

      <textarea
        value={answer}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-[28px] border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--teal)]"
        placeholder={
          task.answerMode === "numeric"
            ? "Type a number"
            : task.answerMode === "short_text" || task.answerMode === "fill_in"
              ? "Type a short answer"
              : "Draft your response"
        }
      />
    </div>
  );
}

export function SessionPlayer({ session }: SessionPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("medium");
  const [hintLevel, setHintLevel] = useState(0);
  const [scratchpad, setScratchpad] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [taskStartedAtElapsed, setTaskStartedAtElapsed] = useState(0);
  const [results, setResults] = useState<Record<string, AttemptEvaluation>>({});
  const [persistenceStatus, setPersistenceStatus] = useState<Record<string, string>>({});

  const currentTask = session.tasks[currentIndex];
  const currentResult = currentTask ? results[currentTask.id] : undefined;
  const completedCount = Object.keys(results).length;
  const isComplete = completedCount === session.tasks.length;

  const tick = useEffectEvent(() => {
    setElapsedSeconds((value) => value + 1);
  });

  useEffect(() => {
    if (isComplete) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isComplete]);

  const accuracy = useMemo(() => {
    const graded = Object.values(results).filter((result) => result.result !== "review");

    if (graded.length === 0) {
      return 0;
    }

    return Math.round(
      (graded.filter((result) => result.result === "correct").length / graded.length) * 100,
    );
  }, [results]);

  function revealHint() {
    if (!currentTask) {
      return;
    }

    setHintLevel((value) => Math.min(value + 1, currentTask.hints.length));
  }

  async function persistAttempt(task: StudyTask, evaluation: AttemptEvaluation) {
    const client = getBrowserSupabaseClient();
    const sessionData = client ? await client.auth.getSession() : null;
    const accessToken = sessionData?.data.session?.access_token;
    const response = await persistStudyAttempt({
      accessToken,
      taskId: task.id,
      answer,
      confidence,
      hintLevel,
      responseTimeSec: Math.max(1, elapsedSeconds - taskStartedAtElapsed),
      evaluation,
    });

    setPersistenceStatus((previous) => ({
      ...previous,
      [task.id]: response.message,
    }));
  }

  function submitAnswer() {
    if (!currentTask || !answer.trim()) {
      return;
    }

    const evaluation = evaluateTaskAnswer(currentTask, answer, confidence, hintLevel);

    setResults((previous) => ({
      ...previous,
      [currentTask.id]: evaluation,
    }));

    if (currentTask.subjectCode === "physics") {
      void persistAttempt(currentTask, evaluation).catch(() => {
        setPersistenceStatus((previous) => ({
          ...previous,
          [currentTask.id]: "Physics save failed. Your local review result is still visible.",
        }));
      });
    }
  }

  function goToNextTask() {
    startTransition(() => {
      setCurrentIndex((value) => Math.min(value + 1, session.tasks.length));
      setAnswer("");
      setConfidence("medium");
      setHintLevel(0);
      setTaskStartedAtElapsed(elapsedSeconds);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
      <aside className="grid content-start gap-4 rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Progress</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--foreground)]">
            {Math.min(currentIndex + (currentResult ? 1 : 0), session.tasks.length)}/
            {session.tasks.length}
          </h2>
        </div>

        <div className="rounded-[24px] bg-[var(--surface)] px-4 py-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Timer</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {Math.floor(elapsedSeconds / 60)
              .toString()
              .padStart(2, "0")}
            :
            {(elapsedSeconds % 60).toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {session.mode === "exam"
              ? "No adaptive help during the live run."
              : session.summary.pacingLabel}
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] px-4 py-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Session goal</p>
          <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
            {session.summary.dominantGoal}
          </p>
        </div>
      </aside>

      <section className="min-w-0 rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 sm:p-7">
        {isComplete || !currentTask ? (
          <div className="grid gap-5">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Session complete
            </p>
            <h2 className="font-display text-4xl text-[var(--foreground)]">
              Accuracy {accuracy}%
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
              The session closes with concept-level scheduling rather than a simple score.
              Correct answers with low confidence or heavy hint use come back sooner.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {session.tasks.map((task) => {
                const result = results[task.id];
                return (
                  <div
                    key={task.id}
                    className="rounded-[24px] border border-[var(--line)] bg-white px-4 py-4"
                  >
                    <p className="font-semibold text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {result?.verdict ?? "Not answered"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--foreground)]">
                      {result?.nextReviewLabel ?? "Needs follow-up"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--teal)]">
                {session.subject.name}
              </span>
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                {currentTask.topic}
              </span>
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                {currentTask.taskTypeLabel} • {getAnswerModeLabel(currentTask.answerMode)}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Task {currentIndex + 1}
              </p>
              <h2 className="mt-3 font-display text-4xl text-[var(--foreground)]">
                {currentTask.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--foreground)]">
                {currentTask.prompt}
              </p>
              {currentTask.stimulus ? (
                <p className="mt-3 rounded-[24px] bg-[var(--surface)] px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                  {currentTask.stimulus}
                </p>
              ) : null}

              {currentTask.assetItems && currentTask.assetItems.length > 0 ? (
                <div className="mt-5 grid gap-4">
                  {currentTask.assetItems.map((asset) => (
                    <figure
                      key={asset.id}
                      className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-white"
                    >
                      {asset.publicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.publicUrl}
                          alt={asset.caption ?? `${currentTask.title} asset`}
                          className="w-full object-contain"
                        />
                      ) : null}
                      {asset.caption ? (
                        <figcaption className="border-t border-[var(--line)] px-4 py-3 text-sm leading-7 text-[var(--muted)]">
                          {asset.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-strong)]">
              {currentTask.conceptIds.map((conceptId) => (
                <span
                  key={conceptId}
                  className="rounded-full bg-[var(--surface)] px-3 py-1 text-[var(--foreground)]"
                >
                  {conceptId}
                </span>
              ))}
              {currentTask.requirementCodes.map((requirementCode) => (
                <span
                  key={requirementCode}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-[var(--muted)]"
                >
                  {requirementCode}
                </span>
              ))}
            </div>

            <TaskAnswerInput task={currentTask} answer={answer} onChange={setAnswer} />

            <div className="flex flex-wrap items-center gap-3">
              {(["low", "medium", "high"] as ConfidenceLevel[]).map((value) => (
                <button
                  key={value}
                  onClick={() => setConfidence(value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    confidence === value
                      ? "bg-[var(--navy)] text-white"
                      : "border border-[var(--line)] text-[var(--foreground)]"
                  }`}
                >
                  Confidence: {value}
                </button>
              ))}
            </div>

            {hintLevel > 0 ? (
              <div className="grid gap-3 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Hint ladder
                </p>
                {currentTask.hints.slice(0, hintLevel).map((hint, index) => (
                  <p key={hint} className="text-sm leading-7 text-[var(--foreground)]">
                    {index + 1}. {hint}
                  </p>
                ))}
              </div>
            ) : null}

            {currentResult ? (
              <div className="grid gap-3 rounded-[28px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Result
                </p>
                <h3 className="text-2xl font-semibold text-[var(--foreground)]">
                  {currentResult.verdict}
                </h3>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  {currentResult.coachingNote}
                </p>
                <p className="text-sm leading-7 text-[var(--foreground)]">
                  {currentResult.explanation}
                </p>
                <p className="text-sm font-medium text-[var(--teal)]">
                  {currentResult.nextReviewLabel} on {currentResult.nextDueAt}
                </p>
                {persistenceStatus[currentTask.id] ? (
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {persistenceStatus[currentTask.id]}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={revealHint}
                disabled={hintLevel >= currentTask.hints.length || session.mode === "exam"}
                className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--teal)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {session.mode === "exam"
                  ? "Hints locked in exam mode"
                  : hintLevel === 0
                    ? "Reveal first hint"
                    : "Reveal next hint"}
              </button>

              {!currentResult ? (
                <button
                  onClick={submitAnswer}
                  disabled={!answer.trim()}
                  className="rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit answer
                </button>
              ) : (
                <button
                  onClick={goToNextTask}
                  className="rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
                >
                  {currentIndex === session.tasks.length - 1 ? "Finish session" : "Next task"}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <aside className="grid content-start gap-4 rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Why this task
          </p>
          <div className="mt-3 grid gap-2">
            {currentTask?.reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--foreground)]"
              >
                {reason}
              </div>
            ))}
          </div>
          {currentTask?.sourceRef ? (
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Source: {currentTask.sourceRef}
            </p>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Scratchpad
          </p>
          <textarea
            value={scratchpad}
            onChange={(event) => setScratchpad(event.target.value)}
            rows={10}
            className="mt-3 w-full rounded-[24px] border border-[var(--line)] bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-[var(--teal)]"
            placeholder="Work out the method, list context ideas, or note why the previous attempt failed."
          />
        </div>
      </aside>
    </div>
  );
}
