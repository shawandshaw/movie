import axios from 'axios';
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
    const password = pwdInput.value;
    axios.post('/register', {
        username,
        password
    }).then(res => {
        alert(res.data);
    });
}