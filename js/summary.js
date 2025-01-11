/**
 * @fileoverview Dashboard-Übersichtsmodul für die Anzeige von Aufgabenstatistiken und Benutzerinformationen
 * @author Yesser-Ben-Amor
 * @version 1.0.0
 */

/**
 * Basis-URL für die Firebase Realtime Database
 * @constant {string}
 */
const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Name des aktuell eingeloggten Benutzers aus dem LocalStorage
 * @constant {string}
 */
const onlineUser = localStorage.getItem("onlineUser");

/**
 * Aktualisiert den Benutzerkreis und die Benutzerbegrüßung in der UI
 * Zeigt den ersten Buchstaben des Benutzernamens im Kreis an
 * @returns {void}
 */
function updateUserCircle() {
  const onlineUser = localStorage.getItem("onlineUser");

  if (onlineUser && onlineUser != "Gast") {
    const userGreeting = document.getElementById("username");
    if (userGreeting) {
      userGreeting.innerHTML = onlineUser;
    }

    const userCircle = document.getElementById("userCircle");
    if (userCircle) {
      userCircle.innerHTML = "";
      const initial = onlineUser.charAt(0).toUpperCase();
      userCircle.innerHTML = `<h4>${initial}</h4>`;
    }
  }
}

/**
 * Zeigt das Overlay-Element an
 * @param {string} id - Die ID des zu zeigenden Overlay-Elements
 * @returns {void}
 */
function showOverlay(id) {
  document.getElementById("overlay").classList.remove("d-none");
}

/**
 * Versteckt das Overlay-Element, wenn außerhalb des Benutzerkreises geklickt wird
 * @param {Event} event - Das Click-Event
 * @returns {void}
 */
function hideOverlay(event) {
  const userCircle = document.getElementById("userCircle");
  const overlay = document.getElementById("overlay");

  if (!userCircle.contains(event.target) && !overlay.classList.contains("d-none")) {
    overlay.classList.add("d-none");
  }
}

/**
 * Lädt und aktualisiert die Zusammenfassungsdaten des Dashboards
 * Initialisiert Standardwerte und aktualisiert Aufgabenzähler und Deadlines
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Wenn beim Laden der Daten ein Fehler auftritt
 */
async function loadSummary() {
  try {
    setDefaultValues();
    const tasks = await fetchTasks();
    if (!tasks) return;

    updateTaskCounts(tasks);
    updateDeadline(tasks);
  } catch (error) {
    console.error("Fehler beim Laden der Zusammenfassung:", error);
  }
}

/**
 * Ruft die Aufgaben von der Firebase-Datenbank ab
 * @async
 * @returns {Promise<Array<Object>|null>} Array von Aufgaben oder null wenn keine Daten vorhanden
 * @throws {Error} Wenn die Daten nicht abgerufen werden können
 */
async function fetchTasks() {
  const response = await fetch(`${_URL}/tasks/toDo.json`);
  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Daten");
  }
  const data = await response.json();
  return data ? Object.values(data) : null;
}

/**
 * Berechnet die Anzahl der Aufgaben in den verschiedenen Kategorien
 * @param {Array<Object>} tasks - Array aller Aufgaben
 * @returns {{
 *   total: number,
 *   urgent: number,
 *   todo: number,
 *   inProgress: number,
 *   awaitingFeedback: number,
 *   done: number
 * }} Objekt mit Aufgabenzählern
 */
function getTaskCounts(tasks) {
  return {
    total: tasks.length,
    urgent: tasks.filter((task) => task.priority === "Urgent").length,
    todo: tasks.filter((task) => task.taskCategory.category === "toDo").length,
    inProgress: tasks.filter((task) => task.taskCategory.category === "inProgress").length,
    awaitingFeedback: tasks.filter((task) => task.taskCategory.category === "awaitFeedback").length,
    done: tasks.filter((task) => task.taskCategory.category === "done").length,
  };
}

/**
 * Aktualisiert die Anzeige der Aufgabenzähler in der UI
 * @param {Array<Object>} tasks - Array aller Aufgaben
 * @returns {void}
 */
function updateTaskCounts(tasks) {
  const counts = getTaskCounts(tasks);

  document.getElementById("tasksInBoard").innerHTML = `<h1>${counts.total}</h1>`;
  document.getElementById("tasks-length").innerHTML = `<h1>${counts.urgent}</h1>`;
  document.getElementById("to-do").innerHTML = `<h1>${counts.todo}</h1>`;
  document.getElementById("progress-task").innerHTML = `<h1>${counts.inProgress}</h1>`;
  document.getElementById("awaiting-task").innerHTML = `<h1>${counts.awaitingFeedback}</h1>`;
  document.getElementById("tasks-Done").innerHTML = `<h1>${counts.done}</h1>`;
}

/**
 * Aktualisiert die Anzeige der nächsten Deadline
 * Zeigt das früheste Fälligkeitsdatum aller Aufgaben an
 * @param {Array<Object>} tasks - Array aller Aufgaben
 * @returns {void}
 */
function updateDeadline(tasks) {
  const dates = tasks.map((task) => new Date(task.dueDate));
  const earliestDeadline = dates.length > 0 ? new Date(Math.min(...dates)) : null;

  document.getElementById("uncomming-Deadline").innerHTML = earliestDeadline
    ? `<h3>${earliestDeadline.toLocaleDateString()}</h3>`
    : "<h3>Keine Deadline</h3>";
}

/**
 * Setzt alle Anzeigewerte auf ihre Standardwerte zurück
 * Wird beim initialen Laden und bei Fehlern verwendet
 * @returns {void}
 */
function setDefaultValues() {
  document.getElementById("tasksInBoard").innerHTML = "<h1>0</h1>";
  document.getElementById("tasks-length").innerHTML = "<h1>0</h1>";
  document.getElementById("to-do").innerHTML = "<h1>0</h1>";
  document.getElementById("progress-task").innerHTML = "<h1>0</h1>";
  document.getElementById("awaiting-task").innerHTML = "<h1>0</h1>";
  document.getElementById("tasks-Done").innerHTML = "<h1>0</h1>";
  document.getElementById("uncomming-Deadline").innerHTML = "<h3>Keine Deadline</h3>";
}

// Event-Listener für das Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  updateUserCircle();
  loadSummary();
});

// Event-Listener für das Ausblenden des Overlays
document.addEventListener("click", hideOverlay);
