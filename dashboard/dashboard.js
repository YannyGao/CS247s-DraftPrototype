const consults = [
  { id: "morgan", patient: "Morgan Testpatient", age: 43, pronouns: "they/them", mrn: "SYN-MRN-100001", specialty: "Infectious Diseases", status: "Pending review", statusClass: "pending", currentStatus: "Pending review from consultant", stage: 0, order: 8, label: "High priority", submitted: "Today, 14:50", requester: "Dr. Elena Park", question: "Antimicrobial plan for suspected septic arthritis", context: "Fever and acute left-knee pain with purulent aspirate. Orthopedic washout is planned for tonight." },
  { id: "daniel", patient: "Daniel Example", age: 58, pronouns: "he/him", mrn: "SYN-MRN-100002", specialty: "Medical Oncology", status: "Accepted", statusClass: "accepted", currentStatus: "Accepted by consultant", stage: 1, order: 7, label: "Follow up", submitted: "Today, 13:18", requester: "Dr. Priya Nair", question: "Evaluation of suspected recurrent malignancy", context: "Severe hypercalcemia with new pulmonary, adrenal, and osseous lesions. Admission is pending." },
  { id: "taylor", patient: "Taylor Morgan", age: 67, pronouns: "she/her", mrn: "SYN-MRN-100003", specialty: "Cardiology", status: "Paged back", statusClass: "paged", currentStatus: "Consultant paged back", stage: 2, order: 6, label: "", submitted: "Today, 10:42", requester: "Dr. Noah Shah", question: "Rate-control guidance for new atrial fibrillation", context: "Persistent rapid ventricular response after initial metoprolol; patient remains hemodynamically stable." },
  { id: "rowan", patient: "Rowan Lee", age: 54, pronouns: "he/him", mrn: "SYN-MRN-100004", specialty: "Nephrology", status: "Completed", statusClass: "complete", currentStatus: "Consult completed", stage: 3, order: 5, label: "Discharge planning", submitted: "Today, 08:36", requester: "Dr. Evelyn Chen", question: "Management of AKI with persistent hyperkalemia", context: "Creatinine rose from 1.1 to 3.4 mg/dL. Potassium remained elevated after temporizing therapy." },
  { id: "alexis", patient: "Alexis Wright", age: 72, pronouns: "she/her", mrn: "SYN-MRN-100005", specialty: "Pulmonology", status: "Pending review", statusClass: "pending", currentStatus: "Pending review from consultant", stage: 0, order: 4, label: "Routine", submitted: "Yesterday, 16:05", requester: "Dr. Lena Ortiz", question: "New oxygen requirement after aspiration event", context: "Now requiring 3 L nasal cannula. Chest radiograph and repeat blood gas are pending." },
  { id: "casey", patient: "Casey Patel", age: 39, pronouns: "they/them", mrn: "SYN-MRN-100006", specialty: "Gastroenterology", status: "Accepted", statusClass: "accepted", currentStatus: "Accepted by consultant", stage: 1, order: 3, label: "", submitted: "Yesterday, 14:22", requester: "Dr. Martin Gray", question: "Evaluation of acute liver injury", context: "Marked aminotransferase elevation with intact mental status; medication and viral causes are under review." },
  { id: "riley", patient: "Riley Brooks", age: 81, pronouns: "she/her", mrn: "SYN-MRN-100007", specialty: "Palliative Care", status: "Paged back", statusClass: "paged", currentStatus: "Consultant paged back", stage: 2, order: 2, label: "Family update", submitted: "Yesterday, 11:40", requester: "Dr. Maya Young", question: "Symptom support and goals discussion", context: "Family meeting requested following recurrent admission and progressive functional decline." },
  { id: "sam", patient: "Sam Demo", age: 70, pronouns: "he/him", mrn: "SYN-MRN-100008", specialty: "Cardiology", status: "Rejected", statusClass: "rejected", currentStatus: "Rejected by consultant", stage: -1, order: 1, label: "Reroute", submitted: "Oct 23, 09:15", requester: "Dr. Jordan Ross", question: "Diuresis plan for acute decompensated heart failure", context: "Consultant indicated that this request should be routed to a different service." }
];

const rows = document.querySelector("#consult-rows");
const dialog = document.querySelector("#consult-dialog");
const timeline = document.querySelector("#consult-timeline");
const statusFilter = document.querySelector("#status-filter");
const sortOrder = document.querySelector("#sort-order");
const groupBy = document.querySelector("#group-by");
const clearControls = document.querySelector("#clear-controls");
const visibleCount = document.querySelector("#visible-count");
const expandDialogButton = document.querySelector("#expand-dialog");
const labelChoices = ["", "High priority", "Follow up", "Routine", "Family update", "Discharge planning", "Reroute"];
let activeConsultIndex = 0;

function labelOptions(selectedLabel) {
  return labelChoices.map((label) => `<option value="${label}"${label === selectedLabel ? " selected" : ""}>${label || "No label"}</option>`).join("");
}

function rowMarkup(consult) {
  return `<tr tabindex="0" data-consult-id="${consult.id}" aria-label="Open ${consult.patient} consult details">
    <td><div class="patient-cell"><span class="record-icon" aria-hidden="true">▤</span><strong>${consult.patient}</strong></div></td>
    <td class="mrn">${consult.mrn}</td>
    <td>${consult.specialty}</td>
    <td><span class="status ${consult.statusClass}">${consult.status}</span></td>
    <td class="label-cell"><select class="label-select" data-label-id="${consult.id}" aria-label="Label for ${consult.patient}">${labelOptions(consult.label)}</select></td>
    <td class="submitted">${consult.submitted}</td>
    <td class="question-cell" title="${consult.question}">${consult.question}</td>
  </tr>`;
}

