var mongoose=require("mongoose");
var Schema = mongoose.Schema;
//声明Schema
var _Cats = new Schema({
    name:String,
    catname:String
});
//构建model
var pmodel=mongoose.model('cats', _Cats);
// entity.save();
exports.Cat = pmodel;
