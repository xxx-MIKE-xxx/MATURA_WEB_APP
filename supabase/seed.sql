insert into public.subjects (id, code, name, active) values
  ('00000000-0000-0000-0000-000000000101', 'math', 'Matematyka', true),
  ('00000000-0000-0000-0000-000000000102', 'english', 'English', true),
  ('00000000-0000-0000-0000-000000000103', 'polish', 'Polski', true)
on conflict (code) do update set name = excluded.name, active = excluded.active;

insert into public.exam_components (id, subject_id, code, name, level, active) values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'basic', 'Matematyka podstawowa', 'basic', true),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', 'reading', 'Reading', 'basic', true),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'writing', 'Writing', 'basic', true),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'use-of-english', 'Use of English', 'basic', true),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', 'written-basic', 'Polski pisemny', 'basic', true),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000103', 'oral', 'Polski ustny', 'basic', true)
on conflict (subject_id, code) do update set name = excluded.name, level = excluded.level, active = excluded.active;

insert into public.topics (id, subject_id, parent_topic_id, code, name, description, active) values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000101', null, 'geometry', 'Geometria', 'Geometry tasks for basic Matura.', true),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000101', null, 'algebra', 'Algebra', 'Quadratics and algebraic manipulation.', true),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000101', null, 'probability', 'Prawdopodobieństwo', 'Classical probability tasks.', true),
  ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000102', null, 'writing', 'Writing', 'Formal and functional writing.', true),
  ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000102', null, 'reading', 'Reading', 'Inference and gist tasks.', true),
  ('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000102', null, 'grammar', 'Use of English', 'Grammar structure tasks.', true),
  ('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000103', null, 'interpretation', 'Interpretacja', 'Thesis and argument tasks.', true),
  ('00000000-0000-0000-0000-000000000308', '00000000-0000-0000-0000-000000000103', null, 'context', 'Konteksty', 'Context selection for written work.', true),
  ('00000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000103', null, 'oral', 'Matura ustna', 'Jawne pytania and speaking structure.', true)
on conflict (subject_id, code) do update set name = excluded.name, description = excluded.description, active = excluded.active;

insert into public.concepts (id, subject_id, topic_id, code, name, concept_type, description, prerequisite_concept_ids, active) values
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000301', 'pythagorean', 'Twierdzenie Pitagorasa', 'theorem', 'Right-triangle relationship.', '{}', true),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000302', 'quadratic-roots', 'Miejsca zerowe funkcji kwadratowej', 'rule', 'Factoring and solving quadratics.', '{}', true),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000303', 'classic-probability', 'Prawdopodobieństwo klasyczne', 'strategy', 'Equally likely outcomes.', '{}', true),
  ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000306', 'tense-agreement', 'Tense agreement', 'rule', 'Past perfect and sequence of events.', '{}', true),
  ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000304', 'formal-register', 'Formal register', 'skill', 'Formal email tone and openings.', '{}', true),
  ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000305', 'reading-inference', 'Reading inference', 'strategy', 'Infer tone and implied meaning.', '{}', true),
  ('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000307', 'thesis-building', 'Budowanie tezy', 'skill', 'Make a defensible thesis from the prompt.', '{}', true),
  ('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000308', 'context-use', 'Dobór kontekstu', 'skill', 'Choose a context that actually proves the claim.', '{}', true),
  ('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000309', 'oral-structure', 'Struktura wypowiedzi ustnej', 'strategy', 'Thesis, example, context speaking structure.', '{}', true)
on conflict (subject_id, code) do update set name = excluded.name, concept_type = excluded.concept_type, description = excluded.description, active = excluded.active;

