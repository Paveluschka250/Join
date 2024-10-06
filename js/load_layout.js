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

    // Füge die Overlay-Logik hinzu, nachdem der Header geladen wurde
    initializeOverlay();
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
    console.error("Error in loadSidebar: ", error);
  }
}
loadSidebar();

function initializeOverlay() {
  function toggleOverlay(show) {
    const overlay = document.getElementById("overlay");
    overlay.style.display = show ? "block" : "none";
    // Blockiere die Interaktionen auf der restlichen Seite
    document.body.style.overflow = show ? "hidden" : "auto";
  }

  // Event-Listener für das Klicken auf das p- oder h4-Tag
  document.querySelectorAll("#trigger-overlay").forEach(function (element) {
    element.addEventListener("click", function (event) {
      toggleOverlay(true);
      event.stopPropagation(); // Verhindert, dass das Overlay sofort geschlossen wird
    });
  });

  // Schließe das Overlay, wenn außerhalb des Overlay-Inhalts geklickt wird
  document.getElementById("overlay").addEventListener("click", function (event) {
    const overlayContent = document.querySelector(".overlay-content");

    // Überprüfen, ob der Klick NICHT innerhalb des Overlay-Inhalts ist
    if (!overlayContent.contains(event.target)) {
      toggleOverlay(false);
    }
  });

  // Verhindere, dass ein Klick innerhalb des Overlay-Inhalts das Overlay schließt
  document.querySelector(".overlay-content").addEventListener("click", function (event) {
    event.stopPropagation(); // Verhindert das Schließen des Overlays, wenn im Inhalt geklickt wird
  });

  // Füge Event-Listener für die Links im Overlay hinzu
  document.querySelectorAll('.overlay-content a').forEach(link => {
    link.addEventListener('click', function (event) {
      // Hier kannst du das Overlay schließen, wenn du es nicht mehr benötigst
      toggleOverlay(false);
    });
  });
}

// Starte die Overlay-Initialisierung
initializeOverlay();

