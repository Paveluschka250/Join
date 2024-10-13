

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
// Funktion zur Authentifizierung des Benutzers
async function loginUser(email, password) {
    const users = await getUserData();
    if (users) {

        const userArray = Object.values(users); // Daten aus Firebase in ein Array umwandeln
        const user = userArray.find(user => user.email === email && user.password === password);

        if (user) {
            // Speichern des ersten Buchstabens des Benutzernamens
            const onlineUser = user.username;
            const currentUser = user.username.charAt(0).toUpperCase();
            //Speichern des Namens
            localStorage.setItem('onlineUser', onlineUser);
            // Speichern des ersten Buchstabens des Benutzernamens im lokalen Speicher (localStorage)
            localStorage.setItem('currentUser', currentUser);
            console.log("Du hast dich erfolgreich eingelogt");
            window.location.href = 'summary.html?msg=Login erfolgreich';
        } else {
            console.log("Ungültige E-Mail oder Passwort");
            alert("Ungültige E-Mail oder Passwort");
        }
    } else {
        console.log("Keine Benutzer gefunden");
        alert("Keine Benutzer gefunden");
    }

}



