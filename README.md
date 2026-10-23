# CS 247S Physician Consultation Prototypes

This repository is the home base for three research prototypes exploring how digital tools might improve physician-to-physician inpatient consultation. The prototypes examine three connected moments in the workflow:

1. managing and prioritizing incoming consultations;
2. documenting a consultation efficiently; and
3. submitting a complete, useful consultation request.

The goal is not to build a production clinical system. We are creating focused prototypes that let us observe behavior, compare interaction approaches, and learn where a tool helps or adds burden. Each prototype should remain small enough to test one primary question well.

## Project ground rules

These rules apply across all three prototypes and to any Codex work performed in this repository:

- **Target Windows.** Product behavior, setup instructions, testing, shortcuts, and implementation decisions should assume a Windows operating system.
- **Use Epic as the clinical design baseline.** The prototypes should feel understandable to clinicians who work in Epic and should draw from familiar EHR patterns for patient context, worklists, information density, navigation, status, and documentation. They must not imply an official Epic integration or copy proprietary assets without permission.
- **Use synthetic data only.** No real patient information or protected health information may appear in the prototypes, repository, prompts, recordings, or external services.
- **Preview locally after every build.** Every functional build or material interface change must be run and checked locally. The team should receive a working localhost URL before the work is presented as ready for review.
- **Preview before pushing.** The current version must be available on localhost for review before any remote push.
- **Never push without explicit approval.** Editing, building, previewing, committing, or configuring a remote does not authorize a push. Codex must receive an explicit instruction to push in the current conversation.
- **Do not publish externally without approval.** Creating a pull request or deployment also requires a specific user instruction.

Repository-level instructions for Codex are recorded in `AGENTS.md`.

## Project background

Interviews with hospitalists, consultants, and clinical workflow experts describe consultation as a parallel, interruption-heavy process. A consultant may receive a page while managing active patients, reconstruct the clinical context from several sources, clarify the question by phone, see the patient, discuss the case with a supervisor, communicate an interim plan, write a note, and continue following pending results.

Several recurring issues motivate these prototypes:

- A page may omit the patient identifier, callback path, urgency, or clinical question.
- The requester often cannot see whether a consult was received, accepted, assigned, or completed.
- Consultants manage many cases in parallel, with different levels of urgency and different next actions.
- The actionable recommendation may be communicated before the formal note is written.
- Clinical context and decision history are split across paging, the EHR, phone calls, messaging, and handoff.
- Structured fields can prevent omissions, but they cannot replace clinical judgment or conversation.

The concepts in this repository are grounded in those workflow findings, but every patient, clinician, identifier, timestamp, result, and event used in the prototypes must be fictional.

## Research approach

We will build three separate testable experiences rather than one end-to-end application. Each experience should use comparable synthetic consultation scenarios so that we can distinguish reactions to the interaction design from reactions to different clinical cases.

For each prototype, the team will:

1. define one primary research question and a small set of secondary questions;
2. prepare a clickable or functional prototype with only the interactions needed to answer those questions;
3. create a facilitator guide, participant tasks, and observation sheet;
4. pilot the session with a teammate before recruiting participants;
5. run usability sessions and collect behavioral evidence, participant explanations, and task outcomes;
6. synthesize findings by prototype and then compare themes across all three;
7. document design implications without treating prototype preference as proof of clinical effectiveness.

## Prototype 1 Consultant work board

### Purpose

This prototype tests whether a consultant-controlled visual board makes parallel consultation work easier to understand and manage. It focuses on shared status, prioritization, and ownership rather than chart review or clinical decision support.

### Primary research question

Can consultants use a persistent visual board to recognize new work, decide whether to accept it, and reorganize active consultations without losing track of urgency, ownership, or next steps?

### Core experience

The participant enters a page where a floating consultation board is already open. It should feel like a persistent work surface layered above the underlying clinical workspace: visually distinct, always available, and not dismissible during the test. The prototype begins with several consultation cards already distributed across the board.

Suggested board columns:

- **New:** requests awaiting review;
- **Accepted:** requests acknowledged by the current consultant or team;
- **In progress:** chart review, clarification, bedside assessment, or staffing underway;
- **Waiting:** blocked on a result, another clinician, or a future review point;
- **Ready to close:** recommendations communicated and documentation or acknowledgement pending;
- **Completed:** closed consultations retained for orientation during the session.

