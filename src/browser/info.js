import axios from 'axios';
let $ = function (id) { return document.getElementById(id); };

const posterUrl = location.search.split('=')[1];
let posterObj = {};
axios.get('/info', {
    params: {
        posterURL: posterUrl
    }
}).then(res => {
    posterObj = res.data;
    $('posterImg').src = posterObj.url;
    $('author').innerText = '海报作者：' + posterObj.author;
    $('date').innerText = '发布日期：' + posterObj.date;
    $('star').innerText = '点赞数：' + posterObj.star;
    repaintTagPool();
});

function repaintTagPool() {
    const tagPoolEL = $('tags');
    while (tagPoolEL.hasChildNodes()) {
        tagPoolEL.removeChild(tagPoolEL.firstChild);
    }
    for (const tag of posterObj.tag) {
        let tagEL = document.createElement('div');
        tagEL.innerText = tag;
        tagEL.className = 'tag';
        tagPoolEL.appendChild(tagEL);
    }
    let addTagEL = document.createElement('div');
    addTagEL.className = 'tag';
    addTagEL.innerText = '➕';
    tagPoolEL.appendChild(addTagEL);
    addTagEL.onclick = function () {
        let inputTagEL = document.createElement('input');
        inputTagEL.type = 'text';
        inputTagEL.className = 'tag';
        inputTagEL.onkeydown = function () {
            var e = window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                if (inputTagEL.value && posterObj.tag.indexOf(inputTagEL.value) < 0) {
                    posterObj.tag.push(inputTagEL.value);
                    axios.post('addTag',{
                        posterURL:posterUrl,
                        tag:posterObj.tag
                    });

                }
                repaintTagPool();
            }

        };
        tagPoolEL.removeChild(addTagEL);
        tagPoolEL.appendChild(inputTagEL);
        tagPoolEL.appendChild(addTagEL);
        inputTagEL.autofocus = 'autofocus';
    };
}