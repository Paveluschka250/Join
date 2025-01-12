/**
 * Rendert die Kontaktliste mit Sortierung und Animation
 * @param {Array} contacts - Array der anzuzeigenden Kontakte
 */
function renderContacts(contacts) {
  const contactsList = document.getElementById("contacts-list");
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  removeExistingContacts(contactsList);
  setTimeout(() => {
    const htmlContent = generateContactsHTML(contacts);
    contactsList.innerHTML = htmlContent;
    addContactEventListeners();
  }, 500);
}

/**
 * Entfernt bestehende Kontakte mit Animation
 * @param {HTMLElement} contactsList - Das Container-Element der Kontaktliste
 */
function removeExistingContacts(contactsList) {
  const existingContacts = contactsList.querySelectorAll(".contact-item");
  existingContacts.forEach((contact) => {
    contact.classList.add("slide-out");
  });
}

/**
 * Generiert das HTML für die gesamte Kontaktliste
 * @param {Array} contacts - Array der Kontakte
 * @returns {string} Das generierte HTML
 */
function generateContactsHTML(contacts) {
  let htmlContent = "";
  let currentLetter = "";
  for (let contact of contacts) {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const color = getRandomColor();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      htmlContent += generateContactGroupHTML(currentLetter);
    }
    htmlContent += generateContactHTML(contact, color);
  }
  return htmlContent;
}

/**
 * Generiert das HTML für eine Kontaktgruppe (Buchstabenüberschrift)
 * @param {string} currentLetter - Der aktuelle Anfangsbuchstabe
 * @returns {string} Das generierte HTML für die Gruppenüberschrift
 */
function generateContactGroupHTML(currentLetter) {
  return `
    <div class="contact-group">
      <b>${currentLetter}</b>
    </div>
    <div class="contact-line"></div>
  `;
}

/**
 * Generiert das HTML für einen einzelnen Kontakt
 * @param {Object} contact - Die Kontaktdaten
 * @param {string} color - Die Hintergrundfarbe für den Avatar
 * @returns {string} Das generierte HTML für den Kontakt
 */
function generateContactHTML(contact, color) {
  return `
    <div class="contact-item" 
         data-name="${contact.name}" 
         data-email="${contact.email}" 
         data-phone="${contact.phoneNumber}" 
         data-color="${color}">
      <div class="avatar" style="background-color: ${color};">
        ${contact.name.charAt(0)}
      </div>
      <div class="contact-details">
        <span class="name">${contact.name}</span>
        <span class="email">${contact.email}</span>
      </div>
    </div>
  `;
}

/**
 * Fügt Event-Listener zu allen Kontakten hinzu
 */
function addContactEventListeners() {
  const newContacts = document.querySelectorAll(".contact-item");
  newContacts.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;

    item.addEventListener("click", function () {
      const name = this.getAttribute("data-name");
      const email = this.getAttribute("data-email");
      const phone = this.getAttribute("data-phone");
      const color = this.getAttribute("data-color");

      updateContactDetails(name, email, phone, color);
      toggleContactInfo(true);
    });
  });
}

/**
 * Zeigt oder versteckt die Kontaktdetails
 * @param {boolean} show - True zum Anzeigen, False zum Verstecken
 */
function toggleContactInfo(show) {
  const contactInfo = document.querySelector(".contact-info");
  if (show) {
    if (!contactInfo.classList.contains("active")) {
      contactInfo.classList.add("active");
    } else {
      contactInfo.classList.remove("active");
      setTimeout(() => {
        contactInfo.classList.add("active");
      }, 50);
    }
  } else {
    contactInfo.classList.remove("active");
  }
}

/**
 * Öffnet das Overlay zum Hinzufügen eines Kontakts
 */
function openContactsOverlay() {
  const overlay = document.getElementById("contacts-overlay");
  overlay.classList.remove("inactive");
  overlay.classList.add("active");
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div class="overlay-background"></div>'
  );
  setTimeout(() => {
    document.querySelector(".overlay-background").classList.add("active");
    setupOverlayBackgroundListener();
  }, 10);
}

/**
 * Schließt das Overlay zum Hinzufügen eines Kontakts
 */
function closeContactsOverlay() {
  const overlay = document.getElementById("contacts-overlay");
  overlay.classList.remove("active");
  overlay.classList.add("inactive");
  const background = document.querySelector(".overlay-background");
  if (background) {
    background.classList.remove("active");
    background.removeEventListener("click", closeContactsOverlay);
    setTimeout(() => {
      background.remove();
    }, 300);
  }
}

/**
 * Aktualisiert die Kontaktdetails-Ansicht
 * @param {string} name - Name des Kontakts
 * @param {string} email - E-Mail des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 * @param {string} color - Farbe des Avatars
 */
function updateContactDetails(name, email, phone, color) {
  updateShortnameElement(name, color);
  updateContactInfo(name, email, phone);
  setupDeleteButton(name);
  setupEditButton(name, email, phone, color);
  activateContactInfo();
  setupEditDeleteButton();
  setupEditContactButton(name, email, phone, color);
  setupDeleteContactButton(name);
}

/**
 * Aktualisiert das Shortname-Element mit Initialen und Farbe
 * @param {string} name - Der vollständige Name des Kontakts
 * @param {string} color - Die Hintergrundfarbe für die Initialen
 */
function updateShortnameElement(name, color) {
  const initials = getInitials(name);
  const shortnameElement = document.querySelector(".shortname");
  shortnameElement.textContent = initials;
  shortnameElement.style.backgroundColor = color;
}

