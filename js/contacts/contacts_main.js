/**
 * Globale Variable für die Kontaktliste
 * Wird aus dem localStorage geladen oder als leeres Array initialisiert
 */
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

/**
 * Speichert den aktuell bearbeiteten Kontakt
 */
let currentEditingContact = null;

/**
 * Initialisiert die Kontaktliste
 * Lädt Kontakte aus Firebase wenn keine lokalen Kontakte vorhanden sind
 */
async function initializeContacts() {
  if (contacts.length === 0) {
    contacts = await downloadContactsFromFirebase();
  }
}

/**
 * Event-Listener für das DOM-Content-Loaded Event
 * Initialisiert alle notwendigen Event-Handler für die Kontaktverwaltung:
 * - Lädt und rendert bestehende Kontakte aus dem localStorage
 * - Setzt Click-Handler für das Öffnen/Schließen des Kontakt-Overlays
 * - Initialisiert Formular-Handler für das Hinzufügen und Bearbeiten von Kontakten
 * - Setzt Event-Listener für UI-Interaktionen wie das Schließen der Kontaktinfo
 */
document.addEventListener("DOMContentLoaded", function () {
  JSON.parse(localStorage.getItem("contacts"))
    ? renderContacts(contacts)
    : null;

  document.querySelector(".sticky-button-wrapper button").onclick = openContactsOverlay;
  document.getElementById("closeOverlay").onclick = closeContactsOverlay;
  
  document.getElementById("addContactForm").addEventListener("submit", addNewContact);
  document.getElementById("editContactForm").addEventListener("submit", saveEditedContact);
  
  const saveEditedContactBtn = document.getElementById("saveEditedContactBtn");
  if (saveEditedContactBtn) {
    saveEditedContactBtn.addEventListener("click", saveEditedContact);
  }
  
  const editContactForm = document.getElementById("editContactForm");
  if (editContactForm) {
    editContactForm.addEventListener("submit", saveEditedContact);
  }
  
  const closeContactInfoButton = document.getElementById('close-contact-info');
  if (closeContactInfoButton) {
    closeContactInfoButton.addEventListener('click', closeContactInfo);
  }
  
  document.body.addEventListener('click', function() {
    hideEditDeleteOverlay();
  });
});

initializeContacts(); 

/**
 * Fügt einen neuen Kontakt hinzu
 * Validiert das Formular und speichert den Kontakt in Firebase
 * @param {Event} event - Das Submit-Event des Formulars
 */
async function addNewContact(event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }
  const contactData = getContactFormData();
  const addedContact = await addContactToFirebase(contactData);
  if (addedContact) {
    processAddedContact(addedContact);
  }
}

/**
 * Sammelt die Formulardaten für einen neuen Kontakt
 * @returns {Object} Ein Objekt mit den Kontaktdaten
 */
function getContactFormData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  return {
    name: name,
    email: email,
    phoneNumber: phone,
  };
}

/**
 * Verarbeitet einen neu hinzugefügten Kontakt
 * Fügt ihn zur lokalen Liste hinzu und aktualisiert die Anzeige
 * @param {Object} addedContact - Der hinzugefügte Kontakt
 */
async function processAddedContact(addedContact) {
  contacts.push(addedContact);
  renderContacts(contacts);
  closeContactsOverlay();
  document.getElementById("addContactForm").reset();
}

/**
 * Löscht einen Kontakt mit Animation
 * @param {string} name - Der Name des zu löschenden Kontakts
 */
async function deleteContact(name) {
  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item) => {
    item.classList.add("slide-out");
  });
  setTimeout(async () => {
    const contactToDelete = contacts.find((contact) => contact.name === name);

    if (contactToDelete) {
      await deleteContactFromFirebase(contactToDelete.id);
      contacts = contacts.filter((contact) => contact.name !== name);
      renderContacts(contacts);
      clearContactDetails();
    }
  }, 500);
}

/**
 * Leert die Kontaktdetails-Ansicht
 */
function clearContactDetails() {
  document.querySelector(".shortname").textContent = "";
  document.querySelector(".full-name").textContent = "";
  document.querySelector(".detail.email .blue-text").textContent = "";
  document.querySelector(".detail.phone p").textContent = "";

  document.querySelector(".contact-info").classList.remove("active");
}

/**
 * Speichert die Änderungen an einem Kontakt
 * @param {Event} event - Das Submit-Event des Bearbeiten-Formulars
 */
