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

function forLoopCheckedSubtasks(allSubtasks, checkedSubtasks, element) {
    for (let i = 0; i < allSubtasks; i++) {
        if (element.subtasksChecked[i].checked === true) {
            checkedSubtasks++;
        }
    };
    return checkedSubtasks;
}

function progressPercentage(allSubtasks, checkedSubtasks, loadingbarText, progressBar) {
    let progressPercentage = 100 / allSubtasks * checkedSubtasks;
    progressBar.style.width = `${progressPercentage}%`;
    loadingbarText.innerHTML = `
    <p class="subtask-loadingbar-text">${checkedSubtasks}/${allSubtasks}</p>
    <p class="subtask-loadingbar-text">Subtasks</p>
`
}

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
    }
}

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

function getAllKeysForLoop(taskId, allTasksKey) {
    for (let key in taskId) {
        let element = taskId[key];
        allTasksKey.push(element)
    }
    return allTasksKey;
}

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

function moreUsers(userAmount, currentTask, taskCounter) {
    if (userAmount >= 4 && currentTask[4][4] && currentTask[4][4].includes('+')) {
        let initial = document.getElementById(`name-${4}`);
        initial.innerHTML = `<div id="more-users">weitere</div>`;
        initial.addEventListener('click', function () {
            showAllUsers(currentTask, taskCounter)
        })
    }
}

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

function getTaskElement(taskCounter) {
    return document.getElementById(`to-do-content${taskCounter}`);
}

function extractTextContent(taskElement, selector) {
    const element = taskElement.querySelector(selector);
    return element ? element.textContent.trim() : null;
}

function extractPrioIcon(taskElement) {
    const prioIconElement = taskElement.querySelector('.task-prio-icon');
    return prioIconElement ? prioIconElement.src : null;
}

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

async function closeCurrentTask() {
    const overlay = document.getElementById('overlay-show-task');
    overlay.classList.remove('overlay-show-task');
    overlay.classList.add('d-none');
    await getTasks();
}

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
    }
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
    } catch (error) {
    }
    getTasks()
}

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

function getSearchInputValue() {
    return document.getElementById('search-input').value.toLowerCase();
}

function clearSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    return suggestionsContainer;
}

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

function taskMatchesSearch(task, searchValue) {
    const titleMatch = task.title.toLowerCase().includes(searchValue);
    const descriptionMatch = task.description && task.description.toLowerCase().includes(searchValue);
    return titleMatch || descriptionMatch;
}

function createSuggestionItem(task, suggestionsContainer) {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `<strong>${task.title}</strong><br><small>${task.description}</small>`;
    suggestionItem.onclick = () => getTaskId(task, suggestionsContainer);
    suggestionsContainer.appendChild(suggestionItem);
}

function displayNoResults(suggestionsContainer) {
    const noResults = document.createElement('div');
    noResults.className = 'suggestion-item';
    noResults.innerText = 'Keine Ergebnisse gefunden';
    suggestionsContainer.appendChild(noResults);
}

function addClickOutsideListener(suggestionsContainer) {
    document.addEventListener('click', function (event) {
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
    loadContactsToEdit()
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
    if (prioColor === 'prio1-color') {
        prio1ColorEdit(red, orange, green);
    } else if (prioColor === 'prio2-color') {
        prio2ColorEdit(red, orange, green)
    } else if (prioColor === 'prio3-color') {
        prio3ColorEdit(red, orange, green)
    }
}

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