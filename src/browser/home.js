import {getCookie,deleteCookie} from './cookie'
let $=function(id) {
    return document.getElementById(id)
}
if(getCookie('username')!=null){
    $('loginbtn').innerText="登出"
    $('loginbtn').addEventListener('click',function () {
        deleteCookie('username')
    })
}


