// content_loader.js

async function loadSummary() {
  try {
    const response = await fetch("/pages/summary.html");
    if (!response.ok) {
      console.error("keine Datei namens summary.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("summary").classList.add("active");
    removeActive(["addTask", "board", "contacts"]);
    sessionStorage.setItem(
      "previousPage",
      sessionStorage.getItem("currentPage")
    );
    sessionStorage.setItem("currentPage", "summary");
  } catch (error) {
    console.error("Error in load_summary: ", error);
  }
}

async function loadAddTask() {
  try {
    const response = await fetch("/pages/add_task.html");
    if (!response.ok) {
      console.error("keine Datei namens add_task.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("addTask").classList.add("active");
    removeActive(["summary", "board", "contacts"]);
    sessionStorage.setItem(
      "previousPage",
      sessionStorage.getItem("currentPage")
    );
    sessionStorage.setItem("currentPage", "addTask");
  } catch (error) {
    console.error("Error in load_add_task: ", error);
  }
}

async function loadBoard() {
  try {
    const response = await fetch("/pages/board.html");
    if (!response.ok) {
      console.error("keine Datei namens board.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("board").classList.add("active");
    removeActive(["summary", "addTask", "contacts"]);
    sessionStorage.setItem(
      "previousPage",
      sessionStorage.getItem("currentPage")
    );
    sessionStorage.setItem("currentPage", "board");
  } catch (error) {
    console.error("Error in load_board: ", error);
  }
}

async function loadContacts() {
  try {
    const response = await fetch("/pages/contacts.html");
    if (!response.ok) {
      console.error("keine Datei namens contacts.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    document.getElementById("contacts").classList.add("active");
    removeActive(["summary", "addTask", "board"]);
    sessionStorage.setItem(
      "previousPage",
      sessionStorage.getItem("currentPage")
    );
    sessionStorage.setItem("currentPage", "contacts");
  } catch (error) {
    console.error("Error in load_contacts: ", error);
  }
}

async function loadHelp() {
  try {
    const response = await fetch("/pages/help.html");
    if (!response.ok) {
      console.error("keine Datei namens help.html gefunden");
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    removeActive(["summary", "addTask", "board", "contacts"]);
    sessionStorage.setItem(
      "previousPage",
      sessionStorage.getItem("currentPage")
    );
    sessionStorage.setItem("currentPage", "help");
  } catch (error) {
    console.error("Error in load_help: ", error);
  }
}

function removeActive(idArray) {
  idArray.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
}

// Zurück zur vorherigen Seite navigieren
function goBack() {
  const previousPage = sessionStorage.getItem("previousPage");

  console.log("previousPage: ", previousPage);

  if (previousPage === "addTask") {
    loadAddTask();
  } else if (previousPage === "board") {
    loadBoard();
  } else if (previousPage === "contacts") {
    loadContacts();
  } else {
    loadSummary();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  loadSummary();
});
