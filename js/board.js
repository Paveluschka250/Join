let tasks = [];
let contactsForSidebar = [];
let currentDraggedElement;
let keys = [];

async function getTasks() {
    let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
    let responseToJson = await response.json();
    tasks = responseToJson;
    renderAddTask();
}

async function getContactsForSidebar() {
    let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
    let responseToJson = await response.json();
    contactsForSidebar = responseToJson;
}

getContactsForSidebar();
getTasks();

function toggleHamburgerMenu() {
    document.getElementById("addtask-content").classList.toggle('hamburger-menu');
    document.getElementById('overlay-add-task-board').classList.toggle('hamburger-menu');
}

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

function containsClass(prioColor, red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon');
    let btnIcon2 = document.getElementById('medium-prio-icon');
    let btnIcon3 = document.getElementById('low-prio-icon');

    if (prioColor === 'prio1-color') {
        red.classList.toggle('prio1-color');
        btnIcon1.classList.toggle('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio2-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.toggle('prio2-color');
        btnIcon2.classList.toggle('priotity-btn-filter2');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio3-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        green.classList.toggle('prio3-color');
        btnIcon3.classList.toggle('priotity-btn-filter3');
    }
}

function addNewSubTask() {
    document.getElementById('add-subtask-btn-sb').classList.add('d-none');
    document.getElementById('subtask-buttons-sb').classList.remove('d-none');
}

function closeNewSubtasksBtn() {
    document.getElementById('add-subtask-btn-sb').classList.remove('d-none');
    document.getElementById('subtask-buttons-sb').classList.add('d-none');
}

function addSubTask() {
    let subTask = document.getElementById('subtasks');
    let contentDiv = document.getElementById('subtask-content');

    contentDiv.innerHTML += `<li><p>${subTask.value}<p/></li>`;
    subTask.value = '';
    closeNewSubtasksBtn();
}

function getFormData(event) {
    event.preventDefault();
    let taskCategory = { category: "toDo" };
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    let category = document.getElementById('category').value;

    let selectedContactsDivs = document.querySelectorAll('#selected-contacts-sb .contact-initials-sb');
    let assignedTo = [];
    let fullNames = [];
    selectedContactsDivs.forEach(function (div) {
        assignedTo.push(div.textContent);
        let value = div.getAttribute('value'); // Holt den Wert des value Attributs
        fullNames.push(value);
    });


    let subtaskList = document.querySelectorAll('#subtask-content li');
    let subtasks = [];
    let subtasksChecked = [];
    if (subtaskList.length > 0) {
    subtasks = Array.from(subtaskList).map(li => li.textContent);
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        let subtask = { "id": `subtask${i}`, "checked": false };
        subtasksChecked.push(subtask);
    }
    } else {
        subtasks = ['dummy'];
        subtasksChecked = ['dummy'];
    }

    let priority = '';
    if (document.getElementById('prio1').classList.contains('prio1-color')) {
        priority = 'Urgent';
    } else if (document.getElementById('prio2').classList.contains('prio2-color')) {
        priority = 'Medium';
    } else if (document.getElementById('prio3').classList.contains('prio3-color')) {
        priority = 'Low';
    }

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
    postFormDataToFireBase(formData);
    getTasks();
}

function postFormDataToFireBase(formData) {
    fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task successfully added:', data);
            clearForm();
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('selected-contacts-sb').innerHTML = '';
    document.getElementById('category').selectedIndex = 0;

    document.getElementById('subtask-content').innerHTML = '';
    document.querySelectorAll('.priority-btn-addTask').forEach(button => {
        button.classList.remove('prio1-color', 'prio2-color', 'prio3-color');
    });
    toggleHamburgerMenu();
}

function getUsersToAssignedTo() {
    const namesArray = Object.values(contactsForSidebar).map(item => item.name);
    let assignedToSb = document.getElementById('assigned-to-sb');
    assignedToSb.innerHTML = '';
    assignedToSb.innerHTML = `<option value="" disabled selected hidden>Select contacts to assign</option>`;
    for (let i = 0; i < namesArray.length; i++) {
        const option = document.createElement('option');
        option.value = namesArray[i];

        option.textContent = namesArray[i];
        option.setAttribute('id', `optionSb-${i}`);
        assignedToSb.appendChild(option);
    }
    assignedToSb.addEventListener('change', function () {
        selectContactsSb(assignedToSb.value);
    });
}