The column labels are hypotheses, not final requirements. Early testing should determine whether consultants think in these stages or prefer a smaller, more flexible set.

### Required interactions

- View a board pre-populated with realistic consultation cards.
- Open a card to see the consultation question, requester, service, urgency, time received, patient summary, and current next action.
- Drag a card within a column to reprioritize it.
- Drag a card between columns to change its status.
- Receive a new consultation while working on the board.
- Accept or reject the new consultation.
- If accepting, assign an owner and place the consult in the appropriate queue position.
- If rejecting, select or enter a reason and indicate the correct service or next step when known.
- See a lightweight history of status and ownership changes.

Accept and reject should represent workflow decisions, not clinical approval or denial of care. A rejected request must remain visible to the requester in the prototype state and must include a reason or routing action. The experience should never imply that dismissing a card silently resolves the underlying patient need.

### Information on each card

Cards should show only the information needed for triage:

- fictional patient name and clearly fake medical record number;
- age range or age, if relevant to the scenario;
- requesting service and best-informed contact;
- requested specialty;
- focused clinical question or decision needed;
- stated urgency and time expectation;
- time received and elapsed time;
- current owner;
- status and next action;
- one or two high-signal clinical facts;
- indicators for pending results, discharge dependency, or escalation.

Details such as a full chart, exhaustive laboratory history, or complete note should not appear unless they are necessary to test a specific triage decision.

### Initial test tasks

1. Review the existing board and explain what you would work on next.
2. Reorder the cases to match your priorities.
3. Move one case to reflect that you are waiting on a result.
4. Respond to a newly arriving consult by accepting or rejecting it.
5. Reassign or hand off one active case.
6. Find which case is most at risk of being forgotten and explain why.

### What to observe

- Whether participants understand the meaning of columns without explanation.
- Which card details they use when prioritizing.
- Whether drag-and-drop feels faster and clearer than opening menus.
- Whether moving a card is interpreted as changing status, changing priority, or both.
- What evidence participants need before accepting or rejecting a request.
- Whether rejection language feels clinically and professionally appropriate.
- Whether the persistent floating board supports awareness or obstructs other work.
- Whether consultants need specialty-specific views, filters, or multiple owners.

### Measures

- Time to identify the next case to address.
- Accuracy in locating urgent, discharge-blocking, and waiting cases.
- Number of misplaced or unintentionally changed cards.
- Time and confidence when accepting or rejecting a new request.
- Ability to explain the current owner and next action for each active case.
- Perceived workload and usefulness after the task.

### Key design decisions to resolve

- Whether rejection should be named **redirect**, **return for clarification**, or another less ambiguous action.
- Whether urgency should be set by the requester, adjusted by the consultant, or shown as both perspectives.
- Whether priority is represented by vertical order, an explicit label, or both.
- Whether the board is personal, team-based, or switchable between the two.
- What must happen before a consultation can be marked complete.

## Prototype 2 Consultation note entry comparison

### Purpose

This prototype compares two ways of turning a consultant's reasoning into a usable consultation note:

- typing the note directly; and
- speaking a case summary, reviewing a transcript, and using an LLM-assisted step to create a structured draft.

The test is about workflow effort, accuracy, trust, and editability. It is not intended to show that speech or AI is inherently superior.

### Primary research question

For a realistic completed consult, does speech-to-text followed by assisted summarization reduce documentation effort without reducing accuracy, control, or confidence compared with direct typing?

### Comparison design

Use a within-participant comparison when feasible: each participant completes both entry methods with two cases of similar complexity. Counterbalance the order so that half of the participants begin with typing and half begin with speech. Swap the case-to-method pairing across participants to reduce scenario bias.

#### Path A Direct typing

1. Review the synthetic patient context and consultation question.
2. Type a consultation note into an ordinary text editor.
3. Review and submit the note.

#### Path B Speech to text and assisted summary

1. Review an equivalent synthetic patient context and consultation question.
2. Speak an account of what happened, the assessment, and the plan.
3. Review and correct the transcript.
4. Generate an LLM-assisted structured draft from the corrected transcript.
5. Review, edit, and approve the draft.
6. Submit the final note.

