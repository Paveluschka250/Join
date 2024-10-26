const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app"
const onlineUser = localStorage.getItem('onlineUser');
let tasks = []
let datsArray = [];
let deadline ;

 // Funktion zum Abrufen des Benutzernamens aus localStorage und Anzeigen in summary.html
 function displayOnlinetUser() {
     
    const onlineUser = localStorage.getItem('onlineUser');
    const currentUser = localStorage.getItem('currentUser');
    console.log('onlineUser:', onlineUser);
    console.log('currentUser:', currentUser);
    if (onlineUser) {
        const y = document.getElementById('userCircle')
        const userGreeting = document.getElementById('secPart');
        if (userGreeting) {
            userGreeting.innerHTML = onlineUser;
            y.innerHTML += `<h4>${currentUser}</h4`
        } else {
            console.error('Das Element mit der ID "secPart" wurde nicht gefunden.');
        }
    } else {
        console.error('onlineUser existiert nicht im localStorage.');
    }
}

// Event-Listener, der aufgerufen wird, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded',  displayOnlinetUser);



async function getTasksData() {
    try {
        const response = await fetch(_URL + "/tasks/toDo.json");
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Daten');
        }
        const data = await response.json();
        console.log(data)
         tasks = Object.values(data);
         console.log(tasks.length)
        
        tasks.forEach(Object=>{
            datsArray.push(Object.dueDate);
        });
        console.log(datsArray);
        datsArray.sort((a, b) => new Date(a) -new Date(b));
        console.log(datsArray)
        deadline = datsArray [0]
        console.log(deadline)
        document.getElementById('uncomming-Deadline').innerHTML += `<h3>${deadline}</h3>`

    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data: ' + error.message);
        return null;
    }
    console.log(tasks.length)
}

getTasksData()








