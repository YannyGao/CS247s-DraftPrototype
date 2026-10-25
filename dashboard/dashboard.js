const consults = [
  { id: "morgan", patient: "Morgan Testpatient", age: 43, pronouns: "they/them", mrn: "SYN-MRN-100001", specialty: "Infectious Diseases", status: "Pending review", statusClass: "pending", currentStatus: "Pending review from consultant", stage: 0, submitted: "Today, 14:50", requester: "Dr. Elena Park", question: "Antimicrobial plan for suspected septic arthritis", context: "Fever and acute left-knee pain with purulent aspirate. Orthopedic washout is planned for tonight." },
  { id: "daniel", patient: "Daniel Example", age: 58, pronouns: "he/him", mrn: "SYN-MRN-100002", specialty: "Medical Oncology", status: "Accepted", statusClass: "accepted", currentStatus: "Accepted by consultant", stage: 1, submitted: "Today, 13:18", requester: "Dr. Priya Nair", question: "Evaluation of suspected recurrent malignancy", context: "Severe hypercalcemia with new pulmonary, adrenal, and osseous lesions. Admission is pending." },
  { id: "taylor", patient: "Taylor Morgan", age: 67, pronouns: "she/her", mrn: "SYN-MRN-100003", specialty: "Cardiology", status: "Paged back", statusClass: "paged", currentStatus: "Consultant paged back", stage: 2, submitted: "Today, 10:42", requester: "Dr. Noah Shah", question: "Rate-control guidance for new atrial fibrillation", context: "Persistent rapid ventricular response after initial metoprolol; patient remains hemodynamically stable." },
  { id: "rowan", patient: "Rowan Lee", age: 54, pronouns: "he/him", mrn: "SYN-MRN-100004", specialty: "Nephrology", status: "Completed", statusClass: "complete", currentStatus: "Consult completed", stage: 3, submitted: "Today, 08:36", requester: "Dr. Evelyn Chen", question: "Management of AKI with persistent hyperkalemia", context: "Creatinine rose from 1.1 to 3.4 mg/dL. Potassium remained elevated after temporizing therapy." },
  { id: "alexis", patient: "Alexis Wright", age: 72, pronouns: "she/her", mrn: "SYN-MRN-100005", specialty: "Pulmonology", status: "Pending review", statusClass: "pending", currentStatus: "Pending review from consultant", stage: 0, submitted: "Yesterday, 16:05", requester: "Dr. Lena Ortiz", question: "New oxygen requirement after aspiration event", context: "Now requiring 3 L nasal cannula. Chest radiograph and repeat blood gas are pending." },
  { id: "casey", patient: "Casey Patel", age: 39, pronouns: "they/them", mrn: "SYN-MRN-100006", specialty: "Gastroenterology", status: "Accepted", statusClass: "accepted", currentStatus: "Accepted by consultant", stage: 1, submitted: "Yesterday, 14:22", requester: "Dr. Martin Gray", question: "Evaluation of acute liver injury", context: "Marked aminotransferase elevation with intact mental status; medication and viral causes are under review." },
  { id: "riley", patient: "Riley Brooks", age: 81, pronouns: "she/her", mrn: "SYN-MRN-100007", specialty: "Palliative Care", status: "Paged back", statusClass: "paged", currentStatus: "Consultant paged back", stage: 2, submitted: "Yesterday, 11:40", requester: "Dr. Maya Young", question: "Symptom support and goals discussion", context: "Family meeting requested following recurrent admission and progressive functional decline." },
  { id: "sam", patient: "Sam Demo", age: 70, pronouns: "he/him", mrn: "SYN-MRN-100008", specialty: "Cardiology", status: "Completed", statusClass: "complete", currentStatus: "Consult completed", stage: 3, submitted: "Oct 23, 09:15", requester: "Dr. Jordan Ross", question: "Diuresis plan for acute decompensated heart failure", context: "Volume overload improved after IV diuresis. Final recommendations have been documented." }
];

const rows = document.querySelector("#consult-rows");
const dialog = document.querySelector("#consult-dialog");
const timeline = document.querySelector("#consult-timeline");

function rowMarkup(consult) {
  return `<tr tabindex="0" data-consult-id="${consult.id}" aria-label="Open ${consult.patient} consult details">
    <td><div class="patient-cell"><span class="record-icon" aria-hidden="true">▤</span><strong>${consult.patient}</strong></div></td>
    <td class="mrn">${consult.mrn}</td>
    <td>${consult.specialty}</td>
    <td><span class="status ${consult.statusClass}">${consult.status}</span></td>
    <td class="submitted">${consult.submitted}</td>
    <td class="question-cell" title="${consult.question}">${consult.question}</td>
  </tr>`;
}

function updateTimeline(stage) {
  const widths = [0, 25, 50, 75];
  timeline.style.setProperty("--progress", `${widths[stage]}%`);
  timeline.querySelectorAll("li").forEach((item, index) => {
    item.classList.toggle("done", index < stage);
    item.classList.toggle("current", index === stage);
  });
}

function openConsult(consult) {
  document.querySelector("#detail-title").textContent = `${consult.patient} consult`;
  document.querySelector("#current-status").textContent = consult.currentStatus;
  document.querySelector("#detail-patient").textContent = consult.patient;
  document.querySelector("#detail-identity").textContent = `${consult.age} years · ${consult.pronouns} · ${consult.mrn}`;
  const badge = document.querySelector("#detail-status-badge");
  badge.textContent = consult.status;
  badge.className = `status ${consult.statusClass}`;
  document.querySelector("#detail-specialty").textContent = consult.specialty;
  document.querySelector("#detail-submitted").textContent = consult.submitted;
  document.querySelector("#detail-requester").textContent = consult.requester;
  document.querySelector("#detail-question").textContent = consult.question;
  document.querySelector("#detail-context").textContent = consult.context;
  updateTimeline(consult.stage);
  dialog.showModal();
}

function findConsult(row) {
  return consults.find((consult) => consult.id === row.dataset.consultId);
}

rows.addEventListener("click", (event) => {
  const row = event.target.closest("[data-consult-id]");
  if (row) openConsult(findConsult(row));
});

rows.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  const row = event.target.closest("[data-consult-id]");
  if (!row) return;
  event.preventDefault();
  openConsult(findConsult(row));
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

rows.innerHTML = consults.map(rowMarkup).join("");

const previewId = new URLSearchParams(window.location.search).get("consult");
const previewConsult = consults.find((consult) => consult.id === previewId);
if (previewConsult) openConsult(previewConsult);
