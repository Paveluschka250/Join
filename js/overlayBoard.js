/**
 * @fileoverview Overlay-Modul für das Board - Verwaltet die Anzeige und Interaktion mit Task-Overlays
 * @author ElStephano
 * @version 1.0.0
 * @license MIT
 * @created 2025-01-22
 */

// Globale Variablen für das Overlay-Management
// tasks wird bereits in renderBoard.js deklariert
let currentDraggedElement = null;
let keys = [];

/**
 * Aktualisiert und zeigt den Fortschrittsbalken für Subtasks eines Tasks
 * @param {number} taskCounter - Index des Tasks
 * @param {Object} element - Task-Objekt mit Subtask-Informationen
 */
function loadingspinner(taskCounter, element) {
    let progressBar = document.getElementById(`subtask-progress-bar-${taskCounter}`);
    let loadingbarText = document.getElementById(`subtasks-checked${taskCounter}`);
    if (element.subtasks != 'dummy') {
        let checkedSubtasks = 0;
        let allSubtasks = element.subtasks.length;
        checkedSubtasks = forLoopCheckedSubtasks(allSubtasks, checkedSubtasks, element)
        progressPercentage(allSubtasks, checkedSubtasks, loadingbarText, progressBar)
    }
    else {
        loadingbarText.innerHTML = '<p class="subtask-loadingbar-text">No Subtasks!</p>'
    }
}

/**
 * Zählt die Anzahl der erledigten Subtasks
 * @param {number} allSubtasks - Gesamtanzahl der Subtasks
 * @param {number} checkedSubtasks - Aktuelle Anzahl erledigter Subtasks
 * @param {Object} element - Task-Objekt mit Subtask-Informationen
 * @returns {number} Aktualisierte Anzahl erledigter Subtasks
 */
function forLoopCheckedSubtasks(allSubtasks, checkedSubtasks, element) {
    for (let i = 0; i < allSubtasks; i++) {
        if (element.subtasksChecked[i].checked === true) {
            checkedSubtasks++;
        }
    };
    return checkedSubtasks;
}

/**
 * Berechnet und zeigt den Fortschritt der Subtasks in Prozent
 * @param {number} allSubtasks - Gesamtanzahl der Subtasks
 * @param {number} checkedSubtasks - Anzahl erledigter Subtasks
 * @param {HTMLElement} loadingbarText - Element für den Fortschrittstext
 * @param {HTMLElement} progressBar - Fortschrittsbalken-Element
 */
function progressPercentage(allSubtasks, checkedSubtasks, loadingbarText, progressBar) {
    let progressPercentage = 100 / allSubtasks * checkedSubtasks;
    progressBar.style.width = `${progressPercentage}%`;
    loadingbarText.innerHTML = `
    <p class="subtask-loadingbar-text">${checkedSubtasks}/${allSubtasks}</p>
    <p class="subtask-loadingbar-text">Subtasks</p>
`
}

/**
 * Speichert den Status der Checkbox-Elemente für einen Task
 * @param {number} taskCounter - Index des Tasks
 */
function saveCheckBoxes(taskCounter) {
    taskCounter--;
    let taskId = Object.keys(tasks.toDo);
    let allTasksKey = [];
    allTasksKey = getAllKeysForLoop(taskId, allTasksKey);
    let currentTask = tasks.toDo[allTasksKey[taskCounter]];
    let currentSubtaskAmount = currentTask.subtasks.length;
    let subtasksChecked = [];
    for (let i = 0; i < currentSubtaskAmount; i++) {
        let input = document.getElementById(`checkbox${i}`).checked;
        subtasksChecked.push(input);
    }
    loadCheckfieldStatusToFirebase(subtasksChecked, taskCounter);
}

/**
 * Lädt den aktualisierten Checkbox-Status in Firebase
 * @param {Array<boolean>} subtasksChecked - Array mit Checkbox-Status
 * @param {number} taskCounter - Index des Tasks
 * @returns {Promise<void>}
 */
async function loadCheckfieldStatusToFirebase(subtasksChecked, taskCounter) {
    const baseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/";
    let taskKeys = Object.keys(tasks.toDo);
    let taskId = taskKeys[taskCounter];
    const url = `${baseUrl}tasks/toDo/${taskId}/subtasksChecked.json`;
    let updatedSubtasks = subtasksChecked.map((isChecked, index) => ({
        checked: isChecked,
        id: `subtask${index}`
    }));
    await fetchCheckFieldStatus(updatedSubtasks, url)
}

/**
 * Sendet die Checkbox-Status-Aktualisierung an Firebase
 * @param {Array<Object>} updatedSubtasks - Aktualisierte Subtask-Daten
 * @param {string} url - Firebase-URL für die Aktualisierung
 * @returns {Promise<void>}
 * @throws {Error} Bei Fehlern während der Firebase-Kommunikation
 */
async function fetchCheckFieldStatus(updatedSubtasks, url) {
    try {
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedSubtasks)
        });
    } catch (error) {
        console.error('Fehler bei der Firebase-Kommunikation:', error);
        throw error;
    }
}

