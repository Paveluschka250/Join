function renderAddTaskHTML(element, taskCounter, prioIconURL, contactsHTML) {
    return `
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
            `
}

function rederInProgress(element, taskCounter, prioIconURL, contactsHTML) {
    return         `
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
`
}

function renderAwaitFeedbackHTML(element, taskCounter, prioIconURL, contactsHTML) {
    return `
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
    `
}

function renderDoneHTML(element, taskCounter, prioIconURL, contactsHTML) {
    return `
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
        
        <div>
            <b>Subtasks</b>
            <ul id="current-subtasks-task${taskCounter}">${currentSubtasks}</ul>
        </div>

        <div class="delete-and-edit-task">
            <div class="" onclick="deleteTask(${taskCounter})"><img src="../assets/icons/delete.svg"><p>delete</p></div> | 
            <div id="editTaskBtn"><img src="../assets/icons/edit.svg"><p>edit</p></div>
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
                                src="../assets/icons/priorityMediumOrange.png" alt="priorität mittel" id="medium-prio-icon-edit"
                                class="medium-prio-icon"></button>
                        <button id="prio3-edit" onclick="getPriorityEdit('prio3-edit')" type="button"
                            class="prio-buttons-edit priority-btn-addTask low-addTask center-button">Low <img id="low-prio-icon-edit"
                                src="../assets/icons/prio1.svg" alt="priorität niedrig"></button>
                    </div>
                </div>

                <div class="form-group-addTask-edit assigned-to-edit m-b-8px">
                    <label for="assigned-to-sb-edit"><b>Assigned to</b> (optional)</label>
                    <select onclick="loadContactsEdit()"
                        class="underline-select input-addTask cursor-pointer" id="assigned-to-sb-edit"
                        name="assigned-to-sb-edit">
                        <option value="">Select contacts to assign</option>
                    </select>
                    <div class="selected-contacts-sb" id="selected-contacts-sb-edit"></div>
                </div>

                <div class="form-group-addTask-edit m-b-16px category-edit">
                    <label for="category"><b>Category</b></label>
                    <select class="underline-select input-addTask cursor-pointer" id="category-edit" name="category">
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
                <div>
                    <div id="subtask-edit-content">
                        <ul id="subtask-edit-list"></ul>
                    </div>
                </div>
                <div>
                    <button type="button" id="saveEditBtn">Save</button>
                </div>
            </div>
        </form>
    `
}