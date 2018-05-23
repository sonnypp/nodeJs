//发布新闻的模型
var mongoose = require("mongoose");
var Schame = mongoose.Schema;
//声明Schame

var _New=new Schame({
    title:{type:String},
    content:{type:String},
    u_id:{type:String},
    publishTime:{type:Date,default:Date.now},
    updateTime:{type:Date,default:Date.now},
    isShare:{type:Boolean,default:true}
});

//构建模型
var pmodel = mongoose.model('new',_New);

exports.New = pmodel;
