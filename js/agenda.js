// Tasks A3 to A5: create, validate, delete, edit and render events (implemented by A)

const MONTH_LABELS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const MIN_NAME_LENGTH = 3;

let events = [];
let editingId = null;

/* ---------- Public API (used by Mari) ---------- */

function getEvents() {
  return events.slice();
}

function moveEvent(id, newStatus) {
  const event = findEventById(id);
  if (!event) {
    return { ok: false, message: "Event not found." };
  }
  if (newStatus !== "today" && newStatus !== "pending") {
    return { ok: false, message: "Invalid status." };
  }

  const check = canMoveEvent(id, newStatus);
  if (!check.ok) {
    return { ok: false, message: check.message || "This move is not allowed." };
  }

  if (event.status === newStatus) {
    return { ok: true, message: "" };
  }

  event.status = newStatus;
  saveEvents(events);
  renderAgenda();
  return { ok: true, message: "" };
}

function canMoveEvent(id, newStatus) {
  // Only Today has a limit
  if (newStatus !== "today") {
    return { ok: true };
  }

  // Moving an event to the status it already has is allowed
  const event = findEventById(id);
  if (event && event.status === "today") {
    return { ok: true };
  }

  const todayCount = getEvents().filter(function (item) {
    return item.status === "today";
  }).length;

  if (todayCount >= 5) {
    return { ok: false, message: "Today is full (max. 5 events)." };
  }
  return { ok: true };
}

function isOverdue(event) {
  if (!event.date) {
    return false;
  }

  // Local date as YYYY-MM-DD (toISOString would use UTC)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayString = year + "-" + month + "-" + day;

  return event.date < todayString;
}

function renderAgenda() {
  const zoneToday = document.getElementById("zone-today");
  const zonePending = document.getElementById("zone-pending");

  zoneToday.innerHTML = "";
  zonePending.innerHTML = "";

  events.slice().sort(compareByDate).forEach(function (event) {
    const card = createCard(event);
    if (event.status === "today") {
      zoneToday.appendChild(card);
    } else {
      zonePending.appendChild(card);
    }
  });

  showBoardMessage("");
  drawChart();
}

function initAgenda() {
  events = loadEvents();
  document.getElementById("event-form").addEventListener("submit", handleFormSubmit);
  renderAgenda();
}

/* ---------- Internal helpers ---------- */

