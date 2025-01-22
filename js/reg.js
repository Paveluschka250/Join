/**
 * @fileoverview Registrierungsmodul für neue Benutzer mit Validierung und Datenbankanbindung
 * @author Yesser-Ben-Amor
 * @version 1.0.0
 * @license MIT
 * @created 2025-01-17
 */

/**
 * Array von Beispielbenutzern für Testzwecke
 * @type {Array<{email: string, password: string}>}
 */
let users = [
    {
     'email':'yesser@zf.com',
      'password':'test123'
    }
];

/**
 * Basis-URL für die Firebase Realtime Database
 * @constant {string}
 */
const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Verarbeitet die Registrierung eines neuen Benutzers
 * Validiert die Eingaben und sendet die Daten an die Datenbank
 * @returns {void}
 * @throws {Error} Wenn die Passwörter nicht übereinstimmen oder zu kurz sind
 */
function addUser() {
  let username = document.getElementById('benutzername').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let confirmedPw = document.getElementById('passwordConfirm').value;
  let messageContainer = document.getElementById('message-container');
  
  // Formular zurücksetzen
  messageContainer.innerHTML = '';
  document.getElementById('benutzername').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('passwordConfirm').value = '';

  if (confirmedPw === password && password.length > 4) {
    sentDataToDB("/user", { username: username, email: email, password: password });
  } else {
    displayErrorMessage(messageContainer, 'Passwörter stimmen nicht überein oder sind zu kurz!');
  }
}

/**
 * Zeigt eine Fehlermeldung im angegebenen Container an
 * @param {HTMLElement} container - Der Container für die Fehlermeldung
 * @param {string} message - Die anzuzeigende Fehlermeldung
 * @returns {void}
 */
function displayErrorMessage(container, message) {
  let errorDiv = document.createElement('div');
  errorDiv.textContent = message;
  errorDiv.style.color = 'white';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.padding = '10px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.marginTop = '10px';
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '10px';
  errorDiv.style.right = '10px';
  errorDiv.style.transition = 'transform 0.5s ease-in-out';
  errorDiv.style.transform = 'translateX(100%)';
  
  container.appendChild(errorDiv);
  
  // Einblend-Animation
  setTimeout(() => {
    errorDiv.style.transform = 'translateX(0)';
  }, 100);
  
  // Ausblend-Animation und Entfernung
  setTimeout(() => {
    errorDiv.style.transform = 'translateX(100%)';
    setTimeout(() => {
      errorDiv.remove();
    }, 500);
  }, 5000);
}

/**
 * Sendet Daten an die Firebase Realtime Database.
 * Bei erfolgreicher Registrierung wird der Benutzer zur Login-Seite weitergeleitet.
 * @async
 * @param {string} path - Der Pfad in der Datenbank (z.B. "/user")
 * @param {Object} data - Die zu speichernden Benutzerdaten
 * @param {string} data.username - Der Benutzername
 * @param {string} data.email - Die E-Mail-Adresse
 * @param {string} data.password - Das Passwort
 * @returns {Promise<void>}
 * @throws {Error} Wenn die Daten nicht gespeichert werden können
 */
async function sentDataToDB(path="", data={}) {
  try {
    const response = await fetch(_URL + path + ".json", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Fehler beim Schreiben der Benutzerdaten');
    }
    
    window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';
  } catch (error) {
    console.error('Error:', error);
    alert('Error registering user: ' + error.message);
  }
}