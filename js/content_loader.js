// content_loader.js
async function loadSummary() {
  try {
    const response = await fetch("/pages/summary.html");
    if (!response.ok) {
      console.error("keine Datai namen summary.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("summary").classList.add("active");
    removeActive(["addTask", "board", "contacts"]);
  } catch (error) {
    console.error("Error in load_summary: ", error);
  }
}

async function loadAddTask() {
  try {
    const response = await fetch("/pages/add_task.html");
    if (!response.ok) {
      console.error("keine Datai namen add_task.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("addTask").classList.add("active");
    removeActive(["summary", "board", "contacts"]);
  } catch (error) {
    console.error("Error in load_add_task: ", error);
  }
}

async function loadBoard() {
  try {
    const response = await fetch("/pages/board.html");
    if (!response.ok) {
      console.error("keine Datai namen board.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("board").classList.add("active");
    removeActive(["summary", "addTask", "contacts"]);
  } catch (error) {
    console.error("Error in load_board: ", error);
  }
}

async function loadContacts() {
  try {
    const response = await fetch("/pages/contacts.html");
    if (!response.ok) {
      console.error("keine Datai namen contacts.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("contacts").classList.add("active");
    removeActive(["summary", "addTask", "board",]);
  } catch (error) {
    console.error("Error in load_contacts: ", error);
  }
}
function removeActive(idArray) {
  idArray.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
}

async function loadHelp() {
  try {
    const response = await fetch("/pages/help.html");
    if (!response.ok) {
      console.error("keine Datai namen help.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("summary").classList.add("active");
    removeActive(["summary", "addTask", "board", "contacts"]);
  } catch (error) {
    console.error("Error in load_help: ", error);
  }
}

loadSummary();
