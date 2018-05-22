
var mongoose=require("mongoose");
var Schema = mongoose.Schema;
//声明Schema
var _Content = new Schema({
    name: String,
    title:String,
    titlePic:String,
    text:String,
    content:String,
    time:String,
    cat:String,
    click:Number
});
//构建model
var pmodel=mongoose.model('content', _Content);
// entity.save();
exports.Content = pmodel;