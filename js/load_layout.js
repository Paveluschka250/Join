<<<<<<< HEAD
/**
 * @fileoverview Hauptlayout-Modul für die Join-Anwendung - Lädt Header, Sidebar und verwaltet globale UI-Komponenten
 * @author ElStephano
 * @version 1.0.0
 * @license MIT
 * @created 2025-01-22
 */

/**
 * Lädt den Header-Bereich der Anwendung asynchron
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Wenn die Header-Datei nicht gefunden wird oder ein Fehler beim Laden auftritt
 */
=======
// Lädt den Header-Bereich der Seite und initialisiert zugehörige Funktionen
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
async function loadHeader() {
  try {
    const response = await fetch("../patials/header.html");
    if (!response.ok) {
      console.error("Keine Datei namens header.html gefunden");
      return;
    }
    const data = await response.text();
    document.getElementById("header").innerHTML = data;
    adjustHeaderForLegalPages();
    initializeOverlay();
    const currentUser = localStorage.getItem("currentUser");
    const userCircle = document.querySelector("#userCircle h4");
    if (userCircle && currentUser) {
      userCircle.textContent = currentUser;
    }
  } catch (error) {
    console.error("Error in loadHeader: ", error);
  }
}

<<<<<<< HEAD
/**
 * Passt den Header für Legal-Seiten an
 * Entfernt spezifische Elemente auf den Datenschutz- und Impressum-Seiten
 */
=======
// Entfernt bestimmte Elemente auf den Rechtsseiten (Datenschutz & Impressum)
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function adjustHeaderForLegalPages() {
  const currentPage = window.location.pathname.split("/").pop();
  if (
    currentPage === "privacy_policy.html" ||
    currentPage === "legal_notice.html"
  ) {
    const elementsToClear = document.querySelectorAll("#none");
    elementsToClear.forEach((element) => {
      element.innerHTML = "";
    });
  }
}

loadHeader();

<<<<<<< HEAD
/**
 * Lädt die Sidebar asynchron
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Wenn die Sidebar-Datei nicht gefunden wird oder ein Fehler beim Laden auftritt
 */
=======
// Lädt die Seitenleiste und initialisiert die zugehörigen Buttons
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
async function loadSidebar() {
  try {
    const response = await fetch("../patials/sidebar.html");
    if (!response.ok) {
      console.error("Keine Datei namens sidebar.html gefunden");
      return;
    }
    const data = await response.text();
    document.getElementById("sidebar").innerHTML = data;
    setActiveSidebarButtons();
    setActiveFooterLinks();
  } catch (error) {
    console.error("Error in loadSidebar: ", error);
  }
}

<<<<<<< HEAD
/**
 * Markiert den aktiven Button in der Sidebar basierend auf der aktuellen Seite
 * Fügt die 'active' Klasse zum entsprechenden Button hinzu
 */
=======
// Markiert den aktiven Button in der Seitenleiste basierend auf der aktuellen Seite
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function setActiveSidebarButtons() {
  const currentPage = window.location.pathname.split("/").pop();
  const buttons = document.querySelectorAll(".sidebar-button");
  buttons.forEach((button) => {
    const link = button.getAttribute("href").split("/").pop();
    if (currentPage === link) {
      button.classList.add("active");
    }
  });
}

<<<<<<< HEAD
/**
 * Markiert die aktiven Footer-Links basierend auf der aktuellen Seite
 * Fügt die 'active' Klasse zum entsprechenden Link hinzu
 */
=======
// Markiert den aktiven Link im Footer basierend auf der aktuellen Seite
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function setActiveFooterLinks() {
  const currentPage = window.location.pathname.split("/").pop();
  const footerLinks = document.querySelectorAll(".footer-text");
  footerLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (currentPage === linkPage) {
      link.classList.add("active");
    }
  });
}

loadSidebar();

<<<<<<< HEAD
/**
 * Initialisiert das Overlay und fügt alle notwendigen Event-Listener hinzu
 * @throws {Error} Wenn das Overlay-Element nicht im DOM gefunden wird
 */
=======
// Initialisiert das Overlay-Menü und fügt alle notwendigen Event-Listener hinzu
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function initializeOverlay() {
  const overlay = document.getElementById("overlay");
  if (!overlay) {
    console.error("Overlay-Element nicht gefunden");
    return;
  }
  addEventListenersToTriggerOverlay(overlay);
  addEventListenersToOverlay(overlay);
  addEventListenersToOverlayContent(overlay);
  addEventListenersToOverlayContentLinks(overlay);
}

