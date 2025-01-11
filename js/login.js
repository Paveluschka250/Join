/**
 * Globales Message-Box Element
 * @type {HTMLElement}
 */
let msgBox = document.getElementById('msgBox');

/**
 * URL-Parameter-Objekt zur Verarbeitung von Query-Parametern
 * @type {URLSearchParams}
 */
let urlParms = new URLSearchParams(window.location.search);

/**
 * Nachrichtenparameter aus der URL
 * @type {string|null}
 */
const msg = urlParms.get('msg');

if(msg){
    msgBox.innerHTML = msg;
}

/**
 * Blendet die Message-Box nach einer Verzögerung aus
 * @returns {void}
 */
function hideMsgBox(){
    const msgB = document.getElementById('msgBox');
    if(msgB){
        msgB.style.display = 'none';
    }
}

setTimeout(hideMsgBox, 3000);

/**
 * Ruft Benutzerdaten vom Backend ab
 * @async
 * @returns {Promise<Object|null>} Das Benutzerdaten-Objekt oder null bei einem Fehler
 * @throws {Error} Wenn ein Fehler beim Abrufen der Daten auftritt
 */
async function getUserData() {
    try {
        const response = await fetch(_URL + "/user.json");
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Benutzerdaten');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler:', error);
        alert('Fehler beim Abrufen der Benutzerdaten: ' + error.message);
        return null;
    }
}

/**
 * Flag zur Verfolgung des Gast-Modus
 * @type {boolean}
 */
let isGuest = false; 

/**
 * Aktiviert den Gast-Modus und leitet zur Übersichtsseite weiter
 * @returns {void}
 */
function setGuestMode() {
    isGuest = true;
    console.log("Gast-Modus aktiviert:", isGuest);
    localStorage.setItem('currentUser', 'G');
    localStorage.setItem('onlineUser', 'Gast');
    window.location.href = 'pages/summary.html?msg=Login erfolgreich';
}

document.getElementById('guest').addEventListener('click', setGuestMode);

/**
 * Verarbeitet den Benutzer-Login-Prozess
 * @async
 * @param {string} email - Die E-Mail-Adresse des Benutzers
 * @param {string} password - Das Passwort des Benutzers
 * @returns {Promise<void>}
 */
async function loginUser(email, password) {
    /**
     * Zeigt eine Popup-Nachricht für den Benutzer an
     * @param {string} message - Die anzuzeigende Nachricht
     * @param {string} type - Der Nachrichtentyp ('success' oder 'error')
     * @returns {void}
     */
    function showMessage(message, type) {
        const popup = document.getElementById('message-popup');
        popup.textContent = message;
        popup.className = type;
        popup.style.display = 'block';

        setTimeout(() => {
            popup.style.display = 'none';
        }, 5000);
    }

    try {
        const users = await getUserData();
        if (users) {
            const userArray = Object.values(users);
            const user = userArray.find(user => 
                user.email === email && user.password === password
            );

            if (user) {
                const onlineUser = user.username;
                const nameParts = user.username.split(' ');
                const initials = (nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : '')).toUpperCase();
                
                localStorage.setItem('onlineUser', onlineUser);
                localStorage.setItem('currentUser', initials);
                
                showMessage('Login erfolgreich', 'success');
                
                setTimeout(() => {
                    window.location.href = 'pages/summary.html?msg=Login erfolgreich';
                }, 1000);
            } else {
                console.log("Ungültige E-Mail oder Passwort");
                showMessage('Ungültige E-Mail oder Passwort', 'error');
            }
        } else {
            console.log("Keine Benutzer gefunden");
            showMessage('Keine Benutzer gefunden', 'error');
        }
    } catch (error) {
        console.error("Fehler beim Login:", error);
        showMessage('Ein Fehler ist aufgetreten', 'error');
    }
}

// Event-Listener für das Absenden des Formulars
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
});
