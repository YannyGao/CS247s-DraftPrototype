# Synthetic ED patient scenarios

This folder contains fictional patient records for testing the physician consultation prototypes. Every name, identifier, timestamp, result, clinician, and clinical event was created for this project.

**Synthetic test data — not for clinical use**

The cases reflect workflow themes from the project interviews: the consultant needs a focused question, reliable contact information, relevant preliminary workup, visible urgency, pending results, and an explicit owner. They do not reproduce any real patient story.

## Files

- `patient-001-infectious-disease.json` — an ED patient with suspected septic arthritis and bacteremia who needs Infectious Diseases input.
- `patient-002-oncology.json` — an ED patient with severe hypercalcemia and imaging concerning for recurrent metastatic malignancy who needs Oncology input.

## Intended uses

- Populate cards in the consultant work board.
- Supply matched clinical context for note-entry testing.
- Test whether the structured consultation request captures enough information.

## Handling rules

- Keep the synthetic-data banner visible in participant-facing screens.
- Do not replace any field with real patient information.
- Do not use these scenarios to make clinical decisions.
- Have a clinically qualified reviewer check the scenarios before participant testing.

