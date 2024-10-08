const contacts = [
    {
      name: "Max Mustermann",
      email: "max.mustermann@example.com",
      phoneNumber: "+49 171 1234567"
    },
    {
      name: "Erika Musterfrau",
      email: "erika.musterfrau@example.com",
      phoneNumber: "+49 171 2345678"
    },
    {
      name: "Hans Meier",
      email: "hans.meier@example.com",
      phoneNumber: "+49 171 3456789"
    },
    {
      name: "Anna Schmidt",
      email: "anna.schmidt@example.com",
      phoneNumber: "+49 171 4567890"
    },
    {
      name: "Peter Müller",
      email: "peter.mueller@example.com",
      phoneNumber: "+49 171 5678901"
    },
    {
      name: "Julia Schneider",
      email: "julia.schneider@example.com",
      phoneNumber: "+49 171 6789012"
    },
    {
      name: "Thomas Weber",
      email: "thomas.weber@example.com",
      phoneNumber: "+49 171 7890123"
    },
    {
      name: "Sabine Fischer",
      email: "sabine.fischer@example.com",
      phoneNumber: "+49 171 8901234"
    },
    {
      name: "Klaus Wagner",
      email: "klaus.wagner@example.com",
      phoneNumber: "+49 171 9012345"
    },
    {
      name: "Martina Becker",
      email: "martina.becker@example.com",
      phoneNumber: "+49 171 0123456"
    }
  ];


document.addEventListener('DOMContentLoaded', function () {
    renderContacts(contacts);
});

function renderContacts(contacts) {
    const contactsList = document.getElementById('contacts-list');
    let currentLetter = '';
    let htmlContent = '';

    // Kontakte alphabetisch sortieren
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    for (let contact of contacts) {
        const firstLetter = contact.name.charAt(0).toUpperCase();

        // Neue Buchstabenüberschrift hinzufügen
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            htmlContent += `<div class="contact-group">
                                <b>${currentLetter}</b>
                            </div>
                            <div class="contact-line">
                            </div>`;
        }

        // Kontakt-Element erstellen
        htmlContent += `<div class="contact-item">
                            <div class="avatar" style="background-color: ${getRandomColor()};">${contact.name.charAt(0)}</div>
                            <div class="contact-details">
                                <span class="name">${contact.name}</span>
                                <span class="email">${contact.email}</span>
                            </div>
                        </div>`;
    }

    // Füge den generierten HTML-Inhalt in die Kontakte-Liste ein
    contactsList.innerHTML = htmlContent;
}

function getRandomColor() {
    const colors = ['#4285f4', '#db4437', '#f4b400', '#0f9d58', '#ab47bc', '#ff7043'];
    return colors[Math.floor(Math.random() * colors.length)];
}
