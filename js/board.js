function toggleHamburgerMenu() {
    document.getElementById("addtask-content").classList.toggle('hamburger-menu');
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
    if (prioColor === 'prio1-color') {
        red.classList.add('prio1-color');
        orange.classList.remove('prio2-color');
        green.classList.remove('prio3-color');
    } else if (prioColor === 'prio2-color') {
        red.classList.remove('prio1-color');
        orange.classList.add('prio2-color');
        green.classList.remove('prio3-color');
    } else if (prioColor === 'prio3-color') {
        red.classList.remove('prio1-color');
        orange.classList.remove('prio2-color');
        green.classList.add('prio3-color');
    }
}