The participant must always be able to inspect and edit both the transcript and the generated draft. The prototype should label generated text clearly and should never present it as independently verified.

### Suggested note sections

- reason for consultation;
- relevant history and findings;
- assessment;
- recommendations and immediate actions;
- uncertainty and alternatives considered;
- pending information;
- contingencies or escalation criteria;
- ownership and follow-up plan.

### Initial test tasks

1. Complete one note by typing directly.
2. Complete a matched note by speaking, correcting the transcript, generating a draft, and editing it.
3. Identify any statement in either final note that could be misleading or unsafe.
4. Compare which process better preserved uncertainty, contingencies, and follow-up ownership.
5. Explain when speech would or would not be appropriate in the participant's real work setting.

### What to observe

- Total time and active editing time for each path.
- Pauses, restarts, and changes in reasoning while speaking or typing.
- Transcript errors involving medications, numbers, negation, abbreviations, names, or clinical terms.
- Information omitted, added, or altered by summarization.
- Whether the summary overstates certainty or removes nuance.
- How much of the generated draft the participant rewrites.
- Whether participants feel comfortable speaking in their likely physical environment.
- Whether participants trust the process enough to sign the final note.

### Measures

- Time from starting entry to final approval.
- Number and severity of transcript corrections.
- Number and severity of generated-summary corrections.
- Completeness against a scenario-specific reference checklist.
- Unsupported statements or clinically meaningful omissions.
- Participant-rated effort, control, trust, and preference.
- Estimated edit distance or proportion of generated text changed before approval.

### Safety requirements for the prototype

- Use only scripted synthetic cases and fake identifiers.
- Do not record or upload real patient information.
- Make recording state obvious and provide a visible stop control.
- Tell participants whether session audio is stored; default to not retaining audio unless the study protocol requires it.
- Treat the generated note as a draft that requires clinician review.
- Include failure examples such as incorrect negation, dose, laterality, or attribution so the test examines correction behavior.

### Key design decisions to resolve

- Whether participants should speak freely or follow verbal prompts.
- Whether transcription correction should happen before or alongside summarization.
- Whether the generated draft should preserve the speaker's phrasing or normalize it into a note template.
- How source transcript segments should be linked to generated statements.
- What level of change should trigger a warning or require explicit confirmation.

## Prototype 3 Structured consultation request template

### Purpose

This prototype tests whether a structured request template helps the requesting clinician provide enough information for the consultant to begin useful work without turning consultation into a rigid checklist.

### Primary research question

Can a concise, context-sensitive template improve request completeness and question clarity while preserving speed and specialty-specific judgment?

### Core experience

The participant is shown a synthetic patient scenario and asked to initiate a consultation. The form should make the decision needed explicit, require minimum routing information, and distinguish information that is required from information that is helpful when available.

### Proposed template sections

#### Request identity and routing

- fictional patient identifier;
- requesting service;
- requesting clinician;
- best-informed contact and callback method;
- requested specialty or service;
- urgency and desired response window;
- reason for urgency or relevant time constraint.

#### Focused consultation question

- decision or question the consultant is being asked to address;
- what has changed or prompted the request now;
- desired form of help, such as evaluation, procedural guidance, medication recommendation, or co-management.

#### Relevant context

- brief clinical summary;
- preliminary assessment or working diagnosis;
- relevant workup completed;
- key positive and negative findings;
- interventions already attempted and response;
- pending tests, reports, or procedures.

#### Coordination and follow-up

- whether the patient is discharge-blocked or unstable;
- who can clarify undocumented procedural or bedside findings;
- current location and availability for examination;
- escalation path if the patient's condition changes;
- acknowledgement and status after submission.

The template should not ask the requester to duplicate the entire chart. It should link to or summarize only the information needed to frame the consultation.

### Adaptive behavior to test

- Reveal specialty-specific prompts only after the service is chosen.
- Warn about missing minimum information before submission.
- Allow **unknown** or **not yet available** when that answer is clinically legitimate.
- Explain why a required field matters.
- Offer a short preview showing exactly what the consultant will receive.
- Preserve a free-text path for cases that do not fit the template.

