/**
 * @fileoverview Funktionalität für das Hinzufügen von Tasks im Join Projekt
 * @author ElStephano
 * @copyright Join
 * @version 1.0.0
 * @license MIT
 * @created 2025-01-22
 */

/** @type {Array} Speichert die Kontakte aus der Datenbank */
let contacts = [];

/**
 * Lädt die Kontakte von der Firebase-Datenbank
 * @async
 * @returns {Promise<void>}
 */
async function getContacts() {
  let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
  let responseToJson = await response.json();
  contacts = responseToJson;
}

getContacts();

/**
 * Setzt die Priorität für eine Aufgabe basierend auf der Button-ID
 * @param {string} id - Die ID des geklickten Prioritäts-Buttons
 */
function getPriority(id) {
  let buttonRed = document.getElementById('priority1');
  let buttonOrange = document.getElementById('priority2');
  let buttonGreen = document.getElementById('priority3');

  if (id == 'priority1') {
    containsClass('prio1-color', buttonRed, buttonOrange, buttonGreen);
  } else if (id == 'priority2') {
    containsClass('prio2-color', buttonRed, buttonOrange, buttonGreen);
  } else if (id == 'priority3') {
    containsClass('prio3-color', buttonRed, buttonOrange, buttonGreen);
  }
}

/**
 * Verwaltet die CSS-Klassen für die Prioritäts-Buttons
 * @param {string} prioColor - Die zu verwendende Prioritätsfarben-Klasse
 * @param {HTMLElement} red - Der rote Prioritäts-Button
 * @param {HTMLElement} orange - Der orange Prioritäts-Button
 * @param {HTMLElement} green - Der grüne Prioritäts-Button
 */
function containsClass(prioColor, red, orange, green) {
  let btnIcon1 = document.getElementById('priority-btn1');
  let btnIcon2 = document.getElementById('priority-btn2');
  let btnIcon3 = document.getElementById('priority-btn3');
  if (prioColor === 'prio1-color') {
    prioColor1(red, orange, green, btnIcon1, btnIcon2, btnIcon3);
  } else if (prioColor === 'prio2-color') {
    prioColor2(red, orange, green, btnIcon1, btnIcon2, btnIcon3);
  } else if (prioColor === 'prio3-color') {
    prioColor3(red, orange, green, btnIcon1, btnIcon2, btnIcon3);
  }
}

