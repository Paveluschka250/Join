/**
 * Speichert die Änderungen am Task
 * @param {number} taskCounter - Index des Tasks
 */
async function saveEditBtn(taskCounter) {
    taskCounter--;
    getKeysFromTasks();
    let currentTaskKey = keys[taskCounter];
    await getDataFromEdit(currentTaskKey);
    closeCurrentTask();
    await getTasks();
}

/**
 * Sammelt alle bearbeiteten Daten des Tasks
 * @param {string} key - Schlüssel des Tasks in der Datenbank
 * @returns {Object} Die gesammelten Task-Daten
 */
async function getDataFromEdit(key) {
    let { currentStatus, title, description, dueDate, category } = extractTaskInfo(key);
    let { assignedTo, fullNames } = getAssignedContacts();
    let { subtasks, subtasksChecked } = getSubtasksUnchanged(key);
    let priority = getPriorityToEdit();

    let formData = {
        title, description, dueDate, assignedTo, category,
        subtasks, subtasksChecked, priority,
        taskCategory: { category: currentStatus }, fullNames
    };

    await editToFirebase(formData, key);
    getTasks();
}

/**
 * Extrahiert die grundlegenden Task-Informationen
 * @param {string} key - Schlüssel des Tasks in der Datenbank
 * @returns {Object} Die extrahierten Task-Informationen
 */
function extractTaskInfo(key) {
    let currentStatus = tasks.toDo[key].taskCategory.category;
    let title = document.getElementById('title-edit').value;
    let description = document.getElementById('description-edit').value;
    let dueDate = document.getElementById('due-date-edit').value;
    let category = document.getElementById('category-edit').value;
    return { currentStatus, title, description, dueDate, category };
}

/**
 * Sammelt die zugewiesenen Kontakte im Bearbeitungsmodus
 * @returns {Object} Objekt mit den zugewiesenen Kontakten
 */
function getAssignedContacts() {
    let selectedContactsDivs = document.querySelectorAll('#added-users-container .current-task-initials');
    let assignedTo = [];
    let fullNames = [];
    selectedContactsDivs.forEach(function (div) {
        assignedTo.push(div.textContent);
        let value = div.getAttribute('value');
        fullNames.push(value);
    });
    return { assignedTo, fullNames };
}

/**
 * Holt die unveränderten Subtasks aus der Datenbank
 * @param {string} key - Schlüssel des Tasks in der Datenbank
 * @returns {Object} Die unveränderten Subtasks
 */
function getSubtasksUnchanged(key) {
    let subtasks = [];
    let subtasksChecked = [];
    let subtaskList = document.querySelectorAll('#subtask-edit-content p');
    if (subtaskList.length > 0) {
        subtasks = Array.from(subtaskList).map(li => li.textContent);
        subtasksChecked = subtasks.map((_, i) => getSubtaskStatus(key, i));
    } else {
        subtasks = ['dummy'];
        subtasksChecked = ['dummy'];
    }
    return { subtasks, subtasksChecked };
}

/**
 * Ermittelt den Status eines Subtasks
 * @param key - Schlüssel des Tasks in der Datenbank
 * @param index - Index des Subtasks
 * @returns {Object} Objekt mit der ID und dem Status des Subtasks
 */
function getSubtaskStatus(key, index) {
    let subtaskStatus = tasks.toDo[key].subtasksChecked[index]
        ? tasks.toDo[key].subtasksChecked[index].checked
        : false;
    return { "id": `subtask${index}`, "checked": subtaskStatus };
}

/**
 * Speichert die bearbeiteten Daten in Firebase
 * @param {Object} formData - Die zu speichernden Formulardaten
 * @param {string} key - Schlüssel des Tasks in der Datenbank
 */
async function editToFirebase(formData, key) {
    const firebaseURL = `https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo/${key}.json`;
    await fetch(firebaseURL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fehler beim Aktualisieren der Daten: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
        });
}

/**
 * Ermittelt die ausgewählte Priorität im Bearbeitungsmodus
 * @returns {string} Die ausgewählte Priorität
 */
function getPriorityToEdit() {
    let priority = '';
    if (document.getElementById('prio1-edit').classList.contains('prio1-color')) {
        priority = 'Urgent';
    } else if (document.getElementById('prio2-edit').classList.contains('prio2-color')) {
        priority = 'Medium';
    } else if (document.getElementById('prio3-edit').classList.contains('prio3-color')) {
        priority = 'Low';
    }
    return priority;
}

/**
 * Schließt das Board-Overlay
 * @param {Event} event - Das auslösende Event
 */
function overlayBoardClosed(event) {
    let content = document.getElementById('addtask-content');
    if (!content.contains(event.target)) {
        toggleHamburgerMenu();
    }
}

document.getElementById('overlay-add-task-board').addEventListener('click', overlayBoardClosed);

document.getElementById('addtask-content').addEventListener('click', function (event) {
    event.stopPropagation();
});

/**
 * Öffnet das Menü zum Verschieben eines Tasks
 * @param {number} taskCounter - Index des Tasks
 * @param {Event} event - Das auslösende Event
 */
function taskMoveToMenu(taskCounter, event) {
    if (event && event.type !== 'drag') {
        event.stopPropagation();
    }
    let currentTask = document.getElementById(`to-do-content${taskCounter}`);
    currentTask.innerHTML = "";
    currentTask.innerHTML = taskMoveToMenuHTML(taskCounter);
}

/**
 * Verschiebt einen Task in eine andere Kategorie
 * @param {number} taskCounter - Index des Tasks
 * @param {string} category - Zielkategorie
 * @param {Event} event - Das auslösende Event
 */
function moveToCategory(taskCounter, category, event) {
    event.stopPropagation();
    taskCounter--;
    try {
        let taskKey = Object.keys(tasks.toDo)[taskCounter];
        tasks.toDo[taskKey].taskCategory = category;
        fetch(`https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo/${taskKey}/taskCategory.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category })
        });
    } catch (error) {
    }
    closeMoveTo(event);
}

/**
 * Schließt das Verschieben-Menü
 * @param {Event} event - Das auslösende Event
 */
function closeMoveTo(event) {
    event.stopPropagation();
    getTasks();
}