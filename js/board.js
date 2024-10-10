function toggleHamburgerMenu() {
    document.getElementById("addtask-content").classList.toggle('hamburger-menu');
    document.getElementById('overlay-add-task-board').classList.toggle('hamburger-menu');
}

function getPriority(id) {
    let buttonRed = document.getElementById('prio1');
    let buttonOrange = document.getElementById('prio2');
    let buttonGreen = document.getElementById('prio3');

    if (id == 'prio1') {
        containsClass('prio1-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'prio2') {
        containsClass('prio2-color', buttonRed, buttonOrange, buttonGreen);
    } else if (id == 'prio3') {
        containsClass('prio3-color', buttonRed, buttonOrange, buttonGreen);
    }
}

function containsClass(prioColor, red, orange, green) {
    let btnIcon1 = document.getElementById('high-prio-icon');
    let btnIcon2 = document.getElementById('medium-prio-icon');
    let btnIcon3 = document.getElementById('low-prio-icon');
    
    if (prioColor === 'prio1-color') {
        red.classList.add('prio1-color');
        btnIcon1.classList.add('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio2-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.add('prio2-color');
        btnIcon2.classList.add('priotity-btn-filter2');
        green.classList.remove('prio3-color');
        btnIcon3.classList.remove('priotity-btn-filter3');
    } else if (prioColor === 'prio3-color') {
        red.classList.remove('prio1-color');
        btnIcon1.classList.remove('priotity-btn-filter1');
        orange.classList.remove('prio2-color');
        btnIcon2.classList.remove('priotity-btn-filter2');
        green.classList.add('prio3-color');
        btnIcon3.classList.add('priotity-btn-filter3');
    }
}