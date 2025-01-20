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

    if (currentTask[1] !== 'Ticket') {
        document.getElementById('category-edit').value = `${currentTask[1]}`;
    } else {
        document.getElementById('category-edit').value = '';
    }
    editSubtasks(currentTask);
}

function editAssignedContacts(currentTask, taskCounter) {
    let assignedContacts = document.getElementById('added-users-container');
    let contacts = currentTask[7].split(",");
    getKeysFromTasks();
    let fullNames = tasks.toDo[keys[taskCounter]].fullNames;
    
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
    
    assignedContacts.addEventListener('click', function () {
        deleteUsersEdit(assignedContacts);
    });
}

function deleteUsersEdit(assignedContacts) {
    assignedContacts.innerHTML = '';
    const checkboxes = document.querySelectorAll('#user-select input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

function editPriorityBtn(currentTask) {
    let btnIcon1 = document.getElementById('high-prio-icon-edit');
    let btnIcon2 = document.getElementById('medium-prio-icon-edit');
    let btnIcon3 = document.getElementById('low-prio-icon-edit');
    let red = document.getElementById('prio1-edit');
    let orange = document.getElementById('prio2-edit');
    let green = document.getElementById('prio3-edit');
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

function urgentEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    red.classList.add('prio1-color');
    btnIcon1.classList.add('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    btnIcon2.classList.remove('prio2-icon-color');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

function mediumEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.add('prio2-color');
    btnIcon2.classList.add('priotity-btn-filter2');
    btnIcon2.classList.add('prio2-icon-color');
    green.classList.remove('prio3-color');
    btnIcon3.classList.remove('priotity-btn-filter3');
}

function lowEdit(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
    red.classList.remove('prio1-color');
    btnIcon1.classList.remove('priotity-btn-filter1');
    orange.classList.remove('prio2-color');
    btnIcon2.classList.remove('priotity-btn-filter2');
    btnIcon2.classList.remove('prio2-icon-color');
    green.classList.add('prio3-color');
    btnIcon3.classList.add('priotity-btn-filter3');
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

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

function loadContactsToEdit() {
    const namesArray = Object.values(contactsForSidebar).map(item => item.name);
    let userSelect = document.getElementById('user-select');
    userSelect.innerHTML = '';

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

function editSubtasks(currentTask) {
    let subtasksEdit = currentTask[9];
    let list = document.getElementById('subtask-edit-list');
    list.innerHTML = '';
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

function confirmEditSubtask(i) {
    let inputValue = document.getElementById(`input-value${i}`).value;
    let subtask = document.getElementById(`current-subtask-to-edit${i}`);
    let subtaskContent = document.getElementById(`subtask${i}`);
    let input = document.getElementById(`subtask-edit-input${i}`);
    subtask.innerHTML = `${inputValue}`;
    subtaskContent.classList.toggle('d-none');
    input.classList.toggle('d-none');
}

function editCurrentSubtask(i, content) {
    let subtask = document.getElementById(`subtask${i}`);
    let input = document.getElementById(`subtask-edit-input${i}`);
    let inputValue = document.getElementById(`input-value${i}`);
    subtask.classList.toggle('d-none');
    input.classList.toggle('d-none');
    inputValue.value = `${content}`;
}

function deleteSubtaskEdit(i) {
    let listItem = document.getElementById(`list-${i}`);
    if (listItem) {
        listItem.remove();
    }
}

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

async function saveEditBtn(taskCounter) {
    taskCounter--;
    getKeysFromTasks();
    let currentTaskKey = keys[taskCounter];
    await getDataFromEdit(currentTaskKey);
    closeCurrentTask();
    await getTasks();
}

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

    editToFirebase(formData, key);
    await getTasks();
}

function extractTaskInfo(key) {
    let currentStatus = tasks.toDo[key].taskCategory.category;
    let title = document.getElementById('title-edit').value;
    let description = document.getElementById('description-edit').value;
    let dueDate = document.getElementById('due-date-edit').value;
    let category = document.getElementById('category-edit').value;
    return { currentStatus, title, description, dueDate, category };
}

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

function getSubtasksUnchanged(key) {
    let subtasks = [];
    let subtasksChecked = [];
    let subtaskList = document.querySelectorAll('#subtask-edit-content p');
    if (subtaskList.length > 0) {
        subtasks = Array.from(subtaskList).map(li => li.textContent);
        for (let i = 0; i < subtasks.length; i++) {
            let subtaskStatus = tasks.toDo[key].subtasksChecked[i]
                ? tasks.toDo[key].subtasksChecked[i].checked
                : false;
            let subtask = { "id": `subtask${i}`, "checked": subtaskStatus };
            subtasksChecked.push(subtask);
        }
    } else {
        subtasks = ['dummy'];
        subtasksChecked = ['dummy'];
    }
    return { subtasks, subtasksChecked };
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
        .catch(error => {
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

function taskMoveToMenu(taskCounter, event) {
    if (event && event.type !== 'drag') {
        event.stopPropagation();
    }
    let currentTask = document.getElementById(`to-do-content${taskCounter}`);
    currentTask.innerHTML = "";
    currentTask.innerHTML = taskMoveToMenuHTML(taskCounter);
}

async function moveToCategory(taskCounter, category, event) {
    event.stopPropagation();
    taskCounter--;
    try {
        let taskKey = Object.keys(tasks.toDo)[taskCounter];
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
    await closeMoveTo(event);
}

async function closeMoveTo(event) {
    event.stopPropagation();
    await getTasks();
}