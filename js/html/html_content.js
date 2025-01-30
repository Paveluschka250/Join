function renderTaskHTML(element, taskCounter, prioIconURL, contactsHTML) {
    return `
        <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do margin-8px">${element.category}</div>
                <h4 id="title-task${taskCounter}" class="title-task margin-8px">${element.title}</h4>
                <p id="description-task${taskCounter}" class="description-task margin-8px">${element.description}</p>               
            <div class="task-subtask-container margin-8px">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon margin-8px">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="responsive-btn">
                <button onclick="taskMoveToMenu(${taskCounter}, event)">move to</button>
            </div>
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>
    `
}

function rederInProgress(element, taskCounter, prioIconURL, contactsHTML) {
    return         `
        <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do margin-8px">${element.category}</div>
            <h4 id="title-task${taskCounter}" class="title-task margin-8px">${element.title}</h4>
            <p id="description-task${taskCounter}" class="description-task margin-8px">${element.description}</p>

            <div class="task-subtask-container margin-8px">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon margin-8px">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="responsive-btn">
                <button onclick="taskMoveToMenu(${taskCounter}, event)">move to</button>
            </div>
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>
    `
}

function renderAwaitFeedbackHTML(element, taskCounter, prioIconURL, contactsHTML) {
    return `
        <div draggable="true" ondragstart="startDragging(${taskCounter})" onclick="showOverlayTask(${taskCounter})" class="to-do-content" id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do margin-8px">${element.category}</div>
            <h4 id="title-task${taskCounter}" class="title-task margin-8px">${element.title}</h4>
            <p id="description-task${taskCounter}" class="description-task margin-8px">${element.description}</p>
             
            <div class="task-subtask-container margin-8px">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon margin-8px">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="responsive-btn">
                <button onclick="taskMoveToMenu(${taskCounter}, event)">move to</button>
            </div>            
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>
    `
}

function renderDoneHTML(element, taskCounter, prioIconURL, contactsHTML) {
    return `
        <div draggable="true"
        ondragstart="startDragging(${taskCounter})" 
        onclick="showOverlayTask(${taskCounter})" 
        class="to-do-content" 
        id="to-do-content${taskCounter}">
            <div id="category-to-do${taskCounter}" class="category-to-do margin-8px">${element.category}</div>
            <h4 id="title-task${taskCounter}" class="title-task margin-8px">${element.title}</h4>
            <p id="description-task${taskCounter}" class="description-task margin-8px">${element.description}</p>
             
            <div class="task-subtask-container margin-8px">    
                <div class="subtask-progress-container">
                    <div class="subtask-progress-bar" id="subtask-progress-bar-${taskCounter}">
                    </div>
                </div>
                <div>    
                    <div class="task-subtask-amount" id="subtasks-checked${taskCounter}">
                    </div>
                </div>
            </div>

            <div class="task-user-prioIcon margin-8px">    
                <div>
                    <div id="contacts-task${taskCounter}" class="contacts-task-container">${contactsHTML}</div>
                </div>
                <div>
                    <img class="task-prio-icon" id="task-prio-icon${taskCounter}" src="${prioIconURL}" alt="Priority Icon">
                </div>
            </div>
            <div class="responsive-btn">
                <button onclick="taskMoveToMenu(${taskCounter}, event)">move to</button>
            </div>
            <div class="d-none" id="set-full-name${taskCounter}">${element.assignedTo}</div>
            <div class="d-none" id="set-due-date${taskCounter}">${element.dueDate}</div>
            <div class="d-none" id="set-priority${taskCounter}">${element.priority}</div>
            <div class="d-none" id="set-subtasks${taskCounter}">${element.subtasks}</div>
        </div>
    `
}

function renderOverlayTaskHTML (currentTask, taskCounter, contactsHTML, currentSubtasks) {
    return `
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

            <div class="subtask-container-overlay-board">
                <b>Subtasks</b>
                <ul id="current-subtasks-task${taskCounter}">${currentSubtasks}</ul>
            </div>
            <div class="flex-grow">
            <div class="delete-and-edit-task">
                <div class="" onclick="deleteTask(${taskCounter})"><img src="../assets/icons/delete.svg"><p>delete</p></div> | 
                <div id="editTaskBtn"><img src="../assets/icons/edit.svg"><p>edit</p></div>
            </div>
            </div>
        </div>
    `
}

