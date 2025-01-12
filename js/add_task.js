let contacts = [];

async function getContacts() {
  let response = await fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
  let responseToJson = await response.json();
  contacts = responseToJson;
}

getContacts();

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
    prioColor1(red, orange, green, btnIcon1, btnIcon2, btnIcon3);
  } else if (prioColor === 'prio2-color') {
    prioColor2(red, orange, green, btnIcon1, btnIcon2, btnIcon3);
  } else if (prioColor === 'prio3-color') {
    prioColor3(red, orange, green, btnIcon1, btnIcon2, btnIcon3);
  }
}

function prioColor1(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
  red.classList.toggle('prio1-color');
  btnIcon1.classList.toggle('priotity-btn-filter1');
  orange.classList.remove('prio2-color');
  btnIcon2.classList.remove('priotity-btn-filter2');
  green.classList.remove('prio3-color');
  btnIcon3.classList.remove('priotity-btn-filter3');
}

function prioColor2(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
  red.classList.remove('prio1-color');
  btnIcon1.classList.remove('priotity-btn-filter1');
  orange.classList.toggle('prio2-color');
  btnIcon2.classList.toggle('priotity-btn-filter2');
  green.classList.remove('prio3-color');
  btnIcon3.classList.remove('priotity-btn-filter3');
}

function prioColor3(red, orange, green, btnIcon1, btnIcon2, btnIcon3) {
  red.classList.remove('prio1-color');
  btnIcon1.classList.remove('priotity-btn-filter1');
  orange.classList.remove('prio2-color');
  btnIcon2.classList.remove('priotity-btn-filter2');
  green.classList.toggle('prio3-color');
  btnIcon3.classList.toggle('priotity-btn-filter3');
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
  if (subTask.value !== '') {
    contentDiv.innerHTML += addSubTaskHTML(subTask);
    subTask.value = '';
    closeNewSubtasksBtn()
  } else {
    let subtaskError = document.getElementById('subtask-error-add-task');
    subtaskError.style.display = 'flex';
    setTimeout(function () {
      subtaskError.style.display = "none";
    }, 3000);
  }
}

function confirmEditSubtask(btn, subtask) {
  let currentSubtask = document.getElementById(`current-subtask-${subtask}`);
  let inputDiv = document.getElementById(`edit-${subtask}`);
  let subtaskContent = btn.closest('li').querySelector('p');

  let input = document.getElementById(`input-edit-${subtask}`).value;
  console.log(input)
  subtaskContent.innerHTML = input;
  currentSubtask.classList.remove('d-none');
  currentSubtask.classList.toggle('li-elements-overlayTask');
  inputDiv.classList.add('d-none');
  inputDiv.classList.toggle('li-elements-overlayTask');
}

function editSubtask(btn, subtask) {
  let currentSubtask = btn.closest('div');
  let inputDiv = document.getElementById(`edit-${subtask}`);
  let input = document.getElementById(`input-edit-${subtask}`);
  input.value = `${subtask}`;
  currentSubtask.classList.add('d-none');
  currentSubtask.classList.toggle('li-elements-overlayTask');
  inputDiv.classList.remove('d-none');
  inputDiv.classList.toggle('li-elements-overlayTask');
}

function deleteSubTask(buttonElement) {
  let liElement = buttonElement.closest('li');
  if (liElement) {
    liElement.remove();
  }
}