/**
 * Setzt die Farben für die höchste Priorität (Rot)
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 */
function prioColor1(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
  red.classList.toggle('prio1-color');
  btnIcon1.classList.toggle('priotity-btn-filter1');
  orange.classList.remove('prio2-color');
  btnIcon2.classList.remove('priotity-btn-filter2');
  green.classList.remove('prio3-color');
  btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für die mittlere Priorität (Orange)
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 */
function prioColor2(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
  red.classList.remove('prio1-color');
  btnIcon1.classList.remove('priotity-btn-filter1');
  orange.classList.toggle('prio2-color');
  btnIcon2.classList.toggle('priotity-btn-filter2');
  green.classList.remove('prio3-color');
  btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für die niedrigste Priorität (Grün)
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 */
function prioColor3(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
  red.classList.remove('prio1-color');
  btnIcon1.classList.remove('priotity-btn-filter1');
  orange.classList.remove('prio2-color');
  btnIcon2.classList.remove('priotity-btn-filter2');
  green.classList.toggle('prio3-color');
  btnIcon3.classList.toggle('priotity-btn-filter3');
}

/**
 * Fügt ein neues Subtask-Eingabefeld hinzu
 */
function addNewSubTask() {
  document.getElementById('open-subtask').classList.add('d-none');
  document.getElementById('subtask-close-and-add').classList.remove('d-none');
}

/**
 * Schließt das Subtask-Eingabefeld
 */
function closeNewSubtasksBtn() {
  document.getElementById('open-subtask').classList.remove('d-none');
  document.getElementById('subtask-close-and-add').classList.add('d-none');
}

/**
 * Fügt eine neue Subtask zur Liste hinzu
 */
function addSubTask() {
  let subTask = document.getElementById('subtasks');
  let contentDiv = document.getElementById('subtask-content');
  if (subTask.value !== '') {
    contentDiv.innerHTML += addSubTaskHTML(subTask);
    subTask.value = '';
    closeNewSubtasksBtn()
  } else {
    let subtaskError = document.getElementById('subtask-error-add-task');
    subtaskError.style.display = 'flex';
    setTimeout(function () {
      subtaskError.style.display = "none";
    }, 3000);
  }
}

/**
 * Bestätigt die Bearbeitung einer Subtask
 * @param {HTMLElement} btn - Der Bestätigungs-Button
 * @param {string} subtask - Der Text der Subtask
 */
function confirmEditSubtask(btn, subtask) {
  let currentSubtask = document.getElementById(`current-subtask-${subtask}`);
  let inputDiv = document.getElementById(`edit-${subtask}`);
  let subtaskContent = btn.closest('li').querySelector('p');
  let input = document.getElementById(`input-edit-${subtask}`).value;
  subtaskContent.innerHTML = input;
  currentSubtask.classList.remove('d-none');
  currentSubtask.classList.toggle('li-elements-overlayTask');
  inputDiv.classList.add('d-none');
  inputDiv.classList.toggle('li-elements-overlayTask');
}

/**
 * Aktiviert den Bearbeitungsmodus für eine Subtask
 * @param {HTMLElement} btn - Der Bearbeiten-Button
 * @param {string} subtask - Der Text der Subtask
 */
function editSubtask(btn, subtask) {
  let currentSubtask = btn.closest('div');
  let inputDiv = document.getElementById(`edit-${subtask}`);
  let input = document.getElementById(`input-edit-${subtask}`);
  let newInput = document.getElementById(`current-subtask-${subtask}`)
  let editCurrentSubtask = newInput.querySelectorAll("p")[0].innerHTML
  input.value = `${editCurrentSubtask}`;
  currentSubtask.classList.add('d-none');
  currentSubtask.classList.toggle('li-elements-overlayTask');
  inputDiv.classList.remove('d-none');
  inputDiv.classList.toggle('li-elements-overlayTask');
}

/**
 * Löscht eine Subtask aus der Liste
 * @param {HTMLElement} buttonElement - Der Löschen-Button
 */
function deleteSubTask(buttonElement) {
  let liElement = buttonElement.closest('li');
  if (liElement) {
    liElement.remove();
  }
}

/**
 * Sammelt alle Aufgabendaten und speichert sie
 * @param {Event} event - Das Submit-Event des Formulars
 */
function getTaskData(event) {
  event.preventDefault();
  const taskData = {
    ...collectBasicTaskInfo(),
    ...collectAssignedContacts(),
    priority: getPriorityLevel(),
    ...collectSubtasks(),
    taskCategory: { category: "toDo" }
  };

  saveTaskToDatabase(taskData);
}

/**
 * Sammelt die grundlegenden Aufgabeninformationen
 * @returns {Object} Objekt mit title, description, dueDate und category
 */
function collectBasicTaskInfo() {
  return {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    dueDate: document.getElementById('due-date').value,
    category: document.getElementById('category-selected').value
  };
}

/**
 * Sammelt die zugewiesenen Kontakte
 * @returns {Object} Objekt mit assignedTo und fullNames Arrays
 */
function collectAssignedContacts() {
  const selectedContactsDivs = document.querySelectorAll('#selected-contacts .contact-initials');
  const assignedTo = [];
  const fullNames = [];
  
  selectedContactsDivs.forEach(div => {
    assignedTo.push(div.textContent);
    fullNames.push(div.getAttribute('value'));
  });
  
  return { assignedTo, fullNames };
}

/**
 * Ermittelt die ausgewählte Prioritätsstufe
 * @returns {string} Die ausgewählte Priorität ('Urgent', 'Medium', 'Low' oder '')
 */
function getPriorityLevel() {
  if (document.getElementById('priority1').classList.contains('prio1-color')) return 'Urgent';
  if (document.getElementById('priority2').classList.contains('prio2-color')) return 'Medium';
  if (document.getElementById('priority3').classList.contains('prio3-color')) return 'Low';
  return '';
}

/**
 * Sammelt alle Subtasks und deren Status
 * @returns {Object} Objekt mit subtasks Array und subtasksChecked Array
 */
function collectSubtasks() {
  const subtaskElements = getSubtaskElements();

  if (subtaskElements.length === 0) {
    return getDefaultSubtasks();
  }

  const subtasks = extractSubtaskTexts(subtaskElements);
  const subtasksChecked = generateSubtaskCheckStates(subtaskElements);

  return { subtasks, subtasksChecked };
}

function getSubtaskElements() {
  const subtaskElements = [];
  const listItems = document.querySelectorAll('#subtask-content li');
  listItems.forEach(li => {
    const firstP = li.querySelector('p');
    if (firstP) {
      subtaskElements.push(firstP);
    }
  });
  return subtaskElements;
}

function getDefaultSubtasks() {
  return {
    subtasks: ['dummy'],
    subtasksChecked: ['dummy']
  };
}

function extractSubtaskTexts(subtaskElements) {
  return Array.from(subtaskElements).map(element => element.textContent);
}

function generateSubtaskCheckStates(subtaskElements) {
  return Array.from(subtaskElements).map((_, index) => ({
    id: `subtask${index}`,
    checked: false
  }));
}

/**
 * Speichert die Aufgabe in der Firebase-Datenbank
 * @async
 * @param {Object} taskData - Die zu speichernden Aufgabendaten
 * @returns {Promise<void>}
 */
async function saveTaskToDatabase(taskData) {
  try {
    const response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (response.ok) {
      resetFormFields();
      window.location.href = './board.html';
    }
  } catch (error) {
    console.error('Error saving task:', error);
  }
}

function resetFormFields() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('due-date').value = '';
  document.getElementById('category-selected').innerHTML = 'Select task category';
  document.getElementById('selected-contacts').innerHTML = '';
  let subtaskContent = document.getElementById('subtask-content');
  subtaskContent.innerHTML = '';
  resetButtons()
  closeNewSubtasksBtn();
}

function resetButtons() {
  let buttonRed = document.getElementById('priority1');
  let buttonOrange = document.getElementById('priority2');
  let buttonGreen = document.getElementById('priority3');
  buttonRed.classList.remove('prio1-color');
  buttonOrange.classList.remove('prio2-color');
  buttonGreen.classList.remove('prio3-color');
  document.getElementById('priority-btn1').classList.remove('priotity-btn-filter1');
  document.getElementById('priority-btn2').classList.remove('priotity-btn-filter2');
  document.getElementById('priority-btn3').classList.remove('priotity-btn-filter3');
}

function getUsersToAssignedTo() {
  const namesArray = Object.values(contacts).map(item => item.name);
  let contactsDropdown = document.getElementById('contacts-dropdown');
  contactsDropdown.innerHTML = '';

  namesArray.forEach((name) => {
    const isSelected = isContactSelected(name);
    let initials = getInitials(name);
    let backgroundColor = getRandomColor();
    
    contactsDropdown.innerHTML += getUserToAssignedToHTML(name, initials, backgroundColor, isSelected)
  });
}

/**
 * Generiert die Initialen eines Namens
 * @param {string} name - Der Name
 * @returns {string} Die Initialen des Namens
 */
function getInitials(name) {
  let splitName = name.split(" ");
  return splitName.length > 1
    ? `${splitName[0][0].toUpperCase()}${splitName[1][0].toUpperCase()}`
    : `${splitName[0][0].toUpperCase()}`;
}

/**
 * Schaltet die Auswahl eines Kontakts um
 * @param {string} name - Der Name des Kontakts
 * @param {HTMLElement} optionDiv - Das Option-Element
 */
function toggleContactSelection(name, optionDiv) {
  const checkbox = optionDiv.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  
  if (checkbox.checked) {
    selectContacts(name);
  } else {
    removeContact(name);
  }
}

/**
 * Entfernt einen Kontakt aus der Auswahl
 * @param {string} name - Der Name des Kontakts
 */
function removeContact(name) {
  const selectedContacts = document.getElementById('selected-contacts');
  const contactToRemove = selectedContacts.querySelector(`[value="${name}"]`);
  if (contactToRemove) {
    contactToRemove.remove();
  }
}

/**
 * Prüft ob ein Kontakt bereits ausgewählt ist
 * @param {string} name - Der Name des Kontakts
 * @returns {boolean} True wenn der Kontakt ausgewählt ist
 */
function isContactSelected(name) {
  const selectedDivs = document.querySelectorAll('#selected-contacts .contact-initials');
  return Array.from(selectedDivs).some(div => div.getAttribute('value') === name);
}
