/**
 * @fileoverview Board-Rendering-Modul - Verwaltet die Darstellung und Interaktion mit dem Kanban-Board
 * @author ElStephano
 * @version 1.0.0
 * @license MIT
 * @created 2025-01-22
 */

// Globale Variablen für das Board-Management

let tasks = [];
let contactsForSidebar = [];

const boardState = {
  tasks: [],
  contactsForSidebar: [],
  currentDraggedElement: null,
  keys: [],
};

/**
 * Lädt alle Tasks von Firebase und rendert sie
 * @returns {Promise<void>}
 */
async function getTasks() {
  let response = await fetch(
    "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
  );
  let responseToJson = await response.json();
  tasks = responseToJson;
  renderTask();
}

/**
 * Lädt Kontakte für die Sidebar von Firebase
 * @returns {Promise<void>}
 */
async function getContactsForSidebar() {
  let response = await fetch(
    "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
  );
  let responseToJson = await response.json();
  contactsForSidebar = responseToJson;
}

getContactsForSidebar();
getTasks();

/**
 * Schaltet das Hamburger-Menü um
 */
function toggleHamburgerMenu() {
  document.getElementById("addtask-content").classList.toggle("hamburger-menu");
  document
    .getElementById("overlay-add-task-board")
    .classList.toggle("hamburger-menu");
}

/**
 * Setzt die Priorität eines Tasks
 * @param {string} id - ID des Prioritäts-Buttons
 */
function getPriority(id) {
  let buttonRed = document.getElementById("prio1");
  let buttonOrange = document.getElementById("prio2");
  let buttonGreen = document.getElementById("prio3");

  if (id == "prio1") {
    containsClass("prio1-color", buttonRed, buttonOrange, buttonGreen);
  } else if (id == "prio2") {
    containsClass("prio2-color", buttonRed, buttonOrange, buttonGreen);
  } else if (id == "prio3") {
    containsClass("prio3-color", buttonRed, buttonOrange, buttonGreen);
  }
}

/**
 * Prüft und setzt die Prioritäts-Klassen
 * @param {string} prioColor - Name der Prioritäts-Farbe
 * @param {HTMLElement} red - Rotes Prioritäts-Element
 * @param {HTMLElement} orange - Oranges Prioritäts-Element
 * @param {HTMLElement} green - Grünes Prioritäts-Element
 */
function containsClass(prioColor, red, orange, green) {
  if (prioColor === "prio1-color") {
    prio1Color(red, orange, green);
  } else if (prioColor === "prio2-color") {
    prio2Color(red, orange, green);
  } else if (prioColor === "prio3-color") {
    prio3Color(red, orange, green);
  }
}

/**
 * Setzt die Farben für hohe Priorität
 * @param {HTMLElement} red - Rotes Prioritäts-Element
 * @param {HTMLElement} orange - Oranges Prioritäts-Element
 * @param {HTMLElement} green - Grünes Prioritäts-Element
 */
function prio1Color(red, orange, green) {
  let btnIcon1 = document.getElementById("high-prio-icon");
  let btnIcon2 = document.getElementById("medium-prio-icon");
  let btnIcon3 = document.getElementById("low-prio-icon");
  red.classList.toggle("prio1-color");
  btnIcon1.classList.toggle("priotity-btn-filter1");
  orange.classList.remove("prio2-color");
  btnIcon2.classList.remove("priotity-btn-filter2");
  green.classList.remove("prio3-color");
  btnIcon3.classList.remove("priotity-btn-filter3");
}

/**
 * Setzt die Farben für mittlere Priorität
 * @param {HTMLElement} red - Rotes Prioritäts-Element
 * @param {HTMLElement} orange - Oranges Prioritäts-Element
 * @param {HTMLElement} green - Grünes Prioritäts-Element
 */
function prio2Color(red, orange, green) {
  let btnIcon1 = document.getElementById("high-prio-icon");
  let btnIcon2 = document.getElementById("medium-prio-icon");
  let btnIcon3 = document.getElementById("low-prio-icon");
  red.classList.remove("prio1-color");
  btnIcon1.classList.remove("priotity-btn-filter1");
  orange.classList.toggle("prio2-color");
  btnIcon2.classList.toggle("priotity-btn-filter2");
  green.classList.remove("prio3-color");
  btnIcon3.classList.remove("priotity-btn-filter3");
}

