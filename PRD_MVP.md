\# Matura Adaptive Study App — PRD / MVP Spec



\## 1. Product Summary

Build a web app for Polish Matura preparation that delivers adaptive practice using retrieval practice, spaced review, constrained interleaving, exam simulation, and targeted feedback.



Stack:

\- Frontend: Next.js on Vercel

\- Backend/data/auth/storage: Supabase

\- Content store: Supabase Postgres + Storage

\- Optional AI: LLM only for explanations, rubric feedback drafts, metadata suggestions, and ingestion assistance; never as source of truth for answers



Core product idea:

\- The app is not a generic quiz app.

\- It is an adaptive practice engine that chooses the next best task based on exam requirements, topic mastery, spacing schedule, error history, and desirable-but-manageable difficulty.

\- The product must support multiple learning modes, because not every learner is at the same stage and not every subject behaves like math.



\## 2. Vision

Help students prepare for Matura more efficiently than chapter-by-chapter studying by combining:

\- active recall

\- spaced repetition

\- constrained interleaving

\- worked-example support for weak/new material

\- exam-format practice

\- analytics by concept, requirement, and error pattern



\## 3. Goals

\### Primary goals

1\. Improve long-term retention, not just short-term performance.

2\. Improve method selection under exam conditions.

3\. Show students what they are weak at by concept and exam requirement.

4\. Turn official and semi-official task banks into a structured, reusable practice database.

5\. Support core Matura subjects first with a content model that later generalizes.



\### MVP goals

1\. Support Math, Polish, and English first.

2\. Support objective tasks + short open tasks first.

3\. Support oral Polish prompt practice in a lightweight way.

4\. Support manual/admin content ingestion.

5\. Support adaptive sessions, review sessions, and exam mode.



\### Non-goals for MVP

\- No collaborative classrooms/teacher dashboards.

\- No marketplace for user-generated content.

\- No full OCR-first ingestion pipeline for arbitrary scans.

\- No auto-grading of all long essays with high stakes.

\- No fully autonomous content scraping from dozens of sites.

\- No mobile app in MVP.



\## 4. Product Principles

1\. Retrieval before reveal.

2\. Minimal effective hinting.

3\. Randomness must be constrained, not chaotic.

4\. Schedule concepts, not only exact tasks.

5\. Respect learner stage: new material needs more scaffolding than review material.

6\. Optimize for exam transfer, not only in-app streaks.

7\. Keep the content schema rich enough to support future adaptivity.



\## 5. User Types

\### Primary user

\- Polish high-school student preparing for Matura 2026/2027

\- studies alone

\- wants fast, focused, measurable prep

\- often knows some topics but struggles with choosing the right method under pressure



\### Secondary users later

\- tutors

\- parents

\- small prep schools



\## 6. Learning Design Model

The app must support 4 study modes.



\### Mode A: Learn

Use when concept mastery is low or concept is new.

Flow:

1\. 30–90 second concept primer

2\. worked example

3\. guided practice task

4\. independent task

5\. micro reflection



Purpose:

\- reduce overload for new concepts

\- help schema formation

\- avoid forcing blind struggle on true beginners



\### Mode B: Practice / Strengthen

Use for known but unstable material.

Flow:

1\. independent task first

2\. answer submission

3\. check correctness

4\. error classification

5\. hint ladder or targeted explanation

6\. repeat or move on based on result



Purpose:

\- retrieval practice

\- concept discrimination

\- interleaving similar topics



\### Mode C: Review

Use for scheduled spaced retrieval.

Flow:

1\. due tasks/concepts prioritized

2\. limited hints

3\. faster session pacing

4\. concept-level rescheduling after result



Purpose:

\- interrupt forgetting curve

\- stabilize performance over days/weeks



\### Mode D: Exam Simulation

Use for transfer to the real exam.

Flow:

1\. realistic timing

2\. official-style sectioning

3\. no adaptive hints during attempt

4\. rubric-style scoring after submission

5\. post-hoc analysis by topic, concept, and error type



Purpose:

\- performance under authentic constraints

\- familiarity with exam format



\## 7. Core Learning Algorithms



\## 7.1 Mastery model