/**
 * Extrahiert die Initialen aus einem Namen
 * @param {string} name - Der vollständige Name
 * @returns {string} Die Initialen in Großbuchstaben
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Aktualisiert die Kontaktinformationen in der Detailansicht
 * @param {string} name - Name des Kontakts
 * @param {string} email - E-Mail des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 */
function updateContactInfo(name, email, phone) {
  document.querySelector(".full-name").textContent = name;
  document.querySelector(".detail.email .blue-text").textContent = email;
  document.querySelector(".detail.phone p").textContent = phone;
}

/**
 * Richtet den Lösch-Button für einen Kontakt ein
 * @param {string} name - Name des zu löschenden Kontakts
 */
function setupDeleteButton(name) {
  const deleteButton = document.querySelector(".action.delete");
  deleteButton.onclick = function () {
    deleteContact(name);
  };
}

/**
 * Richtet den Bearbeiten-Button für einen Kontakt ein
 * @param {string} name - Name des Kontakts
 * @param {string} email - E-Mail des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 * @param {string} color - Farbe des Avatars
 */
function setupEditButton(name, email, phone, color) {
  const editButton = document.querySelector(".action.edit");
  editButton.onclick = function () {
    openEditContactsOverlay(name, email, phone, color);
  };
}

/**
 * Aktiviert die Kontaktinfo-Ansicht
 */
function activateContactInfo() {
  const contactInfo = document.querySelector(".contact-info");
  contactInfo.classList.remove("closing");
  contactInfo.classList.add("active");
}

/**
 * Richtet den Bearbeiten/Löschen-Button ein
 */
function setupEditDeleteButton() {
  const editDeleteButton = document.querySelector(".edit-delete-button");
  editDeleteButton.onclick = function (event) {
    event.stopPropagation();
    showEditDeleteOverlay();
  };
}

/**
 * Richtet den Kontakt-Bearbeiten-Button ein
 * @param {string} name - Name des Kontakts
 * @param {string} email - E-Mail des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 * @param {string} color - Farbe des Avatars
 */
function setupEditContactButton(name, email, phone, color) {
  document.getElementById("editContactBtn").onclick = function () {
    hideEditDeleteOverlay();
    openEditContactsOverlay(name, email, phone, color);
  };
}

/**
 * Richtet den Kontakt-Löschen-Button ein
 * @param {string} name - Name des zu löschenden Kontakts
 */
function setupDeleteContactButton(name) {
  document.getElementById("deleteContactBtn").onclick = function () {
    hideEditDeleteOverlay();
    deleteContact(name);
  };
}

/**
 * Öffnet das Overlay zum Bearbeiten eines Kontakts
 * @param {string} name - Name des Kontakts
 * @param {string} email - E-Mail des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 * @param {string} color - Farbe des Avatars
 */
function openEditContactsOverlay(name, email, phone, color) {
  activateEditContactOverlay();
  fillEditContactForm(name, email, phone);
  setContactInitials(name, color);
  setCurrentEditingContact(name);
  createOverlayBackground();
}

/**
 * Aktiviert das Bearbeiten-Overlay
 */
function activateEditContactOverlay() {
  const overlay = document.getElementById("edit-contact-overlay");
  overlay.classList.remove("inactive");
  overlay.classList.add("active");
}

/**
 * Füllt das Bearbeiten-Formular mit den Kontaktdaten
 * @param {string} name - Name des Kontakts
 * @param {string} email - E-Mail des Kontakts
 * @param {string} phone - Telefonnummer des Kontakts
 */
function fillEditContactForm(name, email, phone) {
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
}

/**
 * Setzt die Initialen im Bearbeiten-Overlay
 * @param {string} name - Name des Kontakts
 * @param {string} color - Farbe des Avatars
 */
function setContactInitials(name, color) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const initialsElement = document.getElementById("editContactInitials");
  initialsElement.textContent = initials;
  initialsElement.style.backgroundColor = color;
}

/**
 * Setzt den aktuell bearbeiteten Kontakt
 * @param {string} name - Name des Kontakts
 */
function setCurrentEditingContact(name) {
  currentEditingContact = name;
}

/**
 * Erstellt den halbtransparenten Hintergrund für Overlays
 */
function createOverlayBackground() {
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div class="overlay-background"></div>'
  );
  setTimeout(() => {
    document.querySelector(".overlay-background").classList.add("active");
    setupOverlayBackgroundListener();
  }, 10);
}

/**
 * Zeigt das Bearbeiten/Löschen-Overlay an
 */
function showEditDeleteOverlay() {
  const overlay = document.querySelector(".edit-delete-overlay");
  overlay.classList.add("active");
}

/**
 * Versteckt das Bearbeiten/Löschen-Overlay
 */
function hideEditDeleteOverlay() {
  const overlay = document.querySelector(".edit-delete-overlay");
  overlay.classList.remove("active");
}

/**
 * Richtet den Event-Listener für den Overlay-Hintergrund ein
 */
function setupOverlayBackgroundListener() {
  const background = document.querySelector(".overlay-background");
  if (background) {
    background.addEventListener("click", function () {
      closeContactsOverlay();
      closeEditContactsOverlay();
    });
  }
}

/**
 * Schließt die Kontaktinfo-Ansicht mit Animation
 */
function closeContactInfo() {
  const contactInfo = document.querySelector(".contact-info");
  contactInfo.classList.add("closing");

  setTimeout(() => {
    contactInfo.classList.remove("active");
    contactInfo.classList.remove("closing");
  }, 300);
}