/**
 * Setzt die Farben für niedrige Priorität
 * @param {HTMLElement} red - Rotes Prioritäts-Element
 * @param {HTMLElement} orange - Oranges Prioritäts-Element
 * @param {HTMLElement} green - Grünes Prioritäts-Element
 */
function prio3Color(red, orange, green) {
  let btnIcon1 = document.getElementById("high-prio-icon");
  let btnIcon2 = document.getElementById("medium-prio-icon");
  let btnIcon3 = document.getElementById("low-prio-icon");
  red.classList.remove("prio1-color");
  btnIcon1.classList.remove("priotity-btn-filter1");
  orange.classList.remove("prio2-color");
  btnIcon2.classList.remove("priotity-btn-filter2");
  green.classList.toggle("prio3-color");
  btnIcon3.classList.toggle("priotity-btn-filter3");
}

/**
 * Zeigt das Formular für neue Subtasks
 */
function addNewSubTask() {
  document.getElementById("add-subtask-btn-sb").classList.add("d-none");
  document.getElementById("subtask-buttons-sb").classList.remove("d-none");
}

/**
 * Schließt das Formular für neue Subtasks
 */
function closeNewSubtasksBtn() {
  document.getElementById("add-subtask-btn-sb").classList.remove("d-none");
  document.getElementById("subtask-buttons-sb").classList.add("d-none");
}

/**
 * Fügt einen neuen Subtask hinzu
 */
function addSubTask() {
  let subTask = document.getElementById("subtasks");
  let contentDiv = document.getElementById("subtask-content");
  if (subTask.value !== "") {
    contentDiv.innerHTML += addSubtaskContentHTML(subTask);
    subTask.value = "";
    closeNewSubtasksBtn();
  } else {
    let subtaskError = document.getElementById("subtask-error");
    subtaskError.style.display = "flex";
    setTimeout(function () {
      subtaskError.style.display = "none";
    }, 3000);
  }
}

/**
 * Löscht einen Subtask
 * @param {HTMLElement} liElement - Das zu löschende Listenelement
 */
function deleteSubTask(liElement) {
  liElement.parentElement.remove();
}

/**
 * Verarbeitet die Formulardaten eines neuen Tasks
 * @param {Event} event - Das Submit-Event des Formulars
 * @returns {Promise<void>}
 */
async function getFormData(event) {
  event.preventDefault();
  const formData = getFormDataFields();
  const { assignedTo, fullNames } = getAssignedContactsBoard();
  const { subtasks, subtasksChecked } = getSubtasksData();
  const priority = setPriority("");
  await setFormData(
    formData.taskCategory,
    formData.title,
    formData.description,
    formData.dueDate,
    assignedTo,
    formData.category,
    subtasks,
    subtasksChecked,
    priority,
    fullNames
  );
}

/**
 * Holt die Eingabewerte aus dem Formular für einen neuen Task
 * @returns {Object} Ein Objekt mit den Werten für die Kategorie, den Titel, die Beschreibung, das Fälligkeitsdatum und die Kategorie des Tasks
 */
function getFormDataFields() {
  return {
    taskCategory: { category: "toDo" },
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    dueDate: document.getElementById("due-date").value,
    category: document.getElementById("category").value,
  };
}

/**
 * Ermittelt die zugewiesenen Kontakte für das Board
 * @returns {{assignedTo: Array<string>, fullNames: Array<string>}} Ein Objekt mit den zugewiesenen Kontakten und den vollständigen Namen
 */
function getAssignedContactsBoard() {
  let assignedTo = [];
  let fullNames = [];
  let selectedContactsDivs = document.querySelectorAll(
    "#added-users-container-add-task-on-board .current-task-initials"
  );

  selectedContactsDivs.forEach(function (div) {
    getInitialsAndFullNames(assignedTo, fullNames, div);
  });

  return { assignedTo, fullNames };
}

// Diese Funktion holt die Subtask-Daten
function getSubtasksData() {
  let subtaskList = document.querySelectorAll("#subtask-content li");
  return getSubtasks(subtaskList);
}

