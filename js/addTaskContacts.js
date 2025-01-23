
/**
 * Wählt einen Kontakt aus oder entfernt die Auswahl
 * @param {string} selectedValue - Der ausgewählte Kontaktwert
 */
function selectContacts(selectedValue) {
    let selectedContacts = document.getElementById('selected-contacts');
  
    if (selectedValue) {
      let splitName = selectedValue.split(" ");
      let initials = splitName.length > 1
        ? `${splitName[0][0].toUpperCase()}${splitName[1][0].toUpperCase()}`
        : `${splitName[0][0].toUpperCase()}`;
  
      selectedContacts.innerHTML += `
        <div value="${selectedValue}" class="contact-initials initials-position" style="background-color:${getRandomColor()}">
          ${initials}
        </div>`;
    }
  }
  
  /**
   * Generiert eine zufällige Farbe im HEX-Format
   * @returns {string} HEX-Farbcode
   */
  function getRandomColor() {
    const colors = [
        '#FF5733',
        '#33FF57',
        '#3357FF',
        '#FF33A8',
        '#FFD133',
        '#33FFF0',
        '#8E44AD',
        '#E74C3C'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
  
  /**
   * Erstellt eine HTML-Option für einen Kontakt
   * @param {Object} contact - Der Kontakt-Datensatz
   * @returns {string} HTML-String für die Kontakt-Option
   */
  function createContactOption(contact) {
      return `
          <div class="option" onclick="event.stopPropagation(); selectContact('${contact.id}')">
              <span>${contact.name}</span>
              <input type="checkbox" 
                     id="contact-${contact.id}" 
                     ${contact.selected ? 'checked' : ''}
                     onclick="event.stopPropagation(); toggleContact('${contact.id}')"
              >
          </div>
      `;
  }
  
  /**
   * Schaltet die Auswahl eines Kontakts um
   * @param {string} contactId - Die ID des Kontakts
   */
  function toggleContact(contactId) {
      const checkbox = document.getElementById(`contact-${contactId}`);
      const isChecked = checkbox.checked;
      // Hier die Logik für die Kontaktauswahl implementieren
  }
  
  /**
   * Schaltet die Sichtbarkeit eines Dropdown-Menüs um
   * @param {string} dropdownId - Die ID des Dropdown-Elements
   */
  function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const arrow = dropdown.parentElement.querySelector('.select-arrow');
  
    if (dropdownId === 'contacts-dropdown' && dropdown.style.display !== 'block') {
      getUsersToAssignedTo();
    }
  
    const isOpen = dropdown.style.display === 'block';
  
    if (isOpen) {
      dropdown.style.animation = 'slideUp 0.3s ease-out';
      dropdown.addEventListener('animationend', function() {
        dropdown.style.display = 'none';
        dropdown.style.animation = '';
      }, {once: true});
    } else {
      dropdown.style.animation = 'slideDown 0.3s ease-out';
      dropdown.style.display = 'block';
    }
  
    if (arrow) {
      arrow.style.transform = isOpen
        ? 'translateY(-50%) rotate(0deg)'
        : 'translateY(-50%) rotate(180deg)';
    }
  }
  
  /**
   * Wählt eine Option aus einem Select-Element aus
   * @param {string} selectId - Die ID des Select-Elements
   * @param {string} value - Der auszuwählende Wert
   */
  function selectOption(selectId, value) {
    document.getElementById(`${selectId}-selected`).textContent = value;
    document.getElementById(`${selectId}-dropdown`).style.display = 'none';
  }
  
  document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.custom-select-dropdown');
    dropdowns.forEach(dropdown => {
      const wrapper = dropdown.closest('.custom-select-wrapper');
      if (!wrapper.contains(e.target) && dropdown.style.display === 'block') {
        dropdown.style.animation = 'slideUp 0.3s ease-out';
        dropdown.addEventListener('animationend', function() {
          dropdown.style.display = 'none';
          dropdown.style.animation = '';
        }, {once: true});
  
        const arrow = wrapper.querySelector('.select-arrow');
        if (arrow) {
          arrow.style.transform = 'translateY(-50%) rotate(0deg)';
        }
      }
    });
  });