function renderEditTaskHTML () {
    return `
        <form>
            <div class="editTaskContainer">
                <div class="form-group-addTask-edit titleEdit">
                    <input class="underline-addTask input-addTask cursor-pointer" type="text" id="title-edit"
                        name="title" placeholder="Enter a title" required>
                </div>

                <div class="form-group-addTask-edit description-edit m-b-8px">
                    <label for="description"><b>Description</b></label>
                    <textarea class="input-addTask cursor-pointer" id="description-edit" name="description" rows="4"
                        placeholder="Enter a Description" required></textarea>
                </div>

                <div class="form-group-addTask-edit due-date-edit m-b-8px">
                    <label for="due-date"><b>Due date</b></label>
                    <input class="underline-addTask input-addTask cursor-pointer" type="date" id="due-date-edit"
                        name="due-date">
                </div>

                <div class="form-group-addTask-edit priority-addTask m-b-8px">
                    <div class="m-b-8px">
                        <label><b>Priority</b></label>
                    </div>
                    <div class="buttons-row m-b-8px edit-buttons">
                        <button id="prio1-edit" onclick="getPriorityEdit('prio1-edit')" type="button"
                            class="prio-buttons-edit priority-btn-addTask urgent-addTask center-button">Urgent <img
                                id="high-prio-icon-edit" src="../assets/icons/prio3.svg"
                                alt="priorität hoch"></button>
                        <button id="prio2-edit" onclick="getPriorityEdit('prio2-edit')" type="button"
                                class="prio-buttons-edit priority-btn-addTask medium-addTask center-button">Medium <img
                                src="../assets/icons/PriorityMediumOrange.png" alt="priorität mittel" id="medium-prio-icon-edit"
                                class="medium-prio-icon"></button>
                        <button id="prio3-edit" onclick="getPriorityEdit('prio3-edit')" type="button"
                            class="prio-buttons-edit priority-btn-addTask low-addTask center-button">Low <img id="low-prio-icon-edit"
                                src="../assets/icons/prio1.svg" alt="priorität niedrig"></button>
                    </div>
                </div>

                <div class="dropdown">
                    <div><b>Assigned to</b> (optional)</div>
                    <button type="button" id="dropdown-button" onclick="toggleDropdown()">Select contacts to assign
                    <img class="assigned-to-edit-icon" src="../assets/icons/add.svg"></button>
                    <div id="dropdown-menu" class="dropdown-menu" style="display: none;">
                        <div id="user-select" multiple onchange="handleUserSelection()"> 
                        </div>
                    </div>
                </div>
                <div id="added-users-container">
                    <!-- Task und Benutzer werden hier angezeigt -->
                </div>

                <div class="form-group-addTask-edit m-b-16px category-edit">
                    <label for="category"><b>Category</b></label>
                    <select class="category-input-edit cursor-pointer" id="category-edit" name="category">
                        <option value="">Select task category</option>
                        <option value="Technical Task">Technical Task</option>
                        <option value="User Story">User Story</option>
                    </select>
                </div>

                <div class="form-group-addTask-edit subtask-edit new-task-btn m-b-8px">
                    <label for="subtasks"><b>Subtasks</b> (optional)</label>
                    <input class="underline-addTask input-addTask add-icon cursor-pointer" type="text"
                        id="subtasks-edit" name="subtasks-edit" placeholder="Add new subtask">
                    <button type="button" id="add-subtask-btn-sb-edit" class="create-new-task"
                        onclick="addNewSubTaskEdit()"><img src="../assets/icons/add.svg" alt="add"></button>
                </div>
                <div class="subtask-error" id="subtask-error-edit">
                    <p>You can not add empty subtasks!</p>
                </div>
                <div>
                    <div id="subtask-edit-content">
                        <ul id="subtask-edit-list"></ul>
                    </div>
                </div>
                <div class="safe-edit-btn-div">
                    <div class="safe-edit-btn-innerDIV">
                        <button type="button" class="saveEditBtn" id="saveEditBtn">Ok<img src="../assets/icons/check.svg"></button>
                    </div>
                </div>
            </div>
        </form>
    `
}