insert into public.requirements (id, subject_id, exam_component_id, code, name, description, active) values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'uses-right-triangle-properties', 'Uses right-triangle properties', 'Identifies and applies Pythagorean relationships.', true),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'solves-quadratic-equations', 'Solves quadratic equations', 'Finds roots and interprets factor form.', true),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'counts-equally-likely-outcomes', 'Counts equally likely outcomes', 'Computes simple probability.', true),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000204', 'selects-correct-grammar-structure', 'Selects correct grammar structure', 'Chooses the tense that matches sequence and aspect.', true),
  ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000203', 'writes-formal-email', 'Writes formal email', 'Maintains proper register in functional writing.', true),
  ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000202', 'understands-implied-meaning', 'Understands implied meaning', 'Infers tone and implied message.', true),
  ('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000205', 'builds-argument-from-prompt', 'Builds argument from prompt', 'Takes a thesis-led stance.', true),
  ('00000000-0000-0000-0000-000000000508', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000205', 'uses-context-precisely', 'Uses context precisely', 'Selects a context that strengthens the claim.', true),
  ('00000000-0000-0000-0000-000000000509', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000206', 'maintains-oral-response-structure', 'Maintains oral response structure', 'Keeps a clear thesis-example-context sequence.', true)
on conflict (subject_id, code) do update set name = excluded.name, description = excluded.description, active = excluded.active;

insert into public.task_types (id, code, name, answer_mode) values
  ('00000000-0000-0000-0000-000000000601', 'mcq', 'Multiple choice', 'mcq'),
  ('00000000-0000-0000-0000-000000000602', 'numeric', 'Numeric answer', 'numeric'),
  ('00000000-0000-0000-0000-000000000603', 'short_text', 'Short text', 'short_text'),
  ('00000000-0000-0000-0000-000000000604', 'essay', 'Essay paragraph', 'essay'),
  ('00000000-0000-0000-0000-000000000605', 'oral', 'Oral prompt', 'oral')
on conflict (code) do update set name = excluded.name, answer_mode = excluded.answer_mode;

insert into public.sources (id, provider, source_type, title, url, year) values
  ('00000000-0000-0000-0000-000000000701', 'CKE', 'official_exam', 'CKE Matematyka Podstawa 2024', 'https://cke.gov.pl', 2024),
  ('00000000-0000-0000-0000-000000000702', 'CKE', 'official_oral_bank', 'Jawne pytania ustne 2025', 'https://cke.gov.pl', 2025),
  ('00000000-0000-0000-0000-000000000703', 'Internal', 'manual', 'Internal English writing bank', null, 2025)
on conflict (id) do nothing;

insert into public.tasks (
  id, subject_id, exam_component_id, primary_topic_id, task_type_id, source_id, title, prompt_md,
  difficulty_base, cognitive_load, estimated_time_sec, year, official, published, active
) values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000701', 'Right triangle side length', 'W trójkącie prostokątnym przyprostokątne mają długości 6 i 8. Oblicz długość przeciwprostokątnej.', 3, 'low', 75, 2024, true, true, true),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000701', 'Roots of a quadratic', 'Podaj miejsca zerowe funkcji f(x) = x^2 - 5x + 6.', 5, 'medium', 110, 2024, true, true, true),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000703', 'Choose the correct tense', 'Complete the sentence: I ______ for the bus for twenty minutes when it finally arrived.', 4, 'medium', 70, 2025, false, true, true),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000703', 'Formal email register', 'Which opening fits a formal email to a school coordinator asking for additional exam practice materials?', 5, 'medium', 80, 2025, false, true, true),
  ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000702', 'Build a thesis from the prompt', 'Prompt: ''Czy samotność zawsze osłabia człowieka?'' Write one concise thesis sentence that could open a matura paragraph response.', 6, 'high', 180, 2025, false, true, true),
  ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000702', 'Oral prompt skeleton', 'Jawne pytanie: ''Jaką funkcję pełni bunt bohatera literackiego?'' Draft a 3-part speaking outline: thesis, literary example, context.', 7, 'high', 240, 2025, true, true, true)
on conflict (id) do update set title = excluded.title, prompt_md = excluded.prompt_md, difficulty_base = excluded.difficulty_base, cognitive_load = excluded.cognitive_load, estimated_time_sec = excluded.estimated_time_sec, published = excluded.published, active = excluded.active;

insert into public.task_concepts (task_id, concept_id, weight, is_primary) values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000401', 1.0, true),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000402', 1.0, true),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000404', 1.0, true),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000405', 1.0, true),
  ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000407', 1.0, true),
  ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000409', 1.0, true)
