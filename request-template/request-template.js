const evidenceGroups = [
  {
    name: "Current presentation",
    items: [
      { id: "symptoms", label: "Symptoms and timing", detail: "Left knee pain for 3 days; fever and chills for 24 hours; unable to bear weight", value: "3 days" },
      { id: "current-vitals", label: "Most recent vital signs", detail: "Temp 38.1 C, HR 102, BP 116/70, RR 18, SpO₂ 98% room air", value: "17:45" },
      { id: "exam", label: "Focused examination", detail: "Large warm effusion with severe pain on passive range of motion; no draining wound", value: "Left knee" },
      { id: "sepsis", label: "Sepsis assessment", detail: "Alert and hemodynamically stable after fluids; lactate decreased from 2.6 to 1.7", value: "Stable" }
    ]
  },
  {
    name: "Synovial fluid and microbiology",
    items: [
      { id: "synovial-count", label: "Synovial cell count", detail: "Cloudy yellow fluid; 82,400 nucleated cells/µL with 94% neutrophils", value: "82,400" },
      { id: "crystals", label: "Crystal analysis", detail: "No crystals seen", value: "None" },
      { id: "gram-stain", label: "Synovial Gram stain", detail: "Many polymorphonuclear cells; gram-positive cocci in clusters", value: "GPC" },
      { id: "synovial-culture", label: "Synovial culture", detail: "Culture pending after aspiration at 16:08", value: "Pending" },
      { id: "blood-cultures", label: "Blood cultures", detail: "Two sets collected before antibiotics; 1 of 4 bottles with gram-positive cocci in clusters", value: "1 of 4" }
    ]
  },
  {
    name: "Laboratory results",
    items: [
      { id: "cbc", label: "CBC", detail: "WBC 17.8 K/µL with 89% neutrophils; hemoglobin 12.1 g/dL; platelets 286 K/µL", value: "WBC 17.8" },
      { id: "crp", label: "Inflammatory markers", detail: "CRP 214 mg/L; ESR 76 mm/hr", value: "CRP 214" },
      { id: "renal", label: "Renal function", detail: "Creatinine 1.28 mg/dL from baseline 0.82; BUN 24 mg/dL", value: "Cr 1.28" },
      { id: "glucose", label: "Glucose", detail: "Serum glucose 246 mg/dL; most recent A1c 8.4%", value: "246" }
    ]
  },
  {
    name: "Treatment, imaging, and context",
    items: [
      { id: "antibiotics", label: "Antimicrobials given", detail: "Vancomycin 1750 mg IV and ceftriaxone 2 g IV after joint aspiration and blood cultures", value: "16:20" },
      { id: "imaging", label: "Left knee radiograph", detail: "Large joint effusion; no fracture or radiopaque foreign body", value: "Effusion" },
      { id: "source-control", label: "Source-control plan", detail: "Orthopedic Surgery plans operative washout at 21:00; patient is NPO", value: "21:00" },
      { id: "risk-factors", label: "Relevant risks and exposures", detail: "Diabetes; superficial shin abrasion after gardening; no prosthetic joint, recent antibiotics, or injection drug use", value: "Diabetes" },
      { id: "allergy", label: "Medication allergy", detail: "Trimethoprim-sulfamethoxazole caused a diffuse pruritic rash", value: "TMP-SMX" }
    ]
  }
];

const defaultSelected = new Set(["symptoms", "current-vitals", "exam", "sepsis", "synovial-count", "crystals", "gram-stain", "synovial-culture", "blood-cultures", "cbc", "crp", "renal", "antibiotics", "source-control", "risk-factors", "allergy"]);
const selected = new Set();
const chartEvidence = document.querySelector("#chart-evidence");
const selectedEvidence = document.querySelector("#selected-evidence");
const selectedCount = document.querySelector("#selected-evidence-count");
const form = document.querySelector("#consult-form");
const dialog = document.querySelector("#preview-dialog");

function allEvidence() { return evidenceGroups.flatMap((group) => group.items); }

function renderChart() {
  chartEvidence.innerHTML = evidenceGroups.map((group) => `
    <section class="evidence-group">
      <h2>${group.name}</h2>
      ${group.items.map((item) => `<label class="evidence-item"><input type="checkbox" value="${item.id}" ${selected.has(item.id) ? "checked" : ""}><span><strong>${item.label}</strong><span>${item.detail}</span></span><span class="evidence-value">${item.value}</span></label>`).join("")}
    </section>`).join("");
}

function renderSelected() {
  const items = allEvidence().filter((item) => selected.has(item.id));
  selectedCount.textContent = `${items.length} selected`;
  selectedEvidence.innerHTML = items.length ? items.map((item) => `<div class="selected-chip"><b>${item.label}</b><span>${item.detail}</span><button type="button" data-remove="${item.id}" aria-label="Remove ${item.label}">Remove</button></div>`).join("") : `<p class="empty-evidence">No chart evidence selected yet.</p>`;
}

