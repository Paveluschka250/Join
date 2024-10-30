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

function removeExistingContacts(contactsList) {
  const existingContacts = contactsList.querySelectorAll(".contact-item");
  existingContacts.forEach((contact) => {
    contact.classList.add("slide-out");
  });
}

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

function generateContactGroupHTML(currentLetter) {
  return `
    <div class="contact-group">
      <b>${currentLetter}</b>
    </div>
    <div class="contact-line"></div>
  `;
}

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

function updateShortnameElement(name, color) {
  const initials = getInitials(name);
  const shortnameElement = document.querySelector(".shortname");
  shortnameElement.textContent = initials;
  shortnameElement.style.backgroundColor = color;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function updateContactInfo(name, email, phone) {
  document.querySelector(".full-name").textContent = name;
  document.querySelector(".detail.email .blue-text").textContent = email;
  document.querySelector(".detail.phone p").textContent = phone;
}

function setupDeleteButton(name) {
  const deleteButton = document.querySelector(".action.delete");
  deleteButton.onclick = function () {
    deleteContact(name);
  };
}

function setupEditButton(name, email, phone, color) {
  const editButton = document.querySelector(".action.edit");
  editButton.onclick = function () {
    openEditContactsOverlay(name, email, phone, color);
  };
}

function activateContactInfo() {
  const contactInfo = document.querySelector(".contact-info");
  contactInfo.classList.remove("closing");
  contactInfo.classList.add("active");
}

function setupEditDeleteButton() {
  const editDeleteButton = document.querySelector(".edit-delete-button");
  editDeleteButton.onclick = function (event) {
    event.stopPropagation();
    showEditDeleteOverlay();
  };
}

function setupEditContactButton(name, email, phone, color) {
  document.getElementById("editContactBtn").onclick = function () {
    hideEditDeleteOverlay();
    openEditContactsOverlay(name, email, phone, color);
  };
}

function setupDeleteContactButton(name) {
  document.getElementById("deleteContactBtn").onclick = function () {
    hideEditDeleteOverlay();
    deleteContact(name);
  };
}

function openEditContactsOverlay(name, email, phone, color) {
  activateEditContactOverlay();
  fillEditContactForm(name, email, phone);
  setContactInitials(name, color);
  setCurrentEditingContact(name);
  createOverlayBackground();
}

function activateEditContactOverlay() {
  const overlay = document.getElementById("edit-contact-overlay");
  overlay.classList.remove("inactive");
  overlay.classList.add("active");
}

function fillEditContactForm(name, email, phone) {
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
}

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

function setCurrentEditingContact(name) {
  currentEditingContact = name;
}

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

function closeEditContactsOverlay() {
  const overlay = document.getElementById("edit-contact-overlay");
  overlay.classList.remove("active");
  overlay.classList.add("inactive");
  const background = document.querySelector(".overlay-background");
  if (background) {
    background.classList.remove("active");
    background.removeEventListener("click", closeEditContactsOverlay);
    setTimeout(() => {
      background.remove();
    }, 300);
  }
  currentEditingContact = null;
}

function showEditDeleteOverlay() {
  const overlay = document.querySelector(".edit-delete-overlay");
  overlay.classList.add("active");
}

function hideEditDeleteOverlay() {
  const overlay = document.querySelector(".edit-delete-overlay");
  overlay.classList.remove("active");
}

function setupOverlayBackgroundListener() {
  const background = document.querySelector(".overlay-background");
  if (background) {
    background.addEventListener("click", function () {
      closeContactsOverlay();
      closeEditContactsOverlay();
    });
  }
}

function closeContactInfo() {
  const contactInfo = document.querySelector(".contact-info");
  contactInfo.classList.add("closing");

  setTimeout(() => {
    contactInfo.classList.remove("active");
    contactInfo.classList.remove("closing");
  }, 300);
}
