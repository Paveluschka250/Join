async function uploadContactsToFirebase() {
  const databaseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";

  for (const contact of contacts) {
    try {
      const response = await fetch(databaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        await response.json();
      } else {
        console.error(`Fehler beim Hochladen von ${contact.name}:`, response.status);
      }
    } catch (error) {
      console.error(`Fehler beim Hochladen von ${contact.name}:`, error);
    }
  }
}

async function downloadContactsFromFirebase() {
  const databaseUrl = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";

  try {
    const response = await fetch(databaseUrl, {
      method: "GET",
    });
    if (response.ok) {
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