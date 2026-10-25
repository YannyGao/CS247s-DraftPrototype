---
name: Stanford Health Care Consultation Prototypes
description: A restrained, code-led clinical workspace for testing physician consultation workflows on Windows.
colors:
  ink: "#18212b"
  muted: "#5c6876"
  faint: "#7b8794"
  line: "#cbd4dd"
  line-strong: "#9eabb8"
  surface: "#ffffff"
  surface-subtle: "#f4f7f9"
  surface-blue: "#fbf7f5"
  navy: "#8c1515"
  blue: "#8c1515"
  blue-hover: "#6f0f0f"
  teal: "#17766d"
  amber: "#9a6100"
  amber-soft: "#fff4d6"
  red: "#a43737"
  red-soft: "#fff0f0"
  green: "#2f6f50"
typography:
  display:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.35
rounded:
  compact: "3px"
  control: "4px"
  panel: "6px"
  floating: "7px"
  route-card: "8px"
spacing:
  xxs: "4px"
  xs: "7px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  xxl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
    height: "34px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
    height: "34px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
    height: "34px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "7px 9px"
    height: "36px"
  status-new:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    rounded: "{rounded.compact}"
    padding: "2px 7px"
    height: "22px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: Stanford Health Care Consultation Prototypes

## Overview

**Creative North Star: "The Clinical Workbench"**

This system should feel like a focused Windows workstation used during real inpatient coordination: compact, explicit, and built to keep patient context and pending work visible. Its visual language is code-led rather than decorative. Cool neutral surfaces, thin structural borders, compact controls, and a single blue action color create familiarity without reproducing any proprietary EHR screen or asset.

The interface is dense but not cramped. Hierarchy comes from persistent context bands, sectional headers, tabular alignment, and restrained semantic color. Clinical decisions remain visible and reviewable: urgency, ownership, uncertainty, pending information, generated content, and final clinician action are presented as text as well as color. Every scenario is synthetic and the persistent synthetic-data label is part of the interface contract.

**Key Characteristics:**

- Windows-native Segoe UI typography with compact, predictable control sizing.
- Cool neutral structure, white work surfaces, and Stanford Cardinal emphasis.
- Border-led hierarchy with shadows reserved for floating or modal layers.
- Persistent patient context and plain-language status at decision points.
- Original components informed by familiar inpatient workflow conventions, never proprietary imitation.

## Colors

The palette is a quiet clinical blue-and-neutral system in which semantic colors signal state, not decoration.

### Primary

- **Stanford Cardinal Action** (`blue`): Primary actions, active tabs, time emphasis, removable-item actions, and visible keyboard-adjacent affordances.
- **Stanford Cardinal Chrome** (`navy`): Persistent application chrome and the strongest product-level orientation cue.

### Secondary

- **Coordination Teal** (`teal`): Reserved secondary semantic accent when a coordinated or in-progress state needs distinction.

### Tertiary

- **Urgency Amber** (`amber`, `amber-soft`): New work, timing-sensitive notices, and warning surfaces that do not indicate failure.
- **Clinical Red** (`red`, `red-soft`): Urgent markers, destructive or redirect actions, recording state, validation, and browser-support errors.
- **Completion Green** (`green`): Successful send, acceptance, and completion confirmation.

### Neutral

- **Clinical Ink** (`ink`): Default text and high-priority values.
- **Slate Muted** (`muted`): Supporting labels, metadata, and explanatory text.
- **Faint Slate** (`faint`): Low-priority counts and tertiary information.
- **Structural Lines** (`line`, `line-strong`): Section boundaries, field outlines, panel edges, and table rules.
- **Paper Surface** (`surface`): Primary work areas, cards, controls, and dialog content.
- **Cool Work Surface** (`surface-subtle`): Section headers, toolbars, footers, and low-emphasis containers.
- **Patient Context Warm Tint** (`surface-blue`): Patient identity and contextual strips that must remain distinct from editable work.

**The Semantic Rarity Rule.** Use amber, red, teal, and green only to encode a named state or consequential action; never distribute them as decoration.

**The Text Plus Color Rule.** Every state must remain understandable from its label, iconography, or surrounding copy when color is unavailable.

## Typography

**Display Font:** Segoe UI (with Arial and sans-serif fallbacks)  
**Body Font:** Segoe UI (with Arial and sans-serif fallbacks)  
**Label Font:** Segoe UI (with Arial and sans-serif fallbacks)

