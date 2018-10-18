import axios from 'axios'
const nameInput=document.getElementById('nameInput')
const pwdInput=document.getElementById('pwdInput')
const registerbtn=document.getElementById('registerbtn')
registerbtn.onclick=register

function register() {
    const username=nameInput.value
    const password=pwdInput.value
    axios.post('/register',{
        username,
        password
    }).then(res=>{
        showDialog(res.data)
    })
}
function showDialog(message) {
    let dialog = document.getElementById("dialog")
    dialog.style.display="flex"
    dialog.innerHTML = message
    setTimeout(function () {
        dialog.style.display="none"
    }, 1500)
}