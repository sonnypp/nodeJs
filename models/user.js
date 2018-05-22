
var monngoose = require("mongoose");
var Schema = monngoose.Schema;

//声明Schema 

var _User = new Schema({
    name:String,
    password:String,
    pic:String
});

//构建模型
var pmodel = monngoose.model('user',_User);
exports.User = pmodel;