on conflict (task_id, concept_id) do update set weight = excluded.weight, is_primary = excluded.is_primary;

insert into public.task_requirements (task_id, requirement_id, weight) values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000501', 1.0),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000502', 1.0),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000504', 1.0),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000505', 1.0),
  ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000507', 1.0),
  ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000509', 1.0)
on conflict (task_id, requirement_id) do update set weight = excluded.weight;

insert into public.task_options (id, task_id, option_key, option_text, is_correct, position) values
  ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000804', 'A', 'Hi there, I need some worksheets.', false, 1),
  ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000804', 'B', 'Dear Ms Kowalska, I am writing to ask whether...', true, 2),
  ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000804', 'C', 'Hey, could you send me...', false, 3),
  ('00000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000804', 'D', 'What''s up? I wanted to ask...', false, 4)
on conflict (id) do update set option_text = excluded.option_text, is_correct = excluded.is_correct, position = excluded.position;

insert into public.solutions (id, task_id, final_answer_text, solution_md, answer_key_json) values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000801', '10', 'Apply a^2 + b^2 = c^2. 6^2 + 8^2 = 100, so c = 10.', '{"accepted":["10"]}'::jsonb),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000802', '2 and 3', 'Factor x^2 - 5x + 6 as (x - 2)(x - 3).', '{"accepted":["2 and 3","2, 3","x=2 and x=3"]}'::jsonb),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000803', 'had been waiting', 'The waiting started before another past event, so use past perfect continuous.', '{"accepted":["had been waiting"]}'::jsonb),
  ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000804', 'B', 'Formal writing needs a proper salutation and polite framing.', '{"accepted":["B"]}'::jsonb),
  ('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000805', null, 'Example thesis: Samotność nie zawsze osłabia człowieka, ponieważ może stać się warunkiem samopoznania i świadomej decyzji.', '{}'::jsonb),
  ('00000000-0000-0000-0000-000000001006', '00000000-0000-0000-0000-000000000806', null, 'A strong outline states the function of rebellion, anchors it in one work, and adds a focused context.', '{}'::jsonb)
on conflict (task_id) do update set final_answer_text = excluded.final_answer_text, solution_md = excluded.solution_md, answer_key_json = excluded.answer_key_json;

insert into public.hints (task_id, hint_level, hint_md) values
  ('00000000-0000-0000-0000-000000000801', 1, 'Which relationship connects the three sides in a right triangle?'),
  ('00000000-0000-0000-0000-000000000801', 2, 'Square the two shorter sides before adding them.'),
  ('00000000-0000-0000-0000-000000000803', 1, 'There are two past moments here: the waiting and the arrival.'),
  ('00000000-0000-0000-0000-000000000804', 1, 'Think about tone first, not just meaning.'),
  ('00000000-0000-0000-0000-000000000805', 1, 'A strong thesis takes a position, not just restates the topic.'),
  ('00000000-0000-0000-0000-000000000806', 1, 'Start with one claim you can defend in under a minute.')
on conflict do nothing;

insert into public.worked_examples (concept_id, title, example_md) values
  ('00000000-0000-0000-0000-000000000401', 'Worked example: right triangle', 'Given sides 5 and 12, compute the hypotenuse by squaring, summing, and taking the square root.'),
  ('00000000-0000-0000-0000-000000000405', 'Worked example: formal request', 'Compare an informal opening with a formal email opener and identify why tone changes scoring.')
on conflict do nothing;

insert into public.error_tags (subject_id, code, name, description) values
  ('00000000-0000-0000-0000-000000000101', 'setup-error', 'Setup error', 'The student chooses the wrong structure or theorem.'),
  ('00000000-0000-0000-0000-000000000102', 'register-mismatch', 'Register mismatch', 'The student shifts into informal language.'),
  ('00000000-0000-0000-0000-000000000103', 'no-thesis', 'No thesis', 'The response does not take a clear stance.')
on conflict (subject_id, code) do update set name = excluded.name, description = excluded.description;
