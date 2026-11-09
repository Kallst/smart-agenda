// Task A2: localStorage persistence (implemented by A)

const STORAGE_KEY = "smartAgenda.events";

function isValidStoredEvent(event) {
  return (
    event !== null &&
    typeof event === "object" &&
    typeof event.id === "string" &&
    typeof event.name === "string" &&
    typeof event.date === "string" &&
    (event.status === "today" || event.status === "pending")
  );
}

function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch (error) {
    console.error("Could not save events:", error);
    return false;
  }
}

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidStoredEvent);
  } catch (error) {
    console.error("Could not load events, starting empty:", error);
    return [];
  }
}