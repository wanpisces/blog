/**
 * Created by php on 2016/12/26.
 */
var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({
    //分类名
    name:String,
})