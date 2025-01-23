/**
 * Erstellt das aktuelle Task-Objekt
 * @param {number} taskCounter - Index des Tasks
 * @param {string} category - Kategorie des Tasks
 * @param {string} title - Titel des Tasks
 * @param {string} description - Beschreibung des Tasks
 * @param {string} contactsHTML - Kontakte-HTML
 * @param {string} prioIcon - Prio-Icon-URL
 * @param {string} dueDate - Fälligkeitsdatum des Tasks
 * @param {string} fullName - Vollname des Tasks
 * @param {string} priority - Priorität des Tasks
 * @param {string} subtasks - Subtasks des Tasks
 * @returns {Array} Aktuelles Task-Objekt
 */
function buildCurrentTask(taskCounter, category, title, description, contactsHTML, prioIcon, dueDate, fullName, priority, subtasks) {
    return [
        taskCounter,
        category,
        title,
        description,
        contactsHTML,
        prioIcon,
        dueDate,
        fullName,
        priority,
        subtasks,
        taskCounter
    ];
}

/**
 * Schließt das aktuelle Task-Overlay
 * @returns {Promise<void>}
 */
async function closeCurrentTask() {
    const overlay = document.getElementById('overlay-show-task');
    overlay.classList.remove('overlay-show-task');
    overlay.classList.add('d-none');
    await getTasks();
}

/**
 * Löscht einen Task aus dem System
 * @param {string} taskId - ID des zu löschenden Tasks
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    taskId--;
    let currentTask = Object.keys(tasks.toDo);
    if (tasks.toDo && tasks.toDo[currentTask[taskId]]) {
        delete tasks.toDo[currentTask[taskId]];
    } else {
        return;
    }
    await fetchDeleteTask(currentTask, taskId)
    closeCurrentTask();
}

/**
 * Sendet die Löschanfrage an Firebase
 * @param {Array} currentTask - Daten des aktuellen Tasks
 * @param {string} taskId - ID des zu löschenden Tasks
 * @returns {Promise<void>}
 */
async function fetchDeleteTask(currentTask, taskId) {
    try {
        const response = await fetch(`https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo/${currentTask[taskId]}.json`, {
            method: 'DELETE',
        });
        if (response.ok) {
            await getTasks();
        }
    }
    catch (error) {
        console.error('Fehler bei der Firebase-Kommunikation:', error);
        throw error;
    }
}

/**
 * Startet den Drag-Vorgang für einen Task
 * @param {string} id - ID des zu ziehenden Tasks
 */
function startDragging(id) {
    id--;
    currentDraggedElement = id;
}

/**
 * Erlaubt das Droppen eines Tasks
 * @param {Event} ev - Drop-Event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Verschiebt einen Task in eine neue Kategorie
 * @param {string} category - Zielkategorie für den Task
 */
