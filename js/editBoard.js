/**
 * @fileoverview Funktionalitäten zum Bearbeiten von Tasks im Board-View des Join Projekts
 * @author ElStephano
 * @copyright Join
 * @version 1.0.0
 * @created 2025-01-22
 */

/**
 * Setzt die Farben für die niedrige Priorität (Grün) im Edit-Modus
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 */
function prio3ColorEdit(red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    btnIcon2.classList.remove('prio2-icon-color');
    green.classList.toggle('prio3-color');
    btnIcon3.classList.toggle('priotity-btn-filter3');
}

/**
 * Lädt die Daten des aktuellen Tasks in das Bearbeitungsformular
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 * @param {number} taskCounter - Index des Tasks in der Task-Liste
 */
function editCurrentTask(currentTask, taskCounter) {
    taskCounter--;
    document.getElementById('title-edit').value = `${currentTask[2]}`;
    document.getElementById('description-edit').value = `${currentTask[3]}`;
    document.getElementById('due-date-edit').value = `${currentTask[6]}`;
    editPriorityBtn(currentTask);
    loadContactsToEdit();
    setTimeout(() => {
        // Jetzt können wir die zugewiesenen Kontakte richtig bearbeiten
        editAssignedContacts(currentTask, taskCounter);
    }, 0);
    categoryEdit(currentTask)
    editSubtasks(currentTask)
}

/**
 * Setzt die Kategorie im Bearbeitungsformular
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 */
function categoryEdit(currentTask) {
    if (currentTask[1] !== 'Ticket') {
        document.getElementById('category-edit').value = `${currentTask[1]}`;
    } else {
        document.getElementById('category-edit').value = '';
    }
}

/**
 * Lädt und zeigt die zugewiesenen Kontakte im Bearbeitungsmodus
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 * @param {number} taskCounter - Index des Tasks in der Task-Liste
 */
function editAssignedContacts(currentTask, taskCounter) {
    let assignedContacts = document.getElementById('added-users-container');
    let contacts = currentTask[7].split(",");
    getKeysFromTasks();
    let fullNames = tasks.toDo[keys[taskCounter]].fullNames;
    createInitialDiv(assignedContacts, fullNames, contacts);
    assignedContacts.addEventListener('click', function () {
        deleteUsersEdit(assignedContacts);
    });
}

/**
 * Erstellt die Initialen-Divs für zugewiesene Kontakte
 * @param {HTMLElement} assignedContacts - Container für die zugewiesenen Kontakte
 * @param {Array<string>} fullNames - Array mit den vollständigen Namen der Kontakte
 * @param {Array<string>} contacts - Array mit den Kontakt-IDs
 */
function createInitialDiv(assignedContacts, fullNames, contacts) {
    if (contacts.length > 0 && fullNames) {
        assignedContacts.innerHTML = '';
        for (let i = 0; i < contacts.length; i++) {
            const element = contacts[i];
            const fullName = fullNames[i];
            let initials = createInitialsForEdit([fullName]);
            assignedContacts.innerHTML += `
                <div class="current-task-initials edit-initials" value="${fullName}" style="background-color: ${getRandomColor()}">${initials}</div>
            `;
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.value === fullName) {
                    checkbox.checked = true;
                }
            });
        }
    } else {
        assignedContacts.innerHTML = '';
    }
}

/**
 * Löscht alle zugewiesenen Benutzer im Bearbeitungsmodus
 * @param {HTMLElement} assignedContacts - Container der zugewiesenen Kontakte
 */
