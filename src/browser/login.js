import axios from 'axios'
const nameInput=document.getElementById('nameInput')
const pwdInput=document.getElementById('pwdInput')
const loginbtn=document.getElementById('loginbtn')
loginbtn.onclick=login

function login() {
    const username=nameInput.value
    const password=pwdInput.value
    axios.post('/login',{
        username,
        password
    }).then(res=>{
        showDialog(res.data)
        if(res.data=='login successfully')
        window.location.href='/home.html'
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