function selectContactsSb(selectedValue) {
    let selectedContacts = document.getElementById('selected-contacts-sb');
    let assignedToSb = document.getElementById('assigned-to-sb');

    if (selectedValue) {

        let splitName = selectedValue.split(" ");
        console.log(selectedValue);
        let initials;

        if (splitName.length > 1) {
            let firstNameInitial = splitName[0][0].toUpperCase();
            let secondNameInitial = splitName[1][0].toUpperCase();
            initials = `${firstNameInitial}${secondNameInitial}`;
        } else {
            initials = splitName[0][0].toUpperCase();
        }

        if (!Array.from(selectedContacts.children).some(div => div.textContent === initials)) {
            selectedContacts.innerHTML += `<div value="${selectedValue}" class="contact-initials-sb">${initials}</div>`;
        }
    }

    let optionToDisable = assignedToSb.querySelector(`option[value="${selectedValue}"]`);

    if (optionToDisable) {
        optionToDisable.disabled = true;
    }
}

function renderAddTask() {
    let inProgress = document.getElementById("inProgress");
    let awaitFeedback = document.getElementById("awaitFeedback");
    let done = document.getElementById("done");
    let toDoBlock = document.getElementById("to-do-block");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        inProgress.innerHTML = "";
        awaitFeedback.innerHTML = "";
        done.innerHTML = "";
        toDoBlock.innerHTML = "";

        let taskCounter = 0;
        for (let key in toDo) {
            const element = toDo[key];
            taskCounter++;
            if (element.taskCategory.category == "toDo") {
                let prioIconURL = getPrioIconURL(element);

                let contactsHTML = element.assignedTo
                    .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
                    .join('');

                toDoBlock.innerHTML += renderAddTaskHTML(element, taskCounter, prioIconURL, contactsHTML)
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
    }
    checkContentFields(toDoBlock, inProgress, awaitFeedback, done);
}

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

function renderInProgress(taskCounter, element) {
    let inProgress = document.getElementById("inProgress");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');

        inProgress.innerHTML += rederInProgress(element, taskCounter, prioIconURL, contactsHTML);
    }
}

function renderAwaitFeedback(taskCounter, element) {
    let awaitFeedback = document.getElementById("awaitFeedback");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');

        awaitFeedback.innerHTML += renderAwaitFeedbackHTML(element, taskCounter, prioIconURL, contactsHTML)
    }
}

function renderDone(taskCounter, element) {
    let done = document.getElementById("done");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');

        done.innerHTML += renderDoneHTML(element, taskCounter, prioIconURL, contactsHTML);
    }
}

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

function taskStyle(taskCounter) {
    let currentCategory = document.getElementById(`category-to-do${taskCounter}`);
    if (currentCategory.textContent === 'Technical Task') {
        currentCategory.style.backgroundColor = '#0038ff';
        currentCategory.style.color = 'white';
    } else if (currentCategory.textContent === 'User Story') {
        currentCategory.style.backgroundColor = '#ff7a00';
        currentCategory.style.color = 'white';
    } else {
        currentCategory.style.backgroundColor = 'red';
    }
}

function loadingspinner(taskCounter, element) {
    let progressBar = document.getElementById(`subtask-progress-bar-${taskCounter}`);
    let loadingbarText = document.getElementById(`subtasks-checked${taskCounter}`);
    if (element.subtasks != 'dummy') {
        let checkedSubtasks = 0;
        let allSubtasks = element.subtasks.length;
        for (let i = 0; i < allSubtasks; i++) {
            if (element.subtasksChecked[i].checked === true) {
                checkedSubtasks++;
            }
        };
        let progressPercentage = 100 / allSubtasks * checkedSubtasks;
        progressBar.style.width = `${progressPercentage}%`;
        loadingbarText.innerHTML = `
        <p class="subtask-loadingbar-text">${checkedSubtasks}/${allSubtasks}</p>
        <p class="subtask-loadingbar-text">Subtasks</p>
    `
    }
    else {
        loadingbarText.innerHTML = '<p class="subtask-loadingbar-text">No Subtasks!</p>'
    }
}

