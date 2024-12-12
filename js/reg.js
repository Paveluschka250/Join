

let users = [
    {
     'email':'yesser@zf.com',
      'password':'test123'
    }
]
function addUser() {
  let username = document.getElementById('benutzername').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let confirmedPw = document.getElementById('passwordConfirm').value;
  let messageContainer = document.getElementById('message-container');
  messageContainer.innerHTML = '';
  document.getElementById('benutzername').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('passwordConfirm').value = '';
  if (confirmedPw === password && password.length > 4) {
    sentDataToDB("/user", { username: username, email: email, password: password });
  } else {
    displayErrorMessage(messageContainer, 'Passwörter stimmen nicht überein oder sind zu kurz!');
  }
}

function displayErrorMessage(container, message) {

  let errorDiv = document.createElement('div');
  errorDiv.textContent = message;
  errorDiv.style.color = 'white';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.padding = '10px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.marginTop = '10px';
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '10px';
  errorDiv.style.right = '10px';
  errorDiv.style.transition = 'transform 0.5s ease-in-out';
  errorDiv.style.transform = 'translateX(100%)';
  container.appendChild(errorDiv);
  setTimeout(() => {
    errorDiv.style.transform = 'translateX(0)';
  }, 100);
  setTimeout(() => {
    errorDiv.style.transform = 'translateX(100%)';
    setTimeout(() => {
      errorDiv.remove();
    }, 500);
  }, 5000);
}



const _URL = "https://yesserdb-a0a02-default-rtdb.europe-west1.firebasedatabase.app";

 
  async function sentDataToDB(path="", data={}) {

    try {
      const response = await fetch( _URL + path + ".json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
         body:JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Fehler beim Schreiben der Benutzerdaten');
      }
    window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';

    } catch (error) {
      console.error('Error:', error);
      alert('Error registering user: ' + error.message);
    }
  }



  