Track mastery at 3 levels:

1\. Task-level familiarity

2\. Concept-level mastery

3\. Requirement-level readiness



Definitions:

\- Task mastery = whether the learner can solve a specific item

\- Concept mastery = whether the learner can solve varied tasks using the same rule/skill

\- Requirement readiness = whether learner is ready for the exam competency category



Use concept-level mastery as the main driver of scheduling.



\## 7.2 Content hierarchy

Use a flexible hierarchy:

\- Subject

\- Exam component

\- Topic

\- Concept/Rule/Theorem/Skill

\- Requirement/Rubric criterion

\- Task type



Examples:

\### Math

\- Subject: Math

\- Exam component: Basic

\- Topic: Geometry

\- Concept: Pythagorean theorem

\- Requirement: uses right-triangle properties

\- Task type: open numeric



\### Polish

\- Subject: Polish

\- Exam component: written basic / written extended / oral

\- Topic: literary interpretation

\- Concept/Skill: thesis building / context use / argument from text

\- Requirement: interprets text / builds argument / uses context

\- Task type: short answer / essay paragraph / oral prompt



\### English

\- Subject: English

\- Exam component: reading / listening / use of English / writing / speaking

\- Topic: grammar or reading strategy

\- Concept/Skill: tense agreement / paraphrase / inference

\- Requirement: understands gist / selects lexical structure / writes formal email

\- Task type: MCQ / gap fill / open short answer / writing prompt



\## 7.3 Task-selection algorithm

The app should not use pure randomness.

It should use constrained randomness with priority scoring.



\### Session inputs

\- selected subject(s)

\- mode

\- session duration or task count

\- target exam component

\- optionally selected topics/chapters

\- user level



\### Candidate pool rules

Fetch tasks matching:

\- subject

\- exam component if selected

\- active = true

\- task\_status = published

\- due\_for\_review OR new\_and\_allowed

\- difficulty within target band



\### Exclusion rules

Avoid selecting:

\- same exact task recently seen inside cooldown window

\- same concept back-to-back unless deliberate reinforcement is needed

\- too many tasks with same template in one mini-batch

\- tasks requiring prerequisite concepts not yet introduced in Learn mode



\### Selection scoring

For each candidate task compute a priority score:



priority\_score =

&#x20; due\_score

\+ weakness\_score

\+ exam\_importance\_score

\+ discrimination\_score

\+ freshness\_bonus

\+ unfinished\_goal\_bonus

\- repetition\_penalty

\- overload\_penalty



Definitions:

\- due\_score: higher when concept is due for review

\- weakness\_score: higher when user repeatedly fails related concepts

\- exam\_importance\_score: higher for frequently tested or required competencies

\- discrimination\_score: higher when task contrasts with recently seen confusable concepts

\- freshness\_bonus: small boost for unseen items

\- unfinished\_goal\_bonus: helps complete a targeted study goal

\- repetition\_penalty: prevents near-duplicate streaks

\- overload\_penalty: reduces probability of overly hard chains



\### Constrained interleaving rules

Within one subject block:

\- alternate between adjacent but distinct concepts when possible

\- allow same topic twice if concept differs

\- avoid same concept twice in a row unless the user just failed and retry is needed

\- create micro-batches of 3–5 tasks with varied concepts and varied task types



\### Cross-subject mixing

Default MVP behavior:

\- one subject per session

\- users may schedule multiple blocks in a study plan

Advanced option later:

\- mixed review blocks for highly stable users



\## 7.4 Difficulty adaptation

Track both global difficulty and user-specific difficulty.



\### Static difficulty

Each task gets:

\- difficulty\_base: 1–10

\- cognitive\_load: low/medium/high

\- task\_type\_complexity



\### User-adjusted difficulty

Compute effective difficulty from:

\- historical correctness

\- response time

\- hint usage

\- confidence mismatch

\- number of retries



Use target difficulty band per mode:

\- Learn: easy to moderate

\- Practice: moderate with some stretch

\- Review: mostly moderate

\- Exam: official distribution



\## 7.5 Spaced repetition / review scheduling

Use concept-level scheduling first, with task-level support.



