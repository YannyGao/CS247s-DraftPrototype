# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: dependency-free HTML, CSS, and JavaScript with a small Node.js localhost server, chosen for simple Windows setup and local-only credential handling.

## Users

Physicians participating in a facilitated usability study of inpatient physician-to-physician consultation workflows. The primary roles are consultants triaging incoming requests and requesting clinicians preparing or documenting a consult.

## Product Purpose

Three separate research prototypes test consultation queue management, direct typing versus speech-assisted note entry, and structured consultation intake. Success means the experiences are realistic enough to elicit useful behavior and post-task discussion; they are not production clinical tools.

## Positioning

The prototypes preserve shared consultation state across request, triage, documentation, and follow-up while keeping clinician judgment visible.

## Operating Context

The work occurs in an Epic-familiar inpatient environment on Windows. Sessions are facilitator-led, with instructions spoken rather than displayed inside the prototypes. The prototypes use synthetic ED cases and may run only on localhost.

## Capabilities and Constraints

- Three completely separate prototype routes.
- Hospitalist consult tracker: one full-screen table of consults requested by the hospitalist's team. Selecting a row opens a focused detail overlay with the four-stage timeline Submitted, Accepted, Paged back, and Completed. This prototype does not test consultant triage, acceptance controls, rejection, ranking, or drag-and-drop.
- Rejection: optional reason of wrong specialty or service, optional destination team, and optional note.
- Note entry: a specialist completes a final consult note either in one direct-typing field or through live microphone transcription followed by an editable professional rewrite. The case reference omits the specialist's recommendations, and the rewrite must not add clinical content.
- Request template: synthetic chart context beside an adaptive form; participant chooses which evidence to include. Initial test configuration is Infectious Diseases.
- Real API keys remain local and Git-ignored. Browser code never receives a server-side key.
- Synthetic test data only. No clinical use, real patient data, or diagnostic claims.
- No remote push, pull request, or deployment without explicit user instruction.

## Brand Commitments

Original Stanford Health Care research prototype informed by familiar Epic inpatient workflow patterns: dense but legible worklists, visible patient context, durable status, restrained color, and clinical terminology. It must not imply official Stanford or Epic affiliation, integration, or endorsement and must not copy proprietary assets.

## Evidence on Hand

- `README.md`
- `interview_synthesis_jack_shivam.md`
- `D2D Grounded Theories Revised.docx`
- `Consultant Journey Map.docx`
- `Consultant Persona.docx`
- `scenarios/patient-info/patient-001-infectious-disease.json`
- `scenarios/patient-info/patient-002-oncology.json`

## Product Principles

- Show ownership, urgency, status, uncertainty, and next action.
- Let clinicians choose and prioritize rather than automating judgment away.
- Keep generated text reviewable and editable.
- Test one core interaction clearly in each prototype.
- Preserve realism without using real patient information.

## Accessibility & Inclusion

Keyboard-visible focus, semantic controls, readable contrast, Windows and Edge compatibility, reduced-motion support, and non-color status labels.

