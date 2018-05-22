
const express = require('express');
const router = express.Router();
var mongoose = require("../models/db");
var user = require("../models/user");

exports.user=function(req,res){
    res.render('userCenter',{
        username:req.session.username,
        password:req.session.password,
        // imgUrl:imgUrl
    });
};

exports.userUpdate = function(req,res){
    var query = {name:req.session.username};
    user.User.update(query,{$set:{name:req.body.name,password:req.body.pwd}},function(err,doc){
        req.session.username = req.body.name;
        res.send("修改成功！返回到<a href='/blog/detail'>微博首页</a>");
    });
};