Recommended MVP algorithm:

\- custom Leitner/SM-2 hybrid

\- simpler than full FSRS

\- transparent enough to debug



\### Concept state fields

\- stability\_score

\- difficulty\_score

\- consecutive\_successes

\- last\_seen\_at

\- next\_due\_at

\- last\_result



\### Scheduling rules (MVP)

After each concept attempt:

\- fail or abandon: next\_due\_at = now + 1 day

\- hard correct: next\_due\_at = now + 3 days

\- normal correct: next\_due\_at = now + 7 days

\- easy correct: next\_due\_at = now + 14 days

\- repeated success on multiple separate days extends interval multiplicatively



Add safeguards:

\- do not jump intervals too fast during early learning

\- do not extend long if the user relied on hints

\- reduce interval after slow correct answers with high uncertainty



\## 7.6 Successive relearning rule

A concept is not considered stable after one correct answer.

Require repeated successful retrieval across spaced sessions.



MVP rule:

\- concept becomes “stable” only after 3 successful retrieval events on separate days with acceptable speed and low hint usage



\## 7.7 Error taxonomy

Store structured error types.



Examples:

\### Math/Physics

\- wrong theorem selection

\- setup error

\- algebra slip

\- arithmetic slip

\- unit error

\- diagram misread

\- incomplete reasoning



\### Polish

\- no thesis

\- weak argument

\- unsupported claim

\- wrong context use

\- superficial interpretation

\- language/register issue

\- ignored prompt constraint



\### English

\- grammar structure error

\- lexical choice error

\- inference error

\- misread instruction

\- register mismatch

\- spelling/punctuation



This powers analytics and targeted remediation.



\## 7.8 Hint ladder

Do not reveal full solution immediately.

Use a progressive hint ladder:

1\. metacognitive prompt (“Which concept applies here?”)

2\. concept reminder

3\. worked step / structure cue

4\. almost-complete step

5\. full solution



Hint usage must reduce mastery gain and shorten next review interval.



\## 7.9 Confidence-based calibration

After answer submission ask optionally:

\- How confident were you? low / medium / high



Use this to detect:

\- correct but guessed

\- wrong but overconfident

\- slow but genuinely known



This should affect scheduling and analytics.



\## 8. MVP Scope by Subject



\### Math MVP

Support strongly in v1.

Include:

\- closed questions

\- open numeric questions

\- open short reasoning where answer can be manually reviewed later if needed

\- formulas/concepts/theorems

\- worked examples



\### English MVP

Support strongly in v1.

Include:

\- reading tasks

\- grammar/use-of-English tasks

\- writing prompts with semi-structured AI feedback marked as unofficial



\### Polish MVP

Support partially in v1.

Include:

\- reading/literature microtasks

\- oral prompt practice

\- essay planning support

\- paragraph-level writing practice

\- rubric-guided self-evaluation



Defer full high-stakes auto-grading of full essays.



\## 9. Functional Requirements



\## 9.1 Authentication and onboarding

\- email/password or magic link via Supabase Auth

\- onboarding asks target exam year, subjects, level, target score, weekly study capacity

\- optional diagnostic mini-test per subject



\## 9.2 Dashboard

Show:

\- today’s due reviews

\- suggested session

\- progress by subject

\- weakest concepts

\- upcoming exam countdown

\- recent mistakes

\- optional streak



\## 9.3 Study session builder

User can choose:

\- subject

\- mode (Learn / Practice / Review / Exam)

\- duration or number of tasks

\- specific topics or all topics

\- target exam component

\- difficulty preference



App can also offer “Recommended session”.



\## 9.4 Task player

Must support:

\- text tasks

\- image/PDF-derived diagrams stored as assets

\- multiple choice

\- single-line numeric answer

\- multi-part tasks

\- free-text short answer

\- essay paragraph prompt

\- oral prompt card



Task player includes:

\- prompt

\- optional asset

\- answer UI

\- confidence input

\- submit button

\- save/skip/report issue



\## 9.5 Results and review

After each task show:

\- correctness or provisional feedback

\- minimal explanation first

\- hint ladder if needed

\- full solution on demand

