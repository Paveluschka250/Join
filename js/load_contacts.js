// Kontakte aus dem localStorage laden oder initialisieren, falls nicht vorhanden
let contacts = JSON.parse(localStorage.getItem('contacts')) || [
  {
      name: "Max Mustermann",
      email: "max.mustermann@example.com",
      phoneNumber: "+49 171 1234567"
  },
  {
      name: "Erika Musterfrau",
      email: "erika.musterfrau@example.com",
      phoneNumber: "+49 171 2345678"
  },
  {
      name: "Hans Meier",
      email: "hans.meier@example.com",
      phoneNumber: "+49 171 3456789"
  },
  {
      name: "Anna Schmidt",
      email: "anna.schmidt@example.com",
      phoneNumber: "+49 171 4567890"
  },
  {
      name: "Peter Müller",
      email: "peter.mueller@example.com",
      phoneNumber: "+49 171 5678901"
  },
  {
      name: "Julia Schneider",
      email: "julia.schneider@example.com",
      phoneNumber: "+49 171 6789012"
  },
  {
      name: "Thomas Weber",
      email: "thomas.weber@example.com",
      phoneNumber: "+49 171 7890123"
  },
  {
      name: "Sabine Fischer",
      email: "sabine.fischer@example.com",
      phoneNumber: "+49 171 8901234"
  },
  {
      name: "Klaus Wagner",
      email: "klaus.wagner@example.com",
      phoneNumber: "+49 171 9012345"
  },
  {
      name: "Martina Becker",
      email: "martina.becker@example.com",
      phoneNumber: "+49 171 0123456"
  }
];

// Fügen Sie diese Variable am Anfang der Datei hinzu
let currentEditingContact = null;

document.addEventListener('DOMContentLoaded', function () {
  renderContacts(contacts);
  
  // Fügen Sie diese Zeilen hinzu
  document.querySelector('.sticky-button-wrapper button').onclick = openContactsOverlay;
  document.getElementById('closeOverlay').onclick = closeContactsOverlay;
  document.getElementById('addContactForm').addEventListener('submit', addNewContact);
  document.getElementById('editContactForm').addEventListener('submit', saveEditedContact);
});

function renderContacts(contacts) {
    const contactsList = document.getElementById('contacts-list');
    let currentLetter = '';
    let htmlContent = '';

    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // Fügen Sie eine Klasse hinzu, um die Ausblend-Animation zu triggern
    const existingContacts = contactsList.querySelectorAll('.contact-item');
    existingContacts.forEach(contact => {
        contact.classList.add('slide-out');
    });

    // Warten Sie, bis die Ausblend-Animation abgeschlossen ist
    setTimeout(() => {
        // Leere die Liste, bevor neue Kontakte hinzugefügt werden
        contactsList.innerHTML = '';

        for (let contact of contacts) {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            const color = getRandomColor();

            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                htmlContent += `<div class="contact-group">
                                    <b>${currentLetter}</b>
                                </div>
                                <div class="contact-line"></div>`;
            }

            htmlContent += `<div class="contact-item" data-name="${contact.name}" data-email="${contact.email}" data-phone="${contact.phoneNumber}" data-color="${color}">
                                <div class="avatar" style="background-color: ${color};">${contact.name.charAt(0)}</div>
                                <div class="contact-details">
                                    <span class="name">${contact.name}</span>
                                    <span class="email">${contact.email}</span>
                                </div>
                            </div>`;
        }

        // Füge den neuen HTML-Inhalt hinzu
        contactsList.innerHTML = htmlContent;

        // Füge die Einblend-Animation hinzu, nachdem der neue Inhalt hinzugefügt wurde
        const newContacts = contactsList.querySelectorAll('.contact-item');
        newContacts.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // Füge Event-Listener hinzu
        newContacts.forEach(item => {
            item.addEventListener('click', function () {
                const name = this.getAttribute('data-name');
                const email = this.getAttribute('data-email');
                const phone = this.getAttribute('data-phone');
                const color = this.getAttribute('data-color');
                updateContactDetails(name, email, phone, color);

                const contactInfo = document.querySelector('.contact-info');
                if (!contactInfo.classList.contains('active')) {
                    contactInfo.classList.add('active');
                } else {
                    contactInfo.classList.remove('active');
                    setTimeout(() => {
                        contactInfo.classList.add('active');
                    }, 50);
                }
            });
        });
    }, 500); // Warten Sie 500ms, bis die Ausblend-Animation abgeschlossen ist
}

