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
    closeNewSubtasksBtn()
}

function getFormData(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;

    const assignedTo = document.getElementById('assigned-to').value;
    const category = document.getElementById('category').value;

    const subtaskList = document.querySelectorAll('#subtask-content li');
    const subtasks = Array.from(subtaskList).map(li => li.textContent);

    let priority = '';
    if (document.getElementById('prio1').classList.contains('prio1-color')) {
        priority = 'Urgent';
    } else if (document.getElementById('prio2').classList.contains('prio2-color')) {
        priority = 'Medium';
    } else if (document.getElementById('prio3').classList.contains('prio3-color')) {
        priority = 'Low';
    }

    const formData = {
        title,
        description,
        dueDate,
        assignedTo,
        category,
        subtasks,
        priority
    };
    clearForm();
    console.log(formData);
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('assigned-to').selectedIndex = 0;
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('subtasks').value = '';

    const priorityButtons = document.querySelectorAll('.priority-btn-addTask');
    priorityButtons.forEach(button => {
        button.classList.remove('prio1-color', 'prio2-color', 'prio3-color');
    });

    const subtaskContent = document.getElementById('subtask-content');
    subtaskContent.innerHTML = '';

    toggleHamburgerMenu();
}
