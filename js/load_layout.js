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
    const response = await fetch("../patials/sidebar.html");
    if (!response.ok) {
      console.error("Keine Datei namens sidebar.html gefunden");
    }
    const data = await response.text();
    document.getElementById("sidebar").innerHTML = data;
    const currentPage = window.location.pathname.split("/").pop();
    const buttons = document.querySelectorAll(".sidebar-button");
    buttons.forEach((button) => {
      const link = button.getAttribute("href").split("/").pop();
      if (currentPage === link) {
        button.classList.add("active");
      }
    });
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
  const overlay = document.getElementById("overlay");
  if (!overlay) {
    console.error("Overlay-Element nicht gefunden");
    return;
  }

  function toggleOverlay(show) {
    overlay.style.display = show ? "block" : "none";
  }
  document.querySelectorAll("#trigger-overlay").forEach(function (element) {
    element.addEventListener("click", function (event) {
      const clickedElement = event.target;
      if (clickedElement.closest('.help-icon')) {
        return;
      }
      toggleOverlay(true);
      event.stopPropagation();
    });
  });
  document.getElementById("overlay").addEventListener("click", function (event) {
    const overlayContent = document.querySelector(".overlay-content");
    if (!overlayContent.contains(event.target)) {
      toggleOverlay(false);
    }
  });
  document.querySelector(".overlay-content").addEventListener("click", function (event) {
    event.stopPropagation();
  });
  document.querySelectorAll('.overlay-content a').forEach(link => {
    link.addEventListener('click', function () {
      toggleOverlay(false);
    });
  });
}
