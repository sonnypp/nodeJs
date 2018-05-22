
var mongoose = require('mongoose');

var db  = mongoose.connect('mongodb://localhost/chihuo');
var Schema = mongoose.Schema; //创建模型

var userSchema = new Schema({
    name:String,
    password:String
}); //定义一个新的模型，但是此模式还未与users集合有关联

exports.user = mongoose.model('users',userSchema); //与users集合关联

