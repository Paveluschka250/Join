const _URL =
  "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app";
const onlineUser = localStorage.getItem("onlineUser");

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

function showOverlay(id) {
  document.getElementById("overlay").classList.remove("d-none");
}

function hideOverlay(event) {
  const userCircle = document.getElementById("userCircle");
  const overlay = document.getElementById("overlay");

  if (
    !userCircle.contains(event.target) &&
    !overlay.classList.contains("d-none")
  ) {
    overlay.classList.add("d-none");
  }
}

async function loadSummary() {
  try {
    setDefaultValues();
    const tasks = await fetchTasks();
    if (!tasks) return;

    updateTaskCounts(tasks);
    updateDeadline(tasks);
  } catch (error) {
    console.error("Fehler beim Laden der Zusammenfassung:", error);
  }
}

async function fetchTasks() {
  const response = await fetch(`${_URL}/tasks/toDo.json`);
  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Daten");
  }
  const data = await response.json();
  return data ? Object.values(data) : null;
}

function getTaskCounts(tasks) {
  return {
    total: tasks.length,
    urgent: tasks.filter((task) => task.priority === "Urgent").length,
    todo: tasks.filter((task) => task.taskCategory.category === "toDo").length,
    inProgress: tasks.filter(
      (task) => task.taskCategory.category === "inProgress"
    ).length,
    awaitingFeedback: tasks.filter(
      (task) => task.taskCategory.category === "awaitFeedback"
    ).length,
    done: tasks.filter((task) => task.taskCategory.category === "done").length,
  };
}

function updateTaskCounts(tasks) {
  const counts = getTaskCounts(tasks);

  document.getElementById(
    "tasksInBoard"
  ).innerHTML = `<h1>${counts.total}</h1>`;
  document.getElementById(
    "tasks-length"
  ).innerHTML = `<h1>${counts.urgent}</h1>`;
  document.getElementById("to-do").innerHTML = `<h1>${counts.todo}</h1>`;
  document.getElementById(
    "progress-task"
  ).innerHTML = `<h1>${counts.inProgress}</h1>`;
  document.getElementById(
    "awaiting-task"
  ).innerHTML = `<h1>${counts.awaitingFeedback}</h1>`;
  document.getElementById("tasks-Done").innerHTML = `<h1>${counts.done}</h1>`;
}

function updateDeadline(tasks) {
  const dates = tasks.map((task) => new Date(task.dueDate));
  const earliestDeadline =
    dates.length > 0 ? new Date(Math.min(...dates)) : null;

  document.getElementById("uncomming-Deadline").innerHTML = earliestDeadline
    ? `<h3>${earliestDeadline.toLocaleDateString()}</h3>`
    : "<h3>Keine Deadline</h3>";
}

function setDefaultValues() {
  document.getElementById("tasksInBoard").innerHTML = "<h1>0</h1>";
  document.getElementById("tasks-length").innerHTML = "<h1>0</h1>";
  document.getElementById("to-do").innerHTML = "<h1>0</h1>";
  document.getElementById("progress-task").innerHTML = "<h1>0</h1>";
  document.getElementById("awaiting-task").innerHTML = "<h1>0</h1>";
  document.getElementById("tasks-Done").innerHTML = "<h1>0</h1>";
  document.getElementById("uncomming-Deadline").innerHTML =
    "<h3>Keine Deadline</h3>";
}

document.addEventListener("DOMContentLoaded", () => {
  updateUserCircle();
  loadSummary();
});
document.addEventListener("click", hideOverlay);
