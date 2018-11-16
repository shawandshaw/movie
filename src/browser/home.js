import axios from 'axios';
let $ = function (id) { return document.getElementById(id); };

let originPosterObjs = [];
let posterObjs = [];
let starList=[];
let sortDirection = true;
getPosters();
$('sortByStar').onclick = sortByStar;
$('sortByTime').onclick = sortByTime;
$('filter').onclick = filter;
$('filterInput').onkeydown=function () {
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        filter();
    }
};
$('cancelFilter').onclick = cancelFilter;
$('cancelSort').onclick = cancelSort;

axios.get('http://saweather.market.alicloudapi.com/hour24',{
    headers:{
        'Authorization': 'APPCODE df95a2dde6864f0ea8f2606412a46c4d' 
    },
    params:{
        area: '南京'
    }
}).then(res=>{
    let weatherThisMoment=res.data.showapi_res_body.hourList[0];
    let divEL=document.createElement('div');
    divEL.innerText += (weatherThisMoment.area+','+weatherThisMoment.weather+','+weatherThisMoment.temperature+'℃');
    $('footer').appendChild(divEL);
});



function getPosters() {
    axios.get('/posters').then(res => {
        posterObjs = res.data.posters;
        starList = res.data.starList;
        posterObjs = posterObjs.sort((a, b) => {
            if (a.date > b.date) return -1 ;
            else if (a.date == b.date) return 0 ;
            else return 1;
        });
        originPosterObjs = originPosterObjs.concat(posterObjs);
        repaintList();
    });
}

function sortByStar() {
    posterObjs = posterObjs.sort((a, b) => {
        if (sortDirection) {
            return a.star - b.star;
        } else {
            return b.star - a.star;
        }
    });
    let symbol = sortDirection ? '↑' : '↓';
    $('sortByStar').innerText = '按star排序' + symbol;
    sortDirection = !sortDirection;
    repaintList();
}
function sortByTime() {
    posterObjs = posterObjs.sort((a, b) => {
        let s = sortDirection ? 1 : -1;
        if (a.date > b.date) return 1 * s;
        else if (a.date == b.date) return 0 * s;
        else return -1 * s;
    });
    let symbol = sortDirection ? '↑' : '↓';
    $('sortByTime').innerText = '按时间排序' + symbol;
    sortDirection = !sortDirection;
    repaintList();
}
function repaintList() {
    let posterList = $('posterList');
    while (posterList.hasChildNodes()) {
        posterList.removeChild(posterList.firstChild);
    }
    let promises = [];
    for (let i = 0; i < posterObjs.length; i++) {
        const posterObj = posterObjs[i];
        const liEL = document.createElement('li');
        const imgEL = document.createElement('img');
        const starEL = document.createElement('div');
        const starPicEL = document.createElement('div');
        const dateEL = document.createElement('div');
        const starNumEL = document.createElement('div');
        starEL.poster = posterObj;
        starEL.onclick = starThePic;
        dateEL.innerText = posterObj.date;
        liEL.className = 'card';
        imgEL.className = 'img';
        starEL.className = 'card-footer';
        starPicEL.className = 'blackStar';
        if(starList.indexOf(posterObj.url)>=0)starPicEL.className = 'redStar';
        else starPicEL.className = 'blackStar';
        starEL.appendChild(starPicEL);
        starNumEL.innerText = posterObj.star;
        starEL.appendChild(starNumEL);
        dateEL.className = 'card-footer';
        liEL.appendChild(imgEL);
        liEL.appendChild(starEL);
        liEL.appendChild(dateEL);
        imgEL.onclick=function () {
            window.location.href='/info.html'+'?posterURL='+posterObj.url;
        };
        promises.push(new Promise((resolve, reject) => {
            imgEL.onload = function () {
                resolve(liEL);
            };
            imgEL.onerror = reject;
            imgEL.src = posterObj.url;
        }));
    }
    Promise.all(promises).then(result => {
        for (const liEL of result) {
            posterList.appendChild(liEL);
        }
    });
}
function filter() {
    let condition = $('filterInput').value;
    posterObjs = [];
    for (const poster of originPosterObjs) {
        if (poster.tag.toString().indexOf(condition) >= 0 || poster.date.indexOf(condition) >= 0) posterObjs.push(poster);
    }
    repaintList();
}
function cancelFilter() {
    posterObjs = [];
    posterObjs = posterObjs.concat(originPosterObjs);
    $('filterInput').value = '';
    repaintList();
}
function cancelSort() {
    posterObjs = [];
    $('sortByTime').innerText = '按时间排序';
    $('sortByStar').innerText = '按star排序';
    filter();
}
function starThePic() {
    const starEL = this;
    if(starEL.firstChild.className=='blackStar'){
        axios.get('/star', {
            params: {
                posterURL: starEL.poster.url
            }
        }).then((res) => {
            starEL.poster.star += 1;
            starEL.lastChild.innerText = starEL.poster.star;
            starEL.firstChild.className='redStar';
            starList=res.data;
        });
    }
    
}