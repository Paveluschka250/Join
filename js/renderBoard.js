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
let currentDraggedElement;
let keys = [];

/**
 * Lädt alle Tasks von Firebase und rendert sie
 * @returns {Promise<void>}
 */
async function getTasks() {
    let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
    let responseToJson = await response.json();
    tasks = responseToJson;
    renderTask();
}

/**
 * Lädt Kontakte für die Sidebar von Firebase
 * @returns {Promise<void>}
 */
async function getContactsForSidebar() {
    let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
    let responseToJson = await response.json();
    contactsForSidebar = responseToJson;
}

getContactsForSidebar();
getTasks();

/**
 * Schaltet das Hamburger-Menü um
 */
function toggleHamburgerMenu() {
    document.getElementById("addtask-content").classList.toggle('hamburger-menu');
    document.getElementById('overlay-add-task-board').classList.toggle('hamburger-menu');
}

/**
 * Setzt die Priorität eines Tasks
 * @param {string} id - ID des Prioritäts-Buttons
 */
function getPriority(id) {
    let buttonRed = document.getElementById('prio1');
    let buttonOrange = document.getElementById('prio2');
    let buttonGreen = document.getElementById('prio3');

    if (id == 'prio1') {
        containsClass('prio1-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'prio2') {
        containsClass('prio2-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'prio3') {
        containsClass('prio3-color', buttonRed, buttonOrange, buttonGreen);
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
    if (prioColor === 'prio1-color') {
        prio1Color(red, orange, green);
    } else if (prioColor === 'prio2-color') {
        prio2Color(red, orange, green);
    } else if (prioColor === 'prio3-color') {
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
    let btnIcon1 = document.getElementById('high-prio-icon');
    let btnIcon2 = document.getElementById('medium-prio-icon');
    let btnIcon3 = document.getElementById('low-prio-icon');
    red.classList.toggle('prio1-color');
    btnIcon1.classList.toggle('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für mittlere Priorität
 * @param {HTMLElement} red - Rotes Prioritäts-Element
 * @param {HTMLElement} orange - Oranges Prioritäts-Element
 * @param {HTMLElement} green - Grünes Prioritäts-Element
 */
function prio2Color(red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon');
    let btnIcon2 = document.getElementById('medium-prio-icon');
    let btnIcon3 = document.getElementById('low-prio-icon');
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.toggle('prio2-color');
    btnIcon2.classList.toggle('priotity-btn-filter2');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für niedrige Priorität
 * @param {HTMLElement} red - Rotes Prioritäts-Element
 * @param {HTMLElement} orange - Oranges Prioritäts-Element
 * @param {HTMLElement} green - Grünes Prioritäts-Element
 */
function prio3Color(red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon');
    let btnIcon2 = document.getElementById('medium-prio-icon');
    let btnIcon3 = document.getElementById('low-prio-icon');
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    green.classList.toggle('prio3-color');
    btnIcon3.classList.toggle('priotity-btn-filter3');
}

/**
 * Zeigt das Formular für neue Subtasks
 */
function addNewSubTask() {
    document.getElementById('add-subtask-btn-sb').classList.add('d-none');
    document.getElementById('subtask-buttons-sb').classList.remove('d-none');
}

/**
 * Schließt das Formular für neue Subtasks
 */
function closeNewSubtasksBtn() {
    document.getElementById('add-subtask-btn-sb').classList.remove('d-none');
    document.getElementById('subtask-buttons-sb').classList.add('d-none');
}

/**
 * Fügt einen neuen Subtask hinzu
 */
function addSubTask() {
    let subTask = document.getElementById('subtasks');
    let contentDiv = document.getElementById('subtask-content');
    if (subTask.value !== '') {
        contentDiv.innerHTML += addSubtaskContentHTML(subTask);
        subTask.value = '';
        closeNewSubtasksBtn();
    } else {
        let subtaskError = document.getElementById('subtask-error');
        subtaskError.style.display = 'flex';
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
    let taskCategory = { category: "toDo" };
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let category = document.getElementById('category').value;
    let selectedContactsDivs = document.querySelectorAll('#added-users-container-add-task-on-board .current-task-initials');
    let assignedTo = [];
    let fullNames = [];
    selectedContactsDivs.forEach(function (div) {
        getInitialsAndFullNames(assignedTo, fullNames, div);
    });
    let subtaskList = document.querySelectorAll('#subtask-content li');
    const { subtasks, subtasksChecked } = getSubtasks(subtaskList);
    let priority = '';
    priority = setPriority(priority);
    await setFormData(taskCategory, title, description, dueDate, assignedTo, category, subtasks, subtasksChecked, priority, fullNames);
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
        subtasks = Array.from(subtaskList).map(li => li.textContent);
        for (let i = 0; i < subtasks.length; i++) {
            let subtask = { "id": `subtask${i}`, "checked": false };
            subtasksChecked.push(subtask);
        }
    } else {
        subtasks = ['dummy'];
        subtasksChecked = ['dummy'];
    }
    return { subtasks, subtasksChecked };
}

/**
 * Ermittelt die ausgewählte Priorität
 * @param {string} priority - Aktuelle Priorität
 * @returns {string} Ausgewählte Priorität
 */
function setPriority(priority) {
    if (document.getElementById('prio1').classList.contains('prio1-color')) {
        priority = 'Urgent';
    } else if (document.getElementById('prio2').classList.contains('prio2-color')) {
        priority = 'Medium';
    } else if (document.getElementById('prio3').classList.contains('prio3-color')) {
        priority = 'Low';
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
async function setFormData(taskCategory, title, description, dueDate, assignedTo, category, subtasks, subtasksChecked, priority, fullNames) {
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
        fullNames
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
    let value = div.getAttribute('value');
    fullNames.push(value);
}

/**
 * Sendet die Formulardaten an Firebase
 * @param {Object} formData - Die zu speichernden Formulardaten
 * @returns {Promise<void>}
 */
async function postFormDataToFireBase(formData) {
    fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {

        })
        .catch(error => {
        });
}

/**
 * Löscht alle Eingaben aus dem Formular
 * @returns {Promise<void>}
 */
async function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('selected-contacts-sb').innerHTML = '';
    document.getElementById('#added-users-container-add-task-on-board').innerHTML = '';
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('subtask-content').innerHTML = '';
    document.querySelectorAll('.priority-btn-addTask').forEach(button => {
        button.classList.remove('prio1-color', 'prio2-color', 'prio3-color');
    });
    toggleHamburgerMenu();
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
    loadContactsToEditAddTaskOnBoard()
}

/**
 * Setzt die Tasks in die entsprechenden Bereiche
 * @param {Object} toDo - Die Task-Daten
 * @param {HTMLElement} toDoBlock - Der Container für ToDo-Tasks
 */
function setTasks(toDo, toDoBlock) {
    if (toDo && Object.keys(toDo).length > 0) {
        inProgress.innerHTML = "";
        awaitFeedback.innerHTML = "";
        done.innerHTML = "";
        toDoBlock.innerHTML = "";
        let taskCounter = 0;
        for (let key in toDo) {
            const element = toDo[key];
            taskCounter++;
            filterCategory(taskCounter, element, toDoBlock);
        }
    }
}

/**
 * Filtert und rendert Tasks nach ihrer Kategorie
 * @param {number} taskCounter - Der Task-Index
 * @param {Object} element - Das Task-Element
 * @param {HTMLElement} toDoBlock - Der Container für ToDo-Tasks
 */
function filterCategory(taskCounter, element, toDoBlock) {
    if (element.taskCategory.category == "toDo") {
        renderToDo(taskCounter, element, toDoBlock);
    }
    if (element.taskCategory.category == "inProgress") {
        renderInProgress(taskCounter, element);
    }
    if (element.taskCategory.category == "awaitFeedback") {
        renderAwaitFeedback(taskCounter, element);
    }
    if (element.taskCategory.category == "done") {
        renderDone(taskCounter, element);
    }
    taskStyle(taskCounter);
    loadingspinner(taskCounter, element);
}

/**
 * Prüft und aktualisiert die Anzeige leerer Bereiche
 * @param {HTMLElement} toDoBlock - ToDo-Container
 * @param {HTMLElement} inProgress - InProgress-Container
 * @param {HTMLElement} awaitFeedback - AwaitFeedback-Container
 * @param {HTMLElement} done - Done-Container
 */
function checkContentFields(toDoBlock, inProgress, awaitFeedback, done) {
    if (toDoBlock.innerHTML === "") {
        toDoBlock.innerHTML = '<div class="board-content" id="to-do">No tasks To do</div>';
    }
    if (inProgress.innerHTML === "") {
        inProgress.innerHTML = '<div class="board-content" id="in-progress-content">No tasks To do</div>';
    }
    if (awaitFeedback.innerHTML === "") {
        awaitFeedback.innerHTML = '<div class="board-content" id="await-feedback-content">No tasks To do</div>';
    }
    if (done.innerHTML === "") {
        done.innerHTML = '<div class="board-content" id="done-content">No tasks To do</div>';
    }
}

/**
 * Rendert einen Task im ToDo-Bereich
 * @param {number} taskCounter - Der Task-Index
 * @param {Object} element - Das Task-Element
 * @param {HTMLElement} toDoBlock - Der Container für ToDo-Tasks
 */
function renderToDo(taskCounter, element, toDoBlock) {
    let prioIconURL = getPrioIconURL(element);
    let contactsHTML = [];
    setContactsTasks(element, contactsHTML)
    contactsHTML = contactsHTML.join('');
    toDoBlock.innerHTML += renderTaskHTML(element, taskCounter, prioIconURL, contactsHTML);
}

/**
 * Rendert einen Task im InProgress-Bereich
 * @param {number} taskCounter - Der Task-Index
 * @param {Object} element - Das Task-Element
 */
function renderInProgress(taskCounter, element) {
    let inProgress = document.getElementById("inProgress");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = [];
        setContactsTasks(element, contactsHTML)
        contactsHTML = contactsHTML.join('');
        inProgress.innerHTML += rederInProgress(element, taskCounter, prioIconURL, contactsHTML);
    }
}

/**
 * Rendert einen Task im AwaitFeedback-Bereich
 * @param {number} taskCounter - Der Task-Index
 * @param {Object} element - Das Task-Element
 */
function renderAwaitFeedback(taskCounter, element) {
    let awaitFeedback = document.getElementById("awaitFeedback");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = [];
        setContactsTasks(element, contactsHTML);
        contactsHTML = contactsHTML.join('');
        awaitFeedback.innerHTML += renderAwaitFeedbackHTML(element, taskCounter, prioIconURL, contactsHTML)
    }
}

/**
 * Rendert einen Task im Done-Bereich
 * @param {number} taskCounter - Der Task-Index
 * @param {Object} element - Das Task-Element
 */
function renderDone(taskCounter, element) {
    let done = document.getElementById("done");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = [];
        setContactsTasks(element, contactsHTML);
        contactsHTML = contactsHTML.join('');
        done.innerHTML += renderDoneHTML(element, taskCounter, prioIconURL, contactsHTML);
    }
}

/**
 * Ermittelt die URL des Prioritäts-Icons
 * @param {Object} element - Das Task-Element
 * @returns {string} Die URL des Icons
 */
function getPrioIconURL(element) {
    let prioIconURL;
    if (element.priority === 'Urgent') {
        prioIconURL = '../assets/icons/PriorityUrgentRed.png';
    } else if (element.priority === 'Medium') {
        prioIconURL = '../assets/icons/PriorityMediumOrange.png';
    } else if (element.priority === 'Low') {
        prioIconURL = '../assets/icons/PriorityLowGreen.png';
    } else {
        prioIconURL = '../assets/icons/minus.png';
    }
    return prioIconURL;
}

/**
 * Setzt den Stil eines Tasks basierend auf seiner Kategorie
 * @param {number} taskCounter - Der Task-Index
 */
function taskStyle(taskCounter) {
    let currentCategory = document.getElementById(`category-to-do${taskCounter}`);
    if (currentCategory.textContent === 'Technical Task') {
        currentCategory.style.backgroundColor = '#0038ff';
        currentCategory.style.color = 'white';
    } else if (currentCategory.textContent === 'User Story') {
        currentCategory.style.backgroundColor = '#ff7a00';
        currentCategory.style.color = 'white';
    } else {
        currentCategory.style.backgroundColor = 'lightblue';
        currentCategory.innerHTML = 'Ticket';
        currentCategory.style.color = 'white';
    }
}

/**
 * Schaltet das Dropdown-Menü für das Hinzufügen von Tasks um
 */
function toggleDropdownAddTaskOnBoard() {
    const dropdownMenu = document.getElementById('dropdown-menu-add-task-on-board');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

/**
 * Verarbeitet die Benutzerauswahl beim Hinzufügen eines Tasks
 */
function handleUserSelectionAddTaskOnBoard() {
    const checkboxes = document.querySelectorAll('#user-select-add-task-on-board input[type="checkbox"]');
    const selectedUsers = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    renderUsersAddTaskOnBoard(selectedUsers);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                renderUsersAddTaskOnBoard([checkbox.value]);
            } else {
                removeUserFromBoard(checkbox.value);
            }
        });
    });
}

