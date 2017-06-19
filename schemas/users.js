var mongoose = require('mongoose');

//用户表结构
//module对外提供
module.exports = new mongoose.Schema({
    //用户名
    username:String,
    //密码
    password:String,
    //是否为管理员
    isAdmin:{
        type:Boolean,
        default:false
    },
    //收藏
    save_:{
        type:Array,
        default:[]
    },
    like_:{
        type: Array,
        default:[]
    }
})