function updateTimeline(stage) {
  const widths = [0, 25, 50, 75];
  timeline.style.setProperty("--progress", `${stage < 0 ? 0 : widths[stage]}%`);
  timeline.classList.toggle("is-rejected", stage < 0);
  timeline.querySelector('[data-step="1"] strong').textContent = stage < 0 ? "Rejected" : "Accepted";
  timeline.setAttribute("aria-label", stage < 0 ? "Consult rejected" : "Consult progress");
  timeline.querySelectorAll("li").forEach((item, index) => {
    item.classList.toggle("done", stage >= 0 && index < stage);
    item.classList.toggle("current", stage >= 0 && index === stage);
  });
}

function groupLabel(consult, key) {
  if (key === "label") return consult.label || "No label";
  return consult[key];
}

function renderRows() {
  const filtered = consults
    .filter((consult) => statusFilter.value === "all" || consult.status === statusFilter.value)
    .sort((a, b) => sortOrder.value === "newest" ? b.order - a.order : a.order - b.order);

  if (!filtered.length) {
    rows.innerHTML = '<tr class="empty-row"><td colspan="7">No consults match this status.</td></tr>';
  } else if (groupBy.value === "none") {
    rows.innerHTML = filtered.map(rowMarkup).join("");
  } else {
    const groups = filtered.reduce((result, consult) => {
      const key = groupLabel(consult, groupBy.value);
      if (!result.has(key)) result.set(key, []);
      result.get(key).push(consult);
      return result;
    }, new Map());
    rows.innerHTML = [...groups.entries()].map(([label, items]) =>
      `<tr class="group-row"><th colspan="7" scope="rowgroup">${label}<span class="group-count">${items.length}</span></th></tr>${items.map(rowMarkup).join("")}`
    ).join("");
  }

  visibleCount.textContent = `${filtered.length} ${filtered.length === 1 ? "consult" : "consults"}`;
  clearControls.hidden = statusFilter.value === "all" && sortOrder.value === "newest" && groupBy.value === "none";
}

function openConsult(consult) {
  activeConsultIndex = consults.findIndex((item) => item.id === consult.id);
  rows.querySelectorAll("[data-consult-id]").forEach((row) => row.classList.toggle("is-open", row.dataset.consultId === consult.id));
  document.querySelector("#detail-title").textContent = `${consult.patient} consult`;
  document.querySelector("#current-status").textContent = consult.currentStatus;
  document.querySelector("#detail-patient").textContent = consult.patient;
  document.querySelector("#detail-identity").textContent = `${consult.age} years · ${consult.pronouns} · ${consult.mrn}`;
  const badge = document.querySelector("#detail-status-badge");
  badge.textContent = consult.status;
  badge.className = `status ${consult.statusClass}`;
  document.querySelector(".status-summary").className = `status-summary summary-${consult.statusClass}`;
  document.querySelector("#detail-specialty").textContent = consult.specialty;
  document.querySelector("#detail-submitted").textContent = consult.submitted;
  document.querySelector("#detail-requester").textContent = consult.requester;
  document.querySelector("#detail-question").textContent = consult.question;
  document.querySelector("#detail-context").textContent = consult.context;
  updateTimeline(consult.stage);
  if (!dialog.open) dialog.showModal();
}

function moveConsult(direction) {
  activeConsultIndex = (activeConsultIndex + direction + consults.length) % consults.length;
  openConsult(consults[activeConsultIndex]);
}

function findConsult(row) {
  return consults.find((consult) => consult.id === row.dataset.consultId);
}

rows.addEventListener("click", (event) => {
  if (event.target.matches(".label-select")) return;
  const row = event.target.closest("[data-consult-id]");
  if (row) openConsult(findConsult(row));
});

rows.addEventListener("keydown", (event) => {
  if (event.target.matches(".label-select")) return;
  if (!["Enter", " "].includes(event.key)) return;
  const row = event.target.closest("[data-consult-id]");
  if (!row) return;
  event.preventDefault();
  openConsult(findConsult(row));
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("#previous-consult").addEventListener("click", () => moveConsult(-1));
document.querySelector("#next-consult").addEventListener("click", () => moveConsult(1));
expandDialogButton.addEventListener("click", () => {
  const expanded = dialog.classList.toggle("is-expanded");
  expandDialogButton.setAttribute("aria-pressed", String(expanded));
  expandDialogButton.setAttribute("aria-label", expanded ? "Restore consult details" : "Expand consult details");
});
dialog.addEventListener("close", () => {
  rows.querySelectorAll(".is-open").forEach((row) => row.classList.remove("is-open"));
  dialog.classList.remove("is-expanded");
  expandDialogButton.setAttribute("aria-pressed", "false");
  expandDialogButton.setAttribute("aria-label", "Expand consult details");
});

dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveConsult(-1);
  if (event.key === "ArrowRight") moveConsult(1);
});

rows.addEventListener("change", (event) => {
  const input = event.target.closest("[data-label-id]");
  if (!input) return;
  const consult = consults.find((item) => item.id === input.dataset.labelId);
  consult.label = input.value.trim();
  if (groupBy.value === "label") renderRows();
});

[statusFilter, sortOrder, groupBy].forEach((control) => control.addEventListener("change", renderRows));
clearControls.addEventListener("click", () => {
  statusFilter.value = "all";
  sortOrder.value = "newest";
  groupBy.value = "none";
  renderRows();
});

renderRows();

const previewId = new URLSearchParams(window.location.search).get("consult");
const previewConsult = consults.find((consult) => consult.id === previewId);
if (previewConsult) openConsult(previewConsult);
