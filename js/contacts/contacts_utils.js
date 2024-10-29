function getRandomColor() {
  const colors = [
    "#4285f4",
    "#db4437",
    "#f4b400",
    "#0f9d58",
    "#ab47bc",
    "#ff7043",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhoneStart(phone) {
  return phone.startsWith("+") || phone.startsWith("0");
}

function validatePhoneLength(phone) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 14;
}

function showError(inputElement, errorMessage) {
  if (!inputElement) return;

  inputElement.classList.add("error");
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add("visible");
  }
}

function clearError(inputElement) {
  if (!inputElement) return;
  
  inputElement.classList.remove("error");
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
  }
}

function validateForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  let isValid = true;
  
  clearError(nameInput);
  clearError(emailInput);
  clearError(phoneInput);
  
  if (nameInput.value.trim() === "") {
    showError(nameInput, "Name ist erforderlich");
    isValid = false;
  }
  
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "Ungültige E-Mail-Adresse");
    isValid = false;
  }
  
  if (!validatePhoneStart(phoneInput.value)) {
    showError(phoneInput, "Telefonnummer muss mit + oder 0 beginnen");
    isValid = false;
  } else if (!validatePhoneLength(phoneInput.value)) {
    showError(phoneInput, "Telefonnummer muss zwischen 10 und 14 Ziffern haben");
    isValid = false;
  }
  
  return isValid;
}

// ... Weitere Hilfsfunktionen ... 