chartEvidence.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[type='checkbox']");
  if (!checkbox) return;
  if (checkbox.checked) selected.add(checkbox.value); else selected.delete(checkbox.value);
  renderSelected();
});

selectedEvidence.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  selected.delete(button.dataset.remove);
  renderChart();
  renderSelected();
});

document.querySelector("#clear-evidence").addEventListener("click", () => {
  selected.clear();
  renderChart();
  renderSelected();
});

document.querySelector("#specialty").addEventListener("change", (event) => {
  const isId = event.target.value === "infectious-diseases";
  document.querySelector("#adaptive-section h2").textContent = isId ? "Infectious Diseases context" : "Medical Oncology context";
  document.querySelector("#adaptive-description").textContent = isId ? "Provide factors that affect diagnostic yield, organism risk, and empiric therapy." : "Provide prior cancer history, current disease evidence, tissue status, and staging needs.";
  document.querySelector("#adaptive-fields").innerHTML = isId ? `
    <div class="field"><label for="suspected-source">Suspected source *</label><select id="suspected-source" required><option>Bone or joint infection</option><option>Bloodstream infection</option><option>Skin or soft tissue</option><option>Other / uncertain</option></select></div>
    <div class="field"><label for="antibiotic-timing">Antibiotics relative to cultures *</label><select id="antibiotic-timing" required><option selected>Started after joint aspiration and blood cultures</option><option>Started before cultures</option><option>Not started</option><option>Timing unknown</option></select></div>
    <div class="field"><label for="resistance-risk">Resistance or exposure risks</label><input id="resistance-risk" type="text" value="No known MRSA history, injection drug use, recent antibiotics, or implanted joint hardware."></div>
    <div class="field"><label for="source-control">Source-control plan *</label><input id="source-control" type="text" required value="Orthopedic washout planned for 21:00; operative tissue cultures requested."></div>` : `
    <div class="field"><label for="cancer-history">Known cancer history *</label><input id="cancer-history" type="text" required placeholder="Diagnosis, stage, and prior treatment"></div>
    <div class="field"><label for="tissue-status">Tissue confirmation *</label><select id="tissue-status" required><option>Not yet confirmed</option><option>Biopsy pending</option><option>Confirmed pathology available</option></select></div>
    <div class="field"><label for="staging-status">Current staging completed</label><input id="staging-status" type="text" placeholder="Imaging and known sites of disease"></div>
    <div class="field"><label for="onc-decision">Oncology decision needed *</label><input id="onc-decision" type="text" required placeholder="Biopsy target, staging, treatment, or prognosis question"></div>`;
});

function buildPreview() {
  const evidence = allEvidence().filter((item) => selected.has(item.id));
  return `
    <div class="notice">Synthetic test data — not for clinical use</div>
    <section class="preview-block"><h3>Patient and routing</h3><p><b>Morgan Testpatient · SYN-MRN-100001 · ED Bay 18</b>\n${document.querySelector("#specialty").selectedOptions[0].text} · ${document.querySelector("#urgency").value} · ${document.querySelector("#response-window").value}</p></section>
    <section class="preview-block"><h3>Decision needed</h3><p>${document.querySelector("#consult-question").value}</p></section>
    <section class="preview-block"><h3>Primary team assessment</h3><p>${document.querySelector("#working-assessment").value}</p></section>
    <section class="preview-block"><h3>Why this timing matters</h3><p>${document.querySelector("#urgency-reason").value}</p></section>
    <section class="preview-block"><h3>Selected evidence</h3>${evidence.length ? `<ul class="preview-evidence">${evidence.map((item) => `<li><b>${item.label}:</b> ${item.detail}</li>`).join("")}</ul>` : "<p>No chart evidence selected.</p>"}</section>
    <section class="preview-block"><h3>Coordination</h3><p><b>Best-informed contact:</b> ${document.querySelector("#contact").value}\n<b>Availability:</b> ${document.querySelector("#availability").value}\n<b>Pending:</b> ${document.querySelector("#pending-items").value}</p></section>`;
}

function validateForPreview() {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  document.querySelector("#validation-message").textContent = "";
  return true;
}

function showPreview() {
  if (!validateForPreview()) return;
  document.querySelector("#preview-content").innerHTML = buildPreview();
  dialog.showModal();
}

document.querySelector("#preview-button").addEventListener("click", showPreview);
document.querySelector("#close-preview").addEventListener("click", () => dialog.close());
document.querySelector("#back-to-edit").addEventListener("click", () => dialog.close());

function sendConsult() {
  dialog.close();
  document.querySelector("#validation-message").style.color = "var(--green)";
  document.querySelector("#validation-message").textContent = "Consult sent · visible to Infectious Diseases";
  document.querySelector(".form-title .status").className = "status progress";
  document.querySelector(".form-title .status").textContent = "Sent";
}

document.querySelector("#send-from-preview").addEventListener("click", sendConsult);
form.addEventListener("submit", (event) => { event.preventDefault(); if (validateForPreview()) sendConsult(); });

for (const id of defaultSelected) selected.add(id);
renderChart();
renderSelected();

