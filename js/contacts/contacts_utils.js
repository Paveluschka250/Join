/**
 * Generiert eine zufällige Farbe aus einer vordefinierten Liste
 * @returns {string} Ein Hex-Farbcode
 */
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

/**
 * Überprüft ob eine E-Mail-Adresse gültig ist
 * @param {string} email - Die zu prüfende E-Mail-Adresse
 * @returns {boolean} True wenn die E-Mail gültig ist
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Prüft ob eine Telefonnummer mit + oder 0 beginnt
 * @param {string} phone - Die zu prüfende Telefonnummer
 * @returns {boolean} True wenn die Nummer korrekt beginnt
 */
function validatePhoneStart(phone) {
  return phone.startsWith("+") || phone.startsWith("0");
}

/**
 * Prüft die Länge einer Telefonnummer (10-14 Ziffern)
 * @param {string} phone - Die zu prüfende Telefonnummer
 * @returns {boolean} True wenn die Länge korrekt ist
 */
function validatePhoneLength(phone) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 14;
}

/**
 * Zeigt eine Fehlermeldung für ein Eingabefeld an
 * @param {HTMLElement} inputElement - Das Eingabefeld mit dem Fehler
 * @param {string} errorMessage - Die anzuzeigende Fehlermeldung
 */
function showError(inputElement, errorMessage) {
  if (!inputElement) return;

  inputElement.classList.add("error");
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add("visible");
  }
}

/**
 * Entfernt die Fehleranzeige von einem Eingabefeld
 * @param {HTMLElement} inputElement - Das Eingabefeld
 */
function clearError(inputElement) {
  if (!inputElement) return;
  
  inputElement.classList.remove("error");
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
  }
}

/**
 * Validiert das gesamte Kontaktformular
 * @returns {boolean} True wenn alle Eingaben gültig sind
 */
function validateForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  let isValid = true;
  
  isValid = validateNameInput(nameInput) && isValid;
  isValid = validateEmailInput(emailInput) && isValid;
  isValid = validatePhoneInput(phoneInput) && isValid;
  
  return isValid;
}

/**
 * Validiert die Namenseingabe
 * @param {HTMLElement} nameInput - Das Namenseingabefeld
 * @returns {boolean} True wenn der Name gültig ist
 */
function validateNameInput(nameInput) {
  clearError(nameInput);
  if (nameInput.value.trim() === "") {
    showError(nameInput, "Name ist erforderlich");
    return false;
  }
  return true;
}

/**
 * Validiert die E-Mail-Eingabe
 * @param {HTMLElement} emailInput - Das E-Mail-Eingabefeld
 * @returns {boolean} True wenn die E-Mail gültig ist
 */
function validateEmailInput(emailInput) {
  clearError(emailInput);
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "Ungültige E-Mail-Adresse");
    return false;
  }
  return true;
}

/**
 * Validiert die Telefonnummereingabe
 * @param {HTMLElement} phoneInput - Das Telefonnummer-Eingabefeld
 * @returns {boolean} True wenn die Telefonnummer gültig ist
 */
function validatePhoneInput(phoneInput) {
  clearError(phoneInput);
  if (!validatePhoneStart(phoneInput.value)) {
    showError(phoneInput, "Telefonnummer muss mit + oder 0 beginnen");
    return false;
  } else if (!validatePhoneLength(phoneInput.value)) {
    showError(phoneInput, "Telefonnummer muss zwischen 10 und 14 Ziffern haben");
    return false;
  }
  return true;
}