### Initial test tasks

1. Submit a routine consultation request from a complete scenario.
2. Submit an urgent request where some information is not yet available.
3. Handle a case where the person entering the request did not witness the relevant event.
4. Correct a request after the consultant asks for clarification.
5. Review the consultant-facing preview and identify anything unnecessary or missing.

### What to observe

- Whether participants can state a decision-focused consultation question.
- Which required fields cause delay, confusion, or fabricated guesses.
- Whether specialty-specific prompts improve preparation.
- Whether the template helps the participant identify the best-informed contact.
- How participants express uncertainty and pending information.
- Whether the form feels like useful preparation or administrative duplication.
- Whether the consultant can triage the resulting request without an avoidable clarification call.

### Measures

- Completion time.
- Required-field and optional-field completion rates.
- Number of clarification questions needed after submission.
- Consultant rating of question clarity, relevance, and actionability.
- Duplicate or unnecessary information entered.
- Participant-rated burden and confidence.

### Key design decisions to resolve

- Which fields are universal and which must vary by specialty.
- How to distinguish urgency from priority and expected response time.
- Whether a request can be submitted with missing information in urgent situations.
- Who may revise the request after submission.
- How acknowledgement, redirection, and closure appear to the requester.

## Synthetic patient scenario strategy

All usability testing must use synthetic data. Interview findings may inform workflow structure and common points of friction, but details from interview participants or real patients must not be copied into prototype records.

### Rules for scenario creation

- Create each case from scratch rather than altering a real patient's record.
- Combine generic workflow patterns from multiple interviews so no scenario maps to one individual.
- Use obviously fictional names and identifiers reserved for testing.
- Do not include real dates of birth, addresses, phone numbers, medical record numbers, or rare combinations of events that could identify a person.
- Label every screen and handout **Synthetic test data — not for clinical use**.
- Keep the dataset inside the project workspace and approved study materials.
- Do not paste real protected health information into transcription, AI, analytics, or prototyping services.
- Have a clinically knowledgeable reviewer check each scenario for realism, internal consistency, and avoidable safety issues.
- Document which facts are intentionally available, pending, ambiguous, or missing so facilitators score participants consistently.

### Reusable scenario set

The first testing round should include at least four cases with different coordination demands. These are starting points to be reviewed by a clinical advisor before testing.

#### Scenario A Routine but discharge-blocking question

A medically stable adult is approaching discharge after treatment for an uncomplicated condition. A new medication-related finding raises a focused specialty question. The primary team has completed the expected initial workup, but discharge depends on receiving a recommendation today.

Use this case to test priority versus acuity, completeness of a routine request, and whether the final note makes the discharge decision clear.

#### Scenario B Urgent evolving condition

An adult inpatient develops a significant change in condition. The team has started immediate stabilization and obtained initial tests, but one important result is pending. The consultation request must communicate urgency without pretending the case is complete.

Use this case to test escalation, acceptance, incomplete-but-legitimate information, contingencies, and whether speech or summarization preserves uncertainty and negation.

#### Scenario C Procedural context held by another clinician

A postoperative patient has a finding that may require specialty input. The clinician entering the request did not observe the procedure and cannot answer one key question, but the procedural clinician is available as the best-informed contact.

Use this case to test contact selection, redirection, missing context, and whether the template supports honest uncertainty instead of guessed answers.

#### Scenario D Multi-day follow-up with pending evidence

A stable patient requires specialty recommendations that depend on results expected over the next one or two days. The consultant gives a provisional plan and needs to define what the primary team should do now, what result will change the plan, and who owns follow-up.

Use this case to test the waiting state, handoff, documentation of contingencies, and closure criteria.

### Scenario packet format

Each case should have:

- a facilitator-only source of truth;
- a participant-facing chart excerpt;
- a consultation request or triggering event;
- a timeline of what is known at each moment;
- expected high-signal details;
- intentionally missing or pending details;
- plausible distractors;
- a scoring checklist;
- scripted system events, such as a new result or incoming consult;
- debrief questions tied to the prototype's research question.

## Cross-prototype study plan

### Phase 1 Framing

