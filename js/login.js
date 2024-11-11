

let msgBox = document.getElementById('msgBox');
let urlParms = new URLSearchParams(window.location.search);
const msg = urlParms.get('msg');
if(msg){
 msgBox.innerHTML = msg;

}
//falls aufgerufen wird die Erfolgsnachricht verschwinden
function hideMsgBox(){
    const msgB = document.getElementById('msgBox');
    if(msgB){
        msgB.style.display = 'none';
    }
}
//Aufruf der hideMsgBox() in einer setTimeout function
setTimeout(hideMsgBox, 3000);

async function getUserData() {
    try {
        const response = await fetch(_URL + "/user.json");
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Benutzerdaten');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data: ' + error.message);
        return null;
    }
}

let isGuest = false; 

function setGuestMode() {
    isGuest = true;
    console.log("Gast-Modus aktiviert:", isGuest);
    localStorage.setItem('currentUser', 'G');
    localStorage.setItem('onlineUser', 'Gast');
    window.location.href = 'pages/summary.html?msg=Login erfolgreich';

   
}

// Event-Listener für den Klick auf den Button mit der ID "guest"
document.getElementById('guest').addEventListener('click', setGuestMode);


// Funktion zur Authentifizierung des Benutzers
/*async function loginUser(email, password) {
    const users = await getUserData();
    if (users) {

        const userArray = Object.values(users); // Daten aus Firebase in ein Array umwandeln
        const user = userArray.find(user => user.email === email && user.password === password);

        if (user) {
            window.location.href = 'pages/summary.html?msg=Login erfolgreich';
            // Speichern des ersten Buchstabens des Benutzernamens
            const onlineUser = user.username;
            const currentUser = user.username.charAt(0).toUpperCase();
            //Speichern des Namens
            localStorage.setItem('onlineUser', onlineUser);
            // Speichern des ersten Buchstabens des Benutzernamens im lokalen Speicher (localStorage)
            localStorage.setItem('currentUser', currentUser);
           
            
        } 
        else {
            console.log("Ungültige E-Mail oder Passwort");
            alert("Ungültige E-Mail oder Passwort");
        }
    } else {
        console.log("Keine Benutzer gefunden");
        alert("Keine Benutzer gefunden");
    }
}

document.getElementById('log').addEventListener('click', loginUser);

*/
async function loginUser(email, password) {
    // Funktion zum Anzeigen der Nachricht
    function showMessage(message, type) {
        const popup = document.getElementById('message-popup');
        popup.textContent = message;
        popup.className = type;
        popup.style.display = 'block';

        // Nachricht nach 3 Sekunden ausblenden
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000);
    }

    try {
        const users = await getUserData();
        if (users) {
            const userArray = Object.values(users);
            const user = userArray.find(user => 
                user.email === email && user.password === password
            );

            if (user) {
                // Login erfolgreich
                const onlineUser = user.username;
                const currentUser = user.username.charAt(0).toUpperCase();
                localStorage.setItem('onlineUser', onlineUser);
                localStorage.setItem('currentUser', currentUser);
                
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

// Event Listener für den Login-Button
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
});