function deleteUsersEdit(assignedContacts) {
    assignedContacts.innerHTML = '';
    const checkboxes = document.querySelectorAll('#user-select input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

/**
 * Initialisiert die Prioritäts-Buttons im Bearbeitungsmodus
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 */
function editPriorityBtn(currentTask) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');
    let red = document.getElementById('prio1-edit');
    let orange = document.getElementById('prio2-edit');
    let green = document.getElementById('prio3-edit');
    filterEditPriorityButton(currentTask, red, orange, green, btnIcon1, btnIcon2, btnIcon3);
}

/**
 * Setzt die entsprechende Prioritäts-Button-Farbe basierend auf der Task-Priorität
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 * @returns {Array} Gibt den currentTask zurück, wenn keine Priorität gesetzt ist
 */
function filterEditPriorityButton(currentTask, red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    if (currentTask[8] === 'Urgent') {
        urgentEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3)
    } else if (currentTask[8] === 'Medium') {
        mediumEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3)
    } else if (currentTask[8] === 'Low') {
        lowEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3)
    } else {
        return currentTask;
    }
}

/**
 * Setzt die Farben für höchste Priorität (Urgent)
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 */
function urgentEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    red.classList.add('prio1-color');
    btnIcon1.classList.add('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    btnIcon2.classList.remove('prio2-icon-color');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für mittlere Priorität (Medium)
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 */
function mediumEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.add('prio2-color');
    btnIcon2.classList.add('priotity-btn-filter2');
    btnIcon2.classList.add('prio2-icon-color');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

/**
 * Setzt die Farben für niedrige Priorität (Low)
 * @param {HTMLElement} red - Roter Prioritäts-Button
 * @param {HTMLElement} orange - Oranger Prioritäts-Button
 * @param {HTMLElement} green - Grüner Prioritäts-Button
 * @param {HTMLElement} btnIcon1 - Icon des roten Buttons
 * @param {HTMLElement} btnIcon2 - Icon des orangen Buttons
 * @param {HTMLElement} btnIcon3 - Icon des grünen Buttons
 */
function lowEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    btnIcon2.classList.remove('prio2-icon-color');
    green.classList.add('prio3-color');
    btnIcon3.classList.add('priotity-btn-filter3');
}

/**
 * Schaltet die Sichtbarkeit des Dropdown-Menüs um
 */
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

/**
 * Verarbeitet die Benutzerauswahl und aktualisiert die UI
 */
function handleUserSelection() {
    const checkboxes = document.querySelectorAll('#user-select input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const user = checkbox.value;
        const taskContainer = document.getElementById('added-users-container');
        const existingUserDiv = document.querySelector(`.current-task-initials[value="${user}"]`);

        if (checkbox.checked && !existingUserDiv) {
            let initials = createInitialsForEdit([user]);
            taskContainer.innerHTML += `
                <div class="current-task-initials edit-initials" value="${user}" style="background-color: ${getRandomColor()}">${initials}</div>
            `;
        } else if (!checkbox.checked && existingUserDiv) {
            existingUserDiv.remove();
        }
    });
}

/**
 * Rendert die ausgewählten Benutzer in der UI
 * @param {Array<string>} users - Array mit den Benutzernamen
 */
function renderUsers(users) {
    const taskContainer = document.getElementById('added-users-container');
    taskContainer.innerHTML = '';
    users.forEach(user => {
        let initials = createInitialsForEdit([user]);
        taskContainer.innerHTML += `
            <div class="current-task-initials edit-initials" value="${user}" style="background-color: ${getRandomColor()}">${initials}</div>
        `;
    });
}

/**
 * Lädt die Kontakte für das Bearbeitungsformular
 */
function loadContactsToEdit() {
    const namesArray = Object.values(contactsForSidebar).map(item => item.name);
    let userSelect = document.getElementById('user-select');
    userSelect.innerHTML = '';
    loadContactsToEditForLoop(namesArray, userSelect);
}

/**
 * Erstellt die Kontaktauswahl-UI im Bearbeitungsmodus
 * @param {Array<string>} namesArray - Array mit den Namen der Kontakte
 * @param {HTMLElement} userSelect - Container für die Benutzerauswahl
 */
