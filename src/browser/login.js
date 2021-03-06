import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
const nameInput = document.getElementById('nameInput');
const pwdInput = document.getElementById('pwdInput');
const loginbtn = document.getElementById('loginbtn');
loginbtn.onclick = login;
pwdInput.onkeydown = function () {
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        login();
    }

};

function login() {
    const username = nameInput.value;
    let password = pwdInput.value;
    password = SHA256(password).toString();
    axios.post('/login', {
        username,
        password
    }).then(res => {
        if (res.data == 'login successfully') window.location.href = '/homeIn.html';
        else alert(res.data); 
    });
}