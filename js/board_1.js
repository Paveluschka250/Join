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
    contactsHTML = '';
    if (currentTask[4] != "undefined") {
        for (let i = 0; i < currentTask[4].length; i++) {
            contactsHTML += `<div class="initials-and-fullnames-container"><div class="current-task-initials" style="background-color: ${getRandomColor()}">${currentTask[4][i]}</div><div class="full-names-overlay" id="name-${i}"></div></div>`;             
        }
    } else {
        contactsHTML = `<p class="no-users-assigned">No Users assigned!</p>`;
    }
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
    overlayTaskGetFullNames(taskCounter, currentTask);
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
    if(userAmount >= 4 && currentTask[4][4] && currentTask[4][4].includes('+')) {
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
    for(i = 0; i < fullNames.length; i++){
        let initials = createInitialsForEdit([fullNames[i]]);
        div.innerHTML += `
                <div class="all-users">
                    <span><span class="all-initials" style="background-color: ${getRandomColor()}">${initials}</span><span class="all-full-names">${fullNames[i]}</span></span>
                </div>
            `
    console.log(initials, fullNames[i]);
    }
}

function extractTaskData(taskCounter) {
    const taskElement = document.getElementById(`to-do-content${taskCounter}`);
    if (!taskElement) {
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
    } catch (error) {
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