function saveCheckBoxes(taskCounter) {
    taskCounter--;
    let taskId = Object.keys(tasks.toDo);
    let allTasksKey = [];
    for (let key in taskId) {
        let element = taskId[key];
        allTasksKey.push(element)
    }

    let currentTask = tasks.toDo[allTasksKey[taskCounter]];
    let currentSubtaskAmount = currentTask.subtasks.length;
    let subtasksChecked = [];
    for (let i = 0; i < currentSubtaskAmount; i++) {
        let input = document.getElementById(`checkbox${i}`).checked;
        subtasksChecked.push(input);
        console.log(subtasksChecked);
    }
    loadCheckfieldStatusToFirebase(subtasksChecked, taskCounter);
}

async function loadCheckfieldStatusToFirebase(subtasksChecked, taskCounter) {
    const baseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/";

    let taskKeys = Object.keys(tasks.toDo);
    let taskId = taskKeys[taskCounter];

    const url = `${baseUrl}tasks/toDo/${taskId}/subtasksChecked.json`;

    let updatedSubtasks = subtasksChecked.map((isChecked, index) => ({
        checked: isChecked,
        id: `subtask${index}`
    }));

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedSubtasks)
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Aktualisieren: ${response.statusText}`);
        }

        console.log("Subtask-Checkbox-Status erfolgreich aktualisiert.");
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Subtasks:", error);
    }
}

function loadCheckFieldStatus(taskCounter) {
    taskCounter--;
    let taskId = Object.keys(tasks.toDo);
    let allTasksKey = [];
    for (let key in taskId) {
        let element = taskId[key];
        allTasksKey.push(element)
    }

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

function getRandomColor() {
    const colors = [
        '#FF5733',
        '#33FF57',
        '#3357FF',
        '#FF33A8',
        '#FFD133',
        '#33FFF0',
        '#8E44AD',
        '#E74C3C'
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function showOverlayTask(taskCounter) {
    const overlay = document.getElementById('overlay-show-task');
    const currentTask = document.getElementById('current-task');
    overlay.classList.remove('d-none');
    overlay.classList.add('overlay-show-task');
    extractTaskData(taskCounter);

    if (!currentTask.hasAttribute('data-listener-added')) {
        currentTask.addEventListener("click", function (event) {
            event.stopPropagation(); // Verhindert das Schließen des Overlays bei Klicks auf "current-to-do"
        });
        currentTask.setAttribute('data-listener-added', 'true');
    }
}

function renderOverlayTask(taskCounter, currentTask) {
    let overlayContainer = document.getElementById('current-task');

    let contactsHTML = currentTask[4]
        .map(initials => `<div class="current-task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
        .join('');

    let currentSubtasks;
    if (currentTask[9] != "dummy" && typeof currentTask[9] === 'string') {
        let currentSubtask = currentTask[9].split(",");
        currentSubtasks = currentSubtask
            .map((subtask, i) =>
                `<div class="current-subtasks-task"><input onclick="saveCheckBoxes(${taskCounter})" id="checkbox${i}" type="checkbox">${subtask}</div>`)
            .join('');
    } else {
        currentSubtasks = 'No subtasks!';
    }

    overlayContainer.innerHTML = '';
    overlayContainer.innerHTML = renderOverlayTaskHTML(currentTask, taskCounter, contactsHTML, currentSubtasks);
    
    document.getElementById('editTaskBtn').addEventListener('click', function () {
        editTask(currentTask, taskCounter);
    });
    loadCheckFieldStatus(taskCounter, currentTask);
}

