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

async function loginUser(email, password) {
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
                // Login erfolgreich
                const onlineUser = user.username;
                // Teile den Benutzernamen in Vor- und Nachnamen
                const nameParts = user.username.split(' ');
                // Hole die Initialen (erster Buchstabe vom Vornamen + erster Buchstabe vom Nachnamen)
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

// Event Listener für den Login-Button
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
});


function logout() {
    // Session-Cookie löschen
    document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // SessionStorage leeren
    sessionStorage.clear();
    
    // LocalStorage leeren (optional)
    localStorage.clear();
    
    // API-Aufruf zum Server-seitigen Session Destroy
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'  // wichtig für Session-Cookies
    })
    .then(response => {
        if (response.ok) {
            // Weiterleitung zur Login-Seite
            window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
}