function editSubtasksHTML(subtask, i) {
    return `
        <li id="list-${i}">
            <div id="subtask${i}" class="li-element-subtasks">
                <p id="current-subtask-to-edit${i}">${subtask}</p>
                <div class="edit-subtasks-icons">
                    <img onclick="editCurrentSubtask('${i}', '${subtask}')" src="../assets/icons/edit.svg" alt="icon">
                    |
                    <img onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.svg" alt="icon">
                </div>
            </div>
            <div id="subtask-edit-input${i}" class="d-none li-element-subtasks">
                <input id="input-value${i}">
                <div class="edit-subtasks-icons">
                    <img onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.svg" alt="icon">
                    |
                    <img onclick="confirmEditSubtask(${i})" class="filterCheckButton" src="../assets/icons/createTaskIcon.svg" alt="icon">
                </div>
            </div>
        </li>
    `
}

function taskMoveToMenuHTML(taskCounter) {
    return `
        <div class="move-to-category-buttons-container" id="move-to-category-buttons-container">
            <button onclick="moveToCategory(${taskCounter}, 'toDo', event)" class="moveToButtons">To Do</button>
            <button onclick="moveToCategory(${taskCounter}, 'inProgress', event)" class="moveToButtons">In progress</button>
            <button onclick="moveToCategory(${taskCounter}, 'awaitFeedback', event)" class="moveToButtons">Await feedback</button>
            <button onclick="moveToCategory(${taskCounter}, 'done', event)" class="moveToButtons">Done</button>
            <button onclick="closeMoveTo(event)" class="moveToButtons">X</button>
        </div>
    `
}

function addNewSubTaskEditHTML(subtask, i) {
    return `
        <li id="list-${i}">
            <div id="subtask${i}" class="li-element-subtasks">
                <p id="current-subtask-to-edit${i}">${subtask}</p>
                <div class="edit-subtasks-icons">
                    <img onclick="editCurrentSubtask('${i}', '${subtask}')" src="../assets/icons/edit.svg" alt="icon">
                    |
                    <img onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.svg" alt="icon">
                </div>
              </div>
            <div id="subtask-edit-input${i}" class="d-none li-element-subtasks">
                <input id="input-value${i}">
                <div class="edit-subtasks-icons">
                    <img onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.svg" alt="icon">
                    |
                    <img onclick="confirmEditSubtask(${i})" class="filterCheckButton" src="../assets/icons/createTaskIcon.svg" alt="icon">
                </div>
            </div>
        </li>
    `
}

function addSubTaskHTML(subTask) {
    return `
        <li>
            <div id="current-subtask-${subTask.value}" class="li-elemente-subtask li-elements-overlayTask">
                <p>${subTask.value}<p/>
                <button onclick="editSubtask(this, '${subTask.value}')" type="button"><img src="../assets/icons/edit.svg" alt="icon"></img></button>
                |
                <button onclick="deleteSubTask(this)"><img src="../assets/icons/delete.svg"></img></button>  
            </div>
             <div id="edit-${subTask.value}" class="d-none li-element-subtasks margin-8px">
                <input id="input-edit-${subTask.value}">
                <div class="edit-subtasks-icons">
                  <img onclick="deleteSubTask(this)" src="../assets/icons/delete.svg" alt="icon">
                  |
                  <img onclick="confirmEditSubtask(this, '${subTask.value}')" class="filterCheckButton" src="../assets/icons/createTaskIcon.svg" alt="icon">
              </div>
        </li>
    `
}

function addSubtaskContentHTML(subTask) {
    return `
        <li>
            <div onclick="deleteSubTask(this)" class="li-elemente-subtask li-elements-overlayTask">
                <p>${subTask.value}<p/>
                <button><img src="../assets/icons/delete.svg"></img></button>    
            </div>
        </li>
    `
}

function handleUserSelectionHTML(user, initials) {
    return  `
        <div class="current-task-initials edit-initials" value="${user}" style="background-color: ${getRandomColor()}">${initials}</div>
    `
}

function getUserToAssignedToHTML(name, initials, backgroundColor, isSelected) {
    return `
        <div class="option" onclick="event.stopPropagation(); toggleContactSelection('${name}', this)">
            <div class="contact-option">
                <div class="contact-circle" style="background-color: ${backgroundColor}">
                    ${initials}
                </div>
                <span>${name}</span>
            </div>
            <input type="checkbox" 
                ${isSelected ? 'checked' : ''}
            >
        </div>
    `
}