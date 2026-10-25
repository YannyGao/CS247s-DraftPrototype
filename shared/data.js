export const consultations = [
  { id: "C-1842", patient: "Taylor Morgan", age: 67, service: "Cardiology", question: "New atrial fibrillation with difficult rate control", urgency: "Urgent", status: "In Progress", owner: "Dr. N. Shah", received: "07:18", location: "D2-214", detail: "HR 132 after initial metoprolol; hemodynamically stable." },
  { id: "C-1838", patient: "Rowan Lee", age: 54, service: "Nephrology", question: "AKI with persistent hyperkalemia", urgency: "Urgent", status: "In Progress", owner: "Dr. E. Chen", received: "06:52", location: "E3-308", detail: "Creatinine 3.4 from 1.1; K 5.9 after temporizing therapy." },
  { id: "C-1851", patient: "Alexis Wright", age: 72, service: "Pulmonology", question: "New oxygen requirement after aspiration event", urgency: "Routine", status: "New", owner: "Unassigned", received: "08:04", location: "C1-120", detail: "Now on 3 L nasal cannula; chest radiograph pending." },
  { id: "C-1844", patient: "Casey Patel", age: 39, service: "Gastroenterology", question: "Acute liver injury; medication versus viral cause", urgency: "Routine", status: "New", owner: "Unassigned", received: "07:31", location: "F2-226", detail: "AST 682, ALT 744, INR 1.4; mental status intact." },
  { id: "C-1829", patient: "Riley Brooks", age: 81, service: "Palliative Care", question: "Symptom support and goals discussion", urgency: "Routine", status: "In Progress", owner: "Dr. M. Young", received: "05:46", location: "B5-518", detail: "Family meeting requested after 14:00 today." },
  { id: "C-1822", patient: "Jamie Flores", age: 28, service: "Endocrinology", question: "Recurrent hypoglycemia without insulin use", urgency: "Routine", status: "In Progress", owner: "Dr. A. Singh", received: "05:12", location: "E1-106", detail: "Critical sample obtained during glucose 42 mg/dL." },
  { id: "C-1817", patient: "Quinn Nelson", age: 64, service: "Hematology", question: "Thrombocytopenia after heparin exposure", urgency: "Urgent", status: "In Progress", owner: "Dr. J. Cole", received: "04:48", location: "D4-410", detail: "Platelets 51 from 178; PF4 assay pending." },
  { id: "C-1813", patient: "Emerson Diaz", age: 46, service: "Rheumatology", question: "Multisystem inflammatory syndrome", urgency: "Routine", status: "New", owner: "Unassigned", received: "04:35", location: "F1-118", detail: "Fever, rash, arthralgia; infectious workup unrevealing." },
  { id: "C-1809", patient: "Jordan Kim", age: 59, service: "Neurology", question: "Transient aphasia with negative CT", urgency: "Urgent", status: "Completed", owner: "Dr. K. Reed", received: "03:58", location: "C3-322", detail: "MRI recommended; antiplatelet plan communicated." },
  { id: "C-1806", patient: "Cameron Davis", age: 75, service: "Geriatrics", question: "Delirium and medication review", urgency: "Routine", status: "Completed", owner: "Dr. L. Hart", received: "03:41", location: "B2-207", detail: "Recommendations acknowledged by primary team." },
  { id: "C-1798", patient: "Avery Johnson", age: 33, service: "Dermatology", question: "Rapidly progressive bullous eruption", urgency: "Urgent", status: "Completed", owner: "Dr. S. Wu", received: "02:54", location: "D1-112", detail: "Biopsy obtained; wound care plan documented." },
  { id: "C-1791", patient: "Parker Allen", age: 61, service: "Urology", question: "Obstructing stone with persistent pain", urgency: "Routine", status: "Completed", owner: "Dr. T. Grant", received: "02:20", location: "E4-432", detail: "Procedure scheduled; case closed to consult list." },
  { id: "C-1784", patient: "Skyler Rivera", age: 52, service: "Psychiatry", question: "Capacity assessment before procedure", urgency: "Routine", status: "Completed", owner: "Dr. R. Bell", received: "01:44", location: "F4-407", detail: "Assessment documented and discussed with team." },
  { id: "C-1776", patient: "Reese Martin", age: 44, service: "Allergy", question: "Antibiotic allergy clarification", urgency: "Routine", status: "Completed", owner: "Dr. C. Lim", received: "00:58", location: "C2-232", detail: "Graded challenge pathway recommended." }
];

export const incomingIdConsult = {
  id: "C-1856",
  patient: "Morgan Testpatient",
  age: 43,
  service: "Infectious Diseases",
  question: "Empiric therapy and diagnostic plan for suspected native-knee septic arthritis with bacteremia",
  urgency: "Urgent",
  status: "New",
  owner: "Unassigned",
  received: "18:05",
  location: "ED-18",
  detail: "Purulent aspirate, synovial WBC 82,400 with 94% PMNs, gram-positive cocci in clusters; operative washout planned tonight."
};

export async function loadPatient(file) {
  const response = await fetch(`/scenarios/patient-info/${file}`);
  if (!response.ok) throw new Error("Unable to load synthetic patient record.");
  return response.json();
}

