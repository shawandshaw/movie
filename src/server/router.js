const Router = require('koa-router');
const db = require('./database');
const fs = require('fs');
const path = require('path');
const Model = db.Model;



const router = new Router();

router.get('/', ctx => {
    ctx.response.redirect('/home.html');
});
router.post('/register', register);
router.post('/login', login);
router.post('/upload',handleUpload);
router.get('/myPics',getPics);

async function register(ctx) {
    let payload = ctx.request.body;
    let doc = await Model.findOne({
        username: payload.username
    });
    if (doc == null) {
        payload.urls=[];
        let user = new Model(payload);
        await user.save();
        ctx.body = 'register successfully';
    } else {
        ctx.body = 'username already exsits';
    }
}

async function login(ctx) {
    let user = ctx.request.body;
    let doc = await Model.findOne({
        username: user.username
    });
    if (doc == null) {
        ctx.body = 'username not exsits';
    } else if (doc.password == user.password) {
        ctx.body = 'login successfully';
        ctx.cookies.set('username',new Buffer(user.username).toString('base64'),{
            domain:'localhost', // 写cookie所在的域名
            path:'/',       // 写cookie所在的路径
            maxAge: 24*60*60,   // cookie有效时长
            httpOnly:false,  // 是否只用于http请求中获取
            overwrite:true  // 是否允许重写
        });
    } else {
        ctx.body = 'wrong password';
    }
}
async function getPics(ctx) {
    let cookieName=ctx.cookies.get('username');
    let username='';
    if(cookieName)username=new Buffer(cookieName,'base64').toString();
    let doc = await Model.findOne({
        username: username
    });
    if(doc)ctx.body=doc.urls;
    else ctx.body=[];
}
async function handleUpload(ctx) {
    const pics = ctx.request.files.pics;
    let cookieName=ctx.cookies.get('username');
    let username='';
    if(cookieName)username=new Buffer(cookieName,'base64').toString();
    const static_dir='./dist';
    let userDir=path.join(static_dir,'/upload/',username);
    if(!fs.existsSync(userDir))fs.mkdirSync(userDir);
    let urls=[];
    if(pics instanceof Array){
        for (const file of pics) {
            const reader = fs.createReadStream(file.path);
            const filePath=path.join(userDir,file.name);
            const stream = fs.createWriteStream(filePath);
            urls.push(path.join('/upload',username,file.name));
            reader.pipe(stream);
            console.log('uploading %s -> %s', file.name, stream.path); //eslint-disable-line
        }
    }else{
        let file=pics;
        if(file.name=='blob'){
            let myDate = Date.now();
            file.name=username+myDate+'.png';
        }
        const reader = fs.createReadStream(file.path);
        const filePath=path.join(userDir,file.name);
        const stream = fs.createWriteStream(filePath);
        urls.push(path.join('/upload',username,file.name));
        reader.pipe(stream);
        console.log('uploading %s -> %s', file.name, stream.path);//eslint-disable-line
    }

    let doc = await Model.findOne({
        username: username
    });
    let newUrls=doc.urls.concat(urls);
    let conditions = {username: username};
    let updates = {$set: {urls: newUrls}};
    Model.update(conditions, updates, function (error) {
        if (error) {
            console.error(error);//eslint-disable-line
        } else {
            console.error('更新成功');//eslint-disable-line
        }
    });
    ctx.body=urls;
}
module.exports = router;