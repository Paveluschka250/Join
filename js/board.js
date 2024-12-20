let tasks = [];
let contactsForSidebar = [];
let currentDraggedElement;
let keys = [];

async function getTasks() {
    let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
    let responseToJson = await response.json();
    tasks = responseToJson;
    renderTask();
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
    if (prioColor === 'prio1-color') {
        prio1Color(red, orange, green);
    } else if (prioColor === 'prio2-color') {
        prio2Color(red, orange, green);
    } else if (prioColor === 'prio3-color') {
        prio3Color(red, orange, green);
    }
}

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

async function getFormData(event) {
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
        let value = div.getAttribute('value');
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
    await postFormDataToFireBase(formData);
    await getTasks();
}

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
        clearForm();
        await getTasks();
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
            selectedContacts.innerHTML += `<div value="${selectedValue}" class="contact-initials-sb">${initials}</div>`;
        }
    }

    let optionToDisable = assignedToSb.querySelector(`option[value="${selectedValue}"]`);

    if (optionToDisable) {
        optionToDisable.disabled = true;
    }
}

function renderTask() {
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
                let contactsHTML = '';

                if (Array.isArray(element.assignedTo)) {
                    contactsHTML = element.assignedTo
                        .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
                        .join('');
                } else {
                    contactsHTML = '';
                }
                toDoBlock.innerHTML += renderTaskHTML(element, taskCounter, prioIconURL, contactsHTML);
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
        let contactsHTML = '';

        if(Array.isArray(element.assignedTo)){
            contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');
        } else {
            contactsHTML = '';
        }
        inProgress.innerHTML += rederInProgress(element, taskCounter, prioIconURL, contactsHTML);
    }
}

function renderAwaitFeedback(taskCounter, element) {
    let awaitFeedback = document.getElementById("awaitFeedback");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = '';

        if(Array.isArray(element.assignedTo)){
            contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');
        } else {
            contactsHTML = '';
        }
        awaitFeedback.innerHTML += renderAwaitFeedbackHTML(element, taskCounter, prioIconURL, contactsHTML)
    }
}

function renderDone(taskCounter, element) {
    let done = document.getElementById("done");
    let toDo = tasks.toDo;

    if (toDo && Object.keys(toDo).length > 0) {
        let prioIconURL = getPrioIconURL(element);
        let contactsHTML = '';

        if(Array.isArray(element.assignedTo)){
            contactsHTML = element.assignedTo
            .map(initials => `<div class="task-initials" style="background-color: ${getRandomColor()}">${initials}</div>`)
            .join('');
        } else {
            contactsHTML = '';
        }
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
        currentCategory.style.backgroundColor = 'lightblue';
        currentCategory.innerHTML = 'Ticket';
        currentCategory.style.color = 'white';
    }
}