function getRandomColor() {
  const colors = ['#4285f4', '#db4437', '#f4b400', '#0f9d58', '#ab47bc', '#ff7043'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function updateContactDetails(name, email, phone, color) {
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
  const shortnameElement = document.querySelector('.shortname');
  shortnameElement.textContent = initials;
  shortnameElement.style.backgroundColor = color;
  document.querySelector('.full-name').textContent = name;
  document.querySelector('.detail.email .blue-text').textContent = email;
  document.querySelector('.detail.phone p').textContent = phone;

  const deleteButton = document.querySelector('.action.delete');
  deleteButton.onclick = function () {
      deleteContact(name);
  };

  const editButton = document.querySelector('.action.edit');
  editButton.onclick = function () {
    openEditContactsOverlay(name, email, phone, color);
  };
}

function deleteContact(name) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Füge allen Kontakten die 'slide-out' Klasse hinzu
    contactItems.forEach(item => {
        item.classList.add('slide-out');
    });

    // Warte, bis die Ausblend-Animation abgeschlossen ist
    setTimeout(() => {
        // Entferne den Kontakt aus dem Array
        contacts = contacts.filter(contact => contact.name !== name);

        // Aktualisiere das localStorage
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Rendere die Kontakte neu
        renderContacts(contacts);

        // Falls das gerade gelöschte Kontakt-Element angezeigt wurde, lösche die Details aus der rechten Info-Box
        clearContactDetails();
    }, 500); // Zeit passend zur CSS-Animation
}

function clearContactDetails() {
  document.querySelector('.shortname').textContent = '';
  document.querySelector('.full-name').textContent = '';
  document.querySelector('.detail.email .blue-text').textContent = '';
  document.querySelector('.detail.phone p').textContent = '';

  document.querySelector('.contact-info').classList.remove('active');
}

function setupOverlayBackgroundListener() {
  const background = document.querySelector('.overlay-background');
  if (background) {
    background.addEventListener('click', function() {
      closeContactsOverlay();
      closeEditContactsOverlay();
    });
  }
}

function openContactsOverlay() {
  const overlay = document.getElementById('contacts-overlay');
  overlay.classList.remove('inactive');
  overlay.classList.add('active');
  document.body.insertAdjacentHTML('beforeend', '<div class="overlay-background"></div>');
  setTimeout(() => {
    document.querySelector('.overlay-background').classList.add('active');
    setupOverlayBackgroundListener(); // Fügen Sie diese Zeile hinzu
  }, 10);
}

function closeContactsOverlay() {
  const overlay = document.getElementById('contacts-overlay');
  overlay.classList.remove('active');
  overlay.classList.add('inactive');
  const background = document.querySelector('.overlay-background');
  if (background) {
    background.classList.remove('active');
    background.removeEventListener('click', closeContactsOverlay); // Entfernen Sie den Event-Listener
    setTimeout(() => {
      background.remove();
    }, 300);
  }
}

// Fügen Sie diese Funktion am Ende der Datei hinzu
function addNewContact(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  
  const newContact = {
    name: name,
    email: email,
    phoneNumber: phone
  };
  
  contacts.push(newContact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  
  renderContacts(contacts);
  closeContactsOverlay();
  
  // Formular zurücksetzen
  document.getElementById('addContactForm').reset();
}
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhoneStart(phone) {
  return phone.startsWith('+') || phone.startsWith('0');
}

function validatePhoneLength(phone) {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 14;
}

function showError(inputElement, errorMessage) {
  if (!inputElement) return;
  
  inputElement.classList.add('error');
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add('visible');
  }
}

function clearError(inputElement) {
  if (!inputElement) return;
  
  inputElement.classList.remove('error');
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
}

function validateForm() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  let isValid = true;

  clearError(nameInput);
  clearError(emailInput);
  clearError(phoneInput);

  if (nameInput.value.trim() === '') {
    showError(nameInput, 'Name ist erforderlich');
    isValid = false;
  }

  if (!validateEmail(emailInput.value)) {
    showError(emailInput, 'Ungültige E-Mail-Adresse');
    isValid = false;
  }

  if (!validatePhoneStart(phoneInput.value)) {
    showError(phoneInput, 'Telefonnummer muss mit + oder 0 beginnen');
    isValid = false;
  } else if (!validatePhoneLength(phoneInput.value)) {
    showError(phoneInput, 'Telefonnummer muss zwischen 10 und 14 Ziffern haben');
    isValid = false;
  }

  return isValid;
}

