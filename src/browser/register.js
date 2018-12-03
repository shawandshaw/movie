import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
const nameInput = document.getElementById('nameInput');
const pwdInput = document.getElementById('pwdInput');
const registerbtn = document.getElementById('registerbtn');
registerbtn.onclick = register;
pwdInput.onkeydown = function () {
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        register();
    }

};

function register() {
    const username = nameInput.value;
    let password = pwdInput.value;
    const salt=SHA256(Math.floor(Math.random()*10000)).toString();
    password=SHA256(password).toString();
    axios.post('/register', {
        username,
        salt,
        password
    }).then(res => {
        alert(res.data);
    });
}