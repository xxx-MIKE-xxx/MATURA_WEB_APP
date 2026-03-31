"use client";

import { useDeferredValue, useState } from "react";
import type { StudyTask, SubjectCode } from "@/lib/matura-data";

type LibraryExplorerProps = {
  tasks: StudyTask[];
};

export function LibraryExplorer({ tasks }: LibraryExplorerProps) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<SubjectCode | "all">("all");
  const [answerMode, setAnswerMode] = useState<string>("all");
  const deferredQuery = useDeferredValue(query);

  const filtered = tasks.filter((task) => {
    const matchesQuery =
      deferredQuery.length === 0
        ? true
        : [task.title, task.prompt, task.topic, task.examComponent]
            .join(" ")
            .toLowerCase()
            .includes(deferredQuery.toLowerCase());

    const matchesSubject = subject === "all" ? true : task.subjectCode === subject;
    const matchesAnswerMode = answerMode === "all" ? true : task.answerMode === answerMode;

    return matchesQuery && matchesSubject && matchesAnswerMode;
  });

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_220px_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--teal)]"
          placeholder="Search by title, prompt, topic, or exam component"
        />
        <select
          value={subject}
          onChange={(event) => setSubject(event.target.value as SubjectCode | "all")}
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--teal)]"
        >
          <option value="all">All subjects</option>
          <option value="math">Math</option>
          <option value="english">English</option>
          <option value="polish">Polish</option>
        </select>
        <select
          value={answerMode}
          onChange={(event) => setAnswerMode(event.target.value)}
          className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--teal)]"
        >
          <option value="all">All answer modes</option>
          <option value="mcq">MCQ</option>
          <option value="numeric">Numeric</option>
          <option value="short_text">Short text</option>
          <option value="essay">Essay</option>
          <option value="oral">Oral</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)]">
        <div className="grid grid-cols-[1.7fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-[var(--line)] px-5 py-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
          <span>Task</span>
          <span>Subject</span>
          <span>Mode</span>
          <span>Difficulty</span>
        </div>

        <div className="divide-y divide-[var(--line)]">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-[1.7fr_0.8fr_0.8fr_0.8fr] gap-4 px-5 py-4 text-sm"
            >
              <div>
                <p className="font-semibold text-[var(--foreground)]">{task.title}</p>
                <p className="mt-1 text-[var(--muted)]">{task.topic}</p>
              </div>
              <span className="capitalize text-[var(--foreground)]">{task.subjectCode}</span>
              <span className="text-[var(--muted)]">{task.answerMode}</span>
              <span className="text-[var(--foreground)]">{task.difficultyBase}/10</span>
            </div>
          ))}

          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-sm text-[var(--muted)]">
              No tasks match the current search. Try a broader query or reset filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
