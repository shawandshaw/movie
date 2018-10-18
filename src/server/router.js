const Router = require('koa-router');
const db=require('./database')
const Model=db.Model


const router=new Router()

router.get('/',ctx=>{
    ctx.response.redirect('/home.html')
})
router.post('/register',register)
router.post('/login',login)

async function register(ctx){
    let payload=ctx.request.body
    let doc=await Model.findOne({ username: payload.username })
    if(doc==null){
        let user=new Model(payload)
        await user.save()
        ctx.body='register successfully'
    }else{
        ctx.body='username already exsits'
    }
}

async function login(ctx){
    let user=ctx.request.body
    let doc=await Model.findOne({ username: user.username })
    if(doc==null){
        ctx.body='username not exsits'
    }else if (doc.password==user.password){
        ctx.body='login successfully'
    }else{
        ctx.body='wrong password'
    }
}
module.exports=router