- Confirm the participant groups: requesting clinicians, consultants, or both.
- Map each prototype to one primary research question.
- Decide which scenario is used in each task and counterbalance order where comparisons are involved.
- Review the study protocol, consent language, recording plan, and data handling with the course team.

### Phase 2 Low-fidelity design

- Sketch the board states, note-entry paths, and request template.
- Run cognitive walkthroughs using the four synthetic cases.
- Remove interactions that do not contribute to the primary question.
- Define success, failure, and partial success for every task.

### Phase 3 Prototype preparation

- Build only the states and transitions required by the test script.
- Seed each experience with deterministic synthetic data.
- Prepare reset instructions so every participant begins from the same state.
- Add event triggers for the incoming consultation, pending result, and clarification request.
- Verify that no real patient or clinician information appears anywhere in the prototype or supporting files.

### Phase 4 Pilot

- Conduct at least one internal pilot and one pilot with a clinically informed reviewer if available.
- Check scenario realism, task timing, terminology, and facilitator neutrality.
- Revise confusing prompts before formal sessions.

### Phase 5 Usability sessions

- Introduce the study as an evaluation of the prototype, not the participant.
- Ask the participant to think aloud without coaching them toward the intended workflow.
- Record task outcomes, navigation behavior, hesitations, workarounds, and comments.
- Use the same follow-up questions across participants.
- Avoid collecting unnecessary personal or clinical information.

### Phase 6 Synthesis

- Separate observed behavior from participant opinion.
- Tag findings by prototype, workflow stage, severity, and frequency.
- Compare requester and consultant perspectives where both are represented.
- Identify findings that recur across all three prototypes, especially ownership, urgency, uncertainty, and continuity.
- Turn findings into design implications and open questions, not claims of clinical benefit.

## Shared evaluation principles

- **One primary question per prototype.** Additional features should not compete with the interaction being tested.
- **Behavior before preference.** What participants do and miss is as important as what they say they like.
- **Realistic incompleteness.** Scenarios should include pending and unavailable information because real consultation work evolves over time.
- **Visible ownership.** Every active request should make the responsible person or team and next action understandable.
- **Explicit uncertainty.** The interface must allow provisional reasoning, unknown information, and contingencies.
- **Human review.** AI-generated text remains editable and requires clinician approval.
- **No clinical claims.** Usability results do not establish safety, diagnostic performance, or improved patient outcomes.

## Proposed repository structure

```text
CS247s-DraftPrototype/
├── README.md
├── research/
│   ├── synthesis/
│   ├── journey-maps/
│   └── study-plan/
├── scenarios/
│   ├── shared/
│   ├── board/
│   ├── note-entry/
│   └── request-template/
├── prototype-1-consult-board/
│   ├── README.md
│   ├── designs/
│   └── tests/
├── prototype-2-note-entry/
│   ├── README.md
│   ├── designs/
│   └── tests/
├── prototype-3-request-template/
│   ├── README.md
│   ├── designs/
│   └── tests/
└── findings/
    ├── raw-notes/
    ├── synthesis/
    └── decisions/
```

The repository structure is a plan only at this stage. Prototype folders and implementation files should be created after the team agrees on the scope and naming.

## Definition of ready for implementation

We should not begin coding a prototype until it has:

- one approved primary research question;
- a defined participant role;
- a task flow with a clear start and end state;
- at least one reviewed synthetic scenario;
- a list of required screens and interactions;
- observable success criteria;
- a facilitation and reset plan;
- an agreed data-handling approach;
- explicit out-of-scope features.

## Current status

- [x] Establish the shared research framing.
- [x] Define the purpose and initial process for all three prototypes.
- [x] Draft a privacy-safe synthetic scenario strategy.
- [ ] Review terminology and clinical realism with the project team.
- [ ] Choose primary participant groups and session format.
- [ ] Finalize the first scenario packet.
- [ ] Produce low-fidelity flows for each prototype.
- [ ] Pilot the study scripts.
- [ ] Begin implementation only after the readiness criteria are met.

## Research materials in the working repository

The current workspace includes interview synthesis, grounded theories, consultant and hospitalist journey maps, and a consultant persona. These materials should remain research inputs rather than prototype data. Any public version of this repository should include only materials the team has permission to publish.

