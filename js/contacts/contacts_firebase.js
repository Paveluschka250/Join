/**
 * Lädt alle Kontakte in die Firebase-Datenbank hoch
 * Iteriert durch die Kontaktliste und lädt jeden einzeln hoch
 */
async function uploadContactsToFirebase() {
  const databaseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";
  for (const contact of contacts) {
    await uploadContact(databaseUrl, contact);
  }
}

/**
 * Lädt einen einzelnen Kontakt in die Firebase-Datenbank hoch
 * @param {string} databaseUrl - Die URL der Firebase-Datenbank
 * @param {Object} contact - Der hochzuladende Kontakt
 */
async function uploadContact(databaseUrl, contact) {
  try {
    const response = await fetch(databaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error(`Fehler beim Hochladen von ${contact.name}: ${response.status}`);
    }
    await response.json();
  } catch (error) {
    console.error(`Fehler beim Hochladen von ${contact.name}:`, error);
  }
}

/**
 * Lädt alle Kontakte aus der Firebase-Datenbank herunter
 * Verarbeitet die Daten und aktualisiert die lokale Kontaktliste
 * @returns {Array} Ein Array mit allen heruntergeladenen Kontakten
 */
async function downloadContactsFromFirebase() {
  const databaseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";
  try {
    const response = await fetch(databaseUrl, {
      method: "GET",
    });
    if (response.ok) {
      const contactsArray = await processContactsData(response);
      contacts = contactsArray;
      renderContacts(contactsArray);
      return contactsArray;
    } else {
      console.error("Fehler beim Abrufen der Kontakte:", response.status);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontakte:", error);
  }
}

/**
 * Verarbeitet die rohen Kontaktdaten aus Firebase
 * Wandelt das Objekt-Format in ein Array-Format um und fügt IDs hinzu
 * @param {Response} response - Die Firebase-API-Antwort
 * @returns {Array} Ein Array mit verarbeiteten Kontakten
 */
async function processContactsData(response) {
  const contactsData = await response.json();
  const contactsArray = [];
  if (contactsData) {
    for (const contactId in contactsData) {
      contactsArray.push({
        id: contactId, 
        ...contactsData[contactId],
      });
    }
  }
  return contactsArray;
}

/**
 * Aktualisiert einen bestehenden Kontakt in Firebase
 * @param {string} contactId - Die ID des zu aktualisierenden Kontakts
 * @param {Object} updatedContact - Die aktualisierten Kontaktdaten
 * @returns {Object} Die Antwort von Firebase nach dem Update
 */
async function updateContactInFirebase(contactId, updatedContact) {
  const databaseUrl = `https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts/${contactId}.json`;
  try {
    const response = await fetch(databaseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedContact),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
    throw error;
  }
}

/**
 * Löscht einen Kontakt aus der Firebase-Datenbank
 * @param {string} contactId - Die ID des zu löschenden Kontakts
 */
async function deleteContactFromFirebase(contactId) {
  const databaseUrl = `https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts/${contactId}.json`;
  try {
    const response = await fetch(databaseUrl, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
    throw error;
  }
}

/**
 * Fügt einen neuen Kontakt zur Firebase-Datenbank hinzu
 * @param {Object} newContact - Der neue Kontakt der hinzugefügt werden soll
 * @returns {Object} Der hinzugefügte Kontakt mit der von Firebase generierten ID
 */
async function addContactToFirebase(newContact) {
  const databaseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";
  try {
    const response = await fetch(databaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { ...newContact, id: data.name };
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts:", error);
    throw error;
  }
} 