/**
 * Lädt den gespeicherten Checkbox-Status für einen Task
 * @param {number} taskCounter - Index des Tasks
 */
function loadCheckFieldStatus(taskCounter) {
    taskCounter--;
    let taskId = Object.keys(tasks.toDo);
    let allTasksKey = [];
    allTasksKey = getAllKeysForLoop(taskId, allTasksKey);
    let currentTask = tasks.toDo[allTasksKey[taskCounter]];
    if (currentTask.subtasks && currentTask.subtasksChecked) {
        let currentSubtaskAmount = currentTask.subtasks.length;
        for (let i = 0; i < currentSubtaskAmount; i++) {
            let input = document.getElementById(`checkbox${i}`);
            if (currentTask.subtasksChecked[i].checked == true) {
                input.checked = currentTask.subtasksChecked[i];
            }
        }
    }
}

/**
 * Extrahiert alle Task-Keys aus einem Array
 * @param {Array<string>} taskId - Array mit Task-IDs
 * @param {Array<string>} allTasksKey - Array für die extrahierten Keys
 * @returns {Array<string>} Array mit allen Task-Keys
 */
function getAllKeysForLoop(taskId, allTasksKey) {
    for (let key in taskId) {
        let element = taskId[key];
        allTasksKey.push(element)
    }
    return allTasksKey;
}

/**
 * Generiert eine zufällige Farbe aus einer vordefinierten Palette
 * @returns {string} HEX-Farbcode
 */
function getRandomColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFD133',
        '#33FFF0', '#8E44AD', '#E74C3C', '#1ABC9C', '#F39C12',
        '#3498DB', '#9B59B6', '#2ECC71', '#E67E22', '#D35400',
        '#16A085', '#2980B9', '#C0392B', '#7D3C98', '#F4D03F',
        '#58D68D', '#5DADE2', '#AF7AC5', '#F5B041', '#73C6B6'
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

/**
 * Zeigt das Task-Overlay mit Details an
 * @param {number} taskCounter - Index des Tasks
 */
function showOverlayTask(taskCounter) {
    const overlay = document.getElementById('overlay-show-task');
    const currentTask = document.getElementById('current-task');
    overlay.classList.remove('d-none');
    overlay.classList.add('overlay-show-task');
    extractTaskData(taskCounter);
    if (!currentTask.hasAttribute('data-listener-added')) {
        currentTask.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        currentTask.setAttribute('data-listener-added', 'true');
    }
}

/**
 * Rendert den Inhalt des Task-Overlays
 * @param {number} taskCounter - Index des Tasks
 * @param {Array} currentTask - Daten des aktuellen Tasks
 */
function renderOverlayTask(taskCounter, currentTask) {
    let overlayContainer = document.getElementById('current-task');
    let contactsHTML;
    contactsHTML = getContactsHTML(currentTask, contactsHTML)
    let currentSubtasks;
    currentSubtasks = getCurrentSubtasksHTML(currentSubtasks, currentTask, taskCounter)
    overlayContainer.innerHTML = '';
    overlayContainer.innerHTML = renderOverlayTaskHTML(currentTask, taskCounter, contactsHTML, currentSubtasks);
    document.getElementById('editTaskBtn').addEventListener('click', function () {
        editTask(currentTask, taskCounter);
    });
    loadCheckFieldStatus(taskCounter, currentTask);
    overlayTaskGetFullNames(taskCounter, currentTask);
}

/**
 * Generiert HTML für die Subtasks im Overlay
 * @param {string} currentSubtasks - HTML-String für Subtasks
 * @param {Array} currentTask - Daten des aktuellen Tasks
 * @param {number} taskCounter - Index des Tasks
 * @returns {string} HTML für die Subtasks
 */
function getCurrentSubtasksHTML(currentSubtasks, currentTask, taskCounter) {
    if (currentTask[9] != "dummy" && typeof currentTask[9] === 'string') {
        let currentSubtask = currentTask[9].split(",");
        currentSubtasks = currentSubtask
            .map((subtask, i) =>
                `<div class="current-subtasks-task"><input onclick="saveCheckBoxes(${taskCounter})" id="checkbox${i}" type="checkbox">${subtask}</div>`)
            .join('');
    } else {
        currentSubtasks = 'No subtasks!';
    }
    return currentSubtasks;
}

/**
 * Generiert HTML für die Kontakte im Overlay
 * @param {Array} currentTask - Daten des aktuellen Tasks
 * @param {string} contactsHTML - HTML-String für Kontakte
 * @returns {string} HTML für die Kontakte
 */
function getContactsHTML(currentTask, contactsHTML) {
    if (currentTask[4] != "undefined") {
        contactsHTML = '';
        for (let i = 0; i < currentTask[4].length; i++) {
            contactsHTML += `<div class="initials-and-fullnames-container"><div class="current-task-initials" style="background-color: ${getRandomColor()}">${currentTask[4][i]}</div><div class="full-names-overlay" id="name-${i}"></div></div>`;
        }
    } else {
        contactsHTML = '';
        contactsHTML = `<p class="no-users-assigned">No Users assigned!</p>`;
    }
    return contactsHTML;
}