async function moveTo(category) {
    try {
        let taskKey = Object.keys(tasks.toDo)[currentDraggedElement];
        tasks.toDo[taskKey].taskCategory = category;
        await fetch(`https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo/${taskKey}/taskCategory.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category })
        });
    } catch (error) {
        console.error('Fehler bei der Firebase-Kommunikation:', error);
        throw error;
    }
    getTasks()
}

/**
 * Filtert Tasks basierend auf der Sucheingabe
 */
function filterTasks() {
    const searchValue = getSearchInputValue();
    const suggestionsContainer = clearSuggestions();
    if (searchValue) {
        const hasMatches = displayTaskSuggestions(searchValue, suggestionsContainer);
        if (!hasMatches) {
            displayNoResults(suggestionsContainer);
        }
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
    addClickOutsideListener(suggestionsContainer);
}

/**
 * Holt den Wert aus dem Sucheingabefeld
 * @returns {string} Sucheingabe
 */
function getSearchInputValue() {
    return document.getElementById('search-input').value.toLowerCase();
}

/**
 * Leert den Vorschlagscontainer
 * @returns {HTMLElement} Vorschlagscontainer
 */
function clearSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    return suggestionsContainer;
}

/**
 * Zeigt Taskvorschläge basierend auf der Sucheingabe
 * @param {string} searchValue - Sucheingabe
 * @param {HTMLElement} suggestionsContainer - Container für Vorschläge
 * @returns {boolean} True wenn Vorschläge gefunden wurden
 */
function displayTaskSuggestions(searchValue, suggestionsContainer) {
    let hasMatches = false;
    for (const taskKeys in tasks) {
        for (const taskId in tasks[taskKeys]) {
            const task = tasks[taskKeys][taskId];
            if (taskMatchesSearch(task, searchValue)) {
                createSuggestionItem(task, suggestionsContainer);
                hasMatches = true;
            }
        }
    }
    return hasMatches;
}

/**
 * Prüft, ob ein Task zur Sucheingabe passt
 * @param {Object} task - Task-Objekt
 * @param {string} searchValue - Sucheingabe
 * @returns {boolean} True wenn der Task passt
 */
function taskMatchesSearch(task, searchValue) {
    const titleMatch = task.title.toLowerCase().includes(searchValue);
    const descriptionMatch = task.description && task.description.toLowerCase().includes(searchValue);
    return titleMatch || descriptionMatch;
}

/**
 * Erstellt ein Vorschlagselement für einen Task
 * @param {Object} task - Task-Objekt
 * @param {HTMLElement} suggestionsContainer - Container für Vorschläge
 */
function createSuggestionItem(task, suggestionsContainer) {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `<strong>${task.title}</strong><br><small>${task.description}</small>`;
    suggestionItem.onclick = () => getTaskId(task, suggestionsContainer);
    suggestionsContainer.appendChild(suggestionItem);
}

/**
 * Zeigt "Keine Ergebnisse" an
 * @param {HTMLElement} suggestionsContainer - Container für Vorschläge
 */
function displayNoResults(suggestionsContainer) {
    const noResults = document.createElement('div');
    noResults.className = 'suggestion-item';
    noResults.innerText = 'Keine Ergebnisse gefunden';
    suggestionsContainer.appendChild(noResults);
}

/**
 * Fügt einen Klick-außerhalb Listener hinzu
 * @param {HTMLElement} suggestionsContainer - Container für Vorschläge
 */
function addClickOutsideListener(suggestionsContainer) {
    document.addEventListener('click', function (event) {
        const isClickInside = suggestionsContainer.contains(event.target) ||
            document.getElementById('search-input').contains(event.target);
        if (!isClickInside) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

/**
 * Holt die Task-ID und zeigt den Task an
 * @param {string} id - Task-ID
 * @param {HTMLElement} suggestionsContainer - Container für Vorschläge
 */
function getTaskId(id, suggestionsContainer) {
    getKeysFromTasks();
    for (let i = 0; i < keys.length; i++) {
        let task = tasks.toDo[keys[i]];
        if (task.title === id.title) {
            i++;
            suggestionsContainer.style.display = 'none';
            document.getElementById('search-input').value = '';
            showOverlayTask(i)
        } else {
            continue
        }
    }
}

/**
 * Holt die Task-Keys aus dem globalen Tasks-Objekt
 */
function getKeysFromTasks() {
    let taskKeys = Object.keys(tasks.toDo);
    keys = taskKeys;
}

/**
 * Öffnet den Task-Bearbeitungsmodus
 * @param {Array} currentTask - Daten des aktuellen Tasks
 * @param {number} taskCounter - Index des Tasks
 */
function editTask(currentTask, taskCounter) {
    renderEditTask();
    editCurrentTask(currentTask, taskCounter);
    document.getElementById('saveEditBtn').addEventListener("click", () => {
        saveEditBtn(taskCounter);
    });
    loadContactsToEdit()
}

/**
 * Rendert das Task-Bearbeitungsformular
 */
function renderEditTask() {
    let taskOverlay = document.getElementById("current-to-do");
    taskOverlay.innerHTML = '';
    taskOverlay.innerHTML = renderEditTaskHTML();

}

/**
 * Holt die Priorität für die Bearbeitung
 * @param {string} id - ID des Prioritätselements
 */
function getPriorityEdit(id) {
    let buttonRed = document.getElementById('prio1-edit');
    let buttonOrange = document.getElementById('prio2-edit');
    let buttonGreen = document.getElementById('prio3-edit');

    if (id == 'prio1-edit') {
        containsClassEdit('prio1-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'prio2-edit') {
        containsClassEdit('prio2-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'prio3-edit') {
        containsClassEdit('prio3-color', buttonRed, buttonOrange, buttonGreen);
    }
}

/**
 * Prüft, ob ein Element eine bestimmte Klasse enthält
 * @param {HTMLElement} prioColor - Prioritätselement
 * @param {HTMLElement} red - Rotes Prioritätselement
 * @param {HTMLElement} orange - Oranges Prioritätselement
 * @param {HTMLElement} green - Grünes Prioritätselement
 * @returns {boolean} True wenn die Klasse enthalten ist
 */
function containsClassEdit(prioColor, red, orange, green) {
    if (prioColor === 'prio1-color') {
        prio1ColorEdit(red, orange, green);
    } else if (prioColor === 'prio2-color') {
        prio2ColorEdit(red, orange, green)
    } else if (prioColor === 'prio3-color') {
        prio3ColorEdit(red, orange, green)
    }
}

/**
 * Setzt die Farben für hohe Priorität
 * @param {HTMLElement} red - Rotes Prioritätselement
 * @param {HTMLElement} orange - Oranges Prioritätselement
 * @param {HTMLElement} green - Grünes Prioritätselement
 */
function prio1ColorEdit(red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');
    red.classList.toggle('prio1-color');
    btnIcon1.classList.toggle('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    btnIcon2.classList.remove('prio2-icon-color');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für mittlere Priorität
 * @param {HTMLElement} red - Rotes Prioritätselement
 * @param {HTMLElement} orange - Oranges Prioritätselement
 * @param {HTMLElement} green - Grünes Prioritätselement
 */
function prio2ColorEdit(red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.toggle('prio2-color');
    btnIcon2.classList.toggle('priotity-btn-filter2');
    btnIcon2.classList.toggle('prio2-icon-color');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}