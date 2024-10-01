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
    removeActiveClasses()
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
    removeActiveClasses()
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
    removeActiveClasses()
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
    removeActiveClasses()
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
    removeActiveClasses()
    sessionStorage.setItem(
      "previousPage",
      sessionStorage.getItem("currentPage")
    );
    sessionStorage.setItem("currentPage", "help");
  } catch (error) {
    console.error("Error in load_help: ", error);
  }
}

// Funktion, um alle aktiven Links zu entfernen
function removeActiveClasses() {
  const links = document.querySelectorAll('.footer-text');
  links.forEach(link => link.classList.remove('active'));
}

// Funktion zum Laden der Datenschutzerklärung
async function loadPrivacyPolicy() {
  try {
    const response = await fetch("/pages/privacy_policy.html");
    if (!response.ok) {
      console.error("keine Datei namens privacy_policy.html gefunden");
      return;
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    removeActive(["summary", "addTask", "board", "contacts"]);
    sessionStorage.setItem("previousPage", sessionStorage.getItem("currentPage"));
    sessionStorage.setItem("currentPage", "privacy_policy");

    // Entfernen der aktiven Klasse von allen Links
    removeActiveClasses();

    // Aktive Klasse zur Datenschutzerklärung hinzufügen
    document.querySelector('.footer-text[href="#privacy"]').classList.add('active');
  } catch (error) {
    console.error("Error in loadPrivacyPolicy: ", error);
  }
}

// Funktion zum Laden des Impressums
async function loadLegalNotice() {
  try {
    const response = await fetch("/pages/legal_notice.html");
    if (!response.ok) {
      console.error("keine Datei namens legal_notice.html gefunden");
      return;
    }
    const data = await response.text();
    document.getElementById("main").innerHTML = data;
    removeActive(["summary", "addTask", "board", "contacts"]);
    sessionStorage.setItem("previousPage", sessionStorage.getItem("currentPage"));
    sessionStorage.setItem("currentPage", "legal_notice");

    // Entfernen der aktiven Klasse von allen Links
    removeActiveClasses();

    // Aktive Klasse zum Impressum hinzufügen
    document.querySelector('.footer-text[href="#legal"]').classList.add('active');
  } catch (error) {
    console.error("Error in loadLegalNotice: ", error);
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
  } else if (previousPage === "help") {
    loadHelp();
  } else if (previousPage === "privacy_policy") {
    loadPrivacyPolicy();
  } else if (previousPage === "legal_notice") {
    loadLegalNotice();
  } else {
    loadSummary();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  loadSummary();
});
