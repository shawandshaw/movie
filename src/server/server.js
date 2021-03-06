const fs = require('fs');
const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const router = require('./router');
require('./database');
const session = require('koa-session');
const app = new Koa();
const koaBody = require('koa-body');

app.keys = ['shaw\'s secret'];

const CONFIG = require('./sessioncfg');
app.use(session(CONFIG, app));


app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 2000 * 1024 * 1024	// 设置上传文件大小最大限制，默认20M
    }
}));



// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`); //eslint-disable-line
});




// static
let uploadDir = path.join('./dist/upload/');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const staticDir = serve(path.join('./dist'));
app.use(staticDir);




// router

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000);
console.log('server is running at "localhost:3000"'); //eslint-disable-line