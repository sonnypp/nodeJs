
var mongoose=require("mongoose");
var Schema = mongoose.Schema;
//声明Schema
var _person = new Schema({
    name:{type:String,unique:true},
    password:{type:String},
    avtor:{type:String,default:"/images/touxiang/Koala.jpg"},
    friend:{type:Array,default:[]},
    isDelete:{type:Boolean,default:false}
});
//构建model
var pmodel=mongoose.model('person', _person);
// entity.save();
exports.Person = pmodel;