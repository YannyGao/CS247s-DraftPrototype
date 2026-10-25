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

document.querySelectorAll(".note-section-nav button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".note-section-nav button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  document.querySelector(`#${button.dataset.target}`).focus();
}));

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
  generatedFields.innerHTML = Object.entries(sections).map(([label, value], index) => `<div class="field"><label for="generated-${index}">${label}</label><textarea id="generated-${index}">${value}</textarea></div>`).join("");
  generatedDraft.classList.remove("hidden");
  generatedDraft.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createLocalDraft(sourceText) {
  const sentences = sourceText
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const find = (patterns) => sentences.filter((sentence) => patterns.some((pattern) => pattern.test(sentence))).slice(0, 3);
  const assessment = find([/assess|concern|suspect|likely|consistent|impression/i]);
  const recommendations = find([/recommend|plan|start|continue|obtain|monitor|follow|consult/i]);
  const pending = find([/pending|await|follow[- ]?up|result|culture|biopsy|imaging/i]);

  return {
    source: "local-fallback",
    sections: {
      "Consult question": sentences[0] || "No consult question identified.",
      Assessment: assessment.join(" ") || sentences.slice(1, 3).join(" ") || "No assessment identified.",
      Recommendations: recommendations.map((item) => `• ${item}`).join("\n") || "• Review and edit the transcript to add recommendations.",
      "Pending and follow-up": pending.map((item) => `• ${item}`).join("\n") || "• No pending items identified."
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
  generateButton.textContent = "Generating draft…";
  summaryStatus.textContent = "Structuring the transcript. Keep this window open.";
  try {
    const data = await generateDraft(transcript.value);
    if (data.sections) renderSections(data.sections);
    else {
      const text = data.text || "";
      renderSections({ "Generated consultation draft": text });
    }
    document.querySelector("#summary-source").textContent = data.source === "api" ? "API draft" : "Local demo draft";
    summaryStatus.textContent = "Draft generated. Review and edit before approval.";
  } catch (error) {
    summaryStatus.textContent = error.message;
  } finally {
    generateButton.disabled = transcript.value.trim().length < 20;
    generateButton.textContent = "Generate structured draft";
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
  updateTranscriptState();
});

updateTranscriptState();