**Character:** The single Windows-native family keeps the prototypes familiar, crisp, and fast to scan in Edge. Size, weight, spacing, and alignment—not multiple typefaces—establish hierarchy.

### Hierarchy

- **Display** (700, 22px, 1.2): Major decision-stage headings; use sparingly within a route.
- **Headline** (700, 19px, 1.25): Workspace and form titles.
- **Title** (700, 15px, 1.35): Panel headings, card headings, and patient identity.
- **Body** (400, 14px, 1.5): Clinical narrative and form content; focused clinical questions may rise to 16px and should stay near 72 characters per line.
- **Label** (700, 12px, 1.35): Field labels and section labels; supporting metadata may use 11px. Uppercase is reserved for the persistent synthetic-data banner.

Use tabular numerals for timestamps, counts, identifiers, laboratory values, and other vertically compared data.

**The Native Clarity Rule.** Keep Segoe UI as the first font on Windows and do not introduce display faces, decorative italics, or oversized marketing typography into clinical routes.

## Layout

The global frame stacks a 52px Stanford Cardinal top bar, a white patient-context strip, and a route-specific work area. Workspaces use compact 14–18px outer padding and 14–16px gaps. Panels use white surfaces, strong outer borders, and internally divided sections; information is aligned in grids so values can be compared quickly.

The dashboard reserves space for a movable, resizable consult board while keeping the incoming decision visible beneath it. The note route uses a 330px reference column beside the editable note. The request route uses a near-even split between selectable chart evidence and the adaptive request form. Sticky headers or action rows preserve orientation and the next action in long panes.

These prototypes are desktop research instruments, not mobile layouts. The shared minimum width is 1024px, relaxing to 900px below 1100px. At narrower desktop widths, columns compress deliberately: the note reference becomes 285px, the request evidence column becomes 420px, three-column forms become two columns, and the dashboard hides its secondary timeline before sacrificing the primary decision. Do not collapse patient identity or primary actions merely to simulate a phone layout.

**The Context Before Task Rule.** Patient identity and encounter context must appear above the editable or actionable workspace and remain visually distinct from it.

**The Dense, Not Crowded Rule.** Prefer sectional borders, 8–18px spacing, and aligned columns over oversized whitespace or card grids.

## Elevation & Depth

The system is flat by default. Borders, subtle background shifts, and sticky regions provide most depth. The strong ambient shadow is reserved for genuinely floating layers: the resizable consult board and modal preview. Patient strips and sticky action rows use very light directional shadows only to clarify overlap.

### Shadow Vocabulary

- **Floating workspace** (`0 18px 42px rgba(25, 54, 78, 0.2), 0 3px 10px rgba(25, 54, 78, 0.12)`): Resizable work board and modal dialog only.
- **Context separation** (`0 2px 6px rgba(29, 51, 69, .08)`): Patient context above a scrolling workspace.
- **Sticky action separation** (`0 -4px 12px rgba(25,49,68,.07)`): Bottom action rows above scrolling form content.
- **List card lift** (`0 1px 2px rgba(25, 51, 70, .08)`): Minimal separation for draggable worklist items.

**The Flat-by-Default Rule.** If a surface is not floating, sticky, modal, or draggable, separate it with tone and border rather than shadow.

## Shapes

Corners are compact and functional. Status labels and navigation items use tight 3px corners; inputs, buttons, notices, and selected evidence use 4px; structural panels use 6px; floating boards and dialogs use 7px. The route chooser may use 8px because it is outside the clinical work context. Borders are one pixel and cool gray, strengthening only at container edges or important dividers.

Circular geometry is reserved for state indicators such as the microphone dot. Avoid pill-shaped controls, oversized rounding, glass effects, gradients, and decorative clipping.

## Components

### Buttons

Buttons are compact, text-led, and visibly actionable.

- **Shape:** Gently squared controls (`control` radius) with a 34px minimum height and 7px by 14px padding.
- **Primary:** Stanford Cardinal background with white, semibold text; use for the single forward action in a local decision group.
- **Secondary:** White surface, Clinical Ink text, and a strong structural border.
- **Danger:** White surface with red border and text; hover fills with the pale red semantic surface.
- **Quiet:** Transparent border and background with blue text; use for reversible utilities such as clear, cancel, close, remove, or reset.
- **Hover / Focus / Active:** Hover changes tone, keyboard focus uses a 3px translucent blue outline with 2px offset, and active presses translate downward by 1px. Disabled controls retain their label, use 50% opacity, and suppress the press motion.

