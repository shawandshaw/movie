import axios from 'axios';
import echarts from 'echarts';
import 'babel-polyfill';

workFlow();

async function getPosters(){
    let res=await axios.get('/posters');
    return res;
}
async function workFlow(){
    let tagCount={};
    let res=await getPosters();
    let posters=res.data.posters;
    for (const p of posters) {
        for (const tagName of p.tag) {
            if(tagCount[tagName])tagCount[tagName]+=p.star;
            else tagCount[tagName]=p.star;
        }
    }
    let maxStar=0;
    for (const key in tagCount) {
        if (tagCount.hasOwnProperty(key)) {
            maxStar =tagCount[key]>maxStar? tagCount[key]:maxStar;
        }
    }
    maxStar = parseInt(1.2*maxStar);
    let option = {
        tooltip: {},
        title: [{
            text: '各标签获赞数',
            subtext: '总计 ' + Object.keys(tagCount).reduce(function (all, key) {
                return all + tagCount[key];
            }, 0),
            x: '25%',
            textAlign: 'center'
        }, {
            text: '饼图',
            subtext: '总计 ' + Object.keys(tagCount).reduce(function (all, key) {
                return all + tagCount[key];
            }, 0),
            x: '75%',
            textAlign: 'center'
        }],
        grid: [{
            top: 50,
            width: '50%',
            bottom: '0',
            left: 10,
            containLabel: true
        }],
        xAxis: [{
            type: 'value',
            max: maxStar,
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'category',
            data: Object.keys(tagCount),
            axisLabel: {
                interval: 0,
                rotate: 30
            },
            splitLine: {
                show: false
            }
        }],
        series: [{
            type: 'bar',
            stack: 'chart',
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            data: Object.keys(tagCount).map(function (key) {
                return tagCount[key];
            })
        }, {
            type: 'bar',
            stack: 'chart',
            silent: true,
            itemStyle: {
                normal: {
                    color: '#eee'
                }
            },
            data: Object.keys(tagCount).map(function (key) {
                return maxStar - tagCount[key];
            })
        },{
            type: 'pie',
            radius: [0, '40%'],
            center: ['75%', '50%'],
            data: Object.keys(tagCount).map(function (key) {
                return {
                    name: key.replace('.js', ''),
                    value: tagCount[key]
                };
            })
        }]
    };
    let myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(option);
}






