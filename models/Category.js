var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');

//创建一个模型取名为categoriesSchema
module.exports = mongoose.model('Category',categoriesSchema);