const path = require('path');
let mongoose = require('mongoose');
let mongoOption = {
    useNewUrlParser: true
};
mongoose.connect('mongodb://localhost/movieSite', mongoOption);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); //eslint-disable-line
db.once('open', function () {
    console.log('成功连接数据库'); //eslint-disable-line
});


//创建Schema
let userSchema = mongoose.Schema({
    username: String,
    password: String,
    urls: Array,
});
let posterSchema = mongoose.Schema({
    url: String,
    date: String,
    star: Number,
    author: String,
    tag: Array
});

//通过Schema创建model，由于是类，所以首字母大写
let UserModel = mongoose.model('User', userSchema);
let PosterModel = mongoose.model('Poster', posterSchema);


async function init() {
    let doc = await UserModel.findOne({
        username: ''
    });
    if (!doc) {
        let user = new UserModel({
            username: '',
            password: '',
            urls: [],
        });
        await user.save();
    }
    let docs = await PosterModel.find({});
    if (docs.length==0) {
        let tagPool = ['喜剧', '人物', '恐怖', '动画', '游戏', '科幻', '英雄', '悲剧', '历史'];
        for (let i = 1; i < 15; i++) {
            let poster = {
                url: '',
                date: '',
                star: 0,
                author: '',
                tag: []
            };
            poster.url = path.join('/upload', 'poster' + i + '.jpg');
            poster.date = new Date().toLocaleString();
            for (let j = 0; j < 3; j++) {
                let index = parseInt(Math.random() * tagPool.length);
                if (poster.tag.toString().indexOf(tagPool[index]) < 0) poster.tag.push(tagPool[index]);
            }
            poster.star = parseInt(Math.random() * 100);
            await new PosterModel(poster).save();
        }
    }


}
init();
module.exports = {
    Schema: userSchema,
    UserModel: UserModel,
    PosterModel: PosterModel
};