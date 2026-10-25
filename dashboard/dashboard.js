import { consultations, incomingIdConsult } from "../shared/data.js";

const list = document.querySelector("#consult-list");
const tabs = document.querySelector("#status-tabs");
const visibleCount = document.querySelector("#visible-count");
const viewSummary = document.querySelector("#view-summary");
const requestActions = document.querySelector("#request-actions");
const rejectForm = document.querySelector("#reject-form");
const confirmation = document.querySelector("#decision-confirmation");
const consultBoard = document.querySelector("#consult-board");
const boardDragHandle = document.querySelector("#board-drag-handle");

let items = structuredClone(consultations);
let activeTab = "All";
let draggedId = null;
const originalOrder = items.map((item) => item.id);

function setBoardPosition(left, top) {
  const margin = 8;
  const rect = consultBoard.getBoundingClientRect();
  const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
  consultBoard.style.left = `${Math.min(Math.max(left, margin), maxLeft)}px`;
  consultBoard.style.top = `${Math.min(Math.max(top, margin), maxTop)}px`;
  consultBoard.style.right = "auto";
}

boardDragHandle.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const rect = consultBoard.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  boardDragHandle.setPointerCapture(event.pointerId);
  boardDragHandle.classList.add("moving");
  setBoardPosition(rect.left, rect.top);

  const move = (moveEvent) => setBoardPosition(moveEvent.clientX - offsetX, moveEvent.clientY - offsetY);
  const stop = () => {
    boardDragHandle.classList.remove("moving");
    boardDragHandle.removeEventListener("pointermove", move);
    boardDragHandle.removeEventListener("pointerup", stop);
    boardDragHandle.removeEventListener("pointercancel", stop);
  };

  boardDragHandle.addEventListener("pointermove", move);
  boardDragHandle.addEventListener("pointerup", stop);
  boardDragHandle.addEventListener("pointercancel", stop);
  event.preventDefault();
});

boardDragHandle.addEventListener("keydown", (event) => {
  const directions = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  };
  if (!directions[event.key]) return;
  const [x, y] = directions[event.key];
  const rect = consultBoard.getBoundingClientRect();
  const step = event.shiftKey ? 40 : 10;
  setBoardPosition(rect.left + x * step, rect.top + y * step);
  event.preventDefault();
});

window.addEventListener("resize", () => {
  const rect = consultBoard.getBoundingClientRect();
  setBoardPosition(rect.left, rect.top);
});

function statusClass(status) {
  if (status === "New") return "new";
  if (status === "In Progress") return "progress";
  return "complete";
}

function filteredItems() {
  return activeTab === "All" ? items : items.filter((item) => item.status === activeTab);
}

function renderTabs() {
  const options = ["All", "New", "In Progress", "Completed"];
  tabs.innerHTML = options.map((option) => {
    const count = option === "All" ? items.length : items.filter((item) => item.status === option).length;
    return `<button class="tab ${option === activeTab ? "active" : ""}" role="tab" aria-selected="${option === activeTab}" data-tab="${option}">${option}<span class="count">${count}</span></button>`;
  }).join("");
}

function renderList() {
  const current = filteredItems();
  visibleCount.textContent = current.length;
  viewSummary.textContent = `${activeTab} consults · ranked`;
  list.innerHTML = current.map((item, index) => `
    <article class="consult-card" draggable="true" data-id="${item.id}" data-urgency="${item.urgency}" tabindex="0" aria-label="Priority ${index + 1}: ${item.patient}, ${item.question}">
      <span class="priority-marker" aria-hidden="true"></span>
      <div class="card-body">
        <div class="card-line"><strong>${index + 1}. ${item.patient}, ${item.age}</strong><span class="status ${statusClass(item.status)}">${item.status}</span></div>
        <div class="card-meta"><span>${item.service}</span><span>${item.location}</span><span>Received ${item.received}</span><span>${item.urgency}</span></div>
        <p class="card-question">${item.question}</p>
        <div class="card-owner">${item.owner} · ${item.detail}</div>
      </div>
    </article>`).join("");
  bindDragEvents();
}

function render() {
  renderTabs();
  renderList();
  document.querySelector("#board-subtitle").textContent = `${items.filter((item) => item.status !== "Completed").length} active · ${items.filter((item) => item.status === "Completed").length} completed`;
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tab]");
  if (!button) return;
  activeTab = button.dataset.tab;
  render();
});

function bindDragEvents() {
  list.querySelectorAll(".consult-card").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedId = card.dataset.id;
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      draggedId = null;
      card.classList.remove("dragging");
      list.querySelectorAll(".drop-target").forEach((target) => target.classList.remove("drop-target"));
    });
    card.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (card.dataset.id !== draggedId) card.classList.add("drop-target");
    });
    card.addEventListener("dragleave", () => card.classList.remove("drop-target"));
    card.addEventListener("drop", (event) => {
      event.preventDefault();
      const targetId = card.dataset.id;
      if (!draggedId || draggedId === targetId) return;
      const draggedIndex = items.findIndex((item) => item.id === draggedId);
      const targetIndex = items.findIndex((item) => item.id === targetId);
      const [dragged] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, dragged);
      render();
    });
  });
}

document.querySelector("#accept-button").addEventListener("click", () => {
  if (!items.some((item) => item.id === incomingIdConsult.id)) items.unshift(structuredClone(incomingIdConsult));
  activeTab = "All";
  requestActions.classList.add("hidden");
  rejectForm.classList.add("hidden");
  confirmation.className = "decision-confirmation";
  confirmation.innerHTML = `<strong>Consult accepted.</strong> Morgan Testpatient is now the first item in your ranked worklist. You can drag the card to change its priority.`;
  render();
  list.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#reject-button").addEventListener("click", () => {
  requestActions.classList.add("hidden");
  rejectForm.classList.remove("hidden");
  document.querySelector("#reject-reason").focus();
});

document.querySelector("#cancel-reject").addEventListener("click", () => {
  rejectForm.classList.add("hidden");
  requestActions.classList.remove("hidden");
});

rejectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const reason = document.querySelector("#reject-reason").value;
  const team = document.querySelector("#redirect-team").value;
  rejectForm.classList.add("hidden");
  confirmation.className = "decision-confirmation";
  confirmation.innerHTML = `<strong>Request returned to Emergency Medicine.</strong>${reason ? ` Reason: ${reason}.` : ""}${team ? ` Suggested destination: ${team}.` : ""} The request remains visible to the sender.`;
});

document.querySelector("#reset-order").addEventListener("click", () => {
  items.sort((a, b) => originalOrder.indexOf(a.id) - originalOrder.indexOf(b.id));
  render();
});

render();

