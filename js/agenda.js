// Tasks A3 to A5: create, validate, delete, edit and render events (implemented by A)

const MONTH_LABELS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const MIN_NAME_LENGTH = 3;

let events = [];

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
  // TODO (Mari): task M4. If newStatus is "today" and "today" already has
  // 5 events, return { ok: false, message: "Today is full (max. 5 events)." }.
  // Moving an event to the status it already has must be allowed.
  return { ok: true };
}

function isOverdue(event) {
  // TODO (Mari): task M4. Return true if event.date is before today's local date.
  return false;
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
// ignoreId is used by task A5 so editing an event does not clash with itself.
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

function createCard(event) {
  const card = document.createElement("article");
  card.className = "card";
  if (isOverdue(event)) {
    card.classList.add("overdue");
  }
  card.setAttribute("draggable", "true");
  card.dataset.id = event.id;

  const badgeData = getDateBadge(event.date);
  const badge = createElementWithText("div", "card-badge");
  badge.appendChild(createElementWithText("span", "badge-day", badgeData.day));
  badge.appendChild(createElementWithText("span", "badge-month", badgeData.month));

  const body = createElementWithText("div", "card-body");
  body.appendChild(createElementWithText("p", "card-title", event.name));
  body.appendChild(createElementWithText("p", "card-date", event.date));

  // TODO (A): task A5 adds the edit and delete buttons here
  body.appendChild(createElementWithText("div", "card-actions"));

  card.appendChild(badge);
  card.appendChild(body);
  return card;
}