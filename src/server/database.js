let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('成功连接数据库');
});

//创建Schema
let userSchema = mongoose.Schema({
  username: String,
  password: String,
  urls:Array
});

//通过Schema创建model，由于是类，所以首字母大写
let UserModel = mongoose.model('User', userSchema);


async function init() {
  let doc = await UserModel.findOne({
    username: ''
  })
  if(!doc){
    let user = new UserModel({
      username:'',
      password:'',
      urls:[]
    })
    await user.save()
  }
}
init()
module.exports = {
  Schema: userSchema,
  Model: UserModel
}