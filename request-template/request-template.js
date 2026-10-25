const templates = {
  cardiology: {
    label: "Cardiology",
    areas: ["General Cardiology", "Electrophysiology"],
    description: "Provide rhythm, hemodynamic, symptom, and treatment details.",
    fields: [
      { id: "symptom-onset", label: "Symptoms and onset *", placeholder: "Symptoms, onset, duration, and current status" },
      { id: "rhythm", label: "Rhythm / ECG findings *", placeholder: "Rhythm, rate, and relevant ECG changes" },
      { id: "hemodynamics", label: "Hemodynamic status *", placeholder: "Blood pressure, perfusion, oxygen requirement" },
      { id: "cardiac-treatment", label: "Interventions and response", placeholder: "Medications or procedures already attempted" }
    ]
  },
  neurology: {
    label: "Neurology",
    areas: ["General Neurology", "Stroke / Neurovascular"],
    description: "Provide symptom timing, examination, imaging, and treatment details.",
    fields: [
      { id: "last-known-well", label: "Last known well *", placeholder: "Date and time, or unknown" },
      { id: "neuro-deficits", label: "Neurologic symptoms and examination *", placeholder: "Focal findings, NIHSS if completed, symptom course" },
      { id: "neuro-imaging", label: "Imaging completed *", placeholder: "CT, CTA, MRI, and key findings" },
      { id: "neuro-treatment", label: "Treatment and contraindications", placeholder: "Antithrombotics, thrombolysis considerations, recent procedures" }
    ]
  }
};

const specialty = document.querySelector("#specialty");
const consultArea = document.querySelector("#consult-area");
const adaptiveFields = document.querySelector("#adaptive-fields");
const form = document.querySelector("#consult-form");
const dialog = document.querySelector("#preview-dialog");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);

function renderTemplate() {
  const template = templates[specialty.value];
  consultArea.replaceChildren(...template.areas.map((area) => {
    const option = document.createElement("option");
    option.textContent = area;
    return option;
  }));
  document.querySelector("#template-title").textContent = `${template.label} request`;
  document.querySelector("#adaptive-description").textContent = template.description;
  adaptiveFields.replaceChildren(...template.fields.map((definition) => {
    const field = document.createElement("div");
    field.className = "field";
    const label = document.createElement("label");
    label.htmlFor = definition.id;
    label.textContent = definition.label;
    const input = document.createElement("textarea");
    input.id = definition.id;
    input.placeholder = definition.placeholder;
    input.required = definition.label.endsWith("*");
    field.append(label, input);
    return field;
  }));
}

function buildPreview() {
  const template = templates[specialty.value];
  const details = template.fields.map((field) => {
    const value = document.querySelector(`#${field.id}`).value.trim() || "Not provided";
    return `<li><b>${escapeHtml(field.label.replace(" *", ""))}:</b> ${escapeHtml(value)}</li>`;
  }).join("");
  return `
    <div class="notice">Synthetic test data — not for clinical use</div>
    <section class="preview-block"><h3>Patient</h3><p><b>Morgan Testpatient · SYN-MRN-100001 · ED Bay 18</b></p></section>
    <section class="preview-block"><h3>Routing</h3><p>${escapeHtml(template.label)} · ${escapeHtml(consultArea.value)} · ${escapeHtml(document.querySelector("#urgency").value)}</p></section>
    <section class="preview-block"><h3>Question</h3><p>${escapeHtml(document.querySelector("#consult-question").value)}</p></section>
    <section class="preview-block"><h3>Clinical details</h3><ul class="preview-evidence">${details}</ul></section>
    <section class="preview-block"><h3>Callback</h3><p>${escapeHtml(document.querySelector("#contact").value)}</p></section>`;
}

function validate() {
  if (form.checkValidity()) return true;
  form.reportValidity();
  return false;
}

function showPreview() {
  if (!validate()) return;
  document.querySelector("#preview-content").innerHTML = buildPreview();
  dialog.showModal();
}

function sendConsult() {
  if (!validate()) return;
  dialog.close();
  document.querySelector("#validation-message").style.color = "var(--green)";
  document.querySelector("#validation-message").textContent = `Consult sent · ${templates[specialty.value].label}`;
  document.querySelector(".form-title .status").className = "status progress";
  document.querySelector(".form-title .status").textContent = "Sent";
}

specialty.addEventListener("change", renderTemplate);
document.querySelector("#preview-button").addEventListener("click", showPreview);
document.querySelector("#close-preview").addEventListener("click", () => dialog.close());
document.querySelector("#back-to-edit").addEventListener("click", () => dialog.close());
document.querySelector("#send-from-preview").addEventListener("click", sendConsult);
form.addEventListener("submit", (event) => { event.preventDefault(); sendConsult(); });

renderTemplate();
