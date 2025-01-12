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
let urgentTasks =[];
let urgent;

function updateUserCircle() {
  const onlineUser = localStorage.getItem("onlineUser");

  if (onlineUser && onlineUser != "Gast") {
    const userGreeting = document.getElementById("username");
    if (userGreeting) {
      userGreeting.innerHTML = onlineUser;
    }

    const userCircle = document.getElementById("userCircle");
    if (userCircle) {
      userCircle.innerHTML = "";
      const initial = onlineUser.charAt(0).toUpperCase();
      userCircle.innerHTML = `<h4>${initial}</h4>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', updateUserCircle);

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
   
}
function deadlineRender(){
  deadline = datsArray[0];
  
  tasksInBoard = tasks.length;

 
  document.getElementById('uncomming-Deadline').innerHTML += `<h3>${deadline}</h3>`;
   
    document.getElementById('tasksInBoard').innerHTML += `<h1>${tasksInBoard}</h1>`

}

getTasksData()

function getCategory(){
  
  tasks.forEach(function(task) {
   
    var category = task.taskCategory.category;


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

 
 

}
function render(){
  getPriority()
  toDoNum = toDoTasks.length;
  progressNum = inProgressTasks.length;
  awitingFeedbackNum = awaitFeedbackTasks.length
  urgent = urgentTasks.length;
  doneNum = doneTasks.length;
  document.getElementById('to-do').innerHTML += `<h1>${toDoNum}</h1>`;
  document.getElementById('progress-task').innerHTML += `<h1>${progressNum}</h1>`;
  document.getElementById('awaiting-task').innerHTML += `<h1>${awitingFeedbackNum}</h1>`;
  document.getElementById('tasks-Done').innerHTML += `<h1>${doneNum}</h1>`;
  document.getElementById('tasks-length').innerHTML +=`<h1>${urgent}</h1>`;

}

function getPriority(){
 
  tasks.forEach(function(task) {
    var priority = task.priority;
  
  
    if (priority === "Urgent") {
      urgentTasks.push(task);
    } 
  })};


function showOverlay(id) {
    document.getElementById('overlay').classList.remove('d-none');
  }
  
 
  function hideOverlay(event) {
    const userCircle = document.getElementById('userCircle');
    const overlay = document.getElementById('overlay');

    if (!userCircle.contains(event.target) && !overlay.classList.contains('d-none')) {
      overlay.classList.add('d-none');
    }
  }
  
 
  document.addEventListener('click', hideOverlay);