\- concept tags

\- common mistake note

\- “practice similar task” CTA



\## 9.6 Analytics

Student analytics must include:

\- mastery by concept

\- mastery by topic

\- readiness by requirement

\- accuracy over time

\- average response time by task type

\- hint dependency

\- confidence calibration

\- most common errors

\- upcoming review load



\## 9.7 Admin/content panel

Need a secure internal admin panel.

Capabilities:

\- create/edit tasks

\- upload assets

\- attach solution and hints

\- tag task metadata

\- publish/unpublish tasks

\- bulk import from CSV/JSON

\- review AI-suggested tags

\- manage sources and provenance



\## 9.8 Search and filters

Users can search by:

\- subject

\- topic

\- concept

\- exam component

\- task type

\- difficulty

\- source

\- year



\## 9.9 Exam mode

\- timed sections

\- no hints during attempt

\- lock after submit or timeout

\- show score breakdown after completion

\- compare to past attempts



\## 10. Non-functional Requirements

\- fast first paint on Vercel

\- task loading under 500 ms for cached paths when possible

\- mobile-responsive though desktop-first is acceptable

\- database-level row security

\- audit trail for content changes

\- content versioning

\- strong provenance for each task and solution



\## 11. Suggested Web App Information Architecture



\### Public pages

\- /

\- /about

\- /pricing (optional later)

\- /legal



\### Auth

\- /login

\- /signup

\- /onboarding



\### App

\- /app

\- /app/study

\- /app/study/session/\[sessionId]

\- /app/review

\- /app/exam

\- /app/library

\- /app/analytics

\- /app/settings



\### Admin

\- /admin

\- /admin/tasks

\- /admin/tasks/new

\- /admin/tasks/\[id]

\- /admin/imports

\- /admin/sources

\- /admin/review-queue



\## 12. UX Layout Recommendations



\## 12.1 Dashboard layout

Top:

\- daily due card

\- recommended session CTA

\- exam countdown



Middle:

\- progress by subject

\- weakest concepts

\- recent improvement chart



Bottom:

\- recent sessions

\- saved tasks

\- flagged tasks



\## 12.2 Study page layout

Left column:

\- session progress

\- timer

\- concept breadcrumb



Center:

\- task prompt and media

\- answer area



Right column:

\- notes scratchpad

\- formula/concept drawer hidden by default in non-exam modes



Post-submit panel:

\- verdict

\- explanation

\- hints/solution tabs

\- next task CTA



\## 12.3 Analytics layout

Tabs:

\- Overview

\- By subject

\- By concept

\- By mistakes

\- Review schedule

\- Exam readiness



\## 13. Database Design (Supabase/Postgres)



\## 13.1 Core tables



\### profiles

\- id uuid pk references auth.users

\- email text

\- display\_name text

\- exam\_year int

\- school\_type text

\- created\_at timestamptz

\- updated\_at timestamptz



\### subjects

\- id uuid pk

\- code text unique

\- name text

\- active boolean



\### exam\_components

\- id uuid pk

\- subject\_id uuid fk

\- code text

\- name text

\- level text

\- active boolean



\### topics

\- id uuid pk

\- subject\_id uuid fk

\- parent\_topic\_id uuid nullable

\- code text

\- name text

\- description text

\- active boolean



\### concepts

\- id uuid pk

\- subject\_id uuid fk

\- topic\_id uuid fk

\- code text

\- name text

\- concept\_type text  -- theorem/rule/skill/strategy/rubric

\- description text

\- prerequisite\_concept\_ids uuid\[] nullable

\- active boolean



\### requirements

\- id uuid pk

\- subject\_id uuid fk

\- exam\_component\_id uuid nullable

\- code text

\- name text

\- description text

\- active boolean



\### task\_types

\- id uuid pk

\- code text

\- name text

\- answer\_mode text -- mcq/numeric/short\_text/essay/oral



\### tasks

\- id uuid pk

\- subject\_id uuid fk

\- exam\_component\_id uuid fk nullable

\- primary\_topic\_id uuid fk

\- task\_type\_id uuid fk

\- source\_id uuid fk nullable

\- external\_source\_ref text nullable