/**
 * Rendert die ausgewählten Benutzer
 * @param {Array} users - Die ausgewählten Benutzer
 */
function renderUsersAddTaskOnBoard(users) {
    const taskContainer = document.getElementById('added-users-container-add-task-on-board');
    users.forEach(user => {
        if (!document.querySelector(`.current-task-initials[value="${user}"]`)) {
            let initials = createInitialsForEdit([user]);
            taskContainer.innerHTML += `
                <div class="current-task-initials edit-initials" value="${user}" style="background-color: ${getRandomColor()}">${initials}</div>
            `;
        }
    });
}

/**
 * Entfernt einen Benutzer vom Board
 * @param {string} user - Der zu entfernende Benutzer
 */
function removeUserFromBoard(user) {
    const taskContainer = document.getElementById('added-users-container-add-task-on-board');
    const userDiv = document.querySelector(`.current-task-initials[value="${user}"]`);
    if (userDiv) {
        taskContainer.removeChild(userDiv);
    }
}

/**
 * Lädt die Kontakte für die Bearbeitung des Boards
 */
function loadContactsToEditAddTaskOnBoard() {
    const namesArray = Object.values(contactsForSidebar).map(item => item.name);
    let userSelect = document.getElementById('user-select-add-task-on-board');
    userSelect.innerHTML = '';
    createUserfieldCheckbox(namesArray, userSelect)
    handleUserSelectionAddTaskOnBoard();
}

/**
 * Erstellt Checkbox-Felder für die Benutzerauswahl
 * @param {Array} namesArray - Array mit Benutzernamen
 * @param {HTMLElement} userSelect - Das Select-Element
 */
function createUserfieldCheckbox(namesArray, userSelect) {
    for (let i = 0; i < namesArray.length; i++) {
        const container = document.createElement('div');
        container.classList.add('checkbox-container');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${i}`;
        checkbox.value = namesArray[i];
        const names = document.createElement('div');
        names.htmlFor = `checkbox-${i}`;
        names.textContent = namesArray[i];
        container.appendChild(names);
        container.appendChild(checkbox);
        userSelect.appendChild(container);
    }
}