function getTaskData(event) {
  event.preventDefault();

  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  let dueDate = document.getElementById('due-date').value;
  let category = document.getElementById('category-selected').value;
  let taskCategory = { category: "toDo" };

  let selectedContactsDivs = document.querySelectorAll('#selected-contacts .contact-initials');
  let assignedTo = [];
  let fullNames = [];
  selectedContactsDivs.forEach(function (div) {
    assignedTo.push(div.textContent);
    let value = div.getAttribute('value');
    fullNames.push(value);
  });

  let priority = '';
  if (document.getElementById('priority1').classList.contains('prio1-color')) {
    priority = 'Urgent';
  } else if (document.getElementById('priority2').classList.contains('prio2-color')) {
    priority = 'Medium';
  } else if (document.getElementById('priority3').classList.contains('prio3-color')) {
    priority = 'Low';
  }

  let subtasks = [];
  let subtasksChecked = [];
  let subtaskElements = document.querySelectorAll('#subtask-content li p');
  if (subtaskElements.length > 0) {
    subtaskElements.forEach(function (subtaskElement) {
      subtasks.push(subtaskElement.textContent);
    });

    for (let i = 0; i < subtaskElements.length; i++) {
      const element = subtaskElements[i];
      let subtaskId = { "id": `subtask${i}`, "checked": false };
      subtasksChecked.push(subtaskId);
    }
  } else {
    subtasks = ['dummy'];
    subtasksChecked = ['dummy'];
  }


  let taskData = {
    title: title,
    description: description,
    dueDate: dueDate,
    assignedTo: assignedTo,
    category: category,
    priority: priority,
    subtasks: subtasks,
    subtasksChecked: subtasksChecked,
    taskCategory: taskCategory,
    fullNames: fullNames
  };

  fetch('https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/tasks/toDo.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  })
    .then(response => response.json())
    .then(data => {
      resetFormFields();
    })
    .catch(error => {
    });
    window.location.href = './board.html';
}

function resetFormFields() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('due-date').value = '';
  document.getElementById('category-selected').innerHTML = 'Select task category';
  document.getElementById('selected-contacts').innerHTML = '';
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

function getUsersToAssignedTo() {
  const namesArray = Object.values(contacts).map(item => item.name);
  let contactsDropdown = document.getElementById('contacts-dropdown');
  contactsDropdown.innerHTML = '';

  namesArray.forEach((name) => {
    if (!isContactSelected(name)) {
      const option = document.createElement('div');
      option.className = 'option';
      option.textContent = name;
      option.onclick = (e) => {
        e.stopPropagation();
        selectContacts(name);
      };
      contactsDropdown.appendChild(option);
    }
  });
}

function isContactSelected(name) {
  const selectedDivs = document.querySelectorAll('#selected-contacts .contact-initials');
  return Array.from(selectedDivs).some(div => div.getAttribute('value') === name);
}

function selectContacts(selectedValue) {
  let selectedContacts = document.getElementById('selected-contacts');

  if (selectedValue) {
    let splitName = selectedValue.split(" ");
    let initials = splitName.length > 1
      ? `${splitName[0][0].toUpperCase()}${splitName[1][0].toUpperCase()}`
      : `${splitName[0][0].toUpperCase()}`;

    selectedContacts.innerHTML += `
      <div value="${selectedValue}" class="contact-initials initials-position" style="background-color:${getRandomColor()}">
        ${initials}
      </div>`;
  }

  document.getElementById('contacts-dropdown').style.display = 'none';

  const arrow = document.querySelector('.custom-select[onclick*="contacts-dropdown"] .select-arrow');
  if (arrow) arrow.style.transform = 'translateY(-50%) rotate(0deg)';
}

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const arrow = dropdown.parentElement.querySelector('.select-arrow');

  if (dropdownId === 'contacts-dropdown' && dropdown.style.display !== 'block') {
    getUsersToAssignedTo();
  }

  const isOpen = dropdown.style.display === 'block';
  dropdown.style.display = isOpen ? 'none' : 'block';

  if (arrow) {
    arrow.style.transform = isOpen
      ? 'translateY(-50%) rotate(0deg)'
      : 'translateY(-50%) rotate(180deg)';
  }
}

function selectOption(selectId, value) {
  document.getElementById(`${selectId}-selected`).textContent = value;
  document.getElementById(`${selectId}-dropdown`).style.display = 'none';
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select-wrapper')) {
    document.querySelectorAll('.custom-select-dropdown').forEach(d => d.style.display = 'none');
  }
});

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