// Fügen Sie diese neuen Funktionen hinzu
function openEditContactsOverlay(name, email, phone, color) {
  const overlay = document.getElementById('edit-contact-overlay');
  overlay.classList.remove('inactive');
  overlay.classList.add('active');
  
  document.getElementById('editName').value = name;
  document.getElementById('editEmail').value = email;
  document.getElementById('editPhone').value = phone;
  
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
  const initialsElement = document.getElementById('editContactInitials');
  initialsElement.textContent = initials;
  initialsElement.style.backgroundColor = color;
  
  currentEditingContact = name;
  
  document.body.insertAdjacentHTML('beforeend', '<div class="overlay-background"></div>');
  setTimeout(() => {
    document.querySelector('.overlay-background').classList.add('active');
    setupOverlayBackgroundListener();
  }, 10);
}

function closeEditContactsOverlay() {
  const overlay = document.getElementById('edit-contact-overlay');
  overlay.classList.remove('active');
  overlay.classList.add('inactive');
  const background = document.querySelector('.overlay-background');
  if (background) {
    background.classList.remove('active');
    background.removeEventListener('click', closeEditContactsOverlay);
    setTimeout(() => {
      background.remove();
    }, 300);
  }
  currentEditingContact = null;
}

function deleteContactFromEdit() {
  if (currentEditingContact) {
    deleteContact(currentEditingContact);
    closeEditContactsOverlay();
  }
}

// Fügen Sie diese neue Funktion hinzu
function saveEditedContact() {
  if (!validateEditForm()) {
    return;
  }
  
  const newName = document.getElementById('editName').value;
  const newEmail = document.getElementById('editEmail').value;
  const newPhone = document.getElementById('editPhone').value;
  
  const contactIndex = contacts.findIndex(contact => contact.name === currentEditingContact);
  
  if (contactIndex !== -1) {
    contacts[contactIndex] = {
      name: newName,
      email: newEmail,
      phoneNumber: newPhone
    };
    
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts(contacts);
    closeEditContactsOverlay();
    
    // Aktualisiere die Kontaktdetails in der Ansicht
    const color = document.querySelector('.shortname').style.backgroundColor;
    updateContactDetails(newName, newEmail, newPhone, color);
  }
}

function validateEditForm() {
  const nameInput = document.getElementById('editName');
  const emailInput = document.getElementById('editEmail');
  const phoneInput = document.getElementById('editPhone');
  let isValid = true;

  clearError(nameInput);
  clearError(emailInput);
  clearError(phoneInput);

  if (nameInput && nameInput.value.trim() === '') {
    showError(nameInput, 'Name ist erforderlich');
    isValid = false;
  }

  if (emailInput && !validateEmail(emailInput.value)) {
    showError(emailInput, 'Ungültige E-Mail-Adresse');
    isValid = false;
  }

  if (phoneInput) {
    if (!validatePhoneStart(phoneInput.value)) {
      showError(phoneInput, 'Telefonnummer muss mit + oder 0 beginnen');
      isValid = false;
    } else if (!validatePhoneLength(phoneInput.value)) {
      showError(phoneInput, 'Telefonnummer muss zwischen 10 und 14 Ziffern haben');
      isValid = false;
    }
  }

  return isValid;
}
