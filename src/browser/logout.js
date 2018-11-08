import axios from 'axios';
let $=function(id) {
    return document.getElementById(id);
};
$('logoutbtn').onclick=function () {
    axios.get('/logout');
};


