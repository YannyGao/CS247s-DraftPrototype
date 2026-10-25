const methodButtons = document.querySelectorAll("[data-method]");
const typedView = document.querySelector("#typed-view");
const voiceView = document.querySelector("#voice-view");
const transcript = document.querySelector("#transcript");
const recordButton = document.querySelector("#record-button");
const recordState = document.querySelector("#record-state");
const speechWarning = document.querySelector("#speech-warning");
const generateButton = document.querySelector("#generate-summary");
const summaryStatus = document.querySelector("#summary-status");
const generatedDraft = document.querySelector("#generated-draft");
const generatedFields = document.querySelector("#generated-fields");

let activeMethod = "typed";
let recognition = null;
let isRecording = false;
let committedTranscript = "";

methodButtons.forEach((button) => button.addEventListener("click", () => {
  activeMethod = button.dataset.method;
  methodButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });
  typedView.classList.toggle("hidden", activeMethod !== "typed");
  voiceView.classList.toggle("hidden", activeMethod !== "voice");
}));

const typedNote = document.querySelector("#typed-note");
typedNote.addEventListener("input", () => {
  const words = typedNote.value.trim() ? typedNote.value.trim().split(/\s+/).length : 0;
  document.querySelector("#typed-word-count").textContent = `${words} word${words === 1 ? "" : "s"}`;
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.onresult = (event) => {
    let interim = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const piece = event.results[index][0].transcript;
      if (event.results[index].isFinal) committedTranscript += `${piece.trim()} `;
      else interim += piece;
    }
    transcript.value = `${committedTranscript}${interim}`.trim();
    updateTranscriptState();
  };
  recognition.onerror = (event) => {
    speechWarning.textContent = event.error === "not-allowed" ? "Microphone access was blocked. Allow microphone access in the browser, then try again." : `Speech recognition stopped: ${event.error}. You can continue by typing into the transcript.`;
    speechWarning.classList.remove("hidden");
    stopRecording();
  };
  recognition.onend = () => { if (isRecording) recognition.start(); };
} else {
  speechWarning.classList.remove("hidden");
  recordButton.disabled = true;
}

function startRecording() {
  committedTranscript = transcript.value.trim() ? `${transcript.value.trim()} ` : "";
  recognition.start();
  isRecording = true;
  recordState.classList.add("recording");
  recordState.querySelector("strong").textContent = "Listening…";
  recordButton.textContent = "Stop dictation";
  recordButton.classList.remove("primary");
}

function stopRecording() {
  if (recognition && isRecording) recognition.stop();
  isRecording = false;
  recordState.classList.remove("recording");
  recordState.querySelector("strong").textContent = "Microphone ready";
  recordButton.textContent = "Start dictation";
  recordButton.classList.add("primary");
  committedTranscript = transcript.value.trim() ? `${transcript.value.trim()} ` : "";
}

recordButton.addEventListener("click", () => isRecording ? stopRecording() : startRecording());

function updateTranscriptState() {
  const words = transcript.value.trim() ? transcript.value.trim().split(/\s+/).length : 0;
  document.querySelector("#word-count").textContent = `${words} word${words === 1 ? "" : "s"}`;
  generateButton.disabled = transcript.value.trim().length < 20;
  summaryStatus.textContent = generateButton.disabled ? "Add at least 20 characters to the transcript." : "Transcript is ready for draft generation.";
}

transcript.addEventListener("input", updateTranscriptState);

function renderSections(sections) {
  generatedFields.replaceChildren();
  Object.entries(sections).forEach(([label, value], index) => {
    const field = document.createElement("div");
    field.className = "field note-field";
    const fieldLabel = document.createElement("label");
    fieldLabel.htmlFor = `generated-${index}`;
    fieldLabel.textContent = label;
    const fieldValue = document.createElement("textarea");
    fieldValue.id = `generated-${index}`;
    fieldValue.value = value;
    const reminder = document.createElement("small");
    reminder.textContent = "Review and edit before signing.";
    field.append(fieldLabel, fieldValue, reminder);
    generatedFields.append(field);
  });
  generatedDraft.classList.remove("hidden");
  generatedDraft.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createLocalDraft(sourceText) {
  const polished = sourceText
    .replace(/\s+/g, " ")
    .replace(/\b(um|uh|you know)\b[,.]?\s*/gi, "")
    .replace(/(^|[.!?]\s+)([a-z])/g, (match, lead, letter) => `${lead}${letter.toUpperCase()}`)
    .trim();
  return {
    source: "local-fallback",
    sections: {
      "Final oncology consult note": polished
    }
  };
}

async function generateDraft(sourceText) {
  const localHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (!localHost) return createLocalDraft(sourceText);

  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: sourceText })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to generate draft.");
    return data;
  } catch {
    return createLocalDraft(sourceText);
  }
}

generateButton.addEventListener("click", async () => {
  stopRecording();
  generateButton.disabled = true;
  generateButton.textContent = "Creating note…";
  summaryStatus.textContent = "Rewriting the transcript without adding clinical content.";
  try {
    const data = await generateDraft(transcript.value);
    if (data.sections) renderSections(data.sections);
    else {
      const text = data.text || "";
      renderSections({ "Generated consultation draft": text });
    }
    document.querySelector("#summary-source").textContent = data.source === "api" ? "API draft" : "Local demo draft";
    summaryStatus.textContent = "Draft created. Review it against the transcript before approval.";
  } catch (error) {
    summaryStatus.textContent = error.message;
  } finally {
    generateButton.disabled = transcript.value.trim().length < 20;
    generateButton.textContent = "Create polished note";
  }
});

document.querySelector("#save-draft").addEventListener("click", () => {
  document.querySelector("#save-state").textContent = `Draft saved locally at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
});

document.querySelector("#approve-note").addEventListener("click", () => {
  document.querySelector("#save-state").textContent = "Review marked complete · synthetic record only";
});

document.querySelector("#reset-note").addEventListener("click", () => {
  document.querySelectorAll("textarea").forEach((field) => { field.value = ""; });
  generatedDraft.classList.add("hidden");
  document.querySelector("#save-state").textContent = "Not saved";
  document.querySelector("#typed-word-count").textContent = "0 words";
  updateTranscriptState();
});

updateTranscriptState();

