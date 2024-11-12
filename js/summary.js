const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app"
const onlineUser = localStorage.getItem('onlineUser');
let tasks = []
let datsArray = [];
let deadline ;
let tasksInBoard;
let awaitFeedbackTasks = [];
let inProgressTasks = [];
let toDoTasks = [];
let doneTasks = [];
let toDoNum;
let progressNum;
let awitingFeedbackNum;
let doneNum;

 // Funktion zum Abrufen des Benutzernamens aus localStorage und Anzeigen in summary.html
 function displayOnlinetUser() {
     
    const onlineUser = localStorage.getItem('onlineUser');
    const currentUser = localStorage.getItem('currentUser');
    console.log('onlineUser:', onlineUser);
    console.log('currentUser:', currentUser);
    if (onlineUser) {
        const y = document.getElementById('userCircle');
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
        tasks = Object.values(data);
        tasks.forEach(function(taskObject) {
            datsArray.push(taskObject.dueDate);
        });

  
        datsArray.sort(function(a, b) {
            return new Date(a) - new Date(b);
        });

        deadlineRender()

       
          getCategory()

    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data: ' + error.message);
        return null;
    }
   // console.log(tasks.length);
}
function deadlineRender(){
  deadline = datsArray[0];
  
  tasksInBoard = tasks.length;

 
  document.getElementById('uncomming-Deadline').innerHTML += `<h3>${deadline}</h3>`;
   
    document.getElementById('tasksInBoard').innerHTML += `<h1>${tasksInBoard}</h1>`

}

getTasksData()

function getCategory(){
  // Array durchlaufen und sortieren
  tasks.forEach(function(task) {
    //  `category`-Wert aus `taskCategory`rausholen
    var category = task.taskCategory.category;

    // Sortiere je nach `category` ins entsprechende Array
    if (category === "awaitFeedback") {
        awaitFeedbackTasks.push(task);
    } else if (category === "inProgress") {
        inProgressTasks.push(task);
    } else if (category === "toDo") {
        toDoTasks.push(task);
    } else if (category === "done") {
        doneTasks.push(task);
    }
  });
  render()

  // Ergebnis: Die Aufgaben sind in die vier Arrays aufgeteilt
  console.log("Await Feedback Tasks:", awaitFeedbackTasks);
  console.log("In Progress Tasks:", inProgressTasks);
  console.log("To Do Tasks:", toDoTasks);
  console.log("Done Tasks:", doneTasks);

}
function render(){
  toDoNum = toDoTasks.length;
  progressNum = inProgressTasks.length;
  awitingFeedbackNum = awaitFeedbackTasks.length
  doneNum = doneTasks.length;
  document.getElementById('to-do').innerHTML += `<h1>${toDoNum}</h1>`;
  document.getElementById('progress-task').innerHTML += `<h1>${progressNum}</h1>`;
  document.getElementById('awaiting-task').innerHTML += `<h1>${awitingFeedbackNum}</h1>`;
  document.getElementById('tasks-Done').innerHTML += `<h1>${doneNum}</h1>`;

}

// Funktion, um das Overlay anzuzeigen, wenn auf `userCircle` geklickt wird
function showOverlay(id) {
    document.getElementById('overlay').classList.remove('d-none');
  }
  
  // Funktion, um das Overlay auszublenden, wenn außerhalb des `userCircle` geklickt wird
  function hideOverlay(event) {
    const userCircle = document.getElementById('userCircle');
    const overlay = document.getElementById('overlay');
  //hier wird sicher gestellt, ob der cklick Ausserhalb des divs userCircle ist
    if (!userCircle.contains(event.target) && !overlay.classList.contains('d-none')) {
      overlay.classList.add('d-none');
    }
  }
  
 
  document.addEventListener('click', hideOverlay);
