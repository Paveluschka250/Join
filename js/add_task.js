function getPriority(id) {
    let buttonRed = document.getElementById('priority1');
    let buttonOrange = document.getElementById('priority2');
    let buttonGreen = document.getElementById('priority3');

    if (id == 'priority1') {
        containsClass('prio1-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'priority2') {
        containsClass('prio2-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'priority3') {
        containsClass('prio3-color', buttonRed, buttonOrange, buttonGreen);
    }
}

function containsClass(prioColor, red, orange, green) {
    let btnIcon1 = document.getElementById('priority-btn1');
    let btnIcon2 = document.getElementById('priority-btn2');
    let btnIcon3 = document.getElementById('priority-btn3');

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
    document.getElementById('open-subtask').classList.add('d-none');
    document.getElementById('subtask-close-and-add').classList.remove('d-none');
}

function closeNewSubtasksBtn() {
    document.getElementById('open-subtask').classList.remove('d-none');
    document.getElementById('subtask-close-and-add').classList.add('d-none');
}

function addSubTask() {
    let subTask = document.getElementById('subtasks');
    let contentDiv = document.getElementById('subtask-content');
    
    contentDiv.innerHTML += `<li><p>${subTask.value}<p/></li>`;
    subTask.value = '';
    closeNewSubtasksBtn()
}

function getTaskData(event) {
    event.preventDefault();
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let dueDate = document.getElementById('due-date').value;
    
    let assignedTo = document.getElementById('assigned-to').value;

    let category = document.getElementById('category').value;

    let priority = '';
    if (document.getElementById('priority1').classList.contains('prio1-color')) {
        priority = 'Urgent';
    } else if (document.getElementById('priority2').classList.contains('prio2-color')) {
        priority = 'Medium';
    } else if (document.getElementById('priority3').classList.contains('prio3-color')) {
        priority = 'Low';
    }

    let subtasks = [];
    let subtaskElements = document.querySelectorAll('#subtask-content li p');
    subtaskElements.forEach(function(subtaskElement) {
        subtasks.push(subtaskElement.textContent);
    });

    let taskData = {
        title: title,
        description: description,
        dueDate: dueDate,
        assignedTo: assignedTo,
        category: category,
        priority: priority,
        subtasks: subtasks
    };

    resetFormFields();

    console.log(taskData);
}

function resetFormFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('category').value = '';

    let subtaskContent = document.getElementById('subtask-content');
    subtaskContent.innerHTML = '';

    let buttonRed = document.getElementById('priority1');
    let buttonOrange = document.getElementById('priority2');
    let buttonGreen = document.getElementById('priority3');

    buttonRed.classList.remove('prio1-color');
    buttonOrange.classList.remove('prio2-color');
    buttonGreen.classList.remove('prio3-color');

    document.getElementById('priority-btn1').classList.remove('priotity-btn-filter1');
    document.getElementById('priority-btn2').classList.remove('priotity-btn-filter2');
    document.getElementById('priority-btn3').classList.remove('priotity-btn-filter3');

    closeNewSubtasksBtn();
}