function findEventById(id) {
  return events.find(function (event) {
    return event.id === id;
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function addEvent(name, date) {
  const event = {
    id: generateId(),
    name: name,
    date: date,
    status: "pending",
    createdAt: Date.now()
  };
  events.push(event);
  saveEvents(events);
  renderAgenda();
  return event;
}

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function isDuplicateName(name, ignoreId) {
  const wanted = normalizeName(name);
  return events.some(function (event) {
    return event.id !== ignoreId && normalizeName(event.name) === wanted;
  });
}

// Returns an error message string, or "" if the data is valid.
// ignoreId lets an event be edited without clashing with itself.
function validateEventInput(name, date, ignoreId) {
  const cleanName = (name || "").trim();

  if (cleanName.length < MIN_NAME_LENGTH) {
    return "Name must be at least " + MIN_NAME_LENGTH + " characters.";
  }
  if (!date) {
    return "Date is required.";
  }
  if (isDuplicateName(cleanName, ignoreId)) {
    return "An event with this name already exists.";
  }
  return "";
}

function handleFormSubmit(submitEvent) {
  submitEvent.preventDefault();

  const nameInput = document.getElementById("event-name");
  const dateInput = document.getElementById("event-date");
  const name = nameInput.value.trim();
  const date = dateInput.value;

  const error = validateEventInput(name, date);
  if (error) {
    showFormError(error);
    return;
  }

  showFormError("");
  addEvent(name, date);
  document.getElementById("event-form").reset();
  nameInput.focus();
}

function showFormError(message) {
  document.getElementById("form-error").textContent = message;
}

function showBoardMessage(message) {
  document.getElementById("board-message").textContent = message;
}

/* ---------- Delete and edit (task A5) ---------- */

function deleteEvent(id) {
  const event = findEventById(id);
  if (!event) {
    return;
  }
  if (!window.confirm('Delete "' + event.name + '"?')) {
    return;
  }

  events = events.filter(function (item) {
    return item.id !== id;
  });
  if (editingId === id) {
    editingId = null;
  }
  saveEvents(events);
  renderAgenda();
}

function startEdit(id) {
  editingId = id;
  renderAgenda();

  const input = document.querySelector(".card.editing .card-edit-input");
  if (input) {
    input.focus();
    input.select();
  }
}

function cancelEdit() {
  editingId = null;
  renderAgenda();
}

function saveEdit(id, newName, errorElement) {
  const event = findEventById(id);
  if (!event) {
    cancelEdit();
    return;
  }

  const name = newName.trim();
  const error = validateEventInput(name, event.date, id);
  if (error) {
    errorElement.textContent = error;
    return;
  }

  event.name = name;
  editingId = null;
  saveEvents(events);
  renderAgenda();
}

/* ---------- Card rendering ---------- */

function compareByDate(a, b) {
  if (a.date === b.date) {
    return (a.createdAt || 0) - (b.createdAt || 0);
  }
  if (!a.date) {
    return 1;
  }
  if (!b.date) {
    return -1;
  }
  return a.date < b.date ? -1 : 1;
}

function getDateBadge(dateString) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString || "");
  if (!parts) {
    return { day: "--", month: "---" };
  }
  return {
    day: String(Number(parts[3])),
    month: MONTH_LABELS[Number(parts[2]) - 1] || "---"
  };
}

function createElementWithText(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createButton(label, className, onClick) {
  const button = createElementWithText("button", className, label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function createActions(event) {
  const actions = createElementWithText("div", "card-actions");
  actions.appendChild(createButton("Edit", "btn-secondary", function () {
    startEdit(event.id);
  }));
  actions.appendChild(createButton("Delete", "btn-danger", function () {
    deleteEvent(event.id);
  }));
  return actions;
}

function createEditForm(event) {
  const form = createElementWithText("form", "card-edit-form");
  form.noValidate = true;

  const input = createElementWithText("input", "card-edit-input");
  input.type = "text";
  input.value = event.name;
  input.setAttribute("aria-label", "Event name");

  const error = createElementWithText("p", "card-error");
  error.setAttribute("role", "alert");

  const actions = createElementWithText("div", "card-actions");
  const saveButton = createElementWithText("button", "btn-primary", "Save");
  saveButton.type = "submit";
  actions.appendChild(saveButton);
  actions.appendChild(createButton("Cancel", "btn-secondary", cancelEdit));

  form.addEventListener("submit", function (submitEvent) {
    submitEvent.preventDefault();
    saveEdit(event.id, input.value, error);
  });

  input.addEventListener("keydown", function (keyEvent) {
    if (keyEvent.key === "Escape") {
      cancelEdit();
    }
  });

  form.appendChild(input);
  form.appendChild(error);
  form.appendChild(actions);
  return form;
}

function createCard(event) {
  const isEditing = event.id === editingId;

  const card = document.createElement("article");
  card.className = "card";
  if (isOverdue(event)) {
    card.classList.add("overdue");
  }
  if (isEditing) {
    card.classList.add("editing");
  }
  card.setAttribute("draggable", isEditing ? "false" : "true");
  card.dataset.id = event.id;

  const badgeData = getDateBadge(event.date);
  const badge = createElementWithText("div", "card-badge");
  badge.appendChild(createElementWithText("span", "badge-day", badgeData.day));
  badge.appendChild(createElementWithText("span", "badge-month", badgeData.month));

  const body = createElementWithText("div", "card-body");
  if (isEditing) {
    body.appendChild(createEditForm(event));
    body.appendChild(createElementWithText("p", "card-date", event.date));
  } else {
    body.appendChild(createElementWithText("p", "card-title", event.name));
    body.appendChild(createElementWithText("p", "card-date", event.date));
    body.appendChild(createActions(event));
  }

  card.appendChild(badge);
  card.appendChild(body);
  return card;
}