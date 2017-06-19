var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');

//创建一个模型取名为user
module.exports = mongoose.model('Content',contentsSchema);//Content是ref值