<<<<<<< HEAD
/**
 * Fügt Event-Listener für das Auslösen des Overlays hinzu
 * @param {HTMLElement} overlay - Das Overlay-Element
 */
=======
// Fügt Event-Listener für das Öffnen des Overlays hinzu
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function addEventListenersToTriggerOverlay(overlay) {
  document.querySelectorAll("#trigger-overlay").forEach(function (element) {
    element.addEventListener("click", function (event) {
      const clickedElement = event.target;
      if (clickedElement.closest(".help-icon")) {
        return;
      }
      toggleOverlay(true, overlay);
      event.stopPropagation();
    });
  });
}

<<<<<<< HEAD
/**
 * Fügt Event-Listener für das Overlay selbst hinzu
 * Schließt das Overlay beim Klick außerhalb des Inhalts
 * @param {HTMLElement} overlay - Das Overlay-Element
 */
=======
// Fügt Event-Listener zum Schließen des Overlays beim Klick außerhalb hinzu
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function addEventListenersToOverlay(overlay) {
  overlay.addEventListener("click", function (event) {
    const overlayContent = document.querySelector(".overlay-content");
    if (!overlayContent.contains(event.target)) {
      toggleOverlay(false, overlay);
    }
  });
}

<<<<<<< HEAD
/**
 * Fügt Event-Listener für den Overlay-Content hinzu
 * Verhindert das Bubbling von Click-Events
 * @param {HTMLElement} overlay - Das Overlay-Element
 */
=======
// Verhindert das Schließen des Overlays beim Klick auf den Inhalt
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function addEventListenersToOverlayContent(overlay) {
  document
    .querySelector(".overlay-content")
    .addEventListener("click", function (event) {
      event.stopPropagation();
    });
}

<<<<<<< HEAD
/**
 * Fügt Event-Listener für Links im Overlay-Content hinzu
 * Schließt das Overlay beim Klick auf einen Link
 * @param {HTMLElement} overlay - Das Overlay-Element
 */
=======
// Fügt Event-Listener für Links innerhalb des Overlays hinzu
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function addEventListenersToOverlayContentLinks(overlay) {
  document.querySelectorAll(".overlay-content a").forEach((link) => {
    link.addEventListener("click", function () {
      toggleOverlay(false, overlay);
    });
  });
}

<<<<<<< HEAD
/**
 * Schaltet die Sichtbarkeit des Overlays um
 * @param {boolean} show - Ob das Overlay angezeigt werden soll
 * @param {HTMLElement} overlay - Das Overlay-Element
 */
=======
// Steuert die Sichtbarkeit des Overlays
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function toggleOverlay(show, overlay) {
  overlay.style.display = show ? "block" : "none";
}

<<<<<<< HEAD
/**
 * Lädt die Initialen des aktuellen Benutzers in den User-Circle
 * Verwendet einen Fallback-Wert 'G' wenn keine Initialen gespeichert sind
 */
=======
// Lädt die Initialen des Benutzers in den User-Circle
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function loadUserInitials() {
  const userCircle = document.getElementById("userCircle");
  const initialsElement = userCircle.querySelector("h4");
  const userInitials = localStorage.getItem("userInitials") || "G";
  initialsElement.textContent = userInitials;
}

<<<<<<< HEAD
/**
 * Lädt HTML-Inhalte und initialisiert Benutzer-Initialen
 * @async
 * @throws {Error} Wenn das HTML nicht geladen werden kann
 */
=======
// Hilfsfunktion zum Laden von HTML-Inhalten
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
async function includeHTML() {
  if (elem.getAttribute("id") == "header") {
    await loadHTML(file, elem);
    loadUserInitials();
  }
}

<<<<<<< HEAD
/**
 * Loggt den Benutzer aus und leitet zur Index-Seite weiter
 * Entfernt die Benutzer-Initialen aus dem LocalStorage
 */
=======
// Führt den Logout durch und leitet zur Startseite weiter
>>>>>>> 2e693667117a93c0126966a6d201a9f9c488034b
function logout() {
  localStorage.removeItem("userInitials");
  window.location.href = "/index.html";
}

// Event-Listener für den Logout-Link im Overlay
document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.querySelector(
    '.overlay-content a[href="/index.html"]'
  );
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
});
