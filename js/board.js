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
        red.classList.add('prio1-color');
        btnIcon1.classList.add('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio2-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.add('prio2-color');
        btnIcon2.classList.add('priotity-btn-filter2');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio3-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        green.classList.add('prio3-color');
        btnIcon3.classList.add('priotity-btn-filter3');
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
    selectedContactsDivs.forEach(function (div) {
        assignedTo.push(div.textContent);
    });

    let subtaskList = document.querySelectorAll('#subtask-content li');
    let subtasks = Array.from(subtaskList).map(li => li.textContent);

    let subtasksChecked = [];
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        let subtask = { "id": `subtask${i}`, "checked": false };
        subtasksChecked.push(subtask);
    }
    console.log(subtasksChecked);

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
        taskCategory
    };
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
    getTasks();
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
        let initials;

        if (splitName.length > 1) {
            let firstNameInitial = splitName[0][0].toUpperCase();
            let secondNameInitial = splitName[1][0].toUpperCase();
            initials = `${firstNameInitial}${secondNameInitial}`;
        } else {
            initials = splitName[0][0].toUpperCase();
        }

        if (!Array.from(selectedContacts.children).some(div => div.textContent === initials)) {
            selectedContacts.innerHTML += `<div class="contact-initials-sb">${initials}</div>`;
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

    let toDoContent = document.getElementById("to-do");
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
                let prioIconURL;
                if (element.priority === 'Urgent') {
                    prioIconURL = '../assets/icons/PriorityUrgentRed.png';
                } else if (element.priority === 'Medium') {
                    prioIconURL = '../assets/icons/PriorityMediumOrange.png';
                } else if (element.priority === 'Low') {
                    prioIconURL = '../assets/icons/PriorityLowGreen.png';
                }

                let contactsHTML = element.assignedTo
                    .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
                    .join('');

                toDoBlock.innerHTML += `
                <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
                    <div id="category-to-do${taskCounter}" class="category-to-do">${element.category}</div>
                    <h4 id="title-task${taskCounter}" class="title-task">${element.title}</h4>
                    <p id="description-task${taskCounter}" class="description-task">${element.description}</p>
                     
                    <div class="task-subtask-container">    
                        <div class="subtask-progress-container">
                            <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                            </div>
                        </div>
                        <div>    
                            <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                            </div>
                        </div>
                    </div>

                    <div class="task-user-prioIcon">    
                        <div>
                            <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                        </div>
                        <div>
                            <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                        </div>
                    </div>
                    <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
                    <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
                    <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
                    <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
                </div>
            `;
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

        let prioIconURL;
        if (element.priority === 'Urgent') {
            prioIconURL = '../assets/icons/PriorityUrgentRed.png';
        } else if (element.priority === 'Medium') {
            prioIconURL = '../assets/icons/PriorityMediumOrange.png';
        } else if (element.priority === 'Low') {
            prioIconURL = '../assets/icons/PriorityLowGreen.png';
        }

        let contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');

        inProgress.innerHTML += `
        <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do">${element.category}</div>
            <h4 id="title-task${taskCounter}" class="title-task">${element.title}</h4>
            <p id="description-task${taskCounter}" class="description-task">${element.description}</p>
             
            <div class="task-subtask-container">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>
    `;
    }
}

function renderAwaitFeedback(taskCounter, element) {
    let awaitFeedback = document.getElementById("awaitFeedback");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {

        let prioIconURL;
        if (element.priority === 'Urgent') {
            prioIconURL = '../assets/icons/PriorityUrgentRed.png';
        } else if (element.priority === 'Medium') {
            prioIconURL = '../assets/icons/PriorityMediumOrange.png';
        } else if (element.priority === 'Low') {
            prioIconURL = '../assets/icons/PriorityLowGreen.png';
        }

        let contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');

        awaitFeedback.innerHTML += `
        <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do">${element.category}</div>
            <h4 id="title-task${taskCounter}" class="title-task">${element.title}</h4>
            <p id="description-task${taskCounter}" class="description-task">${element.description}</p>
             
            <div class="task-subtask-container">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>
    `;
    }
}