function extractTaskData(taskCounter) {
    const taskElement = document.getElementById(`to-do-content${taskCounter}`);

    if (!taskElement) {
        console.error(`Task mit ID to-do-content${taskCounter} nicht gefunden.`);
        return null;
    }

    const categoryElement = taskElement.querySelector(`#category-to-do${taskCounter}`);
    const titleElement = taskElement.querySelector(`#title-task${taskCounter}`);
    const descriptionElement = taskElement.querySelector(`#description-task${taskCounter}`);
    const contactsContainer = taskElement.querySelector(`#contacts-task${taskCounter}`);
    const prioIconElement = taskElement.querySelector('.task-prio-icon');
    const dueDateElement = taskElement.querySelector(`#set-due-date${taskCounter}`);
    const fullNameElement = taskElement.querySelector(`#set-full-name${taskCounter}`);
    const priorityElement = taskElement.querySelector(`#set-priority${taskCounter}`);
    const subtasksElement = taskElement.querySelector(`#set-subtasks${taskCounter}`)

    const category = categoryElement ? categoryElement.textContent.trim() : null;
    const title = titleElement ? titleElement.textContent.trim() : null;
    const description = descriptionElement ? descriptionElement.textContent.trim() : null;
    const dueDate = dueDateElement ? dueDateElement.textContent.trim() : null;
    const fullName = fullNameElement ? fullNameElement.textContent.trim() : null;
    const priority = priorityElement ? priorityElement.textContent.trim() : null;
    const subtasks = subtasksElement ? subtasksElement.textContent.trim() : null;

    const contactsHTML = [];
    if (contactsContainer) {
        const contactDivs = contactsContainer.querySelectorAll('div');
        contactDivs.forEach(contactDiv => {
            contactsHTML.push(contactDiv.innerHTML.trim());
        });
    }

    const prioIcon = prioIconElement ? prioIconElement.src : null;

    let currentTask = [];
    currentTask.push(
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
    );
    renderOverlayTask(taskCounter, currentTask);
}

function closeCurrentTask() {
    const overlay = document.getElementById('overlay-show-task');
    overlay.classList.remove('overlay-show-task');
    overlay.classList.add('d-none');
    getTasks();
}

