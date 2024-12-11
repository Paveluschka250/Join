

let users = [
    {
     'email':'yesser@zf.com',
      'password':'test123'
    }
]
function addUser(){
  let username = document.getElementById('benutzername').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let confirmedPw = document.getElementById('passwordConfirm').value;
  users.push({email: email, password: password, username: username});


  if(confirmedPw ===  password && password.length > 4){
    sentDataToDB("/user", {"username":username, "email":email, "password":password});

  }
  else {
    alert('pw');
  }

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



  