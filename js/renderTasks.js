/**
 * Setzt die Tasks in die entsprechenden Bereiche
 * @param {Object} toDo - Die Task-Daten
 * @param {HTMLElement} toDoBlock - Der Container für ToDo-Tasks
 */
function setTasks(toDo, toDoBlock) {
    if (toDo && Object.keys(toDo).length > 0) {
      inProgress.innerHTML = "";
      awaitFeedback.innerHTML = "";
      done.innerHTML = "";
      toDoBlock.innerHTML = "";
      let taskCounter = 0;
      for (let key in toDo) {
        const element = toDo[key];
        taskCounter++;
        filterCategory(taskCounter, element, toDoBlock);
      }
    }
  }
  
  /**
   * Filtert und rendert Tasks nach ihrer Kategorie
   * @param {number} taskCounter - Der Task-Index
   * @param {Object} element - Das Task-Element
   * @param {HTMLElement} toDoBlock - Der Container für ToDo-Tasks
   */
  function filterCategory(taskCounter, element, toDoBlock) {
    if (element.taskCategory.category == "toDo") {
      renderToDo(taskCounter, element, toDoBlock);
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
  
  /**
   * Prüft und aktualisiert die Anzeige leerer Bereiche
   * @param {HTMLElement} toDoBlock - ToDo-Container
   * @param {HTMLElement} inProgress - InProgress-Container
   * @param {HTMLElement} awaitFeedback - AwaitFeedback-Container
   * @param {HTMLElement} done - Done-Container
   */
  function checkContentFields(toDoBlock, inProgress, awaitFeedback, done) {
    if (toDoBlock.innerHTML === "") {
      toDoBlock.innerHTML =
        '<div class="board-content" id="to-do">No tasks To do</div>';
    }
    if (inProgress.innerHTML === "") {
      inProgress.innerHTML =
        '<div class="board-content" id="in-progress-content">No tasks To do</div>';
    }
    if (awaitFeedback.innerHTML === "") {
      awaitFeedback.innerHTML =
        '<div class="board-content" id="await-feedback-content">No tasks To do</div>';
    }
    if (done.innerHTML === "") {
      done.innerHTML =
        '<div class="board-content" id="done-content">No tasks To do</div>';
    }
  }
  
  /**
   * Rendert einen Task im ToDo-Bereich
   * @param {number} taskCounter - Der Task-Index
   * @param {Object} element - Das Task-Element
   * @param {HTMLElement} toDoBlock - Der Container für ToDo-Tasks
   */
  function renderToDo(taskCounter, element, toDoBlock) {
    let prioIconURL = getPrioIconURL(element);
    let contactsHTML = [];
    setContactsTasks(element, contactsHTML);
    contactsHTML = contactsHTML.join("");
    toDoBlock.innerHTML += renderTaskHTML(
      element,
      taskCounter,
      prioIconURL,
      contactsHTML
    );
  }
  
  /**
   * Rendert einen Task im InProgress-Bereich
   * @param {number} taskCounter - Der Task-Index
   * @param {Object} element - Das Task-Element
   */
  function renderInProgress(taskCounter, element) {
    let inProgress = document.getElementById("inProgress");
    let toDo = tasks.toDo;
  
    if (toDo && Object.keys(toDo).length > 0) {
      let prioIconURL = getPrioIconURL(element);
      let contactsHTML = [];
      setContactsTasks(element, contactsHTML);
      contactsHTML = contactsHTML.join("");
      inProgress.innerHTML += rederInProgress(
        element,
        taskCounter,
        prioIconURL,
        contactsHTML
      );
    }
  }
  
  /**
   * Rendert einen Task im AwaitFeedback-Bereich
   * @param {number} taskCounter - Der Task-Index
   * @param {Object} element - Das Task-Element
   */
  function renderAwaitFeedback(taskCounter, element) {
    let awaitFeedback = document.getElementById("awaitFeedback");
    let toDo = tasks.toDo;
  
    if (toDo && Object.keys(toDo).length > 0) {
      let prioIconURL = getPrioIconURL(element);
      let contactsHTML = [];
      setContactsTasks(element, contactsHTML);
      contactsHTML = contactsHTML.join("");
      awaitFeedback.innerHTML += renderAwaitFeedbackHTML(
        element,
        taskCounter,
        prioIconURL,
        contactsHTML
      );
    }
  }
  
  /**
   * Rendert einen Task im Done-Bereich
   * @param {number} taskCounter - Der Task-Index
   * @param {Object} element - Das Task-Element
   */
  function renderDone(taskCounter, element) {
    let done = document.getElementById("done");
    let toDo = tasks.toDo;
  
    if (toDo && Object.keys(toDo).length > 0) {
      let prioIconURL = getPrioIconURL(element);
      let contactsHTML = [];
      setContactsTasks(element, contactsHTML);
      contactsHTML = contactsHTML.join("");
      done.innerHTML += renderDoneHTML(
        element,
        taskCounter,
        prioIconURL,
        contactsHTML
      );
    }
  }
  
  /**
   * Ermittelt die URL des Prioritäts-Icons
   * @param {Object} element - Das Task-Element
   * @returns {string} Die URL des Icons
   */
  function getPrioIconURL(element) {
    let prioIconURL;
    if (element.priority === "Urgent") {
      prioIconURL = "../assets/icons/PriorityUrgentRed.png";
    } else if (element.priority === "Medium") {
      prioIconURL = "../assets/icons/PriorityMediumOrange.png";
    } else if (element.priority === "Low") {
      prioIconURL = "../assets/icons/PriorityLowGreen.png";
    } else {
      prioIconURL = "../assets/icons/minus.png";
    }
    return prioIconURL;
  }
  
  /**
   * Setzt den Stil eines Tasks basierend auf seiner Kategorie
   * @param {number} taskCounter - Der Task-Index
   */
  function taskStyle(taskCounter) {
    let currentCategory = document.getElementById(`category-to-do${taskCounter}`);
    if (currentCategory.textContent === "Technical Task") {
      currentCategory.style.backgroundColor = "#0038ff";
      currentCategory.style.color = "white";
    } else if (currentCategory.textContent === "User Story") {
      currentCategory.style.backgroundColor = "#ff7a00";
      currentCategory.style.color = "white";
    } else {
      currentCategory.style.backgroundColor = "lightblue";
      currentCategory.innerHTML = "Ticket";
      currentCategory.style.color = "white";
    }
  }
  
  /**
   * Schaltet das Dropdown-Menü für das Hinzufügen von Tasks um
   */
  function toggleDropdownAddTaskOnBoard() {
    const dropdownMenu = document.getElementById(
      "dropdown-menu-add-task-on-board"
    );
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
    } else {
      dropdownMenu.style.display = "block";
    }
  }
  
  /**
   * Verarbeitet die Benutzerauswahl beim Hinzufügen eines Tasks
   */
  function handleUserSelectionAddTaskOnBoard() {
    const checkboxes = document.querySelectorAll(
      '#user-select-add-task-on-board input[type="checkbox"]'
    );
    const selectedUsers = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    renderUsersAddTaskOnBoard(selectedUsers);
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          renderUsersAddTaskOnBoard([checkbox.value]);
        } else {
          removeUserFromBoard(checkbox.value);
        }
      });
    });
  }
  
  /**
   * Rendert die ausgewählten Benutzer
   * @param {Array} users - Die ausgewählten Benutzer
   */
  function renderUsersAddTaskOnBoard(users) {
    const taskContainer = document.getElementById(
      "added-users-container-add-task-on-board"
    );
    users.forEach((user) => {
      if (!document.querySelector(`.current-task-initials[value="${user}"]`)) {
        let initials = createInitialsForEdit([user]);
        taskContainer.innerHTML += `
                  <div class="current-task-initials edit-initials" value="${user}" style="background-color: ${getRandomColor()}">${initials}</div>
              `;
      }
    });
  }
  
  /**
   * Entfernt einen Benutzer vom Board
   * @param {string} user - Der zu entfernende Benutzer
   */
  function removeUserFromBoard(user) {
    const taskContainer = document.getElementById(
      "added-users-container-add-task-on-board"
    );
    const userDiv = document.querySelector(
      `.current-task-initials[value="${user}"]`
    );
    if (userDiv) {
      taskContainer.removeChild(userDiv);
    }
  }
  
  /**
   * Lädt die Kontakte für die Bearbeitung des Boards
   */
  function loadContactsToEditAddTaskOnBoard() {
    const namesArray = Object.values(contactsForSidebar).map((item) => item.name);
    let userSelect = document.getElementById("user-select-add-task-on-board");
    userSelect.innerHTML = "";
    createUserfieldCheckbox(namesArray, userSelect);
    handleUserSelectionAddTaskOnBoard();
  }
  
  /**
   * Erstellt Checkbox-Felder für die Benutzerauswahl
   * @param {Array} namesArray - Array mit Benutzernamen
   * @param {HTMLElement} userSelect - Das Select-Element
   */
  function createUserfieldCheckbox(namesArray, userSelect) {
    for (let i = 0; i < namesArray.length; i++) {
      const container = document.createElement("div");
      container.classList.add("checkbox-container");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `checkbox-${i}`;
      checkbox.value = namesArray[i];
      const names = document.createElement("div");
      names.htmlFor = `checkbox-${i}`;
      names.textContent = namesArray[i];
      container.appendChild(names);
      container.appendChild(checkbox);
      userSelect.appendChild(container);
    }
  }
  
  function setContactsTasks(element, contactsHTML) {
    if (Array.isArray(element.assignedTo)) {
      if (element.assignedTo.length <= 5) {
        for (let i = 0; i < element.assignedTo.length; i++) {
          setInitials(element, i, contactsHTML);
        }
      } else if (element.assignedTo.length > 5) {
        for (let i = 0; i < 4; i++) {
          setInitials(element, i, contactsHTML);
        }
        let UsersAmount = element.assignedTo.length - 4;
        contactsHTML.push(
          `<div class="task-initials margin-right" style="background-color: ${getRandomColor()}">+${UsersAmount}</div>`
        );
      } else {
        contactsHTML = "";
      }
    }
  }
  function setInitials(element, i, contactsHTML) {
    const initials = element.assignedTo[i];
    contactsHTML.push(
      `<div class="task-initials margin-right" style="background-color: ${getRandomColor()}">${initials}</div>`
    );
  }