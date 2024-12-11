let msgBox = document.getElementById('msgBox');
let urlParms = new URLSearchParams(window.location.search);
const msg = urlParms.get('msg');
if(msg){
 msgBox.innerHTML = msg;

}

function hideMsgBox(){
    const msgB = document.getElementById('msgBox');
    if(msgB){
        msgB.style.display = 'none';
    }
}

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


document.getElementById('guest').addEventListener('click', setGuestMode);


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

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
});