async function saveEditedContact(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  if (!validateEditForm()) {
    return;
  }
  const contactData = getEditedContactData();
  const contactToUpdate = findContactToUpdate(contactData.name);
  if (contactToUpdate) {
    await updateContact(contactToUpdate, contactData);
    closeEditContactsOverlay();
    updateContactDetails(contactData.name, contactData.email, contactData.phoneNumber);
  }
}

/**
 * Sammelt die Daten aus dem Bearbeiten-Formular
 * @returns {Object} Die bearbeiteten Kontaktdaten
 */
function getEditedContactData() {
  return {
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    phoneNumber: document.getElementById("editPhone").value,
  };
}

/**
 * Findet den zu aktualisierenden Kontakt
 * @param {string} name - Name des Kontakts
 * @returns {Object} Der gefundene Kontakt
 */
function findContactToUpdate(name) {
  return contacts.find(contact => contact.name === currentEditingContact);
}

/**
 * Aktualisiert einen Kontakt in der Datenbank und UI
 * @param {Object} contactToUpdate - Der zu aktualisierende Kontakt
 * @param {Object} updatedContactData - Die neuen Kontaktdaten
 */
async function updateContact(contactToUpdate, updatedContactData) {
  try {
    await updateContactInFirebase(contactToUpdate.id, updatedContactData);
    updateContactsArray(contactToUpdate.id, updatedContactData);
    renderContacts(contacts);
  } catch (error) {
    console.error("Fehler beim Speichern des bearbeiteten Kontakts:", error);
    alert("Es gab einen Fehler beim Speichern des Kontakts. Bitte versuchen Sie es später erneut.");
  }
}

/**
 * Aktualisiert einen Kontakt im lokalen Kontakte-Array
 * @param {string} id - Die ID des zu aktualisierenden Kontakts
 * @param {Object} updatedData - Die aktualisierten Daten
 */
function updateContactsArray(id, updatedData) {
  const index = contacts.findIndex(contact => contact.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updatedData };
  }
}

/**
 * Validiert das Bearbeiten-Formular
 * @returns {boolean} True wenn alle Eingaben gültig sind
 */
function validateEditForm() {
  const nameInput = document.getElementById("editName");
  const emailInput = document.getElementById("editEmail");
  const phoneInput = document.getElementById("editPhone");
  let isValid = true;
  clearError(nameInput);
  clearError(emailInput);
  clearError(phoneInput);
  isValid = validateNameInput(nameInput) && isValid;
  isValid = validateEmailInput(emailInput) && isValid;
  isValid = validatePhoneInput(phoneInput) && isValid;
  return isValid;
}

/**
 * Validiert die Namenseingabe im Bearbeitungsformular
 * @param {HTMLElement} nameInput - Das Namenseingabefeld
 * @returns {boolean} True wenn der Name gültig ist
 */
function validateNameInput(nameInput) {
  if (nameInput && nameInput.value.trim() === "") {
    showError(nameInput, "Name ist erforderlich");
    return false;
  }
  return true;
}

/**
 * Validiert die E-Mail-Eingabe im Bearbeitungsformular
 * @param {HTMLElement} emailInput - Das E-Mail-Eingabefeld
 * @returns {boolean} True wenn die E-Mail gültig ist
 */
function validateEmailInput(emailInput) {
  if (emailInput && !validateEmail(emailInput.value)) {
    showError(emailInput, "Ungültige E-Mail-Adresse");
    return false;
  }
  return true;
}

/**
 * Validiert die Telefonnummereingabe im Bearbeitungsformular
 * @param {HTMLElement} phoneInput - Das Telefonnummer-Eingabefeld
 * @returns {boolean} True wenn die Telefonnummer gültig ist
 */
function validatePhoneInput(phoneInput) {
  if (phoneInput) {
    if (!validatePhoneStart(phoneInput.value)) {
      showError(phoneInput, "Telefonnummer muss mit + oder 0 beginnen");
      return false;
    } else if (!validatePhoneLength(phoneInput.value)) {
      showError(
        phoneInput,
        "Telefonnummer muss zwischen 10 und 14 Ziffern haben"
      );
      return false;
    }
  }
  return true;
}

/**
 * Löscht einen Kontakt aus dem Bearbeiten-Modus heraus
 */
function deleteContactFromEdit() {
  if (currentEditingContact) {
    deleteContact(currentEditingContact);
    closeEditContactsOverlay();
  }
}