function loadContactsToEditForLoop(namesArray, userSelect) {
    for (let i = 0; i < namesArray.length; i++) {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${i}`;
        checkbox.value = namesArray[i];
        checkbox.addEventListener('change', handleUserSelection);
        const name = document.createElement('div');
        name.setAttribute('for', `checkbox-${i}`);
        name.textContent = namesArray[i];
        userDiv.appendChild(name);
        userDiv.appendChild(checkbox);
        userSelect.appendChild(userDiv);
    }
}

/**
 * Erstellt die Initialen aus einem Benutzernamen
 * @param {Array<string>} user - Array mit dem Benutzernamen
 * @returns {string} Die Initialen des Benutzers
 */
function createInitialsForEdit(user) {
    if (user) {
        let splitName = user[0].split(" ");
        if (splitName.length > 1) {
            let firstNameInitial = splitName[0][0].toUpperCase();
            let secondNameInitial = splitName[1][0].toUpperCase();
            let initials = `${firstNameInitial}${secondNameInitial}`;
            return initials;            
        } else {
            let initials = splitName[0][0].toUpperCase();
            return initials;
        }
    }
}

/**
 * Lädt die Subtasks in das Bearbeitungsformular
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 */
function editSubtasks(currentTask) {
    let subtasksEdit = currentTask[9];
    let list = document.getElementById('subtask-edit-list');
    list.innerHTML = '';
    setSubtasksToEdit(subtasksEdit, list, currentTask)
}

/**
 * Bereitet die Subtasks für die Bearbeitung vor
 * @param {HTMLElement} subtasksEdit - Container für die Subtasks
 * @param {HTMLElement} list - Liste der Subtasks
 * @param {Array} currentTask - Array mit den Daten des aktuellen Tasks
 */
function setSubtasksToEdit(subtasksEdit, list, currentTask) {
    if (!subtasksEdit || subtasksEdit === "dummy") {
        list.innerHTML = '';
        return;
    }
    if (typeof subtasksEdit === "string") {
        subtasksEdit = subtasksEdit.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(subtasksEdit) && subtasksEdit.length > 0) {
        subtasksEdit.forEach((subtask, i) => {
            list.innerHTML += editSubtasksHTML(subtask, i);
        });
    } else {
        list.innerHTML = '';
    }
}

/**
 * Bestätigt die Bearbeitung einer Subtask
 * @param {number} i - Index der Subtask
 */
function confirmEditSubtask(i) {
    let inputValue = document.getElementById(`input-value${i}`).value;
    let subtask = document.getElementById(`current-subtask-to-edit${i}`);
    let subtaskContent = document.getElementById(`subtask${i}`);
    let input = document.getElementById(`subtask-edit-input${i}`);
    subtask.innerHTML = `${inputValue}`;
    subtaskContent.classList.toggle('d-none');
    input.classList.toggle('d-none');
}

/**
 * Aktiviert den Bearbeitungsmodus für eine Subtask
 * @param {number} i - Index der Subtask
 * @param {string} content - Inhalt der Subtask
 */
function editCurrentSubtask(i, content) {
    let subtask = document.getElementById(`subtask${i}`);
    let input = document.getElementById(`subtask-edit-input${i}`);
    let inputValue = document.getElementById(`input-value${i}`);
    subtask.classList.toggle('d-none');
    input.classList.toggle('d-none');
    inputValue.value = `${content}`;
}

/**
 * Löscht eine Subtask im Bearbeitungsmodus
 * @param {number} i - Index der zu löschenden Subtask
 */
function deleteSubtaskEdit(i) {
    let listItem = document.getElementById(`list-${i}`);
    if (listItem) {
        listItem.remove();
    }
}

/**
 * Fügt eine neue Subtask im Bearbeitungsmodus hinzu
 */
function addNewSubTaskEdit() {
    let list = document.getElementById('subtask-edit-list');
    let subtask = document.getElementById('subtasks-edit').value;
    let i = list.childElementCount++;

    if (subtask !== "") {
        list.innerHTML += addNewSubTaskEditHTML(subtask, i);
        document.getElementById('subtasks-edit').value = '';
    } else {
        let subtaskError = document.getElementById('subtask-error-edit');
        subtaskError.style.display = 'flex';
        setTimeout(function () {
            subtaskError.style.display = "none";
        }, 3000);
    }
}