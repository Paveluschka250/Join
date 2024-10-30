let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let currentEditingContact = null;

async function initializeContacts() {
  if (contacts.length === 0) {
    contacts = await downloadContactsFromFirebase();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  JSON.parse(localStorage.getItem("contacts"))
    ? renderContacts(contacts)
    : null;
    
  // Button Event Listeners
  document.querySelector(".sticky-button-wrapper button").onclick = openContactsOverlay;
  document.getElementById("closeOverlay").onclick = closeContactsOverlay;
  
  // Form Event Listeners
  document.getElementById("addContactForm").addEventListener("submit", addNewContact);
  document.getElementById("editContactForm").addEventListener("submit", saveEditedContact);
  
  // Edit Contact Event Listeners
  const saveEditedContactBtn = document.getElementById("saveEditedContactBtn");
  if (saveEditedContactBtn) {
    saveEditedContactBtn.addEventListener("click", saveEditedContact);
  }
  
  const editContactForm = document.getElementById("editContactForm");
  if (editContactForm) {
    editContactForm.addEventListener("submit", saveEditedContact);
  }
  
  // Close Contact Info Event Listener
  const closeContactInfoButton = document.getElementById('close-contact-info');
  if (closeContactInfoButton) {
    closeContactInfoButton.addEventListener('click', closeContactInfo);
  }
  
  // Hide Edit Delete Overlay Event Listener
  document.body.addEventListener('click', function() {
    hideEditDeleteOverlay();
  });
});

initializeContacts(); 

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

async function processAddedContact(addedContact) {
  contacts.push(addedContact);
  renderContacts(contacts);
  closeContactsOverlay();
  document.getElementById("addContactForm").reset();
}

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

function clearContactDetails() {
  document.querySelector(".shortname").textContent = "";
  document.querySelector(".full-name").textContent = "";
  document.querySelector(".detail.email .blue-text").textContent = "";
  document.querySelector(".detail.phone p").textContent = "";

  document.querySelector(".contact-info").classList.remove("active");
}

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

function getEditedContactData() {
  return {
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    phoneNumber: document.getElementById("editPhone").value,
  };
}

function findContactToUpdate(name) {
  return contacts.find(contact => contact.name === currentEditingContact);
}

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

function updateContactsArray(id, updatedData) {
  const index = contacts.findIndex(contact => contact.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updatedData };
  }
}

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

function validateNameInput(nameInput) {
  if (nameInput && nameInput.value.trim() === "") {
    showError(nameInput, "Name ist erforderlich");
    return false;
  }
  return true;
}

function validateEmailInput(emailInput) {
  if (emailInput && !validateEmail(emailInput.value)) {
    showError(emailInput, "Ungültige E-Mail-Adresse");
    return false;
  }
  return true;
}

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

function deleteContactFromEdit() {
  if (currentEditingContact) {
    deleteContact(currentEditingContact);
    closeEditContactsOverlay();
  }
}