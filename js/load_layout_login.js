async function loadHeader() {
  try {
    const response = await fetch("../patials/header_login.html");
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

async function loadSidebar() {
  try {
    const response = await fetch("../patials/sidebar_login.html");
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

function addEventListenersToOverlay(overlay) {
  overlay.addEventListener("click", function (event) {
    const overlayContent = document.querySelector(".overlay-content");
    if (!overlayContent.contains(event.target)) {
      toggleOverlay(false, overlay);
    }
  });
}

function addEventListenersToOverlayContent(overlay) {
  document
    .querySelector(".overlay-content")
    .addEventListener("click", function (event) {
      event.stopPropagation();
    });
}

function addEventListenersToOverlayContentLinks(overlay) {
  document.querySelectorAll(".overlay-content a").forEach((link) => {
    link.addEventListener("click", function () {
      toggleOverlay(false, overlay);
    });
  });
}

function toggleOverlay(show, overlay) {
  overlay.style.display = show ? "block" : "none";
}

function loadUserInitials() {
  const userCircle = document.getElementById("userCircle");
  const initialsElement = userCircle.querySelector("h4");
  const userInitials = localStorage.getItem("userInitials") || "G";
  initialsElement.textContent = userInitials;
}

async function includeHTML() {
  if (elem.getAttribute("id") == "header") {
    await loadHTML(file, elem);
    loadUserInitials();
  }
}

function logout() {
  localStorage.removeItem("userInitials");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.querySelector(
    '.overlay-content a[href="../index.html"]'
  );
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
});
