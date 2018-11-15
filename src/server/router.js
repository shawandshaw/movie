const Router = require('koa-router');
const db =require('./database');
const fs = require('fs');
const path = require('path');
const UserModel=db.UserModel;
const PosterModel=db.PosterModel;


const router = new Router();

router.get('/', ctx => {
    if (ctx.session.isSigned) {
        ctx.response.redirect('/homeIn.html');
    }
    else ctx.response.redirect('/home.html');
});
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/uploadToLib', handleUpload);
router.post('/uploadToProfile', handleUploadProfile);
router.get('/myPics', getPics);
router.get('/posters', getPosters);
router.get('/star', starThePic);

async function register(ctx) {
    let payload = ctx.request.body;
    let doc = await UserModel.findOne({
        username: payload.username
    });
    if (doc == null) {
        let userData = {
            username: payload.username,
            password: payload.password,
            urls: [],
            posters: []
        };
        payload.urls = [];
        let user = new UserModel(userData);
        await user.save();
        ctx.body = 'register successfully';
    } else {
        ctx.body = 'username already exsits';
    }
}

async function login(ctx) {
    let user = ctx.request.body;
    let doc = await UserModel.findOne({
        username: user.username
    });
    if (doc == null) {
        ctx.body = 'username not exsits';
    } else if (doc.password == user.password) {
        ctx.body = 'login successfully';
        ctx.session.username = user.username;
        ctx.session.isSigned = true;
    } else {
        ctx.body = 'wrong password';
    }
}

async function logout(ctx) {
    ctx.session.isSigned = false;
    ctx.body = 'logout';
}
async function getPics(ctx) {
    let username = '';
    if (ctx.session.username) username = ctx.session.username;
    let doc = await UserModel.findOne({
        username: username
    });
    if (doc) ctx.body = doc.urls;
    else ctx.body = [];
}
async function getPosters(ctx) {
    let posters = [];
    posters = await PosterModel.find({});
    if (!ctx.session.starList) ctx.session.starList = [];
    let resData = {
        posters: posters,
        starList: ctx.session.starList
    };
    ctx.body = resData;
}
async function handleUpload(ctx) {
    const pics = ctx.request.files.pics;
    let username = '';
    if (ctx.session.username) username = ctx.session.username;
    const static_dir = './dist';
    let userDir = path.join(static_dir, '/upload/', username);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);
    let urls = [];
    if (pics instanceof Array) {
        for (const file of pics) {
            const reader = fs.createReadStream(file.path);
            const filePath = path.join(userDir, file.name);
            const stream = fs.createWriteStream(filePath);
            urls.push(path.join('/upload', username, file.name));
            reader.pipe(stream);
            console.log('uploading %s -> %s', file.name, stream.path); //eslint-disable-line
        }
    } else {
        let file = pics;
        if (file.name == 'blob') {
            let myDate = Date.now();
            file.name = username + myDate + '.png';
        }
        const reader = fs.createReadStream(file.path);
        const filePath = path.join(userDir, file.name);
        const stream = fs.createWriteStream(filePath);
        urls.push(path.join('/upload', username, file.name));
        reader.pipe(stream);
        console.log('uploading %s -> %s', file.name, stream.path);//eslint-disable-line
    }

    let doc = await UserModel.findOne({
        username: username
    });
    let newUrls = doc.urls.concat(urls);
    let conditions = { username: username };
    let updates = { $set: { urls: newUrls } };
    UserModel.updateOne(conditions, updates, function (error) {
        if (error) {
            console.error(error);//eslint-disable-line
        } else {
            console.error('更新成功');//eslint-disable-line
        }
    });
    ctx.body = urls;
}

async function handleUploadProfile(ctx) {
    const pics = ctx.request.files.pics;
    let username = '';
    const static_dir = './dist';
    let userDir = path.join(static_dir, '/upload/', username);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);
    let poster = {};
    let file = pics;
    if (file.name == 'blob') {
        let myDate = Date.now();
        file.name = username + myDate + '.png';
    }
    const reader = fs.createReadStream(file.path);
    const filePath = path.join(userDir, file.name);
    const stream = fs.createWriteStream(filePath);
    poster.url = (path.join('/upload', username, file.name));
    poster.date = new Date().toLocaleString();
    poster.star = 0;
    poster.tag = ctx.request.query.tag.replace(/，|;|；/g, ',').split(',');
    reader.pipe(stream);
    console.log('uploading %s -> %s', file.name, stream.path);//eslint-disable-line

    await new PosterModel(poster).save();
    ctx.body = '上传成功';
}
async function starThePic(ctx) {
    let query = ctx.request.query;
    let posters = await PosterModel.find({});
    for (const poster of posters) {
        if (poster.url == query.posterURL) {
            let res =await PosterModel.updateOne({url:poster.url},{$set:{star:poster.star+1}});
            if (!res.ok) {
                console.error(res);//eslint-disable-line
                ctx.body = 'star Failed!';
            } else {
                if (!ctx.session.starList) ctx.session.starList = [];
                ctx.session.starList.push(query.posterURL);
                ctx.body = ctx.session.starList;
                console.error('更新成功');//eslint-disable-line
            }
            break;
        }
    }
}
module.exports = router;