async function loadHeader() {
  try {
    const response = await fetch("../patials/header.html");
    if (!response.ok) {
      console.error("Keine Datei namens header.html gefunden");
      return;
    }
    const data = await response.text();
    document.getElementById("header").innerHTML = data;

    // Nach dem Laden des Headers Anpassungen vornehmen
    adjustHeaderForLegalPages();
  } catch (error) {
    console.error("Error in loadHeader: ", error);
  }
}

function adjustHeaderForLegalPages() {
  // Aktuelle Seite ermitteln
  const currentPage = window.location.pathname.split("/").pop();

  // Nur auf den Seiten "privacy_policy.html" und "legal_notice.html" ausführen
  if (
    currentPage === "privacy_policy.html" ||
    currentPage === "legal_notice.html"
  ) {
    // Alle Elemente mit der ID "none" leeren
    const elementsToClear = document.querySelectorAll("#none");
    elementsToClear.forEach((element) => {
      element.innerHTML = ""; // Leert den Inhalt der Elemente
    });
  }
}

loadHeader();

async function loadSidebar() {
  try {
    const response = await fetch("../patials/sidebar.html");
    if (!response.ok) {
      console.error("Keine Datei namens sidebar.html gefunden");
    }
    const data = await response.text();
    document.getElementById("sidebar").innerHTML = data;

    // Aktive Klasse für Sidebar-Buttons setzen
    const currentPage = window.location.pathname.split("/").pop();
    const buttons = document.querySelectorAll(".sidebar-button");
    buttons.forEach((button) => {
      const link = button.getAttribute("href").split("/").pop();
      if (currentPage === link) {
        button.classList.add("active");
      }
    });

    // Aktive Klasse für Footer-Links setzen
    const footerLinks = document.querySelectorAll(".footer-text");
    footerLinks.forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (currentPage === linkPage) {
        link.classList.add("active");
      }
    });
  } catch (error) {
    console.error("Error in load_sidebar: ", error);
  }
}
loadSidebar();
