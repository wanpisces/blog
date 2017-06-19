var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

//创建一个模型取名为User
module.exports = mongoose.model('User',usersSchema);