\- title text

\- prompt\_md text

\- stimulus\_md text nullable

\- asset\_group\_id uuid nullable

\- difficulty\_base int

\- cognitive\_load text

\- estimated\_time\_sec int

\- year int nullable

\- official boolean default false

\- published boolean default false

\- active boolean default true

\- created\_at timestamptz

\- updated\_at timestamptz



\### task\_concepts

\- task\_id uuid fk

\- concept\_id uuid fk

\- weight numeric default 1.0

\- is\_primary boolean default false

\- pk(task\_id, concept\_id)



\### task\_requirements

\- task\_id uuid fk

\- requirement\_id uuid fk

\- weight numeric default 1.0

\- pk(task\_id, requirement\_id)



\### task\_options

\- id uuid pk

\- task\_id uuid fk

\- option\_key text

\- option\_text text

\- is\_correct boolean

\- position int



\### solutions

\- id uuid pk

\- task\_id uuid fk unique

\- final\_answer\_text text

\- solution\_md text

\- official\_scoring\_md text nullable

\- answer\_key\_json jsonb nullable

\- created\_at timestamptz

\- updated\_at timestamptz



\### hints

\- id uuid pk

\- task\_id uuid fk

\- hint\_level int

\- hint\_md text

\- created\_at timestamptz



\### worked\_examples

\- id uuid pk

\- concept\_id uuid fk

\- title text

\- example\_md text

\- asset\_group\_id uuid nullable

\- created\_at timestamptz



\### sources

\- id uuid pk

\- provider text

\- source\_type text -- official\_exam/informator/diagnostic/third\_party/manual

\- title text

\- url text

\- license\_notes text nullable

\- year int nullable

\- imported\_at timestamptz

\- hash text nullable



\### asset\_groups

\- id uuid pk

\- label text



\### assets

\- id uuid pk

\- asset\_group\_id uuid fk

\- storage\_path text

\- mime\_type text

\- alt\_text text

\- width int nullable

\- height int nullable



\## 13.2 User learning tables



\### user\_concept\_progress

\- id uuid pk

\- user\_id uuid fk

\- concept\_id uuid fk

\- mastery\_score numeric

\- stability\_score numeric

\- difficulty\_score numeric

\- consecutive\_successes int

\- last\_seen\_at timestamptz nullable

\- next\_due\_at timestamptz nullable

\- last\_result text nullable

\- lifetime\_attempts int default 0

\- lifetime\_successes int default 0

\- avg\_response\_time\_sec numeric nullable

\- hint\_dependency\_score numeric default 0

\- confidence\_calibration\_score numeric default 0

\- updated\_at timestamptz

\- unique(user\_id, concept\_id)



\### user\_requirement\_progress

\- id uuid pk

\- user\_id uuid fk

\- requirement\_id uuid fk

\- readiness\_score numeric

\- last\_seen\_at timestamptz nullable

\- updated\_at timestamptz

\- unique(user\_id, requirement\_id)



\### user\_task\_progress

\- id uuid pk

\- user\_id uuid fk

\- task\_id uuid fk

\- last\_seen\_at timestamptz

\- times\_seen int

\- last\_result text

\- last\_response\_time\_sec int nullable

\- last\_confidence text nullable

\- last\_hint\_level\_used int nullable

\- suspended\_until timestamptz nullable

\- unique(user\_id, task\_id)



\### study\_sessions

\- id uuid pk

\- user\_id uuid fk

\- mode text

\- subject\_id uuid fk

\- exam\_component\_id uuid nullable

\- planned\_task\_count int

\- completed\_task\_count int default 0

\- started\_at timestamptz

\- ended\_at timestamptz nullable

\- config\_json jsonb



\### session\_tasks

\- id uuid pk

\- session\_id uuid fk

\- task\_id uuid fk

\- order\_index int

\- chosen\_priority\_score numeric

\- chosen\_reason\_json jsonb



\### task\_attempts

\- id uuid pk

\- user\_id uuid fk

\- session\_id uuid fk nullable

\- task\_id uuid fk

\- submitted\_answer\_json jsonb

\- result text -- correct/incorrect/partial/skipped

