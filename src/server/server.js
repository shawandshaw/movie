const Koa = require('koa');
const serve = require('koa-static');
const path = require('path')
const bodyparser = require('koa-bodyparser')
const router = require('./router')
require('./database')
const app = new Koa();

app.use(bodyparser())



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
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});



// response
console.log(path.join(__dirname, '../../dist'))
const static = serve(path.join('./dist'));
app.use(static);

// router

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000);
console.log('server is running at "localhost:3000"')