/**
 * Verarbeitet die Subtask-Daten
 * @param {NodeList} subtaskList - Liste der Subtask-Elemente
 * @returns {{subtasks: Array<string>, subtasksChecked: Array<Object>}} Subtask-Daten
 */
function getSubtasks(subtaskList) {
  let subtasks = [];
  let subtasksChecked = [];
  if (subtaskList.length > 0) {
    subtasks = Array.from(subtaskList).map((li) => li.textContent);
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = { id: `subtask${i}`, checked: false };
      subtasksChecked.push(subtask);
    }
  } else {
    subtasks = ["dummy"];
    subtasksChecked = ["dummy"];
  }
  return { subtasks, subtasksChecked };
}

/**
 * Ermittelt die ausgewählte Priorität
 * @param {string} priority - Aktuelle Priorität
 * @returns {string} Ausgewählte Priorität
 */
function setPriority(priority) {
  if (document.getElementById("prio1").classList.contains("prio1-color")) {
    priority = "Urgent";
  } else if (
    document.getElementById("prio2").classList.contains("prio2-color")
  ) {
    priority = "Medium";
  } else if (
    document.getElementById("prio3").classList.contains("prio3-color")
  ) {
    priority = "Low";
  }
  return priority;
}

/**
 * Speichert die Formulardaten eines Tasks
 * @param {Object} taskCategory - Kategorie des Tasks
 * @param {string} title - Titel des Tasks
 * @param {string} description - Beschreibung des Tasks
 * @param {string} dueDate - Fälligkeitsdatum
 * @param {Array} assignedTo - Zugewiesene Benutzer
 * @param {string} category - Kategorie
 * @param {Array} subtasks - Subtasks
 * @param {Array} subtasksChecked - Status der Subtasks
 * @param {string} priority - Priorität
 * @param {Array} fullNames - Vollständige Namen der zugewiesenen Benutzer
 * @returns {Promise<void>}
 */
async function setFormData(
  taskCategory,
  title,
  description,
  dueDate,
  assignedTo,
  category,
  subtasks,
  subtasksChecked,
  priority,
  fullNames
) {
  let formData = {
    title,
    description,
    dueDate,
    assignedTo,
    category,
    subtasks,
    subtasksChecked,
    priority,
    taskCategory,
    fullNames,
  };
  await postFormDataToFireBase(formData);
  await renderNewTask();
}

/**
 * Rendert einen neuen Task
 * @returns {Promise<void>}
 */
async function renderNewTask() {
  toggleHamburgerMenu();
  setTimeout(async () => {
    await getTasks();
  }, 500);
  clearForm();
}

/**
 * Ermittelt die Initialen und Vollständigen Namen der zugewiesenen Benutzer
 * @param {Array} assignedTo - Zugewiesene Benutzer
 * @param {Array} fullNames - Vollständige Namen der zugewiesenen Benutzer
 * @param {HTMLElement} div - Das Element mit den Benutzerinformationen
 */
function getInitialsAndFullNames(assignedTo, fullNames, div) {
  assignedTo.push(div.textContent);
  let value = div.getAttribute("value");
  fullNames.push(value);
}

/**
 * Sendet die Formulardaten an Firebase
 * @param {Object} formData - Die zu speichernden Formulardaten
 * @returns {Promise<void>}
 */
async function postFormDataToFireBase(formData) {
  fetch(
    "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  )
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {});
}

/**
 * Löscht alle Eingaben aus dem Formular
 * @returns {Promise<void>}
 */
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("added-users-container-add-task-on-board").innerHTML =
    "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("subtask-content").innerHTML = "";
  document.querySelectorAll(".priority-btn-addTask").forEach((button) => {
    button.classList.remove("prio1-color", "prio2-color", "prio3-color");
  });
}

/**
 * Rendert alle Tasks auf dem Board
 */
function renderTask() {
  let toDoBlock = document.getElementById("to-do-block");
  if ("toDo" in (tasks || {})) {
    let toDo = tasks.toDo;
    setTasks(toDo, toDoBlock);
  }
  checkContentFields(toDoBlock, inProgress, awaitFeedback, done);
  loadContactsToEditAddTaskOnBoard();
}