### Status Labels

Status labels pair compact bordered rectangles with explicit words such as New, In Progress, Completed, Urgent, Draft, or Sent. Background, border, and text color shift together. They are never color-only dots.

### Cards / Containers

Panels use the Paper Surface, a strong one-pixel border, and the panel radius. Their headings sit on a subtle cool surface with a bottom divider. Draggable consult cards use a narrow priority rail, compact metadata, a visible status label, and a text description; urgency may color the rail red, but the word “Urgent” remains in the card.

### Inputs / Fields

Inputs have a white background, strong gray border, 4px radius, and a minimum 36px height. Labels sit above controls and explanatory or validation copy sits below. Textareas resize vertically. Placeholder text is muted but readable. Native required-field validation and semantic `label` associations remain intact; focus uses the shared visible outline.

### Navigation

The Stanford Cardinal top bar establishes global workspace location. Navigation items fill the bar height, use pale text at rest, and show the active area with white text, a slightly lighter Cardinal surface, and a sandstone bottom inset. Local tabs use the same bottom-border model on a pale gray rail. Tab controls expose `role="tab"` and `aria-selected`.

### Dialogs and Notices

Modal preview dialogs use a strong outline, the floating shadow, a dim neutral backdrop, and separate header, scrolling content, and action footer. Inline notices use semantic border, surface, and text colors. Error and browser-support notices use `role="alert"`; confirmations that update in place use a live status region.

### Consultation Work Board

The dashboard’s signature component is a persistent, movable, resizable floating worklist. Its title bar is a pointer drag handle and supports arrow-key movement, while the lower corner retains native resizing. It shows ranked consults, filtering tabs with counts, ownership and urgency, drag affordances, drop-target feedback, a reset action, and a visible list count. Accepting an incoming consult inserts it at the top and confirms the resulting state; rejecting or redirecting progressively reveals optional routing details without hiding the original request.

### Reviewable Note Generation

The note-entry signature pattern compares direct typing with speech-assisted drafting inside the same patient context. Method tabs keep modes mutually exclusive. Speech state is explicit: ready, listening, unavailable, blocked, generating, or ready for review. A transcript stays editable, draft generation remains disabled until meaningful input exists, and generated sections appear as editable textareas under a prominent clinician-review warning. Save and review completion are separate actions.

### Evidence-to-Request Builder

The request-template signature pattern keeps source evidence beside the destination form. Each chart fact has a native checkbox, descriptive detail, and compact value; selection updates both a count and a removable evidence list. Specialty changes replace only the relevant contextual fields. Review opens a consultant-facing preview of exactly what will be sent, and sending changes the visible request status from Draft to Sent.

Motion is functional and restrained: native scrolling, a 1px button press, drag feedback, and a pulse only while recording. Respect `prefers-reduced-motion` by reducing animation and transition duration to near zero.

## Do's and Don'ts

### Do:

- **Do** keep patient identity, encounter context, synthetic-data labeling, ownership, urgency, pending information, and status visible at the point of action.
- **Do** use compact Segoe UI typography, tabular numerals, aligned grids, and one-pixel dividers to support rapid scanning on Windows and Edge.
- **Do** preserve explicit hover, focus-visible, selected, disabled, error, recording, generating, drag, drop-target, and confirmation states.
- **Do** keep generated content editable and pair it with an explicit clinician-review requirement.
- **Do** use semantic HTML controls, associated labels, keyboard-visible focus, live regions where state changes, and reduced-motion support.

### Don't:

- **Don't** imply that this original prototype is an official Epic product, integration, endorsement, or exact reproduction.
- **Don't** copy proprietary assets or screens, or trade durable clinical context for a consumer-app aesthetic.
- **Don't** use color alone for status, urgency, error, selection, ownership, or completion.
- **Don't** add decorative gradients, glass, large pill controls, oversized marketing type, or shadows to ordinary in-flow panels.
- **Don't** hide uncertainty, pending information, provenance, or the need for clinician review behind generated summaries or automated routing.
