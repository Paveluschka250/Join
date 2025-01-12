/**
 * @fileoverview Dashboard-Übersichtsmodul für die Anzeige und Verwaltung von Task-Statistiken
 * @author ElStephano, yesser ben amor
 * @version 2.0.0
 */

/**
 * Basis-URL für die Firebase Realtime Database
 * @constant {string}
 */
const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Name des aktuell eingeloggten Benutzers aus dem LocalStorage
 * @constant {string}
 */
const onlineUser = localStorage.getItem('onlineUser');

/**
 * Task-Management Variablen
 * @type {Object[]} tasks - Alle Tasks aus der Datenbank
 * @type {string[]} datsArray - Sortierte Fälligkeitsdaten
 * @type {string} deadline - Nächste Deadline
 * @type {number} tasksInBoard - Gesamtanzahl der Tasks
 */
let tasks = [];
let datsArray = [];
let deadline;
let tasksInBoard;

/**
 * Task-Kategorien Arrays
 * @type {Object[]} awaitFeedbackTasks - Tasks die auf Feedback warten
 * @type {Object[]} inProgressTasks - Tasks in Bearbeitung
 * @type {Object[]} toDoTasks - Noch nicht begonnene Tasks
 * @type {Object[]} doneTasks - Abgeschlossene Tasks
 * @type {Object[]} urgentTasks - Dringende Tasks
 */
let awaitFeedbackTasks = [];
let inProgressTasks = [];
let toDoTasks = [];
let doneTasks = [];
let urgentTasks = [];

/**
 * Task-Zähler
 * @type {number} toDoNum - Anzahl der Todo-Tasks
 * @type {number} progressNum - Anzahl der Tasks in Bearbeitung
 * @type {number} awitingFeedbackNum - Anzahl der Tasks die auf Feedback warten
 * @type {number} doneNum - Anzahl der abgeschlossenen Tasks
 * @type {number} urgent - Anzahl der dringenden Tasks
 */
let toDoNum;
let progressNum;
let awitingFeedbackNum;
let doneNum;
let urgent;

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    updateUserCircle();
    getTasksData();
});

/**
 * Aktualisiert den Benutzerkreis und die Benutzerbegrüßung in der UI
 * @returns {void}
 */
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

/**
 * Ruft die Task-Daten von der Firebase-Datenbank ab
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Wenn die Daten nicht abgerufen werden können
 */
async function getTasksData() {
    try {
        const response = await fetch(_URL + "/tasks/toDo.json");
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Daten');
        }
        const data = await response.json();
        tasks = Object.values(data);
        
        // Extrahiere und sortiere Fälligkeitsdaten
        datsArray = tasks.map(task => task.dueDate).sort((a, b) => new Date(a) - new Date(b));
        
        deadlineRender();
        getCategory();
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user data: ' + error.message);
        return null;
    }
}

/**
 * Rendert die Deadline und Board-Informationen
 * @returns {void}
 */
function deadlineRender() {
    deadline = datsArray[0];
    tasksInBoard = tasks.length;
    
    document.getElementById('uncomming-Deadline').innerHTML = `<h3>${deadline}</h3>`;
    document.getElementById('tasksInBoard').innerHTML = `<h1>${tasksInBoard}</h1>`;
}

/**
 * Kategorisiert Tasks nach ihrem Status
 * @returns {void}
 */
function getCategory() {
    // Arrays zurücksetzen
    awaitFeedbackTasks = [];
    inProgressTasks = [];
    toDoTasks = [];
    doneTasks = [];
    
    tasks.forEach(task => {
        switch(task.taskCategory.category) {
            case "awaitFeedback":
                awaitFeedbackTasks.push(task);
                break;
            case "inProgress":
                inProgressTasks.push(task);
                break;
            case "toDo":
                toDoTasks.push(task);
                break;
            case "done":
                doneTasks.push(task);
                break;
        }
    });
    render();
}

/**
 * Aktualisiert die UI mit den Task-Statistiken
 * @returns {void}
 */
function render() {
    getPriority();
    toDoNum = toDoTasks.length;
    progressNum = inProgressTasks.length;
    awitingFeedbackNum = awaitFeedbackTasks.length;
    doneNum = doneTasks.length;
    urgent = urgentTasks.length;
    
    document.getElementById('to-do').innerHTML = `<h1>${toDoNum}</h1>`;
    document.getElementById('progress-task').innerHTML = `<h1>${progressNum}</h1>`;
    document.getElementById('awaiting-task').innerHTML = `<h1>${awitingFeedbackNum}</h1>`;
    document.getElementById('tasks-Done').innerHTML = `<h1>${doneNum}</h1>`;
    document.getElementById('tasks-length').innerHTML = `<h1>${urgent}</h1>`;
}

/**
 * Identifiziert dringende Tasks
 * @returns {void}
 */
function getPriority() {
    urgentTasks = tasks.filter(task => task.priority === "Urgent");
}

/**
 * Overlay-Management
 */
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

// Event-Listener für Overlay
document.addEventListener('click', hideOverlay);