function renderDone(taskCounter, element) {
    let done = document.getElementById("done");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {

        let prioIconURL;
        if (element.priority === 'Urgent') {
            prioIconURL = '../assets/icons/PriorityUrgentRed.png';
        } else if (element.priority === 'Medium') {
            prioIconURL = '../assets/icons/PriorityMediumOrange.png';
        } else if (element.priority === 'Low') {
            prioIconURL = '../assets/icons/PriorityLowGreen.png';
        }

        let contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');

        done.innerHTML += `
        <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do">${element.category}</div>
            <h4 id="title-task${taskCounter}" class="title-task">${element.title}</h4>
            <p id="description-task${taskCounter}" class="description-task">${element.description}</p>
             
            <div class="task-subtask-container">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>`
            ;
    }
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
    if (element.subtasks) {
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
    if (currentTask <= 0) {
        let currentSubtaskAmount = currentTask.subtasks.length;
        console.log(currentTask.subtasksChecked);

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
    document.getElementById('overlay-show-task').classList.remove('d-none');
    document.getElementById('overlay-show-task').classList.add('overlay-show-task');
    extractTaskData(taskCounter);

    document.getElementById('current-to-do').addEventListener("click", function (event) {
        event.stopPropagation();
    })
}

function renderOverlayTask(taskCounter, currentTask) {
    console.log(taskCounter, currentTask);
    let overlayContainer = document.getElementById('current-task');

    let contactsHTML = currentTask[4]
        .map(initials => `<div class="current-task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
        .join('');

    let currentSubtasks;
    if (currentTask.subtasks) {
        let currentSubtask = currentTask[9].split(",");
        currentSubtasks = currentSubtask
            .map((subtask, i) => `<div class="current-subtasks-task"><input onclick="saveCheckBoxes(${taskCounter})" id="checkbox${i}" type="checkbox">${subtask}</div>`)
            .join('');
    } else {
        currentSubtasks = 'No subtasks!';
    }

    overlayContainer.innerHTML = '';
    overlayContainer.innerHTML = `
                <div class="current-to-do-content" id="current-to-do">
                    <div class="current-task-header">
                        <div id="current-category-to-do" class="current-category-to-do">${currentTask[1]}</div>
                        <img onclick="closeCurrentTask()" src="../assets/icons/clearIcon.svg" class="current-task-close-btn">
                    </div>
                    <h4 id="current-title-task" class="current-title-task">${currentTask[2]}</h4>
                    <p id="current-description-task" class="current-description-task">${currentTask[3]}</p>
                     <div>
                        <p><b>Due Date: </b>${currentTask[6]} </p>
                    </div>

                    <div>    
                        <div class="current-task-priority">
                            <p><b>Priority:</b> ${currentTask[8]}</p>
                            <img class="task-prio-icon" src="${currentTask[5]}" alt="Priority Icon">
                        </div>    
                        <div>
                            <div><b>Assigned To:</b> </div>
                            <div id="current-contacts-task${taskCounter}" class="current-contacts-task-container">${contactsHTML}</div>
                        </div>
                    </div>
                    
                    <div>
                        <b>Subtasks</b>
                        <ul id="current-subtasks-task${taskCounter}">${currentSubtasks}</ul>
                    </div>

                    <div class="delete-and-edit-task">
                        <div class="" onclick="deleteTask(${taskCounter})"><img src="../assets/icons/delete.svg"><p>delete</p></div> | <div class="" onclick=""><img src="../assets/icons/edit.svg"><p>edit</p></div>
                    </div>
                </div>
            `;
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
    const prioIconElement = taskElement.querySelector('.task-prio-icon'); // Hier wird das Priority Icon abgerufen
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
    document.getElementById('overlay-show-task').classList.remove('overlay-show-task');
    document.getElementById('overlay-show-task').classList.add('d-none');
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
                    suggestionItem.onclick = () => getTaskId(task, suggestionsContainer);  // Call showOverlayAddTask with taskId
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

