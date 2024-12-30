const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app"
const onlineUser = localStorage.getItem('onlineUser');

// Behalte nur die User Circle Funktionalität
function updateUserCircle() {
    const onlineUser = localStorage.getItem('onlineUser');
    
    if (onlineUser && onlineUser != "Gast") {
        const userGreeting = document.getElementById('username');
        if (userGreeting) {
            userGreeting.innerHTML = onlineUser;
        }
        
        const userCircle = document.getElementById('userCircle');
        if (userCircle) {
            userCircle.innerHTML = '';
            const initial = onlineUser.charAt(0).toUpperCase();
            userCircle.innerHTML = `<h4>${initial}</h4>`;
        }
    }
}

// Overlay Funktionalität
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

// Hauptfunktion für das Laden der Zusammenfassung
async function loadSummary() {
    try {
        // Setze zunächst Standardwerte
        setDefaultValues();
        
        const response = await fetch(`${_URL}/tasks/toDo.json`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Daten');
        }

        const data = await response.json();
        if (!data) {
            return; // Standardwerte bleiben bestehen
        }

        const tasks = Object.values(data);
        
        // Zähle die Tasks nach Kategorie
        const totalTasks = tasks.length;
        const urgentTasks = tasks.filter(task => task.priority === "Urgent").length;
        const todoTasks = tasks.filter(task => task.taskCategory.category === "toDo").length;
        const inProgressTasks = tasks.filter(task => task.taskCategory.category === "inProgress").length;
        const awaitingFeedbackTasks = tasks.filter(task => task.taskCategory.category === "awaitFeedback").length;
        const doneTasks = tasks.filter(task => task.taskCategory.category === "done").length;

        // Finde das früheste Deadline-Datum
        const dates = tasks.map(task => new Date(task.dueDate));
        const earliestDeadline = dates.length > 0 ? new Date(Math.min(...dates)) : null;

        // Aktualisiere die HTML-Elemente
        document.getElementById('tasksInBoard').innerHTML = `<h1>${totalTasks}</h1>`;
        document.getElementById('tasks-length').innerHTML = `<h1>${urgentTasks}</h1>`;
        document.getElementById('to-do').innerHTML = `<h1>${todoTasks}</h1>`;
        document.getElementById('progress-task').innerHTML = `<h1>${inProgressTasks}</h1>`;
        document.getElementById('awaiting-task').innerHTML = `<h1>${awaitingFeedbackTasks}</h1>`;
        document.getElementById('tasks-Done').innerHTML = `<h1>${doneTasks}</h1>`;
        
        // Setze das Deadline-Datum
        document.getElementById('uncomming-Deadline').innerHTML = 
            earliestDeadline ? `<h3>${earliestDeadline.toLocaleDateString()}</h3>` : '<h3>Keine Deadline</h3>';

    } catch (error) {
        console.error('Fehler beim Laden der Zusammenfassung:', error);
        // Standardwerte bleiben bestehen, da sie bereits gesetzt wurden
    }
}

function setDefaultValues() {
    document.getElementById('tasksInBoard').innerHTML = '<h1>0</h1>';
    document.getElementById('tasks-length').innerHTML = '<h1>0</h1>';
    document.getElementById('to-do').innerHTML = '<h1>0</h1>';
    document.getElementById('progress-task').innerHTML = '<h1>0</h1>';
    document.getElementById('awaiting-task').innerHTML = '<h1>0</h1>';
    document.getElementById('tasks-Done').innerHTML = '<h1>0</h1>';
    document.getElementById('uncomming-Deadline').innerHTML = '<h3>Keine Deadline</h3>';
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    updateUserCircle();
    loadSummary();
});
document.addEventListener('click', hideOverlay);