\- auto\_score numeric nullable

\- response\_time\_sec int nullable

\- confidence text nullable

\- hint\_level\_used int default 0

\- attempt\_index int default 1

\- created\_at timestamptz



\### attempt\_error\_tags

\- attempt\_id uuid fk

\- error\_tag\_id uuid fk

\- pk(attempt\_id, error\_tag\_id)



\### error\_tags

\- id uuid pk

\- subject\_id uuid fk

\- code text

\- name text

\- description text



\### saved\_tasks

\- user\_id uuid fk

\- task\_id uuid fk

\- created\_at timestamptz

\- pk(user\_id, task\_id)



\### flagged\_tasks

\- id uuid pk

\- user\_id uuid fk

\- task\_id uuid fk

\- reason text

\- created\_at timestamptz



\## 13.3 Admin/import tables



\### import\_jobs

\- id uuid pk

\- source\_id uuid fk

\- status text

\- input\_type text -- manual/csv/json/scrape/pdf\_parse

\- payload\_json jsonb

\- created\_at timestamptz

\- completed\_at timestamptz nullable



\### import\_job\_items

\- id uuid pk

\- import\_job\_id uuid fk

\- raw\_item\_json jsonb

\- parsed\_item\_json jsonb nullable

\- review\_status text

\- created\_task\_id uuid nullable



\### content\_change\_log

\- id uuid pk

\- actor\_user\_id uuid fk nullable

\- entity\_type text

\- entity\_id uuid

\- action text

\- diff\_json jsonb

\- created\_at timestamptz



\## 14. Recommended Row-Level Security Model

\- profiles: user can read/update own profile

\- user\_\* tables: user can read/write only own rows

\- published learning content: readable by authenticated users

\- admin tables: admin role only

\- content change log: admin only

\- sources/import jobs: admin only



\## 15. API / Backend Architecture

Use Next.js route handlers or Supabase Edge Functions for heavier logic.



\### Key backend services

1\. session planner

2\. scoring engine

3\. scheduler updater

4\. analytics aggregator

5\. content import parser

6\. AI helper service for explanation/tag suggestion



\### Suggested service boundaries

\#### session planner

Input:

\- user id

\- mode

\- subject

\- constraints

Output:

\- ordered task queue with reasons



\#### scoring engine

\- validates answers

\- scores objective items

\- computes partial score if supported

\- marks subjective items for provisional/manual/AI-assisted feedback



\#### scheduler updater

\- updates concept and requirement progress

\- computes next\_due\_at

\- applies hint/confidence penalties



\#### analytics aggregator

\- materialized views or nightly jobs later

\- MVP can compute on demand for a smaller dataset



\## 16. AI Usage Policy

Allowed in MVP:

\- generate simpler explanation drafts

\- suggest concept tags during import

\- suggest error tags from user answer

\- provide rubric-guided feedback for paragraphs and writing practice

\- transform official solution into student-friendly explanation draft



Not allowed as source of truth:

\- final official answer key

\- final score for high-stakes essays without human-verifiable rubric and disclaimer

\- hallucinated task content



All AI outputs should be stored with:

\- ai\_model

\- prompt\_version

\- generated\_at

\- review\_status



\## 17. Content Ingestion Strategy

MVP should assume manual+semi-automated ingestion.



\### Official content priorities

1\. CKE informatory

2\. official exam sheets + scoring guides

3\. official diagnostic sheets

4\. jawne oral Polish prompts

5\. selected third-party sources only if legally safe



\### Import pipeline (recommended)

1\. register source

2\. upload or reference PDF/URL

3\. parse into raw blocks

4\. human review candidate tasks

5\. attach metadata

6\. publish



\### Practical recommendation

Do not try to fully automate parsing of all PDFs in v1.

Instead:

\- build a clean review queue

\- allow admin to paste prompt/answer/hints

\- use AI only to prefill fields



\## 18. Initial Content Coverage Strategy

\### Phase 1

\- Math podstawa

\- English podstawa

\- Polish oral prompts + selected written microtasks



\### Phase 2

\- Math rozszerzenie

\- English rozszerzenie pieces