/**
 * Lädt die Namen der Kontakte für das Task-Overlay
 * @param {number} taskCounter - Index des Tasks
 * @param {Array} currentTask - Daten des aktuellen Tasks
 */
function overlayTaskGetFullNames(taskCounter, currentTask) {
    getKeysFromTasks();
    taskCounter--;
    let userAmount = currentTask[4].length;
    if (tasks.toDo[keys[taskCounter]].fullNames) {
        let names = (tasks.toDo[keys[taskCounter]].fullNames);
        for (let i = 0; i < userAmount; i++) {
            const element = names[i];
            let initial = document.getElementById(`name-${i}`);
            initial.innerHTML = `${element}`;
        }
    }
    moreUsers(userAmount, currentTask, taskCounter);
}

/**
 * Zeigt weitere Kontakte an, wenn mehr als 4 Kontakte vorhanden sind
 * @param {number} userAmount - Anzahl der Kontakte
 * @param {Array} currentTask - Daten des aktuellen Tasks
 * @param {number} taskCounter - Index des Tasks
 */
function moreUsers(userAmount, currentTask, taskCounter) {
    if (userAmount >= 4 && currentTask[4][4] && currentTask[4][4].includes('+')) {
        let initial = document.getElementById(`name-${4}`);
        initial.innerHTML = `<div id="more-users">weitere</div>`;
        initial.addEventListener('click', function () {
            showAllUsers(currentTask, taskCounter)
        })
    }
}

/**
 * Zeigt alle Kontakte an, wenn auf "weitere" geklickt wird
 * @param {Array} currentTask - Daten des aktuellen Tasks
 * @param {number} taskCounter - Index des Tasks
 */
function showAllUsers(currentTask, taskCounter) {
    let allUsers = document.getElementById('current-task');
    allUsers.innerHTML = '';
    let fullNames = tasks.toDo[keys[taskCounter]].fullNames;
    let div = document.createElement('div');
    allUsers.appendChild(div);
    for (i = 0; i < fullNames.length; i++) {
        let initials = createInitialsForEdit([fullNames[i]]);
        div.innerHTML += `
                <div class="all-users">
                    <span><span class="all-initials" style="background-color: ${getRandomColor()}">${initials}</span><span class="all-full-names">${fullNames[i]}</span></span>
                </div>
            `
    }
}

/**
 * Extrahiert die Daten des Tasks
 * @param {number} taskCounter - Index des Tasks
 */
function extractTaskData(taskCounter) {
    const taskElement = getTaskElement(taskCounter);
    if (!taskElement) {
        return null;
    }
    const category = extractTextContent(taskElement, `#category-to-do${taskCounter}`);
    const title = extractTextContent(taskElement, `#title-task${taskCounter}`);
    const description = extractTextContent(taskElement, `#description-task${taskCounter}`);
    const dueDate = extractTextContent(taskElement, `#set-due-date${taskCounter}`);
    const fullName = extractTextContent(taskElement, `#set-full-name${taskCounter}`);
    const priority = extractTextContent(taskElement, `#set-priority${taskCounter}`);
    const subtasks = extractTextContent(taskElement, `#set-subtasks${taskCounter}`);
    const prioIcon = extractPrioIcon(taskElement);
    const contactsHTML = extractContactsHTML(taskElement, `#contacts-task${taskCounter}`);
    const currentTask = buildCurrentTask(taskCounter, category, title, description, contactsHTML, prioIcon, dueDate, fullName, priority, subtasks);
    renderOverlayTask(taskCounter, currentTask);
}

/**
 * Gibt das Task-Element zurück
 * @param {number} taskCounter - Index des Tasks
 * @returns {HTMLElement} Task-Element
 */
function getTaskElement(taskCounter) {
    return document.getElementById(`to-do-content${taskCounter}`);
}

/**
 * Extrahiert den Textinhalt eines Elements
 * @param {HTMLElement} taskElement - Task-Element
 * @param {string} selector - Selektor für das zu extrahierende Element
 * @returns {string} Textinhalt des Elements
 */
function extractTextContent(taskElement, selector) {
    const element = taskElement.querySelector(selector);
    return element ? element.textContent.trim() : null;
}

/**
 * Extrahiert das Prio-Icon
 * @param {HTMLElement} taskElement - Task-Element
 * @returns {string} Prio-Icon-URL
 */
function extractPrioIcon(taskElement) {
    const prioIconElement = taskElement.querySelector('.task-prio-icon');
    return prioIconElement ? prioIconElement.src : null;
}

/**
 * Extrahiert die Kontakte-HTML
 * @param {HTMLElement} taskElement - Task-Element
 * @param {string} selector - Selektor für das zu extrahierende Element
 * @returns {string} Kontakte-HTML
 */
function extractContactsHTML(taskElement, selector) {
    const contactsContainer = taskElement.querySelector(selector);
    const contactsHTML = [];
    if (contactsContainer) {
        const contactDivs = contactsContainer.querySelectorAll('div');
        contactDivs.forEach(contactDiv => {
            contactsHTML.push(contactDiv.innerHTML.trim());
        });
    }
    return contactsHTML;
}

