/**
 * Prüft ob der Benutzer eingeloggt ist
 */
function isLoggedIn() {
    return localStorage.getItem('onlineUser') !== null;
}

/**
 * Behandelt den Logout-Prozess
 */
function handleLogout() {
    // Lösche alle Login-Daten
    localStorage.clear();
    sessionStorage.clear();

    // Lösche Browser-Historie
    window.history.replaceState(null, '', '../index.html');
    
    // Verhindere Zurücknavigation
    window.location.replace('../index.html');
}

/**
 * Sicherer Zurück-Button
 */
function safeGoBack() {
    if (!isLoggedIn()) {
        window.location.replace('../index.html');
        return;
    }
    window.history.back();
}

// Prüfe Login-Status bei Navigation
window.addEventListener('popstate', function() {
    if (!isLoggedIn()) {
        window.location.replace('../index.html');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        window.location.replace('../index.html');
    }
}); 