\- Polish essay planning and paragraph tasks



\### Phase 3

\- Biology/Chemistry/Physics based on available structured content



\## 19. Scoring Strategy by Task Type

\### MCQ

\- exact match auto-score



\### Numeric answer

\- exact or tolerance-based scoring



\### Short text

\- exact match / normalized match / accepted variants list



\### Multi-part task

\- per-part scoring + aggregate score



\### Essay paragraph

\- rubric-guided AI-assisted feedback, clearly marked unofficial



\### Oral prompt

\- self-record or text outline optional later; MVP can use structured self-assessment checklist



\## 20. Product Metrics

\### User metrics

\- D1/D7 retention

\- weekly active learners

\- sessions per week

\- completion rate of recommended sessions

\- average review backlog size



\### Learning metrics

\- concept mastery growth

\- percentage of due reviews completed on time

\- reduction in repeated error types

\- improved performance on previously failed concepts

\- exam simulation score trend



\### Content metrics

\- tasks per subject

\- tasks with full metadata coverage

\- tasks with verified solutions

\- flagged task rate



\## 21. Recommended MVP Build Order

\### Milestone 1: Core foundation

\- auth

\- profiles

\- content schema

\- admin task CRUD

\- task player for MCQ/numeric/short text



\### Milestone 2: Adaptive engine

\- session planner

\- concept scheduling

\- hint ladder

\- user progress tracking

\- dashboard



\### Milestone 3: Analytics

\- concept analytics

\- due reviews

\- error taxonomy

\- confidence tracking



\### Milestone 4: Exam mode

\- timed session

\- score breakdown

\- post-session analysis



\### Milestone 5: Polish/English richer support

\- paragraph feedback

\- oral prompt mode

\- writing rubric support



\## 22. Implementation Notes for Vercel + Supabase

\- Use Next.js App Router

\- SSR/Server Components for dashboard and content-heavy pages

\- client components only for interactive task player

\- use Supabase server client in route handlers/actions

\- store images/PDF snippets in Supabase Storage

\- use signed URLs if needed for protected assets

\- use Postgres views for analytics summaries

\- use cron jobs or edge scheduled functions later for batch recalculation



\## 23. Recommended Agent Tasks

If handing this PRD to an AI coding agent, split the work into tickets:



1\. scaffold Next.js + Supabase app with auth and app shell

2\. create DB schema and RLS policies

3\. build admin CRUD for subjects/topics/concepts/tasks/solutions/hints

4\. build task player for MCQ/numeric/short answer

5\. build session planner endpoint with constrained interleaving

6\. build scheduler updater and concept progress logic

7\. build dashboard and due review widgets

8\. build analytics pages

9\. build exam mode and timer

10\. build import pipeline for CSV/JSON/manual source linking



\## 24. MVP Acceptance Criteria

The MVP is successful when:

\- a user can sign up and configure subjects

\- admin can import and publish task content

\- user can start a session in Practice or Review mode

\- tasks are chosen using constrained interleaving and due review logic

\- answers are scored for supported task types

\- concept mastery and next\_due\_at update correctly

\- dashboard shows due reviews and weakest concepts

\- exam mode runs end-to-end for at least one subject



\## 25. Recommended Simplifications

To avoid overbuilding:

\- use one main adaptive algorithm rather than many competing modes under the hood

\- use manual metadata review for imported tasks

\- use a simple spacing model first

\- keep essay scoring lightweight and clearly unofficial

\- start with one polished subject before scaling breadth



\## 26. Biggest Risks

1\. Content ingestion bottleneck

2\. Weak metadata quality causing poor adaptivity

3\. Overcomplicated scheduling logic that is hard to debug

4\. Poor support for Polish writing/oral evaluation

5\. Building too much “AI” before nailing core practice flow



\## 27. Final Recommendation

The winning MVP is:

\- official-content-backed

\- concept-tagged

\- adaptively scheduled

\- strong in Math first

\- practical in English

\- selective and rubric-driven in Polish

\- transparent about why each task was chosen



The product should feel like:

\- a smart exam coach

\- not a random worksheet generator

\- not a generic flashcard app

\- not a black-box AI tutor