async function deleteTask(taskId) {
    taskId--;
    let currentTask = Object.keys(tasks.toDo);

    if (tasks.toDo && tasks.toDo[currentTask[taskId]]) {
        delete tasks.toDo[currentTask[taskId]];
    } else {
        console.log(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }

    try {
        const response = await fetch(`https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo/${currentTask[taskId]}.json`, {
            method: 'DELETE',
        });

        if (response.ok) {
            renderAddTask();
        } else {
            console.error('Fehler beim Löschen des Tasks aus der Datenbank:', response.statusText);
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Tasks:', error);
    }
    closeCurrentTask();
}

function startDragging(id) {
    id--;
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

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

        console.log('Task successfully moved to category:', category);

    } catch (error) {
        console.error('Error moving task:', error);
    }
    getTasks()
}

function filterTasks() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    if (searchValue) {
        let hasMatches = false;
        for (const taskKeys in tasks) {
            for (const taskId in tasks[taskKeys]) {
                const task = tasks[taskKeys][taskId];
                const titleMatch = task.title.toLowerCase().includes(searchValue);
                const descriptionMatch = task.description && task.description.toLowerCase().includes(searchValue);

                if (titleMatch || descriptionMatch) {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.innerHTML = `<strong>${task.title}</strong><br><small>${task.description}</small>`;
                    suggestionItem.onclick = () => getTaskId(task, suggestionsContainer);
                    suggestionsContainer.appendChild(suggestionItem);
                    hasMatches = true;
                }
            }
        }

        if (!hasMatches) {
            const noResults = document.createElement('div');
            noResults.className = 'suggestion-item';
            noResults.innerText = 'Keine Ergebnisse gefunden';
            suggestionsContainer.appendChild(noResults);
        }

        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }

    document.addEventListener('click', function(event) {
        const isClickInside = suggestionsContainer.contains(event.target) || 
                              document.getElementById('search-input').contains(event.target);
        
                              if (!isClickInside) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

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

function getKeysFromTasks() {
    let taskKeys = Object.keys(tasks.toDo);
    keys = taskKeys;
}

function editTask(currentTask, taskCounter) {
    renderEditTask();
    editCurrentTask(currentTask, taskCounter);
    document.getElementById('saveEditBtn').addEventListener("click", () => {
        saveEditBtn(taskCounter);        
    });
}

function renderEditTask() {
    let taskOverlay = document.getElementById("current-to-do");
    taskOverlay.innerHTML = '';
    taskOverlay.innerHTML = renderEditTaskHTML();
}

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

function containsClassEdit(prioColor, red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');

    if (prioColor === 'prio1-color') {
        red.classList.toggle('prio1-color');
        btnIcon1.classList.toggle('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        btnIcon2.classList.remove('prio2-icon-color');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio2-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.toggle('prio2-color');
        btnIcon2.classList.toggle('priotity-btn-filter2');
        btnIcon2.classList.toggle('prio2-icon-color');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio3-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        btnIcon2.classList.remove('prio2-icon-color');
        green.classList.toggle('prio3-color');
        btnIcon3.classList.toggle('priotity-btn-filter3');
    }
}

function editCurrentTask(currentTask, taskCounter) {
    taskCounter--;
    document.getElementById('title-edit').value = `${currentTask[2]}`;
    document.getElementById('description-edit').value = `${currentTask[3]}`;
    document.getElementById('due-date-edit').value = `${currentTask[6]}`;
    editPriorityBtn(currentTask);

    loadContactsEdit();
    let assignedContacts = document.getElementById('selected-contacts-sb-edit');
    let contacts = currentTask[4];

    getKeysFromTasks();
    let fullNames = tasks.toDo[keys[taskCounter]].fullNames;
    if (contacts !== undefined) {
        for (let i = 0; i < contacts.length; i++) {
            const element = contacts[i];
            assignedContacts.innerHTML += `
                <div class="current-task-initials" value="${fullNames[i]}" style="background-color: ${getRandomColor()}">${element}</div>
            `;
        }
    } else {
        assignedContacts.innerHTML = '';
    }

    document.getElementById('category-edit').value = `${currentTask[1]}`;
    editSubtasks(currentTask);
}

function editPriorityBtn(currentTask) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');
    let red = document.getElementById('prio1-edit');
    let orange = document.getElementById('prio2-edit');
    let green = document.getElementById('prio3-edit');
    if (currentTask[8] === 'Urgent') {
        red.classList.add('prio1-color');
        btnIcon1.classList.add('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        btnIcon2.classList.remove('prio2-icon-color');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (currentTask[8] === 'Medium') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.add('prio2-color');
        btnIcon2.classList.add('priotity-btn-filter2');
        btnIcon2.classList.add('prio2-icon-color');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (currentTask[8] === 'Low') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        btnIcon2.classList.remove('prio2-icon-color');
        green.classList.add('prio3-color');
        btnIcon3.classList.add('priotity-btn-filter3');
    } else {
        return currentTask;
    }
}

function loadContactsEdit() {
    const namesArray = Object.values(contactsForSidebar).map(item => item.name);
    let assignedToSbEdit = document.getElementById('assigned-to-sb-edit');
    assignedToSbEdit.innerHTML = `<option value="" disabled selected hidden>Select contacts to assign</option>`;
    for (let i = 0; i < namesArray.length; i++) {
        const option = document.createElement('option');
        option.value = namesArray[i];
        option.textContent = namesArray[i];
        option.setAttribute('id', `optionSbEdit-${i}`);
        assignedToSbEdit.appendChild(option);
    }
    assignedToSbEdit.addEventListener('change', function () {
        selectContactsSbEdit(assignedToSbEdit.value);
    });
}

function selectContactsSbEdit(selectedValue) {
    let selectedContacts = document.getElementById('selected-contacts-sb-edit');
    let assignedToSb = document.getElementById('assigned-to-sb-edit');
    if (selectedValue) {

        let splitName = selectedValue.split(" ");
        let initials;

        if (splitName.length > 1) {
            let firstNameInitial = splitName[0][0].toUpperCase();
            let secondNameInitial = splitName[1][0].toUpperCase();
            initials = `${firstNameInitial}${secondNameInitial}`;
        } else {
            initials = splitName[0][0].toUpperCase();
        }

        if (!Array.from(selectedContacts.children).some(div => div.textContent === initials)) {
            selectedContacts.innerHTML += `<div class="current-task-initials" value="${selectedValue}" style="background-color: ${getRandomColor()}">${initials}</div>`;
        }
    }

    let optionToDisable = assignedToSb.querySelector(`option[value="${selectedValue}"]`);
    if (optionToDisable && optionToDisable.disabled === false) {
        optionToDisable.disabled = true;
    }
}

function editSubtasks(currentTask) {
    let subtasksEdit = currentTask[9];
    let list = document.getElementById('subtask-edit-list');
    list.innerHTML = '';

    if (!subtasksEdit || subtasksEdit === "dummy") {
        list.innerHTML = '';
        return;
    }

    if (typeof subtasksEdit === "string") {
        subtasksEdit = subtasksEdit.split(',').map(s => s.trim()).filter(Boolean); // Leerzeichen entfernen, leere Einträge filtern
    }

    if (Array.isArray(subtasksEdit) && subtasksEdit.length > 0) {
        subtasksEdit.forEach((subtask, i) => {
            let li = document.createElement('li');

            let text = document.createTextNode(subtask);
            li.appendChild(text);
            li.setAttribute('id', `list${i}`);

            let img = document.createElement('img');
            img.src = '../assets/icons/delete.svg';
            img.alt = 'Icon';
            img.style.width = '12px';
            img.style.height = '12px';
            img.addEventListener('click', () => deleteSubtaskEdit(i));

            li.appendChild(img);
            list.appendChild(li);
        });
    } else {
        list.innerHTML = '';
    }
}

function deleteSubtaskEdit(i) {
    let listItem = document.getElementById(`list${i}`);
    if (listItem) {
        listItem.remove();
    }
}

function addNewSubTaskEdit() {
    let list = document.getElementById('subtask-edit-list');
    let input = document.getElementById('subtasks-edit').value;
    let amount = list.childElementCount;

    let li = document.createElement('li');

    let text = document.createTextNode(input);
    li.appendChild(text);
    li.setAttribute('id', `list${amount}`);

    let img = document.createElement('img');
    img.src = '../assets/icons/delete.svg';
    img.alt = 'Icon';
    img.style.width = '12px';
    img.style.height = '12px';
    img.addEventListener('click', () => deleteSubtaskEdit(amount));

    li.appendChild(img);
    list.appendChild(li)
    document.getElementById('subtasks-edit').value = '';
}

function saveEditBtn(taskCounter) {
    taskCounter--;
    getKeysFromTasks();
    let currentTaskKey = keys[taskCounter];    
    getDataFromEdit(currentTaskKey);
    closeCurrentTask();
    renderAddTask();
}

function getDataFromEdit(key) {
    let currentStatus = tasks.toDo[key].taskCategory.category;

    let taskCategory = { category: currentStatus };
    let title = document.getElementById('title-edit').value;
    let description = document.getElementById('description-edit').value;
    let dueDate = document.getElementById('due-date-edit').value;
    let category = document.getElementById('category-edit').value;
    
    let selectedContactsDivs = document.querySelectorAll('#selected-contacts-sb-edit .current-task-initials');
    let assignedTo = [];
    let fullNames = [];
    selectedContactsDivs.forEach(function (div) {
        assignedTo.push(div.textContent);
        let value = div.getAttribute('value');
        fullNames.push(value);
    });

    let subtasks = [];
    let subtasksChecked = [];

    let subtaskList = document.querySelectorAll('#subtask-edit-content li');
    if (subtaskList.length > 0) {
        subtasks = Array.from(subtaskList).map(li => li.textContent);

        for (let i = 0; i < subtasks.length; i++) {
            let subtaskStatus = tasks.toDo[key].subtasksChecked[i] ? tasks.toDo[key].subtasksChecked[i].checked : false;
            let subtask = { "id": `subtask${i}`, "checked": subtaskStatus };
            subtasksChecked.push(subtask);
        }
    } else {
        subtasks = ['dummy'];
        subtasksChecked = ['dummy'];
    }

    let priority = getPriorityToEdit();

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
    editToFirebase(formData, key)
}

function selectedContactsEdit() {

    return [assignedTo, fullNames]
}

function editToFirebase(formData, key) {
    const firebaseURL = `https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo/${key}.json`;

    fetch(firebaseURL, {
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
        .then(data => {
            console.log('Daten erfolgreich aktualisiert:', data);
        })
        .catch(error => {
            console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        });
}

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