function openAddTaskSidebar() {
    let sideBar = document.getElementById('addTaskSidebar');
    sideBar.classList.add('open-add-task-sidebar');
    setTimeout(removeDNone(sideBar), 500);
}

function closeAddSideBar() {
    let sideBar = document.getElementById('addTaskSidebar');
    sideBar.classList.remove('open-add-task-sidebar');
    setTimeout(dNone(sideBar), 500);
}

function dNone(element) {
    element.classList.add('d-none')
}

function removeDNone (element) {
    element.classList.remove('d-none');
}