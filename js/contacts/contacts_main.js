let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let currentEditingContact = null;

async function initializeContacts() {
  if (contacts.length === 0) {
    contacts = await downloadContactsFromFirebase();
    logContacts();
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

function logContacts() {
  console.log("Current contacts:", JSON.stringify(contacts, null, 2));
}

initializeContacts(); 

async function addNewContact(event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const newContact = {
    name: name,
    email: email,
    phoneNumber: phone,
  };
  const addedContact = await addContactToFirebase(newContact);
  if (addedContact) {
    contacts.push(addedContact);
    renderContacts(contacts);
    closeContactsOverlay();
    document.getElementById("addContactForm").reset();
  }
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
  const newName = document.getElementById("editName").value;
  const newEmail = document.getElementById("editEmail").value;
  const newPhone = document.getElementById("editPhone").value;
  const contactToUpdate = contacts.find(
    (contact) => contact.name === currentEditingContact
  );
  if (contactToUpdate) {
    const updatedContact = {
      name: newName,
      email: newEmail,
      phoneNumber: newPhone,
    };
    try {
      await updateContactInFirebase(contactToUpdate.id, updatedContact);
      const index = contacts.findIndex((c) => c.id === contactToUpdate.id);
      if (index !== -1) {
        contacts[index] = { ...contacts[index], ...updatedContact };
      }
      renderContacts(contacts);
      closeEditContactsOverlay();
      const color = document.querySelector(".shortname").style.backgroundColor;
      updateContactDetails(newName, newEmail, newPhone, color);
    } catch (error) {
      console.error("Fehler beim Speichern des bearbeiteten Kontakts:", error);
      alert("Es gab einen Fehler beim Speichern des Kontakts. Bitte versuchen Sie es später erneut.");
    }
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
  if (nameInput && nameInput.value.trim() === "") {
    showError(nameInput, "Name ist erforderlich");
    isValid = false;
  }
  if (emailInput && !validateEmail(emailInput.value)) {
    showError(emailInput, "Ungültige E-Mail-Adresse");
    isValid = false;
  }
  if (phoneInput) {
    if (!validatePhoneStart(phoneInput.value)) {
      showError(phoneInput, "Telefonnummer muss mit + oder 0 beginnen");
      isValid = false;
    } else if (!validatePhoneLength(phoneInput.value)) {
      showError(
        phoneInput,
        "Telefonnummer muss zwischen 10 und 14 Ziffern haben"
      );
      isValid = false;
    }
  }
  return isValid;
}

function deleteContactFromEdit() {
  if (currentEditingContact) {
    deleteContact(currentEditingContact);
    closeEditContactsOverlay();
  }
}